class Products::Tutorial::StepsController < ApplicationController
  def create
    @step = Product.find(params[:product_id]).tutorial.steps.create(step_params)
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

  def step_params
    params.require(:step).permit(:title, :body, :number)
  end
end
