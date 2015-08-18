'use strict';

angular.module('myApp.course', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/course/:courseid', {
  	templateUrl: 'app/course/course.html',
  	controller: 'CourseCtrl'
  });
}])

.controller('CourseCtrl', ['$scope', '$routeParams', '$http', 'apidomain', function($scope, $routeParams, $http, apidomain) {

  $http({
    method: 'GET',
    url: apidomain + 'api/courses/' + $routeParams.courseid,
    headers: {'x-access-token': window.localStorage.getItem('token')},
  }).success(function(data) {
    if (data.success) {
      $scope.course = data.course[0];
    } else {
      window.location.href = '#/login';
    }
  }).error(function(data) {
    console.log('Error: ' + data);
  });

  $scope.register = function(classroomsid) {

    $scope.currentClass = classroomsid;

    $http({
      method: 'GET',
      url: apidomain + 'api/students/' + classroomsid,
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
        var classLimit = $scope.course.classes.filter(function(obj) { 
          return obj._id === $scope.currentClass
        });

        if (data.length < classLimit[0].limit) {
          $http({
            method: 'PUT',
            url: apidomain + 'api/register/' + JSON.parse(localStorage.getItem('user'))._id,
            data: {'classrooms': $scope.currentClass },
            headers: {'x-access-token': window.localStorage.getItem('token')},
          }).success(function(data) {
             if (data.success) {
                alertify.success('You are now registered', 1000);
             } else {
                alertify.error(data.message, 3000);
             }
          }).error(function(data) {
            console.log('Error: ' + data);
          });

        } else {
          alertify.alert('This is class is already full');
        }
    }).error(function(data) {
      console.log('Error: ' + data);
    });

  };

  $scope.getParticipants = function(classroomsid) {
    $http({
      method: 'GET',
      url: apidomain + 'api/students/' + classroomsid,
      headers: {'x-access-token': window.localStorage.getItem('token')}

    }).success(function(data) {

    }).error(function(data) {

    });
  };

}]);