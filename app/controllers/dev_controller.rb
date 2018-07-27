class DevController < ApplicationController
  def user1
    sign_in(User.find(1))
    redirect_to my_orders_path
  end

  def user2
    sign_in(User.find(102))
    redirect_to my_orders_path
  end
end