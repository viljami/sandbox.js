module('bird', [
  'lib',
  'splitTriangle'
], function(
  lib,
  splitTriangle
){
  var FLAP_UNIT = Math.PI / 300;
  var PI02 = Math.PI / 2;
  var PI12 = Math.PI + PI02;
  var PI2 = Math.PI * 2;

  var angleInc = function(a, inc){
    a += inc;
    if (a < PI02 && a > PI12) a += inc * 2;
    return a < PI2 ? a : 0;
  };

  function Bird (){
    this.flappingSpeed = FLAP_UNIT;

    this.init = function(triangle){
      this.original = triangle;
      this.shape = splitTriangle(triangle);
      this.shape.item = lib.createItem(this.shape);

      var ii = this.shape.splitIndexes;
      var zIndex = 2;
      // 2 triangles * 3 vertices * 3 points = 18
      var rot = function(n){ return n < 0 ? 2 : n > 2 ? 0 : n; };

      this.z1 = 0 + rot(ii[0] - 1) * 3 + zIndex;
      this.z2 = 9 + rot(ii[1] + 1) * 3 + zIndex;

      this.wingsAngle = 0;
    };

    this.update = function(){
      var vertices = this.shape.vertices;
      var flap = Math.sin(this.wingsAngle);
      vertices[this.z1] -= flap;
      vertices[this.z2] -= flap;

      this.wingsAngle = angleInc(this.wingsAngle, this.flappingSpeed);
      flap = Math.sin(this.wingsAngle);

      vertices[this.z1] += flap;
      vertices[this.z2] += flap;

      lib.removeItem(this.shape.item);
      this.shape.item = lib.createItem(this.shape);
    };
  }

  return function(triangle){
    lib.removeItem(triangle.item);
    triangle.item = undefined;

    var bird = new Bird();
    bird.init(triangle);
    return bird;
  };
});
