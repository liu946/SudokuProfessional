/**
 * Created by liu on 16/2/1.
 */
'use strict';

$(function(){

  const crafty = Crafty.init(930, 830, document.getElementById('game'));
  initConfig();
  const box = new Boxes();
  initButtons(box);

});