class TutorialForm < Reform::Form
  property :product_id
  collection :steps, populator: -> (collection:, index:, **) {
    (item = collection[index]) ? item : collection.insert(index, Step.new)
  } do
    property :title
    property :body
    validates :title, presence: true
    validates :body, presence: true
    collection :images, populator: -> (collection:, index:, **) do
      if (item = collection[index])
        item
      else
        collection.insert(index, Image.new)
      end
    end do
      property :image
    end
  end
end