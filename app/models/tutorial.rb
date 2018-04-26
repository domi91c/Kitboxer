class Tutorial < ApplicationRecord
  after_create :create_initial_steps
  has_many :steps, dependent: :destroy
  belongs_to :product

  accepts_nested_attributes_for :steps

  private

  def create_initial_steps
    step1 = steps.build(number: 1, title: "", body: "")
    step1.save
  end
end