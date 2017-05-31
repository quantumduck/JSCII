$(function() {
  //  For ease of programming, There is only one global object: root
  // root has one method: redraw, which assigns its contents to the DOM
  // None of the methods on root or its children change the object itself.
  var root = {
    selecting: false, // Is mouse being moved with left button down?
    selectionStart: {x: 0, y: 0}, // Start of current selection
    selectionEnd: {x: 0, y: 0}, // End of current selection
    selection: false, // Current selection object (if one exists)
    width: 54, // Width of drawing area (in chars)
    height: 31, // Height of drawing area (in chars)
    area: rootAreaInit(54, 31), // Drawing area
    redraw: function() {
      $('#drawing-area').html(getHTML(this.area, this.selection));
      // This line ensures getOffset() works correctly.
      $('body').css('max-width', $('#drawing-container').css('width'));
    }
  };
  root.redraw(); // Write Drawing area object to DOM

  $('#drawing-area').on('click', function(e) {
    // When in select mode, remember point clicked and select that point
    root.selectionStart = getXY(e.pageX, e.pageY, root.width, root.height);
    if(root.area.hasPoint(root.selectionStart.x, root.selectionStart.y)) {
      console.log(root.selectionStart);
      root.selection = select(root.area, root.selectionStart);
      root.redraw();
    } else {
      // Keep track of bad click events...
      console.log(root.selectionStart);
      console.log([e.pageX, e.pageY])
    }

  });

  $('#drawing-area').on('mousemove', function(e) {
    // When in select mode, redraw the selection when the mouse moves
    // (only when left button is held down)
    if (e.buttons === 1) {
      if (!root.selecting) {
        // Start a new selection
        root.selecting = true;
        root.selectionStart = getXY(e.pageX, e.pageY, root.width, root.height);
        root.selectionEnd = root.selectionStart;
        root.area = clearEmptySelections(root.area);
        root.selection = select(root.area, root.selectionStart);
        root.redraw();
      } else {
        // Resize current selection
        var newPoint = getXY(e.pageX, e.pageY, root.width, root.height);
        if (
          newPoint.x != selectionEnd.x ||
          newPoint.y != selectionEnd.y
        ) {
          root.selectionEnd = newPoint;
          // console.log(selectionEnd);
          if (
            root.selectionStart.x === root.selectionEnd.x &&
            root.selectionStart.y === root.selectionEnd.y
          ) {
            // Make a new one-point selection
            root.area = clearEmptySelections(root.area);
            root.selection = select(root.area, root.selectionStart);
          } else {
            // Make a new two-point or box selection
            root.area = clearEmptySelections(root.area);
            root.selection = select(root.area, root.selectionStart, root.selectionEnd);
            root.area = root.area.addOjbect(areaInit(root.selection));
            console.log(root.selection);
            root.redraw();
          }

        }
      }
    }
  });

  $('#drawing-area').on('mouseup', function(e) {
    // Ensure selection is closed so new one can start
    if (root.selecting) {
      root.selecting = false;
    }
  });

  $(window).on('keydown', function(e) {
    // Parsing the keyboard
    console.log(e.key);
    // Find area object to write new character to
    var area = root.area.objects[root.selection.index];
    if (!area) {
      // If not found, write to background object
      area = root.area;
    }
    if (safeChar(e.key)) {
      // console.log([selection.x, selection.y]);
      area = area.writeChar(e.key, root.selection.x, root.selection.y);
      root.area = root.area.updateObject(root.selection.index, area);
      root.selection = root.selection.forward();
    } else {
      switch (e.key) {
        case 'Enter':
          root.selection = root.selection.enter();
          break;
        case 'Backspace':
          root.selection = root.selection.back();
          area = area.writeChar(' ', root.selection.x, root.selection.y);
          root.area = root.area.updateObject(root.selection.index, area);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          root.selection = root.selection.move(e.key);
          break;
      }
    }
    root.redraw();
  });
});
