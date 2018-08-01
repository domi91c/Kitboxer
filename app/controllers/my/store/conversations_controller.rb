module My
  module Store
    class ConversationsController < My::StoreController
      layout "my_store"

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

      end

      def new
        @title = 'Composing Message'
        @subtitle = ''
        @message = Mailboxer::Message.new
      end
    end
  end
end
