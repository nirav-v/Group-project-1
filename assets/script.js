// Weather
var zipWeather = document.querySelector("#zipWeather");
var zipCodeEl = document.querySelector("#zipCode");
var searchBtn = document.querySelector("#searchBtn");

var searchZipWeather = [];
var apiKey = "b1a68922cfde0b1d07bee887e415302e";

function zipWeatherUpdate(cityName) {

    zipWeather.innerHTML = "";

    var zipWeatherRequest = 'https://api.openweathermap.org/geo/1.0/direct?q=' +
        cityName + '&limit=5&appid=' + apiKey;

    fetch(zipWeatherRequest)
        .then(function(response) {
            return response.json();
        })

    .then(function(data) {
        var cityInfo = data[0];
        var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +
            cityInfo.lat +
            '&lon=' +
            cityInfo.lon +
            '&exclude=minutely,hourly&units=imperial&appid=' +
            apiKey;

        fetch(weatherUrl)
            .then(function(response) {
                return response.json();
            })

        .then(function(todayWeather) {
            var zipEl = document.createElement("h3");
            zipEl.textContent =
                cityName.toUpperCase() +
                " " +
                moment.unix(todayWeather.current.sunrise).format("MMMM DD, YYYY");
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute(
                "src",
                "https://openweathermap.org/img/w/" +
                todayWeather.current.weather[0].icon +
                ".png"
            );
            zipEl.append(weatherIcon);
            zipWeather.append(zipEl);

            var temperature = document.createElement("p");
            var wind = document.createElement("p");
            var humidity = document.createElement("p");
            var uvi = document.createElement("p");

            temperature.textContent = "Temp: " + todayWeather.current.temp + " F " + " ";
            wind.textContent = " Wind: " + todayWeather.current.wind_speed + " MPH ";
            humidity.textContent = " Humidity: " + todayWeather.current.humidity + " % ";
            uvi.textContent = "UV Index: " + todayWeather.current.uvi;

            zipWeather.append(temperature);
            zipWeather.append(wind);
            zipWeather.append(humidity);
            zipWeather.append(uvi);

            for (var i = 0; i < 5; i++) {
                var currentDayWeather = todayWeather.daily[i];
            }
        });

    });
}

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

    var searchValue = zipCodeEl.value.trim();
    if (!searchValue) {
        return;
    }

    searchZipWeather.push(searchValue);
    zipWeatherUpdate(searchValue);
    zipCodeEl.value = '';
});

// function init() {

//     var saveSearch = JSON.parse(localStorage.getItem("searchZipWeather"));

//     if (saveSearch) {
//         searchZipWeather = saveSearch;
//     }
//     saveHistory();
// }

// for google nearby search api
var apiKey = "AIzaSyCpf0JxzmcUOXYeZzlqm-31JxSX2YAOXQY";

var map;
var service;
var infowindow;

function initMap() {
  var sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });

  var request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };

  var service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

