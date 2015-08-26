'use strict';

angular.module('myApp.course', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/course/:courseid', {
  	templateUrl: 'app/course/course.html',
  	controller: 'CourseCtrl'
  });
}])

.service('CourseService', ['$http', 'apidomain', function($http, apidomain) {

  this.list = function() {
    return $http({
      method: 'GET',
      url: apidomain + 'api/courses',
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
      if (data.success) {
        return data.courses;
      } else {
        window.location.href = '#/login';
      }
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  this.getCourse = function(courseid) {
    return $http({
      method: 'GET',
      url: apidomain + 'api/courses/' + courseid,
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
      if (!data.success) {
        window.location.href = '#/login';
      }
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  this.getClassroomStudents = function(classroomsid) {

    return $http({
      method: 'GET',
      url: apidomain + 'api/students/' + classroomsid,
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
      //return data;
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  this.register = function(classroomsid) {

    return $http({
      method: 'PUT',
      url: apidomain + 'api/register/' + JSON.parse(localStorage.getItem('user'))._id,
      data: {'classrooms': classroomsid},
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
       
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };

  this.setClassroomAvailability = function(classroomsid, isFull) {
    return $http({
      method: 'PUT',
      url: apidomain + 'api/classrooms/availability/' + classroomsid,
      data: { 'isFull' : isFull },
      headers: {'x-access-token': window.localStorage.getItem('token')},
    }).success(function(data) {
      
    }).error(function(data) {
      console.log('Error: ' + data);
    });
  };
  
}])

.controller('CourseCtrl', ['$scope', '$routeParams', '$http', 'apidomain', 'CourseService', function($scope, $routeParams, $http, apidomain, CourseService) {

  CourseService.getCourse($routeParams.courseid).then(function(response) {
    $scope.course = response.data.course[0];
  });

  $scope.register = function(classroomsid) {

    $scope.currentClass = classroomsid;
    $scope.currentClassParticipantNumber = 0;

    CourseService.getClassroomStudents(classroomsid).then(function(response) {
      $scope.participantNumber = response.data ? response.data.length : 0;

      var classroom = $scope.findClassroom(classroomsid);

      if ($scope.participantNumber < classroom[0].limit) {
        CourseService.register(classroomsid).then(function(response) {
          if (response.data.success) {
            $scope.participantNumber++;

            if ($scope.isFull(classroomsid)) {
              $scope.setClassroomAvailability(classroomsid);
            }

            alertify.success('You are now registered', 1000);
          } else {
            alertify.error(response.data.message, 3000);
          }
          
        });
      } else {
        alertify.alert('This classroom is already full');
      }
    });
  };

  $scope.setClassroomAvailability = function(classroomsid) {
    CourseService.setClassroomAvailability(classroomsid, $scope.participantNumber ===  $scope.findClassroom(classroomsid)[0].limit).then(function(response) {
      console.log('Classroom ' + classroomsid + ' status was set');
    });
  };

  $scope.isFull = function(currentClass) {
    var classroom = $scope.findClassroom(currentClass),
      isFull = false;

    if (classroom && classroom[0].limit === $scope.participantNumber) {
      isFull = true;
    }

    return isFull;
  };

  $scope.findClassroom = function(currentClass) {
    return $scope.course.classes.filter(function(obj) { 
      return obj._id === $scope.currentClass;
    });
  };

  $scope.getParticipants = function(classroomsid) {

    CourseService.getClassroomStudents(classroomsid).then(function(response) {
      $('#participantsModal').openModal();
      var ul = $('ul#participantsList');
      $('ul#participantsList li').remove();

      $.each(response.data, function(index, user) {
        ul.append('<li>' + user.name + '</li>');
      });
    });
  };

}]);