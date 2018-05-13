class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :subject
  has_many :messages
end
