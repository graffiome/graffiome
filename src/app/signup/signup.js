angular.module('graffio.signupController', [])
.controller('signupController', function($scope, $state) {
  var ref = new Firebase("https://dazzling-heat-2465.firebaseio.com");
  $scope.email;
  $scope.password;


  $scope.signup = function() {
    // firebase creation of new user
    ref.createUser({
      email    : $scope.email,
      password : $scope.password
    }, function(error, authData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", authData.uid);

        // now we need to log that user in to get their access token
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

      }
    });
  };

});


