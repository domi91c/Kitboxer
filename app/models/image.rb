class Image < ApplicationRecord
  attr_accessor :crop_x, :crop_y, :crop_width, :crop_height
  belongs_to :product, optional: true
  belongs_to :step, optional: true
  mount_uploader :image, ImageUploader
  after_update :recreate_images
  after_update :recreate_images
  after_update :recreate_images
  after_update :recreate_images
  after_update :recreate_images

  def recreate_images
    image.default.recreate_versions! if crop_x.present?
  end
end
