'use strict';

describe('myApp.course module', function() {

  beforeEach(module('myApp.course'));

  describe('course controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var courseCtrl = $controller('CourseCtrl');
      expect(courseCtrl).toBeDefined();
    }));

  });
});