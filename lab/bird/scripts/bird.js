module('bird', ['lib'], function(lib){
  var split = function(a, b){
    return vec3.sub([], a, vec3.scale([], vec3.sub([], a, b), 0.5));
  };

  var getSplittingSide = function(vs){
    var lengths = vs.map(vec3.len);
    var sorted = Array.apply(null, lengths)
    .sort()
    .reduce(function(a, b){
      if (a.some(function(c){ return c === b; })) return a;
      a.push(b);
      return a;
    }, []);

    return vs[lengths.indexOf(sorted.pop())];
  };

  var splitTriangleInTwo = function(triangle){
    var newVertices, newColors;
    var vertices = triangle.vertices;
    var colors = triangle.colors;

    var p1 = vertices.slice(0, 3);
    var p2 = vertices.slice(3, 6);
    var p3 = vertices.slice(6, 9);

    var c1 = colors.slice(0, 4);
    var c2 = colors.slice(4, 8);
    var c3 = colors.slice(8, 12);

    vs = [
      vec3.distance(p1, p2),
      vec3.distance(p1, p3),
      vec3.distance(p2, p3)
    ];

    var splitted = [];
    var splitting = vs.indexOf(getSplittingSide(vs));

    if (splitting === 0){
      var splitted = split(p1, p2);
      newVertices = [
        p1.concat(splitted).concat(p3),
        splitted.concat(p2).concat(p3)
      ];

      var splitColor = vec4.scale([], vec4.add([], c1, c2), 0.5);
      newColors = [
        c1.concat(splitColor).concat(c3),
        splitColor.concat(c2).concat(c3),
      ];
    } else if( splitting === 1){
      var splitted = split(p1, p3);
      newVertices = [
        p1.concat(p2).concat(splitted),
        splitted.concat(p2).concat(p3)
      ];

      var splitColor = vec4.scale([], vec4.add([], c1, c3), 0.5);
      newColors = [
        c1.concat(c2).concat(splitColor),
        splitColor.concat(c2).concat(c3),
      ];
    } else {
      var splitted = split(p2, p3);
      newVertices = [
        p1.concat(p2).concat(splitted),
        p1.concat(splitted).concat(p3)
      ];

      var splitColor = vec4.scale([], vec4.add([], c2, c3), 0.5);
      newColors = [
        c1.concat(c2).concat(splitColor),
        c1.concat(splitColor).concat(c3),
      ];
    }
    newVertices = newVertices[0].concat(newVertices[1]);
    newColors = newColors[0].concat(newColors[1]);

    return {
      vertices: newVertices,
      colors: newColors,
      position: triangle.position
    };
  };

  return function(data){
    var splitted = splitTriangleInTwo(data);
    lib.removeItem(data.item);
    splitted.item = lib.createItem(splitted);
    return splitted;
  };
});
