Rails.application.routes.draw do

  devise_for :users, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      omniauth_callbacks: 'users/omniauth_callbacks'
  }

  namespace :my do
    resource :store, controller: 'store' do
      resources :products, controller: 'store/products'
      resources :conversations, controller: 'store/conversations' do
        collection do
          get :sent
          get :trash
        end
      end
      resources :reviews, controller: 'store/reviews'
    end
    resources :users
    resources :orders, only: :index do
      member do
        get :show_conversations
      end
    end
    resources :reviews, only: :index
    resources :favorites, only: :index
  end

  resources :stores
  resources :conversations do
    resources :messages, child: true, module: :conversations
  end

  resources :orders
  resources :purchases, controller: 'my/orders/purchases' do
    resource :review, controller: 'my/orders/purchases/review', only: [:show, :new, :create, :edit, :update], shallow: true
    resources :conversations, controller: 'my/orders/purchases/conversations' do
      resources :messages, controller: 'my/orders/purchases/conversations/messages', only: [:new, :create]
    end
  end
  resources :subscriptions

  resources :products do
    resources :reviews, module: :products
    resource :publish, module: :products
    resources :build, controller: 'products/build'
    resources :favorites, controller: 'products/favorites', only: [:create, :update]
    resources :images, controller: 'products/images' do
      member do
        patch :set_cover_image
      end
    end
    resource :tutorial, controller: 'products/tutorial' do
      resources :steps, controller: 'products/tutorial/steps' do
        resources :images, controller: 'products/tutorial/steps/images'
      end
    end
  end


  resource :cart, only: [:show] do
    put 'add/:product_id', to: 'carts#add', as: :add_to
    get 'remove/:product_id', to: 'carts#remove', as: :remove_from
    put 'save_for_later/:product_id', to: 'carts#save_for_later', as: :save_for_later
  end

  root to: 'visitors#index'

  resources :dev do
    collection do
      get :user1
      get :user2
    end
  end
end
