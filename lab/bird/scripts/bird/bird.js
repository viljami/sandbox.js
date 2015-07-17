module('bird', [
  'gllib',
  'splitTriangle'
], function(
  gllib,
  splitTriangle
){
  var FLAP_UNIT = Math.PI / 300;
  var PI02 = Math.PI / 2;
  var PI12 = Math.PI + PI02;
  var PI2 = Math.PI * 2;
  var Z_INDEX = 2;
  var FULL_FLAP = PI2;

  var angleInc = function(a, inc){
    a += inc;
    if (a < PI02 && a > PI12) a += inc * 2;
    return a < PI2 ? a : 0;
  };
  var rot = function(min, max, n){ return n < min ? max : n > max ? min : n; };
  var rot02 = rot.bind(null, 0, 2);

  var flap = function(vertices, z1, z2, duration){
    var flapStep = FULL_FLAP / duration;
    var angle = 0;
    var time = 0;
    var originalZ1 = vertices[z1];
    var originalZ2 = vertices[z2];

    return function step (dt){
      time += dt;
      if (time > duration){
        vertices[z1] = originalZ1;
        vertices[z2] = originalZ2;
        return true;
      }

      vertices[z1] -= angle;
      vertices[z2] -= angle;
      angle = Math.sin(flapStep * time);
      vertices[z1] += angle;
      vertices[z2] += angle;
    };
  };

  var bringToLife = function(){

  };

  var accelerate = function(){

  };

  var slide = function(){

  };

  function Bird (){
    this.flappingSpeed = FLAP_UNIT;

    this.init = function(triangle){
      this.original = triangle;
      this.shape = splitTriangle(triangle);
      this.shape.item = gllib.createItem(this.shape);

      var ii = this.shape.splitIndexes;
      // 2 triangles * 3 vertices * 3 points = 18
      this.z1 = 0 + rot02(ii[0] - 1) * 3 + Z_INDEX;
      this.z2 = 9 + rot02(ii[1] + 1) * 3 + Z_INDEX;

      this.flapDuration = 0;
      this.keepFlapping = true;

      this.flap = function(duration){
        this.currentFlap = flap(this.shape.vertices, this.z1, this.z2, duration);
      };

      this.r = 2;
      this.angle = 0;
    };

    this.update = function(dt){
      if (this.currentFlap && this.currentFlap(dt)){
        this.currentFlap = undefined;
        if (this.keepFlapping){
          this.flap(this.flapDuration);
          this.currentFlap(dt);
        }
      }

      if (! this.holdStill){
        this.shape.position[0] -= Math.cos(this.angle) * this.r;
        this.shape.position[1] -= Math.sin(this.angle) * this.r;

        this.angle += Math.PI / 1000;
        if (this.angle >= Math.PI * 2) this.angle = 0;

        this.shape.position[0] += Math.cos(this.angle) * this.r;
        this.shape.position[1] += Math.sin(this.angle) * this.r;

        this.shape.rotation = this.angle;
      }

      gllib.removeItem(this.shape.item);
      this.shape.item = gllib.createItem(this.shape);
    };

    this.moveTo = function(point){

    };
  }

  return function(triangle){
    gllib.removeItem(triangle.item);
    triangle.item = undefined;

    var bird = new Bird();
    bird.init(triangle);
    return bird;
  };
});
