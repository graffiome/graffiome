'use strict';
angular.module('graffio.mainController', [])
.controller('mainController', function($scope, $state) {
  var ref = new Firebase("https://dazzling-heat-2465.firebaseio.com");

  $scope.logout = function() {
    ref.unauth();
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {lougout: true}, function(res){
        console.log(res);
      });
    });
    $state.go('login');
  };
}).controller('onOffController', function($scope){ 
  // initialize text before we can query the current tab
  $scope.onOffButtonTxt = 'loading...';

  // helper function to determine what the current tab is and perform a callback on that tabID value
  var getCurrentTabID = function(callback) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var currentTabId = tabs[0].id;
      callback(currentTabId);
    });
  };

  // getStatus takes a callback and applies it to the status of the current tab
  // it queries the current tab for the status of the app on that tab
  var getStatus = function(callback) {
    getCurrentTabID(function(tabID) {
      chrome.tabs.sendMessage(tabID, {getStatus: true}, function(res) {
        callback(res.status, tabID);
      });
    });
  };

  // generic UI update function for the status of the app
  // needs to use $scope.$apply since these callback functions otherwise wouldn't trigger a $digest event
  // even though they would update the $scope variable values...
  // $scope.$apply triggers the $digest, which in turn is what causes a UI update
  var setStatusUi = function(status) {
    console.log('setStatusUI called...');
    console.log('setStatusUI status: ', status);
    $scope.$apply(function() {
      if (status === 'off') {
        $scope.onOffButtonTxt = 'On';
      } else {
        $scope.onOffButtonTxt = 'Off';
      }
    })
  };

  // generic send tab message function, telling the content script to change from
  // the current status to the opposite
  var sendTabMessage = function(status, tabID) {
    var msg;
    if (status === 'off') {
      msg = 'on';
    } else {
      msg = 'off';
    }
    chrome.tabs.sendMessage(tabID, {toggle: msg}, function(res){
      console.log('toggleStatus:', res);
    });
  };
    
  // function called when button is pressed by user wishing to toggle the current state
  $scope.toggleStatus = function() {

    // figure out what existing state is from the content script
    getStatus(function(status, tabID) {
      // send a message to the tab and also set the current button value to be the opposite
      // ie. if a user clicks 'On' it should send a message telling the app to start drawing
      // and also change the UI here to indicate that the next click will turn the app off
      sendTabMessage(status, tabID);
      if (status === 'off') {
        setStatusUi('on');  
      } else {
        setStatusUi('off');
      }
      
    });
  };
 
  console.log('initial get status called...');
  // Initiall call to getStatus to figure out what status the page was in last.
  getStatus(function(status, tabID) {
    setStatusUi(status);
    console.log('status set');
  });
});
