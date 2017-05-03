class DrawingArea {

  constructor(width, height, content) {
    this.id = ++numAreas;
    this.children = [];
    this.lines = [];
    this.parentId = 0;
    this.index = 0;
    this.offset = {left: 0; top: 0};
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

  addChild(offsetLeft, offsetTop, input) {
    var child = input;
    child.parent = this;
    child.offset = {left: offsetLeft, top: offsetTop};
    this.children.push(child);
    if (parentId) {

    }
    return child;
  }

  indexOf(child) {
    var index = -1;
    for (var i = 0; i < this.children.length; i++) {
      if (child == this.children[i]) {
        index = i;
      }
    }
    return index;
  }

  removeChild(input) {
    var index = this.indexOf(input);
    if (index < 0) {
      return false;
    } else {
      var child = this.children[index];
      child.parent = false;
      child.offset = {left: 0, top: 0};
      for (var i = index; i < this.children.length - 1; i++) {
        this.children[i] = this.children[i + 1];
      }
      this.children.pop();
      return child;
    }
  }

  move(x, y) {
    if (this.parent) {
      return this.parent.moveChild(this, x, y);
    } else {
      return false;
    }
  }

  moveChild(input, x, y) {
    var index = this.indexOf(input);
    if (index < 0) {
      return false;
    } else {
      var child = this.children[index];
      child.offset.left += x;
      child.offset.top += y;
      this.children[index] = child;
      return child;
    }
  }

  overWrite(string, x, y) {
    var written = "";
    var i = x;
    var j = y;
    var numChars = 0;
    if (i >= this.width) {
      return "";
    }
    if (j >= this.height) {
      return "";
    }
    while (j < this.height) {
      while (i < this.width) {
        this.lines[j][i] = string[numChars];
        written += string[numChars];
        numChars++;
        if (written === string) {

        }
        i++;
      }
      i = 0;
      j++;
    }
    return written;
  }

}

var da = new DrawingArea(3, 3);
console.log(da.lines);
console.log(da.width);
