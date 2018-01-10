class TutorialSerializer < ActiveModel::Serializer
  attributes :id, :product_id, :steps
  belongs_to :product
  has_many :steps
end