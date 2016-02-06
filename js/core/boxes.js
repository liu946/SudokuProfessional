/**
 * Created by liu on 16/2/1.
 */
'use strict';

/**
 * @description 顶层9*9box类
 *
 * @returns {Boxes}
 * @constructor
 */
function Boxes() {
  /**
   * @description 记录所有的小box
   * @type {Array}
   * @private
   */
  this._boxs = []; // 81 box
  this._rows = []; // 9
  this._cols = []; // 9
  this._blocks = []; // 9

  this.eachBoxGroup = function (functionName, arg) {
    this._boxGroup.map(function(nameGroup) { nameGroup[functionName](arg); });
  };

  /**
   * 功能：显示可以唯一填入的
   */
  this.showOnlyInput =  function () {
    // repaint all box
    this._boxs.map(function(box) {box.guiMayAnswer.draw()});
    // draw onlyAnswer
    this.eachBoxGroup('showOnlyInput');
    this._boxs.map(function(box) {
      const onlyPossible = box.returnOnlyPossible();
      if (onlyPossible) {
        box.guiMayAnswer.showOnlyInput(onlyPossible - 1);
      }
    });
  };

  /**
   * @description 功能：自动填入可填入的数字
   */
  const boxes = this;
  this.autoFill = function() {
    for (let boxGroup of this._boxGroup) {
      if (boxGroup.autoFill()) {
        //延时
        setTimeout(function() {
          boxes.autoFill(); // 重新开始自动填充
        }, autoFillRemainTime);
        return;
      }
    }
    // 每个box判断自填充
    for (let box of this._boxs) {
      if (box.autoFill()) {
        //延时
        setTimeout(function() {
          boxes.autoFill(); // 重新开始自动填充
        }, autoFillRemainTime);
        return;
      }
    }
  };

  /**
   * @description 功能：重设所有的box
   */

  this.resetAll = function() {
    const trueOf9 =
      [
        true, true, true,
        true, true, true,
        true, true, true,
        null
      ];
    this.eachBoxGroup('setMayAnswer', trueOf9);
    this._boxs.map(function(box) {
      box.setMayAnswer(trueOf9);
    });
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
    // box Group list
    this._boxGroup = this._rows.concat(this._cols, this._blocks);
  };
  this.init();
  return this;

}

/**
 * Private Function
 * @description 画最大9*9的盒子边界
 * @private
 */
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