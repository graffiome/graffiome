angular.module('graffio.clickController', [])
.controller('clickController', function($scope, $state) {
  var ref = new Firebase("https://dazzling-heat-2465.firebaseio.com");
  //test data
  $scope.test1 = 'clickcontroller test';
  $scope.test2 = 7;

  $scope.logout = function() {
    ref.unauth();
    $state.go('login');
  };


});