
function deselect() {
  return {
    size: 0
  }
}

function select(rootarea, point1, point2) {
  var xmin = point1.x;
  var xmax = point1.x;
  var ymin = point1.y;
  var ymax = point1.y;
  var size = 1;
  var childIndex = rootarea.getChildIndex(x,y);

  if (point2) {
    xmin = Math.min(point1.x, point2.x);
    xmax = Math.max(point1.x, point2.x);
    ymin = Math.min(point1.y, point2.y);
    ymax = Math.max(point1.y, point2.y);
    size = (ymax - ymin + 1) * (xmax - xmin + 1);
  }

  return {
    x: point1.x,
    y: point1.y,
    xmin: xmin,
    xmax: xmax,
    ymin: ymin,
    ymax: ymax,
    size: size,
    childIndex: childIndex

    next: function(rootarea) {
      var area = rootarea;
      var firstx = 0
      var firsty = 0
      var lastx = rootarea.width - 1;
      var lasty = rootarea.height - 1;
      if (childIndex >= 0) {
        area = rootarea.children[childIndex];
        firstx = area.offset.left;
        firsty = area.offset.top;
        lastx = area.offset.left + area.width - 1;
        lasty = area.offset.top + area.height - 1;
      }
      if (this.size === 0) {
        return this;
      } else if (this.size === 1) {
        if (this.x < lastx) {
          return select(rootarea, {x: this.x + 1, y: this.y});
        } else if (this.y < lasty) {
          return select(rootarea, {x: , y: this.y});
        }

      } else {
        var output = this;
        if (output.x < output.xmax) {
          output.x++;
        } else if (output.y < output.ymax) {
          output.x = output.xmin;
          output.y++;
        } else {
          output.x = output.xmin;
          output.y++;
          output.ymax++;
        }
        return output;
      }
    },

    nextLine: function() {
      if (this.size === 1) {
        return select({x: 0, y: this.y + 1});
      } else {
        if (this.y < this.ymax) {
          this.x = 0;
          this.y++;
        } else {
          this.x = 0;
          this.y = 0;
        }
      }
    },
    getTags: function(x, y) {
      if (this.size() === 1) {
        // one character selected.
        if ((x === this.x) && (y === this.y)) {
           return ['<span class="selected">', '</span>'];
        } else {
          return false;
        }
      } else {
        // Many characters selected
        if ((y >= this.ymin) && (y <= this.ymax)) {
          var tags = ["", ""];
          if (x === this.xmin) {
            tags[0] = '<span class="selected">';
          }
          if ((x === this.x) && (y === this.y)) {
            // The x and y coordinates of the selection get
            // different formatting
            tags[0] += '</span><span class="selected-inner">';
            tags[1] = '</span><span class="selected">';
          }
          if (x === this.xmax) {
            tags[1] += '</span>';
          }
          return tags;
        } else {
          return false;
        }
      }
    }
  };
}




// This large object keeps track of the state of the selected area.
// The selected area is a rectange, as well as a set of coordinates
// somewhere within the rectangle.
var selection = {
  x: 0,
  y: 0,
  xmin: 0,
  xmax: 10,
  ymin: 0,
  ymax: 5,
  set: function(x, y, diffX, diffY) {
    this.x = x;
    this.y = y;
    if (diffX > 0) {
      this.xmax = x + diffX;
      this.xmin = x;
    } else if (diffX < 0) {
      this.xmax = x;
      this.xmin = x + diffX;
    } else {
      this.xmax = x;
      this.xmin = x;
    }
    if (diffY > 0) {
      this.ymax = y + diffY;
      this.ymin = y;
    } else if (diffY < 0) {
      this.ymax = y;
      this.ymin = y + diffY;
    } else {
      this.ymax = y;
      this.ymin = y;
    }
    redraw();
    return this;
  },

}
