module CartsHelper
  def cart_total
    Cart[current_user].total
  end

  def cart_products
    cart_hash = $redis.hgetall "#{current_user.cart_name}"
    cart_hash.keys
  end
end
