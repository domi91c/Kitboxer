module Products
  module Tutorial
    module Steps
      class ImagesController < ApplicationController
        before_action :set_step, only: [:create]

        def create
          @image = @step.images.create(image_params)
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

        def set_step
          @step = Step.find(params[:step_id])
        end

        def image_params
          params.require(:image).permit(:image, :crop_x, :crop_y, :crop_width, :crop_height)
        end
      end
    end
  end
end

