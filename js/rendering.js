function redraw(rootarea, selection) {
  let timeout = 5;
  // setTimeout(function(rootarea, selection) {
    $('#drawing-area').html(getHTML(rootarea, selection));
    // This line ensures getOffset() works correctly.
    $('body').css('max-width', $('#drawing-container').css('width'));
  // }, timeout);
}

// The redraw function must be called after every change to ensure
// the new version is loaded into the browser.
function getHTML(rootarea, selection) {
  let newHTML = ""; // will contain the html content of the div
  for (let y = 0; y < rootarea.height; y++) {
    for (let x = 0; x < rootarea.width; x++) {
      let selectionTags = ['',''];
      let char = rootarea.visibleCharAt(x, y);
      if (selection) {
        selectionTags = selection.getTags(x, y);
        let area = rootarea.objects[selection.index];
        if (area && area.visibleAt(x, y)) {
          char = area.contentAt(x, y);
        }
      }

      // Iterate through the drawing area:
      // Handle selected areas with <span> tags:
      if (selectionTags[0]) {
        newHTML += selectionTags[0];
      }
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
      if (selectionTags[1]) {
        newHTML += selectionTags[1];
      }
    }
    // Put line breaks on all but the last one.
    if (y < rootarea.height - 1) {
      newHTML += '<br>';
    }
  }
  return newHTML;
}
  // Insert the new HTML code into the DOM
  // $('#drawing-area').html(newHTML);
  // This line ensures getOffset works correctly.
  // $('body').css('max-width', $('#drawing-container').css('width'));



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
function getXY(rawX, rawY, cols, rows) {
  var width = numFromPixels($('#drawing-area').css('width'));
  var height =  numFromPixels($('#drawing-area').css('height'));
  var offset = getOffset();
  var x = Math.floor((cols * (rawX - offset.left)) / width);
  var y = Math.floor((rows * (rawY - offset.top)) / height);
  return {x: x, y: y};
}

// Helper function for type conversion
function numFromPixels(string) {
  // Assuming string in the form '0px' => 0
  return Number(string.substring(0, string.indexOf('px')));
}

// overwrite the character at the specified x and y indices.
function safeChar(char) {
  if (
    // Do not insert control characters.
    (char.length != 1) ||
    (char.charCodeAt(0) < 32) ||
    ((char.charCodeAt(0) >= 127) && (char.charCodeAt(0) <= 159))
  ) {
    return false;
  }
  return char;
}
