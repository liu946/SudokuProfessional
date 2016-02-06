/**
 * Created by liu on 16/2/4.
 */

'use strict';

let buttonIndex = -1;

function initButton(name, cb) {
  buttonIndex++;
  this.attr = {
    x: buttonStart.x,
    y: buttonStart.y + buttonIndex * (buttonSize.h + buttonSize.interval),
    w: buttonSize.w,
    h: buttonSize.h,
    alpha: 0.6,
  };
  this.guiInstance = Crafty.e('2D, Canvas, Color, Mouse').attr(translate(this.attr)).color('black');
  this.textInstance = Crafty.e('2D, DOM, Text')
    .attr(translate({
      x: this.attr.x + 5,
      y: this.attr.y + buttonSize.h * 0.2,
    }))
    .textFont({size: parseInt(buttonSize.h * 0.4) + 'px'})
    .text(name)
    .unselectable()
    .textColor('white');

  this.guiInstance.bind('Click',cb);
}

function initButtons(boxes) {
  const buttonList = [];
  buttonList.push(new initButton('AutoFill',function(mouseEvent) {
    boxes.autoFill();
  }));
}