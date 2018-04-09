class Image < ApplicationRecord
  attr_accessor :crop_x, :crop_y, :crop_width, :crop_height
  belongs_to :product, optional: true
  belongs_to :step, optional: true
  mount_uploader :image, ImageUploader
  # after_update :recreate_images

  # def recreate_images
  #   image.recreate_versions! if crop_x.present?
  # end

  def crop_image
    cropped_image = MiniMagick::Image.open(self.image.path)
    crop_params = "#{crop_width}x #{crop_height}+ #{crop_x}+ #{crop_y}"
    update(image: cropped_image.crop(crop_params))
  end
end
