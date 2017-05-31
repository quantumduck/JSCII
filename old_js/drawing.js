// overwrite the character at the specified x and y indices.
function addChar(char, x, y) {
  var line = drawingArea.lines[y];
  if (
    // Do not insert control characters.
    (char.length != 1) ||
    (char.codePointAt(0) < 32) ||
    ((char.codePointAt(0) >= 127) && (char.codePointAt(0) <= 159))
  ) {
    return false;
  }
  line = line.substring(0, x) + char + line.substring(x + 1, line.length);
  drawingArea.lines[y] = line;
  redraw();
  return char;
}

function charAt(x, y) {
  return drawingArea.lines[y][x];
}

function addRandomChar() {
  var slots = emptySquares();
  var slot;
  var char;
  if (slots.length) {
    slot = slots(Math.floor(Math.random() * slots.length));
    char = String.fromCodePoint(32 + Math.floor(Math.random() * 95));
    return addChar(char, slot.x, slot.y);
  } else {
    return false;
  }
}

function emptySquares() {
  var results = [];
  for (var i = 0; i < drawingArea.width(); i++) {
    for (var j = 0; j < drawingArea.height(); j++) {
      if (charAt(i, j) === ' ') {
        results.push({x: i, y: j});
      }
    }
  }
  return results;
}
