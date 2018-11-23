class Subscription < ApplicationRecord
  validates_email_format_of :email, :Message => 'does not look right'

end
