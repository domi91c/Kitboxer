json.extract! product, :id, :title, :body, :tagline, :user_id, :price, :quantity, :created_at, :updated_at
json.url product_url(product, format: :json)
