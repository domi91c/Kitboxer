module Products
  module Tutorial
    class ImagesController < ApplicationController
      def create
        @image = Image.create(image_params)
        render json: @image
      end

      def update
        @image = Image.find(params[:id])
        if @image.update(image_params)
          if image_params[:crop_data]
            @image.update(crop_data: JSON.parse(params[:image][:crop_data]))
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
        params.require(:image).permit(:image, :step_id, :crop_data)
      end
    end
  end
end
