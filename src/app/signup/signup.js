angular.module('graffio.signupController', [])
.controller('signupController', function($scope, $state) {
  var ref = new Firebase("https://dazzling-heat-2465.firebaseio.com");
  $scope.email;
  $scope.password;


  $scope.signup = function() {
    ref.createUser({
      email    : $scope.email,
      password : $scope.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        $state.go('click');
      }
    });
  };

});