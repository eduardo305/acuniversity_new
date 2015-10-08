'use strict';

angular.module('myApp.myaccount', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/myaccount/:userid', {
  	templateUrl: 'app/myaccount/myaccount.html',
  	controller: 'MyAccountCtrl'
  });
}])

.controller('MyAccountCtrl', ['$scope', '$routeParams', '$http', 'apidomain', function($scope, $routeParams, $http, apidomain) {
  // Initialize collapse button
  $http({
    method: 'GET',
    url: apidomain + 'api/users/' + $routeParams.userid,
    headers: {'x-access-token': window.localStorage.getItem('token')},
  }).success(function(data) {
    $scope.user = data.user[0];

    // Hide sideNav
    $('.button-collapse').sideNav('hide');
    $('.progress').toggleClass('hide');

    setTimeout(function() {
      $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    }, 500);
    
  }).error(function(data) {
    console.log('Error: ' + data);
    $('.progress').toggleClass('hide');
  });

  $scope.quit = function(classroomsid) {

    $scope.currentClass = classroomsid;

    $http({
      method: 'PUT',
      url: apidomain + 'api/quit/' + JSON.parse(localStorage.getItem('user')).email.replace('@avenuecode.com', ''),
      data: {'classrooms': classroomsid },
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
       $scope.user = data.user;
       $scope.setClassroomAvailability($scope.currentClass);
       setTimeout(function() {
          $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
       }, 500);
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