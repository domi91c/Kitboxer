class RemoveTutorialTable < ActiveRecord::Migration[5.1]
  def change
    drop_table :tutorial_tables
  end
end
