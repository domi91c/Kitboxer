class Users::OrdersController < ApplicationController
  layout 'users'
  before_action :authenticate_user!

  def index
    @orders = current_user.orders.page params[:page]
  end
end