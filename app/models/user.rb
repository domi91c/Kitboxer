class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :products
  has_many :orders
  devise :invitable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  def cart_count
    $redis.hlen "cart#{id}"
  end

  def cart_name
    "cart#{id}"
  end

  def customer
    Stripe::Customer.retrieve(stripe_customer_id)
  end
end
