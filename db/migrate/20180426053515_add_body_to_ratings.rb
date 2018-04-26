class AddBodyToRatings < ActiveRecord::Migration[5.1]
  def change
    add_column :ratings, :body, :text
  end
end
