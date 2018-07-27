class Rating < ApplicationRecord
  belongs_to :review, optional: true
end
