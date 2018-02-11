var myDays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
// Convert the summary of the day to an icon
var dayIcons = [{
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
function getIcon(iconName, id) {
    for (i = 0; i < dayIcons.length; i++) {
        if (dayIcons[i].summary == iconName) {
            document.getElementById(id).innerHTML = "<i class='wi " + dayIcons[i].icon + " '> </i>";
        }
    }
}
// Get the time
function getDays(days) {
    var currentDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * days);
    var thisDay = currentDate.getDay();
    thisDay = myDays[thisDay];
    return thisDay;
}
// Convert celsius to farenheit
function cTOf(temp) {
    return (temp * 1.8) + 32;
}
// Convert farenheit to celsius 
function fTOc(temp) {
    return (temp - 32) * (5 / 9);
}
// Descriptions for the Preciptiation
function getPrecipDesc(precip) {
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
function getWindDesc(speed) {
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
// Based on the temperature outside, change the color of the background
function changeBackground(val) {
    if (val < 0) {
        document.body.style.backgroundColor = "#D7FFF7";
    } else if (val < 9) {
        document.body.style.backgroundColor = "#C9FFF7";
    } else if (val < 19) {
        document.body.style.backgroundColor = "#BDFFF7";
    } else if (val < 29) {
        document.body.style.backgroundColor = "#AAFFF7";
    } else if (val < 39) {
        document.body.style.backgroundColor = "#86FFE6";
    } else if (val < 49) {
        document.body.style.backgroundColor = "#61FFBE";
    } else if (val < 59) {
        document.body.style.backgroundColor = "#55FF8C";
    } else if (val < 69) {
        document.body.style.backgroundColor = "#4AFF6A";
    } else if (val < 79) {
        document.body.style.backgroundColor = "#40DE40";
    } else if (val < 85) {
        document.body.style.backgroundColor = "#C6FF3E";
    } else if (val < 90) {
        document.body.style.backgroundColor = "#FFF744";
    } else if (val < 95) {
        document.body.style.backgroundColor = "#FFC92B";
    } else if (val < 100) {
        document.body.style.backgroundColor = "#FF9036";
    } else if (val >= 100) {
        document.body.style.backgroundColor = "#FF5337";
    }
}
// Manage  the clock interval 
var intervals = [];  
$(document).ready(function() {
	intervals.push(setInterval(updateClockHome, 1000));
    getWeather();
    for (o = 0; o < 7; o++) {
        $("#" + o.toString() + "days").html(getDays(o));
    }
});

// Update the clock on screen
function updateClockHome() {
    var date = new Date(Date.now());
    var timestr = date.toLocaleTimeString();
    document.getElementById('Time').innerHTML = timestr;
}

function changeHTML(weatherInfo, country, home) {
    // Long List to convert the temperature to the color of the background			
    var forecasticon = ["mon", "tues", "wed", "thur", "fri", "sat"];
	// Get the maximum temperature that will happen today. 
    function getTemperatureMax(k) {
        return Math.round(weatherInfo.daily.data[k + 1].temperatureMax);
    }
	// Get the minimum temperature that will happen today. 
    function getTemperatureMin(k) {
        return Math.round(weatherInfo.daily.data[k + 1].temperatureMin);
    }
    // get sunrise time and sunset time
    var secRise = weatherInfo.daily.data[0].sunriseTime;
    var dateRise = new Date(secRise * 1000);
    var timestrRise = dateRise;
    var secSet = weatherInfo.daily.data[0].sunsetTime;
    var dateSet = new Date(secSet * 1000);
    var timestrSet = dateSet;
	// This is for when the home is changed by search and it can't be found by the API. It just will default to the normal time. 
    if (typeof(home) == "undefined") {
        timestrRise = timestrRise.toLocaleTimeString();
        timestrSet = timestrSet.toLocaleTimeString();
        $("#sunrise").html(timestrRise);
        $("#sunset").html(timestrSet);
    } else {
		// If the home area CAN be found, reset the intervals and make a new one. 
           intervals.forEach( clearInterval );
        function updateClock() {
            var timestr = new Date().toLocaleString('en-US', {
                timeZone: home
            })
            document.getElementById('Time').innerHTML = timestr.split(',')[1];
        }
		intervals.push(setInterval(updateClock, 1000));
        timestrRise = dateRise.toLocaleTimeString('en-US', {
            timeZone: home
        });
        timestrSet = dateSet.toLocaleTimeString('en-US', {
            timeZone: home
        });
        $("#sunrise").html(timestrRise);
        $("#sunset").html(timestrSet);
    }
    // Update the temperature with Farenheit. 
    function getFarenheitTemp() {
        $("#actualTemp").html(Math.round(weatherInfo.currently.temperature));
        $("#feelsTemp").html(Math.round(weatherInfo.currently.apparentTemperature));
        $("#todayLow").html(Math.round(weatherInfo.daily.data[0].apparentTemperatureLow));
        $("#todayHigh").html(Math.round(weatherInfo.daily.data[0].apparentTemperatureHigh));
        document.getElementById("f").style.color = "#FFFFF2";
        document.getElementById("c").style.color = "#C2C2B8";
        document.getElementById("f").style.background = "#201D21";
        document.getElementById("c").style.background = "#312c32";
        for (k = 0; k < 7; k++) {
            $("#" + forecasticon[k] + "high").html("<span class='wi wi-degrees'>" + Math.round(getTemperatureMax(k)) + "</span>");
            $("#" + forecasticon[k] + "low").html("<span class='wi wi-degrees'>" + Math.round(getTemperatureMin(k)) + "</span>");;
        }
    }
// Update the temperature with Celsius. 
    function getCelsiusTemp() {
        $("#actualTemp").html(Math.round(fTOc(weatherInfo.currently.temperature)));
        $("#feelsTemp").html(Math.round(fTOc(weatherInfo.currently.apparentTemperature)));
        $("#todayLow").html(Math.round(fTOc(weatherInfo.daily.data[0].apparentTemperatureLow)));
        $("#todayHigh").html(Math.round(fTOc(weatherInfo.daily.data[0].apparentTemperatureHigh)));
        document.getElementById("f").style.color = "#C2C2B8";
        document.getElementById("c").style.color = "#FFFFF2";
        document.getElementById("f").style.background = "#312c32";
        document.getElementById("c").style.background = "#201D21";
        for (k = 0; k < 7; k++) {
            $("#" + forecasticon[k] + "high").html(Math.round(fTOc(getTemperatureMax(k))));
            $("#" + forecasticon[k] + "low").html(Math.round(fTOc(getTemperatureMin(k))));
        }
    }
  
    // Show the user the cloudiness icon for the current day
    getIcon(weatherInfo.currently.icon, "cloudinessIcon");
	// Change the background based on the APPARENT temperature. 
    changeBackground(weatherInfo.currently.apparentTemperature);
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
    // get the current cloudiness 
	console.log(weatherInfo);
    $("#cloudinessCurrentDescription").html(weatherInfo.currently.cloudCover*100 + " percent cloudy")
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
    }
}; // END OF FORECAST.IO 

// Geolocation API Call
var for_key = "813195e09d571d569dfc52a878bea90c";
var apikey = "AIzaSyDCZSr-AlvZAUyBbAytuXVfVlkoGDLkFYA";
// TimeZone API Call. 
var timeZoneKey = "AIzaSyBpIn1cOyM3O9Ud1LBmNeHAa0U9M54tx5U";
$("#searchButton").on('click', function() {
    callByPostal($("#search-bar").val());
});

function callByPostal(postal) {
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

function callByIP(position) {
    // API stuff
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + "," + long + "&key=" + apikey;
    var for_call = "https://api.forecast.io/forecast/" + for_key + "/" + lat + "," + long + "?callback=?";
    $.getJSON(GEOCODING, function(json) {
        // get location 
        var address = json.results[2].formatted_address;
        var country = address.slice(-3);
        $('#Location').text(address);
        $.getJSON(for_call, function(json) {
            changeHTML(json, country);
        });
    }); // End of GEOCODE 
}
function getWeather() {
    function error() {
        console.log("error");
    }
    navigator.geolocation.getCurrentPosition(callByIP, error);
}