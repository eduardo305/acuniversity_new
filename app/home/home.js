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
    $('.button-collapse').sideNav('hide');
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

  var homenav = (function() {
    var self = {};

    self.init = function() {
      self.setMyAccountMenu();
      self.setLogoutMenu();
    };

    self.setMyAccountMenu = function() {
      var myAccount = document.getElementsByClassName('myAccount'),
        user = localStorage.getItem('uniuser');

      if (user) {

        if (typeof String.prototype.endsWith !== 'function') {
            String.prototype.endsWith = function(suffix) {
                return this.indexOf(suffix, this.length - suffix.length) !== -1;
            };
        }

        $.each(myAccount, function(index, account) {
          if (account.getAttribute('href').endsWith('myaccount/')) {
            account.setAttribute('href',  account.href + JSON.parse(localStorage.getItem('uniuser')).email.replace('@avenuecode.com', ''));
            account.style.display = 'block';
          }
        });
      } else {
        $.each(myAccount, function(index, account) {
          account.style.display = 'none';
        });
        
      }
    };

    self.setLoginMenu = function() {

    };

    self.setLogoutMenu = function() {
      var logout = document.getElementsByClassName('logout');

      $.each(logout, function(index, logout) {
        logout.onclick = function() {
          localStorage.clear();
          window.location.href = '#/login';
          window.location.reload();
        };

        if (localStorage.getItem('uniuser')) {
          logout.style.visibility = 'visible';
        } else {
          logout.style.visibility = 'hidden';
        }
      });
    };

    return self;

  })();

  homenav.init();


}]);