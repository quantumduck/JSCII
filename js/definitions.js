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
    opaque: false,
    border: {left: 0, top: 0, bottom: 0, right: 0}
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
    return this.lines[y - this.offset.top][x - this.offset.left];
  };

  area.visible = function(x, y) {
    if (this.visible) {
      if (this.opaque) {
        return true;
      } else if (charAt(x, y) === ' ') {
        return false;
      } else {
        return true
      }
    } else {
      return false;
    }
  };

  area.visiblePoints = function() {
    let points = [];
    let area = this.selectAll();
    for (let y = area.ymin; y <= area.ymax; y++) {
      for (let x = area.xmin; x <= area.xmax; x++) {
        if (this.visible(x, y)) {
          points.push({x: x, y: y});
        }
      }
    }
    return points;
  };

  area.resizeRight = function(newWidth) {
    for (var j = 0; j < this.height; j++) {
      if (this.width > newWidth) {
        this.lines[j] = this.lines[j].substring(0, newWidth);
      } else {
        for (var i = 0; i < (newWdith - this.width); i++) {
          this.lines[j] += ' ';
        }
      }
    }
    this.width = newWidth;
  };

  area.resizeBottom = function(newHeight) {
    if (this.height > newHeight) {
      for (var j = 0; j < (this.height - newHeight); i++) {
        this.lines.pop();
      }
    } else {
      var line = '';
      for (var i = 0; i < this.width; i++) {
        line += ' ';
      }
      for (var j = 0; j < (newHeight - this.height); j++) {
        this.lines.push(line);
      }
    }
    this.height = newHeight;
  };

  area.offsetContent = function(left, top) {

  };

  area.mergeWith = function(otherArea, overwrite) {
    let selection = this.selectAll();
    let addIn = otherArea.selectAll();
    selection.xmin = Math.min(selection.xmin, addIn.xmin);
    selection.ymin = Math.min(selection.ymin, addIn.ymin);
    selection.xmax = Math.max(selection.xmax, addIn.xmax);
    selection.ymax = Math.max(selection.ymax, addIn.ymax);
    if (overwrite) {
      let mergedAreas = areaInit(selection);
      for (let y = selection.ymin; y <= selection.ymax; y++) {
        for (let x = selection.xmin; x <= selection.xmax; x++) {
          
        }
      }

    }
  }

  return area;
}

function rootAreaInit(width, height) {
  let selection = {
    x: 0,
    y: 0,
    xmin: 0,
    ymin: 0,
    xmax: width - 1;
    ymax: height - 1;
  };
  let area = areaInit(selection);
  area.type = 'background';
  area.opaque = true;
  area.objects = [];

  area.getObjectIndex = function(x, y) {
    let index = this.objects.length - 1;
    while (index >= 0) {
      if (this.objects[index].contains(x, y)) {
        if (this.objects[index].visible(x, y)) {
          return index;
        }
      }
      index --;
    }
    return -1;
  };

  area.reorderObject = function(objInd, level) {
    let output = this;
    if (output.objects[objInd]) {
      let drawObject = output.objects[objInd];
      switch (level) {
        case 'bottom': {
          for (let i = objInd; i > 0; i--) {
            output = output.reorderObject(i, -1);
          }
        }
        case 'top': {
          for (let i = objInd; i < output.objects.length - 1; i++) {
            output = output.reorderObject(i, 1);
          }
        } case 1: {
          output.objects[objInd] = output.objects[objInd + 1];
          output.objects[objInd + 1] = drawObject;
        } case -1: {
          output.objects[objInd] = output.objects[objInd - 1];
          output.objects[objInd - 1] = drawObject;
        }
      }
    return output;
  };

  area.copyOject = function(objInd) {
    let output = this;
    if (output.objects[objInd]) {
      let obj = output.objects[objInd];
      output.objects.push(obj);
    }
    return output;
  };

  area.moveObject = function(objInd, x, y) {
    let output = this;
    if (output.objects[objInd]) {
      let obj = output.objects[objInd];
      obj = obj.move(x, y);
      output.objects[objInd] = obj;
    }
    return output;
  };

  area.mergeObject = function(objInd) {
    let output = this;
    let obj = output.objects[objInd]
    if (obj) {
      let top = obj.offset.top;
      let left = obj.offset.left;
      output.deleteObject(objInd);
      for (let j = 0; j < obj.height; j++) {
        for (let i = 0; i < obj.width; i++) {
          if (this.contains(left + i, top + j)) {
            this.lines[top + j][left + i] = obj.lines[j][i];
          }
        }
      }
    }
    return output;
  };

  area.deleteObject = function(objInd) {
    var output = this;
    if (output.objects[objInd]) {
      output = output.reorderObject(objInd, 'top');
      output.objects.pop();
    }
    return output;
  };

  area.select = function(point1, point2) {
    return select(this, point1, point2);
  }

  return area;
}
