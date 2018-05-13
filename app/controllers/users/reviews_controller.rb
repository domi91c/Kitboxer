class Users::ReviewsController < ApplicationController
  layout 'users'

  def index
    @reviews = current_user.reviews.page params[:page]
  end
end
