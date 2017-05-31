borderCharAt: function(x, y) {
  let area = this.selectAll();
  let region = borderRegion(x, y);
  let border = this.border[region];
  let numReps = border.length;
  switch (region) {
    case 'topleft':
      return border[area.ymin - y - 1][area.xmin - x - 1];
    case 'bottomleft':
      return border[y - area.ymax - 1][area.xmin - x - 1];
    case 'left':
      return border[(y - ymin) % numReps][area.xmin - x - 1];
    case 'right':
      return border[(y - ymin) % numReps][area.xmax - x - 1];
    case 'topright':
      return border[area.ymin - y - 1][area.xmax - x - 1];
    case 'bottomright':
      return border[y - area.ymax - 1][area.xmax - x - 1];
    case 'top':
      return border[(x - xmin) % numReps][area.ymin - y - 1];
    case 'bottom':
      return border[(x - xmin) % numReps][y - area.ymax - 1];
    default:
      return false;
  }
},

borderRegion: function(x, y) {
  let area = this.selectAll();
  let region = '';
  if (y < area.ymin) {
    region += 'top';
  } else if (y > area.ymax) {
    region += 'bottom';
  }
  if (x < area.xmin) {
    region += 'left';
  } else if (x > area.xmax) {
    region += 'right';
  }
  return region;
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
