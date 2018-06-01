class Purchases::Conversations::MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_purchase
  before_action :set_conversation

  def create
    receipt = current_user.reply_to_conversation(@conversation, params[:body])
    redirect_to purchase_conversation_path(@purchase, receipt.conversation)
  end

  private

    def set_purchase
      @purchase = Purchase.find(params[:purchase_id])
    end

    def set_conversation
      @conversation = current_user.mailbox.conversations.find(params[:conversation_id])
    end

end

