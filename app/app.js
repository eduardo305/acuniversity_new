'use strict'

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.course',
  'myApp.profile',
  'myApp.login',
  'myApp.comment',
  'myApp.nav',
  //'myApp.module',
  'myApp.version'
])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
//}]).constant('apidomain', 'http://162.243.153.161/');
//}]).constant('apidomain', 'http://127.0.0.1:1234/');
}]).constant('apidomain', 'http://127.0.0.1:8000/');
