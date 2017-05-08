$(function() {
  let selecting = false;
  let selectionStart = {x: 0, y: 0};
  let selectionEnd = {x: 0, y: 0};
  let selection = false;
  let drawingWidth = 54;
  let drawingHeight = 31;
  let drawingArea = rootAreaInit(drawingWidth, drawingHeight);
  redraw(drawingArea, selection);

  $('#drawing-area').on('click', function(e) {
    selectionStart = getXY(e.pageX, e.pageY, drawingWidth, drawingHeight);
    if(drawingArea.hasPoint(selectionStart.x, selectionStart.y)) {
      console.log(selectionStart);
      selection = select(drawingArea, selectionStart);
      redraw(drawingArea, selection);
    } else {
      console.log(selectionStart);
      console.log([e.pageX, e.pageY])
    }

  });

  $('#drawing-area').on('mousemove', function(e) {
    if (e.buttons === 1) {
      if (!selecting) {
        selecting = true;
        selectionStart = getXY(e.pageX, e.pageY, drawingWidth, drawingHeight);
        selectionEnd = selectionStart;
        selection = select(drawingArea, selectionStart);
        redraw(drawingArea, selection);
      } else {
        let newPoint = getXY(e.pageX, e.pageY, drawingWidth, drawingHeight);
        if (
          newPoint.x != selectionEnd.x ||
          newPoint.y != selectionEnd.y
        ) {
          selectionEnd = newPoint;
          // console.log(selectionEnd);
          if (
            selectionStart.x === selectionEnd.x &&
            selectionEnd.y === selectionEnd.y
          ) {
            selection = select(drawingArea, selectionStart);
          } else {
            selection = select(drawingArea, selectionStart, selectionEnd);
          }
          console.log(selection);
          redraw(drawingArea, selection);
        }
      }
    }
  });

  $('#drawing-area').on('mouseup', function(e) {
    if (selecting) {
      selecting = false;
    }
  });

  $(window).on('keydown', function(e) {
    console.log(e.key);
    if (safeChar(e.key)) {
      console.log([selection.x, selection.y]);
      drawingArea = drawingArea.writeChar(e.key, selection.x, selection.y);
      selection = next(selection);
    } else {
      switch (e.key) {
        case 'Enter':
          selection = nextLine(selection);
          break;
        case 'Backspace':
          selection = prev(selection);
          drawingArea = drawingArea.writeChar(' ', selection.x, selection.y);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          selection = selection.move(e.key);
          break;
      }
    }
    redraw(drawingArea, selection);
  });
});
