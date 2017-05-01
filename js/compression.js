// Command defs: C: command, x: data, n: hex
// Lx: line def; Rn: Copy of line; Sx: string def; In: insert string n;
// Xn: byte n in hex; Un: unicode n in hex; Tn: repeat n times (char or string);
// Wn: whitespace n times; N: blank line; QC: escape C;


var compressedText = {
  strings: [],
  lines: []
};

function findRepeatedStrings(input, len) {
  var content = input.join('\n');
  var length = n
  var strings = [];
  var repeatedStrings = [];
  for (var j = 0; j <= (content.length - length); j++) {
    var string = content.substring(j, j + length);
    if (string.indexOf('\n') >= 0) {
      // skip.
    } else {
      for (var k = 0; k < strings.length; k++) {
        if (string === strings[k].value) {
          strings[k].times++;
        } else {
          strings.push({ value: string, times: 1 });
        }
      }
    }
  }
  for (var k = 0; k < strings.length; k++) {
    if (strings[k].times > 1) {
      repeatedStrings.push(strings[k].value);
    }
  }
  return repatedStrings;
}

function deleteStrings(input, removeStrings) {
  var output = input;
  var strings = removeStrings;
  var indices = [];
  var length - strings[0].length;
  for (var i = 0; i < strings.length; i++) {
    var limit = output.length - length;
    for (var j = 0; j <= limit; j++) {
      if (output.substring(j, j + length) === strings[i]) {
        indices.push(j);
      }
    }
  }
  indices.sort();
  for (var i = 0; i < indices.length; i++) {
    
  }
}
// Find repeated lines

// Find repeated strings >= 4 chars

function compress(input) {
  var output;
  var trimmed = input;
  var lines = [];
  if (typeof(input) === 'string') {
    // Convert it to an array
  }
  // Delete leading and trailing blank lines:
  trimmed = stripBlankLines(trimmed);
  // Delete leading and trailing spaces.
  trimmed = stripSpaces(trimmed);
  // Look for repeated lines:
  // for (var i = 0; i < trimmed.length; )
  return trimmed;
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

// Tests

var testArray = ["            ",
                 "  Hello     ",
                 "    World   ",
                 "            ",
                 "            "];
console.log(compress(testArray));
