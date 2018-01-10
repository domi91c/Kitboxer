class ImageSerializer < ActiveModel::Serializer
  attributes :id, :image, :step_id
  belongs_to :step
end
