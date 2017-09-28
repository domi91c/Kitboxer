class CreateOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders do |t|
      t.string :user_id
      t.string :stripe_receipt_number

      t.timestamps
    end
  end
end
