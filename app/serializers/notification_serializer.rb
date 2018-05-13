class NotificationSerializer < ActiveModel::Serializer
  attributes :id, :body, :subject, :attachment, :conversation_id, :notified_object_id, :notified_object_type
end
