json.extract! listing, :id, :title, :body, :tagline, :user_id, :price, :quantity, :created_at, :updated_at
json.url listing_url(listing, format: :json)
