class My::UsersController < ApplicationController
  layout 'users'
  before_action :authenticate_user!

  def show
    @user = User.find(params[:id])
    unless @user == current_user
      redirect_to root_path, alert: "Access denied."
    end
    if @user.customer
      @cards = @user.customer.sources
    end
    @products = @user.products.page params[:page]
    @favorite_products = Product.page params[:page]
    redirect_to my_orders_path(current_user)
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email)
  end
end
