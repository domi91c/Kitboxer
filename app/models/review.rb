class Review < ApplicationRecord
  belongs_to :user
  belongs_to :purchase, optional: true
  has_many :ratings, dependent: :destroy

  accepts_nested_attributes_for :ratings, allow_destroy: true


  def ratings_average(context = nil)
    if context
      ratings.where(context: context).average(:score)
    else
      ratings.all.average(:score)
    end
  end

end
