user = User.new(
    first_name: 'Dominic',
    last_name: 'Nunes',
    email: 'dominic.n@me.com',
    password: 'password',
    password_confirmation: 'password',
)
user.confirmed_at = Time.now
user.save!
user.create_store(name: 'Dominic\'s Store')

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
  user.create_store(name: Faker::Company.name)
end

# (1...100).each do |i|
#   product = Product.new(
#       title: Faker::Commerce.product_name,
#       tagline: Faker::HarryPotter.quote,
#       body: Faker::Hipster.paragraph(2, true),
#       price: rand(100),
#       quantity: rand(1...20),
#       category: Faker::Commerce.department(1),
#       store_id: rand(100),
#   )
#   (1...(rand(5))).each do
#     product.images.new(
#         image: File.open(File.join(Rails.root,
#                                    'app', 'assets', 'images', 'kits', "#{rand(20)}.png")),
#     )
#   end
#   product.save!
#   p product
# end
#
# Product.all.each do |product|
#   tutorial = product.create_tutorial
#   (1...(rand(4))).each do
#     tutorial.steps.new
#   end
#   tutorial.steps.each_with_index do |step, index|
#     step.number = index + 1
#     step.title = Faker::Hipster.sentence
#     step.body = Faker::Hipster.paragraph(1, true)
#     step.images << Image.new(image: File.open(File.join(Rails.root,
#                                                         'app', 'assets', 'images', 'kits', "#{rand(20)}.png")))
#     step.save!
#   end
#   tutorial.save
# end
