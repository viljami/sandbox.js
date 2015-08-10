module('splitTriangle', [
  'array.flatten'
], function(
  flatten
){
  var splitingIndexes = [[1, 0], [2, 0], [2, 1]];

  var getMiddlePoint = function(a, b){
    return vec3.sub([], a, vec3.scale([], vec3.sub([], a, b), 0.5));
  };

  var getSplittingSide = function(vs){
    var sorted = Array.apply(null, vs).sort();
    if (sorted[0] === sorted[2]) return sorted[0];
    if (sorted[0] === sorted[1]) return sorted[2];
    if (sorted[1] === sorted[2]) return sorted[0];
    return sorted[2];
  };

  var selectiveGet = function(n, value){
    return function(p, i){ return n === i ? value : p; };
  };

  return function splitTriangle (triangle){
    var vertices = triangle.vertices,
      colors = triangle.colors,
      points = [
      vertices.slice(0, 3),
      vertices.slice(3, 6),
      vertices.slice(6, 9)
    ],
      colors = [
      colors.slice(0, 4),
      colors.slice(4, 8),
      colors.slice(8, 12)
    ],
      vs = splitingIndexes.map(function(a){
      return vec3.distance(points[a[0]], points[a[1]]);
    }),
      splitting = vs.indexOf(getSplittingSide(vs)),
      ii = splitingIndexes[splitting],
      splitPoint = getMiddlePoint(points[ii[0]], points[ii[1]]),
      newVertices = [
        points.map(selectiveGet(ii[0], splitPoint)),
        points.map(selectiveGet(ii[1], splitPoint))
      ],
      splitColor = [];
    vec4.scale(splitColor, vec4.add([], colors[ii[0]], colors[ii[1]]), 0.5);
    var newColors = [
      colors.map(selectiveGet(ii[0], splitColor)),
      colors.map(selectiveGet(ii[1], splitColor))
    ];

    return {
      vertices: flatten(newVertices),
      colors: flatten(newColors),
      position: Array.apply(null, triangle.position),
      vertexNormals: triangle.vertexNormals.concat(triangle.vertexNormals),
      splitPoint: splitPoint,
      splitIndexes: ii,
      rotation: triangle.rotation,
      rotationAxis: triangle.rotationAxis
    };
  };
});
