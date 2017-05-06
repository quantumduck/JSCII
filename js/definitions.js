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

function drawingAreaInit(width, height) {
  let content = contentInit(width, height);
  return {
    type: background,
    width: content[0].length,
    height: content.length,
    border: false,
    fill: false,
    objects: [],

    getObjectIndex: function(x, y) {
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
    },

    reorderObject: function(objInd, level) {
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
    },

    moveObject: function(objInd, x, y) {
      let output = this;
      if (output.objects[objInd]) {
        let obj = output.objects[objInd];
        obj = obj.move(x, y);
        output.objects[objInd] = obj;
        return output;
      } else {
        return output;
      }
    },

    mergeChild: function(objInd) {
      var output = this;
      var obj = output.objects[objInd]
      var top = obj.offset.top;
      var left = obj.offset.left;
      if (obj) {
        output.deleteChild(objInd);
        for (var j = 0; j < obj.height; j++) {
          for (var i = 0; i < obj.width; i++) {
            if (this.contains(left + i, top + j)) {
              this.lines[top + j][left + i] = obj.lines[j][i];
            }
          }
        }
      }
      return output;
    },

    deleteChild: function(objInd) {
      var output = this;
      if (output.objects[objInd]) {
        output = output.reorderChild(objInd, 'top');
        output.objects.pop();
      }
      return output;
    },





  };
}




mergeChild: function(objInd) {
  var output = this;
  var obj = output.objects[objInd]
  var top = obj.offset.top;
  var left = obj.offset.left;
  if (obj) {
    output.deleteChild(objInd);
    for (var j = 0; j < obj.height; j++) {
      for (var i = 0; i < obj.width; i++) {
        if (this.contains(left + i, top + j)) {
          this.lines[top + j][left + i] = obj.lines[j][i];
        }
      }
    }
  }
  return output;
},

deleteChild: function(objInd) {
  var output = this;
  if (output.objects[objInd]) {
    output = output.reorderChild(objInd, 'top');
    output.objects.pop();
  }
  return output;
},

getobjInd: function(x, y) {
  var index = this.objects.length - 1;
  while (index >= 0) {
    if (this.objects[index].contains(x, y)) {
      if (this.objects[index].visible(x, y)) {
        return index;
      }
    }
    index --;
  }
  return -1;
}





newArea: function(selection) {
  // assume a valid selection.
  var output = this;
  var obj = this;
  var objContent = [];
  for (var y = selection.ymin; y <= selection.ymax; y++) {
    objContent.push('');
    var blankLine = '';
    for (var x = selection.xmin; x <= selection.xmax; x++) {
      objContent[y - selection.ymin] += output.lines[y][x];
      blankLine += ' ';
    }
    output.lines[y] = blankLine;
  }
  obj.lines = objContent;
  obj.width = obj.lines[0].length;
  obj.height = obj.lines.length;
  obj.offset = {left: selection.xmin, top: selection.ymin};
  obj.objects = [];
  obj.root = false;
  output.objects.push(obj);
  return output;
},

moveChild: function(objInd, x, y) {
  var output = this;
  if (output.objects[objInd]) {
    var obj = output.objects[objInd];
    obj = obj.move(x, y);
    output.objects[objInd] = obj;
    return output;
  } else {
    return output;
  }
},




reorderChild: function(objInd, level) {
  var output = this;
  if (output.objects[objInd]) {
    var obj = output.objects[objInd];
    switch (level) {
      case 'bottom': {
        for (var i = objInd; i > 0; i--) {
          output = output.reorderChild(i, -1);
        }
      }
      case 'top': {
        for (var i = objInd; i < output.objects.length - 1; i++) {
          output = output.reorderChild(i, 1);
        }
      } case 1: {
        output.objects[objInd] = output.objects[objInd + 1];
        output.objects[objInd + 1] = obj;
      } case -1: {
        output.objects[objInd] = output.objects[objInd - 1];
        output.objects[objInd - 1] = obj;
      }
      return output;
    }
  } else {
    return output;
  }
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
