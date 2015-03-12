'use strict';
chrome.extension.onMessage.addListener(function(request,sender,sendResponse) {
    if(request.action === 'On') {
      sendResponse({status:'Now on'});        
    } else if (request.action === 'Off') {
      sendResponse({status:'Now off'});
    }
});
