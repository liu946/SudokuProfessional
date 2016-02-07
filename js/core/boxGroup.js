/**
 * Created by liu on 16/2/6.
 */

'use strict';

function BoxGroup(name) {
  this._boxs = [];
  this.name = name;
  this.mayAnswer = [
    true, true, true,
    true, true, true,
    true, true, true,
  ];
  this.addBox = function (box) {
    this._boxs.push(box);
  };
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
    let returnFillField = false;
    for (let i = 0; i < 9; i++) {
      if (onlyMark[i]) {
        onlyMark[i].guiMayAnswer.showOnlyInput(i);
        returnFillField = {box: onlyMark[i], number: i}; // 返回可以设置的句柄
      }
    }
    return returnFillField; // 如果没有可填入的，返回false
  };

  this.autoFill = function() {
    const autoFillbox = this.showOnlyInput();
    if (autoFillbox) {
      autoFillbox.box.set(autoFillbox.number);
      return true;
    }
    return false;
  }

  /**
   * @description set guiMayAnswer
   * @note 注意这个方法不能直接给this.mayAnswer赋值
   */
  this.setMayAnswer = function(array) {
    for (var i = 0; i < 9; i++) {
      this.mayAnswer[i] = array[i];
    }
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
    return array;
  };
}

function initBoxGroup(groupArray, arrName) {
  for (let i = 0; i < 9; i++) {
    groupArray[i] = new BoxGroup(arrName + '|' + i);
    groupArray[i].index = i;
  }
}