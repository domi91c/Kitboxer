class DropSpreeTables < ActiveRecord::Migration[5.1]
  def change
    spree_tables = ActiveRecord::Base.connection.tables.grep(/^spree.*/)
    spree_tables.each do |st|
      drop_table "#{st}"
    end
  end
end
