class Product::ImagesController < ApplicationController

  def index
    @images = Product.find(params[:product_id]).images
    render json: {images: @images.order(:updated_at).reverse}, status: :ok
  end

  def create
    @image = Image.new(image: params[:image], product_id: params[:product_id])
    if @image.save
      render json: {image: @image}, status: :created
    else
      render json: @image.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @image = Image.find(params[:id])
    @image.destroy
    head :no_content
  end

  def set_cover_image
    @image = Image.find(params[:id])
    @product = Product.find(params[:product_id])
    @images = @product.images
    @images.map {|image| image.cover_image = false; image.save}
    @image.cover_image = true
    @image.save
    head :no_content
  end


  def image_params
    params.require(:image_params).permit(:image)
  end

end
