module('splitTriangle', function(){
  var splitingIndexes = [[1, 0], [2, 0], [2, 1]];

  var flatten = function(a){
    return a.reduce(function(b, c){
      return b.concat(Array.isArray(c) ? flatten(c) : c);
    }, []);
  };

  var split = function(a, b){
    return vec3.sub([], a, vec3.scale([], vec3.sub([], a, b), 0.5));
  };

  var getSplittingSide = function(vs){
    return Array.apply(null, vs)
    .sort()
    .reduce(function(a, b){
      if (a.some(function(c){ return c === b; })) return a;
      a.push(b);
      return a;
    }, [])
    .pop();
  };

  return function splitTriangleInTwo (triangle){
    var vertices = triangle.vertices;
    var colors = triangle.colors;

    var points = [
      vertices.slice(0, 3),
      vertices.slice(3, 6),
      vertices.slice(6, 9)
    ];

    var colors = [
      colors.slice(0, 4),
      colors.slice(4, 8),
      colors.slice(8, 12)
    ];

    var vs = splitingIndexes.map(function(a){
      return vec3.distance(points[a[0]], points[a[1]]);
    });

    var splitting = vs.indexOf(getSplittingSide(vs));
    var ii = splitingIndexes[splitting];
    var splitPoint = split(points[ii[0]], points[ii[1]]);

    var selectiveGet = function(n, value){
      return function(p, i){ return ii[n] === i ? value : p; };
    };

    var newVertices = [
      points.map(selectiveGet(0, splitPoint)),
      points.map(selectiveGet(1, splitPoint))
    ];

    var splitColor = [];
    vec4.scale(splitColor, vec4.add([], colors[ii[0]], colors[ii[1]]), 0.5);
    var newColors = [
      colors.map(selectiveGet(0, splitColor)),
      colors.map(selectiveGet(1, splitColor))
    ];

    return {
      vertices: flatten(newVertices),
      colors: flatten(newColors),
      position: triangle.position,
      splitPoint: splitPoint,
      splitIndexes: ii
    };
  };
});
