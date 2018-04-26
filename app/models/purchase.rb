class Purchase < ApplicationRecord
  belongs_to :product
  belongs_to :order
  has_one :review

  def reviewed?
    !review.nil?
  end
end
