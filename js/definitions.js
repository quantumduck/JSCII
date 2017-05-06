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

function contentFill(width, height, pattern) {
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

function areaInit(selection) {
  let width = (selection.xmax - selection.xmin + 1);
  let height = (selection.ymax - selection.ymin + 1);
  let content = contentFill(width, height);
  let area =  {
    type: 'basic',
    lines: content,
    width: content[0].length,
    height: content.length,
    offset: {left: selection.xmin , top: selection.ymin},
    visible: true,
    opaque: false
  };

  area.selectAll = function() {
    return {
      x: this.offset.left,
      y: this.offset.top,
      xmin: this.offset.left,
      ymin: this.offset.top,
      xmax: this.offset.left + this.width - 1,
      ymax: this.offset.top + this.height - 1
    };
  };

  area.contains = function(x, y) {
    let area = this.selectAll();
    return (
      x >= area.xmin &&
      x <= area.xmax &&
      y >= area.ymin &&
      y <= area.ymax
    );
  };

  area.charAt = function(x, y) {
    if this.contains(x, y) {
      return this.lines[y - this.offset.top][x - this.offset.left];
    } else {
      return '';
    }
  };

  area.visibleAt = function(x, y) {
    if (this.contains(x, y)) {
      if (this.visible) {
        if (this.opaque) {
          return true;
        } else if (charAt(x, y) === ' ') {
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  };

  area.visiblePoints = function() {
    let points = [];
    let area = this.selectAll();
    for (let y = area.ymin; y <= area.ymax; y++) {
      for (let x = area.xmin; x <= area.xmax; x++) {
        if (this.visibleAt(x, y)) {
          points.push({x: x, y: y});
        }
      }
    }
    return points;
  };

  area.move = function(x, y) {
    let output = this;
    output.offset.left += x;
    output.offset.top += y;
    return output;
  };

  area.resize = function(selection) {
    let output = this;
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
  };

  return area;
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
  mergedAreas.type = 'basic';
  return mergedAreas;
};
