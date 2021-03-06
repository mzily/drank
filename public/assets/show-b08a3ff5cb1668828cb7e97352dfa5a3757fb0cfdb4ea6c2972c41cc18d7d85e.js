// map
var map;
var coordinates;
function initMap() {
  coordinates = coords();

  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 13,
    scrollwheel: false
  });

  userMarker();
  geocoder();

  var drink = { drink: $('#recommended').text() };
  loadRestaurants(drink);
}

// lat, lng
function coords() {
  return { lat: $('#coordinates').data('lat'),
           lng: $('#coordinates').data('lng') };
}

// user location on map
function userMarker() {
  new google.maps.Marker({
    position: coordinates,
    map: map,
    icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
  });
}

// call reverse geocoder
function geocoder() {
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({'location': coordinates}, setLocation);
}

// retrieve city, state
function setLocation(results, status) {
  if (status === 'OK') var components = results[1].address_components;

  var location = {};
  components.forEach(function(address_obj) {
    for (var prop in address_obj) {
      if (prop === 'types') {
        if (address_obj[prop].indexOf('locality') !== -1) {
          location.city = address_obj.long_name;
        } else if (address_obj[prop].indexOf('administrative_area_level_1') !== -1) {
          location.state = address_obj.short_name;
        }
      }
    }
  });

  loadDash(location);
}

// load details to dashboard
function loadDash(location) {
  $('#weather').prepend('<h2>' + location.city + ', ' + location.state + '</h2>');
  currentConditions(location);
}

// weather
function currentConditions(location) {
  var city = formatCity(location.city);

  $.ajax({
    url: "https://api.wunderground.com/api/20e32ff3e81ba1e5/geolookup/conditions/q/" + location.state + "/" + city + ".json",
    dataType: "jsonp",
    success: renderTemp
  });
}

// format city string for api
function formatCity(city) {
  return city.indexOf(" ") !== -1 ? city.replace(" ", "_") : city;
}

function renderTemp(parsed_json) {
  var temp_f = parsed_json.current_observation.temp_f;

  $('#weather').append('<h1>' + temp_f + ' &#8457;</h1>');
  temp(temp_f);
}

// send temp for drink
function temp(temp_f) {
  $.ajax({
    url: "/users",
    type: "GET",
    dataType: "json",
    data: { "temp_f": temp_f },
    error: function(message) {
      console.error(message);
    }
  });
}

// retrieve restaurants from api
function loadRestaurants(drink) {
  $.ajax({
    url: "/drink",
    type: "GET",
    data: drink,
    dataType: "json",
    success: restaurantMarkers,
    error: function(message) {
      console.error(message);
    }
  });
}

// create map markers
var markers = [];
function restaurantMarkers(restaurants) {
  var infoWindows = [];

  restaurants.forEach(function(restaurant) {
    var restaurantHash = restaurant.hash;

    var infoWindow = createInfoWindow(restaurantHash);
    infoWindows.push(infoWindow);

    var marker = createMarker(restaurantHash);
    markers.push(marker);
  });

  attachInfoWindow(markers, infoWindows);
}

function createInfoWindow(restaurantHash) {
  var contentString =
    '<div class="restaurant">' +
    '<h5><a href=' + restaurantHash.url + '>' + restaurantHash.name + '</a></h5>' +
    '<p>' + restaurantHash.location.display_address[0] + '</p>' +
    '<p>' + restaurantHash.location.display_address[1] + '</p>' +
    '<ul>' +
    '<li><img src=' + restaurantHash.rating_img_url + '></li>' +
    '<li> ' + restaurantHash.review_count + ' reviews' + '</li>' +
    '</ul>' +
    '</div>';

  return new google.maps.InfoWindow({ content: contentString });
}

function createMarker(restaurantHash) {
  var restaurantCoords = {
    lat: restaurantHash.location.coordinate.latitude,
    lng: restaurantHash.location.coordinate.longitude
  };

  return new google.maps.Marker({
    position: restaurantCoords,
    map: map,
    title: restaurantHash.name
  });
}

function attachInfoWindow(markers, infoWindows) {
  markers.forEach(function(marker, index) {
    marker.addListener('click', function() {
      infoWindows[index].open(map, marker);
    });
  });
}

function dropdownItemSelect() {
  $('.dropdown-menu').children().children().on("click", function(drinkOption) {
    var drink = { drink: $(this).text() };
    resetMarkers(drink);
    $('#recommended').text(drink.drink);
  });
}

function resetMarkers(drink) {
  markers.forEach(function(marker) {
    marker.setMap(null);
  });

  markers = []
  loadRestaurants(drink);
}

$(document).ready(function() {
  dropdownItemSelect();
});
