
var app = angular.module('weatherApp', []);
app.controller('weatherController', function($scope) {
	
	
	// Convert the summary of the day to an icon
	$scope.dayIcons = [{
		summary: "clear-day",
		icon: "wi-day-sunny"
	}, {
		summary: "clear-night",
		icon: "wi-night-clear"
	}, {
		summary: "rain",
		icon: "wi-rain"
	}, {
		summary: "snow",
		icon: "wi-snow"
	}, {
		summary: "sleet",
		icon: "wi-sleet"
	}, {
		summary: "wind",
		icon: "wi-windy"
	}, {
		summary: "fog",
		icon: "wi-fog"
	}, {
		summary: "cloudy",
		icon: "wi-cloudy"
	}, {
		summary: "partly-cloudy-day",
		icon: "wi-day-cloudy"
	}, {
		summary: "partly-cloudy-night",
		icon: "wi-night-alt-cloudy"
	}];
	// Find the icon by summary, get the class for the icon, and change the HTML of the element with the id given. 
	$scope.currentWeather = {}
	$scope.getIcon = function(iconName) {
		for (i = 0; i < $scope.dayIcons.length; i++) {
			if ($scope.dayIcons[i].summary == iconName) {
				return "wi " + $scope.dayIcons[i].icon;
			}
		}
	} 
	
	
	$scope.thisWeek = [];
	// Get the time
	$scope.getDays = function(days) {
		var currentDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * days);
		var stringArray = currentDate.toString().split(" ");
		return stringArray[0];
	}
	
	// Convert celsius to farenheit
	$scope.cTOf = function(temp) {
		return (temp * 1.8) + 32;
	}
	// Convert farenheit to celsius 
	$scope.fTOc = function(temp) {
		return (temp - 32) * (5 / 9);
	}
	
	// Descriptions for the Precipitation
	$scope.getPrecipDesc = function(precip) {
		if (precip < 0.01) {
			return "The flowers would be crying if they had water";
		}
		if (precip < 0.098) {
			return "You could carry this rain it's so light";
		}
		if (precip < .1) {
			return "Meh, bring an umbrella";
		}
		if (precip < .3) {
			return "Bring your shampoo to work and shower on the way"
		}
		if (precip >= .3) {
			return "GET IN THE ARK, NOAH";
		}
	}
	// Descriptions for the Wind Speed
	$scope.getWindDesc = function(speed) {
		/* Ack: https://www.windfinder.com/wind/windspeed.htm for brief descriptions of windspeed, which I based these off of */
		if (speed < .2) {
			return "Wind? We don't know of Wind in this country.";
		} else if (speed < 1.5) {
			return "Pretty much no wind.";
		} else if (speed < 3.3) {
			return "You'll feel a bit of wind.";
		} else if (speed < 5.4) {
			return "Twigs are possessed, don't call the Ghostbusters.";
		} else if (speed < 7.9) {
			return "WATCH OUT IT'S A MINI TORNADO AAAAAAH!";
		} else if (speed < 10.7) {
			return "Long branches are now possessed.";
		} else if (speed < 13.8) {
			return "HAHAHA GOOD LUCK USING THAT UMBRELLA HAHAHAHAH";
		} else if (speed < 17.1) {
			return "AAAAH THE TREES ARE POSSESSED AAAAH!!!";
		} else if (speed >= 17.1) {
			return "WHY THE FUCK ARE YOU OUTSIDE?";
		}
	}
	$scope.backgroundColor; 
	// Based on the temperature outside, change the color of the background
	$scope.changeBackground = function(val) {
		$scope.$apply(function () {
			if (val < 0) {
				$scope.backgroundColor = "#D7FFF7";
			} else if (val < 9) {
				$scope.backgroundColor = "#C9FFF7";
			} else if (val < 19) {
				$scope.backgroundColor = "#BDFFF7";
			} else if (val < 29) {
				$scope.backgroundColor = "#AAFFF7";
			} else if (val < 39) {
				$scope.backgroundColor= "#86FFE6";
			} else if (val < 49) {
				$scope.backgroundColor = "#61FFBE";
			} else if (val < 59) {
				$scope.backgroundColor = "#55FF8C";
			} else if (val < 69) {
				$scope.backgroundColor = "#4AFF6A";
			} else if (val < 79) {
				$scope.backgroundColor = "#40DE40";
			} else if (val < 85) {
				$scope.backgroundColor = "#C6FF3E";
			} else if (val < 90) {
				$scope.backgroundColor = "#FFF744";
			} else if (val < 95) {
				$scope.backgroundColor = "#FFC92B";
			} else if (val < 100) {
				$scope.backgroundColor = "#FF9036";
			} else if (val >= 100) {
				$scope.backgroundColor = "#FF5337";
			}
		});
	}
	
	// Forecast.io API Call
	var forkey = "813195e09d571d569dfc52a878bea90c";
	// Geolocation API Call
	var apikey = "AIzaSyDCZSr-AlvZAUyBbAytuXVfVlkoGDLkFYA";
	// TimeZone API Call. 
	var timeZoneKey = "AIzaSyBpIn1cOyM3O9Ud1LBmNeHAa0U9M54tx5U";
	$scope.options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};
	
	// Update the clock on screen
	function updateClockHome() {
		clearInterval(window.interval);
		var date = new Date(Date.now());
		var timestr = date.toLocaleTimeString();
		$scope.$apply(function () {
			$scope.Time = timestr; 
		});
	}
	$scope.Time; 
	$scope.Location;
	var interval; 
	$scope.callByIP = function(position) {
		$(document).ready(function() {
			 clearInterval(interval);
			 interval = window.setInterval(updateClockHome, 1000);
			for (o = 1; o < 8; o++) {
				$scope.$apply(function () {
					$scope.thisWeek.push($scope.getDays(o));
				});
			}
		}); 
		
		// API call
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + "," + long + "&key=" + apikey;
		var for_call = "https://api.forecast.io/forecast/" + forkey + "/" + lat + "," + long + "?callback=?";

		$.getJSON(GEOCODING, function(json) {
			// get location 
			var address = json.results[2].formatted_address;
			var country = address.slice(-3);
			$scope.$apply(function () {
				$scope.Location = address;
			});
			$.getJSON(for_call, function(json) {
				$scope.getForecastData(json, country);
			});
		}); // End of GEOCODE 
	}
	$scope.postal; 

	$scope.callByPostal = function(postal) {
		var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + postal + "&key=" + apikey;
		$.getJSON(GEOCODING, function(json) {
			// get the longitude and latitutde. 
			if(json.status == "ZERO_RESULTS"){
				  alert("Geolocation API could not find that location. Be more specific or fix spelling errors");
			} else{
				var lat = json.results["0"].geometry.location.lat;
				var long = json.results["0"].geometry.location.lng;
				// Forecast.io api call. 
				var for_call = "https://api.forecast.io/forecast/" + forkey + "/" + lat + "," + long + "?callback=?";
				// Get the address. 
				var address = json.results["0"].formatted_address;
				// Show the address. 
				$scope.Location = address;
				// Get the country. 
				var country = address.slice(-3);
				var timezone = "https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + long + "&timestamp=" + new Date(Date.now()).getTime() / 1000 + "&key=" + timeZoneKey;
				var timeZoneID;
				var offset; 
				$.getJSON(timezone, function(json) {
					timeZoneID = json.timeZoneId;
					offset = json.rawOffset;
					$.getJSON(for_call, function(json) {
						$scope.getForecastData(json, country, timeZoneID, offset);
					});
				});
			}
		});
	}
	
	
		
	$scope.getForecastData = function(weatherInfo, country, region, offset) {
		$scope.currentWeather = $scope.getIcon(weatherInfo.currently.icon);

		// Get the maximum temperature that will happen today. 
		$scope.getTemperatureMax = function(k) {
			return Math.round(weatherInfo.daily.data[k + 1].temperatureMax);
		}
		// Get the minimum temperature that will happen today. 
		$scope.getTemperatureMin = function(k) {
			return Math.round(weatherInfo.daily.data[k + 1].temperatureMin);
		}
		// get sunrise time and sunset time
		$scope.$apply(function () {
			$scope.secRise = weatherInfo.daily.data[0].sunriseTime;
			$scope.dateRise = new Date($scope.secRise * 1000);
			$scope.timestrRise = $scope.dateRise;
			$scope.secSet = weatherInfo.daily.data[0].sunsetTime;
			$scope.dateSet = new Date($scope.secSet * 1000);
			$scope.timestrSet = $scope.dateSet;
		});
		// This is for when the home is changed by search and it can't be found by the API. It just will default to the normal time. 
		
		if (typeof(region) == "undefined") {
			$scope.$apply(function () {
				$scope.timestrRise = $scope.timestrRise.toLocaleTimeString();
				$scope.timestrSet = $scope.timestrSet.toLocaleTimeString();
			});
		} else {
			// If the home area CAN be found, reset the intervals and make a new one. 

		   clearInterval(interval);

			function updateClock() {
				var timestr = new Date().toLocaleString('en-US', {
					timeZone: region
				});
				$scope.$apply(function () {		
					$scope.Time = timestr.split(",")[1];
				});
			}
			
			function calcTime(offset) {

				// create Date object for current location
				var d = new Date();

				// convert to msec
				// add local time zone offset
				// get UTC time in msec
				var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

				// create new Date object for different city
				// using supplied offset
				var nd = new Date(utc + (3600000*offset));

				// return time as a string
				return nd.toLocaleString();
			}
			var offshoreTime = calcTime(offset/3600).split("/")[1];
			var ourTime = new Date().toLocaleString('en-US').split("/")[1];
			
			interval = window.setInterval(updateClock, 1000);

			$scope.thisWeek = [];
			for (z = 1; z < 8; z++) {
				$scope.$apply(function () {
					$scope.thisWeek.push($scope.getDays(z + (offshoreTime - ourTime)));
				});
			}
			$scope.$apply(function () {
				$scope.timestrRise = $scope.dateRise.toLocaleTimeString('en-US', {
					timeZone: region
				});
				$scope.timestrSet = $scope.dateSet.toLocaleTimeString('en-US', {
					timeZone: region
				});
			});
		} 
		// Update the temperature with Farenheit. 
		$scope.actualTemperature;
		$scope.feelTemperature;
		$scope.todayLow;
		$scope.todayHigh; 
		$scope.getFarenheitTemp =function() {
			$scope.actualTemperature = (Math.round(weatherInfo.currently.temperature));
			$scope.feelTemperature =(Math.round(weatherInfo.currently.apparentTemperature));
			$scope.todayLow =(Math.round(weatherInfo.daily.data[0].apparentTemperatureLow));
			$scope.todayHigh =(Math.round(weatherInfo.daily.data[0].apparentTemperatureHigh));
			// Not sure if I should change this
				document.getElementById("f").style.color = "#FFFFF2";
				document.getElementById("c").style.color = "#C2C2B8";
				document.getElementById("f").style.background = "#201D21";
				document.getElementById("c").style.background = "#312c32";
			//
			$scope.forecastTemperatures = [];
			for (k = 0; k < 7; k++) {
				var obj = {};
				obj.high = Math.round($scope.getTemperatureMax(k));
				obj.low = Math.round($scope.getTemperatureMin(k));
				$scope.forecastTemperatures.push(obj);
			}
		}
		// Update the temperature with Celsius. 
		$scope.getCelsiusTemp =function() {
			$scope.actualTemperature =(Math.round($scope.fTOc(weatherInfo.currently.temperature)));
			$scope.feelTemperature =(Math.round($scope.fTOc(weatherInfo.currently.apparentTemperature)));
			$scope.todayLow =(Math.round($scope.fTOc(weatherInfo.daily.data[0].apparentTemperatureLow)));
			$scope.todayHigh =(Math.round($scope.fTOc(weatherInfo.daily.data[0].apparentTemperatureHigh)));
			// Not sure if I should change this
				document.getElementById("f").style.color = "#C2C2B8";
				document.getElementById("c").style.color = "#FFFFF2";
				document.getElementById("f").style.background = "#312c32";
				document.getElementById("c").style.background = "#201D21";
			//
			$scope.forecastTemperatures = [];
			for (k = 0; k < 7; k++) {
				var obj = {};
				obj.high = Math.round($scope.fTOc($scope.getTemperatureMax(k)));
				obj.low = Math.round($scope.fTOc($scope.getTemperatureMin(k)));
				$scope.forecastTemperatures.push(obj);
			}
		}
	    

		// Change the background based on the APPARENT temperature. 
		$scope.changeBackground(weatherInfo.currently.apparentTemperature);
		// If we're in the USA, then use Farenheit. If not, use Celsius. 
		if (country == "USA") {
			$scope.getFarenheitTemp();
		} else {
			$scope.getCelsiusTemp();
		}
		$scope.$apply(function () {
			// get the current cloudiness 
			$scope.cloudiness = Math.round(weatherInfo.currently.cloudCover*100) + " percent cloudy";
			// get the cloudiness for the rest of the day 
			$scope.cloudinessForecast = weatherInfo.currently.summary;

			// get witty precip and wind descriptions
			$scope.wind = $scope.getWindDesc(weatherInfo.currently.windSpeed);
			$scope.rain = $scope.getPrecipDesc(weatherInfo.currently.precipIntensity);

			// get actual precip and wind
			$scope.windIntensity = weatherInfo.currently.windSpeed;
			$scope.rainIntensity = weatherInfo.currently.precipIntensity;

			// get the summaries
			$scope.todaySummary = weatherInfo.daily.data[0].summary;
			$scope.weekSummary = weatherInfo.daily.summary;
		});
		
		// get weekly forecast icons
		$scope.forecastIcons =[]; 
		$scope.$apply(function () {
			for (j = 0; j < 7; j++) {
				$scope.forecastIcons.push($scope.getIcon(weatherInfo.daily.data[j + 1].icon)); 
			} 
		});
		document.getElementById("index").style.display = "block";
        document.getElementById("splash").style.display = "none";
		//console.log("The duplication error you see when you do a postal search is known about and I'm dealing with it. There is no actual problem, but Angular doesn't like that in a forecast some days will be similar enough to have a duplicate icon and  I'm working on a way so Angular doesn't loses its mind warning about this error. Thanks.");
	}; // END OF FORECAST.IO 
	var phrases = ["Do you  want to use this website or not?", "Fine, we'll just sit here until you're ready to cooperate.", "You can check the Github. There is no database. https://github.com/CrumrineCoder/Weather-App. Or are you just a rebel?", "Rebel Rebel, you've torn your dress. Rebel Rebel, your face is a mess. Rebel Rebel, how could they know?", "Are you just going to sit through here and see all the funny clown jokes I made?", "I’m funny how? I mean funny, like I’m a clown? I amuse you? I make you laugh? I’m here to amuse you? Whattya you mean funny? Funny how? How am I funny?", "Look, will you just click accept so you can use my website? This is just some stupid joke I put in and it took me like 5 minutes to set up. The rest of the site took much longer.", "FINE, GO AHEAD. I WON'T SAY ANY MORE JOKES. GO STICK YOUR HEAD OUT OF THE WINDOW TO GET THE WEATHER, SEE IF I CARE.", "I'm sorry, we left off on the wrong foot. Just. Click. Allow.", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "I've run out of ideas for jokes. Just click allow or whatever I don't care.", "Filler", "Filler 1", "Filler 2", "Filler 3", "Filler 4", "Filler 5", "Filler 100", "Filler 7", "LOOK IF YOU WANT TO SEE ALL THE JOKES YOU CAN GO ON GITHUB AND LOOK AT THE DATA.JS FILE. JUST CLICK ALLOW."]
	var phrasesIndex =0; 
	$scope.error = function(err) {
		// Have some funny phrases appear below the button and it just keeps adding on. Add like 30 of these. Haha.
		if(phrasesIndex > phrases.length-1){
			phrasesIndex = 0; 
		}
		
		alert(phrases[phrasesIndex]);
		phrasesIndex++;
	  //alert(`ERROR(${err.code}): ${err.message}`);
	};

	$scope.getLocation = function(){
		navigator.geolocation.getCurrentPosition($scope.callByIP, $scope.error, $scope.options);
	}
});







