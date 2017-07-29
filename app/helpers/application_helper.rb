module ApplicationHelper

  def wizard_progress_bar
    content_tag(:ul, class: "nav nav-pills nav-justified wizard-progress") do
      wizard_steps.collect do |every_step|
        class_str = "unfinished "
        class_str = "active " if every_step == step
        class_str = "finished" if past_step?(every_step)
        every_step.big
        concat(
            content_tag(:li, class: 'nav-item') do
              link_to I18n.t(every_step), wizard_path(every_step), class: "nav-link #{class_str}"
            end
        )
      end
    end
  end

end

