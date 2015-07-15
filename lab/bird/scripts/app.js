module('app', [
  'lib',
  'bird'
], function(
  lib,
  bird
){
  console.log('app');

  return {
    init: function(){
      lib.init({
        canvas: document.getElementsByTagName('canvas')[0],
        shaderPaths: [
          '/shaders/color.vs',
          '/shaders/color.fs'
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
        position: [-1.5, 0.0, -7.0]
      };

      triangle.item = lib.createItem(triangle);

      bird(triangle);
    }
  };
});


