/**
 * Created by liu on 16/2/1.
 */

'use strict';
const startPoint = {x: 5, y: 5};
const boxSize = 85;
const boxBorder = 1;
const blockBorder = 2;
const notePosFix = {x: 9, y: 4};
const numberPosFix = {x: 18, y: 0};
const buttonStart = {
  x: boxSize * 9 + blockBorder * 4 + 20, // offset = 20
  y: 10
};
const buttonSize = {w: 120, h:30, interval: 10};
const color = {
  border: '#000000',
  notAllow: '#E0BC92',
  allow: '#000000',
  onlyInput: '#00CD66',
};
const autoFillRemainTime = 50;
const preLoadingfile = [
  'resourse/image/background.png',
];


function initConfig() {
  Crafty.load(preLoadingfile);

  Crafty.background('#E0BC92 url(resourse/image/background.png)');
}
