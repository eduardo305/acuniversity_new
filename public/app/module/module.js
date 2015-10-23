'use strict';

angular.module('myApp.module', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'app/module/module.html',
    controller: 'ModuleCtrl'
  });
}])


.controller('ModuleCtrl', ['$scope', '$http', 'apidomain', function($scope, $http, apidomain) {

  $scope.init = (function() {
    var logout = document.getElementById('logout');
      logout.style.visibility = 'visible';


      var myAccount = document.getElementById('myAccount');
      if (localStorage.getItem('user') && myAccount.getAttribute('href').endsWith('myaccount/')) {
        myAccount.setAttribute('href',  myAccount.href + JSON.parse(localStorage.getItem('user'))._id);
        myAccount.style.display = 'block';
      }
  })();

	/*$http({
    method: 'GET',
    url: apidomain + 'api/modules',
    headers: {'x-access-token': window.localStorage.getItem('token')},
  }).success(function(data) {
  	if (data.success) {
      $.each(data.courses, function(index, course) {
        $scope.checkCourseStatus(course);
      });
  		$scope.courses = data.courses;
  		

  	} else {
  		window.location.href = '#/login';
  	}
  }).error(function(data) {
    console.log('Error: ' + data);
  });*/

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