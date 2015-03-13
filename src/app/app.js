angular.module('graffio', [
  'graffio.signupController',
  'graffio.loginController',
  'graffio.clickController',
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider) {
  var rootRef = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/uauth');
  var user = rootRef.getAuth();
  if (!user) {
    $urlRouterProvider.otherwise("/login");
  } else {
    $urlRouterProvider.otherwise("/click");
  }

  // Now set up the states
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: "signup/signup.html",
      controller: "signupController",
    })
    .state('login', {
      url: '/login',
      templateUrl: "login/login.html",
      controller: "loginController"
    })
    .state('click', {
      url: '/click',
      templateUrl: "click/click.html",
      controller: "clickController"
    });

  

});