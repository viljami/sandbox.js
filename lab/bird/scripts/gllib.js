module('gllib', [
  'resize'
], function(
  resize
){
  var mvMatrix = mat4.create();
  var pMatrix = mat4.create();
  var items = [];
  var shaderTypes;

  var mvMatrixStack = [];
  function mvPushMatrix() {
    mvMatrixStack.push(mat4.clone(mvMatrix));
  }

  function mvPopMatrix() {
    mvMatrix = mvMatrixStack.pop();
  }

  var initShaders = function(gl, filePaths){
    return loadShaders(gl, filePaths)
    .then(function(shaders){
      shaderProgram = gl.createProgram();

      shaders.forEach(function(shader){
        gl.attachShader(shaderProgram, shader);
      });

      gl.linkProgram(shaderProgram);
      if (! gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Could not initialise shaders');
      }

      gl.useProgram(shaderProgram);
      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
      gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

      shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
      gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

      shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
      shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
      shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, 'uNMatrix');
      shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, 'uAmbientColor');
      shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, 'uLightingDirection');
      shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, 'uDirectionalColor');

      return shaderProgram;
    });
  };

  function setMatrixUniforms(gl, shaderProgram) {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, mvMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
  }

  function drawScene(gl, shaderProgram) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(pMatrix, Math.PI / 4, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);

    items.forEach(function(item){
      mat4.translate(mvMatrix, mvMatrix, item.position);

      mvPushMatrix();

      mat4.rotate(mvMatrix, mvMatrix, item.rotation, item.rotationAxis);

      gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, item.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexColorBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, item.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, item.normalBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, item.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.uniform3f(
        shaderProgram.ambientColorUniform,
        0.5, 0.5, 0.5
      );

      var lightingDirection = [0, 0, -1];
      var adjustedLD = vec3.create();
      vec3.normalize(adjustedLD, lightingDirection);
      vec3.scale(adjustedLD, adjustedLD, -1);
      gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

      gl.uniform3f(
        shaderProgram.directionalColorUniform,
        0.7, 0.7, 0.7
      );

      setMatrixUniforms(gl, shaderProgram);
      gl.drawArrays(gl.TRIANGLES, 0, item.vertexPositionBuffer.numItems);

      mvPopMatrix();
    });
  }

  var api = {
    init: function(options) {
      var canvas = options.canvas;
      gl = canvas.getContext('webgl');
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;

      resize({
        canvas: canvas,
        gl: gl
      });

      return initShaders(gl, options.shaderPaths)
      .then(function(shaderProgram){
        function draw (){
          requestAnimationFrame(draw);
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.enable(gl.DEPTH_TEST);
          drawScene(gl, shaderProgram);
        }
        draw();
      });
    },

    createBuffer: function(array, n, type){
      var ArrayType = Uint16Array;
      if (! type){
        type = gl.ARRAY_BUFFER;
        ArrayType = Float32Array;
      }
      var buffer = gl.createBuffer();
      gl.bindBuffer(type, buffer);
      gl.bufferData(type, new ArrayType(array), gl.STATIC_DRAW);
      buffer.itemSize = n;
      buffer.numItems = array.length / n;
      return buffer;
    },

    createItem: function(options){
      var item = {
        vertexPositionBuffer: api.createBuffer(options.vertices, 3),
        vertexColorBuffer: api.createBuffer(options.colors, 4),
        normalBuffer: api.createBuffer(options.vertexNormals, 3),
        position: options.position,
        rotation: options.rotation,
        rotationAxis: options.rotationAxis
      };

      items.push(item);
      return item;
    },

    removeItem: function(item){
      items.splice(items.indexOf(item), 1);
    }
  };

  return api;
});
