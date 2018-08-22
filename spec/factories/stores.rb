FactoryBot.define do
  factory :store do
    name "Creatron"
    association(:user)
  end
end
