class ChargesController < ApplicationController
  def new
  end

  def show
    binding.pry
  end

  def create
    # Amount in cents
    @user = current_user
    @amount = params[:amount].to_i * 100
    @products = params[:product_ids]

    if !@user.stripe_customer_id
      customer = Stripe::Customer.create(
          account_balance: 0,
          # :email => params[:stripeEmail],
          email: @user.email,
          source: params[:stripe_token]
      )
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
      binding.pry
    rescue Stripe::CardError => e
      flash[:error] = e.message
      redirect_to new_charge_path
      redirect_to order_path(@user.id)
    else
      Order.new()
      redirect_to charges_path
    end

  end

  def charges_params
    params.require(:charges).permit(:user, product_ids: [])
  end
end


