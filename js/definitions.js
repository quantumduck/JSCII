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
    traceBack: [],
    claimed: false,

    newChild: function(selection) {
      // assume a valid selection.
      var output = this;
      var child = this;
      var childContent = [];
      var index = output.children.length;
      for (var y = selection.ymin; y <= selection.ymax; y++) {
        childContent.push('');
        var blankLine = '';
        for (var x = selection.xmin; x <= selection.xmax; x++) {
          childContent[y - selection.ymin][x - selection.xmin] += output.lines[y][x];
          blankLine += '';
        }
        output.lines[y] = blankLine;
      }
      child.line = childContent;
      child.width = child.lines[0].length;
      child.height = child.lines.length;
      child.offset = {left: selection.xmin, top: selection.ymin};
      child.children = [];
      child.claimed = true;
      child.traceBack.push(index);
      output.children.push(child);
      return output;
    },



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
