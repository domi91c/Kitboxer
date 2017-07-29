class Listing::ImagesController < ApplicationController

  def create
    @image = Image.new(image: params[:image], listing_id: params[:listing_id])
    if @image.save
      pd @image
      render json: {image: @image}, status: :created
    else
      render json: @image.errors, status: :unprocessable_entity
    end
  end


  def image_params
    params.require(:image_params).permit(:image)
  end

end
