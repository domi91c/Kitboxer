class My::OrdersController < ApplicationController
  layout 'users'
  before_action :authenticate_user!

  def index
    @orders = current_user.orders.page params[:page]
  end

  def orders_params
    params.require(:orders).permit(:purchase_id)
  end
end