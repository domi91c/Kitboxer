module My
  module Store
    class OrdersController < ApplicationController
      layout "my_store"
      def index
        @orders = Purchase.joins(:orders)
        binding.pry
      end
    end
  end
end
