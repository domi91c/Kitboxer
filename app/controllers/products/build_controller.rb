class Products::BuildController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update,]
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
    params.require(:product).permit(permitted_attributes).merge(form_step: step)
  end

  def finish_wizard_path(params)
    case params[:submit].to_sym
    when :publish
      Product.find(params[:product_id]).publish
      flash[:notice] = "Your product has been published."
      return product_path(params[:product_id])
    when :create_tutorial
      flash[:notice] = "Saved product as draft."
      return new_product_tutorial_path(params[:product_id])
    when :save_draft
      flash[:notice] = "Saved product as draft."
      return user_path(current_user)
    when :cancel
      Product.find(params[:product_id]).destroy
      return user_path(current_user)
    end
  end

end
