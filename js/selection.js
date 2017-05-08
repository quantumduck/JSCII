'use strict';

function deselect() {
  return {
    size: 0
  }
}

function select(rootarea, point1, point2) {
  let objInd = rootarea.getObjectIndex(point1.x, point1.y);
  let area = rootarea.objects[objInd];
  if (!area) {
    area = rootarea;
  }
  let selection = area.selectAll();
  selection.index = objIndex;
  if (point2) {
    selection.x = point1.x;
    selection.y = point1.y;
    selection.xmin = Math.min(point1.x, point2.x);
    selection.xmax = Math.max(point1.x, point2.x);
    selection.ymin = Math.min(point1.y, point2.y);
    selection.ymax = Math.max(point1.y, point2.y);
    selection.new = areaInit(selection);
  } else if (area.border) {
    selection.x += area.border.left.width;
    selection.y += area.border.top.height;
    selection.xmin += area.border.left.width;
    selection.ymin += area.border.top.height;
    selection.xmax -= area.border.right.width;
    selection.ymax -= area.border.bottom.height;
  }
  selection.forward = function() {
    return next(this);
  };
  selection.back = function() {
    return prev(selection);
  }
  selection.enter = function() {
    return nextLine(this);
  };
  selection.getTags = function(x, y) {
    return getSelectionTags(this.obj, this, x, y);
  };
  selection.move = function(direction) {
    let output = this;
    switch (direction) {
      case 'ArrowUp':
      if (this.y === this.ymin) {
        output.y = this.ymax;
      } else {
        output.y--;
      }
      break;
      case 'ArrowDown':
      if (this.y === this.ymax) {
        output.y = this.ymin;
      } else {
        output.y++;
      }
      break;
      case 'ArrowLeft':
      if (this.x === this.xmin) {
        output.x = this.xmax;
      } else {
        output.x--;
      }
      break;
      case 'ArrowRight':
      if (this.x === this.xmax) {
        output.x = this.xmin;
      } else {
        output.x++;
      }
    }
    return output;
  };
  return selection;
}



function next(selection) {
  let output = selection;
  if (selection.x < selection.xmax) {
    output.x++;
  } else {
    output = nextLine(output);
  }
  return output;
}

function nextLine(selection) {
  let output = selection;
  output.x = selection.xmin;
  if (selection.y < selection.ymax) {
    output.y++;
  } else {
    output.y = selection.ymin;
  }
  return output;
}

function prev(selection) {
  let output = selection;
  if (selection.x > selection.xmin) {
    output.x--;
  } else {
    output.x = selection.xmax;
    if (selection.y > selection.ymin) {
      output.y--;
    } else {
      output.y = selection.ymax;
    }
  }
  return output;
}

function getSelectionTags(area, selection, x, y) {
        // Many characters selected
  let tags = ['',''];
  let xmin = selection.xmin;
  let ymin = selection.ymin;
  let xmax = selection.xmax;
  let ymax = selection.ymax;
  if (area.border) {
    xmin -= area.border.left.width;
    ymin -= area.border.top.height;
    xmax += area.border.right.width;
    ymax += area.border.bottom.height;
  }
  if ((y >= ymin) && (y <= ymax)) {
    if (x === xmin) {
      tags[0] = '<span class="selected">';
    }
    if ((x === selection.x) && (y === selection.y)) {
            // The x and y coordinates of the selection get
            // different formatting
      tags[0] += '</span><span class="cursor">';
      tags[1] = '</span><span class="selected">';
    }
    if (x === selection.xmax) {
      tags[1] += '</span>';
    }
  }
  return tags;
}
