class Store < ApplicationRecord
  has_many :products
  has_many :purchases
  has_many :orders, through: :purchases
  has_many :images, as: :imageable
  belongs_to :user

  validates :name, presence: true
end
