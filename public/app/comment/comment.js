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
      url: 'api/comments/' + courseid
    }).success(function(data) {
      //return data;
    }).error(function(data) {
      $('.progress').toggleClass('hide');
      console.log('Error: ' + data);
    });
  };

  this.addComment = function(comment, courseid) {
    return $http({
      method: 'POST',
      url: 'api/comments/' + courseid,
      data: {'user': JSON.parse(localStorage.getItem('uniuser'))._id, 'comment': comment}
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

    if (JSON.parse(window.localStorage.getItem('isLoggedIn')) === false) {
      $('#formcontent').remove();
    }
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
        $('textarea').focus();
        alertify.alert('Your comment is too big, dude!');
      }
    } else {
      alertify.alert('Please enter a comment');
    }
  };

}]);