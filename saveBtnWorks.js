// Working code for persisting in local storage starts on line 69 below

var map;
var service;
var infowindow;
var googleMapApiKey = "AIzaSyCpf0JxzmcUOXYeZzlqm-31JxSX2YAOXQY";

function initMap(lat, lon) {

  var city = new google.maps.LatLng(lat, lon); // used san diego coordinates right now

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
        courseInfo.append(courseName + "| " + courseAddress + "| " + courseRating)
        courseDiv.append(courseInfo);
        courseDiv.append(saveBtn)
        courseDiv.style.padding = "10px"
        golfCourseContainer.append(courseDiv)

        // calling the saveThisCourse function written below, passing it the saveBtn as the event target
        saveThisCourse(saveBtn);

      }
    //   map.setCenter(results[0].geometry.location);
    }
    
  });
}

/// Code below persists courses in local storage when its save button is clicked
//--must call function inside for loop above passing in the saveBtn as a parameter
// make a function that takes in parameters of a button and parent element
// add click event listener to the button which will make the text content of its parent be pushed to an array and then saved in local storage

var savedCoursesArray = [];

storedCourses = JSON.parse(localStorage.getItem("saved courses"));
if (storedCourses){
    savedCoursesArray = storedCourses;
}

function saveThisCourse(button){

    button.addEventListener('click', function(){
        var chosenCourse = button.parentElement.children[0].textContent;
        console.log(chosenCourse)
        savedCoursesArray.push(chosenCourse);
        localStorage.setItem("saved courses", JSON.stringify(savedCoursesArray));
    })
}



