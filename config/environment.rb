# Load the Rails application.
require_relative 'application'
require_relative '../app/lib/utils/url_helper.rb'

# Initialize the Rails application.
Rails.application.initialize!

if Rails.env.production?
  domain = 'https://kitboxer.herokuapp.com'
else
  domain = 'localhost:3009'
end

ActionMailer::Base.smtp_settings = {
    :user_name => ENV['SENDGRID_USERNAME'],
    :password => ENV['SENDGRID_PASSWORD'],
    :domain => domain,
    :address => 'smtp.sendgrid.net',
    :port => 587,
    :authentication => :plain,
    :enable_starttls_auto => true
}
