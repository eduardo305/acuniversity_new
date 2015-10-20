'use strict'

angular.module('myApp.nav', ['ngRoute'])


.controller('NavCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function($scope, $rootScope, $http, $routeParams) {

    $http({
        method: 'GET',
        url: 'api/isAuthenticated'
    }).success(function(response) {
        $scope.isLoggedIn = false;

        $scope.isLoggedIn = response.isLoggedIn !== undefined;

        $scope.user = response.user;

        $scope.navItems = [{
            name: 'my profile',
            link: (function() {
                var username, link;

                if ($scope.isLoggedIn) {
                    link = '/#/profile/' + $scope.user.email.replace('@avenuecode.com', '');
                }

                return link;
            })(),
            needsAuth: true,
            display: true === $scope.isLoggedIn,
            user: function() {
                var username;

                if (JSON.parse(localStorage.getItem('uniuser'))) {
                    username = JSON.parse(localStorage.getItem('uniuser')).email.replace('@avenuecode.com', '');
                }

                return username;
            }
        }, {
            name: 'see all courses',
            link: '#/courses',
            needsAuth: false,
            display: true
        }];

        localStorage.setItem('isLoggedIn', $scope.isLoggedIn);

    }).error(function(response) {
        console.log('Error: ' + response);
        $('.progress').toggleClass('hide');
    });

    $scope.logout = function() {
        $('.button-collapse').sideNav('hide');
        localStorage.clear();
        window.location.href = '/logout';
    };

    $scope.login = function() {
        $('.button-collapse').sideNav('hide');
        window.location.href = '#/login';
    };
}]);
