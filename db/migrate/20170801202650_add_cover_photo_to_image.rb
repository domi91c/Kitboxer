class AddCoverPhotoToImage < ActiveRecord::Migration[5.1]
  def change
    add_column :images, :cover_photo, :boolean
  end
end
