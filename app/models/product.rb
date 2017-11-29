class Product < ApplicationRecord
  belongs_to :user
  has_many :purchases
  has_many :images, dependent: :destroy

  validates_presence_of :title, if: -> { required_for_step?(:add_description) }
  validates_presence_of :category, if: -> { required_for_step?(:add_description) }
  validates_presence_of :tagline, if: -> { required_for_step?(:add_description) }
  validates_presence_of :body, if: -> { required_for_step?(:add_description) }
  validates_presence_of :price, if: -> { required_for_step?(:add_description) }
  validates_presence_of :body, if: -> { required_for_step?(:add_description) }
  # validate :has_images, if: -> { required_for_step?(:add_images) }

  def has_images
    unless images.present?
      errors.add(:product, "must include at least one image")
    end
  end

  cattr_accessor :form_steps do
    %w(add_description add_images add_shipping)
  end
  attr_accessor :form_step

  accepts_nested_attributes_for :images

  def required_for_step?(step)
    # All fields are required if no form step is present
    return true if form_step.nil?
    # All fields from previous steps are required if the
    # step parameter appears before or we are on the current step
    return true if self.form_steps.index(step.to_s) <= self.form_steps.index(form_step)
  end

  def cover_image
    (ci = images.where(cover_image: true).first) ? ci.image : images.first.image
  end

  def cover_thumb
    cover_image.thumb
  end

  def self.search(search)
    where("title ILIKE ?", "%#{search}%")
    # where("body ILIKE ?", "%#{search}%")
  end

  def self.with_images
    includes(:images).where.not(:images => { :image => nil })
  end

end
