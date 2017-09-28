class OrdersController < ApplicationController
  def show
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:user, product_ids: [])
  end
end
