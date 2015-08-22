'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'app/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$http', 'apidomain', 'CourseService', function($scope, $http, apidomain, CourseService) {

  CourseService.list().then(function(response) {
    $scope.courses = response.data.courses;
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