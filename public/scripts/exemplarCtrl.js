app.controller('exemplarCtrl', function($scope,$http, $routeParams) {
    console.log('exemplar under control..');
    $scope.projectId = $routeParams.projectId;
    $scope.fileId = $routeParams.fileId;
    $scope.file = {};
    $scope.project = {};




    // Exemplar Logic
    var canvas = document.getElementById('demo'),
        ctx = canvas.getContext('2d'),
        line = new Line(ctx),
        img = new Image;

    ctx.strokeStyle = '#111';
    img.onload = start;

    var isDrawing = false,
    		startX = 0,
        startY = 0,
        savedRectangles = [];

    function Line(ctx) {
      var me = this;

      this.x1 = 0;
      this.x2 = 0;
      this.y1 = 0;
      this.y2 = 0;

      this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(me.x1, me.y1);
        ctx.lineTo(me.x2, me.y2);
        ctx.stroke();
      }
    }

    /* Graph Helper functions */
    function drawLine(x1, y1, x2, y2) {
    	line.x1 = x1;
      line.y1 = y1;
      line.x2 = x2;
      line.y2 = y2;
      line.draw();
    }

    function rect(x, y, w, h) {
    	drawLine(x,y,x+w,y);
      drawLine(x,y,x,y+h);
     	drawLine(x,y+h,x+w,y+h);
     	drawLine(x+w,y,x+w,y+h);
    }

    function rectXY(x1, y1, x2, y2) {
    	var w = x2 - x1,
      		h = y2 - y1;
    	rect(x1,y1, w, h);
    }

    /* Canvas mouse interaction functions */
    function start() {
      ctx.canvas.width  = document.getElementById('canvasHolder').clientWidth;
      ctx.canvas.height = img.height * document.getElementById('canvasHolder').clientWidth / img.width;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, demo.width, demo.height);
      canvas.onmousemove = updateLine;
      canvas.onmousedown = startSelection;
      canvas.onmouseup = endSelection;
    }

    function startSelection(e) {
      isDrawing = true;
      var r = canvas.getBoundingClientRect();
    	startX = e.clientX - r.left;
      startY = e.clientY - r.top;
    }

    function endSelection(e) {
      isDrawing = false;
      var r = canvas.getBoundingClientRect();
    	savedRectangles.push([startX, startY, e.clientX - r.left, e.clientY - r.top]);
    }

    function changeSelection(e) {
      isDrawing = false;
    }

    function drawSavedRects() {
    	for(var i in savedRectangles) {
      	var r = savedRectangles[i];
        console.log(r);
        rectXY(r[0], r[1], r[2], r[3]);
      }
    }

    function updateLine(e) {
      if (isDrawing) {
        // If drawing change the selection
        var r = canvas.getBoundingClientRect(),
          x = e.clientX - r.left,
          y = e.clientY - r.top;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      	drawSavedRects();
        rectXY(startX, startY, x, y);
      }
    }
    $http.get('/api/files/' + $scope.projectId + '/file/' + $scope.fileId)
    .success(function(data) {
        $scope.file = data;
        img.src = '/api/download/'+ $scope.file.identifier;
    })
    .error(function(err) {
        console.log(err);
    });
});