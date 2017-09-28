class CreatePurchases < ActiveRecord::Migration[5.1]
  def change
    create_table :purchases do |t|
      t.string :product_id
      t.string :quantity
      t.string :order_id

      t.timestamps
    end
  end
end
