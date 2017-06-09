'use strict';

// These functions relate to the root drawing area: the rectangle containing the
// entire drawing.

function rootAreaInit(width, height) {
  // Create a new root area (generally, only one is created at a time)
  var selection = {
    x: 0,
    y: 0,
    xmin: 0,
    ymin: 0,
    xmax: width - 1,
    ymax: height - 1
  };
  // Start with normal area object:
  var bg = areaInit(selection);
  // Add additional methods and attributes:
  bg.type = 'background';
  bg.subAreas = [];
  bg.getSubAreaIndex = function(x, y) {
    var index = this.subAreas.length - 1;
    while (index >= 0) {
      if (hasPoint(this.subAreas[index], x, y)) {
        if (visibleAt(this.subAreas[index], x, y)) {
          return index;
        }
      }
      index --;
    }
    return -1;
  };
  bg.visibleCharAt = function(x, y) {
    var area = this.subAreas[this.getSubAreaIndex(x, y)];
    if (!area) {
      area = this;
    }
    return area.contentAt(x, y);
  };
  // bg.selectPoint = function(point1, point2) {
  //   return newSelection(this, point1, point2);
  // };
  return bg;
}

function resizeRootArea(area, width, height) {
  var output = rootAreaInit(width, height);
  for (var i = 0; i < area.subAreas.length; i++) {
    output.subAreas[i] = area.subAreas[i];
  }
  return output;
}

function moveAll(area, x, y) {
  var output = rootAreaInit(area.width, area.height);
  for (var i = 0; i < area.subAreas.length; i++) {
    output.subAreas[i] = moveArea(area.subAreas[i], x, y);
  }
  return output;
}

function clearEmptySubAreas(area) {
  var output = rootAreaInit(area.width, rootarea.height);
  for (var i = 0; i < area.subAreas.length) {
    if (area.subAreas[i].isEmpty()) {
      // Do nothing;
    } else {
      output.subAreas.push(area.subAreas[i]);
    }
  }
  return output;
}

function reorderSubArea(area, index, level) {
  var output = rootAreaInit(area.width, area.height);
  var subArea = area.subAreas[index];
  if (subArea) {
    switch (level) {
      case 'bottom': {
        output.subAreas.push(subArea);
        for (var i = 0; i < area.subAreas.length; i++) {
          if (i !== index) {
            output.subAreas.push(area.subAreas[i]);
          }
        }
        break;
      } case 'top': {
        for (var i = 0; i < area.subAreas.length - 1; i++) {
          if (i !== index) {
            output.subAreas.push(area.subAreas[i]);
          }
        }
        output.subAreas.push(subArea);
        break;
      } case 'up': {
        for (var i = 0; i < index; i++) {
          output.subAreas.push(area.subAreas[i]);
        }
        if (index < area.subAreas.length - 1) {
          output.subAreas.push(area.subAreas[index + 1]);
        }
        output.subAreas.push(subArea);
        for (var i = index + 2; i < area.subAreas.length; i++) {
          output.subAreas.push(area.subAreas[i]);
        }
        break;
      } case 'down': {
        if (index > 0) {
          for (var i = 0; i < index - 1; i++) {
            output.subAreas.push(area.subAreas[i]);
          }
        }
        output.subAreas.push(subArea);
        if (index > 0) {
          output.subAreas.push(area.subAreas[index - 1]);
        }
        for (var i = index + 1; i < area.subAreas.length; i++) {
          output.subAreas.push(area.subAreas[i]);
        }
        break;
      }
    }
  }
  return output;
}

function addSubArea(area, subArea) {
  var output = resizeRootArea(area, area.width, area.height);
  output.subAreas.push(subArea);
  return output;
}

function updateSubArea(area, index, subArea) {
  var output = resizeRootArea(area, area.width, area.height);
  if (index === -1) {
    return subArea;
  }
  output.subAreas[index] = subArea;
  return output;
}

function deleteSubArea(area, index) {
  var output = rootAreaInit(area.width, area.height);
  for (var i = 0; i < index; i++) {
    if (i !== index) {
      output.subAreas.push(area.subAreas[i]);
    }
  }
  return output;
}

function copyOject(area, index) {
  var output = resizeRootArea(area, area.width, area.height);
  output.subAreas.push(area.subAreas[index]);
  return output;
}

function moveSubArea(area, index, x, y) {
  var output = area;
  var subArea = area.subAreas[index];
  if (subArea) {
    subArea = moveArea(area, x, y);
    output.subAreas[index] = subArea;
  }
  return output;
};

function mergeSubArea(area, index) {
  var output = area;
  var subArea = area.subAreas[index]
  if (subArea) {
    var top = subArea.offset.top;
    var left = subArea.offset.left;
    output = deleteSubArea(area, index);
    output.lines = mergeAreas(output, subArea).lines;
  }
  return output;
};
