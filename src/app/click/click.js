'use strict';
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
}).controller('onOffController', function($scope){ 
//TODO: get state from background, set state, message content script
  var getCurrentTabID = function(callback) {
    chrome.tabs.query( {currentWindow: true, active: true}, function(tabs){
      var currentTabId = tabs[0].id;
      callback(currentTabId);
    });
  };

  var getStatus = function(callback) {
    getCurrentTabID(function(tabID) {
      chrome.tabs.sendMessage(tabID, {getStatus: true}, function(res) {
        callback(res.status, tabID);
      });
    });
  };
  
  $scope.toggleStatus = function() {
    getStatus(function(status, tabID) {
      var msg;
      if (status === 'off') {
        msg = 'on';
        $scope.onOffButtonTxt = 'Off';
      } else {
        msg = 'off';
        $scope.onOffButtonTxt = 'On';
      }
      chrome.tabs.sendMessage(tabID, {toggle: msg}, function(res){
        console.log('toggleStatus:', res);
      });
    });
  };

  getStatus(function(res) {
    $scope.onOffButtonTxt = res.status;
    console.log('status set');
  });
});
