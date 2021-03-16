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
  this._boxGroup = []; // 27
  this.quickShot = {};
  this.name = 'boxes|0';
  const boxes = this;

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
  this.autoFill = function() {
    for (let boxGroup of this._boxGroup) {
      if (boxGroup.autoFill()) {
        recorder.log(this, 'Found! Start next fill.');
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
        recorder.log(this, 'Found! Start next fill.');
        //延时
        setTimeout(function() {
          boxes.autoFill(); // 重新开始自动填充
        }, autoFillRemainTime);
        return;
      }
    }
    recorder.log(this, 'Not found! Stop.');
  };

  this.randomNewGame = function () {
    const m = gen_new_answer();
    drop_blanks(m, 0.6);
    this.resetAll();
    this._boxs.map((box) => {
      const r = Math.floor(box.index / 9);
      const c = box.index % 9;
      if (m[r][c] !== null) {box.set(m[r][c]);}
    });
  }

  /**
   * @description 功能：重设所有的box
   */
  this.resetAll = function() {
    recorder.log(this, 'Reset all boxes.');
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

  /**
   * @description 功能：建立快照
   */
  function takeShot(boxes) {
    var quickShot = {};
    quickShot.boxGroup = boxes._boxGroup.map(function(boxGroup) { return boxGroup.getMayAnswer();});
    quickShot.boxs = boxes._boxs.map(function(box) {return box.getMayAnswer();});
    return quickShot;
  }

  function restoreShot(boxes, shotData) {
    shotData.boxGroup.map(function (value, key) {
      boxes._boxGroup[key].setMayAnswer(value);
    });
    shotData.boxs.map(function (value, key) {
      boxes._boxs[key].setMayAnswer(value);
    });
  }

  this.shot = function() {
    recorder.log(this, 'Temporary shot.');
    this.quickShot = takeShot(this);
  };

  this.resetShot = function() {
    recorder.log(this, 'Reset last temporary shot.');
    restoreShot(this, this.quickShot);
    this.showOnlyInput();
  };


  /**
   * 保存当前内容到文件
   * @param filePath
   */
  this.saveToFile = function(filePath) {
    fs.writeFile(filePath, JSON.stringify(takeShot(this)), function (err) {
      if (err) throw err;
    });
  };

  /**
   * 从文件恢复
   * @param filePath
   */
  this.loadFromFile = function(filePath) {
    fs.readFile(filePath, function(err, data){
      if (err) throw err;
      restoreShot(boxes, JSON.parse(data));
    });
  };
  /**
   * 保存log文件
   * @param filePath
   */
  this.saveLogs = function(filePath) {
    fs.writeFile(filePath, recorder.getContext(), function (err) {
      if (err) throw err;
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
