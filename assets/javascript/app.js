// Global variables
var map, infoWindow, trails, places, geocoder;
var iconBase = "./assets/images/map-marker.png"
        

var weatherAPIkey = "63ad6cfdee5ea624323fed889a2d525d";
var nationalParksAPIkey = "Myd9CKal7VJIrMYyOYXHKQHZkEKIXZfMT7wT5xds";
var googleAPIKey = "AIzaSyCGcE5jmaNXlSOnkF9hz6oYTFhQl3qPFaU";

//set up national parks api 
// var nationalParksQueryURL = "https://developer.nps.gov/api/v1/parks?stateCode=tx&api_key=" + nationalParksAPIkey;
// $.ajax({
//   url: nationalParksQueryURL,
//   method: "GET"
// })
//   .then(function (response) {
//     console.log(response);
//   });

//initialize firebase
var config = {
  apiKey: "AIzaSyBORNjA5-m2BsCc9HESu5po2VRfx30lUx4",
    authDomain: "outdoor-adventure-dc61e.firebaseapp.com",
    databaseURL: "https://outdoor-adventure-dc61e.firebaseio.com",
    projectId: "outdoor-adventure-dc61e",
    storageBucket: "outdoor-adventure-dc61e.appspot.com",
    messagingSenderId: "1061119694550"
};

firebase.initializeApp(config);

// Variable to reference the firebase database
var database = firebase.database();
var favoriteRef = database.ref('favorites');


$("#results-page").hide();
$("#front-page").show();
  
// If user chooses geolocation 
function initMap() {
    $("#results-page").show();
    $("#front-page").hide();

    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 32.8448345, lng: -96.7844135 },
      zoom: 10,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#ffb03b"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#ffb03b"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#ffb03b"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#b64926"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent('Current Location');
        infoWindow.open(map);
        map.setCenter(pos);
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        var currentLatitude = position.coords.latitude;
        var currentLongitude = position.coords.longitude
        currentLocationWeather (currentLatitude, currentLongitude);
        getTrailInfo (currentLatitude, currentLongitude);
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};

// Function to create the map markers and display on the map
function createMarker(trailPosition, trailName, contentString) {
    var marker = new google.maps.Marker({
      position: trailPosition,
      title: trailName,
      icon: iconBase,
      map: map
    });
    var infowindow = new google.maps.InfoWindow
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });
    
}

//If user chooses to input location manually
function manualLocation ( ) {
    var address = document.getElementById('address').value;
    console.log(address);

    if (address === null || address === undefined || address === "") {
      $('#modal').modal('show');
    } else {
      $("#results-page").show();
      $("#front-page").hide();
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.8448345, lng: -96.7844135 },
        zoom: 10,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ebe3cd"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#523735"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f1e6"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#c9b2a6"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#dcd2be"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ae9e90"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#93817c"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#a5b076"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#447530"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f1e6"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#fdfcf8"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f8c967"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#ffb03b"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#ffb03b"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e98d58"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#ffb03b"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#b64926"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#806b63"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8f7d77"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#ebe3cd"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#b9d3c2"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#92998d"
              }
            ]
          }
        ]
      });
      infoWindow = new google.maps.InfoWindow;
  
      var geolocationURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleAPIKey; 
      $.ajax({
        url: geolocationURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        var currentLatitude = response.results[0].geometry.location.lat
        var currentLongitude = response.results[0].geometry.location.lng
        var currentLocationName = response.results[0].formatted_address
        console.log(currentLatitude);
        console.log(currentLongitude);
        var pos = {
          lat: currentLatitude,
          lng: currentLongitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent(currentLocationName);
        infoWindow.open(map);
        map.setCenter(pos);
        currentLocationWeather (currentLatitude, currentLongitude);
        getTrailInfo (currentLatitude, currentLongitude);
      });
    }
};

function trailWeather(trailName, trailRating, trailDifficulty, trailLength, trailThumb,trailPositionLat, trailPositionLon, trailURL, trailRatingPercent) 
{
    //gets weather for trails
    var weatherqueryURL = "http://api.openweathermap.org/data/2.5/find?lat=" + trailPositionLat + "&lon=" + trailPositionLon + "&cnt=1&appid=" + weatherAPIkey;
    
    $.ajax({
      url: weatherqueryURL,
      method: "GET"
    }).then(function (response) 
    {
          var trailTempKelvin = response.list[0].main.temp;
          var trailTempFahr = Math.floor(((trailTempKelvin - 273.15) * 1.8) + 32)
          var trailWeatherDis = response.list[0].weather[0].description;
          var trailWeatherIcon = response.list[0].weather[0].icon;
          var trailWeatherIconURL = "http://openweathermap.org/img/w/" + trailWeatherIcon + ".png";
          var trailWeather = "<img src='" + trailWeatherIconURL + "'>" 
          + "<div>" + trailTempFahr + "°</div>" 
          + "<div class='trail-weather'>" + trailWeatherDis + " </div>";

          //$(".stars-fill").css( "width", trailRatingPercent + "%");
          var resultsString =
          "<div class='row trailResultsList'>" +
          "<div class='col-3'>" +
          "<img class='trailImage' src='" + trailThumb + "'>" +
          "</div>" +
          "<div class='col trail-info-results'>" +
          "<a target='_blank' href='" + trailURL + "'>" + "<i class='fas fa-bicycle'></i>" +
          "<h5><b>" + trailName + "</b></h5></a>" +
          // "Rating: " + trailRating + "<br>" +
          "<div class='stars-empty'>" + 
          "<div class='stars-fill' style='width:" + trailRatingPercent + "'> </div>" + 
          "</div>" + 
          "<p>" + trailDifficulty + "<br>" +
          "Length: " + trailLength + "</p>" +
          "</div>" +
          "<div class='col-3'>" + trailWeather + 
          "</div>" + "<div class='fav-button favoriteBtn' onclick='favoritePlace()'>" + "<i class='fas fa-heart btn btn-sm' aria-hidden='false'></i>"+"</div>" +
        "</div>";

        
        
      
        //pushes trail information to results panel   
        $("#trails").append(resultsString); 

         // Button add all the trails around the area into the database instead of just one at a time.\
        $('.favoriteBtn').on('click', favoritePlace = function () 
        {

          var favoriteTrail = 
          {
            name: trailName,
            rating: trailRating,
            thumbnail: trailThumb,
            difficulty: trailDifficulty,
            length: trailLength,
            lat: trailPositionLat,
            lon: trailPositionLon,
            url:trailURL   
          };
          database.ref().set(favoriteTrail);
    
          // Logs everything to console
          console.log(favoriteTrail);
        });
    });  
}
    

function currentLocationWeather (currentLatitude, currentLongitude) {
      var weatherqueryURL = "http://api.openweathermap.org/data/2.5/find?lat=" + currentLatitude + "&lon=" + currentLongitude + "&cnt=1&appid=" + weatherAPIkey;
        $.ajax({
          url: weatherqueryURL,
          method: "GET"
        }).then(function (response) {
          console.log(response);
          // gets location name, temperature, weather icon and pushes it to html 
          var currentLocationName = response.list[0].name;
          var currentLocationTempKelvin = response.list[0].main.temp;
          var currentLocationTempFahr = Math.floor(((currentLocationTempKelvin - 273.15) * 1.8) + 32)
          var currentWeatherDis = response.list[0].weather[0].description;
          var currentWeatherIcon = response.list[0].weather[0].icon;
          var currentWeatherIconURL = "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png";
          $("#location").append("<b>" + currentLocationName + "</b>");
          $("#weather").append("<img id='current-weather-icon' src='" + currentWeatherIconURL + "'>");
          $("#weather").append("<div>" + currentWeatherDis + " </div>");
          $("#weather").append("<div>Temperature: " + currentLocationTempFahr + "°</div>");
        });
}

    function getTrailInfo (currentLatitude, currentLongitude) {
      var trailsqueryURL = 'https://trailapi-trailapi.p.mashape.com/trails/explore/' + '?lat=' + currentLatitude + '%2C&lon=' + currentLongitude + '&per_page=100&radius=100';

  $.ajax({
      url: trailsqueryURL,
      method: "GET",
      headers: 
      {
        "X-Mashape-Key": "dZJGfLx5hNmshNppywXnsDamxgDPp1RzSf2jsnYe48JNSRCtXc",
        "Accept": "application/json"
      }
  }).then(function (response) 
  {
    console.log(response);
    //plots trail points on map 
    for (var i = 0; i < response.data.length; i++) 
    {
      // variable to call the trails api data
      var trailName = response.data[i].name;
      var trailDescription = response.data[i].description;
      var trailPositionLat = parseFloat(response.data[i].lat);
      var trailPositionLon = parseFloat(response.data[i].lon);
      var trailPosition = { lat: trailPositionLat, lng: trailPositionLon };
      var trailRating = response.data[i].rating;
      var trailLength = response.data[i].length;
      var trailDifficulty = response.data[i].difficulty;
      var trailThumb = response.data[i].thumbnail;
      var trailURL = response.data[i].url;
      var trailRatingPercent = ((trailRating/5) * 100) + "%";
      var markerString = '<div id="content">' +
            '<div id="' + trailName + '">' +
            '</div>' +
            '<p id="firstHeading" class="firstHeading">' + trailName + '</p>' +
            '<div id="bodyContent">' +
            '<img src="' +  trailThumb + '" class="marker-img">' +
            '<p> Rating: ' + trailRating + '</p>' +
            '<p> Difficulty: ' + trailDifficulty + '</p>' +
            '<p> Length: ' + trailLength + '</p>' +
            '<p Description: ' + trailDescription + '</p>' +
            '<p><a target="_blank" href="' + trailURL + '">Click Here for More Information</a> ' +
            '</p>' +
            '</div>' +
            '</div>';
      
      createMarker(trailPosition, trailName, markerString);
      trailWeather(trailName, trailRating, trailDifficulty, trailLength, trailThumb, trailPositionLat, trailPositionLon, trailURL, trailRatingPercent)
    }  
  });
}

function refresh () {
  $("#results-page").hide();
  $("#front-page").show();
  currentLatitude = ""
  currentLongitude = ""
  $("#trails").empty();
  $("#location").empty();
  $("#weather").empty();
}



