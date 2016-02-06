/**
 * Created by liu on 16/2/6.
 */

'use strict';

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
