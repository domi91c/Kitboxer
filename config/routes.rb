Rails.application.routes.draw do
  devise_for :users, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      omniauth_callbacks: "users/omniauth_callbacks"
  }

  resources :orders
  resources :users
  resources :charges
  resources :purchases
  resources :posts

  resources :subscriptions

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

end
