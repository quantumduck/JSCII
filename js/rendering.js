// This is called to setup the drawing area and fill it with blanks:
function drawingAreaReset(x, y) {
  drawingArea.lines = [];
  for (var j = 0; j < y; j++) {
    var line = [];
    for (var i = 0; i < x; i++) {
      line += ' ';
    }
    drawingArea.lines.push(line);
  }
  redraw();
  // console.log(drawingArea)
}

// The redraw function must be called after every change to ensure
// the new version is loaded into the browser.
function redraw() {
  var newHTML = ""; // will contain the html content of the div
  for (var y = 0; y < drawingArea.height(); y++) {
    for (var x = 0; x < drawingArea.width(); x++) {
      var selectionTags = selection.getTags(x, y);
      // Iterate through the drawing area:

      // Handle selected areas with <span> tags:
      if (selectionTags) {
        newHTML += selectionTags[0];
      }
      var char = drawingArea.lines[y][x];
      // Escape HTML characters:
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
          // This ensures spaces are rendered
          newHTML += '&nbsp;';
        break;
        default:
          newHTML += char;
        break;
      }
      // Put in the closing tags if present
      if (selectionTags) {
        newHTML += selectionTags[1];
      }
    }
    // Put line breaks on all but the last one.
    if (y < drawingArea.height() - 1) {
      newHTML += '<br>';
    }
  }
  // Insert the new HTML code into the DOM
  $('#drawing-area').html(newHTML);
  // This line ensures getOffset works correctly.
  $('body').css('max-width', $('#drawing-container').css('width'));
}


// Get offset of drawing-area in pixels
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

// Convert coordinates from pixels into chacater indices.
function getXY(rawX, rawY) {
  var width = numFromPixels($('#drawing-area').css('width'));
  var height =  numFromPixels($('#drawing-area').css('height'));
  var offset = getOffset();
  var x = Math.floor((drawingArea.width() * (rawX - offset.left)) / width);
  var y = Math.floor((drawingArea.height() * (rawY - offset.top)) / height);
  return {x: x, y: y};
}

// Helper function for type conversion
function numFromPixels(string) {
  // Assuming string in the form '0px' => 0
  return Number(string.substring(0, string.indexOf('px')));
}

// overwrite the character at the specified x and y indices.
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

function emptySquares() {
  var results = [];
  for (var i = 0; i < drawingArea.width(); i++) {
    for (var j = 0; j < drawingArea.height(); j++) {
      if (charAt(i, j) === ' ') {
        results.push({x: i, y: j});
      }
    }
  }
  return results;
}
