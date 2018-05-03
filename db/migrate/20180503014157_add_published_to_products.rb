class AddPublishedToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :published, :boolean
  end
end
