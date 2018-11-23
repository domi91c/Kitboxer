module My
  module Orders
    module Purchases
      class ConversationsController < ApplicationController
        before_action :set_purchase

        def index
          @purchase = Purchase.find(params[:purchase_id])
          @conversations = current_user.mailbox.conversations
          @conversation = @conversations.first
          @conversation.mark_as_read(current_user) unless @conversation.nil?
          @message = Mailboxer::Message.new
          respond_to do |format|
            format.js
          end
        end

        def show
          # @conversation = current_user.mailbox.conversations.find(params[:id])
          # @message = Mailboxer::Message.new
          respond_to do |format|
            format.js
          end
        end

        def new
          respond_to do |format|
            format.js
          end
        end

        def create
          recipient = @purchase.product.user
          subject = params[:optional_subject].present? ? params[:optional_subject] : params[:subject]
          receipt = current_user.send_message(recipient, params[:body], subject)
          receipt.notification.update(notified_object: @purchase)
          subject = "#{current_user.name} asked a question."
          body = "#{current_user.name} asked a question regarding #{@purchase.product.title}."
          recipient.notify(subject, body, @purchase)
          redirect_to my_orders_path(current_user), notice: 'Question sent.'
        end

        def set_purchase
          @purchase = Purchase.find(params[:purchase_id])
        end
      end
    end
  end
end
