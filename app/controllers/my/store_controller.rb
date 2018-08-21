class My::StoreController < ApplicationController
  layout :resolve_layout
  before_action :set_store

  def new

  end

  def edit
  end

  def create
    @store = current_user.build_store(store_params)
    respond_to do |format|
      if @store.save
        format.html { redirect_to @store, notice: "You're ready for business!" }
        format.json { render :show, status: :ok, location: @store }
      else
        format.html { render :new }
        format.json { render json: @store.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    redirect_to new_my_store_path unless @store
    @products = current_user.products.with_images
    @notifications = current_user.mailbox.notifications
  end

  private

  def resolve_layout
    case action_name
    when "new", "create"
      "application"
    else
      "my_store"
    end
  end

  def set_store
    @store = current_user.store
  end

  def store_params
    params.require(:store).permit(:name)
  end
end

