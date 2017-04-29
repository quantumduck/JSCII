var mode = {
  text: 0,
  box: 1,
  line: 2,
  arrow: 3,
  freeform: 4
}

var currentMode = mode.text;

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
