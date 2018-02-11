

var app = angular.module('weatherApp', []);
app.controller('weatherController', function($scope) {
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
	
	$scope.getForecastData = function(weatherInfo, country, home) {
		var intervals = []; 
		
		$(document).ready(function() {
			intervals.push(setInterval(updateClockHome, 1000));
		//	$scope.getLocation();
		//	for (o = 0; o < 7; o++) {
			//	$("#" + o.toString() + "days").html(getDays(o));
		//	}
		}); 
		
		// Update the clock on screen
		function updateClockHome() {
			var date = new Date(Date.now());
			var timestr = date.toLocaleTimeString();
			$scope.$apply(function () {
				$scope.Time = timestr; 
			});
		}

		// Long List to convert the temperature to the color of the background			
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
				
			//	document.getElementById('Time').innerHTML = timestr.split(',')[1];
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
		//	for (k = 0; k < 7; k++) {
		//		$("#" + forecasticon[k] + "high").html("<span class='wi wi-degrees'>" + Math.round(getTemperatureMax(k)) + "</span>");
		//		$("#" + forecasticon[k] + "low").html("<span class='wi wi-degrees'>" + Math.round(getTemperatureMin(k)) + "</span>");;
		//	}
		}
		// Update the temperature with Celsius. 
		function getCelsiusTemp() {
			$scope.$apply(function () {
				$scope.actualTemperature =(Math.round(fTOc(weatherInfo.currently.temperature)));
				$scope.feelTemperature =(Math.round(fTOc(weatherInfo.currently.apparentTemperature)));
				$scope.todayLow =(Math.round(fTOc(weatherInfo.daily.data[0].apparentTemperatureLow)));
				$scope.todayHigh =(Math.round(fTOc(weatherInfo.daily.data[0].apparentTemperatureHigh)));
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
	//	changeBackground(weatherInfo.currently.apparentTemperature);
		// If we're in the USA, then use Farenheit. If not, use Celsius. 
		if (country == "USA") {
			getFarenheitTemp();
		} else {
			getCelsiusTemp();
		}
		// Set the onclicks for changing from Farenheit to Celsius and vice versa. 
	/*	document.getElementById('f').onclick = function() {
			getFarenheitTemp();
		}
		document.getElementById('c').onclick = function() {
			getCelsiusTemp();
		} */
		// get the current cloudiness 
	/*	$("#cloudinessCurrentDescription").html(weatherInfo.currently.cloudCover*100 + " percent cloudy")
		// get the cloudiness for the rest of the day 
		$("#cloudinessForeCast").html(weatherInfo.currently.summary)
		// get witty precip and wind descriptions
		$("#windDescription").html(getWindDesc(weatherInfo.currently.windSpeed));
		$("#rainDescription").html(getPrecipDesc(weatherInfo.currently.precipIntensity));
		// get actual precip and wind
		$("#windNumber").html(weatherInfo.currently.windSpeed);
		$("#rainNumber").html(weatherInfo.currently.precipIntensity);
		$("#todaySummary").html(weatherInfo.daily.data[0].summary);
		
		$("#weekSummary	").html(weatherInfo.daily.summary);
		
		// get weekly forecast icons
		for (j = 0; j < forecasticon.length; j++) {
			getIcon(weatherInfo.daily.data[j + 1].icon, forecasticon[j] + "-icon"); // example #mon-icon
		} */
	}; // END OF FORECAST.IO 

	$scope.error = function(err) {
		// Have some funny phrases appear below the button and it just keeps adding on. Add like 30 of these. Haha.
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};

	$scope.getLocation = function(){
		navigator.geolocation.getCurrentPosition($scope.callByIP, $scope.error, $scope.options);
	}
});







