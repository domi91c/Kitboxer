class Image < ApplicationRecord
  include Rails.application.routes.url_helpers(:host => "localhost:3002")

  has_one_attached :attachment
  attr_accessor :crop_x, :crop_y, :crop_width, :crop_height, :product_id
  belongs_to :product, optional: true
  belongs_to :step, optional: true
  after_create :set_original_url

  def set_original_url
    if attachment.present?
      self.original_url = url_for(attachment)
      self.url = self.original_url
      save
    end
  end

  def set_urls
    if crop_x.present?
      x = crop_x.to_i
      y = crop_y.to_i
      w = crop_width.to_i
      h = crop_height.to_i
      self.processed_url = url_for(attachment.variant(combine_options: { crop: "#{w}x #{h}+ #{x}+ #{y}" }))
      self.url = self.processed_url
      save
    else
      self.url = url_for(attachment)
      save
    end
  end
end
