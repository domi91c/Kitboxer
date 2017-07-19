Rails.application.routes.draw do
  resources :listings, shallow: true do
    resources :images
  end
  root to: 'visitors#index'
  devise_for :users
  resources :users
end
