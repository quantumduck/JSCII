function compress(input) {
  var output;
  var leadingSpaces = [true, true];
  var trailingSpaces = [true, true];
  if (typeof(input) === 'string') {
    // Convert it to an array
  }
  // Delete leading and trailing blank lines:
  output = stripBlankLines(input);
  // Delete leading spaces:
  if (output[0][0] === ' ') { // Necessary in case of 1xn array
    while (leadingSpaces[0]) {
      for (var i = 0; i < output.length; i++) {
        if (output[i][0] != ' ') {
          leadingSpaces[0] = false;
        }
        if (output[i][1] != ' '
      }
      if (leadingSpaces) {
        for (var i = 0; i < output.length; i++) {
          if (output[i][0] != ' ') {
            leadingSpaces = false;
          }
        }
      }
    }
  }
  return output;
}

function stripBlankLines(input) {
  var output = input;
  // Delete leading blank lines
  var line = output[0];
  while (isBlank(line)) {
    if (output.length > 1) {
      output.shift();
      line = output[0];
    } else {
      return [];
    }
  }
  // Delete trailing blank lines:
  line = output[output.length];
  while (isBlank(line)) {
    if (output.length > 1) {
      output.pop();
      line = output[0];
    } else {
      return [];
    }
  }
  return output;
}

function isBlank(line) {
  for (var i = 0; i < line.length; i++) {
    if (line[i] != ' ') {
      return false;
    }
  }
  return true;
}

function stripLeadingSpaces(input) {
  var leadingSpaces = [true, true];
  var trailingSpaces = [true, true];
  var last = output[0].length - 1;
  // Assume output does not start with a blank line.
  if (output[0][0] === ' ') {
    while (leadingSpaces[0]) {
      for (var i = 0; i < output.length; i++) {
        if (output[i][0] != ' ') {
          leadingSpaces[0] = false;
        }
        if (output[i][1] != ' '
      }
      if (leadingSpaces) {
        for (var i = 0; i < output.length; i++) {
          if (output[i][0] != ' ') {
            leadingSpaces = false;
          }
        }
      }
    }
  } // else { /* there are no leading spaces. */ }
  if (output[0][last] === ' ') { // Necessary in case of 1xn array
    while (leadingSpaces[0]) {
      for (var i = 0; i < output.length; i++) {
        if (output[i][last] != ' ') {
          leadingSpaces[0] = false;
        }
        if (output[i][1] != ' '
      }
      if (leadingSpaces) {
        for (var i = 0; i < output.length; i++) {
          if (output[i][0] != ' ') {
            leadingSpaces = false;
          }
        }
      }
    }
  } // else { /* there are no leading spaces. */ }
}
