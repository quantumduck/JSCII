'use strict';

var numAreas = 0;

var mode = {
  overwrite: 0,
  insert: 1,
  select: 2,
  move: 3,
  resize: 4,
  box: 5,
  line: 6,
  arrow: 7,
  freeform: 8
}

var currentMode = mode.overwrite;

function drawingAreaInit(width, height) {
  let content = contentInit(width, height);
  return {
    type: background,
    lines: content,
    width: content[0].length,
    height: content.length,
    border: false,
    fill: false,
    objects: [],

    contains: function(x, y) {
      return (
        (x >= 0) &&
        (y >= 0) &&
        (x < this.width) &&
        (y < this.height)
      );
    },

    getObjectIndex: function(x, y) {
      let index = this.objects.length - 1;
      while (index >= 0) {
        if (this.objects[index].contains(x, y)) {
          if (this.objects[index].visible(x, y)) {
            return index;
          }
        }
        index --;
      }
      return -1;
    },

    reorderObject: function(objInd, level) {
      let output = this;
      if (output.objects[objInd]) {
        let drawObject = output.objects[objInd];
        switch (level) {
          case 'bottom': {
            for (let i = objInd; i > 0; i--) {
              output = output.reorderObject(i, -1);
            }
          }
          case 'top': {
            for (let i = objInd; i < output.objects.length - 1; i++) {
              output = output.reorderObject(i, 1);
            }
          } case 1: {
            output.objects[objInd] = output.objects[objInd + 1];
            output.objects[objInd + 1] = drawObject;
          } case -1: {
            output.objects[objInd] = output.objects[objInd - 1];
            output.objects[objInd - 1] = drawObject;
          }

        }
      return output;
    },

    copyOject(objInd) {
      let output = this;
      if (output.objects[objInd]) {
        let obj = output.objects[objInd];
        output.objects.push(obj);
      }
      return output;
    },

    moveObject: function(objInd, x, y) {
      let output = this;
      if (output.objects[objInd]) {
        let obj = output.objects[objInd];
        obj = obj.move(x, y);
        output.objects[objInd] = obj;
      }
      return output;
    },

    mergeObject: function(objInd) {
      let output = this;
      let obj = output.objects[objInd]
      if (obj) {
        let top = obj.offset.top;
        let left = obj.offset.left;
        output.deleteObject(objInd);
        for (let j = 0; j < obj.height; j++) {
          for (let i = 0; i < obj.width; i++) {
            if (this.contains(left + i, top + j)) {
              this.lines[top + j][left + i] = obj.lines[j][i];
            }
          }
        }
      }
      return output;
    },

    deleteObject: function(objInd) {
      var output = this;
      if (output.objects[objInd]) {
        output = output.reorderObject(objInd, 'top');
        output.objects.pop();
      }
      return output;
    },

  };
}
