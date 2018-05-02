source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end
ruby '2.5.1'
gem 'rails', '~> 5.2'
gem 'puma', '~> 3.7'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'turbolinks', '~> 5'
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'bootstrap', '4.0.0.beta'
gem 'devise'
gem 'devise_invitable'
gem 'high_voltage'
gem 'pg'
group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'meta_request'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'better_errors'
  gem 'foreman'
  gem 'guard-bundler'
  gem 'guard-rails'
  gem 'guard-rspec'
  gem 'guard-zeus'
  gem 'guard-livereload', '~> 2.5', require: false
  gem 'binding_of_caller', '>= 0.8.0'
  gem 'hub', :require => nil
  gem 'rails_layout'
  gem 'rb-fchange', :require => false
  gem 'rb-fsevent', :require => false
  gem 'rb-inotify', :require => false
  gem 'spring-commands-rspec'
  gem "letter_opener"
end
group :development, :test do
  gem 'bootsnap', require: false
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'rspec-rails'
  gem 'puts_debuggerer', '~> 0.7.1'
  gem 'factory_bot_rails'
  gem 'pry-rails'
  gem 'pry-rescue'
  gem 'pry-byebug'
  gem 'capybara'
  gem 'capybara-webkit'
  gem 'rubocop'
  gem 'dotenv-rails'

end
group :test do
  gem 'database_cleaner'
  gem 'launchy'
  gem 'selenium-webdriver'
end
gem 'font-awesome-rails'


gem 'carrierwave', '~> 1.0'
gem 'mini_magick'
gem 'rmagick'


gem 'webpacker', git: 'https://github.com/rails/webpacker.git'


gem 'wicked'


gem 'client_side_validations'


gem 'redis'
gem 'hiredis'

gem 'trix'

gem 'omniauth-stripe-connect'

gem 'stripe'


gem 'validates_email_format_of'

gem 'faker'


gem 'material_icons'

gem 'rack-cors', github: 'cyu/rack-cors'

gem 'active_model_serializers', '~> 0.10.0'


gem 'carrierwave-aws'


gem "reform"
gem 'reform-rails'
