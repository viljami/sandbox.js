  (function(){
    var lib = (function(){
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var buffers = [];
    var shaderTypes;

    var getShader = function (gl, id) {
      var shaderEl = document.getElementById(id);
      var shaderString = "";
      var k = shaderEl.firstChild;

      while (k) {
        if (k.nodeType == 3) shaderString += k.textContent;
        k = k.nextSibling;
      }

      var shader = gl.createShader(shaderTypes[shaderEl.type]);
      gl.shaderSource(shader, shaderString);
      gl.compileShader(shader);

      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      console.error(gl.getShaderInfoLog(shader));
    }
    var initShaders = function(gl){
      var fragmentShader = getShader(gl, 'shader-fs');
      var vertexShader = getShader(gl, 'shader-vs');

      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (! gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert('Could not initialise shaders');
      }

      gl.useProgram(shaderProgram);
      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
      gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

      shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
      shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
      return shaderProgram;
    }

    function setMatrixUniforms(gl, shaderProgram) {
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function drawScene(gl, shaderProgram) {
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
      mat4.identity(mvMatrix);

      buffers.forEach(function(buffer){
        mat4.translate(mvMatrix, buffer.m_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrixUniforms(gl, shaderProgram);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.numItems);
      });
    }

    return {
      init: function(canvas) {
        gl = canvas.getContext('webgl');
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        shaderTypes = {
          'x-shader/x-fragment': gl.FRAGMENT_SHADER,
          'x-shader/x-vertex': gl.VERTEX_SHADER
        };

        var shaderProgram = initShaders(gl);

        function draw (){
          requestAnimationFrame(draw);
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.enable(gl.DEPTH_TEST);
          drawScene(gl, shaderProgram);

        }
        setTimeout(draw, 100);
      },

      createBuffer: function(vertices, position){
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = vertices.length / 3;
        buffer.m_position = position;
        buffers.push(buffer);
        return buffer;
      }
    };
  })();

  lib.init(document.getElementById('lesson01-canvas'));
  var triangleVertices = new Float32Array([
       0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
  ]);
  var squareVertices = new Float32Array([
       1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
       1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
  ]);

  triangleVertexPositionBuffer = lib.createBuffer(triangleVertices, [-1.5, 0.0, -7.0]);
  squareVertexPositionBuffer = lib.createBuffer(squareVertices, [3.0, 0.0, 0.0]);


  function loop(){
    setTimeout(loop, 1000);
    for (var i = 0; i < triangleVertices.length; i++) triangleVertices[i] *= -1;
    lib.createBuffer(triangleVertices, [-1.5, 0.0, -7.0])
  }
  loop();
})();
