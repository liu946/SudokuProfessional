/**
 * Created by liu on 16/2/6.
 */

'use strict';
const fs = require('fs');

function Box(row, col, inRow, inCol, inBlock, inBoxes) {
  this.setNumber = null;
  this.row = inRow;
  this.col = inCol;
  this.block = inBlock;
  this.boxes = inBoxes;
  this.name = 'box|' + row + col;
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
      recorder.log(this, 'set ' + (number + 1));
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
    recorder.log(this, 'unset ' + (number + 1));
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

  /**
   * @returns 0-9 show number if only
   */
  this.returnOnlyPossible = function () {
    let onlyPossible = 0;
    for (let i = 0; i < 9; i++) {
      if (this.mayAnswer[i]) {
        if (onlyPossible) {
          return false;
        } else {
          onlyPossible = (i + 1);
        }
      }
    }
    return onlyPossible;
  };
  this.autoFill = function () {
    const onlyPossible = this.returnOnlyPossible();
    if (onlyPossible && this.setNumber === null) {
      recorder.log(this, 'find only ' + onlyPossible);
      this.set(onlyPossible - 1);
      return true;
    }
    return false;
  };

  /**
   * @description set guiMayAnswer
   * @note 注意这个方法不能直接给this.mayAnswer赋值
   * @param array 10长，0-8是mayAnswer的值，9是this.setNumber;
   * @param clear
   */
  this.setMayAnswer = function(array) {
    this.setNumber = array[9];
    this.textInstance.attr({visible: this.setNumber !== null});
    if (this.setNumber !== null) this.textInstance.text(this.setNumber + 1);
    for (var i = 0; i < 9; i++) {
      this.mayAnswer[i] = array[i];
    }
    this.guiMayAnswer.draw();
  };

  /**
   * @description get guiMayAnswer
   * @note 注意这个方法不能直接返回
   */
  this.getMayAnswer = function() {
    var array = [];
    for (var i = 0; i < 9; i++) {
      array[i] = this.mayAnswer[i];
    }
    array[9] = this.setNumber;
    return array;
  };

}

/**
 * Private function
 * input  : row OR col
 * return : px
 */
function slice (rowOrCol) {
  return rowOrCol * boxSize + parseInt(rowOrCol / 3 + 1) * blockBorder;
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
