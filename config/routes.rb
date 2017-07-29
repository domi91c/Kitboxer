Rails.application.routes.draw do
  resources :listings do
    resources :build, controller: 'listing/build'
    resources :images, controller: 'listing/images'
  end

  root to: 'visitors#index'
  devise_for :users
  resources :users
end
