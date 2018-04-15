class CreateSubscriptionsTable < ActiveRecord::Migration[5.1]
  def change
    create_table "subscriptions", force: :cascade do |t|
      t.string "email"
      t.boolean "active", default: true
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.index ["email"], name: "index_subscriptions_on_email", unique: true
    end
  end
end
