class UsersController < ApplicationController
  include UsersHelper
  before_action :reroute_unauth_user

  def show
    @weather_data = weather_data
  end

  def reroute_unauth_user
    redirect_to root_path unless signed_in?
  end
end
