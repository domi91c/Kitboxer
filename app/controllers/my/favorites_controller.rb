class My::FavoritesController < ApplicationController
  layout 'users'
  before_action :authenticate_user!

  def index
    @favorite_products = current_user.favorite_products.page(params[:page])
  end
end