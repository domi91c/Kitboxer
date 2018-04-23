class OrdersController < ApplicationController
  def show
    @order = Order.find(params[:id])
  end

  def create
    @user = current_user
    @amount = Cart[current_user].total

    if !@user.stripe_customer_id
      customer = Stripe::Customer.create(
          account_balance: 0,
          email: @user.email,
          source: params[:stripe_token]
      )
      @user.stripe_customer_id = customer.id
      @user.save
    else
      customer = Stripe::Customer.retrieve(@user.stripe_customer_id)
    end

    begin
      charge = Stripe::Charge.create(
          customer: customer.id,
          amount: @amount,
          description: 'Rails Stripe customer',
          currency: 'usd'
      )
    rescue Stripe::CardError => e
      flash[:error] = e.message
      redirect_to new_charge_path
      redirect_to order_path(@user.id)
    else
      @order = Order.new(user: current_user, stripe_charge_id: charge.id)
    end
    @order.save
    redirect_to user_path(current_user)
  end

  def order_params
    params.require(:order).permit(:user, product_ids: [])
  end
end
