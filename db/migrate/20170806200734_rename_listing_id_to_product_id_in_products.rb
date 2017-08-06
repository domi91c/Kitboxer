class RenameListingIdToProductIdInProducts < ActiveRecord::Migration[5.1]
  def change
    rename_column :images, :listing_id, :product_id
  end
end
