class StepSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :number, :images
  belongs_to :tutorial
  has_many :images
end