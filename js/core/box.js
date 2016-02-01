/**
 * Created by liu on 16/2/1.
 */
'use strict';

const boxSize = 90;
const boxBorder = 2;
const color = {
  notAllow: '#ffffff',
  allow: '#000000',
};

function box (row, col) {
  this.row = row;
  this.col = col;
  this.attr = {
    x: col * boxSize,
    y: row * boxSize,
    w: boxSize - boxBorder,
    h: boxSize - boxBorder,
    alpha: 0.3,
  };
  this.attr.xEnd = this.attr.x + this.attr.w;
  this.attr.yEnd = this.attr.y + this.attr.h;

  // small note
  this.guiInstance = Crafty.e('2D, Canvas, Color').attr(this.attr).color('white');
  this.mayAnswer = [
                      true, false, true,
                      false, false, false,
                      true, false, true,
                    ];
  this.guiMayAnswer = [];
  const small9size = {
    w: this.attr.w / 3,
    h: this.attr.h / 3,
  };
  for (let i = 0; i < 9; i++) {
    this.guiMayAnswer[i] = Crafty.e("2D, DOM, Text")
      .attr({
        x: this.attr.x + small9size.w * parseInt(i % 3),
        y: this.attr.y + small9size.h * parseInt(i / 3),
      })
      .textFont({ size: '20px', weight: 'bold' })
      .text(i + 1)
      .textColor(color.allow);
  }
  this.drawMayAnswer = function () {
    for (let i = 0; i < 9; i++) {
      this.guiMayAnswer[i].textColor(this.mayAnswer[i] ? color.allow : color.notAllow);
    }
  };
  this.drawMayAnswer();

}

function boxes () {
  this._boxs = [];

  this.init = function () {
    // draw border

    // draw boxes
    for (let index = 0; index < 81; index++) {
      this._boxs[index] = new box( parseInt(index / 9), index % 9);
    }
  };

  this.init();
  return this;

}