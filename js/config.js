/**
 * Created by liu on 16/2/1.
 */

'use strict';
const startPoint = {x: 5, y: 5};
const boxSize = 90;
const boxBorder = 1;
const blockBorder = 2;
const notePosFix = {x: 9, y: 4};
const numberPosFix = {x: 23, y: 8};
const buttonStart = {x: boxSize * 9 + blockBorder * 4, y: 20};
const buttonSize = {w: 50, h:20, interval: 10};
const color = {
  border: '#000000',
  notAllow: '#E0BC92',
  allow: '#000000',
  onlyInput: '#00CD66',
};
const autoFillRemainTime = 500;
const preLoadingfile = [
  'resourse/image/background.png',
];


function initConfig() {
  Crafty.load(preLoadingfile);

  Crafty.background('#E0BC92 url(resourse/image/background.png)');
}
