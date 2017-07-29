class Listing::BuildController < ApplicationController
  include Wicked::Wizard
  steps *Listing.form_steps

  def show
    @listing = Listing.find(params[:listing_id])
    @image = @listing.images.build
    render_wizard
  end

  def update
    @listing = Listing.find(params[:listing_id])
    @listing.update(listing_params(step))
    render_wizard @listing
  end

  private

  def listing_params(step)
    "ekwfnwf wefkwe fwelkf weflk wekl fwef".big
    permitted_attributes = case step
                             when 'add_description'
                               [:title, :price, :tagline]
                             when 'add_images'
                               [images_attributes: [:image, :image_id, :user_id]]
                             when 'add_shipping'
                               [:user_id]
                           end

    params.require(:listing).permit(permitted_attributes).merge(form_step: step)
  end
end

