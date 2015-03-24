'use strict';

describe('The loginController',function(){
    var scope, controller;
    beforeEach(module('graffio'));
    
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('loginController', {
        $scope: scope
      });
    }));

    it('should have a logIn function',function(){
      expect(scope.logIn).to.be.a('function');
    });
  });

describe('The signupController',function(){
    var scope, controller;
    beforeEach(module('graffio'));
    
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('signupController', {
        $scope: scope
      });
    }));

    it('should have a signUp function',function(){
      expect(scope.signUp).to.be.a('function');
    });
  });