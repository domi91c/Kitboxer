module My
  module Store
    class ProductsController < ApplicationController
      layout "my_store"
      before_action :set_store

      def index
        @products = @store.products
      end

      def set_store
        @store = current_user.store
      end
    end
  end
end
