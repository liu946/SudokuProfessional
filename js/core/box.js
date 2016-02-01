/**
 * Created by liu on 16/2/1.
 */
'use strict';

const boxSize = 90;
const boxBorder = 1;

function guiConstructBox( row, col) {
  return Crafty.e("2D, Canvas, Color")
    .attr({
      x: col * boxSize,
      y: row * boxSize,
      w: boxSize - boxBorder,
      h: boxSize - boxBorder,
      alpha: 0.5,
    })
    .color('white');
}

function box (crafty, row, col) {
  this.row = row;
  this.col = col;
  this.guiInstance = guiConstructBox( row, col);

}

function boxs (crafty) {
  this._boxs = [];

  this.init = function () {
    for (let index = 0; index < 81; index++) {
      this._boxs[index] = new box(crafty, parseInt(index / 9), index % 9);
    }
  };

  this.init();
  return this;

}