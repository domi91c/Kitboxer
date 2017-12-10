class Order < ApplicationRecord
  after_create :create_purchases

  belongs_to :user
  has_many :purchases
  has_many :products, through: :purchases

  def create_purchases
    cart_data.each do |product, quantity|
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

  def cart_data
    cart_hash = $redis.hgetall "#{user.cart_name}"
    cart_products = Product.find(cart_hash.keys)
    cart_quantities = cart_hash.values.map(&:to_i)
    cart_data = cart_products.zip(cart_quantities)
  end
end

