Rails.application.routes.draw do
  get 'carts/show'

  resources :products do
    resources :build, controller: 'product/build'
    resources :images, controller: 'product/images' do
      member do
        patch :set_cover_image


      end
    end
  end

  resource :cart, only: [:show] do
    put 'add/:product_id', to: 'carts#add', as: :add_to
    put 'remove/:product_id', to: 'carts#remove', as: :remove_from
  end

  root to: 'visitors#index'
  devise_for :users
  resources :users
end
