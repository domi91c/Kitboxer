class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    create_table :steps do |t|
      t.references :tutorial, foreign_key: true
      t.string :title
      t.text :body

      t.timestamps
    end
  end
end
