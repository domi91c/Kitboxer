class AddImpressionsToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :impressions, :integer
  end
end
