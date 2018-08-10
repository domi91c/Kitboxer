class CartsController < ApplicationController
  before_action :authenticate_user!, :set_cart

  def show
    @cart_data = @cart.lines
  end

  def add
    quantity = params[:cart_quantity].to_i
    if quantity > 0
      @cart.add(params[:product_id], params[:cart_quantity])
      notice = "Added product to cart."
    else
      @cart.remove(params[:product_id])
      notice = "Removed product from cart."
    end
    respond_to do |format|
      format.js { flash.now[:notice] = notice }
    end
  end

  def remove
    @cart.remove params[:product_id]
    redirect_to cart_path(current_user)
  end

  def save_for_later
    @product = Product.find(params[:product_id])
    @cart.remove(@product.id)
    @cart_data = @cart.lines
    current_user.favorite(@product)
    respond_to do |format|
      format.js { flash.now[:notice] = "Added to Watch List" }
      format.html
    end
  end

  private

    def set_cart
      @cart = Cart[current_user]
    end

    def cart_params
      params.require(:cart).permit(:product_id, :cart_quantity)
    end
end