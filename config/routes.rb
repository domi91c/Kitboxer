Rails.application.routes.draw do
  resources :listings do
    resources :build, controller: 'listing/build'
    resources :images, controller: 'listing/images' do
      member do
        patch :set_cover_image


      end
    end
  end

  root to: 'visitors#index'
  devise_for :users
  resources :users
end
