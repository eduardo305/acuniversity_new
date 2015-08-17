'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', 'apidomain', function($scope, $http, apidomain) {
	$http({
      method: 'GET',
      url: apidomain + 'api/courses',
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
    	if (data.success) {
    		$scope.courses = data.courses;
    		var logout = document.getElementById('logout');
    		logout.style.visibility = 'visible';


    		var myAccount = document.getElementById('myAccount');
		    if (localStorage.getItem('user') && myAccount.getAttribute('href').endsWith('view3/')) {
		      myAccount.setAttribute('href',  myAccount.href + JSON.parse(localStorage.getItem('user'))._id);
		      myAccount.style.display = 'block';
		    }

    	} else {
    		window.location.href = '#/login';
    	}
    }).error(function(data) {
      console.log('Error: ' + data);
    });
}]);