module My
  module Orders
    module Purchases
      module Conversations
        class MessagesController < ApplicationController
          before_action :authenticate_user!
          before_action :set_purchase
          before_action :set_conversation

          def create
            @receipt = current_user.reply_to_conversation(@conversation, params[:mailboxer_message][:body], nil, true, true, params[:mailboxer_message][:attachment]).message
            respond_to do |format|
              format.js
            end
          end

          private

            def set_purchase
              @purchase = Purchase.find(params[:purchase_id])
            end

            def set_conversation
              @conversation = current_user.mailbox.conversations.find(params[:id])
            end
        end
      end
    end
  end
end
