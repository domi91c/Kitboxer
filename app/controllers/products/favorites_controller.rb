class Products::FavoritesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_product, only: [:create, :update]

  def update
    respond_to do |format|
      if @product.favorited_by?(current_user)
        current_user.unfavorite(@product)
        @watch_button_text = 'Watch'
        format.js { flash.now[:warning] = "Removed from Watch List" }
      else
        current_user.favorite(@product)
        @watch_button_text = 'Watching'
        format.js { flash.now[:notice] = "Added to Watch List" }
      end
    end
  end

  def set_product
    @product = Product.find(params[:product_id])
  end

  def favorite_params
    params.require(:favorite).permit(:product_id)
  end
end
