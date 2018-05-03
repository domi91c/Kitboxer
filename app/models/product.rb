class Product < ApplicationRecord
  belongs_to :user

  has_many :images, dependent: :destroy
  has_one :tutorial, dependent: :destroy

  has_many :favorites, dependent: :destroy

  has_many :purchases
  has_many :reviews, through: :purchases

  validates :title, presence: true, if: -> { required_for_step?(:add_description) }
  validates :category, presence: true, if: -> { required_for_step?(:add_description) }
  validates :tagline, presence: true, if: -> { required_for_step?(:add_description) }
  validates :body, presence: true, if: -> { required_for_step?(:add_description) }
  validates :price, presence: true, if: -> { required_for_step?(:add_description) }
  validates :body, presence: true, if: -> { required_for_step?(:add_description) }
  validates :price, presence: true, numericality: true, if: -> { required_for_step?(:add_description) }
  validates :quantity, presence: true, numericality: { only_integer: true }, if: -> { required_for_step?(:add_description) }
  validate :has_images, if: -> { required_for_step?(:add_images) }

  # scope :published?, -> { where(published: true) }
  # scope :unpublished?, -> { where(published: false) }
  scope :favorited_by, -> (user) { joins(:favorites).where(favorites: { user: User.find(user.id) }) }

  def favorited_by?(user)
    favorites.where(user: User.find(user.id)).any?
  end

  def publish
    published = true
    save
  end

  def has_images
    unless images.present?
      errors.add(:product, "must include at least one image")
    end
  end

  cattr_accessor :form_steps do
    %w(add_description add_images preview)
  end
  attr_accessor :form_step

  accepts_nested_attributes_for :images
  accepts_nested_attributes_for :tutorial

  def required_for_step?(step)
    # All fields are required if no form step is present
    return true if form_step.nil?
    # All fields from previous steps are required if the
    # step parameter appears before or we are on the current step
    true if self.form_steps.index(step.to_s) <= self.form_steps.index(form_step)
  end

  def cover_image
    (ci = images.where(cover_image: true).first) ? ci.image : images.first.image
  end

  def cover_thumb
    cover_image.thumb
  end

  def self.search(search)
    where("title ILIKE ?", "%#{search}%").or(where("body ILIKE ?", "%#{search}%"))
  end

  def self.with_images
    includes(:images).where.not(:images => { :image => nil })
  end


  def reviews_average(context = nil)
    if reviews.any?
      sum = 0
      reviews.each do |review|
        sum += review.ratings_average(context)
      end
      sum / reviews.count
    else
      0
    end
  end

end
