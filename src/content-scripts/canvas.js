'use strict';

var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;

var lineColor = 'black',
    lineWidth = 2;

var overlayPage = {
  zIndex: 100,
  position: 'absolute',
  top: 0,
  left: 0
};

var toggle = 'off';

var testdata;

var user = "testUser3";
var url = "testUrl3";
var ref = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/sites/' + url);

ref.on("value", function(snapshot) {
  testdata = snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('message:', request);
    if (request.toggle === 'off') {
        toggleCanvasOff();
        appendPublicCanvas();
        toggle = 'off';
        sendResponse({confirm:'canvas turned off'});
    } else if (request.toggle === 'on') {
        toggleCanvasOn();

        toggle = 'on';
        sendResponse({confirm:'canvas turned on'});
    } else if (request.getStatus === true) {
      sendResponse({status:toggle});
    }
  }
);

function toggleCanvasOn(){
  if (toggle === 'off') {
    $('<canvas id="graffio-canvas"></canvas>')
      .css(overlayPage)
      .attr('width', document.body.scrollWidth) // sets to max width
      .attr('height', document.body.scrollHeight) // sets to max height
      .on('mousemove', function(e){findxy('move', e)})
      .on('mousedown', function(e){findxy('down', e)})
      .on('mouseup', function(e){findxy('up', e)})
      .on('mouseout', function(e){ findxy('out', e)})
      .appendTo('body');

    canvas = document.getElementById('graffio-canvas');
    ctx = canvas.getContext("2d");
    console.log('canvas injected!');
  }
};

function toggleCanvasOff(){
  $('canvas#graffio-canvas').remove();
  console.log('canvas removed!');
};

function saveUserCanvas(){
  var data = canvas.toDataURL();
  ref.child(user).set(data)
};

function loadPublicCanvas(){
  return storage.getItem('OurCanvas');
};

function appendPublicCanvas() {
  var img = new Image();
  img.src = testdata;

  $('<canvas id="graffio-canvas"></canvas>').innerHTML = ''
  var newCanvas = $('<canvas id="graffio-canvas"></canvas>')
      .css(overlayPage)
      .attr('width', document.body.scrollWidth) // sets to max width
      .attr('height', document.body.scrollHeight) // sets to max height
      .appendTo('body');
  var newCtx = newCanvas.getContext('2d');

  img.onload = function () {
    newCtx.drawImage(img,0,0);
  }
}

function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX+pageXOffset, prevY+pageYOffset);
  ctx.lineTo(currX+pageXOffset, currY+pageYOffset);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.closePath();
}

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
      saveUserCanvas()
    }
  }
}
