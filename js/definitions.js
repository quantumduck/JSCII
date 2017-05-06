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
    return subArea(this, selection);
  }

  writeChar = function(string, x, y) {
    let output = this;
    let j = y - output.offset.top;
    let i = x - output.offset.left;
    let line = output.lines[j];
    output.lines[j] = (
      line.substring(0, i) +
      string[0] +
      line.substring(i + 1, line.length
    );
    return output;
  };

  return area;
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
};
