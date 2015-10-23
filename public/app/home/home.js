'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'app/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$rootScope', '$http', 'apidomain', 'CourseService', function($scope, $rootScope, $http, apidomain, CourseService) {

  CourseService.list().then(function(response) {
    $scope.courses = response.data.courses;
    $('.button-collapse').sideNav('hide');
    if (response.data.user) {
      localStorage.setItem('uniuser', JSON.stringify(response.data.user));  
    } else {
      localStorage.removeItem('uniuser');
    }
  });

  // Temporarily hack used to kick out all previous user session
  if (JSON.parse(localStorage.getItem('user'))) {
    localStorage.clear();
  }

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