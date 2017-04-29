$(function() {
  var selecting = false;
  var selectionStart = {x: 0, y: 0};
  drawingAreaReset(54, 31);
  $('#drawing-area').on('mousemove', function(e) {
    if (e.buttons === 1) {
      if (!selecting) {
        selecting = true;
        selectionStart = getXY(e.pageX, e.pageY);
        selection.set(selectionStart.x, selectionStart.y);
      } else {
        var selectionEnd = getXY(e.pageX, e.pageY);
        selection.set(
          selectionEnd.x,
          selectionEnd.y,
          (selectionStart.x - selectionEnd.x),
          (selectionStart.y - selectionEnd.y)
        );
      }
    }
  });

  $('#drawing-area').on('mouseup', function(e) {
    if (selecting) {
      selecting = false;
    }
  });

  $(window).on('keyup', function(e) {
    console.log(e.key);
    if (addChar(e.key, selection.x, selection.y)) {;
      selection.setToNext();
    } else {
      switch (e.key) {
        case "Enter":
          selection.setToNextLine();
        break;
      }
    }
  });
});
