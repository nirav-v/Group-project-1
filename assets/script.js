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

function init() {

    var saveSearch = JSON.parse(localStorage.getItem("searchZipWeather"));

    if (saveSearch) {
        searchZipWeather = saveSearch;
    }
    saveHistory();
}