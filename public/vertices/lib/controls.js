var controls = (function(){
  var keys = [];
  var mouse = {
    x: 0,
    y: 0,
    nx: 0, // 0 - 1
    ny: 0 // 0 - 1
  };

  function updateMouse (x, y){
    mouse.x = x;
    mouse.y = y;
    mouse.nx = x / window.innerWidth;
    mouse.ny = y / window.innerHeight;
  }

  function keydown (e){ keys[e.keyCode] = true; }

  function keyup (e){ keys[e.keyCode] = false; }

  function mousemove(e){
    updateMouse(e.clientX, e.clientY);
  }

  function touch(e){
    var x = 0,
      y = 0;

    for (var i = 0; i < e.changedTouches.length; i++){
      x += e.changedTouches[i].clientX;
      y += e.changedTouches[i].clientY;
    }

    updateMouse(x / e.changedTouches.length, y / e.changedTouches.length);
  }


  return {
    enable: function(){
      document.body.addEventListener('keydown', keydown);
      document.body.addEventListener('keyup', keyup);
      document.body.addEventListener('mousemove', mousemove);

      document.body.addEventListener('touchstart', touch);
      document.body.addEventListener('touchmove', touch);
      document.body.addEventListener('touchend', touch);
    },
    disable: function(){
      document.body.removeEventListener('keydown', keydown);
      document.body.removeEventListener('keyup', keyup);
      document.body.removeEventListener('mousemove', mousemove);

      document.body.removeEventListener('touchstart', touch);
      document.body.removeEventListener('touchmove', touch);
      document.body.removeEventListener('touchend', touch);
    },
    keys: keys,
    mouse: mouse
  };
})();
