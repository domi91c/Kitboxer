class Tutorial < ApplicationRecord
  has_many :steps
  belongs_to :product
end