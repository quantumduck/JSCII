'use strict';

function newAreaSelection(rootArea, point1, point2) {
  var selection = {
    x: point1.x,
    y: point1.y,
    xmin: Math.min(point1.x, point2.x),
    xmax: Math.max(point1.x, point2.x),
    ymin: Math.min(point1.y, point2.y),
    ymax: Math.max(point1.y, point2.y),
    index: rootarea.subAreas.length
  };
  var area = areaInit(selection);
  selection.getLocationClass = function(x, y) {
    return getLocationClass(area, this, x, y);
  };
  return [area, selection];
}

function newSelection(rootarea, point) {
  var index = rootarea.getSubAreaIndex(point.x, point.y);
  var area = rootarea.subAreas[index];
  if (!area) {
    return false;
  }
  var selection = area.selectAll();
  selection.index = index;
  selection.x = point.x;
  selection.y = point.y;
  if (area.border) {
    selection.xmin += area.border.left.width;
    selection.ymin += area.border.top.height;
    selection.xmax -= area.border.right.width;
    selection.ymax -= area.border.bottom.height;
    if (selection.x < selection.xmin) {
      selection.x = selection.xmin;
    } else if (selection.x > selection.xmax) {
      selection.x = selection.xmax;
    }
    if (selection.y < selection.ymin) {
      selection.y = selection.ymin;
    } else if (selection.y > selection.ymax) {
      selection.y = selection.ymax;
    }
  }
  selection.getLocationClass = function(x, y) {
    return getLocationClass(area, this, x, y);
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

function getLocationClass(area, selection, x, y) {
  // Default is "unselected"
  var classname = "";
  var xmin = selection.xmin;
  var ymin = selection.ymin;
  var xmax = selection.xmax;
  var ymax = selection.ymax;
  var left = xmin - 1;
  var top = ymin - 1;
  var right = xmax + 1;
  var bottom = ymax + 1;
  if (area.border) {
    left = xmin - area.border.left.width;
    top = ymin - area.border.top.height;
    right = xmax + area.border.right.width;
    bottom = ymax + area.border.bottom.height;
  }
  // Mark the cursor:
  if ((x === selection.x) && (y === selection.y)) {
    // Mark the cursor iteslf:
    if (area.visibleAt(x, y) && area.contentAt(x, y) != ' ') {
      classname = "cursor-overwrite";
    } else {
      classname = "cursor";
    }
  }
  // Mark the border for bordered areas or the edge:
  if (y < ymin && y >= top) {
    // Mark the top border:
    if (x < xmin && x >= left) {
      classname += "top-left";
    } else if (x > xmax && x <= right) {
      classname += "top-right";
    } else {
      classname += "top-edge";
    }
  } else if (y > ymax && y <= bottom) {
    // Mark the bottom border
    if (x < xmin && x >= left) {
      classname += "bottom-left";
    } else if (x > xmax && x <= right) {
      classname += "bottom-right";
    } else {
      classname += "bottom-edge";
    }
  } else if (x < xmin && x >= left) {
    classname += "left-edge";
  } else if (x > xmax && x <= right) {
    classname += "right-edge";
  }
  // Mark the selection:
  if ((y >= ymin) && (y <= ymax) && (x >= xmin) && (x <= xmax)) {
    classname = "selected";
  } else if (area.border) {
    // For bordered areas, include the border in the selection.
    if ((y >= top) && (y <= bottom) && (x >= left) && (x <= right)) {
      classname += " selected";
    }
  }
  if (classname === "") {
    return "unselected";
  } else {
    return classname;
  }
}
