class Products::BuildController < ApplicationController
  include Wicked::Wizard
  steps *Product.form_steps

  def show
    @product = Product.find(params[:product_id])
    @product.tutorial = Tutorial.new unless @product.tutorial
    @tutorial = @product.tutorial
    @serialized_product = ActiveModel::Serializer::Adapter::Json
                              .new(ProductSerializer.new(@product))
                              .serializable_hash
    @serialized_tutorial = ActiveModel::Serializer::Adapter::Json
                               .new(TutorialSerializer.new(@tutorial))
                               .serializable_hash
    render_wizard(nil, {}, { product_id: params[:product_id] })
  end

  def edit

  end

  def update
    @product = Product.find(params[:product_id])
    @product.update(product_params(step))
    render_wizard(@product, {}, { product_id: params[:product_id] })
  end

  private

  def product_params(step)
    permitted_attributes = case step
                           when 'add_description'
                             [:title, :price, :tagline, :category, :body]
                           when 'add_images'
                             [images_attributes: [:image, :image_id, :user_id]]
                           when 'add_tutorial'
                             [images_attributes: [:image, :image_id, :user_id]]
                           end

    params.require(:product).permit(permitted_attributes).merge(form_step: step)
  end

  def finish_wizard_path(params)
    product_path(params[:product_id])
  end
end

