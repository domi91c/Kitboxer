class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :product, counter_cache: true
end
