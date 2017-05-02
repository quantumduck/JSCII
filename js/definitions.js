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

// DEPRECIATED SYNTAX! To be repaced by a class.
var drawingArea = {
  lines: [""],
  width: function() {
    return this.lines[0].length;
  },
  height: function() {
    return this.lines.length;
  }
};

// I'm going to try a functional apprach:
// Having children of children is unnecessary complication.
// Only the root area will have children.
function rootAreaInit(width, height) {
  var content = [];
  for (var y = 0; y < height; y++) {
    content.push("");
    for (var x = 0; x < width; x++) {
      content[y] += " ";
    }
  }
  return {
    lines: content,
    width: content[0].length,
    height: content.length,
    offset: {left: 0, top: 0},
    children: [],
    root: true,
    visible: true,
    opaque: false,

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

    contains: function(point) {
      return (
        (point.x >= this.offset.left) &&
        (point.y >= this.offset.top) &&
        (point.x < this.offset.left + this.width) &&
        (point.y < this.offset.top + this.height)
      );
    },

    selectAll: function() {
      return {
        x: 0,
        y: 0,
        xmin: 0,
        xmax: (this.width - 1),
        ymin: 0,
        ymax: (this.height - 1)
      };
    },

    charAt(x, y) {
      return this.lines[y - this.offset.top][x - this.offset.left];
    },

    visible(x, y) {
      if (this.visible) {
        if (this.opaque) {
          return true;
        }
        if (charAt(x, y) === ' ') {
          return false;
        } else {
          return true
        }
      } else {
        return false;
      }
    },

    move: function(x, y) {
      var output = this;
      if (output.root) {
        output = addArea(this.selectAll);
        return output.moveChild(output.children.length - 1, x, y);
      } else {
        output.offset.left += x;
        output.offset.top += y;
        return output;
      }
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

    raiseChild: function(childIndex, level) {
      var output = this;
      if (output.children[childIndex]) {
        var child = output.children[childIndex];
        switch (level) {
          case 'bottom': {
            for (var i = childIndex; i > 0; i--) {
              output = output.raiseChild(i, -1);
            }
          }
          case 'top': {
            for (var i = childIndex; i < output.children.length - 1; i++) {
              output = output.raiseChild(i, 1);
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

    getChildIndex(x, y) {
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

function select(point1, point2) {
  var selection = {
    x: point1.x,
    y: point1.y,
    xmin: point1.x,
    xmax: point1.x,
    ymin: point1.y,
    ymax: point1.y
  };
  if (point2) {
    selection.xmin = Math.min(point1.x, point2.x);
    selection.xmax = Math.max(point1.x, point2.x);
    selection.ymin = Math.min(point1.y, point2.y);
    selection.ymax = Math.max(point1.y, point2.y);
  }
  return selection;
}

function newChild(parent, selection) {
  var output = parent;
  var childContent = [];
  var indices = parent.indices;


  index = output.children.push(child);

}

// This is where the ASCII data is stored:
// There are two helper functions for getting the width and height.
class DrawingArea {

  constructor(width, height, content) {
    this.id = ++numAreas;
    this.children = [];
    this.lines = [];
    this.parentId = 0;
    this.index = 0;
    this.offset = {left: 0; top: 0};
    for (var y = 0; y < height; y++) {
      this.lines.push("");
      for (var x = 0; x < width; x++) {
        if (content && content[y] && content[y][x]) {
          this.lines[y] += content[y][x];
        } else {
          this.lines[y] += " ";
        }
      }
    }
  }

  get height() {
    return this.lines.length;
  }

  get width() {
    return this.lines[0].length;
  }

  addChild(offsetLeft, offsetTop, input) {
    var child = input;
    child.parent = this;
    child.offset = {left: offsetLeft, top: offsetTop};
    this.children.push(child);
    if (parentId) {

    }
    return child;
  }

  indexOf(child) {
    var index = -1;
    for (var i = 0; i < this.children.length; i++) {
      if (child == this.children[i]) {
        index = i;
      }
    }
    return index;
  }

  removeChild(input) {
    var index = this.indexOf(input);
    if (index < 0) {
      return false;
    } else {
      var child = this.children[index];
      child.parent = false;
      child.offset = {left: 0, top: 0};
      for (var i = index; i < this.children.length - 1; i++) {
        this.children[i] = this.children[i + 1];
      }
      this.children.pop();
      return child;
    }
  }

  move(x, y) {
    if (this.parent) {
      return this.parent.moveChild(this, x, y);
    } else {
      return false;
    }
  }

  moveChild(input, x, y) {
    var index = this.indexOf(input);
    if (index < 0) {
      return false;
    } else {
      var child = this.children[index];
      child.offset.left += x;
      child.offset.top += y;
      this.children[index] = child;
      return child;
    }
  }

  overWrite(string, x, y) {
    var written = "";
    var i = x;
    var j = y;
    var numChars = 0;
    if (i >= this.width) {
      return "";
    }
    if (j >= this.height) {
      return "";
    }
    while (j < this.height) {
      while (i < this.width) {
        this.lines[j][i] = string[numChars];
        written += string[numChars];
        numChars++;
        if (written === string) {

        }
        i++;
      }
      i = 0;
      j++;
    }
    return written;
  }

}

var da = new DrawingArea(3, 3);
console.log(da.lines);
console.log(da.width);
