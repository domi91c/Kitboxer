module My
  module Store
    module Conversations
      class MessagesController < ApplicationController
        layout "my_store"
        before_action :authenticate_user!
        before_action :set_conversation

        def create
          @receipt = current_user.reply_to_conversation(@conversation, params[:mailboxer_message][:body], nil, true, true, params[:mailboxer_message][:attachment]).message
          respond_to do |format|
            format.html { redirect_to my_store_conversation_path(@conversation) }
          end
        end

        private

          def set_conversation
            @conversation = current_user.mailbox.conversations.find(params[:conversation_id])
          end
      end
    end
  end
end
