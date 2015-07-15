module('resize', function(){
  return function(options){
    var canvas = options.canvas;
    var gl = options.gl;

    var resize = function(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    };
    window.addEventListener('resize', resize);
    resize();
  };
});
