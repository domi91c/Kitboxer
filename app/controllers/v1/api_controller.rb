class V1::ApiController < ApplicationController

  def set_resource(klass)
    head :not_found and return unless member_object = klass.find(params[:id])
    member_object
  end
end
