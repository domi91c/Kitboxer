class ApplicationController < ActionController::Base

  protect_from_forgery prepend: true
  before_action :better_errors_hack, if: -> { Rails.env.development? }

  protected


  def better_errors_hack
    request.env['puma.config'].options.user_options.delete :app
  end

end

