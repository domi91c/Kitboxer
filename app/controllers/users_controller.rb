class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
    @reviews = @user.reviews
    unless @user == current_user
      redirect_to root_path, alert: "Access denied."
    end
    @products = @user.products
    @favorite_products = Product.favorited_by(@user)
    @orders = @user.orders
    if @user.customer
      @cards = @user.customer.sources
    end
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email)
  end

end
