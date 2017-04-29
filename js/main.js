var drawingArea = {
  lines: [],
  width: 0,
  height: 0
};

var numX = 100;
var numY = 100;
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

// var lines = [];
// var diag1 = [];
// var diag2 = [];
// for (var i = 0; i < gridSize; i++) {
//   var row = [];
//   var col = [];
//   for (var j = 0; j < gridSize; j++) {
//     row.push({x: i, y: j});
//     col.push({x: j, y: i});
//   }
//   lines.push(row);
//   lines.push(col);
//   diag1.push({x: i, y: i});
//   diag2.push({x: i, y: (gridSize - i - 1)});
// }
// lines.push(diag1);
// lines.push(diag2);

function drawingAreaInit(x, y) {
  for (var i = 0; i < x; i++) {
    var line = [];
    for (var j = 0; i < y; j++) {
      line += ' ';
    }
    drawingArea.lines.push(line);
  }
  drawingArea.width = x;
  drawingArea.height = y;
  redraw();
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
  for (var i = 0; i < numX; i++) {
    for (var j = 0; j < numY; j++) {
      if (charAt(i, j) === ' ') {
        results.push({x: i, y: j});
      }
    }
  }
  return results;
}

function redraw() {
  var html = "";
  for (y = 0; y < drawingArea.height; y++) {
    for (x = 0; x < drawingArea.width; x++) {
      var char = drawingArea.lines[y][x];
      switch (char) {
        case '&':
          html += '&amp;';
        break;
        case '<':
          html += '&lt;';
        break;
        case '>':
          html += '&gt;';
        break;
        case ' ':
          html += '&nbsp;';
        break;
        default:
          html += char;
        break;
      }
    }
    if (y < drawingArea.height - 1) {
      html += '<br>';
    }
  }
  $('#drawingArea').html(html);
}

function getX(rawX) {
  var width = numFromPixels($('#drawingArea').css('width'));
  var offset_left = (
    numFromPixels($('body').css('margin-left')) +
    numFromPixels($('#drawing-container').css('padding-left')) +
    numFromPixels($('#drawing-container').css('border-left'))
  );
  var x = Math.floor(drawingArea.width * (rawX - offset_left) / width);
  return x;
}

function getY(rawY) {
  var height =  numFromPixels($('#drawingArea').css('height'));
  var offset_top = (
    numFromPixels($('body').css('margin-top')) +
    numFromPixels($('h1').css('margin-top')) +
    numFromPixels($('h1').css('height')) +
    Math.max(
      numFromPixels($('hl').css('margin-bottom')),
      numFromPixels($('.messages').css('margin-top'))
    ) +
    numFromPixels($('.messages').css('height')) +
    numFromPixels($('.messages').css('margin-bottom')) +
    numFromPixels($('#drawing-container').css('padding-top')) +
    numFromPixels($('#drawing-container').css('border-top'))
  );
  var y = Math.floor(drawingArea.height * (rawY - offset_top) / height);
  return y;
}

function numFromPixels(string) {
  // Assuming string in the form '0px'
  return Number(string.substring(0, string.indexOf('px')));
}

function addChar(char, x, y) {
  var = drawingArea.lines[y];
  if (
    // Do not insert control characters.
    (char.length != 1) ||
    (char.codePoint(0) < 32) ||
    ((char.codePoint(0) >= 127) && (char.codePoint(0) <= 255))
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

  while (charAt(x, y) != ' ') {
    var x = Math.floor(Math.random() * 3);
    var y = Math.floor(Math.random() * 3);
  }
  addChar(aiChar, x, y);
}


$(function() {
    $('body').css('max-width', $('.drawing-container').css('width'));
  // $('body').css('max-width', $('#drawing-background').css('width'));
  // $('body').css('max-width', $('#drawing-area').css('width'));
});
