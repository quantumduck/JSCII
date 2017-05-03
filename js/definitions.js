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

    contains: function(x, y) {
      return (
        (x >= this.offset.left) &&
        (y >= this.offset.top) &&
        (x < this.offset.left + this.width) &&
        (y < this.offset.top + this.height)
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
        } else if (charAt(x, y) === ' ') {
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

    resizeTop: function(newHeight) {
      this.offset.top += (this.height - newHeight);
      if (this.height > newHeight) {
        for (var j = 0; j < (this.height - newHeight); i++) {
          this.lines.shift();
        }
      } else {
        var line = '';
        for (var i = 0; i < this.width; i++) {
          line += ' ';
        }
        for (var j = 0; j < (newHeight - this.height); j++) {
          this.lines = [line].concat(this.lines);
        }
      }
      this.height = newHeight;
    },

    resizeBottom: function(newHeight) {
      if (this.height > newHeight) {
        for (var j = 0; j < (this.height - newHeight); i++) {
          this.lines.pop();
        }
      } else {
        var line = '';
        for (var i = 0; i < this.width; i++) {
          line += ' ';
        }
        for (var j = 0; j < (newHeight - this.height); j++) {
          this.lines.push(line);
        }
      }
      this.height = newHeight;
    },

    resizeLeft: function(newWidth) {
      for (var j = 0; j < this.height; j++) {
        if (this.width > newWidth) {
          this.lines[j] = this.lines[j].substring((this.width - newWidth), this.width);
        } else {
          for (var i = 0; i < (newWdith - this.width); i++) {
            this.lines[j] = ' ' + this.lines[j];
          }
        }
      }
      this.width = newWidth;
    },

    resizeRight: function(newWidth) {
      for (var j = 0; j < this.height; j++) {
        if (this.width > newWidth) {
          this.lines[j] = this.lines[j].substring(0, newWidth);
        } else {
          for (var i = 0; i < (newWdith - this.width); i++) {
            this.lines[j] += ' ';
          }
        }
      }
      this.width = newWidth;
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
