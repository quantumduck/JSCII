window.options = {
  // User settings:
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
  // User input state:
  action: "none", // Is mouse being moved with left button down?
  resizeType: "none", // If action is resize, which type of resize?
  startPoint: {x: 0, y: 0}, // Start of current selection
  endPoint: {x: 0, y: 0} // End of current selection
};

window.selection = false; // Current selection object (if one exists)

window.rootarea = rootAreaInit(54, 31), // Drawing area

$(function() {

  redraw(window.rootarea, window.selection); // Write Drawing area object to DOM

  $('#drawing-area').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    // Remember point clicked and select that point
    var point = getXY(e.pageX, e.pageY, window.rootarea);
    if(window.rootarea.hasPoint(point.x, point.y)) {
      console.log(point);
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
    // Clicking off drawing area removes selection
    window.selection = false;
    window.state.action = "none";
    redraw(window.rootarea, window.selection);
  });

  $('#drawing-area').on('mousemove', function(e) {
    // When in select mode, redraw the selection when the mouse moves
    // (only when left button is held down)
    if (e.buttons === 1) {
      var point = getXY(e.pageX, e.pageY, window.rootarea);
      var drawingData = false;
      if (window.state.action === "none") {
        // This is the first entry into the function:
        // We need to set the action
        window.state.endPoint = point;
        window.state.startPoint = point;
        if (window.selection) {
          var pointType = window.selection.getLocationClass(point.x, point.y;
          switch (pointType) {
            case "selected":
              window.state.action = "move";
              break;
            case "unselected":
              window.state.action = "draw";
              break;
            default:
              window.state.action = "resize";
              window.state.resizeType = pointType;
              break;
          }
        } else {
          // If ther is no active selection, then you need to draw something new.
          window.state.action = "draw";
        }
        // Draw something!
      } else if ((point.x !== window.state.endPoint.x) || (point.y !== window.state.endPoint.y)) {
        // The mouse has moved to a new square!
        // perform the action required

      }

    }
  });

  $('#drawing-area').on('mouseup', function(e) {
    // Ensure selection is closed so new one can start
    window.state.action = "none";
  });

  $(window).on('keydown', function(e) {
    // Parsing the keyboard
    console.log(e.key);
    // Find area object to write new character to
    if (window.selection) {
      var area = window.rootarea.subAreas[window.selection.index];
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
