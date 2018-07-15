FactoryBot.define do
  factory :product do
    title 'Robot Bust Funk Destroyer Kit'
    body 'Hey everyone. This kit is the best thing you\'ll ever buy. It is a robot that busts funk and destroys shit.'
    tagline 'The kit of a lifetime.'
    category 'Arduino'
    association(:user)
    price 49.99
    quantity 10
    after :new do |product|
      create_list :image, 3, product: product
    end
  end
end
