class ImagesController < ApplicationController

  def create
    binding.pry
  end


    def image_params
        params.require(:image_params).permit()
      end
end
