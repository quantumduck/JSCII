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





function defaultBorder(left, top, bottom, right) {

}



// I'm going to try a functional apprach:
// Having children of children is unnecessary complication.
// Only the root area will have children.
function rectangleInit(selection) {
  let rect = areaInit(selection);
  rect.type = 'rectangle';
  rect.offset = {left: selection.xmin, top: selection.ymin},



    resize: function(newWidth, newHeight) {
      let output = this;
      if (newWidth < 0) {
        output = resizeLeft(output, -newWidth);
      } else {
        output = resizeRight(output, newWidth);
      }
      if (newHeight < 0) {
        output = resizeTop(output, -newHeight);
      } else {
        output = resizeBottom(output, newHeight);
      }
    }

    addBorder: function(type, pattern) {
      let output = this;
    }

  };
}

function textBoxInit(selection, content) {
  let output = rectangleInit(selection);
  output.type = 'textbox';
}


resizeTop: function(drawObject, newHeight) {
  let output = drawObject;
  output.offset.top += (output.height - newHeight);
  if (this.height > newHeight) {
    for (var j = 0; j < (output.height - newHeight); i++) {
      output.lines.shift();
    }
  } else {
    var line = '';
    for (var i = 0; i < output.width; i++) {
      line += ' ';
    }
    for (var j = 0; j < (newHeight - output.height); j++) {
      output.lines = [line].concat(output.lines);
    }
  }
  output.height = newHeight;
},


resizeLeft: function(newWidth) {
  for (let j = 0; j < this.height; j++) {
    if (this.width > newWidth) {
      this.lines[j] = this.lines[j].substring((this.width - newWidth), this.width);
    } else {
      for (let i = 0; i < (newWdith - this.width); i++) {
        this.lines[j] = ' ' + this.lines[j];
      }
    }
  }
  this.width = newWidth;
},












toTextBox: function() {
  let textBox = textBoxInit(this);
  for (let y = this.ymin; y <= this.ymax; y++) {
    for (let x = this.xmin; x <= this.xmax; x++) {
      textBox.lines[y][x] =
    }
  }
}


writeChar(char, x, y) {
  let output = this;
  let j = y - output.offset.top;
  let i = x - output.offset.left;
  let line = output.lines[j];
  output.lines[j] = (
    line.substring(0, i) +
    char +
    line.substring(i + 1, line.length
  );
  return output;
}

writeChar(char, x, y) {
  let output = this;
  let j = y - output.offset.top;
  let i = x - output.offset.left;
  let line = output.lines[j];
  output.lines[j] = (
    line.substring(0, i) +
    char +
    line.substring(i + 1, line.length
  );
  return output;
}

borderCharAt: function(x, y) {
  let area = this.selectAll();
  let region = borderRegion(x, y);
  let border = this.border[region];
  let numReps = border.length;
  switch (region) {
    case 'topleft':
      return border[area.ymin - y - 1][area.xmin - x - 1];
    case 'bottomleft':
      return border[y - area.ymax - 1][area.xmin - x - 1];
    case 'left':
      return border[(y - ymin) % numReps][area.xmin - x - 1];
    case 'right':
      return border[(y - ymin) % numReps][area.xmax - x - 1];
    case 'topright':
      return border[area.ymin - y - 1][area.xmax - x - 1];
    case 'bottomright':
      return border[y - area.ymax - 1][area.xmax - x - 1];
    case 'top':
      return border[(x - xmin) % numReps][area.ymin - y - 1];
    case 'bottom':
      return border[(x - xmin) % numReps][y - area.ymax - 1];
    default:
      return false;
  }
},

borderRegion: function(x, y) {
  let area = this.selectAll();
  let region = '';
  if (y < area.ymin) {
    region += 'top';
  } else if (y > area.ymax) {
    region += 'bottom';
  }
  if (x < area.xmin) {
    region += 'left';
  } else if (x > area.xmax) {
    region += 'right';
  }
  return region;
}
