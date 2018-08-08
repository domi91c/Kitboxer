# == Order
# an Order is created when a buyer checks out. It contains a list of Purchases.
class Order < ApplicationRecord
  after_create :create_purchases, :empty_cart

  belongs_to :user
  has_many :purchases
  has_many :products, through: :purchases

  def create_purchases
    Cart[user].lines.each do |product, quantity|
      if quantity > 0
        purchases.build(product: product, quantity: quantity)
      end
    end
  end

  def total
    total = 0
    cart_data.each do |product, quantity|
      total += product.price * quantity
    end
    total
  end

  private

    def empty_cart
      Cart[user].empty
    end
end

