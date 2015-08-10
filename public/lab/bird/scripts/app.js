module('app', [
  'gllib',
  'bird'
], function(
  gllib,
  bird
){
  return {
    init: function(){
      gllib.init({
        canvas: document.getElementsByTagName('canvas')[0],
        shaderPaths: [
          '/shaders/light-color.vs',
          '/shaders/light-color.fs'
        ]
      });

      var triangle = {
        vertices: [
           0.0,  1.0,  0.0,
          -1.0, -1.0,  0.0,
           1.0, -1.0,  0.0
        ],
        colors: [
          1.0, 0.0, 0.0, 1.0,
          0.0, 1.0, 0.0, 1.0,
          0.0, 0.0, 1.0, 1.0
        ],
        vertexNormals: [
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0
        ],
        position: [0.0, 0.0, -14.0],
        rotation: 0,
        rotationAxis: [0, 0.5, 1]
      };

      triangle.item = gllib.createItem(triangle);
      var b1 = bird(triangle);
      b1.flap(0);

      setTimeout(function(){ b1.setMode('takeOff'); }, 3000);

      setTimeout(function(){
        var currentTime, prevTime = Date.now();

        setInterval(function(){
          currentTime = Date.now();
          var dt = currentTime - prevTime;

          b1.update(dt);

          prevTime = currentTime;
        }, 30 / 1000);
      }, 1000);
    }
  };
});


