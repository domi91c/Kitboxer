class Cart
  class << self
    def [](user)
      @cart_name = user.cart_name
      @contents = $redis.hgetall @cart_name
      self
    end

    def total
      lines.sum { |product, quantity| product.price * quantity }
    end

    def products
      Product.find(@contents.keys)
    end

    def quantities
      @contents.values.map(&:to_i)
    end

    def lines
      Hash[products.zip(quantities)]
    end

    def add(product, quantity)
      $redis.mapped_hmset @cart_name, { product => quantity }
    end

    def remove(product)
      $redis.hdel @cart_name, product.id
    end

    def empty
      $redis.del @cart_name
    end

  end
end
