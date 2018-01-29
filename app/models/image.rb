class Image < ApplicationRecord
  attr_accessor :crop_data
  belongs_to :product, optional: true
  belongs_to :step, optional: true
  mount_uploader :image, ImageUploader
  after_update :recreate_images

  def recreate_images
    image.recreate_versions! if crop_data.present?
  end

  def crop_image
    cropped_image = MiniMagick::Image.open(self.image.path)
    crop_params =
        "#{crop_data["width"]}x
         #{crop_data["height"]}+
         #{crop_data["x"]}+
         #{crop_data["y"]}"
    update(image: cropped_image.crop(crop_params))
  end

  def image_json
    {
        productId: this.productId,
        file: e.target.files[i],
        formData: {},
        progress: 0,
        url: '',
        coverImage: false,
    }
  end
end
