/**
 * Created by liu on 16/2/1.
 */
'use strict';

const startPoint = {x: 5, y: 5};
const boxSize = 90;
const boxBorder = 1;
const blockBorder = 2;
const notePosFix = {x: 9, y: 4};
const numberPosFix = {x: 23, y: 8};
const color = {
  border: '#000000',
  notAllow: '#E0BC92',
  allow: '#000000',
  onlyInput: '#00CD66',
};

function translate(attr){
  attr.x = startPoint.x + attr.x;
  attr.y = startPoint.y + attr.y;
  return attr;
}

function drawBorder(){
  const length = 9 * boxSize + 2 * blockBorder;
  for (let i = 0; i < 4; i++) {
    let size = {x: i * 3 * boxSize + i * blockBorder, y: blockBorder, w: blockBorder, h:length};
    Crafty.e('2D, Canvas, Color').attr(translate(size)).color(color.border);
  }
  for (let i = 0; i < 4; i++) {
    let size = {x: blockBorder, y: i * 3 * boxSize + i * blockBorder, w: length, h: blockBorder};
    Crafty.e('2D, Canvas, Color').attr(translate(size)).color(color.border);
  }
}

/**
 * input  : row OR col
 * return : px
 */
function slice (rowOrCol) {
  return rowOrCol * boxSize + parseInt(rowOrCol / 3 + 1) * blockBorder;
}

function guiMayAnswer(obj) {
  this.mayAnswer = [];
  const small9size = {
    w: obj.attr.w / 3,
    h: obj.attr.h / 3,
  };
  for (let i = 0; i < 9; i++) {
    this.mayAnswer[i] = Crafty.e("2D, DOM, Text")
      .attr({
        x: obj.attr.x + small9size.w * parseInt(i % 3) + notePosFix.x,
        y: obj.attr.y + small9size.h * parseInt(i / 3) + notePosFix.y,
      })
      .textFont({size: '20px', weight: 'bold'})
      .text(i + 1)
      .textColor(color.allow);
  }
  this.draw = function () {
    for (let i = 0; i < 9; i++) {
      this.mayAnswer[i].textColor(obj.mayAnswer[i] ? color.allow : color.notAllow);
    }
    return this;
  };
  this.getIndex = function (rx, ry) {
    const smallCol = parseInt(rx / small9size.w);
    const smallRow = parseInt(ry / small9size.h);
    return smallRow * 3 + smallCol;
  };
  this.remove = function () {
    this.mayAnswer.map(function (smallNote) {
      smallNote.attr({visible: false})
    });
  };
  this.unRemove = function () {
    this.mayAnswer.map(function (smallNote) {
      smallNote.attr({visible: true})
    });
  };
  this.showOnlyInput = function (number) {
    this.mayAnswer[number].textColor(color.onlyInput);
  };
  return this;
}

function Box(row, col, inRow, inCol, inBlock, inBoxes) {
  this.setNumber = null;
  this.row = inRow;
  this.col = inCol;
  this.block = inBlock;
  this.boxes = inBoxes;
  this.attr = {
    x: slice(col),
    y: slice(row),
    w: boxSize - boxBorder,
    h: boxSize - boxBorder,
    alpha: 0.3,
  };
  this.attr.xEnd = this.attr.x + this.attr.w;
  this.attr.yEnd = this.attr.y + this.attr.h;

  this.guiInstance = Crafty.e('2D, Canvas, Color, Mouse').attr(translate(this.attr)).color('white');
  //border
  Crafty.e('2D, Canvas, Color').attr({
    x: this.attr.x + boxSize - boxBorder,
    y: this.attr.y,
    w: boxBorder,
    h: boxSize,
  }).color(color.border);
  Crafty.e('2D, Canvas, Color').attr({
    x: this.attr.x,
    y: this.attr.y + boxSize - boxBorder,
    w: boxSize,
    h: boxBorder,
  }).color(color.border);

  //small note
  this.mayAnswer = [
    true, true, true,
    true, true, true,
    true, true, true,
  ];

  this.guiMayAnswer = new guiMayAnswer(this).draw();

  this.textInstance = Crafty.e('2D, DOM, Text')
    .attr(translate({
      x: this.attr.x + numberPosFix.x,
      y: this.attr.y + numberPosFix.y,
      visible: false,
    }))
    .textFont({size: '60px', weight: 'bold'})
    .textColor(color.allow);
  this.canSet = function (number) {
    return this.row.canSet(number) && this.col.canSet(number) && this.block.canSet(number);
  };

  this.set = function (number) {
    if (this.canSet(number)){

      // logic
      this.row.set(number);
      this.col.set(number);
      this.block.set(number);
      // gui
      // remove notes
      this.guiMayAnswer.remove();
      this.textInstance.text(number + 1).attr({visible: true});
      this.setNumber = number;

    }
  };

  this.unset = function (number) {
    // logic
    this.row.unset(number);
    this.col.unset(number);
    this.block.unset(number);
    // gui
    this.textInstance.attr({visible: false});
    this.guiMayAnswer.unRemove();
    this.setNumber = null;
  };
  const obj = this;
  // binding event
  this.guiInstance.bind('Click', function (mouseEvent) {

    if (mouseEvent.mouseButton === Crafty.mouseButtons.MIDDLE) {

      // 右键单击，切换可选状态
      const i = obj.guiMayAnswer.getIndex(mouseEvent.x - obj.attr.x, mouseEvent.y - obj.attr.y);
      obj.mayAnswer[i] = (!obj.mayAnswer[i]);
      obj.guiMayAnswer.draw();

    } else if (mouseEvent.mouseButton === Crafty.mouseButtons.LEFT) {

      // 左键单击，选择1-9
      if (obj.setNumber !== null) {
        obj.unset(obj.setNumber);
      } else {
        const i = obj.guiMayAnswer.getIndex(mouseEvent.x - obj.attr.x, mouseEvent.y - obj.attr.y);
        obj.set(i);
      }
    }
    obj.boxes.showOnlyInput();
  });
  this.removePossible = function (number) {
    this.mayAnswer[number] = false;
    this.guiMayAnswer.draw();
  };
  this.addPossible = function (number) {
    if(this.canSet(number)){
      this.mayAnswer[number] = true;
      this.guiMayAnswer.draw();
    }
  };
}

function BoxGroup(name) {
  this._boxs = [];
  this.name = name;
  this.addBox = function (box) {
    this._boxs.push(box);
  };
  this.mayAnswer = [
    true, true, true,
    true, true, true,
    true, true, true,
  ];
  this.set = function (number) {
    if (this.mayAnswer[number]) {
      this.mayAnswer[number] = false;
      this._boxs.map(function (box){
        box.removePossible(number);
      });
    } else {
      alert('can\'t set ' + number + ' in ' + this.name);
    }
  };

  this.unset = function (number) {
    if (this.mayAnswer[number]) {
      alert('[ERROR] can\'t unset ' + number + ' in ' + this.name);
    } else {
      this.mayAnswer[number] = true;
      this._boxs.map(function (box) {
        box.addPossible(number);
      });
    }
  };

  this.canSet = function (number) {
    return this.mayAnswer[number];
  };

  this.showOnlyInput = function () {
    const onlyMark = [0,0,0, 0,0,0, 0,0,0]; // 0 for can't set; Object for only ; null for more
    this._boxs.map(function (box) {
      if (! box.setNumber) {
        for (let i = 0; i < 9; i++) {
          if (box.mayAnswer[i] && (onlyMark[i] !== null)) {
            // 本格可以填i，而且该格没有超2
            if (onlyMark[i]) { // 放入其他的obj
              onlyMark[i] = null;
            } else { // 放入0
              onlyMark[i] = box; // 唯一放入此box
            }
          }
        }
      }
    });
    // 让格子显示可以填写的内容
    for (let i = 0; i < 9; i++) {
      if (onlyMark[i]) {
        onlyMark[i].guiMayAnswer.showOnlyInput(i);
      }
    }

  }
}

function initBoxGroup(groupArray, arrName) {
  for (let i = 0; i < 9; i++) {
    groupArray[i] = new BoxGroup(arrName + i);
    groupArray[i].index = i;
  }
}

function initBoxes(boxArray, boxRow, boxCol, boxBlock, boxes) {
  for (let index = 0; index < 81; index++) {
    const row = parseInt(index / 9);
    const col = index % 9;
    const block = parseInt(row / 3) * 3 + parseInt(col / 3);
    const box = new Box(row, col, boxRow[row], boxCol[col], boxBlock[block], boxes);
    box.index = index;
    boxRow[row].addBox(box);
    boxCol[col].addBox(box);
    boxBlock[block].addBox(box);
    boxArray.push(box);
  }
}

function Boxes() {
  this._boxs = []; // 81 block
  this._rows = []; // 9
  this._cols = []; // 9
  this._blocks = []; // 9

  this.eachBoxGroup = function (functionName, arg) {
    this._rows.map(function(nameGroup) { nameGroup[functionName](arg); });
    this._cols.map(function(nameGroup) { nameGroup[functionName](arg); });
    this._blocks.map(function(nameGroup) { nameGroup[functionName](arg); });
  };

  // showOnlyInput
  this.showOnlyInput =  function () {
    // draw onlyAnswer
    this.eachBoxGroup('showOnlyInput');
  };

  this.init = function () {
    // draw border
    drawBorder();
    // init Box group
    initBoxGroup(this._rows, 'row');
    initBoxGroup(this._cols, 'col');
    initBoxGroup(this._blocks, 'block');
    // init boxes
    initBoxes(this._boxs, this._rows, this._cols, this._blocks, this);
  };

  this.init();
  return this;

}