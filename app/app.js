'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.course',
  'myApp.myaccount',
  'myApp.login',
  'myApp.comment',
  //'myApp.module',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]).constant('apidomain', 'http://162.243.153.161/');

