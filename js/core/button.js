/**
 * Created by liu on 16/2/4.
 */

'use strict';

let buttonIndex = -1;
/**
 * class 功能键
 * @param name
 * @param cb
 * @returns {GameFunctionButton}
 * @constructor
 */
function GameFunctionButton(name, cb) {
  this.name = 'btn|' + name;
  const btn = this;
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

  this.guiInstance.bind('Click',function (e){
    recorder.log(btn, 'button triggered');
    cb(e);
  });
  return this;
}

/**
 * 文件操作相关按钮
 * @extends GameFunctionButton
 * @param name
 * @param jqueryObj
 * @param cb (fileName)
 * @returns {FileOperationButton}
 * @constructor
 */
function FileOperationButton(name, jqueryObj, cb) {
  function openFileCb(event) {
    jqueryObj.trigger('click');
  }
  jqueryObj.bind('change', function(){
    cb(jqueryObj.val());
  });
  this.prototype = new GameFunctionButton(name, openFileCb);
  this.jqueryObj = jqueryObj;
  const btn = this;

  return this;
}
/**
 * 构造记录器
 * @param htmlObj
 */
function record(htmlObj) {
  buttonIndex++;
  this.step = 1;
  this.attr = {
    x: buttonStart.x,
    y: buttonStart.y + buttonIndex * (buttonSize.h + buttonSize.interval),
    w: buttonSize.w,
    h: buttonSize.h,
    alpha: 0.6,
  };
  this.attr.h = this.attr.x - this.attr.y - this.attr.w * 2;

  htmlObj.css('left', this.attr.x);
  htmlObj.css('top', this.attr.y);
  htmlObj.css('width', this.attr.w);
  htmlObj.css('height', this.attr.h);

  this.log = function(sender, string) {
    let recordString = '';
    const allowLogSender = {box : true, row : true, col : true, block : true, btn : true, boxes: true};
    if (allowLogSender[sender.name.split('|')[0]]) {
      recordString = (this.step++) + ' [' + sender.name + ']\n' + string + '\n';
    }
    htmlObj.html(htmlObj.html() + recordString);
    htmlObj.scrollTop(htmlObj[0].scrollHeight);
  };

  this.getContext = function() {
    return htmlObj.html();
  }
}

function initButtons(boxes) {
  const buttonList = [];
  buttonList.push(new GameFunctionButton('NewGame',function(mouseEvent) {
    boxes.randomNewGame();
  }));
  buttonList.push(new GameFunctionButton('AutoFill',function(mouseEvent) {
    boxes.autoFill();
  }));
  buttonList.push(new GameFunctionButton('ResetAll',function(mouseEvent) {
    boxes.resetAll();
  }));
  buttonList.push(new GameFunctionButton('TakeShot',function(mouseEvent) {
    boxes.shot();
  }));
  buttonList.push(new GameFunctionButton('ResetShot',function(mouseEvent) {
    boxes.resetShot();
  }));
  buttonList.push(new FileOperationButton('Save', $('#save'), function(fileName) {
    boxes.saveToFile(fileName);
  }));
  buttonList.push(new FileOperationButton('Load', $('#load'), function(fileName) {
    boxes.loadFromFile(fileName);
  }));
  buttonList.push(new FileOperationButton('SaveLogs', $('#save-log'), function(fileName) {
    boxes.saveLogs(fileName);
  }));


}