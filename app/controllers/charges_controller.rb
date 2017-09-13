class ChargesController < ApplicationController
  def new
  end

  def index

  end

  def create
    # Amount in cents
    @user = current_user
    @amount = params[:amount].to_i*100

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
      binding.pry
      charge = Stripe::Charge.create(
          :customer => customer.id,
          :amount => @amount,
          :description => 'Rails Stripe customer',
          :currency => 'usd'
      )
    rescue Stripe::CardError => e
      binding.pry
      flash[:error] = e.message
      redirect_to new_charge_path
    else
      binding.pry
      redirect_to charges_path
    end
  end
end


