class CartsController < ApplicationController
  before_action :authenticate_user!

  def show
    cart_hash = $redis.hgetall "#{current_user_cart}"
    @cart_products = Product.find(cart_hash.keys)
    @cart_quantities = cart_hash.values
    @cart_data = @cart_products.zip(@cart_quantities)
  end


  def add
    $redis.mapped_hmset current_user_cart, {
        params[:product_id] => params[:product_quantity]
    }
    redirect_to carts_show_path(current_user_cart)
    # render json: current_user.cart_count, status: 200
  end

  def remove
    $redis.hdel current_user_cart, params[:product_id]
    redirect_to carts_show_path(current_user_cart)
    # render json: current_user.cart_count, status: 200
  end

  private

  def current_user_cart
    "cart#{current_user.id}"
  end

  def cart_action(current_user_id)
    if $redis.sismember "cart#{current_user_id}", id
      "Remove from"
    else
      "Add to"
    end
  end

  def cart_params
    params.require(:cart).permit(:product_id, :product_quantity)
  end

end