class CartsController < ApplicationController
  before_action :authenticate_user!

  def show
    @cart_data = Cart[current_user].lines
  end

  def add
    if params[:cart_quantity].to_i > 0
      $redis.mapped_hmset current_user.cart_name, {
          params[:product_id] => params[:cart_quantity]
      }
    else
      $redis.hdel current_user.cart_name, params[:product_id]
    end
    redirect_to cart_path(current_user)
  end

  def remove
    $redis.hdel current_user.cart_name, params[:product_id]
    redirect_to cart_path(current_user)
    # render json: current_user.cart_count, status: 200
  end

  def save_for_later
    @product = Product.find(params[:product_id])
    Cart[current_user].delete(@product)
    @cart_data = Cart[current_user].lines
    current_user.favorite(@product)
    respond_to do |format|
      format.js { flash.now[:notice] = "Added to Watch List" }
    end
  end

  private

  def cart_params
    params.require(:cart).permit(:product_id, :cart_quantity)
  end

end