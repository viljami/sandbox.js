var splitPolygon3d = (function(){
  function rotateIndex (i, length){ return i < 0 ? length -1 : i >= length ? 0 : i; }

  function splitTriangle2Triangles (triangleVertices){
    var i, a, b, allVertices = [],
      splitVertices = [],
      newVertices = [];

      var triangles = [
        0, 3, 5,
        1, 4, 3,
        2, 5, 4,
        3, 4, 5
      ];

    for (i = 0; i < 3; i++){
      a = i * 3;
      b = rotateIndex(a + 3, triangleVertices.length);

      splitVertices[a   ] = triangleVertices[a] + (triangleVertices[b] - triangleVertices[a]) * 0.5;
      splitVertices[a + 1] = triangleVertices[a + 1] + (triangleVertices[b + 1] - triangleVertices[a + 1]) * 0.5;
      splitVertices[a + 2] = triangleVertices[a + 2] + (triangleVertices[b + 2] - triangleVertices[a + 2]) * 0.5;
    }

    allVertices = triangleVertices.concat(splitVertices);

    for (i = 0; i < triangles.length / 3; i++){
      a = i * 3;
      b = i * 9;

      newVertices[b    ] = allVertices[triangles[a] * 3];
      newVertices[b + 1] = allVertices[triangles[a] * 3 + 1];
      newVertices[b + 2] = allVertices[triangles[a] * 3 + 2];

      newVertices[b + 3] = allVertices[triangles[a + 1] * 3];
      newVertices[b + 4] = allVertices[triangles[a + 1] * 3 + 1];
      newVertices[b + 5] = allVertices[triangles[a + 1] * 3 + 2];

      newVertices[b + 6] = allVertices[triangles[a + 2] * 3];
      newVertices[b + 7] = allVertices[triangles[a + 2] * 3 + 1];
      newVertices[b + 8] = allVertices[triangles[a + 2] * 3 + 2];
    }

    return newVertices;
  }

  return function splitPolygon (vertices){
    var result = [];
    for(var i = 0; i < vertices.length / 9; i++){
      result = result.concat(splitTriangle2Triangles(vertices.slice(i * 9, i * 9 + 9)));
    }

    return result;
  };
})();
