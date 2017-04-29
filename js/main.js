var drawingArea = {
  lines: ["Hello",
          "World"],
  width: 5,
  height: 2
};

var selection = {
  x: 0,
  y: 0,
  xmin: 0,
  xmax: 10,
  ymin: 0,
  ymax: 5,
  set: function(x, y, n, m) {
    this.x = x;
    this.y = y;
    this.xmin = x;
    this.ymin = y;
    if (n > 1) {
      this.xmax = x + n - 1;
    } else {
      this.xmax = x;
    }
    if (m > 1) {
      this.ymax = y + m - 1;
    } else {
      this.ymax = y;
    }
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
      return {x: drawingArea.width - 1, y: drawingArea.height - 1};
    } else {
      return {x: this.xmax, y: this.ymax}
    }
  },
  setToNext: function() {
    if (this.size() === 1) {
      if (this.x < drawingArea.width - 1) {
        this.set(this.x + 1, this.y);
      } else if (this.y < drawingArea.height - 1) {
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
    }
  }
}

var cursor = {x: 0, y: 0};
var mode = {
  text: 0,
  box: 1,
  line: 2,
  arrow: 3,
  freeform: 4
}

var currentMode = mode.text;

var xStart = 1;
var xSkip = 4;
var yStart = 0;
var ySkip = 2;
var gridSize = 3;
var userChar = 'X';
var aiChar = 'O';
var turnNum = 0;

function drawingAreaReset(x, y) {
  drawingArea.lines = [];
  for (var j = 0; j < y; j++) {
    var line = [];
    for (var i = 0; i < x; i++) {
      line += ' ';
    }
    drawingArea.lines.push(line);
  }
  drawingArea.width = x;
  drawingArea.height = y;
  redraw();
  // console.log(drawingArea)
}

function anyOtherIndex(blackList, total) {
  for (i = 0; i < total; i++) {
    if (blackList.indexOf(i) === -1) {
      return i;
    }
  }
  return -1;
}

function emptySquares() {
  var results = [];
  for (var i = 0; i < drawingArea.width; i++) {
    for (var j = 0; j < drawingArea.height; j++) {
      if (charAt(i, j) === ' ') {
        results.push({x: i, y: j});
      }
    }
  }
  return results;
}

function redraw() {
  var newHTML = "";
  for (var y = 0; y < drawingArea.height; y++) {
    for (var x = 0; x < drawingArea.width; x++) {
      if ((y >= selection.ymin) && (y <= selection.ymax)) {
        if (x === selection.xmin) {
          newHTML += '<span class="selected">';
        }
      }
      var char = drawingArea.lines[y][x];
      switch (char) {
        case '&':
          newHTML += '&amp;';
        break;
        case '<':
          newHTML += '&lt;';
        break;
        case '>':
          newHTML+= '&gt;';
        break;
        case ' ':
          newHTML += '&nbsp;';
        break;
        default:
          newHTML += char;
        break;
      }
      if ((y >= selection.ymin) && (y <= selection.ymax)) {
        if (x === selection.xmax) {
          newHTML += '</span>';
        }
      }
    }
    if (y < drawingArea.height - 1) {
      newHTML += '<br>';
    }
  }
  // console.log(html)
  $('#drawing-area').html(newHTML);
  $('body').css('max-width', $('#drawing-container').css('width'));
}

function getOffset() {
  var height =  numFromPixels($('#drawing-area').css('height'));
  var offsetTop = (
    numFromPixels($('body').css('margin-top')) +
    numFromPixels($('h1').css('margin-top')) +
    numFromPixels($('h1').css('height')) +
    Math.max(
      numFromPixels($('h1').css('margin-bottom')),
      numFromPixels($('.messages').css('margin-top'))
    ) +
    numFromPixels($('.messages').css('height')) +
    numFromPixels($('.messages').css('margin-bottom')) +
    numFromPixels($('#drawing-container').css('padding-top')) +
    numFromPixels($('#drawing-container').css('border-top'))
  );
  var width = numFromPixels($('#drawing-area').css('width'));
  var offsetLeft = (
    numFromPixels($('body').css('margin-left')) +
    numFromPixels($('#drawing-container').css('padding-left')) +
    numFromPixels($('#drawing-container').css('border-left'))
  );
  return {left: offsetLeft, top: offsetTop};
}

function getXY(rawX, rawY) {
  var width = numFromPixels($('#drawing-area').css('width'));
  var height =  numFromPixels($('#drawing-area').css('height'));
  var offset = getOffset();
  var x = Math.floor((drawingArea.width * (rawX - offset.left)) / width);
  var y = Math.floor((drawingArea.height * (rawY - offset.top)) / height);
  return {x: x, y: y};
}

function numFromPixels(string) {
  // Assuming string in the form '0px' => 0
  return Number(string.substring(0, string.indexOf('px')));
}

function addChar(char, x, y) {
  var line = drawingArea.lines[y];
  if (
    // Do not insert control characters.
    (char.length != 1) ||
    (char.codePointAt(0) < 32) ||
    ((char.codePointAt(0) >= 127) && (char.codePointAt(0) <= 159))
  ) {
    return false;
  }
  line = line.substring(0, x) + char + line.substring(x + 1, line.length);
  drawingArea.lines[y] = line;
  redraw();
  return char;
}

function charAt(x, y) {
  return drawingArea.lines[y][x];
}

function addRandomChar() {
  var slots = emptySquares();
  var slot;
  var char;
  if (slots.length) {
    slot = slots(Math.floor(Math.random() * slots.length));
    char = String.fromCodePoint(32 + Math.floor(Math.random() * 95));
    return addChar(char, slot.x, slot.y);
  } else {
    return false;
  }
}


$(function() {
  drawingAreaReset(54, 31);
  $('#drawing-area').on('click', function(e) {
    var location = getXY(e.clientX, e.clientY);
    selection.set(location.x, location.y);
    redraw();
  });
  $(window).on('keyup', function(e) {
    console.log(e.key);
    if (addChar(e.key, selection.x, selection.y)) {;
      selection.setToNext();
    }
    // } else {
    //   switch (e.key) {
    //     case "Enter":
    //       if (selection.ymin < drawingArea.height - 1) {
    //         selection.ymin++;
    //         selection.xmin = 0;
    //       }
    //   }
    // }
  });
});
