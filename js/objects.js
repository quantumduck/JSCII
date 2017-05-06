function rootAreaInit(width, height) {
  let selection = {
    x: 0,
    y: 0,
    xmin: 0,
    ymin: 0,
    xmax: width - 1;
    ymax: height - 1;
  };
  let bg = areaInit(selection);
  bg.type = 'background';
  bg.opaque = true;
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

  bg.reorderObject = function(objInd, level) {
    let output = this;
    if (output.objects[objInd]) {
      let drawObject = output.objects[objInd];
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
          output.objects[objInd + 1] = drawObject;
          break;
        } case -1: {
          output.objects[objInd] = output.objects[objInd - 1];
          output.objects[objInd - 1] = drawObject;
          break;
        }
      }
    return output;
  };

  bg.copyOject = function(objInd) {
    let output = this;
    if (output.objects[objInd]) {
      let obj = output.objects[objInd];
      output.objects.push(obj);
    }
    return output;
  };

  bg.moveObject = function(objInd, x, y) {
    let output = this;
    if (output.objects[objInd]) {
      let obj = output.objects[objInd];
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

  bg.deleteObject = function(objInd) {
    var output = this;
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

function toRectangle(area) {
  rect = this;
  rect.type = 'rectangle';
  rect.border = {
    top: {height: 0, rep: 1},
    left: {width: 0, rep: 1},
    bottom: {height: 0, rep: 1},
    right: {width: 0, rep: 1}
  };

  rect.resize = function(selection) {
    let outerSelection = selection;
    let minWidth = this.border.top.height + this.border.bottom.height;
    let minHeight = this.border.left.width + this.border.right.width;
    if (selection.xmax - selection.xmin <= minWidth) {
      outerSelection.xmax = selection.xmin + minWidth;
    }
    if (selection.ymax - selection.ymin <= minHeight) {
      outerSelection.ymax = selection.ymin + minHeight;
    }
    let output = subArea(this, outerSelection);
    
  };

  rect.borderRegion(x, y) {
    let selection = this.selectAll();
    let left = selection.xmin + this.border.left.width;
    let right = selection.xmax - this.border.right.width;
    let top = selection.ymin + this.border.top.height;
    let bottom = selection.ymax - this.border.bottom.height;
    let region = '';
    if this.contains(x, y) {
      if (y < top) {
        region += 'top';
      } else if (y > bottom) {
        region += 'bottom';
      }
      if (x < left) {
        region += 'left';
      } else if (x > right) {
        region += 'right';
      }
    }
    return region;
  }

  return rect;
}

function rectangleInit(selection) {
  return toRectangle(areaInit(selection));
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
}
