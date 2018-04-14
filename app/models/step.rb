class Step < ApplicationRecord
  belongs_to :tutorial
  has_many :images, dependent: :destroy

  accepts_nested_attributes_for :images

end
