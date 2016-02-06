/**
 * Created by liu on 16/2/6.
 */

'use strict';

/**
 * 全局函数，全局绘图偏移
 * @param attr
 * @returns {*}
 */
function translate(attr){
  attr.x = startPoint.x + attr.x;
  attr.y = startPoint.y + attr.y;
  return attr;
}
