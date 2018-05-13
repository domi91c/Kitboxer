Rails.application.routes.draw do
  namespace :users do
    get 'reviews/index'
  end
  # global options responder -> makes sure OPTION request for CORS endpoints work
  #

  devise_for :users, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      omniauth_callbacks: 'users/omniauth_callbacks'
  }

  resources :users do
    resource :store, only: :show, controller: 'users/stores'
    resources :orders, only: :index, controller: 'users/orders'
    resources :reviews, only: :index, controller: 'users/reviews'
    resources :favorites, only: :index, controller: 'users/favorites'
  end

  resources :conversations do
    resources :messages, controller: 'conversations/messages'
  end

  resources :orders
  resources :charges
  resources :purchases do
    resources :review, controller: 'purchases/review', only: [:new, :create, :update]
    resources :conversations, controller: 'purchases/conversations' do
      resources :messages, controller: 'purchases/conversations/messages'
    end
  end
  resources :subscriptions

  resources :products do
    member do
      patch :publish
    end
    resources :build, controller: 'products/build'
    resources :favorites, controller: 'products/favorites', only: [:create, :update]
    resources :images, controller: 'products/images' do
      member do
        patch :set_cover_image
      end
    end
    resource :tutorial, controller: 'products/tutorial' do
      resources :images, controller: 'products/tutorial/images'
      resources :steps, controller: 'products/tutorial/steps'
    end
  end


  resource :cart, only: [:show] do
    put 'add/:product_id', to: 'carts#add', as: :add_to
    get 'remove/:product_id', to: 'carts#remove', as: :remove_from
    put 'save_for_later/:product_id', to: 'carts#save_for_later', as: :save_for_later
  end

  root to: 'visitors#index'

end
