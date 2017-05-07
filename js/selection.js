
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
  selection.obj = area;
  if (point2) {
    selection.x = point1.x;
    selection.y = point1.y;
    selection.xmin = Math.min(point1.x, point2.x);
    selection.xmax = Math.max(point1.x, point2.x);
    selection.ymin = Math.min(point1.y, point2.y);
    selection.ymax = Math.max(point1.y, point2.y);
    selection.obj = rootarea;
  } else if (area.border) {
    selection.x += area.border.left.width;
    selection.y += area.border.top.height;
    selection.xmin += area.border.left.width;
    selection.ymin += area.border.top.height;
    selection.xmax -= area.border.right.width;
    selection.ymax -= area.border.bottom.height;
  }
  selection.next = function() {
    return next(this);
  };
  selection.nextLine = function() {
    return nextLine(this);
  };
  selection.getTags = function(x, y) {
    return getSelectionTags(this.obj, this, x, y);
  }
  return selection;
}

function next(selection) {
  let output = selection;
  if (selection.y < selection.ymax) {
    if (selection.x < selection.xmax) {
      output.x++;
    } else {
      output.x = selection.xmin;
      output.y++;
    }
  } else {
    output.x = selection.xmin;
    output.y = selection.ymin;
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
  if (selection.y > selection.ymin) {
    if (selection.x > selection.xmin) {
      output.x--;
    } else {
      output.x = selection.xmax;
      output.y--;
    }
  } else {
    output.x = selection.xmax;
    output.y = selection.ymax;
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
