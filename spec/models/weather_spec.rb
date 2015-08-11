require 'rails_helper'

RSpec.describe Weather, type: :model do
  describe "valid attributes" do
    it "has a min temp if max temp is nil" do
      weather = Weather.new(min_temp: 80, max_temp: nil)
      expect(weather).to be_valid
    end

    it "has a max temp if min temp is nil" do
      weather = Weather.new(min_temp: nil, max_temp: 60)
      expect(weather).to be_valid
    end

    it "is valid if it has both a min temp and a max temp" do
      weather = Weather.new(min_temp: 70, max_temp: 80)
      expect(weather).to be_valid
    end
  end

  describe "invalid attributes" do
    it "is invalid if both min temp and max temp are empty" do
      weather = Weather.new(min_temp: nil, max_temp: nil)
      expect(weather).to_not be_valid
    end

    it "is invalid if the min temp is greater than the max temp" do
      weather = Weather.new(min_temp: 80, max_temp: 70)
      expect(weather).to_not be_valid
    end
  end

end
