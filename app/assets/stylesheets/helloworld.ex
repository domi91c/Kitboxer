defmodule Helloworld do
  @moduledoc false
  
  use Application

  def start(_type, _args) do
    Helloworld.Supervisor.start_link()
  end
end