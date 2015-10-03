function extractCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(coords);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function coords(position) {
  var coordinates = {
    latitude:  position.coords.latitude,
    longitude: position.coords.longitude
  };

  postCoords(coordinates);
}

function postCoords(coordinates) {
  $.ajax({
    url: "/coords",
    type: "POST",
    data: coordinates,
    success: function() {
      enableLogin();
      console.log(coordinates);
    },
    error: function(message){
      console.error(message);
    }
  });
}

function enableLogin() {
  $(".button_to").attr("action", "/auth/twitter");
  $(".button_to").attr("method", "post");
}

function waitForGeolocation() {
  $(".button_to").attr("action", "#");
  $(".button_to").removeAttr("method");
}

function geolocationPopUp() {
  $(".button_to").click(function() {
    if ($(".button_to").attr("method") === undefined) {
      alert("Please wait for geolocation to load.");
    }
  });
}

$(document).ready(function() {
  extractCoordinates();
  waitForGeolocation();
  geolocationPopUp();
});
