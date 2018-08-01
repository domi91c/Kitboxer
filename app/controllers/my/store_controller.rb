class My::StoreController < ApplicationController
  layout "my_store"
  before_action :set_store

  def edit

  end


  def show
    @products = current_user.products.with_images
    @notifications = current_user.mailbox.notifications
  end

  def set_store
    @store = current_user.store
  end
end

