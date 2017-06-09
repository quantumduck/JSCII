'use strict';

function interior(area, border) {
  var selection = area.selectAll();
  if (area.border) {
    selection.xmin += area.border.left.width;
    selection.ymin += area.border.top.height;
    selection.xmax -= area.border.right.width;
    selection.ymax -= area.border.bottom.height;
    return subArea(area, selection);
  } else {
    return area;
  }
}

function corner(area, edgeV, edgeH) {
  var selection = selectAll(area);
  var bor = area.border
  if (bor) {
    if ((bor[edgeH].width > 0) && (bor[edgeV].height > 0)) {
      if (edgeH === 'left') {
        selection.xmax = selection.xmin + bor.left.width - 1;
      } else if (edgeH === 'right') {
        selection.xmin = selection.xmax - bor.right.width;
      }
      if (edgeV === 'top') {
        selection.ymax = selection.ymin + bor.top.height - 1;
      } else if (edgeV === 'bottom') {
        selection.ymin = selection.ymax - bor.bottom.height;
      }
      return subArea(area, selection);
    }
  }
  return false;
}

function setCorner(area, edgeV, edgeH, pattern) {;
  var output = corner(area, edgeV, edgeH);
  if (output) {
    output.lines = pattern;
    output = mergeAreas(area, output);
    output.border = area.border;
    return output;
  } else {
    return area;
  }
}

function borderPattern(area, edge) {
  var selection = selectAll(area);
  if (area.border) {
    var bor = area.border;
    if (bor[edge].width > 0) {
      switch (edge) {
        case 'left':
        selection.ymin += bor.top.height;
        selection.ymax = selection.ymin + bor.left.rep;
        selection.xmax = selection.xmin + bor.left.width - 1;
        break;
        case 'right':
        selection.ymin += bor.top.height;
        selection.ymax = selection.ymin + bor.right.rep;
        selection.xmin = selection.xmax - bor.right.width;
        break;
        case 'top':
        selection.xmin += bor.left.width;
        selection.xmax = selection.xmin + bor.top.rep;
        selection.ymax = selection.ymin + bor.top.height - 1;
        break;
        case 'bottom':
        selection.xmin += bor.left.width;
        selection.xmax = selection.xmin + bor.bottom.rep;
        selection.ymin = selection.ymax - bor.bottom.height;
        break;
      }
      return subArea(area, selection).lines;
    }
  }
  return false;
}

function setBorders(area, topPattern, leftPattern, bottomPattern, rightPattern) {
  var output = interior(area);
  var selection = selectAll(output);
  var borders = {};
  var borderData = {};
  if (!leftPattern) {
    leftPattern = topPattern;
  }
  if (!rightPattern) {
    rightPattern = leftPattern;
  }
  if (!bottomPattern) {
    bottomPattern = topPattern;
  }
  if (topPattern.length > 0) {
    selection.ymax = selection.ymin - 1;
    selection.ymin -= topPattern.length;
    if (leftPattern[0] && leftPattern[0].length > 0) {
      selection.xmin -= leftPattern[0].length;
    }
    if (rightPattern[0] && rightPattern[0].length > 0) {
      selection.xmax += rightPattern[0].length;
    }
    borders.top = areaInit(selection);
    borders.top.lines = contentFill(
      borders.top.width,
      borders.top.height,
      topPattern
    );
    output = mergeAreas(output, borders.top);
    borderData.top = {height: topPattern.length, rep: topPattern[0].length};
  } else {
    borderData.top = {height: 0, rep: 1};
  }
  if (bottomPattern.length > 0) {
    selection.ymin = selection.ymax + 1;
    selection.ymax += bottomPattern.length;
    if (leftPattern[0] && leftPattern[0].length > 0) {
      selection.xmin -= leftPattern[0].length;
    }
    if (rightPattern[0] && rightPattern[0].length > 0) {
      selection.xmax += rightPattern[0].length;
    }
    borders.bottom = areaInit(selection);
    borders.bottom.lines = contentFill(
      borders.bottom.width,
      borders.bottom.height,
      topPattern
    );
    output = mergeAreas(output, borders.bottom);
    borderData.bottom = {height: bottomPattern.length, rep: bottomPattern[0].length};
  } else {
    borderData.bottom = {height: 0, rep: 1};
  }
  if (leftPattern.length > 0) {
    selection.xmax = selection.xmin - 1;
    selection.xmin -= leftPattern.length;
    borders.left = areaInit(selection);
    borders.left.lines = contentFill(
      borders.left.width,
      borders.left.height,
      leftPattern
    );
    output = mergeAreas(output, borders.left);
    borderData.left = {height: leftPattern.length, rep: leftPattern[0].length};
  } else {
    borderData.left = {height: 0, rep: 1};
  }
  if (rightPattern.length > 0) {
    selection.xmin = selection.xmax + 1;
    selection.xmax += rightPattern.length;
    borders.right = areaInit(selection);
    borders.right.lines = contentFill(
      borders.right.width,
      borders.right.height,
      rightPattern
    );
    output = mergeAreas(output, borders.right);
    borderData.right = {height: bottomPattern.right, rep: rightPattern[0].length};
  } else {
    borderData.right = {height: 0, rep: 1};
  }
  output.border = borderData;
  return output;
}

function borderResize(area, selection) {
  var output = subArea(area.interior(), selection);
  var corners = [
    {v: 'top', h:'left', cor: corner(area, 'top', 'left')},
    {v: 'top', h:'right', cor: corner(area, 'top', 'right')},
    {v: 'bottom', h:'right', cor: corner(area, 'bottom', 'right')},
    {v: 'bottom', h:'left', cor: corner(area, 'bottom', 'left')}
  ];
  var edges = {
    top: borderPattern(area, 'top'),
    left: borderPattern(area, 'left'),
    right: borderPattern(area, 'right'),
    bottom: borderPattern(area, 'bottom')
  };
  // Note: settng border expands the area.
  output = setBorders(output, edges.top, edges.left, edges.bottom, edges.right);
  for (var i = 0; i < corners.length; i++) {
    if (corners[i].cor) {
      output = setCorner(output, corners[i].v, corners[i].h, corners[i].cor.lines);
    }
  }
  return output;
}
