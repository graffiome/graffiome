'use strict';

var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;

var lineColor = 'red',
    lineWidth = 2;

var toggle = 'off';

var tabUrl = CryptoJS.SHA1(document.URL),
ref = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/sites/' + tabUrl);

var getCurrentUser = function(){
  return 'simplelogin:6'
};

var saveUserCanvas = function(){
  var data = canvas.toDataURL();
  if (getCurrentUser()){
    ref.child(getCurrentUser()).set(data);
    console.log('saving user canvas');
  } else {
    console.log('failed to save canvas');
  }
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

var turnEditOn = function($canvas){
  console.log($canvas);
  $canvas.css({zIndex: 100, position: 'absolute', top: 0,left: 0,'pointer-events': ''})
    .on('mousemove', function(e){findxy('move', e);})
    .on('mousedown', function(e){findxy('down', e);})
    .on('mouseup', function(e){
      findxy('up', e); 
      saveUserCanvas();
    })
    .on('mouseout', function(e){ findxy('out', e);})
    .on('click')

  canvas = document.getElementsByClassName(getCurrentUser())[0];
  ctx = canvas.getContext("2d");
};

var turnEditOff = function($canvas){
  $canvas.css({position: 'absolute', top: 0,left: 0, 'pointer-events': 'none'})
    .off();
};

var appendCanvasElement = function(name){
  $('<canvas id="graffeo-canvas"></canvas>')
    .css({position: 'absolute', top: 0, left: 0, 'pointer-events': 'none'})
    .attr('width', document.body.scrollWidth)
    .attr('height', document.body.scrollHeight)
    .attr('class', name.replace(':',''))
    .appendTo('body');
};

var drawCanvasElement = function(context, data){
  var imageObj = new Image();
  imageObj.src = data;
  imageObj.onload = function(){
    context.drawImage(this, 0, 0);
  };
};

var appendCanvasAll = function(){
  ref.once('value', function(snapshot){
    var allCanvases = snapshot.val();
    if ( allCanvases !== null ){
      for (var user in allCanvases){
        var data = allCanvases[user];
        var context;
        appendCanvasElement(user);
        context = document.getElementsByClassName(user)[0].getContext('2d');
        drawCanvasElement(context, data);
      }
    }
  });
};

var toggleUserCanvasOn = function(){
  if ( toggle === 'off' ) {
    var userCanvas = $('.'+getCurrentUser().replace(':',''));
    console.log(userCanvas)
    if (userCanvas.length === 0){
      appendCanvasElement(getCurrentUser());
      userCanvas = $('.'+getCurrentUser().replace(':',''));
      turnEditOn(userCanvas);
    } else {
      turnEditOn(userCanvas);
    }  
    toggle = 'on';
  }
};

var toggleUserCanvasOff = function(){
  var userCanvas = $('.'+getCurrentUser().replace(':',''));
  turnEditOff(userCanvas);
  toggle = 'off';
};

var removeGraffeoCanvasAll = function(){
 $('canvas#graffeo-canvas').remove();
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
        toggleUserCanvasOn(); 
        sendResponse({confirm:'canvas turned on'});
        
    // Initialize toggle status for popup button
    } else if ( request.getStatus === true ){
      console.log('status');
      sendResponse({status:toggle});

    // Logout Messages
    } else if (request.logout){
      console.log('logging out')
      removeGraffeoCanvasAll();

    // Clear User Canvas Messages
    } else if (request.clearCanvas){
      clearUserCanvas();
    }
  }
);

// Firebase Event Listener 
ref.on('value', function(snapshot){
  var allCanvases = snapshot.val();
  if (ref.getAuth() && allCanvases !== null ) {
    for (var user in allCanvases){
      var data = allCanvases[user];
      var context = document.getElementsByClassName(user)[0].getContext('2d');
      console.log(document.getElementsByClassName(user));
      drawCanvasElement(context, data);
    }
  } 
});

appendCanvasAll();

