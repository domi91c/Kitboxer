class TutorialSerializer < ActiveModel::Serializer
  attributes :id, :product_id, :steps
  has_many :steps
end