class Products::TestsController < ApplicationController
  before_action :set_product, only: [:index, :new, :edit, :show, :update]

  def index
    tutorial = @product.tutorial
    tutorial.steps.build
    @tutorial_form = TutorialForm.new(tutorial)
    @serialized_tutorial = TutorialSerializer.new(tutorial).to_json
  end

  def new
    tutorial = @product.tutorial
    tutorial.steps.build
    tutorial.steps.build
    tutorial.steps.build
    steps = tutorial.steps
    @tutorial_form = TutorialForm.new(tutorial)
  end

  def edit
    tutorial = @product.tutorial
    unless tutorial.steps.any?
      tutorial.steps.build
    end
    @tutorial_form = TutorialForm.new(tutorial)
  end

  def show
    @tutorial = @product.tutorial
    render json: @tutorial
  end

  def create
  end

  def update
    tutorial = @product.tutorial
    @tutorial_form = TutorialForm.new(tutorial)
    if @tutorial_form.validate(tutorial_params)
      @tutorial_form.save
      redirect_to edit_product_test_path(@product)
    else
      @tutorial_form.sync(tutorial_params)
      render :edit
    end
  end

  def set_product
    @product = Product.find(params[:product_id])
  end

  def tutorial_params
    tutorial_params = params.require(:tutorial).permit(:id, :product_id, steps: [:id, :tutorial_id, :title, :body, :number, images_attributes: [:id, :image]])
  end
end
