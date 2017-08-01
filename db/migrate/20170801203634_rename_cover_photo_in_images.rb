class RenameCoverPhotoInImages < ActiveRecord::Migration[5.1]
  def change
    rename_column :images, :cover_photo, :cover_image
  end
end
