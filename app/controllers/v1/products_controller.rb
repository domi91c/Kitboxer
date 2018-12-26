class V1::ProductsController < V1::ApiController
  def index
    @products = Product.all.limit(30)
    render json: @products
  end

  def show
    @product = Product.find(params[:id])
    render json: @product
  end
end
