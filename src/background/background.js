'use strict';
var appState = 'off';

chrome.extension.onMessage.addListener(function(request,sender,sendResponse) {
  if(request.action === 'Get App State') {
    sendResponse({state: appState});        
  } else if (request.action === 'Set App State') {
    appState = request.appState;       
  }
});
