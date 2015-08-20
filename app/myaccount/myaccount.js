'use strict';

angular.module('myApp.myaccount', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/myaccount/:userid', {
  	templateUrl: 'app/myaccount/myaccount.html',
  	controller: 'MyAccountCtrl'
  });
}])

.controller('MyAccountCtrl', ['$scope', '$routeParams', '$http', 'apidomain', function($scope, $routeParams, $http, apidomain) {

  $http({
    method: 'GET',
    url: apidomain + 'api/users/' + $routeParams.userid,
    headers: {'x-access-token': window.localStorage.getItem('token')},
  }).success(function(data) {
     $scope.user = data[0];
  }).error(function(data) {
    console.log('Error: ' + data);
  });

  $scope.quit = function(classroomsid) {

    $scope.currentClass = classroomsid;

    $http({
      method: 'PUT',
      url: apidomain + 'api/quit/' + JSON.parse(localStorage.getItem('user'))._id,
      data: {'classrooms': classroomsid },
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
       $scope.user = data.user;
       $scope.setClassroomAvailability($scope.currentClass);
       alertify.success('See you in the next course', 1000);
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  $scope.setClassroomAvailability = function(currentClass) {
    $http({
      method: 'PUT',
      url: apidomain + 'api/classrooms/availability/' + currentClass,
      data: {'isFull' : false },
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
      console.log(data);
    }).error(function(data) {
      console.log(data);
    });
  };

}]);