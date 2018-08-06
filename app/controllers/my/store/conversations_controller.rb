module My
  module Store
    class ConversationsController < My::StoreController
      layout "my_store"
      before_action :set_conversation, only: [:show]

      def index
        @title = 'Inbox'
        @subtitle = ''
        @conversations = current_user.mailbox.inbox
      end

      def sent
        @title = 'Sent'
        @subtitle = ''
        @conversations = current_user.mailbox.inbox
        @conversations = current_user.mailbox.sentbox
        render action: :index
      end

      def trash
        @title = 'Trash'
        @subtitle = ''
        @conversations = current_user.mailbox.inbox
        @conversations = current_user.mailbox.trash
        render action: :index
      end

      def show
        @conversation = Mailboxer::Conversation.find(params[:id])
        @messages = @conversation.messages.order(created_at: :asc)
        unless @messages.first.notified_object.nil?
          @notified_object = @messages.first.notified_object
        end
        @title = "RE: " << @conversation.original_message.subject
        @subtitle = "From: " << @conversation.last_sender.name
        @message = Mailboxer::Message.new
      end

      def new
        @title = 'Composing Message'
        @subtitle = ''
        @message = Mailboxer::Message.new
      end

      def set_conversation
        @conversation = Mailboxer::Conversation.find(params[:id])
      end
    end
  end
end
