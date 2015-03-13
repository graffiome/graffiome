angular.module('graffio.loginController', [])
.controller('loginController', function($scope, $state) {
  var ref = new Firebase("https://dazzling-heat-2465.firebaseio.com");
  $scope.email;
  $scope.password;
  
  $scope.login = function() {
    ref.authWithPassword({
      email    : $scope.email,
      password : $scope.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $state.go('click');
      }
    });
  };
  

});