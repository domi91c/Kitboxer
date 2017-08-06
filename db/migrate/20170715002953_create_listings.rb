class Createproducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
      t.string :title
      t.text :body
      t.string :tagline
      t.references :user, foreign_key: true
      t.float :price
      t.integer :quantity

      t.timestamps
    end
  end
end
