class CreateTutorialTable < ActiveRecord::Migration[5.1]
  def change
    create_table :tutorial_tables do |t|
      t.string :product_id
    end
  end
end
