var apiKey = "AIzaSyCpf0JxzmcUOXYeZzlqm-31JxSX2YAOXQY";

var map;
var service;
var infowindow;
var apiKey = "AIzaSyCpf0JxzmcUOXYeZzlqm-31JxSX2YAOXQY";

function initMap() {
  var city = new google.maps.LatLng(32.7157, -117.1611); // used san diego coordinates right now

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: city,
    zoom: 15,
  });

  var request = {
    query: "golf course",
    radius: 5000,
    fields: ["name", "geometry", "photo"],
    location: city,
    key: "AIzaSyCpf0JxzmcUOXYeZzlqm-31JxSX2YAOXQY",
    keyword: "golf",
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        console.log(results[i]);
       
        // testing DOM manipulations
        var courseName = results[i].name;
        var courseAddress = results[i].vicinity;
        var courseRating = "rating: " + results[i].rating + " stars";

        var courseDiv = document.createElement('div')
        courseDiv.append(courseName + " " + courseAddress + " " + courseRating)
        courseDiv.style.padding = "10px"
        document.body.append(courseDiv)
      }

      map.setCenter(results[0].geometry.location);
   
    }
  });
}