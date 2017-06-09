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
  bg.selectPoint = function(point1, point2) {
    return newSelection(this, point1, point2);
  };
  return bg;
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

function reorderSubArea(area, index, level) {
  var output = area;
  var subArea = area.subAreas[index];
  if (subArea) {
    switch (level) {
      case 'bottom': {
        for (var i = index; i > 0; i--) {
          output = reorderSubArea(output, i, -1);
        }
        break;
      } case 'top': {
        for (var i = index; i < area.subAreas.length - 1; i++) {
          output = reorderSubArea(output, i, 1);
        }
        break;
      } case 1: {
        output.subAreas[index] = area.subAreas[index + 1];
        output.subAreas[index + 1] = subArea;
        break;
      } case -1: {
        output.subAreas[index] = area.subAreas[index - 1];
        output.subAreas[index - 1] = subArea;
        break;
      }
    }
  }
  return output;
}

function addSubArea(area, subArea) {
  var output = area;
  output.subAreas.push(subArea);
  return output;
}

function updateSubArea(area, index, subArea) {
  var output = area;
  if (index === -1) {
    return subArea;
  }
  output.subAreas[index] = subArea;
  return output;
}

function deleteSubArea(area, index) {
  var output = area;
  if (area.subAreas[index]) {
    output = reorderSubArea(area, index, 'top');
    output.subAreas.pop();
  }
  return output;
}

function copyOject(area, index) {
  var output = area;
  var subArea = area.subAreas[index];
  if (subArea) {
    output.subAreas.push(subArea);
  }
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
