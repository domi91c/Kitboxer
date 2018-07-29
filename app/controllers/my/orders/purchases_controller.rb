module My
  module Orders
    class PurchasesController < ApplicationController
      before_action :set_purchase, only: [:show]

      def show
        @product = @purchase.product
        @conversations =
            current_user.mailbox.conversations
                .includes(:messages)
                .merge(Mailboxer::Message
                           .where(notified_object: @purchase))
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
