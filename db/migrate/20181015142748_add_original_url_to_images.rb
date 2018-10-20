class AddOriginalUrlToImages < ActiveRecord::Migration[5.2]
  def change
    add_column :images, :original_url, :string
  end
end
