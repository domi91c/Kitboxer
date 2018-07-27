Rails.application.config.content_security_policy do |policy|
  policy.font_src :self, :https, :data
  policy.img_src :self, :https, :data
  policy.object_src :none
  policy.style_src :self, :https, :unsafe_inline


  policy.script_src :self, :https
  policy.default_src :self, :https

  # Specify URI for violation reports
  # p.report_uri "/csp-violation-report-endpoint"

  # standard until this moment
  if Rails.env.development? || Rails.env.test?
    policy.script_src :self, :https, :unsafe_eval, :unsafe_inline
    policy.connect_src :self, :https, 'http://localhost:3035', 'ws://localhost:3035', 'ws://127.0.0.1:35729/livereload'
  end
end