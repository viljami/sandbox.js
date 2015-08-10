module('loadShaders', [
  'loadFiles'
], function(
  loadFiles
){
  var getShader = function (gl, type, shaderString) {
    var shaderTypes = {
      'x-shader/x-fragment': gl.FRAGMENT_SHADER,
      'x-shader/x-vertex': gl.VERTEX_SHADER,
      'fs': gl.FRAGMENT_SHADER,
      'vs': gl.VERTEX_SHADER
    };
    var shader = gl.createShader(shaderTypes[type]);
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.error(gl.getShaderInfoLog(shader));
  };

  return function(gl, array){
    return loadFiles(array)
    .then(function(results){
      return results.map(function(shaderString, index){
        var filePath = array[index].split('.');
        var type = filePath[filePath.length - 1];
        return getShader(gl, type, shaderString);
      });
    });
  };
});
