class Products::Tutorial::ImagesController < ApplicationController
  def create
    @image = Image.create(image_params)
    render json: @image
  end

  def update
    @image = Image.find(params[:id])
    if @image.update(image_params)
      if image_params[:crop_x]
        @image.crop_image
      end
      render json: { image: @image }, status: :created
    else
      render json: @image.errors, status: :unprocessable_entity
    end
  end

  def destroy
    Image.destroy(params[:id])
    render json: {}, status: 200
  end

  def image_params
    params.require(:image).permit(:image, :step_id, :crop_x, :crop_y, :crop_width, :crop_height)
  end
end
