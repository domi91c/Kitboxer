require 'rspec'

describe 'Shopping Cart' do
  before(:each) do
    $redis.flushdb
  end

  it 'should add a #product to the #cart' do
    user = create(:user)
    sign_in(user.email, user.password)
    product = create(:product)
    visit product_path(1)
    click_button "Add to Cart"
    expect 
  end
end