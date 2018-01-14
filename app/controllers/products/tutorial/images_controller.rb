module Products
  module Tutorial
    class ImagesController < ApplicationController
      def create
        @image = Image.create(image_params)
        render json: @image
      end

      def destroy
        Image.destroy(params[:id])
        render json: { status: 'Successfully deleted image.' }
      end

      def image_params
        params.require(:image).permit(:image, :step_id)
      end
    end
  end
end
