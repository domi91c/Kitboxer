class TutorialForm < Reform::Form

  property :product_id

  collection :steps, populator: -> (collection:, index:, **) do
    if item = collection[index]
      item
    else
      collection.insert(index, Step.new)
    end
  end do
    property :title
    property :body
    validates :title, presence: true
    validates :body, presence: true
    collection :images, populator: -> (collection:, index:, **) do
      if item = collection[index]
        item
      else
        collection.insert(index, Image.new)
      end
    end do
      property :image
      validates :image, presence: true
    end
  end

end