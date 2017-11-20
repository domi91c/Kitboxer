class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
    @orders = @user.orders
    @cards = @user.customer.sources

    unless @user == current_user
      redirect_to root_path, alert: "Access denied."
    end
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email)
  end

end
