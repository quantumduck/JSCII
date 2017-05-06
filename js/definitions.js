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

    reorderChild: function(childIndex, level) {
      var output = this;
      if (output.children[childIndex]) {
        var child = output.children[childIndex];
        switch (level) {
          case 'bottom': {
            for (var i = childIndex; i > 0; i--) {
              output = output.reorderChild(i, -1);
            }
          }
          case 'top': {
            for (var i = childIndex; i < output.children.length - 1; i++) {
              output = output.reorderChild(i, 1);
            }
          } case 1: {
            output.children[childIndex] = output.children[childIndex + 1];
            output.children[childIndex + 1] = child;
          } case -1: {
            output.children[childIndex] = output.children[childIndex - 1];
            output.children[childIndex - 1] = child;
          }
          return output;
        }
      } else {
        return output;
      }
    },

    newArea: function(selection) {
      // assume a valid selection.
      var output = this;
      var child = this;
      var childContent = [];
      for (var y = selection.ymin; y <= selection.ymax; y++) {
        childContent.push('');
        var blankLine = '';
        for (var x = selection.xmin; x <= selection.xmax; x++) {
          childContent[y - selection.ymin] += output.lines[y][x];
          blankLine += ' ';
        }
        output.lines[y] = blankLine;
      }
      child.lines = childContent;
      child.width = child.lines[0].length;
      child.height = child.lines.length;
      child.offset = {left: selection.xmin, top: selection.ymin};
      child.children = [];
      child.root = false;
      output.children.push(child);
      return output;
    },

    moveChild: function(childIndex, x, y) {
      var output = this;
      if (output.children[childIndex]) {
        var child = output.children[childIndex];
        child = child.move(x, y);
        output.children[childIndex] = child;
        return output;
      } else {
        return output;
      }
    },


    mergeChild: function(childIndex) {
      var output = this;
      var child = output.children[childIndex]
      var top = child.offset.top;
      var left = child.offset.left;
      if (child) {
        output.deleteChild(childIndex);
        for (var j = 0; j < child.height; j++) {
          for (var i = 0; i < child.width; i++) {
            if (this.contains(left + i, top + j)) {
              this.lines[top + j][left + i] = child.lines[j][i];
            }
          }
        }
      }
      return output;
    },

    deleteChild: function(childIndex) {
      var output = this;
      if (output.children[childIndex]) {
        output = output.reorderChild(childIndex, 'top');
        output.children.pop();
      }
      return output;
    },

    getChildIndex: function(x, y) {
      var index = this.children.length - 1;
      while (index >= 0) {
        if (this.children[index].contains(x, y)) {
          if (this.children[index].visible(x, y)) {
            return index;
          }
        }
        index --;
      }
      return -1;
    }



  };
}




mergeChild: function(childIndex) {
  var output = this;
  var child = output.children[childIndex]
  var top = child.offset.top;
  var left = child.offset.left;
  if (child) {
    output.deleteChild(childIndex);
    for (var j = 0; j < child.height; j++) {
      for (var i = 0; i < child.width; i++) {
        if (this.contains(left + i, top + j)) {
          this.lines[top + j][left + i] = child.lines[j][i];
        }
      }
    }
  }
  return output;
},

deleteChild: function(childIndex) {
  var output = this;
  if (output.children[childIndex]) {
    output = output.reorderChild(childIndex, 'top');
    output.children.pop();
  }
  return output;
},

getChildIndex: function(x, y) {
  var index = this.children.length - 1;
  while (index >= 0) {
    if (this.children[index].contains(x, y)) {
      if (this.children[index].visible(x, y)) {
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
  var child = this;
  var childContent = [];
  for (var y = selection.ymin; y <= selection.ymax; y++) {
    childContent.push('');
    var blankLine = '';
    for (var x = selection.xmin; x <= selection.xmax; x++) {
      childContent[y - selection.ymin] += output.lines[y][x];
      blankLine += ' ';
    }
    output.lines[y] = blankLine;
  }
  child.lines = childContent;
  child.width = child.lines[0].length;
  child.height = child.lines.length;
  child.offset = {left: selection.xmin, top: selection.ymin};
  child.children = [];
  child.root = false;
  output.children.push(child);
  return output;
},

moveChild: function(childIndex, x, y) {
  var output = this;
  if (output.children[childIndex]) {
    var child = output.children[childIndex];
    child = child.move(x, y);
    output.children[childIndex] = child;
    return output;
  } else {
    return output;
  }
},




reorderChild: function(childIndex, level) {
  var output = this;
  if (output.children[childIndex]) {
    var child = output.children[childIndex];
    switch (level) {
      case 'bottom': {
        for (var i = childIndex; i > 0; i--) {
          output = output.reorderChild(i, -1);
        }
      }
      case 'top': {
        for (var i = childIndex; i < output.children.length - 1; i++) {
          output = output.reorderChild(i, 1);
        }
      } case 1: {
        output.children[childIndex] = output.children[childIndex + 1];
        output.children[childIndex + 1] = child;
      } case -1: {
        output.children[childIndex] = output.children[childIndex - 1];
        output.children[childIndex - 1] = child;
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
