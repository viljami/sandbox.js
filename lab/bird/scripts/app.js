module('app', [
  'lib',
  'bird'
], function(
  lib,
  bird
){
  return {
    init: function(){
      lib.init({
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
             // front face
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0
        ],
        position: [0.0, 0.0, -7.0]
      };

      triangle.item = lib.createItem(triangle);

      var b1 = bird(triangle);

      var r = -1;
      var angle = Math.PI / 2;

      setInterval(function(){
        b1.shape.position[0] -= Math.cos(angle) * r;
        b1.shape.position[1] -= Math.sin(angle) * r;
        angle += Math.PI / 1000;
        if (angle >= Math.PI * 2) angle = 0;
        b1.shape.position[0] += Math.cos(angle) * r;
        b1.shape.position[1] += Math.sin(angle) * r;

        b1.update();
      }, 30 / 1000);
    }
  };
});


