class AddCategoryToListing < ActiveRecord::Migration[5.1]
  def change
    add_column :listings, :category, :string
  end
end
