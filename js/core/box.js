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

function box(row, col) {
  this.isSet = false;
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

  //small note
  this.guiInstance = Crafty.e('2D, Canvas, Color, Mouse').attr(this.attr).color('white');
  this.mayAnswer = [
    true, false, true,
    true, false, true,
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
      .textFont({size: '20px', weight: 'bold'})
      .text(i + 1)
      .textColor(color.allow);
  }
  this.drawMayAnswer = function () {
    for (let i = 0; i < 9; i++) {
      this.guiMayAnswer[i].textColor(this.mayAnswer[i] ? color.allow : color.notAllow);
    }
  };
  this.drawMayAnswer();

  function getIndex(rx, ry) {
    const smallCol = parseInt(rx / small9size.w);
    const smallRow = parseInt(ry / small9size.h);
    return smallRow * 3 + smallCol;
  }

  this.textInstance = Crafty.e("2D, DOM, Text")
    .attr({
      x: this.attr.x,
      y: this.attr.y,
      visible: false,
    })
    .textFont({size: '60px', weight: 'bold'})
    .textColor(color.allow);

  this.set = function (number) {
    // remove notes
    this.guiMayAnswer.map(function(smallNote){
      smallNote.attr({visible: false})
    });
    this.textInstance.text(number).attr({visible: true});
    this.isSet = true;
  };

  this.unset = function () {
    this.textInstance.attr({visible: false});
    this.guiMayAnswer.map(function(smallNote){
      smallNote.attr({visible: true})
    });
    this.isSet = false;
  };
  const obj = this;
  // binding event
  this.guiInstance.bind('Click', function (mouseEvent) {

    if (mouseEvent.mouseButton === Crafty.mouseButtons.MIDDLE) {

      // 右键单击，切换可选状态
      const i = getIndex(mouseEvent.x - obj.attr.x, mouseEvent.y - obj.attr.y);
      obj.mayAnswer[i] = (!obj.mayAnswer[i]);
      obj.drawMayAnswer();

    } else if (mouseEvent.mouseButton === Crafty.mouseButtons.LEFT) {

      // 左键单击，选择1-9
      if (obj.isSet) {
        obj.unset();
      } else {
        const i = getIndex(mouseEvent.x - obj.attr.x, mouseEvent.y - obj.attr.y);
        obj.set(i + 1);
      }
    }
  });

}

function boxes() {
  this._boxs = [];

  this.init = function () {
    // draw border

    // draw boxes
    for (let index = 0; index < 81; index++) {
      this._boxs[index] = new box(parseInt(index / 9), index % 9);
    }
  };

  this.init();
  return this;

}