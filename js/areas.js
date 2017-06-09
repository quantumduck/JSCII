'use strict';

function areaInit(selection) {
  // Create a basic text box:
  var width = (selection.xmax - selection.xmin + 1);
  var height = (selection.ymax - selection.ymin + 1);
  var content = contentFill(width, height);
  return {
    type: 'text',
    lines: content,
    width: content[0].length,
    height: content.length,
    offset: {left: selection.xmin , top: selection.ymin},
    visible: true,
    opaque: false,
    selectAll: function() {
      return selectAll(this);
    },
    hasPoint: function(x, y) {
      return hasPoint(this, x, y);
    },
    contentAt: function(x, y) {
      return contentAt(this, x, y);
    },
    visibleAt: function(x, y) {
      return visibleAt(this, x, y);
    },
    visiblePoints: function() {
      return visiblePoints(this);
    },
    isEmpty: function() {
      return isEmpty(this);
    }
  };
}

function copyArea(area) {
  return mergeAreas(area, area);
}

function copyContent(area) {
  var content = [];
  for (var j = 0; j < area.height; j++) {
    var line = '';
    for (var i = 0; i < area.width; i++) {
      line.push(area.lines[j][i]);
    }
    content.push(line);
  }
  return content;
}

function contentFill(width, height, pattern) {
  // Fill an array of strings with sapces or given characters
  if (!width || !height) {
    return false;
  }
  var content = [];
  if (pattern) {
    var xlen = pattern[0].length;
    var ylen = pattern.length;
    for (var y = 0; y < height; y++) {
      content.push('');
      for (var x = 0; x < width; x++) {
        content[y] += pattern[y % ylen][x % xlen];
      }
    }
  } else {
    for (var y = 0; y < height; y++) {
      content.push('');
      for (var x = 0; x < width; x++) {
        content[y] += ' ';
      }
    }
  }
  return content;
}

function selectAll(area) {
  return {
    x: area.offset.left,
    y: area.offset.top,
    xmin: area.offset.left,
    ymin: area.offset.top,
    xmax: area.offset.left + area.width - 1,
    ymax: area.offset.top + area.height - 1
  };
}

function hasPoint(area, x, y) {
  var region = selectAll(area);
  return (
    x >= region.xmin &&
    x <= region.xmax &&
    y >= region.ymin &&
    y <= region.ymax
  );
}

function contentAt(area, x, y) {
  if (hasPoint(area, x, y)) {
    return area.lines[y - area.offset.top][x - area.offset.left];
  } else {
    return '';
  }
}

function visibleAt(area, x, y) {
  if (hasPoint(area, x, y)) {
    if (area.visible) {
      if (area.opaque) {
        return true;
      } else if (contentAt(area, x, y) === ' ') {
        return false;
      } else {
        return true;
      }
    }
  }
  return false;
}

function visiblePoints(area, selection) {
  var points = [];
  var region = area.selectAll();
  if (selection) {
    region = selection;
  }
  for (var y = region.ymin; y <= region.ymax; y++) {
    for (var x = region.xmin; x <= region.xmax; x++) {
      if (visibleAt(area, x, y)) {
        points.push({x: x, y: y});
      }
    }
  }
  return points;
}

function isEmpty(area) {
  if (area.opaque) {
    return false;
  }
  var j = 0;
  while (!area.lines[j].trim()) {
    j++;
    if (j >= area.height - 1) {
      return true;
    }
  }
  return false;
}

function moveArea(area, x, y) {
  var output = copyArea(area);
  output.offset.left += x;
  output.offset.top += y;
  return output;
}

function subArea(area, selection) {
  // Resize an area using a new selection without moving the content.
  var output = areaInit(selection);
  for (var y = selection.ymin; y <= selection.ymax; y++) {
    for (var x = selection.xmin; x <= selection.xmax; x++) {
      output.lines[y - selection.ymin] = '';
      if (hasPoint(area, x, y)) {
        template.lines[y - selection.ymin] += area.contentAt(x, y);
      } else {
        template.lines[y - selection.ymin] += ' ';
      }
    }
  }
  return output;
}

function mergeAreas(area1, area2) {
  // Makes an area encompassing area1 and area2, containing the merged contents
  // area2 has priority over area1 if they overlap.
  var selection = selectAll(area1);
  var addIn = selectAll(area2);
  selection.xmin = Math.min(selection.xmin, addIn.xmin);
  selection.ymin = Math.min(selection.ymin, addIn.ymin);
  selection.xmax = Math.max(selection.xmax, addIn.xmax);
  selection.ymax = Math.max(selection.ymax, addIn.ymax);
  var merge = areaInit(selection);
  for (var y = selection.ymin; y <= selection.ymax; y++) {
    for (var x = selection.xmin; x <= selection.xmax; x++) {
      merge.lines[y - selection.ymin] = '';
      if (area2.visibleAt(x, y)) {
        merge.lines[y - selection.ymin] += contentAt(area2, x, y);
      } else if (area1.visibleAt(x, y)) {
        merge.lines[y - selection.ymin] += contentAt(area1, x, y);
      } else {
        merge.lines[y - selection.ymin] += ' ';
      }
    }
  }
  return merge;
}
