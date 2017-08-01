class Listing < ApplicationRecord
  # belongs_to :user
  has_many :images, dependent: :destroy

  cattr_accessor :form_steps do
    %w(add_description add_images add_shipping)
  end
  attr_accessor :form_step

  accepts_nested_attributes_for :images
end
