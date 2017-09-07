git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end
ruby '2.4.0'
gem 'rails', '~> 5.1.2'
gem 'puma', '~> 3.7'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'
group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end
group :development do

  gem 'web-console', '>= 3.3.0'
  gem 'meta_request'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'bootstrap', '4.0.0.beta'
gem 'devise'
gem 'devise_invitable'
gem 'high_voltage'
gem 'pg'
group :development do
  gem 'better_errors'
  gem 'foreman'
  gem 'guard-bundler'
  gem 'guard-rails'
  gem 'guard-rspec'
  gem 'guard-livereload', '~> 2.5', require: false
  gem 'binding_of_caller'
  gem 'hub', :require => nil
  gem 'rails_layout'
  gem 'rb-fchange', :require => false
  gem 'rb-fsevent', :require => false
  gem 'rb-inotify', :require => false
  gem 'spring-commands-rspec'
end
group :development, :test do
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'pry-rails'
  gem 'pry-rescue'
  gem 'pry-byebug'
  gem 'rspec-rails'
  gem 'capybara'
  gem 'rubocop'
end
group :test do
  gem 'database_cleaner'
  gem 'launchy'
  gem 'selenium-webdriver'
end
gem "font-awesome-rails"

gem 'dotenv-rails', groups: [:development, :test]

gem 'carrierwave', '~> 1.0'
gem 'mini_magick'
gem 'rmagick'


gem 'webpacker', git: 'https://github.com/rails/webpacker.git'
gem 'rename'

gem 'puts_debuggerer', '~> 0.7.1'


gem 'wicked'


gem 'colorize'
gem 'client_side_validations'


gem 'redis'
gem 'hiredis'

gem 'trix'

gem "capybara-webkit"

gem 'omniauth-stripe-connect'

gem 'material_icons'

