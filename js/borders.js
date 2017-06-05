'use strict';

function rectangleInit(selection) {
  return toRectangle(areaInit(selection));
}

function toRectangle(area) {
  var rect = area;
  rect.type = 'box';
  rect.border = {
    top: {height: 0, rep: 1},
    left: {width: 0, rep: 1},
    bottom: {height: 0, rep: 1},
    right: {width: 0, rep: 1}
  };
  rect.corner = function(edgeV, edgeH) {
    return corner(this, edgeV, edgeH);
  };
  rect.borderPattern = function(edge) {
    return borderPattern(this, edge);
  };
  rect.interior = function() {
    return interior(this);
  }
  return rect;
}

function interior(rect) {
  var selection = rect.selectAll();
  selection.xmin += rect.border.left.width;
  selection.ymin += rect.border.top.height;
  selection.xmax -= rect.border.right.width;
  selection.ymax -= rect.border.bottom.height;
  return subArea(area, selection);
}

function corner(rect, edgeV, edgeH) {
  var selection = selectAll(rect);
  var bor = rect.border
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
      return subArea(rect, selection);
    }
  }
  return false;
}

function setCorner(rect, edgeV, edgeH, pattern) {
  var output = rect;
  var corner = corner(rect, edgeV, edgeH);
  corner.lines = pattern;
  output.lines = mergeAreas(output, corner).lines;
  return output;
}

function borderPattern(rect, edge) {
  var selection = selectAll(rect);
  if (rect.border) {
    var bor = rect.border;
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
      return subArea(rect, selection).lines;
    }
  }
  return false;
}

function setBorder(rect, edge, pattern) {
  var output = rect;
  var borderData = {};
  if (pattern) {
    var selection = selectAll(rect);
    switch (edge) {
      case 'top': {
        selection.ymax = selection.ymin + pattern.length - 1;
        borderData.height = pattern.length;
        borderData.rep = pattern[0].length;
        break;
      }
      case 'bottom': {
        selection.ymin = selection.ymax - pattern.length;
        borderData.height = pattern.length;
        borderData.rep = pattern[0].length;
        break;
      }
      case 'left': {
        selection.xmax = selection.xmin + pattern[0].length - 1;
        borderData.width = pattern[0].length;
        borderData.rep = pattern.length;
        break;
      }
      case 'right': {
        selection.xmin = selection.xmax - pattern[0].length;
        borderData.width = pattern[0].length;
        borderData.rep = pattern.length;
        break;
      }
    }
    var border = subArea(rect, selection);
    border.lines = contentFill(border.width, border.height, pattern);
    border.opaque = true;
    output.lines = mergeAreas(border, rect).lines;
    output.border[edge] = borderData;
    return output;
  } else {
    switch (edge) {
      case 'top':
      case 'bottom': {
        borderData = {height: 0, rep: 1};
        break;
      }
      case 'left':
      case 'right': {
        borderData = {width: 0, rep: 1};
        break;
      }
    }
    output.border[edge] = borderData;
    return output;
  }
}

function borderResize(rect, selection) {
  var output = toRectangle(subArea(rect.interior(), selection));
  var corners = [
    {v: 'top', h:'left', cor: corner(rect, 'top', 'left')},
    {v: 'top', h:'right', cor: corner(rect, 'top', 'right')},
    {v: 'bottom', h:'right', cor: corner(rect, 'bottom', 'right')},
    {v: 'bottom', h:'left', cor: corner(rect, 'bottom', 'left')}
  ];
  var edges = [
    {edge: 'top', pat: borderPattern(rect, 'top')},
    {edge: 'left', pat: borderPattern(rect, 'left')},
    {edge: 'right', pat: borderPattern(rect, 'right')},
    {edge: 'bottom', pat: borderPattern(rect, 'bottom')}
  ];
  // Note: settng border expands the area.
  for (var i = 0; i < edges.length; i++) {
    if (edges[i].pat) {
      output = setBorder(output, edges[i].edge, edges[i].pat);
    }
  }
  for (var i = 0; i < corners.length; i++) {
    if (corners[i].cor) {
      output = setCorner(output, corners[i].v, corners[i].h, corners[i].cor.lines);
    }
  }
  return output;
}
