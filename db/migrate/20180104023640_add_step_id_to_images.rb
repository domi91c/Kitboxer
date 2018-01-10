class AddStepIdToImages < ActiveRecord::Migration[5.1]
  def change
    add_column :images, :step_id, :integer
  end
end
