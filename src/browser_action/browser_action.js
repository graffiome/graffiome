'use strict';
var appStatus = 'Off';

//Firebase.enableLogging(true);
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  var currentTab = CryptoJS.SHA1(tabs[0].url);
  var f = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/' + currentTab);

  f.transaction(function(curr) {
    if (isNaN(parseFloat(curr))) {
      return 1; // initialize to 1.
    }
    else {
      return curr + 1; // increment.
    }
  }, function() {
      // Once the transaction has completed, update the UI (and watch for updates).
      f.on('value', function(s) {
        document.getElementById('contents').innerHTML = s.val();
      });
    });
});


var turnOn = function () {
  chrome.extension.sendMessage({action: "On"}, function (response) {
    console.log(response.status);
  });
};

var turnOff = function () {
  chrome.extension.sendMessage({action: "On"}, function (response) {
    console.log(response.status);
  });
};

var toggleAppStatus = function() {
  if (appStatus === 'On') {
    appStatus = 'Off';
    document.querySelector('button.on-off')[0].innerHTML = 'Turn Graffiome On';
    turnOff();
  } else {
    appStatus = 'On';
    document.querySelector('button.on-off')[0].innerHTML = 'Turn Graffiome Off';
    turnOn();
  }
};
