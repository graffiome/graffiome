angular.module('graffio.loginController', [])
.controller('loginController', function($scope, $state) {
  var ref = new Firebase("https://dazzling-heat-2465.firebaseio.com");
  $scope.email;
  $scope.password;
  
  $scope.logIn = function() {
    console.log('login called!');
    ref.authWithPassword({
      email    : $scope.email,
      password : $scope.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        // send the token to the background script so it can be accessed by each tab
        chrome.runtime.sendMessage({auth: authData, action: 'setToken'});
        $state.go('click');
      }
    });
  };
  

});