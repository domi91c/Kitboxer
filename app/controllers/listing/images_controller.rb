class Listing::ImagesController < ApplicationController

  def index
    @images = Listing.find(params[:listing_id]).images
    render json: {images: @images.order(:updated_at).reverse}, status: :ok
  end

  def create
    @image = Image.new(image: params[:image], listing_id: params[:listing_id])
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
    @listing = Listing.find(params[:listing_id])
    @images = @listing.images
    @images.map {|image| image.cover_image = false; image.save}
    @image.cover_image = true
    @image.save
    head :no_content
  end


  def image_params
    params.require(:image_params).permit(:image)
  end

end
