class Products::TutorialController < ApplicationController
  before_action :set_product, only: [:show, :update]

  def show
    binding.pry
    @tutorial = @product.tutorial
    render json: @tutorial
  end

  def update
    @tutorial = @product.tutorial
    if @tutorial.update(tutorial_params)
      render json: { tutorial: @tutorial }, status: :created
    else
      render json: @tutorial.errors, status: :unprocessable_entity
    end
  end

  def set_product
    @product = Product.find(params[:product_id])
  end

  def tutorial_params
    tutorial_params = params.require(:tutorial).permit(:id, :product_id, steps: [:id, :tutorial_id, :title, :body, :number, images: [:id, :image]])
    tutorial_params[:steps_attributes] = tutorial_params.delete :steps
    tutorial_params[:steps_attributes].each_with_index do |tp, i|
      tp[:images_attributes] = tp.delete :images
    end
    tutorial_params.permit!
  end
end
