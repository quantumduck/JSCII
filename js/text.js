function writeChar(area, string, x, y) {
  var output = copyArea(area);
  var j = y - output.offset.top;
  var i = x - output.offset.left;
  var line = output.lines[j];
  output.lines[j] = (
    line.substring(0, i) +
    string[0] +
    line.substring(i + 1, line.length)
  );
  return output;
}

function insertChar(area, string, x, y, direction) {
  var output = copyArea(area);
  var selection = area.selectAll()
  var i = x - area.offset.left;
  var j = y - area.offset.top;
  switch(direction) {
    case "left":
      var line = area.lines[j];
      if ((line[0] != ' ') || (i === 0)) {
        selection.xmin--;
        output = areaInit(selection);
        output = mergeAreas(output, area);
        line = output.lines[j];
        i++;
      }
      output.lines[j] = line.substring(1,i + 1) + string[0] + line.substring(i + 1, line.length);
      break;
    case "up":
      if ((area.lines[0][i] != ' ') || (j === 0)) {
        selection.ymin--;
        output = areaInit(selection);
        output = mergeAreas(output, area);
        j++;
      }
      for (var k = 0; k < j; k++) {
        output = writeChar(output, output.lines[k+1][i], x, y - j + k);
      }
      output = writeChar(output, string, x, y);
      break;
    case "down":
      if ((area.lines[area.height - 1][i] != ' ') || (j === area.height - 1)) {
        selection.ymax++;
        output = areaInit(selection);
        output = mergeAreas(output, area);
      }
      for (var k = output.height - 1; k > j; k--) {
        output = writeChar(output, output.lines[k-1][i], x, y - j + k);
      }
      output = writeChar(output, string, x, y);
      break;
    default:
      var line = area.lines[j];
      if ((line[0] != ' ') || (i === line.length - 1)) {
        selection.xmax++;
        output = areaInit(selection);
        output = mergeAreas(output, area);
        line = output.lines[j];
      }
      output.lines[j] = line.substring(0,i) + string[0] + line.substring(i, line.length - 1);
      break;
  }
  return output;
}


function writeChar(area, string, x, y) {
  var output = copyArea(area);
  var j = y - output.offset.top;
  var i = x - output.offset.left;
  var line = output.lines[j];
  output.lines[j] = (
    line.substring(0, i) +
    string[0] +
    line.substring(i + 1, line.length)
  );
  return output;
}

function insertNewLine(area, string, x, y, direction) {
  var output = copyArea(area);
  var selection = area.selectAll()
  switch(direction) {
    case "left":

      break;
    case "up":

      break;
    case "right":

      break;
    default:
      var line = area.lines[j];
    
      break;
  }
  return output;
}
