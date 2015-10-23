'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
  	templateUrl: 'app/login/login.html',
  	controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$http', 'apidomain', function($rootScope, $scope, $location, $http, apidomain) {
  

}]);