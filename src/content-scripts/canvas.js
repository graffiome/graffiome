'use strict';

var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;

var lineColor = 'black',
    lineWidth = 2;

var toggle = 'off';
var accessToken;
var authData;


var tabUrl = CryptoJS.SHA1(document.URL);
var ref = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/sites/' + tabUrl);
var userId;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('message:', request, ' from sender: ', sender);
    if (request.toggle === 'off') {
        toggleCanvasOff();
        appendPublicCanvas();
        toggle = 'off';
        appendPublicCanvas();
        sendResponse({confirm:'canvas turned off'});
    } else if (request.toggle === 'on') {
        toggleCanvasOn();
        toggle = 'on';
        getFirebaseAuthData();
        sendResponse({confirm:'canvas turned on'});
    } else if (request.getStatus === true) {
      sendResponse({status:toggle});
    }
  }
);

ref.on("value", function(snapshot) {
  allCanvases = snapshot.val();
  console.log(allCanvases);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function getFirebaseAuthData(){
  chrome.runtime.sendMessage({action: 'getToken'}, function(response) {
    if (response.token) {
      ref.authWithCustomToken(response.token, function(error, result) {
        if (error) {console.log("Login Failed!", error);} 
        else {userId=result.uid;}
      });
    } else {
      console.log('no token found');
    }
  });
};


function toggleUserCanvasOn(){
  if (toggle === 'off') {
    $('<canvas id="graffio-canvas"></canvas>')
      .css({zIndex: 100, position: 'absolute', top: 0,left: 0})
      .attr('width', document.body.scrollWidth)
      .attr('height', document.body.scrollHeight)
      .on('mousemove', function(e){findxy('move', e)})
      .on('mousedown', function(e){findxy('down', e);})
      .on('mouseup', function(e){
        console.log('up')
        findxy('up', e); 
        saveUserCanvas();
      })
      .on('mouseout', function(e){ findxy('out', e)})
      .appendTo('body');

    canvas = document.getElementById('graffio-canvas');
    ctx = canvas.getContext("2d");
    console.log('user canvas injected!');
  }
};

function toggleUserCanvasOff(){
  $('canvas#graffio-canvas').remove();
  console.log('user canvas removed!');
};

function saveUserCanvas(){
  console.log('saving user canvas')
  var data = canvas.toDataURL();
  ref.child(userId).set(data)
};

function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX+pageXOffset, prevY+pageYOffset);
  ctx.lineTo(currX+pageXOffset, currY+pageYOffset);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.closePath();
};

function findxy(res, e) { 
  if (res == 'down') {
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
  if (res == 'up' || res == 'out') {
    flag = false;
  }
  if (res == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      draw();
    }
  }
};
