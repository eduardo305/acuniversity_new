var nav = (function() {
    var self = {};

    self.init = function() {
        self.setMyAccountMenu();
        self.setLogoutMenu();
    };

    self.setMyAccountMenu = function() {
        var myAccount = document.getElementsByClassName('myAccount'),
            user = localStorage.getItem('user');

        if (user) {
            if (typeof String.prototype.endsWith !== 'function') {
                String.prototype.endsWith = function(suffix) {
                    return this.indexOf(suffix, this.length - suffix.length) !== -1;
                };
            }

            $.each(myAccount, function(index, account) {
              if (account.getAttribute('href').endsWith('myaccount/')) {
                account.setAttribute('href',  account.href + JSON.parse(localStorage.getItem('user')).email.replace('@avenuecode.com', ''));
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

            if (localStorage.getItem('user')) {
                logout.style.visibility = 'visible';
            } else {
                logout.style.visibility = 'hidden';
            }
        });
    };

    return self;

})();

nav.init();

/*'use strict';

angular.module('myApp.nav', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nav', {
    templateUrl: 'app/nav/nav.html',
    controller: 'NavCtrl'
  });
}])

.service('NavService', ['$http', 'apidomain', function($http, apidomain) {
  this.init = function() {
    self.setMyAccountMenu();
    self.setLogoutMenu();
  };

  this.setMyAccountMenu = function() {
    var myAccount = document.getElementsByClassName('myAccount'),
      user = localStorage.getItem('user');

    if (user) {
      $.each(myAccount, function(index, account) {
        account.setAttribute('href',  account.href + JSON.parse(localStorage.getItem('user'))._id);
      });
    } else {
      myAccount.style.display = 'none';
    }
  };

  this.setLoginMenu = function() {

  };

  this.setLogoutMenu = function() {
    var logout = document.getElementById('logout');
    logout.onclick = function() {
      localStorage.clear();
      window.location.href = '#/login';
      window.location.reload();
    };

    if (localStorage.getItem('user')) {
      logout.style.visibility = 'visible';
    } else {
      logout.style.visibility = 'hidden';
    }
  };
}])

.controller('NavCtrl', ['$scope', '$routeParams', '$http', 'apidomain', 'NavService', function($scope, $routeParams, $http, apidomain, NavService) {


}]);*/
