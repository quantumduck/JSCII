function compress(input) {
  var output = input;
  if (typeof(input) === 'string') {
    // Convert it to an array
  }
  // Delete leading and trailing blank lines:
  output = stripBlankLines(output);
  // Delete leading and trailing spaces.
  output = stripSpaces(output);
  return output;
}

function stripBlankLines(array) {
  var output = array;
  // Delete leading blank lines
  var line = array[0];
  console.log(line);
  while (isBlank(line)) {
    if (output.length > 1) {
      output.shift();
      line = output[0];
    } else {
      return [];
    }
  }
  // Delete trailing blank lines:
  line = output[output.length - 1];
  while (isBlank(line)) {
    if (output.length > 1) {
      output.pop();
      line = output[output.length - 1];
    } else {
      return [];
    }
  }
  return output;
}

function isBlank(line) {
  var length = line.length
  for (var i = 0; i < length; i++) {
    if (line[i] != ' ') {
      return false;
    }
  }
  return true;
}

function stripSpaces(input) {
  var output = input;
  var leadingSpaces = true;
  var trailingSpaces =  true;
  var last = input[0].length - 1;
  var newStart = 0;
  var newEnd = last + 1;

  // Assume output does not start with a blank line.
  if (output[0].length > 1) {
    while (leadingSpaces || trailingSpaces) {
      // Scan for non space characters at beginning or end of string:
      for (var i = 0; i < output.length; i++) {
        if (output[i][0] != ' ') {
          leadingSpaces = false;
        }
        if (output[i][last] != ' ') {
          trailingSpaces = false;
        }
      }
      // If there were any, delete them:
      if (leadingSpaces || trailingSpaces) {
        // Set the boundaries of the new string:
        if (leadingSpaces) {
          newStart = 1;
        } else {
          newStart = 0;
        }
        if (trailingSpaces) {
          newEnd = output[0].length - 1;
        } else {
          newStart = output[0].length;
        }
        // Delete the spaces:
        for (var i = 0; i < output.length; i++) {
          output[i] = output[i].substring(newStart, newEnd);
        }
        last = output[0].length - 1;
      }
    }
  } // else { /* there are no leading spaces. */ }
  return output;
}

var testArray = ["            ",
                 "  Hello     ",
                 "    World   ",
                 "            ",
                 "            "];
console.log(compress(testArray));
