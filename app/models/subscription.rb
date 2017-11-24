class Subscription < ApplicationRecord
  validates_email_format_of :email, :message => 'does not look right'

end
