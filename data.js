function getWeather() {

  var myDays=
["Sun","Mon","Tues","Wed","Thur","Fri","Sat","Sun"]
  function getDays(days){
   
var currentDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)*days);
var thisDay=currentDate.getDay()
thisDay=myDays[thisDay]
//console.log(thisDay)
return thisDay;
}
  for (o=0; o<7; o++){
    
    $("#"+ o.toString() + "days").html(getDays(o));
  }
 
  function success(position) {

    function getIcon(ilon, id) {
  
      for (i = 0; i < dayIcons.length; i++) {
        
        if (dayIcons[i].summary == ilon) {
          document.getElementById(id).className = "wi " + dayIcons[i].icon
        }
      }
    }

    function cTOf(temp) {
      return (temp * 1.8) + 32;
      
    } /* END OF CTOF */
    function fTOc(temp) {
      return (temp - 32) * (5 / 9);
    }

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

    function getWindDesc(speed) {
      /* Ack: https://www.windfinder.com/wind/windspeed.htm for brief descriptions of windspeed, which I based these off of */
      if (speed < .2) {
        return "Wind? We don't know of Wind in this country.";
      } else if (speed < 1.5) {
        return "Pretty much no wind.";
      } else if (speed < 3.3) {
        return "Some wind on ya body bro.";

      } else if (speed < 5.4) {
        return "watch out for twigs they may be possessed";
      } else if (speed < 7.9) {
        return "WATCH OUT IT'S A MINI TORNADO AAAAAAH!";
      } else if (speed < 10.7) {
        return "Be on the lookout for long branches on the ground, they might attack you.";
      } else if (speed < 13.8) {
        return "HAHAHA GOOD LUCK USING THAT UMBRELLA HAHAHAHAH";
      } else if (speed < 17.1) {
        return "AAAAH THE TREES ARE FUCKING POSSESSED AAAAH!!!";
      } else if (speed >= 17.1) {
        return "WHY THE FUCK ARE YOU OUTSIDE?";
      }
    } /* END OF WINDDESC */
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var apikey = "AIzaSyDCZSr-AlvZAUyBbAytuXVfVlkoGDLkFYA";
    var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + "," + long + "&key=" + apikey;
    var for_key = "813195e09d571d569dfc52a878bea90c";
    var for_call = "https://api.forecast.io/forecast/" + for_key + "/" + lat + "," + long + "?callback=?";

    //    console.log(GEOCODING);
  //      console.log(for_call);
     
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

    $.getJSON(GEOCODING, function(json) {

      // get location 
      var address = json.results[2].formatted_address;
      var usa = address.slice(-3);

      $('#Location').text(address);

      $.getJSON(for_call, function(weatherInfo) {
//console.log(weatherInfo);
    function FchangeBackground(val) {
    
    if (val < 0){
      document.body.style.backgroundColor = "#D7FFF7";
    } else if (val < 9){
      document.body.style.backgroundColor = "#C9FFF7";
    }
    else if (val < 19){
      document.body.style.backgroundColor = "#BDFFF7";
    }
    else if (val < 29){
      document.body.style.backgroundColor = "#AAFFF7";
    }
    else if (val < 39){
      document.body.style.backgroundColor = "#86FFE6";
    }
    else if (val < 49){
      document.body.style.backgroundColor = "#61FFBE";
    }
    else if (val < 59){
      document.body.style.backgroundColor = "#55FF8C";
    }
    else if (val < 69){
      document.body.style.backgroundColor = "#4AFF6A";
    }  
    else if (val < 79){
      document.body.style.backgroundColor = "#40DE40";
    }
   else if (val < 85){
      document.body.style.backgroundColor = "#C6FF3E";
    }
      else if (val < 90){
      document.body.style.backgroundColor = "#FFF744";
    }
      else if (val < 95){
      document.body.style.backgroundColor = "#FFC92B";
    }
      else if (val < 100){
      document.body.style.backgroundColor = "#FF9036";
    }
    else if (val >=100){
      document.body.style.backgroundColor = "#FF5337";
    }  
}

  
        
     var forecasticon = ["mon", "tues", "wed", "thur", "fri", "sat"];
        function FgetHighLow() {
            
          for (k = 0; k < 7; k++) {
            //  for (l=0; l<2; l++){

            $("#" + forecasticon[k] + "high").html(Math.round((weatherInfo.daily.data[k + 1].temperatureMax)));
            $("#" + forecasticon[k] + "low").html(Math.round((weatherInfo.daily.data[k + 1].temperatureMin)));
            //}
          }
        }

        function CgetHighLow() {

          for (k = 0; k < 7; k++) {
            //  for (l=0; l<2; l++){
                     
            $("#" + forecasticon[k] + "high").html(Math.round(fTOc(weatherInfo.daily.data[k + 1].temperatureMax)));
            $("#" + forecasticon[k] + "low").html(Math.round(fTOc(weatherInfo.daily.data[k + 1].temperatureMin)));
            //}
          }
        }

        function getHighLow() {

          for (k = 0; k < 7; k++) {
            //  for (l=0; l<2; l++){
            $("#" + forecasticon[k] + "high").html(Math.round(weatherInfo.daily.data[k + 1].temperatureMax));
            $("#" + forecasticon[k] + "low").html(Math.round(weatherInfo.daily.data[k + 1].temperatureMin));
            //}

          }
        }

        function updateClock() {

          var date = new Date(Date.now())

          var timestr = date.toLocaleTimeString();
          document.getElementById('Time').innerHTML = timestr;

          setTimeout(updateClock, 1000);
        }

        function getFtemp() {


          $("#temp").html(Math.round(weatherInfo.currently.temperature));
          $("#Feels").html(Math.round(weatherInfo.currently.apparentTemperature));
          document.getElementById("f").style.color = "#FFFFF2";
          document.getElementById("c").style.color = "#C2C2B8";

          document.getElementById("f").style.background = "#201D21";
          document.getElementById("c").style.background = "#312c32";
          getHighLow()
        }

        function getCtemp() {

          $("#temp").html(Math.round(fTOc(weatherInfo.currently.temperature)));

          $("#Feels").html(Math.round(fTOc(weatherInfo.currently.apparentTemperature)));
          document.getElementById("f").style.color = "#C2C2B8";
          document.getElementById("c").style.color = "#FFFFF2";
          

          document.getElementById("f").style.background = "#312c32";
          document.getElementById("c").style.background = "#201D21";
         
          CgetHighLow()
       
        }
        //get time 
setInterval(updateClock, 1000);

 getIcon(weatherInfo.currently.icon, "icon");
         
        // get image
  
        // get temp    

        if (usa != "USA") {
          FchangeBackground(weatherInfo.currently.apparentTemperature);
         // document.body.style.backgroundColor = "#37343F";
          getCtemp();
          
        } else if (usa =="USA"){
           FchangeBackground(weatherInfo.currently.apparentTemperature);
          getFtemp();
        }
        
        document.getElementById('f').onclick = function() {

          getHighLow();
          FchangeBackground(weatherInfo.currently.apparentTemperature);
          getFtemp();
        }

        document.getElementById('c').onclick = function() {
            if (usa == "USA") {
  
              CgetHighLow();
            } else {
              getHighLow();
            }
 FchangeBackground((weatherInfo.currently.apparentTemperature))  
 //console.log((weatherInfo.currently.apparentTemperature))
          //document.body.style.backgroundColor = "#37343F";
            getCtemp();
          }
          // get today's forecast 
  
        $("#summary").html(weatherInfo.daily.data[0].summary)

        // get desc 

        $("#descup").html(weatherInfo.currently.summary)

        // get witty precip and wind descs

        $("#witty-wind").html(getWindDesc(weatherInfo.currently.windSpeed));
        $("#witty-precip").html(getPrecipDesc(weatherInfo.currently.precipIntensity));

        // get actual precip and wind

        $("#actual-wind").html(weatherInfo.currently.windSpeed);
        $("#actual-precip").html(weatherInfo.currently.precipIntensity);

        // get sunrise time and sunset time

        var sec = weatherInfo.daily.data[0].sunriseTime;
        var date = new Date(sec * 1000);
        var timestr = date.toLocaleTimeString();
        $(".sunrise").html(timestr);

        var sec = weatherInfo.daily.data[0].sunsetTime;
        var date = new Date(sec * 1000);
        var timestr = date.toLocaleTimeString();
        $(".sunset").html(timestr);
        // get weekly forecast icons

       
        for (j = 0; j < forecasticon.length; j++) {

          getIcon(weatherInfo.daily.data[j + 1].icon, forecasticon[j] + "-icon"); // example #mon-icon

        }
        // get weekly highs and lows

        // var highlowicon = ["monhigh", "monlow", "tuehigh", "tuelow", "wedhigh", "wedlow", "thurhigh", "thurlow", "frihigh", "frilow", "sathigh", "satlow"];
        // console.log(highlowicon.length)
     
      }); // END OF FORECAST.IO 

    }); // End of GEOCODE 

  } // End of Success

  function error() {
    console.log("error");

  }

  navigator.geolocation.getCurrentPosition(success, error);

}
$(document).ready(function() {
  getWeather();
});