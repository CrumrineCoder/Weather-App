

var app = angular.module('weatherApp', []);
app.controller('weatherController', function($scope) {

	$scope.options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	$scope.success = function(pos) {
	  var crd = pos.coords;
	  
	  document.getElementById("index").style.display = "block";
      document.getElementById("splash").style.display = "none";
	  console.log(crd.latitude);
	  console.log('Your current position is:');
	  console.log(`Latitude : ${crd.latitude}`);
	  console.log(`Longitude: ${crd.longitude}`);
	  console.log(`More or less ${crd.accuracy} meters.`);
	};

	$scope.error = function(err) {
		// Have some funny phrases appear below the button and it just keeps adding on. Add like 30 of these. Haha.
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};

	$scope.getLocation = function(){
		navigator.geolocation.getCurrentPosition($scope.success, $scope.error, $scope.options);
	}
});







