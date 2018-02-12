

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
				$scope.$apply(function () {
					$scope.currentWeather.icon = "wi " + $scope.dayIcons[i].icon;
				});
			}
		}
	} 
	
	
	$scope.myDays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
	$scope.thisWeek = [];
	// Get the time
	$scope.getDays = function(days) {
		var currentDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * days);
		var thisDay = currentDate.getDay();
		thisDay = $scope.myDays[thisDay];
		console.log(thisDay);
		return thisDay;
	}
	
	// Convert celsius to farenheit
	$scope.cTOf = function(temp) {
		return (temp * 1.8) + 32;
	}
	// Convert farenheit to celsius 
	$scope.fTOc = function(temp) {
		return (temp - 32) * (5 / 9);
	}
	
	// Descriptions for the Preciptiation
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
			return "While the twigs do look possessed, don't call the Ghostbusters";
		} else if (speed < 7.9) {
			return "WATCH OUT IT'S A MINI TORNADO AAAAAAH!";
		} else if (speed < 10.7) {
			return "Be on the lookout for long branches on the ground, they might attack you.";
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
	
	$scope.Time; 
	$scope.Location;
	
	$scope.callByIP = function(position) {
		// API call
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + "," + long + "&key=" + apikey;
		var for_call = "https://api.forecast.io/forecast/" + forkey + "/" + lat + "," + long + "?callback=?";
		document.getElementById("index").style.display = "block";
        document.getElementById("splash").style.display = "none";
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
	// TO DO
	$scope.callByPostal =function(postal) {
		var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + postal + "&key=" + apikey;
		$.getJSON(GEOCODING, function(json) {
			// get the longitude and latitutde. 
			var lat = json.results["0"].geometry.location.lat;
			var long = json.results["0"].geometry.location.lng;
			// Forecast.io api call. 
			var for_call = "https://api.forecast.io/forecast/" + for_key + "/" + lat + "," + long + "?callback=?";
			// Get the address. 
			var address = json.results["0"].formatted_address;
			// Show the address. 
			$('#Location').text(address);
			// Get the country. 
			var country = address.slice(-3);
			var timezone = "https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + long + "&timestamp=" + new Date(Date.now()).getTime() / 1000 + "&key=" + timeZoneKey;
			var timeZoneID;
			$.getJSON(timezone, function(json) {
				timeZoneID = json.timeZoneId;
				$.getJSON(for_call, function(json) {
					changeHTML(json, country, timeZoneID);
				});
			});
		});
	}
	
	$scope.getForecastData = function(weatherInfo, country, home) {
		$scope.getIcon(weatherInfo.currently.icon);
		var intervals = []; 
		
		$(document).ready(function() {
			intervals.push(setInterval(updateClockHome, 1000));
		//	$scope.getLocation();
			for (o = 0; o < 7; o++) {
				$scope.$apply(function () {
					$scope.thisWeek.push($scope.getDays(o));
				});
			}
			console.log($scope.thisWeek);
		}); 
		
		// Update the clock on screen
		function updateClockHome() {
			var date = new Date(Date.now());
			var timestr = date.toLocaleTimeString();
			$scope.$apply(function () {
				$scope.Time = timestr; 
			});
		}

		
		$scope.forecasticon = ["mon", "tues", "wed", "thur", "fri", "sat"];
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
		
		if (typeof(home) == "undefined") {
			$scope.$apply(function () {
				$scope.timestrRise = $scope.timestrRise.toLocaleTimeString();
				$scope.timestrSet = $scope.timestrSet.toLocaleTimeString();
			});
		} else {
			// If the home area CAN be found, reset the intervals and make a new one. 
			intervals.forEach(clearInterval);
			function updateClock() {
				var timestr = new Date().toLocaleString('en-US', {
					timeZone: home
				})
				$scope.$apply(function () {		
					$scope.Time = timestr.split(",")[1];
				});
			}
			intervals.push(setInterval(updateClock, 1000));
			$scope.$apply(function () {
				$scope.timestrRise = dateRise.toLocaleTimeString('en-US', {
					timeZone: home
				});
				$scope.timestrSet = dateSet.toLocaleTimeString('en-US', {
					timeZone: home
				});
			});
		} 
		// Update the temperature with Farenheit. 
		$scope.actualTemperature;
		$scope.feelTemperature;
		$scope.todayLow;
		$scope.todayHigh; 
		function getFarenheitTemp() {
			$scope.$apply(function () {
				$scope.actualTemperature = (Math.round(weatherInfo.currently.temperature));
				$scope.feelTemperature =(Math.round(weatherInfo.currently.apparentTemperature));
				$scope.todayLow =(Math.round(weatherInfo.daily.data[0].apparentTemperatureLow));
				$scope.todayHigh =(Math.round(weatherInfo.daily.data[0].apparentTemperatureHigh));
			});
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
		function getCelsiusTemp() {
			$scope.$apply(function () {
				$scope.actualTemperature =(Math.round($scope.fTOc(weatherInfo.currently.temperature)));
				$scope.feelTemperature =(Math.round($scope.fTOc(weatherInfo.currently.apparentTemperature)));
				$scope.todayLow =(Math.round($scope.fTOc(weatherInfo.daily.data[0].apparentTemperatureLow)));
				$scope.todayHigh =(Math.round($scope.fTOc(weatherInfo.daily.data[0].apparentTemperatureHigh)));
			});
			// Not sure if I should change this
				document.getElementById("f").style.color = "#C2C2B8";
				document.getElementById("c").style.color = "#FFFFF2";
				document.getElementById("f").style.background = "#312c32";
				document.getElementById("c").style.background = "#201D21";
			//
		//	for (k = 0; k < 7; k++) {
		//		$("#" + forecasticon[k] + "high").html(Math.round(fTOc(getTemperatureMax(k))));
		//		$("#" + forecasticon[k] + "low").html(Math.round(fTOc(getTemperatureMin(k))));
		//	}
		}
	    
		// Show the user the cloudiness icon for the current day
	//	getIcon(weatherInfo.currently.icon, "cloudinessIcon");
		// Change the background based on the APPARENT temperature. 
		$scope.changeBackground(weatherInfo.currently.apparentTemperature);
		// If we're in the USA, then use Farenheit. If not, use Celsius. 
		if (country == "USA") {
			getFarenheitTemp();
		} else {
			getCelsiusTemp();
		}
		// Set the onclicks for changing from Farenheit to Celsius and vice versa. 
		document.getElementById('f').onclick = function() {
			getFarenheitTemp();
		}
		document.getElementById('c').onclick = function() {
			getCelsiusTemp();
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
	//	for (j = 0; j < forecasticon.length; j++) {
	//		getIcon(weatherInfo.daily.data[j + 1].icon, forecasticon[j] + "-icon"); // example #mon-icon
	//	} 
	}; // END OF FORECAST.IO 

	$scope.error = function(err) {
		// Have some funny phrases appear below the button and it just keeps adding on. Add like 30 of these. Haha.
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};

	$scope.getLocation = function(){
		navigator.geolocation.getCurrentPosition($scope.callByIP, $scope.error, $scope.options);
	}
});







