module ApplicationHelper

  def parent_layout(layout)
    @view_flow.set(:layout, output_buffer)
    output = render(file: "layouts/#{layout}")
    self.output_buffer = ActionView::OutputBuffer.new(output)
  end

  def current_class?(path, className = "active")
    request.path == path ? className : ''
  end

  def flash_class(level)
    case level.to_sym
    when :notice then
      "alert alert-success"
    when :info then
      "alert alert-info"
    when :alert then
      "alert alert-danger"
    when :warning then
      "alert alert-warning"
    end
  end

  def wizard_progress_bar
    content_tag(:ul, class: "nav nav-pills nav-justified wizard-progress") do
      wizard_steps.collect do |every_step|
        class_str = "unfinished "
        class_str = "active " if every_step == step
        class_str = "finished" if past_step?(every_step)
        concat(
            content_tag(:li, class: 'nav-item') do
              link_to I18n.t(every_step), wizard_path(every_step), class: "nav-link #{class_str}"
            end
        )
      end
    end
  end

end

