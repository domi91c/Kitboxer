class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy, :publish]
  before_action :authenticate_user!, except: [:index, :show]


  # GET /products
  # GET /products.json
  def index
    if params[:search]
      @products = Product.where(published: true).search(params[:search])
    else
      @products = Product.where(published: true)
    end
  end

  # GET /products/1
  # GET /products/1.json
  def show
    @product.increment_impressions(current_user)
    @reviews = @product.reviews
    if @product.tutorial
      @steps = @product.tutorial.steps.order(number: :asc)
    end
    if @product.favorited_by?(current_user)
      @watch_button_text = 'Watching'
    else
      @watch_button_text = 'Watch'
    end
    if (@cart_quantity = Cart[current_user].lines[@product])
      @cart_button_string = "Update "
    else
      @cart_quantity = 0
      @cart_button_string = "Add to "
    end
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit
    @test_product = Product.last
  end

  # POST /products
  # POST /products.json
  # def create
  #   @product = current_user.products.build(product_params)
  #
  #   respond_to do |format|
  #     if @product.save
  #       format.html {redirect_to @product, notice: 'product was successfully created.'}
  #       format.json {render :show, status: :created, location: @product}
  #     else
  #       format.html {render :new}
  #       format.json {render json: @product.errors, status: :unprocessable_entity}
  #     end
  #   end
  # end

  def create
    @product = current_user.products.new
    @product.save(validate: false)
    redirect_to product_build_path(@product, @product.form_steps.first)
  end

  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    # respond_to do |format|
    #   if @product.update(product_params)
    #     format.html { redirect_to @product, notice: 'Product was successfully updated.' }
    #     format.json { render :show, status: :ok, location: @product }
    #   else
    #     format.html { render :edit }
    #     format.json { render json: @product.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    @product.destroy
    respond_to do |format|
      format.html { redirect_to products_url, notice: 'Product was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_product
    @product = Product.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def product_params
    params.require(:product).permit(:title, :body, :tagline, :price, :quantity, images_attributes: [:image_id, :image])
  end
end
