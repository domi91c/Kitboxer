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

# user = User.new(
#     first_name: 'Dominic',
#     last_name: 'Nunes',
#     email: 'dominic.n@me.com',
#     password: 'password',
#     password_confirmation: 'password',
# )
# user.confirmed_at = Time.now
# user.save!

100.times do |i|
  user = User.new(
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      email: "user#{i}@gmail.com",
      password: 'password',
      password_confirmation: 'password',
  )
  user.confirmed_at = Time.now
  user.save!

end

(1...100).each do |i|
  product = Product.new(
      title: Faker::Commerce.product_name,
      tagline: Faker::HarryPotter.quote,
      body: Faker::Hipster.paragraph(2, true),
      price: rand(100),
      quantity: rand(1...20),
      category: Faker::Commerce.department(1),
      user_id: rand(100),
  )
  (1...(rand(5))).each do
    product.images.new(
        image: File.open(File.join(Rails.root,
                                   'app', 'assets', 'images', 'kits', "#{rand(20)}.png")),
    )
  end
  product.save
  p product.images
end

Product.all.each do |product|
  tutorial = product.create_tutorial
  (1...(rand(4))).each do
    tutorial.steps.new
  end
  tutorial.steps.each_with_index do |step, index|
    step.number = index + 1
    step.title = Faker::Hipster.sentence
    step.body = Faker::Hipster.paragraph(1, true)
    step.images << Image.new(image: File.open(File.join(Rails.root,
                                                        'app', 'assets', 'images', 'kits', "#{rand(20)}.png")))
    step.save!
  end
  tutorial.save
end



