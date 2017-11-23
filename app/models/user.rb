class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  has_many :products
  has_many :orders
  has_many :purchases, through: :orders


  def cart_count
    $redis.hlen "cart#{id}"
  end

  def cart_name
    "cart#{id}"
  end

  def customer
    Stripe::Customer.retrieve(stripe_customer_id) if stripe_customer_id
  end

  def full_name
    "#{first_name} #{last_name}"
  end
end
