'use strict';

var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;

var lineColor = 'black',
    lineWidth = 2;

var toggle = 'off',
    showCanvasAll = true,
    currentUser;

var tabUrl = CryptoJS.SHA1(document.URL),
    ref = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/sites/' + tabUrl),

var getFirebaseAuthData = function(callback){
  chrome.runtime.sendMessage({action: 'getToken'}, function(response) {
    if (response.token) {
      ref.authWithCustomToken(response.token, function(error, result) {
        if (error) { console.log('Login Failed!', error); } 
        else { 
          currentUser = result.uid
          callback();
        }
      });
    } else {
      console.log('no token found');
    }
  });
};

var drawCanvasElement = function(canvasElement, data){
  var context = canvasElement.getContext('2d');
  var imageObj = new Image();
  imageObj.src = data;
  imageObj.onload = function(){
    context.drawImage(this, 0, 0);
  };
};

var saveUserCanvas = function(){
  var data = canvas.toDataURL();
  ref.child(currentUser).set(data);
  console.log('saving user canvas');
};

var drawLine = function(){
  ctx.beginPath();
  ctx.moveTo(prevX + pageXOffset, prevY + pageYOffset);
  ctx.lineTo(currX + pageXOffset, currY + pageYOffset);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.closePath();
};

var findxy = function(res, e){ 
  if (res === 'down') {
    flag = true;
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
    ctx.beginPath();
    ctx.fillStyle = lineColor;
    ctx.fillRect(currX, currY, 2, 2);
    ctx.closePath();
  }
  if (res === 'up' || res === 'out') {
    flag = false;
  }
  if (res === 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      drawLine();
    }
  }
};

var appendCanvasElement = function(user){
  // Append User Canvas
  if( user === currentUser ){
    $('<canvas id="graffio-canvas"></canvas>')
      .css({zIndex: 100, position: 'absolute', top: 0,left: 0})
      .attr('width', document.body.scrollWidth)
      .attr('height', document.body.scrollHeight)
      .on('mousemove', function(e){findxy('move', e);})
      .on('mousedown', function(e){findxy('down', e);})
      .on('mouseup', function(e){
        findxy('up', e); 
        saveUserCanvas();
      })
      .on('mouseout', function(e){ findxy('out', e);})
      .appendTo('body');

    canvas = document.getElementById('graffio-canvas');
    ctx = canvas.getContext("2d");

    console.log('user canvas injected!');

  // Append Public Canvas
  } else {
    $('<canvas id="public"></canvas>')
      .css({position: 'absolute', top: 0, left: 0, 'pointer-events': 'none'})
      .attr('width', document.body.scrollWidth)
      .attr('height', document.body.scrollHeight)
      .attr('class', user)
      .appendTo('body');

    console.log('public canvas injected!');
  }
};

var updateCanvasElements = function(snapshot){
  var allCanvases = snapshot.val();
  var data, publicCanvas;

  for (var user in allCanvases){
    console.log(currentUser);
    if ( user !== currentUser ){
      data = allCanvases[user];

      // If user's public canvas element already exists, then update
      if ( document.getElementsByClassName(user).length >=1 ) {
        publicCanvas = document.getElementsByClassName(user)[0];
        drawCanvasElement(publicCanvas, data);

      // Else, doesn't exist already, then append and reconstruct it
      } else {
        appendCanvasElement(user);
        publicCanvas = document.getElementsByClassName(user)[0];
        drawCanvasElement(publicCanvas, data);
      }
    }
  }
};

var toggleUserCanvasOn = function(){
  if ( toggle === 'off' ) {
    ref.once('value', function(snapshot){
      if ( snapshot.val() !== null && snapshot.val().hasOwnProperty(currentUser) ){
        console.log('already exist user data');
        var data = snapshot.val()[currentUser]
        appendCanvasElement(currentUser);
        drawCanvasElement(canvas, data);
      } else {
        console.log('no existing data');
        appendCanvasElement(currentUser);
      }
      toggle = 'on';
    }); 
  }
};

var toggleUserCanvasOff = function(){
  $('canvas#graffio-canvas').remove();
  toggle = 'off';
  console.log('user canvas removed!');
};

var removePublicCanvasAll = function(){
 $('canvas#public').remove();
};

var removeCanvasAll = function(){
  toggleUserCanvasOff();
  removePublicCanvasAll();
};

var clearUserCanvas = function(){
  ctx.clearRectangle(0, 0, canvas.width, canvas.height);
}

// Message Handler
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse){
    console.log('message:', request, ' from sender: ', sender);

    // Toggle User Canvas Messages
    if ( request.toggle === 'off' ){
        toggleUserCanvasOff();
        sendResponse({confirm:'canvas turned off'});
    } else if ( request.toggle === 'on' ){
        getFirebaseAuthData(function(){
          toggleUserCanvasOn();  
          sendResponse({confirm:'canvas turned on'});
        });
        
    // Initialize toggle status for popup button
    } else if ( request.getStatus === true ){
      console.log('status');
      sendResponse({status:toggle});

    // Logout Messages
    } else if (request.logout){
      console.log('logging out')
      removeCanvasAll();

    // Show Public Canvases Messages
    } else if ( request.show === 'all' ){
      showCanvasAll = true;
    } else if ( request.show === 'none' ){
       showCanvasAll = false;
       removePublicCanvasAll();
    }
  }
);

// Firebase Event Listener 
ref.on('value', function(snapshot){
  console.log(currentUser);
  if (showCanvasAll && currentUser !== undefined) {
    updateCanvasElements(snapshot);
  } 
});
