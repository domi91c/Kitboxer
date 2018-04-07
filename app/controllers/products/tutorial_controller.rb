module Products
  class TutorialController < ApplicationController
    def show
      @tutorial = Product.find(params[:product_id]).tutorial
      render json: @tutorial
    end
  end
end
