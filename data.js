

var app = angular.module('weatherApp', []);
app.controller('weatherController', function($scope) {

	$scope.options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	$scope.success = function(pos) {
	  var crd = pos.coords;

	  console.log('Your current position is:');
	  console.log(`Latitude : ${crd.latitude}`);
	  console.log(`Longitude: ${crd.longitude}`);
	  console.log(`More or less ${crd.accuracy} meters.`);
	};

	$scope.error = function(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};

	$scope.getLocation = function(){
		console.log("HI");
		navigator.geolocation.getCurrentPosition($scope.success, $scope.error, $scope.options);
	}
});







