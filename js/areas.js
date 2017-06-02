'use strict';

function areaInit(selection) {
  var width = (selection.xmax - selection.xmin + 1);
  var height = (selection.ymax - selection.ymin + 1);
  var content = contentFill(width, height);
  return {
    type: 'basic',
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

function writeChar(area, string, x, y) {
  var output = area;
  var j = y - output.offset.top;
  var i = x - output.offset.left;
  var line = output.lines[j];
  output.lines[j] = (
    line.substring(0, i) +
    string[0] +
    line.substring(i + 1, line.length)
  );
  return output;
}

function insertChar(area, string, x, y, direction) {
  var output = area;
  var i = x - area.offset.left;
  var j = y - area.offset.top;
  switch(direction) {
    case "left":
    var line = area.lines[j];
      if ((line[0] != ' ') || (i === 0)) {
        i++;
        output.offset.left--;
        output.width++;
        // push left edge of content:
        for (var k = 0; k < area.lines.length; k++) {
          output.lines[k] = ' ' + output.lines[k];
        }
      }
      output.lines[j] = line.substring(1,i) + string[0] + line.substring(i, line.length);
      break;
    case "up":
      if ((area.lines[0][i] != ' ') || (j === 0)) {
        j++;
        output.offset.top--;
        output.height++;
        // push top edge of content:
        output.lines.unshift(contentFill(area.width, 1)[0]);
      }
      for (var k = 0; k < j; k++) {
        output = writeChar(output, area.lines[k+1][i], x, y - j + k);
      }
      output = writeChar(output, string, x, y);
      break;
    case "down":
      if ((area.lines[area.height - 1][i] != ' ') || (j === area.height - 1)) {
        output.height++;
        // push top edge of content:
        output.lines.push(contentFill(area.width, 1)[0]);
      }
      for (var k = j + 1; k < output.height; k++) {
        output = writeChar(output, area.lines[k-1][i], x, y - j + k);
      }
      output = writeChar(output, string, x, y);
      break;
    default:
      var line = area.lines[j];
      if ((line[0] != ' ') || (i === line.length - 1)) {
        output.width++;
        // push left edge of content:
        for (var k = 0; k < area.lines.length; k++) {
          output.lines[k] =  output.lines[k] + ' ';
        }
      }
      output.lines[j] = line.substring(0,i) + string[0] + line.substring(i, line.length);
      break;
  }
  return output;
}

function contentFill(width, height, pattern) {
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
  var output = area;
  output.offset.left += x;
  output.offset.top += y;
  return output;
}

function subArea(area, selection) {
  // creates a smaller area from a selection
  var output = area;
  var template = areaInit(selection);
  for (var y = selection.ymin; y <= selection.ymax; y++) {
    for (var x = selection.xmin; x <= selection.xmax; x++) {
      template.lines[y - selection.ymin] = '';
      if (hasPoint(this, x, y)) {
        template.lines[y - selection.ymin] += this.contentAt(x, y);
      } else {
        template.lines[y - selection.ymin] += ' ';
      }
    }
  }
  output.lines = template.lines;
  output.width = template.width;
  output.height = template.height;
  output.offset = template.offset;
  return output;
}

function mergeAreas(area1, area2) {
  // Makes an area encompassing area1 and area2, containing the merged contents
  // area2 has priority over area1
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
