'use strict';

describe('myApp.myaccount module', function() {

  beforeEach(module('myApp.myaccount'));

  describe('myaccount controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var myaccountCtrl = $controller('MyaccountCtrl');
      expect(myaccountCtrl).toBeDefined();
    }));

  });
});