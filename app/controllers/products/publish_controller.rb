class Products::PublishController < ApplicationController
  def create
    @product = current_user.products.find(params[:product_id])
    @product.update(published: true)
    redirect_to @product
  end
end