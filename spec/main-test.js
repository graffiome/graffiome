'use strict';

describe('The mainController',function(){
    var scope, controller;
    beforeEach(module('graffio'));
    
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('mainController', {
        $scope: scope
      });
    }));

    it('should have a logout function',function(){
      expect(scope.logout).to.be.a('function');
    });
  });

describe('The paletteControlle',function(){
    var scope, controller;
    beforeEach(module('graffio'));
    
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('paletteController', {
        $scope: scope
      });
    }));

    it('should have an erase function',function(){
      expect(scope.erase).to.be.a('function');
    });

    it('should have a changeColor function',function(){
      expect(scope.changeColor).to.be.a('function');
    });

    it('should have a nyan function',function(){
      expect(scope.nyan).to.be.a('function');
    });

  });
