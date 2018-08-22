class Image < ApplicationRecord
  attr_accessor :crop_x, :crop_y, :crop_width, :crop_height
  belongs_to :imageable, polymorphic: true
  belongs_to :product, optional: true
  belongs_to :step, optional: true
  mount_uploader :image, ImageUploader
  # after_update :recreate_images

  # def recreate_images
  #   image.recreate_versions! if crop_x.present?
  # end

  def crop_image
    cropped_image = MiniMagick::Image.open(self.image.url)
    binding.pry
    crop_params = "#{crop_width}x #{crop_height}+ #{crop_x}+ #{crop_y}"
    update(image: image.crop(crop_params))
  end
end
