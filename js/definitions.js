'use strict';

var numAreas = 0;

var mode = {
  overwrite: 0,
  insert: 1,
  select: 2,
  move: 3,
  resize: 4,
  box: 5,
  line: 6,
  arrow: 7,
  freeform: 8
}

var currentMode = mode.overwrite;

function areaInit(selection) {
  let width = (selection.xmax - selection.xmin + 1);
  let height = (selection.ymax - selection.ymin + 1);
  let content = contentFill(width, height);
  return {
    type: 'basic',
    lines: content,
    width: content[0].length,
    height: content.length,
    offset: {left: selection.xmin , top: selection.ymin},
    visible: true,
    opaque: false
    selectAll: function() {
      return selectAll(this);
    },
    contains: function(x, y) {
      return contains(this, x, y);
    },
    charAt: function(x, y) {
      return charAt(this, x, y);
    },
    visibleAt: function(x, y) {
      return visibleAt(this, x, y);
    },
    visiblePoints: function() {
      return visiblePoints(this);
    },
    move: function(x, y) {
      return moveArea(this, x, y);
    },
    resize: function(selection) {
      return subArea(this, selection);
    },
    writeChar: function(string, x, y) {
      return writeChar(this, string, x, y);
    }
  };
}

function selectAll(area) {
  return {
    x: area.offset.left,
    y: area.offset.top,
    xmin: area.offset.left,
    ymin: area.offset.top,
    xmax: area.offset.left + this.width - 1,
    ymax: area.offset.top + this.height - 1
  };
}

function writeChar(area, string, x, y) {
  let output = area;
  let j = y - output.offset.top;
  let i = x - output.offset.left;
  let line = output.lines[j];
  output.lines[j] = (
    line.substring(0, i) +
    string[0] +
    line.substring(i + 1, line.length
  );
  return output;
}

function contentFill(width, height, pattern) {
  if (!width || !height) {
    return false;
  }
  let content = [];
  if (pattern) {
    let xlen = pattern[0].length;
    let ylen = pattern.length;
    for (let y = 0; y < height; y++) {
      content.push('');
      for (let x = 0; x < width; x++) {
        content[y] += pattern[y % ylen][x % xlen];
      }
    }
  } else {
    for (let y = 0; y < height; y++) {
      content.push('');
      for (let x = 0; x < width; x++) {
        content[y] += ' ';
      }
    }
  }
  return content;
}

function contains(area, x, y) {
  let region = selectAll(area);
  return (
    x >= region.xmin &&
    x <= region.xmax &&
    y >= region.ymin &&
    y <= region.ymax
  );
}

function charAt(area, x, y) {
  if contains(area, x, y) {
    return area.lines[y - area.offset.top][x - area.offset.left];
  } else {
    return '';
  }
}

function visibleAt(area, x, y) {
  if (contains(area, x, y)) {
    if (area.visible) {
      if (area.opaque) {
        return true;
      } else if (charAt(area, x, y) === ' ') {
        return false;
      } else {
        return true;
      }
    }
  }
  return false;
}

function visiblePoints(area, selection) {
  let points = [];
  let region = area.selectAll();
  if (selection) {
    region = selection;
  }
  for (let y = region.ymin; y <= region.ymax; y++) {
    for (let x = region.xmin; x <= region.xmax; x++) {
      if (visibleAt(area, x, y)) {
        points.push({x: x, y: y});
      }
    }
  }
  return points;
}

function moveArea(area, x, y) {
  let output = area;
  output.offset.left += x;
  output.offset.top += y;
  return output;
}

function subArea(area, selection) {
  let output = area;
  let template = areaInit(selection);
  for (let y = selection.ymin; y <= selection.ymax; y++) {
    for (let x = selection.xmin; x <= selection.xmax; x++) {
      template.lines[y - selection.ymin] = '';
      if (this.contains(x, y)) {
        template.lines[y - selection.ymin] += this.charAt(x, y);
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
  let selection = area1.selectAll();
  let addIn = area2.selectAll();
  selection.xmin = Math.min(selection.xmin, addIn.xmin);
  selection.ymin = Math.min(selection.ymin, addIn.ymin);
  selection.xmax = Math.max(selection.xmax, addIn.xmax);
  selection.ymax = Math.max(selection.ymax, addIn.ymax);
  let mergedAreas = areaInit(selection);
  for (let y = selection.ymin; y <= selection.ymax; y++) {
    for (let x = selection.xmin; x <= selection.xmax; x++) {
      mergedAreas.lines[y - selection.ymin] = '';
      if (this.visibleAt(x, y)) {
        mergedAreas.lines[y - selection.ymin] += area1.charAt(x, y);
      } else if (otherArea.visibleAt(x, y)) {
        mergedAreas.lines[y - selection.ymin] += area2.charAt(x, y);
      } else {
        mergedAreas.lines[y - selection.ymin] += ' ';
      }
    }
  }
  return mergedAreas;
}
