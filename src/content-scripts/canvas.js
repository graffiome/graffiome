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
var accessToken;
var authData;

var userId;
var tabUrl;

// var testdata;

// var user = "testUser3";
// var url = "testUrl3";
// var ref = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/sites/' + url);

// ref.on("value", function(snapshot) {
//   testdata = snapshot.val()['testUser3'];
//   appendPublicCanvas();
//   console.log(testdata)
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

var ref = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/sites/');

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('message:', request, ' from sender: ', sender);
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

function saveUserCanvas(){
  var data = 'testtest'
  f.child(user).set(data)
};

// TODO: clean up callbacks with promises (assigned: Jonathan)

function getAuthData(){
  console.log('getting authData');

  chrome.runtime.sendMessage({action: 'getToken'}, function(response) {

    if (response.token) {
      accessToken=response.token;
      console.log('We gots the tokens! ', accessToken);

      ref.authWithCustomToken(accessToken, function(error, result) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          authData=result.auth;
          userId=result.uid;
          tabUrl=CryptoJS.SHA1(document.URL);

          var f = new Firebase('https://dazzling-heat-2465.firebaseio.com/web/data/sites/' + tabUrl);
          f.child(userId).set('testtest')

          console.log(tabUrl);

          console.log("Authenticated successfully with payload:", authData);
          console.log("Auth expires at:", new Date(result.expires * 1000));
        }
      });

    } else {
      console.log('no token :(')
    }
  });
};

function toggleCanvasOn(){
  if (toggle === 'off') {
    $('<canvas id="graffio-canvas"></canvas>')
      .css(overlayPage)
      .attr('width', document.body.scrollWidth) // sets to max width
      .attr('height', document.body.scrollHeight) // sets to max height
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
    console.log('canvas injected!');

    getAuthData();
  }
};

function toggleCanvasOff(){
  $('canvas#graffio-canvas').remove();
  console.log('canvas removed!');
};

function saveUserCanvas(){
  var data = canvas.toDataURL();
  console.log(data)
  ref.child(user).set(data)
};

function loadPublicCanvas(){
  return storage.getItem('OurCanvas');
};

function appendPublicCanvas() {
  console.log('append')

  $('<canvas id="public"></canvas>')
    .css({
      position: 'absolute',
      top: 0,
      left: 0
    })
    .attr('width', document.body.scrollWidth) // sets to max width
    .attr('height', document.body.scrollHeight) // sets to max height
    .appendTo('body');

  var publicCanvas = document.getElementById('public')
  var context = publicCanvas.getContext('2d');
  var imageObj = new Image();

  imageObj.src = testdata;
  
  imageObj.onload = function() {
    context.drawImage(this, 0, 0);
  };
};

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
    }
  }
}
