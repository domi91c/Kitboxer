class Products::Tutorial::StepsController < ApplicationController
  before_action :set_product, only: [:index, :create, :update, :destroy]

  def create
    @step = @product.tutorial.steps.create(step_params)
    render json: @step
  end

  def update
    @step = Step.find(params[:id])
    if @step.update(step_params)
      render json: { step: @step }, status: :created
    else
      render json: @step.errors, status: :unprocessable_entity
    end
  end

  def destroy
    Step.destroy(params[:id])
    render json: {}, status: 200
  end

  def set_product
    @product = Product.find(params[:product_id])
  end

  def step_params
    params.require(:step).permit(:title, :body, :number)
  end
end
