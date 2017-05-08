'use strict';

function rootAreaInit(width, height) {
  let selection = {
    x: 0,
    y: 0,
    xmin: 0,
    ymin: 0,
    xmax: width - 1,
    ymax: height - 1
  };
  let bg = areaInit(selection);
  bg.type = 'background';
  bg.objects = [];

  bg.getObjectIndex = function(x, y) {
    let index = this.objects.length - 1;
    while (index >= 0) {
      if (this.objects[index].contains(x, y)) {
        if (this.objects[index].visibleAt(x, y)) {
          return index;
        }
      }
      index --;
    }
    return -1;
  };

  bg.visibleCharAt = function(x, y) {
    let area = this.objects[this.getObjectIndex(x, y)];
    if (!area) {
      area = this;
    }
    return area.contentAt(x, y);
  };

  bg.reorderObject = function(objInd, level) {
    let output = this;
    let obj = output.objects[objInd];
    if (obj) {
      switch (level) {
        case 'bottom': {
          for (let i = objInd; i > 0; i--) {
            output = output.reorderObject(i, -1);
          }
          break;
        }
        case 'top': {
          for (let i = objInd; i < output.objects.length - 1; i++) {
            output = output.reorderObject(i, 1);
          }
          break;
        } case 1: {
          output.objects[objInd] = output.objects[objInd + 1];
          output.objects[objInd + 1] = obj;
          break;
        } case -1: {
          output.objects[objInd] = output.objects[objInd - 1];
          output.objects[objInd - 1] = obj;
          break;
        }
      }
    }
    return output;
  };

  bg.copyOject = function(objInd) {
    let output = this;
    let obj = output.objects[objInd];
    if (obj) {
      output.objects.push(obj);
    }
    return output;
  };

  bg.moveObject = function(objInd, x, y) {
    let output = this;
    let obj = output.objects[objInd];
    if (obj) {
      obj = obj.move(x, y);
      output.objects[objInd] = obj;
    }
    return output;
  };

  bg.mergeObject = function(objInd) {
    let output = this;
    let obj = output.objects[objInd]
    if (obj) {
      let top = obj.offset.top;
      let left = obj.offset.left;
      output.deleteObject(objInd);
      output.lines = mergeAreas(obj, output).lines;
    }
    return output;
  };

  bg.deleteObject = function(objInd) {
    let output = this;
    if (output.objects[objInd]) {
      output = output.reorderObject(objInd, 'top');
      output.objects.pop();
    }
    return output;
  };

  bg.select = function(point1, point2) {
    return select(this, point1, point2);
  };

  bg.move = function(x, y) {
    return this;
  };

  return bg;
}
