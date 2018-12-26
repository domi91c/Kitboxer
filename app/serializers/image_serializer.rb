class ImageSerializer < ActiveModel::Serializer
  attributes :id, :step_id, :url, :original_url, :processed_url
  belongs_to :step
end
