module('bird', [
  'gllib',
  'splitTriangle',
  'bird.takeOff'
], function(
  gllib,
  splitTriangle,
  takeOff
){
  var PI02 = Math.PI / 2;
  var PI12 = Math.PI + PI02;
  var PI2 = Math.PI * 2;
  var Z_INDEX = 2;
  var FULL_FLAP = PI2;

  var modes = {
    takeOff: takeOff,
    still: function(){
      return function(){ return {duration: 2000, holdStill: true}; }
    }
  };

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

  function Bird (){
    this.init = function(triangle){
      this.original = triangle;
      this.shape = splitTriangle(triangle);
      this.shape.item = gllib.createItem(this.shape);
      this.flapDuration = 0;
      this.keepFlapping = true;
      // 2 triangles * 3 vertices * 3 points = 18
      this.z1 = 0 + rot02(this.shape.splitIndexes[0] - 1) * 3 + Z_INDEX;
      this.z2 = 9 + rot02(this.shape.splitIndexes[1] + 1) * 3 + Z_INDEX;

      this.flap = function(duration){
        this.currentFlap = flap(this.shape.vertices, this.z1, this.z2, duration);
      };

      this.r = 2;
      this.angle = 0;
      this.setMode('still');

      return this;
    };

    this.setMode = function(name){
      this.mode = modes[name]();
      this.updateMode(0);
      this.currentFlap = undefined;
    };

    this.updateMode = function (dt){
      this.flapDuration = this.mode(dt).duration;
      this.holdStill = this.mode(dt).holdStill;
    };

    this.update = function(dt){
      this.updateMode(dt);
      if (this.currentFlap && this.currentFlap(dt)) this.currentFlap = undefined;
      if (! this.currentFlap && this.keepFlapping){
        this.flap(this.flapDuration);
        this.currentFlap(dt);
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
  }

  return function(triangle){
    gllib.removeItem(triangle.item);
    triangle.item = undefined;
    return (new Bird()).init(triangle);
  };
});
