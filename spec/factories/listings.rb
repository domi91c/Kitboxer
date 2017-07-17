FactoryGirl.define do
  factory :listing do
    title "MyString"
    body "MyText"
    tagline "MyString"
    user nil
    price 1.5
    quantity 1
  end
end
