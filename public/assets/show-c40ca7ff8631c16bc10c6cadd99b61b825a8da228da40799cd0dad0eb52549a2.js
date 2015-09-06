function initMap(){coordinates=coords(),map=new google.maps.Map(document.getElementById("map"),{center:coordinates,zoom:13,scrollwheel:!1}),userMarker(),geocoder();var o={drink:$("#recommended").text()};loadRestaurants(o)}function coords(){return{lat:$("#coordinates").data("lat"),lng:$("#coordinates").data("lng")}}function userMarker(){new google.maps.Marker({position:coordinates,map:map,icon:"https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"})}function geocoder(){var o=new google.maps.Geocoder;o.geocode({location:coordinates},setLocation)}function setLocation(o,e){if("OK"===e)var n=o[1].address_components;var t={};n.forEach(function(o){for(var e in o)"types"===e&&(-1!==o[e].indexOf("locality")?t.city=o.long_name:-1!==o[e].indexOf("administrative_area_level_1")&&(t.state=o.short_name))}),loadDash(t)}function loadDash(o){postCityState(o),currentConditions(o)}function postCityState(o){$.ajax({url:"/city_state",type:"GET",data:o,error:function(o){console.error(o)}})}function currentConditions(o){var e=-1!==o.city.indexOf(" ")?o.city.replace(" ","_"):o.city;$.ajax({url:"https://api.wunderground.com/api/20e32ff3e81ba1e5/geolookup/conditions/q/"+o.state+"/"+e+".json",dataType:"jsonp",success:temp})}function temp(o){var e=o.current_observation.temp_f;$.ajax({url:"/current_conditions",type:"GET",data:{temp_f:e},error:function(o){console.error(o)}})}function loadRestaurants(o){$.ajax({url:"/drink",type:"GET",data:o,dataType:"json",success:restaurantMarkers,error:function(o){console.error(o)}})}function restaurantMarkers(o){var e=[];o.forEach(function(o){var n=o.hash,t=createInfoWindow(n);e.push(t);var a=createMarker(n);markers.push(a)}),attachInfoWindow(markers,e)}function createInfoWindow(o){var e='<div class="restaurant"><h5><a href='+o.url+">"+o.name+"</a></h5><p>"+o.location.display_address[0]+"</p><p>"+o.location.display_address[1]+"</p><ul><li><img src="+o.rating_img_url+"></li><li> "+o.review_count+" reviews</li></ul></div>";return new google.maps.InfoWindow({content:e})}function createMarker(o){var e={lat:o.location.coordinate.latitude,lng:o.location.coordinate.longitude};return new google.maps.Marker({position:e,map:map,title:o.name})}function attachInfoWindow(o,e){o.forEach(function(o,n){o.addListener("click",function(){e[n].open(map,o)})})}function dropdownItemSelect(){$(".dropdown-menu").children().children().on("click",function(){var o={drink:$(this).text()};resetMarkers(o),$("#recommended").text(o.drink)})}function resetMarkers(o){markers.forEach(function(o){o.setMap(null)}),loadRestaurants(o)}var map,coordinates,markers=[];$(document).ready(function(){dropdownItemSelect()});