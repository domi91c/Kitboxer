class Store < ApplicationRecord
  has_many :products
  has_many :purchases
  has_many :orders, through: :purchases
  belongs_to :user, optional: true
end