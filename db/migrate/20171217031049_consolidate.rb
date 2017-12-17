class Consolidate < ActiveRecord::Migration[5.1]
  def change
    # These are extensions that must be enabled in order to support this database
    enable_extension "plpgsql"

    create_table "guides", id: :serial, force: :cascade do |t|
      t.integer "kit_id"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end

    create_table "images", force: :cascade do |t|
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "image"
      t.integer "product_id"
      t.boolean "cover_image"
    end

    create_table "kits", id: :serial, force: :cascade do |t|
      t.string "title"
      t.text "description"
      t.integer "user_id"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end

    create_table "orders", force: :cascade do |t|
      t.string "user_id"
      t.string "stripe_receipt_number"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "stripe_charge_id"
    end

    create_table "products", force: :cascade do |t|
      t.string "title"
      t.text "body"
      t.string "tagline"
      t.bigint "user_id"
      t.float "price"
      t.integer "quantity"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "category"
      t.index ["user_id"], name: "index_products_on_user_id"
    end

    create_table "purchases", force: :cascade do |t|
      t.string "product_id"
      t.string "quantity"
      t.string "order_id"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end
    create_table "users", force: :cascade do |t|
      t.string "email", default: "", null: false
      t.string "encrypted_password", default: "", null: false
      t.string "reset_password_token"
      t.datetime "reset_password_sent_at"
      t.datetime "remember_created_at"
      t.integer "sign_in_count", default: 0, null: false
      t.datetime "current_sign_in_at"
      t.datetime "last_sign_in_at"
      t.inet "current_sign_in_ip"
      t.inet "last_sign_in_ip"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "name"
      t.string "confirmation_token"
      t.datetime "confirmed_at"
      t.datetime "confirmation_sent_at"
      t.string "unconfirmed_email"
      t.string "invitation_token"
      t.datetime "invitation_created_at"
      t.datetime "invitation_sent_at"
      t.datetime "invitation_accepted_at"
      t.integer "invitation_limit"
      t.string "invited_by_type"
      t.bigint "invited_by_id"
      t.integer "invitations_count", default: 0
      t.string "publishable_key"
      t.string "provider"
      t.string "uid"
      t.string "access_code"
      t.string "stripe_customer_id"
      t.string "first_name"
      t.string "last_name"
      t.index ["email"], name: "index_users_on_email", unique: true
      t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
      t.index ["invitations_count"], name: "index_users_on_invitations_count"
      t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
      t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
      t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    end

    add_foreign_key "products", "users"
  end
end