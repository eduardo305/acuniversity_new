'use strict';

angular.module('myApp.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile/:userid', {
    templateUrl: 'app/profile/profile.html',
    controller: 'ProfileCtrl'
  });
}])

.service('ProfileService', ['$http', function($http) {
  this.me = function(username) {
    return $http({
      method: 'GET',
      url: 'api/users/' + username
    });
  };

  this.quit = function(classroomsid) {

    return $http({
      method: 'PUT',
      url: 'api/quit/' + JSON.parse(localStorage.getItem('uniuser')).email.replace('@avenuecode.com', ''),
      data: {'classrooms': classroomsid }
    });
  };

  this.setClassroomAvailability = function(classroomsid) {
    return $http({
      method: 'PUT',
      url: 'api/classrooms/availability/' + classroomsid,
      data: {'isFull' : false }
    });
  };

}])

.controller('ProfileCtrl', ['$scope', '$routeParams', '$http', 'apidomain', 'ProfileService', function($scope, $routeParams, $http, apidomain, ProfileService) {

  ProfileService.me($routeParams.userid).then(function(response) {
    if (response.data.success) {
      $scope.user = response.data.user[0];

      // Hide sideNav
      $('.button-collapse').sideNav('hide');
      $('.progress').toggleClass('hide');

      setTimeout(function() {
        $('.collapsible').collapsible({
          accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
      }, 500);
    } else {
      alertify.error(response.data.message, 3000);
      window.location.href = '#/login';
    }
  });

  $scope.quit = function(classroomsid) {
    ProfileService.quit(classroomsid).then(function(response) {
      if (response.data.success) {
        $scope.user = response.data.user;
        $scope.setClassroomAvailability(classroomsid);
        setTimeout(function() {
          $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        }, 500);
        alertify.success('See you in the next course', 1000);
      }
    });
  };

  $scope.setClassroomAvailability = function(currentClass) {
    ProfileService.setClassroomAvailability(currentClass).then(function(response) {
      console.log(response);
    });
  };

}]);