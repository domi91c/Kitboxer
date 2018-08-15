class Products::BuildController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update]
  include Wicked::Wizard
  steps *Product.form_steps

  def show
    @serialized_product = ActiveModel::Serializer::Adapter::Json
                              .new(ProductSerializer.new(@product))
                              .serializable_hash
    submit = params[:submit] if params[:submit]
    render_wizard(nil, {}, { product_id: params[:product_id], submit: submit })
  end

  def edit
  end

  def update
    @product.update(product_params(step))
    submit = params[:submit].keys.first if params[:submit]
    render_wizard(@product, {}, { product_id: params[:product_id], submit: submit })
  end

  private

  def set_product
    @product = Product.find(params[:product_id])
  end

  def product_params(step)
    permitted_attributes = case step
                           when 'add_description'
                             [:title, :price, :tagline, :category, :body, :quantity]
                           when 'add_images'
                             [images_attributes: [:image, :image_id, :user_id]]
                           when 'preview'
                             [tutorial_attributes: [:image, :image_id, :user_id]]
                           end
    params.require(:product).permit(permitted_attributes).merge(form_step: step, store_id: current_user.store.id)
  end

  def finish_wizard_path(params)
    product = Product.find(params[:product_id])
    case params[:submit].to_sym
    when :publish
      product.publish
      flash[:notice] = "Your product has been published."
      product_path(product)
    when :create_tutorial
      flash[:notice] = "Saved product as draft."
      new_product_tutorial_path(product)
    when :save_draft
      flash[:notice] = "Saved product as draft."
      product_path(product)
    when :cancel
      product.destroy
      flash[:warning] = "Your product was deleted."
      user_path(current_user)
    end
  end
end
