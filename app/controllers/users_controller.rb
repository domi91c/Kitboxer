class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
    unless @user == current_user
      redirect_to root_path, alert: "Access denied."
    end
    if @user.customer
      @cards = @user.customer.sources
    end
    @reviews = @user.reviews.page params[:page]
    @products = @user.products.page params[:page]
    @favorite_products = Product.page params[:page]
    @orders = @user.orders.page params[:page]
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email)
  end
end
