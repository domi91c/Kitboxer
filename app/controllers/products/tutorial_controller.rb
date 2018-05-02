class Products::TutorialController < ApplicationController
  before_action :set_product, only: [:new, :edit, :show, :update]

  def new
    tutorial = @product.create_tutorial
    @serialized_tutorial = TutorialSerializer.new(tutorial)
  end

  def edit
    tutorial = @product.tutorial
    @serialized_tutorial = TutorialSerializer.new(tutorial)
  end

  def show
  end

  def create
    @tutorial_form = TutorialForm.new(@project.tutorial.new)
    respond_to do |format|
      if @tutorial_form.validate(tutorial_params)
        @tutorial_form.save
        format.html { render :show, notice: 'Tutoriial was successfully created.' }
        format.json { render @tutorial, status: :created, location: @product }
      else
        @tutorial_form.sync(tutorial_params)
        format.html { render :new }
        format.json { render json: @tutorial.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @tutorial = @product.tutorial
    @tutorial_form = TutorialForm.new(@tutorial)
    if @tutorial_form.validate(tutorial_params)
      @tutorial_form.save
      render json: @tutorial, status: :created, location: @product
    else
      @tutorial_form.sync(tutorial_params)
      render json: @tutorial_form, status: :unprocessable_entity
    end
  end

  def set_product
    @product = Product.find(params[:product_id])
  end

  def tutorial_params
    tutorial_params = params.require(:tutorial).permit(:id, :product_id, steps: [:id, :tutorial_id, :title, :body, :number, images: [:id, :image]])
  end

end
