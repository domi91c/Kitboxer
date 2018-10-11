require 'rails_helper'

describe Store, type: :model do
  let(:store) { create(:store) }
  subject { store }

  it 'should have an image' do
    expect(store.images.count).to eq(0)
  end
end
