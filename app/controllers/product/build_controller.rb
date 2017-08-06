class product::BuildController < ApplicationController
  include Wicked::Wizard
  steps *product.form_steps

  def show
    @product = product.find(params[:product_id])
    @image = @product.images.build
    render_wizard
  end

  def update
    @product = product.find(params[:product_id])
    @product.update(product_params(step))
    render_wizard @product
  end

  private

  def product_params(step)
    "ekwfnwf wefkwe fwelkf weflk wekl fwef".big
    permitted_attributes = case step
                             when 'add_description'
                               [:title, :price, :tagline]
                             when 'add_images'
                               [images_attributes: [:image, :image_id, :user_id]]
                             when 'add_shipping'
                               [:user_id]
                           end

    params.require(:product).permit(permitted_attributes).merge(form_step: step)
  end
end

