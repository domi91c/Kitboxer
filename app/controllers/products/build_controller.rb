class Products::BuildController < ApplicationController
  include Wicked::Wizard
  steps *Product.form_steps

  def show
    @product = Product.find(params[:product_id])
    @product.tutorial = Tutorial.new unless @product.tutorial
    @tutorial = @product.tutorial
    render_wizard
  end

  def update
    @product = Product.find(params[:product_id])
    @product.update(product_params(step))
    render_wizard @product
  end

  private

  def product_params(step)
    permitted_attributes = case step
                             when 'add_description'
                               [:title, :price, :tagline, :category, :body]
                             when 'add_images'
                               [images_attributes: [:image, :image_id, :user_id]]
                             when 'add_tutorial'
                               [:user_id]
                           end

    params.require(:product).permit(permitted_attributes).merge(form_step: step)
  end
end

