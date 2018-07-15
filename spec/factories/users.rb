FactoryBot.define do
  factory :user do
    confirmed_at Time.now
    first_name Faker::Name.first_name
    last_name Faker::Name.last_name
    sequence(:email) { |n| "user#{n}@factory.com" }
    password "password"
  end
end
