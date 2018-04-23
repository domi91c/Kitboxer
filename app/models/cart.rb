class Cart
  class << self
    def [](current_user)
      @cart_name = current_user.cart_name
      @contents = $redis.hgetall @cart_name
      self
    end

    def total
      lines.sum { |product, quantity| product.price * quantity.to_i }.to_i
    end

    def products
      Product.find(@contents.keys)
    end

    def quantities
      @contents.values
    end

    def lines
      Hash[products.zip(quantities)]
    end

    def empty
      $redis.del @cart_name
    end
  end
end
