// Weather
var zipWeather = document.querySelector("#zipWeather");
var zipCodeEl = document.querySelector("#zipCode");
var searchBtn = document.querySelector("#searchBtn");

var golfCourseContainer = document.querySelector("#golf-course-container")

var savedCoursesArray = JSON.parse(localStorage.getItem("saved courses"));
if (!savedCoursesArray){
    savedCoursesArray = [];
};

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
        console.log(data)
       var lat = data[0].lat;
        var lon = data[0].lon;
        console.log(lat)
        console.log(lon)
        initMap(lat, lon)

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

golfCourseContainer.addEventListener('click', function(event){
    var chosenCourse;
    var button = event.target;
    if (button.matches('.save-button')){
        chosenCourse = button.parentElement.children[0].textContent;
        console.log(chosenCourse);
        savedCoursesArray.push(chosenCourse);
        localStorage.setItem("saved courses", JSON.stringify(savedCoursesArray));
        // updates list with the new saved course
        displaySavedCourses()
    }
})

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

var map;
var service;
var infowindow;
var googleMapApiKey = "AIzaSyCpf0JxzmcUOXYeZzlqm-31JxSX2YAOXQY";

function initMap(lat, lon) {

  var city = new google.maps.LatLng(lat, lon); 

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: city,
    zoom: 15,
  });

  var request = {
    query: "golf course",
    radius: 2500,
    fields: ["name", "geometry", "photo"],
    location: city,
    key: "AIzaSyCpf0JxzmcUOXYeZzlqm-31JxSX2YAOXQY",
    keyword: "golf",
  };

   service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // clear current results from page
        golfCourseContainer.innerHTML = "";

      for (let i = 0; i < results.length; i++) {
       
        // testing DOM manipulations
        
        var courseName = results[i].name;
        var courseAddress = results[i].vicinity;
        var courseRating = "Rating: " + results[i].rating + " Stars";

        
        // var courseInfo = document.createElement('div')
        var courseDiv = document.createElement('div')
        var courseInfo = document.createElement('p');
        var saveBtn = document.createElement('button');
        saveBtn.textContent = "save course";
        saveBtn.setAttribute("class", "save-button")
        courseInfo.append(courseName + ", " + courseAddress + " | " + courseRating)
        courseDiv.append(courseInfo);
        courseDiv.append(saveBtn)
        courseDiv.style.padding = "10px"
        golfCourseContainer.append(courseDiv)

        // calling the saveThisCourse function written below, passing it the saveBtn as the event target
      }
    //   map.setCenter(results[0].geometry.location);
    }
    
  });
}

/// Code below persists courses in local storage when its save button is clicked
//--must call function inside for loop above passing in the saveBtn as a parameter
// make a function that takes in parameters of a button and parent element
// add click event listener to the button which will make the text content of its parent be pushed to an array and then saved in local storage





// below: DISPLAY SAVED COURSES FUNCTION
/// code to append items in local storage to the correct container in the DOM on page load
// need to add in a div to html with a ul to store saved courses as list items, use same ids referenced by query selector below
var savedCoursesContaner = document.querySelector("#saved-courses-container");
var savedCoursesList = document.querySelector("#saved-courses-list");
function displaySavedCourses(){
    savedCoursesList.innerHTML = "";
    for (var i = 0; i < savedCoursesArray.length; i++){
        var savedCourse = document.createElement('li');
        savedCourse.textContent = savedCoursesArray[i];
        savedCoursesList.append(savedCourse);
    }
}
// // so that the saved courses show up on page load
displaySavedCourses();


