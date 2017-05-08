'use strict';

function toRectangle(area) {
  let rect = area;
  rect.type = 'rectangle';
  rect.border = {
    top: {height: 0, rep: 1},
    left: {width: 0, rep: 1},
    bottom: {height: 0, rep: 1},
    right: {width: 0, rep: 1}
  };
  rect.corner = function(edgeV, edgeH) {
    return corner(this, edgeV, edgeH);
  };
  rect.setCorner = function(edgeV, edgeH, pattern) {
    return setCorner(this, edgeV, edgeH, pattern);
  };
  rect.borderPattern = function(edge) {
    return borderPattern(this, edge);
  };
  rect.setBorder = function(edge, pattern) {
    return setBorder(this, edge, pattern);
  };
  rect.resize = function(selection) {
    return borderResize(this, selection);
  };
  return rect;
}

function rectangleInit(selection) {
  return toRectangle(areaInit(selection));
}


function corner(rect, edgeV, edgeH) {
  let selection = selectAll(rect);
  let bor = rect.border
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
  if (!pattern) {
    return rect;
  }
  if (
    pattern.length === rect.lines.length &&
    pattern[0].length === rect.lines[0].length
  ) {
    let output = rect;
    let corner = corner(rect, edgeV, edgeH);
    corner.lines = pattern;
    output.lines = mergeAreas(corner, output).lines;
    return output;
  }
  return rect;
}

function borderPattern(rect, edge) {
  let selection = selectAll(rect);
  if (rect.border) {
    let bor = rect.border;
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
  let output = rect;
  let borderData = {};
  if (pattern) {
    let selection = selectAll(rect);
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
    let border = subArea(rect, selection);
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
  let outerSelection = selection;
  let output = rect;
  let minHeight = rect.border.top.height + rect.border.bottom.height;
  let minWidth = rect.border.left.width + rect.border.right.width;
  let corners = [
    {v: 'top', h:'left', pat: corner(rect, 'top', 'left').lines},
    {v: 'top', h:'right', pat: corner(rect, 'top', 'right').lines},
    {v: 'bottom', h:'right', pat: corner(rect, 'bottom', 'right').lines},
    {v: 'bottom', h:'left', pat: corner(rect, 'bottom', 'left').lines}
  ];
  let edges = [
    {edge: 'top', pat: borderPattern(rect, 'top')},
    {edge: 'left', pat: borderPattern(rect, 'left')},
    {edge: 'right', pat: borderPattern(rect, 'right')},
    {edge: 'bottom', pat: borderPattern(rect, 'bottom')}
  ];
  if (selection.xmax - selection.xmin < minWidth) {
    outerSelection.xmax = selection.xmin + minWidth;
  }
  if (selection.ymax - selection.ymin < minHeight) {
    outerSelection.ymax = selection.ymin + minHeight;
  }
  output.lines = subArea(rect, outerSelection).lines;
  output.width = output.lines[0].length;
  output.height = output.lines.length;
  output.offset = {left: outerSelection.xmin, top: outerSelection.ymin};
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].pat) {
      output = setBorder(output, edges[i].edge, edges[i].pat);
    }
  }
  for (let i = 0; i < corners.length; i++) {
    if (corners[i].cor) {
      output = output.setCorner(corners[i].cor.lines, corners[i].v, corners[i].h);
    }
  }
  return output;
}
