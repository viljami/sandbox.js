  (function(){
    var lib = (function(){
      var mvMatrix = mat4.create();
      var pMatrix = mat4.create();
      var items = [];
      var shaderTypes;
      var gl;

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

      function degToRad(degrees) {
          return degrees * Math.PI / 180;
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
          mat4.translate(mvMatrix, mvMatrix, item.position);

          mvPushMatrix();

          mat4.rotate(mvMatrix, mvMatrix, degToRad(item.rotation), item.rotationAxis);
          gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexPositionBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, item.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ARRAY_BUFFER, item.vertexColorBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, item.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

          setMatrixUniforms(gl, shaderProgram);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, item.vertexPositionBuffer.numItems);

          mvPopMatrix();
        });
      }

      var api = {
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

        createBuffer: function(vertices, n){
          var buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
          buffer.itemSize = n;
          buffer.numItems = vertices.length / n;
          return buffer;
        },

        createItem: function(options){
          var vertices = options.vertices;
          var colors = options.colors;
          var item = {
            vertexPositionBuffer: api.createBuffer(vertices, 3),
            vertexColorBuffer: api.createBuffer(colors, 4),
            position: options.position,
            rotation: options.rotation || 0,
            rotationAxis: options.rotationAxis || [0, 1, 0]
          };

          items.push(item);
          return item;
        }
      };
      return api;
  })();

  lib.init({
    canvas: document.getElementById('lesson-canvas'),
    shaderPaths: [
      '/shaders/color.vs',
      '/shaders/color.fs'
    ]
  }).then(function(){
    tick();
  });

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

  var triangle = lib.createItem({
    vertices: triangleVertices,
    colors: triangleColors,
    position: [-1.5, 0.0, -7.0],
    rotationAxis: [1, 0, 0]
  });
  var square = lib.createItem({
    vertices: squareVertices,
    colors: squareColors,
    position: [3.0, 0.0, 0.0],
    rotationAxis: [0, 0, 1]
  });

  document.addEventListener(window.visibilityChange, function(){
    if (! document[window.visibilityHidden]) {
      tick();
    }
  });

  var counter = 0.0;
  var lastTime = 0;
  function tick(){
    if (! document[window.visibilityHidden]) setTimeout(tick, 1000 / 60);

    var timeNow = new Date().getTime();
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;

      triangle.rotation += (90 * elapsed) / 1000.0;
      square.rotation += (75 * elapsed) / 1000.0;
    }

    lastTime = timeNow;
  };
})();
