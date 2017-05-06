
function defaultBorder(left, top, bottom, right) {

}



// I'm going to try a functional apprach:
// Having children of children is unnecessary complication.
// Only the root area will have children.
function rectangleInit(selection) {
  let rect = areaInit(selection);
  rect.type = 'rectangle';
  rect.offset = {left: selection.xmin, top: selection.ymin},

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
