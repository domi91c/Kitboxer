class OrdersController < ApplicationController
  def create
    @user = current_user
    @amount = Cart[current_user].total.to_i * 100

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
      redirect_to my_orders_path
    else
      @order = Order.new(user: @user, stripe_charge_id: charge.id)
    end
    @order.save
    redirect_to my_orders_path
  end

  def order_params
    params.require(:order).permit(:user, product_ids: [])
  end
end
