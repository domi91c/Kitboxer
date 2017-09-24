module CartsHelper

  def cart_total
    cart_hash = $redis.hgetall "#{current_user.cart_name}"
    cart_products = Product.find(cart_hash.keys)
    cart_quantities = cart_hash.values
    cart_data = cart_products.zip(cart_quantities)
    cart_data.sum { |product, quantity| product.price.to_f * quantity.to_i }
  end

  def cart_products
    cart_hash = $redis.hgetall "#{current_user.cart_name}"
    cart_hash.keys.split
  end

end
