class Cart
  class << self
    def [](current_user)
      @contents = $redis.hgetall "#{current_user.cart_name}"
      self
    end

    def total
      cart_products = Product.find(@contents.keys)
      cart_quantities = @contents.values
      cart_data = cart_products.zip(cart_quantities)
      cart_data.sum { |product, quantity| product.price.to_f * quantity.to_i }.to_i
    end

    def products
      Product.find(@contents.keys)
    end

    def quantities
      @contents.values
    end
  end
end
