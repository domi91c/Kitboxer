class Products::BuildController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update,]
  include Wicked::Wizard
  steps *Product.form_steps

  def show
    @tutorial = @product.tutorial || @product.create_tutorial
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
    @product.update(product_params(step))
    render_wizard(@product, {}, { product_id: params[:product_id] })
  end

  private

  def set_product
    @product = Product.find(params[:product_id])
  end

  def product_params(step)
    permitted_attributes = case step
                           when 'add_description'
                             [:title, :price, :tagline, :category, :body]
                           when 'add_images'
                             [images_attributes: [:image, :image_id, :user_id]]
                           when 'add_tutorial'
                             [tutorial_attributes: [:image, :image_id, :user_id]]
                           end
    params.require(:product).permit(permitted_attributes).merge(form_step: step)
  end

  def finish_wizard_path(params)
    product_path(params[:product_id])
  end
end

