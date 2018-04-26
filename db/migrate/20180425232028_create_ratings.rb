class CreateRatings < ActiveRecord::Migration[5.1]
  def change
    create_table :ratings do |t|
      t.references :review, foreign_key: true
      t.string :context
      t.integer :score

      t.timestamps
    end
  end
end
