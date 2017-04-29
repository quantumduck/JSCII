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
  size: function() {
    return (this.ymax - this.ymin + 1) * (this.xmax - this.xmin + 1);
  },
  first: function() {
    if (this.size() === 1) {
      return {x: 0, y: 0};
    } else {
      return {x: this.xmin, y: this.ymin};
    }
  },
  last: function() {
    if (this.size() === 1) {
      return {x: drawingArea.width() - 1, y: drawingArea.height() - 1};
    } else {
      return {x: this.xmax, y: this.ymax}
    }
  },
  setToNext: function() {
    if (this.size() === 1) {
      if (this.x < drawingArea.width() - 1) {
        this.set(this.x + 1, this.y);
      } else if (this.y < drawingArea.height() - 1) {
        this.set(0, this.y + 1);
      } else {
        this.set(0, 0);
      }
    } else {
      if (this.x < this.xmax) {
        this.x++;
      } else if (this.y < this.ymax) {
        this.x = 0;
        this.y++;
      } else {
        this.x = 0;
        this.y = 0;
      }
      redraw();
    }
  },
  setToNextLine: function() {
    if (this.size() === 1) {
      if (this.y < drawingArea.height() - 1) {
        this.set(0, this.y + 1);
      } else {
        this.set(0, 0);
      }
    } else {
      if (this.y < this.ymax) {
        this.x = 0;
        this.y++;
      } else {
        this.x = 0;
        this.y = 0;
      }
    }
    redraw();
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
}
