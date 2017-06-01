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
  selection.getTags = function(x, y) {
    return getSelectionTags(area, this, x, y);
  };
  selection.getLocation = function(x, y) {
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
  selection.getTags = function(x, y) {
    return getSelectionTags(area, this, x, y);
  };
  selection.getLocation = function(x, y) {
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
  // Mark the edges of the selection if they exist:
  if (y === ymin - 1) {
    if (x === xmin - 1) {
      tags = ['<span class="top-left">', '</span>'];
    } else if (x === xmax + 1) {
      tags = ['<span class="top-right">', '</span>'];
    } else if (x === xmin) {
      tags[0] = '<span class="top-edge">';
    } else if (x === xmax) {
      tags[1] = '</span>';
    }
  } else if (y === ymax + 1) {
    if (x === xmin - 1) {
      tags = ['<span class="bottom-left">', '</span>'];
    } else if (x === xmax + 1) {
      tags = ['<span class="bottom-right">', '</span>'];
    } else if (x === xmin) {
      tags[0] = '<span class="bottom-edge">';
    } else if (x === xmax) {
      tags[1] = '</span>';
    }
  } else if (x === xmin - 1) {
    tags = ['<span class="left-edge">', '</span>'];
  } else if (x === xmax + 1) {
    tags = ['<span class="right-edge">', '</span>'];
  }
  // Mark the selection itself:
  if ((y >= ymin) && (y <= ymax)) {
    if (x === xmin) {
      tags[0] = '<span class="selected">';
    }
    // Mark the selection cursor:
    if ((x === selection.x) && (y === selection.y)) {
      tags[0] += '</span><span class="cursor">';
      tags[1] = '</span><span class="selected">';
    }
    if (x === selection.xmax) {
      tags[1] += '</span>';
    }
  }
  return tags;
}

function getLocationClass(area, selection, x, y) {
  // Default is "unselected"
  var classname = "unselected";
  var xmin = selection.xmin;
  var ymin = selection.ymin;
  var xmax = selection.xmax;
  var ymax = selection.ymax;
  if (area.border) {
    left = xmin - area.border.left.width;
    top = ymin - area.border.top.height;
    right = xmax + area.border.right.width;
    bottom = ymax + area.border.bottom.height;
  } else {
    left = xmin - 1;
    top = ymin - 1;
    right = xmax + 1;
    bottom = ymax + 1;
  }

  if ((x === selection.x) && (y === selection.y)) {
    // Mark the cursor iteslf:
    if (area.visibleAt(x, y) && area.contentAt(x, y) != ' ') {
      classname = "cursor-overwrite";
    } else {
      classname = "cursor";
    }
  } else if ((y >= ymin) && (y <= ymax)) {
    classname = "selected";
  } else if (y < ymin && y >= top) {
    // Mark the top border:
    if (x < xmin && x >= left) {
      classname = "top-left";
    } else if (x > xmax && x <= right) {
      classname = "top-right";
    } else {
      classname = "top-edge";
    }
  } else if (y > ymax && y <= bottom) {
    // Mark the bottom border
    if (x < xmin && x >= left) {
      classname = "bottom-left";
    } else if (x > xmax && x <= right) {
      classname = "bottom-right";
    } else {
      classname = "bottom-edge";
    }
  } else if (x < xmin && x >= left) {
    classname = "left-edge";
  } else if (x > xmax && x <= right) {
    classname = "right-edge";
  }
  return classname;
}
