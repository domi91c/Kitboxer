FactoryBot.define do
  factory :image do
    image File.new(Rails.root.join('spec', 'assets', '1.png'))
    cover_image true
    product_id 1
  end
end
