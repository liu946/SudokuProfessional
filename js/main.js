/**
 * Created by liu on 16/2/1.
 */
'use strict';
let recorder;

$(function(){

  const crafty = Crafty.init(1000, 930, document.getElementById('game'));
  initConfig();
  const box = new Boxes();
  initButtons(box);
  recorder = new record($('#gameRecord'));

});