  (function(){
    var lib = (function(){
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var items = [];
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

      items.forEach(function(item){
        mat4.translate(mvMatrix, item.position);
        gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, item.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, item.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms(gl, shaderProgram);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, item.vertexPositionBuffer.numItems);
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

      createItem: function(vertices, colors, position){
        var item = {
          vertexPositionBuffer: gl.createBuffer(),
          vertexColorBuffer: gl.createBuffer(),
          position: position
        };

        var buffer = item.vertexPositionBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = vertices.length / 3;

        var colorBuffer = item.vertexColorBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = colors.length / 4;

        items.push(item);
        return item;
      }
    };
  })();

  lib.init(document.getElementById('lesson01-canvas'));
  var triangleVertices = [
       0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
  ];
  var triangleColors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];
  var squareVertices = [
       1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
       1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
  ];
  var squareColors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0
  ];
  triangleVertexPositionBuffer = lib.createItem(triangleVertices, triangleColors, [-1.5, 0.0, -7.0]);
  squareVertexPositionBuffer = lib.createItem(squareVertices, squareColors, [3.0, 0.0, 0.0]);
})();
