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
             // front face
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

      var times = [
        {stamp: 1000, duration: 1000, holdStill: true},
        {stamp: 2000, duration: 200},
        {stamp: 2500, duration: 300},
        {stamp: 3000, duration: 400},
        {stamp: 4000, duration: 500},
        {stamp: 5600, duration: 600},
        {stamp: 7000, duration: 700},
        {stamp: 8500, duration: 900},
        {stamp: 10000, duration: 1000},
        {stamp: 12000, duration: 1300},
        {stamp: 14000, duration: 1500},
        {stamp: 0, duration: 900}
      ];

      setTimeout(function(){
        var currentTime, prevTime = Date.now();
        var timeLapse = 0;

        setInterval(function(){
          currentTime = Date.now();

          var dt = currentTime - prevTime;
          timeLapse += dt;

          var mode = times.filter(function(t){ return t.stamp > timeLapse; })[0];
          if (! mode) mode = times[times.length - 1];
          b1.flapDuration = mode.duration;
          b1.holdStill = mode.holdStill;
          b1.update(dt);

          prevTime = currentTime;
        }, 30 / 1000);
      }, 1000);
    }
  };
});


