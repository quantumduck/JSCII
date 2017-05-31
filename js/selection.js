'use strict';

function newSelection(rootarea, point1, point2) {
  var index = rootarea.getSubAreaIndex(point1.x, point1.y);
  var area = rootarea.subAreas[index];
  if (!area) {
    area = rootarea;
  }
  var selection = area.selectAll();
  selection.index = index;
  if (index < 0) {
    selection.x = point1.x;
    selection.y = point1.y;
  }
  if (point2) {
    selection.xmin = Math.min(point1.x, point2.x);
    selection.xmax = Math.max(point1.x, point2.x);
    selection.ymin = Math.min(point1.y, point2.y);
    selection.ymax = Math.max(point1.y, point2.y);
    selection.index = rootarea.subAreas.length;
  } else if (area.border) {
    selection.x += area.border.left.width;
    selection.y += area.border.top.height;
    selection.xmin += area.border.left.width;
    selection.ymin += area.border.top.height;
    selection.xmax -= area.border.right.width;
    selection.ymax -= area.border.bottom.height;
  }
  selection.getTags = function(x, y) {
    return getSelectionTags(area, this, x, y);
  };
  return selection;
}

function moveCursor(selection, direction) {
  var output = selection;
  switch (direction) {
    case 'ArrowUp':
    if (selection.y <= selection.ymin) {
      output.y = selection.ymax;
    } else {
      output.y--;
    }
    break;
    case 'ArrowDown':
    if (selection.y >= selection.ymax) {
      output.y = selection.ymin;
    } else {
      output.y++;
    }
    break;
    case 'ArrowLeft':
    if (selection.x <= selection.xmin) {
      output.x = selection.xmax;
    } else {
      output.x--;
    }
    break;
    case 'ArrowRight':
    if (selection.x >= selection.xmax) {
      output.x = selection.xmin;
    } else {
      output.x++;
    }
  }
  return output;
}

function cursorNext(selection) {
  var output = selection;
  if (selection.x < selection.xmax) {
    output.x++;
  } else {
    output = cursorNextLine(output);
  }
  return output;
}

function cursorNextLine(selection) {
  var output = selection;
  output.x = selection.xmin;
  if (selection.y < selection.ymax) {
    output.y++;
  } else {
    output.y = selection.ymin;
  }
  return output;
}

function cursorPrev(selection) {
  var output = selection;
  if (selection.x > selection.xmin) {
    output.x--;
  } else {
    output.x = selection.xmax;
    if (selection.y > selection.ymin) {
      output.y--;
    } else {
      output.y = selection.ymax;
    }
  }
  return output;
}

function clearEmptySelections(rootarea) {
  var output = rootarea;
  var topArea = rootarea.subAreas[rootarea.subAreas.length - 1];
  while (topArea && topArea.isEmpty()) {
    output.subAreas.pop();
    topArea = output.subAreas[output.subAreas.length - 1];
  }
  return output;
}

function getSelectionTags(area, selection, x, y) {
        // Many characters selected
  var tags = ['',''];
  var xmin = selection.xmin;
  var ymin = selection.ymin;
  var xmax = selection.xmax;
  var ymax = selection.ymax;
  if (area.border) {
    xmin -= area.border.left.width;
    ymin -= area.border.top.height;
    xmax += area.border.right.width;
    ymax += area.border.bottom.height;
  }
  if ((y >= ymin) && (y <= ymax)) {
    if (x === xmin) {
      tags[0] = '<span class="selected">';
    }
    if ((x === selection.x) && (y === selection.y)) {
            // The x and y coordinates of the selection get
            // different formatting
      tags[0] += '</span><span class="cursor">';
      tags[1] = '</span><span class="selected">';
    }
    if (x === selection.xmax) {
      tags[1] += '</span>';
    }
  }
  return tags;
}
