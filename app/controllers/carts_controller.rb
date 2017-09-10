class CartsController < ApplicationController
  before_action :authenticate_user!

  def show
    cart_hash = $redis.hgetall "#{current_user.cart_name}"
    @cart_products = Product.find(cart_hash.keys)
    @cart_quantities = cart_hash.values
    @cart_data = @cart_products.zip(@cart_quantities)
  end


  def add
    $redis.mapped_hmset current_user.cart_name, {
        params[:product_id] => params[:product_quantity]
    }
    redirect_to carts_show_path(current_user.cart_name)
    # render json: current_user.cart_count, status: 200
  end

  def remove
    $redis.hdel current_user.cart_name, params[:product_id]
    redirect_to carts_show_path(current_user.cart_name)
    # render json: current_user.cart_count, status: 200
  end

  private


  def cart_params
    params.require(:cart).permit(:product_id, :product_quantity)
  end

end