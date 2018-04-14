class SubscriptionsController < ApplicationController

  def create
    @subscription = Subscription.new(subscription_params)
    SubsciptionMailer.deliver_coming_soon
    respond_to do |format|
      if @subscription.save
        format.js
      else
        format.js
      end
    end
  end


  def subscription_params
    params.require(:subscription).permit(:email)
  end
end