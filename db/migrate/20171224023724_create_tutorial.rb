class CreateTutorial < ActiveRecord::Migration[5.1]
  def change
    create_table :tutorials do |t|
      t.integer :product_id
    end
  end
end
