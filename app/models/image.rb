class Image < ApplicationRecord
  attr_accessor :crop_data
  belongs_to :product
  mount_uploader :image, ImageUploader
  after_update :crop_image


  # not working
  def crop_image
    image.recreate_versions! if crop_data.present?
  end

  # def crop_image
  #   image = MiniMagick::Image.open(self.image.path)
  #   crop_params =
  #       "#{ crop_data["width"]}x
  #        #{crop_data["height"]}+
  #        #{crop_data["x"]}+
  #        #{crop_data["y"]}"
  #   image.crop(crop_params)
  # end

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
