window.options = {
  text: {
    direction: "right",
    lineDir: "down",
    overwrite: true
  },
  box: {
    enabled: false,
    side: {
      n: ['-'],
      e: ['|'],
      s: ['-'],
      w: ['|']
    },
    corner: {
      ne: ['+'],
      se: ['+'],
      sw: ['+'],
      nw: ['+']
    },
    fill: [' ']
  },
  line: {
    enabled: false,
    vert: ['|'],
    horz: ['-'],
    corner: {
      ne: ['+'],
      se: ['+'],
      sw: ['+'],
      nw: ['+']
    },
    start: {
      n: ['+'],
      s: ['+'],
      e: ['+'],
      w: ['+']
    },
    end: {
      n: ['^'],
      s: ['v'],
      e: ['>'],
      w: ['<']
    }
  },
  free: {
    enabled: false,
    char: "#"
  }
};

window.state = {
  action: "none", // Is mouse being moved with left button down?
  startPoint: {x: 0, y: 0}, // Start of current selection
  endPoint: {x: 0, y: 0} // End of current selection
};

window.selection = false; // Current selection object (if one exists)

window.rootarea = rootAreaInit(54, 31), // Drawing area

$(function() {
  //  For ease of programming, There is only one global object: root
  // root has one method: redraw, which assigns its contents to the DOM
  // None of the methods on root or its children change the object itself.

  redraw(window.rootarea, window.selection); // Write Drawing area object to DOM

  $('#drawing-area').on('click', function(e) {
    e.stopPropagation();
    // When in select mode, remember point clicked and select that point
    var point = getXY(e.pageX, e.pageY, window.rootarea);
    if(window.rootarea.hasPoint(point.x, point.y)) {
      if (window.options.free.enabled) {
        var newArea = areaInit({
          xmin: point.x,
          ymin: point.y,
          xmax: point.x,
          ymax: point.y
        });
        newArea = writeChar(newArea, window.options.free.char, point.x, point.y);
        window.rootarea = addSubArea(window.rootarea, newArea);
      }
      console.log(point);
      window.state.action = "none";
      window.selection = newAreaSelection(window.rootarea, point, point);
      redraw(window.rootarea, window.selection);
    } else {
      // Keep track of bad click events...
      console.log(point);
      console.log([e.pageX, e.pageY])
    }

  });

  $('body').on('click', function(e) {
    window.selection = false;
    window.state.action = "none";
    redraw(window.rootarea, window.selection);
  });

  $('#drawing-area').on('mousemove', function(e) {
    // When in select mode, redraw the selection when the mouse moves
    // (only when left button is held down)
    if (e.buttons === 1) {
      var start = window.state.startPoint;
      var end = window.state.endPoint;
      var point = getXY(e.pageX, e.pageY, window.rootarea);
      var drawingData = false;
      if (window.state.action === "none") {
        // If no current action, decide which action to perform:
        if (window.selection) {
          var pointType = window.selection.getLocationClass(point.x, point.y;
          switch (pointType) {
            case "selected":
              window.state.action = "move";
              window.state.startPoint = point;
              window.state.endPoint = point;
              break;
            case "left-edge":
            case "top-left":
              window.state.startPoint.x = window.selection.xmax;
              window.state.action = "resize";
              window.state.endPoint = point;
              window.state.resizeType = pointType;
              break;
            case "rightEdge":
            case "topRight":


        }
        window.state.action = "resizing";
        window.state.startPoint = point;
        drawingData = newAreaSelection(window.rootarea, point, point);
        window.rootarea = drawingData[0];
        window.selection = drawingData[1];
      }
      if (point != window.state.endPoint) {
        window.rootarea = clearEmptySelections(window.rootarea);
        root.selection = drawSelection(root.startPoint, point);
            break;
          case 'box':
          case 'line':
          case 'free':
        }
      }

      root.endPoint = point;
      redraw(root);
    }
  });

  $('#drawing-area').on('mouseup', function(e) {
    // Ensure selection is closed so new one can start
    if (root.drawing) {
      root.drawing = false;
    }
  });

  $(window).on('keydown', function(e) {
    // Parsing the keyboard
    console.log(e.key);
    // Find area object to write new character to
    if (root.selection) {
      var area = root.area.subAreas[root.selection.index];
      if (!area) {
        // If not found, write to background object
        area = root.area;
      }
      if (safeChar(e.key)) {
        // console.log([selection.x, selection.y]);

          area = writeChar(area, e.key, root.selection.x, root.selection.y);
          root.area = updateSubArea(root.area, root.selection.index, area);
          root.selection = cursorNext(root.selection);



      } else {
        switch (e.key) {
          case 'Enter':
            root.selection = cursorNextLine(root.selection);
            break;
          case 'Backspace':
            root.selection = cursorPrev(root.selection);
            area = writeChar(area, ' ', root.selection.x, root.selection.y);
            root.area = updateSubArea(root.area, root.selection.index, area);
            break;
          case 'ArrowUp':
          case 'ArrowDown':
          case 'ArrowLeft':
          case 'ArrowRight':
            root.selection = moveCursor(root.selection, e.key);
            break;
          case 'Insert':
            root.overwrite = !root.overwrite;
            break;
        }
      }
      redraw(root);
    } // else { //Do nothing if no selection being made. }
  });
});

function drawSelection(start, point, end) {
  if ((start.x === point.x) && (start.y === point.y) &&
      (end.x === point.x) && (end.y === point.y)) {
    // Start a new selection
    return newSelection(root.area, point);
  } else {
    // Resize current selection
    var newPoint = getXY(e.pageX, e.pageY, root.width, root.height);
    if (
      newPoint.x != root.endPoint.x ||
      newPoint.y != root.endPoint.y
    ) {
      root.endPoint = newPoint;
      // console.log(root.endPoint);
      if (
        root.startPoint.x === root.endPoint.x &&
        root.startPoint.y === root.endPoint.y
      ) {
        // Make a new one-point selection
        root.area = clearEmptySelections(root.area);
        root.selection = newSelection(root.area, root.startPoint);
      } else {
        // Make a new two-point or box selection
        root.area = clearEmptySelections(root.area);
        root.selection = newSelection(root.area, root.startPoint, root.endPoint);
        root.area = addSubArea(root.area, areaInit(root.selection));
        console.log(root.selection);
        redraw(root);
      }
    }
  }
}
