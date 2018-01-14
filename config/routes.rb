Rails.application.routes.draw do
  devise_for :users, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      omniauth_callbacks: 'users/omniauth_callbacks'
  }

  resources :users do
    resource :store, only: :show, controller: 'users/stores'
  end

  resources :orders
  resources :charges
  resources :purchases
  resources :posts
  resources :subscriptions

  resources :products do
    resources :build, controller: 'products/build'
    resources :images, controller: 'products/images' do
      member do
        patch :set_cover_image
      end
    end
    resource :tutorial, controller: 'products/tutorial' do
      resources :images, controller: 'products/tutorial/images'
    end
  end


  resource :cart, only: [:show] do
    put 'add/:product_id', to: 'carts#add', as: :add_to
    get 'remove/:product_id', to: 'carts#remove', as: :remove_from
  end

  root to: 'visitors#index'

end
