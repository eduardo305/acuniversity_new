'use strict';

angular.module('myApp.comment', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/comments/:courseid', {
  	templateUrl: 'app/comments/comments.html',
  	controller: 'CommentCtrl'
  });
}])

.service('CommentService', ['$http', 'apidomain', function($http, apidomain) {

  this.getCommentsByCourse = function(courseid) {

    return $http({
      method: 'GET',
      url: apidomain + 'api/comments/' + courseid,
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
      //return data;
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  this.addComment = function(comment, courseid) {
    return $http({
      method: 'POST',
      url: apidomain + 'api/comments/' + courseid,
      data: {'user': JSON.parse(localStorage.getItem('user'))._id, 'comment': comment},
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
       
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };
}])

.controller('CommentCtrl', ['$scope', '$routeParams', '$http', 'apidomain', 'CommentService', function($scope, $routeParams, $http, apidomain, CommentService) {

  CommentService.getCommentsByCourse($routeParams.courseid).then(function(response) {
    $('.progress').toggleClass('hide');
    $scope.comments = response.data;
    $('textarea#commentarea').characterCounter();
  });

  $scope.addComment = function() {
    if ($('textarea').val()) {
      if ($('textarea').val().length <= 360) {
        $('.progress').toggleClass('hide');
        CommentService.addComment($('textarea').val(), $routeParams.courseid).then(function(response) {
          $('.progress').toggleClass('hide');
          $scope.comments.unshift(response.data.comment);
          $('textarea').val('');
        });
      } else {
        $('textarea').val('');
        $('textarea').focus();
        alertify.alert('Your comment is too big, dude!');
      }
    } else {
      alertify.alert('Please enter a comment');
    }
  };

}]);