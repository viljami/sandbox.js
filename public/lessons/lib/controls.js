var controls = (function(){
 var keys = [];
 var mouse = {};
 var keydown = function(e){ keys[e.keyCode] = true; };
 var keyup = function(e){ keys[e.keyCode] = false; };
 var mousedown = function(e){ mouse.isDown = true; };
 var mouseup = function(e){ mouse.isDown = false; };
 var mousemove = function(e){
   mouse.x = e.clientX;
   mouse.y = e.clientY;
   mouse.nx = e.clientX / window.innerWidth;
   mouse.ny = e.clientY / window.innerHeight;
 };

 return {
  keys: keys,
  mouse: mouse,

  enable: function(){
   document.addEventListener('keydown', keydown);
   document.addEventListener('keyup', keyup);
   document.addEventListener('mousedown', mousedown);
   document.addEventListener('mousemove', mousemove);
   document.addEventListener('mouseup', mouseup); 
  }, 

  disable: function(){
   document.removeEventListener('keydown', keydown);
   document.removeEventListener('keyup', keyup);
   document.removeEventListener('mousedown', mousedown);
   document.removeEventListener('mousemove', mousemove);
   document.removeEventListener('mouseup', mouseup); 
  }
 };
})();
