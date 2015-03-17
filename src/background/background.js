'use strict';
var userToken;

// Listener for messages coming to the background script
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
  // if it's setting the token, change that variable
  if (request.action === 'setToken') {
    console.log('received message with token: ', request.auth);
    userToken = request.auth.token;
  }

  // if it's requesting the token, return it
  if (request.action === 'getToken') {
    if (userToken) {
      console.log('responding with userToken');
      sendResponse({token: userToken});  
    } else {
      console.log('userToken not yet set');
    }
  }

});
