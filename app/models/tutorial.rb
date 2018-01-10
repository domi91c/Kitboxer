class Tutorial < ApplicationRecord
  after_create :create_initial_steps
  has_many :steps
  belongs_to :product

  private
  def create_initial_steps
    step1 = steps.build(title: "This is a step title", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in rutrum lectus, feugiat blandit mi. Suspendisse potenti. Nulla sollicitudin posuere rutrum. Vivamus sodales nunc eu laoreet blandit. ")
    step2 = steps.build(title: "This is a step title for another step", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in rutrum lectus, feugiat blandit mi. Suspendisse potenti. Nulla sollicitudin posuere rutrum. Vivamus sodales nunc eu laoreet blandit. ")
    step1.save
    step2.save
  end
end