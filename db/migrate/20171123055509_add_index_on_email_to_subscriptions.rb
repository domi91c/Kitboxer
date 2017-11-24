class AddIndexOnEmailToSubscriptions < ActiveRecord::Migration[5.1]
  def change
    add_index :subscriptions, :email, unique: true
  end
end
