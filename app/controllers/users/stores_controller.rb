class Users::StoresController < ApplicationController
  def show
    @products = current_user.products.with_images
  end
end
