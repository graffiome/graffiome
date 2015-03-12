
// On document ready, inject canvas onto page
$(function() {

  $('body').prepend('<canvas id="canvas"></canvas>')

  canvas = document.getElementById('canvas');

  canvas.style.position = 'absolute';
  canvas.style.left="0px";
  canvas.style.top="0px";
  canvas.style.zIndex="100";
  canvas.style.width="100%";
  canvas.style.height="100%";
  canvas.width=document.body.clientWidth;
  canvas.height=document.body.clientHeight;

  context = canvas.getContext("2d");

});