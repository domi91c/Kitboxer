# Cart
# a Cart is a list of Products that a buyer wants to buy. It's managed by Redis.
# I'm not sure if Redis was the right choice. Probably could have just used two
# SQL tables, Cart and LineItem.
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

    def remove(product_id)
      $redis.hdel @cart_name, product_id
    end

    def empty
      $redis.del @cart_name
    end
  end
end
