'use strict';
var userToken = null;

// Listener for messages coming to the background script
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
  if (request.action === 'setToken') { // if it's setting the token, change that variable
    userToken = request.token;
    broadcastToken();
  } else if (request.action === 'clearToken') { // Deauthenticate the user
    userToken = null;
    broadcastToken();
  } else if (request.action === 'getToken') { // if it's requesting the token, return it
    sendResponse({token: userToken});  
  }
});

// inform all tabs that the token as changed
var broadcastToken = function() {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab){
      chrome.tabs.sendMessage(tab.id, {updateToken: true, token: userToken});
    });
  });
};
