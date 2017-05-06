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

function defaultBorder(left, top, bottom, right) {

}

function contentFill(width, height, pattern) {
  let content = [];
  if (pattern) {
    let xlen = pattern[0].length;
    let ylen = pattern.length;
    for (let y = 0; y < height; y++) {
      content.push('');
      for (let x = 0; x < width; x++) {
        content[y] += pattern[y % ylen][x % xlen];
      }
    }
  } else {
    for (let y = 0; y < height; y++) {
      content.push('');
      for (let x = 0; x < width; x++) {
        content[y] += ' ';
      }
    }
  }
  return content;
}

// I'm going to try a functional apprach:
// Having children of children is unnecessary complication.
// Only the root area will have children.
function rectangleInit(selection) {
  let width = (selection.xmax - selection.xmin + 1);
  let height = (selection.ymax - selection.ymin + 1);
  let content = contentFill(width, height);
  return {
    type: "rectangle"
    lines: content,
    width: content[0].length,
    height: content.length,
    offset: {left: selection.xmin, top: selection.ymin},
    visible: true,
    opaque: false,
    border: {left: false, top: false, bottom: false, right: false},
    fill: false,

    selectAll: function() {
      return {
        x: this.offset.left,
        y: this.offset.top,
        xmin: this.offset.left,
        ymin: this.offset.top,
        xmax: this.offset.left + this.width - 1,
        ymax: this.offset.top + this.height - 1
      };
    },

    contains: function(x, y) {
      let area = this.selectAll();
      
    },

    selectAll: function() {
      return {
        x: this.offset.left,
        y: this.offset.top,
        xmin: this.offset.left,
        xmax: (this.offset.left + this.width - 1),
        ymin: this.offset.top,
        ymax: (this.offset.top + this.height - 1)
      };
    },

    charAt: function(x, y) {
      return this.lines[y - this.offset.top][x - this.offset.left];
    },


    visible: function(x, y) {
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

    visiblePoints: function() {
      let points = [];
      let area = this.selectAll();
      for (let y = area.ymin; y <= area.ymax; y++) {
        for (let x = area.xmin; x <= area.xmax; x++) {
          if (this.visible(x, y)) {
            points.push({x: x, y: y});
          }
        }
      }
      return points;
    },

    move: function(x, y) {
      let output = this;
      output.offset.left += x;
      output.offset.top += y;
      return output;
    },

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
