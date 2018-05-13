class Purchases::ReviewController < ApplicationController
  before_action :set_purchase, only: [:new, :create, :update, :destroy]

  def new
    @review = @purchase.build_review
    @product = @purchase.product
    @product_rating = @review.ratings.build(context: "Product")
    @communication_rating = @review.ratings.build(context: "Communication")
    @guides_rating = @review.ratings.build(context: "Guides")
    @shipping_rating = @review.ratings.build(context: "Shipping")
  end

  def create
    product = @purchase.product
    @review = @purchase.build_review(review_params)
    respond_to do |format|
      if @review.save
        format.html { redirect_to product, notice: "Successfully sent review to #{product.user.email}." }
      else
        format.html { render :new }
      end
    end
  end

  def update
  end

  def destroy
  end

  private

  def set_purchase
    @purchase = Purchase.find(params[:purchase_id])
  end

  def review_params
    params.require(:review).permit(:id, :rating, :summary, :body, ratings_attributes: [:context, :score, :body]).merge(user_id: current_user.id)
  end
end

