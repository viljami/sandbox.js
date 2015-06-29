  (function(){
    var lib = (function(){
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var items = [];
    var shaderTypes;

    var mvMatrixStack = [];
    function mvPushMatrix() {
        mvMatrixStack.push(mat4.clone(mvMatrix));
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
	    throw 'Invalid popMatrix!';
        }
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

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        return shaderProgram;
      });
    };

    function setMatrixUniforms(gl, shaderProgram) {
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function drawScene(gl, shaderProgram) {
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      mat4.perspective(pMatrix, Math.PI / 4, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
      mat4.identity(mvMatrix);

      items.forEach(function(item){
	      mvPushMatrix();
        mat4.translate(mvMatrix, mvMatrix, item.position);
        gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, item.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, item.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms(gl, shaderProgram);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, item.vertexPositionBuffer.numItems);
	mvPopMatrix();
      });
    }

    return {
      init: function(options) {
        var canvas = options.canvas;
        gl = canvas.getContext('webgl');
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

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

      createItem: function(vertices, colors, position){
        var item = {
          vertexPositionBuffer: gl.createBuffer(),
          vertexColorBuffer: gl.createBuffer(),
          position: position
        };

        var buffer = item.vertexPositionBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = vertices.length / 3;

        var colorBuffer = item.vertexColorBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = colors.length / 4;

        items.push(item);
        return item;
      },

	removeItem: function(item){
	    gl.deleteBuffer(item.vertexPositionBuffer);
	    gl.deleteBuffer(item.vertexColorBuffer);
		items = items.filter(function(i){ return i !== item; });
	}
    };
  })();

  lib.init({
    canvas: document.getElementById('lesson-canvas'),
    shaderPaths: [
      '/shaders/color.vs',
      '/shaders/color.fs'
    ]
  });

  var tri2 = [
       1.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
  ];
  var tri1 = [
       1.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       -1.0, 1.0,  0.0
  ];

  var triColors = [
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
  // triangleVertexPositionBuffer = lib.createItem(tri1, triColors, [-1.5, 0.0, -7.0]);
  // var squareItem = squareVertexPositionBuffer = lib.createItem(squareVertices, squareColors, [3.0, 0.0, 0.0]);

  var squares = [];
  var squareItems = [];
  var createItems = function(){
    for (var i = 0; i <= 6; i+=2){
      for (var j = 0; j <= 6; j+=2){
        squareItems.push(lib.createItem(squareVertices, squareColors, [0.0 + j - 3.0, i - 3.0, -7.0]));
      }
    } 
  };

  var removeItems = function() {
    squareItems.forEach(lib.removeItem);
  };

  var k = 0;
  var sign = function(){ k += 1; return k % 3 ? 1 : -1; }; 
  var angle = 0;
  var inc = Math.PI / 128;
  setInterval(function(){
    angle += inc;
    for (var i = 2; i < squareVertices.length; i += 3){
	squareVertices[i] = Math.sin(angle) * sign();
    }
    removeItems();
    createItems();
    // squareItem = lib.createItem(squareVertices, squareColors, [3.0, 0.0, 0.0]);
  }, 1000 / 60);
})();
