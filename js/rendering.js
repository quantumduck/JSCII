// The redraw function must be called after every change to ensure// the new version is loaded into the browser.function redraw(rootarea, selection) {  $('#drawing-area').html(getHTML(rootarea, selection));  // This line ensures getOffset() works correctly.  $('body').css('max-width', $('#drawing-container').css('width'));}function getHTML(rootarea, selection) {  // Generate the HTML for rendering an area with a given selection  var newHTML = ""; // will contain the html content of the div  for (var y = 0; y < rootarea.height; y++) {    for (var x = 0; x < rootarea.width; x++) {      var classname = false;      var char = rootarea.visibleCharAt(x, y);      // If a selection is provided, assign a class name:      if (selection) {        classname = selection.getLocationClass(x, y);        var area = rootarea.subAreas[selection.index];        if (area && area.visibleAt(x, y)) {          // If area is selected, all its contents are visible          char = area.contentAt(x, y);        }      }      // Iterate through the drawing area:      // Handle selected areas with <span> tags:      if (x === 0 && classname) {        newHTML += '<span class="' + classname + '">';      } else if (classname && selection.getLocationClass(x - 1, y) != classname) {        newHTML += '</span><span class="' + classname + '">';      }      // Escape HTML characters:      switch (char) {        case '&':          newHTML += '&amp;';        break;        case '<':          newHTML += '&lt;';        break;        case '>':          newHTML+= '&gt;';        break;        case ' ':          // This ensures spaces are rendered          newHTML += '&nbsp;';        break;        default:          newHTML += char;        break;      }      // Put in the closing tags if present      if (classname && x === rootarea.width - 1) {        newHTML += '</span>';      } else if (classname && selection.getLocationClass(x + 1, y) != classname) {        newHTML += '</span>';      }    }    // Put line breaks on all but the last one.    if (y < rootarea.height - 1) {      newHTML += '<br>';    }  }  return newHTML;}// Get offset of drawing-area in pixelsfunction getOffset() {  var height =  numFromPixels($('#drawing-area').css('height'));  var offsetTop = (    numFromPixels($('body').css('margin-top')) +    numFromPixels($('h1').css('margin-top')) +    numFromPixels($('h1').css('height')) +    Math.max(      numFromPixels($('h1').css('margin-bottom')),      numFromPixels($('.messages').css('margin-top'))    ) +    numFromPixels($('.messages').css('height')) +    numFromPixels($('.messages').css('margin-bottom')) +    numFromPixels($('#drawing-container').css('padding-top')) +    numFromPixels($('#drawing-container').css('border-top'))  );  var width = numFromPixels($('#drawing-area').css('width'));  var offsetLeft = (    numFromPixels($('body').css('margin-left')) +    numFromPixels($('#drawing-container').css('padding-left')) +    numFromPixels($('#drawing-container').css('border-left'))  );  return {left: offsetLeft, top: offsetTop};}// Convert coordinates from pixels into chacater indices.function getXY(rawX, rawY, area) {  var width = numFromPixels($('#drawing-area').css('width'));  var height =  numFromPixels($('#drawing-area').css('height'));  var offset = getOffset();  var x = Math.floor((area.width * (rawX - offset.left)) / width);  var y = Math.floor((area.height * (rawY - offset.top)) / height);  return {x: x, y: y};}// Helper function for type conversionfunction numFromPixels(string) {  // Assuming string in the form '0px' => 0  return Number(string.substring(0, string.indexOf('px')));}// overwrite the character at the specified x and y indices.function safeChar(char) {  if (    // Do not insert control characters or special key names    (char.length != 1) ||    (char.charCodeAt(0) < 32) ||    ((char.charCodeAt(0) >= 127) && (char.charCodeAt(0) <= 159))  ) {    return false;  }  return char;}function drawArea(rootarea, index, start, point, end) {  if ((start.x === point.x) && (start.y === point.y) &&      (end.x === point.x) && (end.y === point.y)) {    // Start a new selection    return newSelection(root.area, point);  } else {    // Resize current selection    var newPoint = getXY(e.pageX, e.pageY, root.width, root.height);    if (      newPoint.x != root.endPoint.x ||      newPoint.y != root.endPoint.y    ) {      root.endPoint = newPoint;      // console.log(root.endPoint);      if (        root.startPoint.x === root.endPoint.x &&        root.startPoint.y === root.endPoint.y      ) {        // Make a new one-point selection        root.area = clearEmptySelections(root.area);        root.selection = newSelection(root.area, root.startPoint);      } else {        // Make a new two-point or box selection        root.area = clearEmptySelections(root.area);        root.selection = newSelection(root.area, root.startPoint, root.endPoint);        root.area = addSubArea(root.area, areaInit(root.selection));        console.log(root.selection);        redraw(root);      }    }  }}function updateArea(rootarea, selection, start, end) {  var area = rootarea.subAreas[selection.index];  var newSelection = selection;  var dx = end.x - start.x;  var dy = end.y - start.y;  switch (selection.getLocationClass(start.x, start.y)) {    case "selected":      area.offset.top += dy;      area.offset.left += dx;      newSelection.x += dx;      newSelection.y += dy;      break;    case "top-left":      if (selection.xmax - selection.xmin - dx > 0) {        newSelection.xmin += dx;      }    case "top-edge":      if (selection.ymax - selection.ymin - dy > 0) {        newSelection.ymin += dy;      }      break;    case "bottom-left":      if (selection.ymax + dy - selection.ymin > 0) {        newSelection.ymax += dy;      }    case "left-edge":      if (selection.xmax - selection.xmin - dx > 0) {        newSelection.xmin += dx;      }      break;    case "bottom-right":      if (selection.xmax + dx - selection.xmin > 0) {        newSelection.xmax += dx;      }    case "bottom-edge":      if (selection.ymax + dy - selection.ymin > 0) {        newSelection.ymax += dy;      }      break;    case "top-right":      if (selection.ymax - selection.ymin - dy > 0) {        newSelection.ymin += dy;      }    case "right-edge":      if (selection.xmax + dx - selection.xmin > 0) {        newSelection.xmax += dx;      }      break;    default:      break;  }  switch (area.type) {    case "text":      area = subArea(area, newSelection);      break;    case "box":      area = borderResize(area, newSelection);  }}