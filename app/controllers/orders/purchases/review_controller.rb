module Orders
  module Purchases
    class ReviewController < ApplicationController
      before_action :set_purchase, only: [:new, :edit, :create, :update, :destroy]

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
            format.html { redirect_back fallback_location: product, notice: "Successfully sent review to #{product.user.email}." }
          else
            format.html { render :new }
          end
        end
      end

      def edit
        @review = @purchase.review
        @product = @purchase.product
        @product_rating = @review.ratings.where(context: "Product")
        @communication_rating = @review.ratings.where(context: "Communication")
        @guides_rating = @review.ratings.where(context: "Guides")
        @shipping_rating = @review.ratings.where(context: "Shipping")
      end

      def update
        product = @purchase.product
        @review = @purchase.review
        @review.ratings.delete_all
        respond_to do |format|
          if @review.update(review_params)
            format.html { redirect_back fallback_location: product, notice: "Successfully sent review to #{product.user.email}." }
          else
            format.html { render :back }
          end
        end
      end

      def destroy
      end

      private

        def set_purchase
          @purchase = Purchase.find(params[:purchase_id])
        end

        def review_params
          params.require(:review).permit(:id, :rating, :summary, :body, ratings_attributes: [:context, :score]).merge(user_id: current_user.id)
        end
    end
  end
end
