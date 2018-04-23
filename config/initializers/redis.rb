$redis = Redis.new(driver: :hiredis)

class Redis
  def hdelall(key)
    r = Redis.new
    keys = r.hgetall(key).keys
    r.pipelined do
      keys.each do |k|
        r.hdel key, k
      end
    end
  end
end

