module Products
  module Tutorial
    module Steps
      class ImagesController < ApplicationController
        before_action :set_step, only: [:create, :update]

        def create
          @image = @step.images.create(image_params)
          render json: @image
        end

        def update
          @image = @step.images.find(params[:id])
          if @image.update(image_params)
            @image.set_urls
            render json: { image: @image }, status: :created
          else
            render json: @image.errors, status: :unprocessable_entity
          end
        end

        def destroy
          @step.images.find(params[:id]).destroy
          render json: {}, status: 200
        end

        def set_step
          @step = Product.find(params[:product_id]).tutorial.steps.find(params[:step_id])
        end

        def image_params
          params.require(:image).permit(:attachment, :crop_x, :crop_y, :crop_width, :crop_height)
        end
      end
    end
  end
end

