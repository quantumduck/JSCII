'use strict';

function selectNewArea(rootarea, point1, point2) {
  return {

  }
}


function select(rootarea, point1, point2) {
  let objInd = rootarea.getObjectIndex(point1.x, point1.y);
  let area = rootarea.objects[objInd];
  if (!area) {
    area = rootarea;
  }
  let selection = area.selectAll();
  selection.index = objInd;
  if (objInd < 0) {
    selection.x = point1.x;
    selection.y = point1.y;
  }
  if (point2) {
    selection.xmin = Math.min(point1.x, point2.x);
    selection.xmax = Math.max(point1.x, point2.x);
    selection.ymin = Math.min(point1.y, point2.y);
    selection.ymax = Math.max(point1.y, point2.y);
    selection.index = rootarea.objects.length;
  } else if (area.border) {
    selection.x += area.border.left.width;
    selection.y += area.border.top.height;
    selection.xmin += area.border.left.width;
    selection.ymin += area.border.top.height;
    selection.xmax -= area.border.right.width;
    selection.ymax -= area.border.bottom.height;
  }
  selection.forward = function() {
    return selectNext(this);
  };
  selection.back = function() {
    return selectPrev(selection);
  };
  selection.enter = function() {
    return selectNextLine(this);
  };
  selection.getTags = function(x, y) {
    return getSelectionTags(area, this, x, y);
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

function selectNext(selection) {
  let output = selection;
  if (selection.x < selection.xmax) {
    output.x++;
  } else {
    output = selectNextLine(output);
  }
  return output;
}

function selectNextLine(selection) {
  let output = selection;
  output.x = selection.xmin;
  if (selection.y < selection.ymax) {
    output.y++;
  } else {
    output.y = selection.ymin;
  }
  return output;
}

function selectPrev(selection) {
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

function clearEmptySelections(rootarea) {
  let output = rootarea;
  let topObject = output.objects[output.objects.length - 1];
  while (topObject && topObject.isEmpty()) {
    output.objects.pop();
    topObject = output.objects[output.objects.length - 1];
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
