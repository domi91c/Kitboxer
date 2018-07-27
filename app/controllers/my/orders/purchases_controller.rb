module My
  module Orders
    class PurchasesController < ApplicationController
      before_action :set_purchase, only: [:show]

      def show
        @product = @purchase.product
        respond_to do |format|
          format.js
        end
      end

      def set_purchase
        @purchase = Purchase.find(params[:id])
      end
    end
  end
end
