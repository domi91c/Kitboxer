class AddProcessedUrlToImages < ActiveRecord::Migration[5.2]
  def change
    add_column :images, :processed_url, :string
  end
end
