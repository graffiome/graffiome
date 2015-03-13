var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;

var x = "black",
    y = 2;

var overlayPage = {
  zIndex: 100,
  position: 'absolute',
  top: 0,
  left: 0
};

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
   if (request.toggle === 'off') {
      toggleCanvasOff();
   }
   if (request.toggle === 'on') {
      toggleCanvasOn();
   }
  }
);

function toggleCanvasOn(){
  $('<canvas id="graffio-canvas"></canvas>')
    .css(overlayPage)
    .attr('width', document.body.scrollWidth) // sets to max width
    .attr('height', document.body.scrollHeight) // sets to max height
    .on('mousemove', function(e){findxy('move', e)})
    .on('mousedown', function(e){findxy('down', e)})
    .on('mouseup', function(e){findxy('up', e)})
    .on('mouseout', function(e){ findxy('out', e)})
    .appendTo('body')

  canvas = document.getElementById('graffio-canvas');
  ctx = canvas.getContext("2d");
  console.log('canvas injected!')
};

function toggleCanvasOff(){
  $('canvas#graffio-canvas').remove();
  console.log('canvas removed!')
};

function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX+pageXOffset, prevY+pageYOffset);
  ctx.lineTo(currX+pageXOffset, currY+pageYOffset);
  ctx.strokeStyle = x;
  ctx.lineWidth = y;
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
    ctx.fillStyle = x;
    ctx.fillRect(currX, currY, 2, 2);
    ctx.closePath();
  }
  if (res == 'up' || res == "out") {
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
}