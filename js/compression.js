// Command defs: C: command, x: data, n: hex
// Lx: line def; Rn: Copy of line; Sx: string def; In: insert string n;
// Xn: byte n in hex; Un: unicode n in hex; Tn: repeat n times (char or string);
// Wn: whitespace n times; N: blank line; QC: escape C;

var uri_reserved = "!*'();:@&=+$,/?#[]";

/*
drawing?content=hello+world
drawing?S1=hello%S2=world&content=S1+S2


*/

var compressedText = {
  strings: [],
  lines: []
};


function findRepeatedStrings(input, len) {
  var content = input;
  var length = len;
  var strings = [];
  var repeatedStrings = [];
  for (var i = 0; i < (content.length - length + 1); i++) {
    var string = content.substring(i, i + length)
    if (string.indexOf('\n') >= 0) {
      // skip.
    } else {
      strings.push({value: string, times: 1});
      for (var j = 0; j < strings.length - 1; j++) {
        if (strings[j].value === string) {
          strings[j].times += 1;
          break;
        }
      }
    }
  }
  for (var k = 0; k < strings.length; k++) {
    if (strings[k].times > 1) {
      repeatedStrings.push(strings[k].value);
    }
  }
  return repeatedStrings;
}

function deleteStrings(input, removeStrings) {
  var output = "";
  var strings = removeStrings;
  var indices = [0];
  var length = strings[0].length;
  for (var i = 0; i < strings.length; i++) {
    var limit = input.length - length;
    for (var j = 0; j <= limit; j++) {
      if (input.substring(j, j + length) === strings[i]) {
        indices.push(j);
        indices.push(j + length);
      }
    }
  }
  indices.sort(function(a,b) { return a - b;});
  for (var i = 1; i < indices.length; i += 2) {
    output += input.substring(indices[i - 1], indices[i]);
    output += '\n';
  }
  output += input.substring(indices[indices.length - 1], input.length);
  return output;
}

function indexRepeats(input) {

}



// Find repeated lines

// Find repeated strings >= 4 chars

function compress(input) {
  var output = "";
  var trimmed = input;
  var leftovers = "";
  var lines = [];
  var maxLength = input[0].length - 2;
  var strings = [];
  if (typeof(input) === 'string') {
    // Convert it to an array
  }
  // Delete leading and trailing blank lines:
  trimmed = stripBlankLines(trimmed);
  // Delete leading and trailing spaces.
  trimmed = stripSpaces(trimmed);
  // Look for repeated lines:
  // for (var i = 0; i < trimmed.length; )
  leftovers = trimmed.join('\n');
  for (var i = maxLength; i >= 2; i--) {
    var repeats = findRepeatedStrings(leftovers, i);
    console.log(repeats);
    if (repeats.length > 0) {
      strings.concat(repeats);
      leftovers = deleteStrings(leftovers, repeats);
    }
  }


  return [output, trimmed, strings, leftovers];
}

function buildStringDefs(strings) {
  var output = "";
  for (var i = 0; i < strings.length; i++) {
    var string = strings[i];
    output += 'S';
    var repeat = 0;
    var previous = false;
    for (var j = 0; j < string.length; j++) {
      if (repeat) {
        if (char === previous) {
          repeat++;
        } else {
          output += repeat;
          repeat = 0;
        }
      } else {
        var next = processChar(char);
        switch (next) {
          case 'T':
            repeat = true;
            break;
          case 'W':
            repeat = true;
            break;
          default:
            output += next;
        }
      }
    }
  }
}


function processChar(char, previous, repeat) {
  var output = "";
  switch (char) {
    case previous:
      if (previous != ' ') {
        output += 'T';
      }
      break;
    case '\n':
      break;
    case ' ':
      output += 'W';
      repeat = 1;
      break;
    case 'I':
    case 'L':
    case 'N':
    case 'Q':
    case 'R':
    case 'S':
    case 'T':
    case 'U':
    case 'W':
    case 'X':
      output += 'Q';
    default:
      output += char;
  }
  return [output, previous, repeat];
}

function stripBlankLines(array) {
  var output = array;
  // Delete leading blank lines
  var line = array[0];
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
