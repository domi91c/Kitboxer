class RenameListingsToProducts < ActiveRecord::Migration[5.1]
  def change
    rename_table :listings, :products
  end
end
