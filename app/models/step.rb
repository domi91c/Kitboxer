class Step < ApplicationRecord
  belongs_to :tutorial
  has_many :images
end
