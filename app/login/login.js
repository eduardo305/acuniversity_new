'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
  	templateUrl: 'app/login/login.html',
  	controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$http', 'apidomain', function($rootScope, $scope, $location, $http, apidomain) {

  $scope.login = function(pUser) {
    var user;

    if (pUser) {
      user = {
        email: pUser.email,
        password: pUser.password
      };  
    } else {
      user = {
        email: $scope.registered.email,
        password: $scope.registered.password
      };
    }

    $http({
      method: 'POST',
      url: apidomain + 'api/authenticate/',
      data: {email: user.email, password: user.password},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      }
    }).success(function(data) {
      
      if (data.success) {
        window.localStorage.setItem('token', data.token);
        window.localStorage.setItem('uniuser', JSON.stringify(data.user));
        window.location.href = '#/view1';
      } else {
        alertify.alert('Invalid user...');
      }

    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  $scope.register = function() {
    var user = {
      name: $scope.user.name,
      email: $scope.user.email,
      password: $scope.user.password
    };

    var validUser = function(user) {
      if (!user.name || !user.email || !user.password) {
        return false;
      } else if (user.email.indexOf('@avenuecode.com') === -1) {
        return false;
      } 

      return true;
    };

    if (validUser(user)) {
      $http({
        method: 'POST',
        url: apidomain + 'api/setup/',
        data: user,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        }
      }).success(function(data) {
        $scope.login(user);

      }).error(function(data) {
        console.log(data);
      });
    } else {
      alertify.alert('One of the inputs are empty or you forgot to add the @avenuecode.com to your e-mail! Please, try it once again...');
    }
  };

  $scope.openModal = function() {
    $('#remembermeModal').openModal();
  };

  $scope.rememberme = function(email) {
    var email = $('#rememberemail').val();

    if (email && email.length > 0) {
      $http({
        method: 'POST',
        url: apidomain + 'api/rememberme',
        data: {email: email},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        }
      }).success(function(data) {
        alertify.alert('Your password was sent. Please check your email. If you don\'t see it, please check your spam box');

      }).error(function(data) {
        alertify.alert('Something went wrong. Please try again later...');
      });
    } else {
      alertify.alert('Please enter one valid email...');
    }
  };

}]);