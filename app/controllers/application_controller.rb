class ApplicationController < ActionController::Base
  before_action :store_user_location!, if: :storable_location?

  protect_from_forgery prepend: true
  before_action :better_errors_hack, if: -> { Rails.env.development? }

  protected

    def better_errors_hack
      request.env['puma.config'].options.user_options.delete :app
    end

    def storable_location?
      request.get? && is_navigational_format? && !devise_controller? && !request.xhr?
    end

    def store_user_location!
      store_location_for(:user, request.fullpath)
    end

    def after_sign_in_path_for(resource_or_scope)
      stored_location_for(resource_or_scope) || super
    end

end

