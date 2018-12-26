class ProductSerializer < ActiveModel::Serializer
  attributes :id, :title, :price, :quantity, :tutorial
  has_many :images
  has_one :tutorial
  belongs_to :user
end
