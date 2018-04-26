class AddSummaryAndBodyToReviews < ActiveRecord::Migration[5.1]
  def change
    add_column :reviews, :summary, :string
    add_column :reviews, :body, :text
  end
end
