class AddproductIdToImages < ActiveRecord::Migration[5.1]
  def change
    add_column :images, :product_id, :integer
  end
end
