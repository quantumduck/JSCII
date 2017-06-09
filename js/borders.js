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

function setBorder(area, edge, pattern) {
  var output = area;
  var borderData = {};
  if (pattern) {
    var selection = selectAll(area);
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
    var border = subArea(area, selection);
    border.lines = contentFill(border.width, border.height, pattern);
    border.opaque = true;
    output.lines = mergeAreas(border, area).lines;
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

function borderResize(area, selection) {
  var output = toRectangle(subArea(area.interior(), selection));
  var corners = [
    {v: 'top', h:'left', cor: corner(area, 'top', 'left')},
    {v: 'top', h:'right', cor: corner(area, 'top', 'right')},
    {v: 'bottom', h:'right', cor: corner(area, 'bottom', 'right')},
    {v: 'bottom', h:'left', cor: corner(area, 'bottom', 'left')}
  ];
  var edges = [
    {edge: 'top', pat: borderPattern(area, 'top')},
    {edge: 'left', pat: borderPattern(area, 'left')},
    {edge: 'right', pat: borderPattern(area, 'right')},
    {edge: 'bottom', pat: borderPattern(area, 'bottom')}
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
