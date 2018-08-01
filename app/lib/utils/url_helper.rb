def tag_field_tag(name, value = nil, options = {})
  tag :input, { "type" => "tags", "name" => name, "id" => sanitize_to_id(name), "value" => value }.update(options.stringify_keys)
end

def active_link_to(name = nil, options = nil, html_options = nil, &block)
  html_options, options, name = options, name, block if block_given?
  options ||= {}

  html_options = convert_options_to_data_attributes(options, html_options)

  url = url_for(options)
  html_options["href".freeze] ||= url

  html_options["class"] ||= ''
  if html_options["active_class"]
    html_options["class"] += active_class?(options, html_options["active_class"])
  else
    html_options["class"] += active_class?(options)
  end

  content_tag("a".freeze, name || url, html_options, &block)
end
