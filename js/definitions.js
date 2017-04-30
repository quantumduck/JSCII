'use strict';

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

// This is where the ASCII data is stored:
// There are two helper functions for getting the width and height.
class DrawingArea {

  constructor(width, height, content) {
    this.children = [];
    this.lines = [];
    this.parent = false;
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


}

var da = new DrawingArea(3, 3);
console.log(da.lines);
console.log(da.width);
