# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# user = CreateAdminService.new.call
# puts 'CREATED ADMIN USER: ' << user.email
# Environment variables (ENV['...']) can be set in the file .env file.

(1...50).each do |i|
  product = Product.new(
      title: Faker::Commerce.product_name,
      tagline: Faker::HarryPotter.quote,
      body: Faker::Hipster.paragraph(2, true),
      price: rand(100),
      quantity: rand(1...20),
      category: Faker::Commerce.department(1),
      user_id: 1,
  )
  product.save!

  (1...(rand(5))).each do |ii|
    image = Image.new(
        image: File.open(File.join(Rails.root,
                                   'app', 'assets', 'images', 'kits', "#{rand(20)}.png")),
        product_id: i,
    )
    image.save!
  end
end


