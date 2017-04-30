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

// This is where the ASCII data is stored:
// There are two helper functions for getting the width and height.
var drawingArea = {
  lines: [""],
  width: function() {
    return this.lines[0].length;
  },
  height: function() {
    return this.lines.length;
  }
};

class DrawingArea {
  constructor(width, height, content) {
    this.children = [];
    this.lines = [];
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
}

var da = new DrawingArea(3, 3);
console.log(da.lines);
console.log(da.width);
