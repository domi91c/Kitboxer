class AddListingIdToImages < ActiveRecord::Migration[5.1]
  def change
    add_column :images, :listing_id, :integer
  end
end
