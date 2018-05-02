class ImageSerializer < ActiveModel::Serializer
  attributes :id, :step_id, :image
  belongs_to :step
end
