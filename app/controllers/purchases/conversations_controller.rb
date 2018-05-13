class Purchases::ConversationsController < ApplicationController
  before_action :set_purchase

  def index
    @conversations = current_user.mailbox.conversations
  end

  def show
    @conversation = current_user.mailbox.conversations.find(params[:id])
  end

  def new
  end

  def create
    recipient = @purchase.product.user
    receipt = current_user.send_message(recipient, params[:body], params[:subject])
    receipt.notification.update(notified_object: @purchase)
    redirect_back fallback_location: users_path(current_user), notice: 'Question sent.'
  end

  def set_purchase
    @purchase = Purchase.find(params[:purchase_id])
  end
end