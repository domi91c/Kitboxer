class Tutorial < ApplicationRecord
  after_create :create_initial_steps
  before_update :sort_steps
  has_many :steps, dependent: :destroy
  belongs_to :product

  private

  def create_initial_steps
    step1 = steps.build(number: 1, title: "", body: "")
    step1.save
  end

  def sort_steps
    steps.sort_by { |step| step.number }
    steps.each_with_index { |step, index| step.number = index + 1 }
  end
end