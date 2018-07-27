=begin
module ActionView
  module Context
    attr_reader :virtual_path
  end
end

module ActionView
  class PartialRenderer < AbstractRenderer
    def find_template(path, locals)
      @lookup_context.find_template(
          detect_relative_path(path),
          detect_path_prefixes(path),
          true,
          locals,
          @details
      )
    end

    def detect_relative_path(path)
      relative_path?(path) ? path.split("/").first : path
    end

    def detect_path_prefixes(path)
      return relative_path_prefixes(path) if relative_path?(path)
      path.include?("/") ? [] : @lookup_context.prefixes
    end

    def relative_path?(path)
      %r{\A\.\.?/} === path
    end

    def relative_path_prefixes(path)
      path_to_partial_directory = path.sub(%r{/\w+\Z}, "")
      directories_to_go_back = path.scan("../").count
      regex = %r{/(\w+/){#{directories_to_go_back}}(\.\.?/)+}

      prefix = "#{@current_folder}/#{path_to_partial_directory}".gsub(regex, "/")
      [prefix]
    end

    def collection_with_template
      view, locals, template = @view, @locals, @template
      as, counter, iteration = @variable, @variable_counter, @variable_iteration

      if layout = @options[:layout]
        layout = find_template(layout, @template_keys)
      end

      partial_iteration = PartialIteration.new(@collection.size)
      locals[iteration] = partial_iteration

      @collection.map do |object|
        locals[as] = object
        locals[counter] = partial_iteration.index

        content = template.render(view, locals)
        content = layout.render(view, locals) { content } if layout
        partial_iteration.iterate!
        content
      end
    end

    def collection_without_template
      view, locals, collection_data = @view, @locals, @collection_data
      cache = {}
      keys = @locals.keys

      partial_iteration = PartialIteration.new(@collection.size)

      @collection.map do |object|
        index = partial_iteration.index
        path, as, counter, iteration = collection_data[index]

        locals[as] = object
        locals[counter] = index
        locals[iteration] = partial_iteration

        template = (cache[path] ||= find_template(path, keys + [as, counter, iteration]))
        content = template.render(view, locals)
        partial_iteration.iterate!
        content
      end
    end

    # Obtains the path to where the object's partial is located. If the object
    # responds to +to_partial_path+, then +to_partial_path+ will be called and
    # will provide the path. If the object does not respond to +to_partial_path+,
    # then an +ArgumentError+ is raised.
    #
    # If +prefix_partial_path_with_controller_namespace+ is true, then this
    # method will prefix the partial paths with a namespace.
    def partial_path(object = @object)
      object = object.to_model if object.respond_to?(:to_model)

      path = if object.respond_to?(:to_partial_path)
               object.to_partial_path
             else
               raise ArgumentError.new("'#{object.inspect}' is not an ActiveModel-compatible object. It must implement :to_partial_path.")
             end

      if @view.prefix_partial_path_with_controller_namespace
        prefixed_partial_names[path] ||= merge_prefix_into_object_path(@context_prefix, path.dup)
      else
        path
      end
    end

    def prefixed_partial_names
      @prefixed_partial_names ||= PREFIXED_PARTIAL_NAMES[@context_prefix]
    end

    def merge_prefix_into_object_path(prefix, object_path)
      if prefix.include?(?/) && object_path.include?(?/)
        prefixes = []
        prefix_array = File.dirname(prefix).split("/")
        object_path_array = object_path.split("/")[0..-3] # skip model dir & partial

        prefix_array.each_with_index do |dir, index|
          break if dir == object_path_array[index]
          prefixes << dir
        end

        (prefixes << object_path).join("/")
      else
        object_path
      end
    end

    def retrieve_template_keys
      keys = @locals.keys
      keys << @variable if @has_object || @collection
      if @collection
        keys << @variable_counter
        keys << @variable_iteration
      end
      keys
    end

    def retrieve_variable(path, as)
      variable = as || begin
        base = path[-1] == "/".freeze ? "".freeze : File.basename(path)
        raise_invalid_identifier(path) unless base =~ /\A_?(.*?)(?:\.\w+)*\z/
        $1.to_sym
      end
      if @collection
        variable_counter = :"#{variable}_counter"
        variable_iteration = :"#{variable}_iteration"
      end
      [variable, variable_counter, variable_iteration]
    end

    IDENTIFIER_ERROR_MESSAGE = "The partial name (%s) is not a valid Ruby identifier; " \
                                 "make sure your partial name starts with underscore."

    OPTION_AS_ERROR_MESSAGE = "The value (%s) of the option `as` is not a valid Ruby identifier; " \
                                 "make sure it starts with lowercase letter, " \
                                 "and is followed by any combination of letters, numbers and underscores."

    def raise_invalid_identifier(path)
      raise ArgumentError.new(IDENTIFIER_ERROR_MESSAGE % (path))
    end

    def raise_invalid_option_as(as)
      raise ArgumentError.new(OPTION_AS_ERROR_MESSAGE % (as))
    end
  end
end=end
