# == Purchase
# The Purchase model manages Order line items. Probably should have called it LineItem,
# and used it for the cart as well.
class Purchase < ApplicationRecord
  belongs_to :product
  belongs_to :order
  has_one :review
  has_many :notifications, as: :notified_object, class_name: "Mailboxer::Notification"

  after_create :create_conversation

  def create_conversation

  end

  def reviewed?
    !review.nil?
  end
end
