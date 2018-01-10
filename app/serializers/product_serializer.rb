class ProductSerializer < ActiveModel::Serializer
  attributes :id, :tutorial
  has_one :tutorial
end