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
    let newSelection = selection;
    let minWidth = this.border.top.height + this.border.bottom.height;
    let minHeight = this.border.left.width + this.border.right.width;
    let topleft = this.corner('top', 'left');
    let topright = this.corner('top', 'right');
    let bottomleft = this.corner('bottom', 'left');
    let bottomright = this.corner('bottom', 'right');
    if (selection.xmax - selection.xmin <= minWidth) {
      newSelection.xmax = selection.xmin + minWidth;
    }
    if (selection.ymax - selection.ymin <= minHeight) {
      newSelection.ymax = selection.ymin + minHeight;
    }
    let output = subArea(this, newSelection);
    let toplines = contentFill(
      output.width,
      output.height,
      this.side('top').lines
    );
    let bottomlines = contentFill(
      output.width,
      output.height,
      this.side('bottom').lines
    );
  };

  rect.corner = function(edgeV, edgeH) {
    let selection = this.selectAll();
    if ((this.border[edgeH].width > 0) && (this.border[edgeV].height > 0)) {
      if (edgeH === 'left') {
        selection.xmax = selection.xmin + this.border.left.width - 1;
      else if (edgeH === 'right'){
        selection.xmin = selection.xmax - this.border.right.width;
      }
      if (edgeV === 'top') {
        selection.ymax = selection.ymin + this.border.top.height - 1;
      } else if (edgeV === 'bottom') {
        selection.ymin = selection.ymax - this.border.bottom.height;
      }
      return subArea(this, selection);
    }
    return false;
  };

  rect.side = function(edge) {
    let selection = this.selectAll();
    if (this.border[edge].width > 0) {
      switch (edge) {
        case 'left':
        selection.ymin += this.border.top.height;
        selection.ymax = selection.ymin + this.border.left.rep;
        selection.xmax = selection.xmin + this.border.left.width - 1;
        break;
        case 'right':
        selection.ymin += this.border.top.height;
        selection.ymax = selection.ymin + this.border.right.rep;
        selection.xmin = selection.xmax - this.border.right.width;
        break;
        case 'top':
        selection.xmin += this.border.left.width;
        selection.xmax = selection.xmin + this.border.top.rep;
        selection.ymax = selection.ymin + this.border.top.height - 1;
        break;
        case 'bottom':
        selection.xmin += this.border.left.width;
        selection.xmax = selection.xmin + this.border.bottom.rep;
        selection.ymin = selection.ymax - this.border.bottom.height;
        break;
      }
      return subArea(this, selection);
    }
    return false;
  };

  return rect;
}

function rectangleInit(selection) {
  return toRectangle(areaInit(selection));
}
