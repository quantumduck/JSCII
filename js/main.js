$(function() {
  drawingAreaReset(54, 31);
  $('#drawing-area').on('click', function(e) {
    var location = getXY(e.clientX, e.clientY);
    selection.set(location.x, location.y);
    redraw();
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
