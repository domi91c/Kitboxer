class CartsController < ApplicationController
  before_action :authenticate_user!

  def show
    @cart_products = Cart[current_user].products
    @cart_quantities = Cart[current_user].quantities
    @cart_data = @cart_products.zip(@cart_quantities)
  end

  def add
    if params[:cart_quantity].to_i > 0
      $redis.mapped_hmset current_user.cart_name, {
          params[:product_id] => params[:cart_quantity]
      }
    else
      $redis.hdel current_user.cart_name, params[:product_id]
    end
    redirect_to cart_path(current_user.cart_name)
  end

  def remove
    $redis.hdel current_user.cart_name, params[:product_id]
    redirect_to cart_path(current_user.cart_name)
    # render json: current_user.cart_count, status: 200
  end

  def empty
    $redis.del current_user.cart_name
  end

  def save_for_later
    $redis.hdel current_user.cart_name, params[:product_id]
    
  end

  private


  def cart_params
    params.require(:cart).permit(:product_id, :cart_quantity)
  end

end