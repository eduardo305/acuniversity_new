'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'app/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$http', 'apidomain', function($scope, $http, apidomain) {
	$http({
    method: 'GET',
    url: apidomain + 'api/courses',
    headers: {'x-access-token': window.localStorage.getItem('token')},
  }).success(function(data) {
  	if (data.success) {
      $.each(data.courses, function(index, course) {
        $scope.checkCourseStatus(course);
      });
  		$scope.courses = data.courses;
  		var logout = document.getElementById('logout');
  		logout.style.visibility = 'visible';


  		var myAccount = document.getElementById('myAccount');
	    if (localStorage.getItem('user') && myAccount.getAttribute('href').endsWith('myaccount/')) {
	      myAccount.setAttribute('href',  myAccount.href + JSON.parse(localStorage.getItem('user'))._id);
	      myAccount.style.display = 'block';
	    }

  	} else {
  		window.location.href = '#/login';
  	}
  }).error(function(data) {
    console.log('Error: ' + data);
  });

  $scope.checkCourseStatus = function(course) {
    var full = true;

    $.each(course.classes, function(index, classroom) {
      if (!classroom.isFull) {
        full = false;
        return full === false;
      } 
    });

    course.isFull = full;
  };


}]);