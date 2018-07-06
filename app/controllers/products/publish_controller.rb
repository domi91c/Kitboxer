class Products::PublishController < ApplicationController
  def create
    @product = current_user.products.find(params[:product_id])
    @product.update(published: true)
    redirect_to @product, notice: "#{@product.title} is now live."
  end
end