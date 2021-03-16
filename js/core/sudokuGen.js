/**
 * Created by liu on 21/3/16.
 */

'use strict';

/**
 *
 * @param m 地图m，非填充使用null表示
 * @param i 第i行
 * @param j 第j列
 * @return 可填 Set
 */

const set1_9 = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

function check(m, i, j) {
  const unfillable_nums = new Set();
  for (let k = 0; k < 9; k++) {
    unfillable_nums.add(m[i][k]);
    unfillable_nums.add(m[k][j]);
  }
  for (let k = 0; k < 3; k++) {
    for (let l = 0; l < 3; l++) {
      unfillable_nums.add(m[Math.floor(i/3) * 3 + k][Math.floor(j/3) * 3 + l]);
    }
  }
  return new Set([...set1_9].filter(x=>!unfillable_nums.has(x)));
}

function random_shuffle_1_9() {
  //return [...set1_9]; // for debug
  return [...set1_9].map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
}

function _gen_new_answer(i, j, m) {
  const available_set = check(m, i, j);
  const available_random_order_list = random_shuffle_1_9().filter(x => available_set.has(x));
  for (const n of available_random_order_list) {
    m[i][j] = n;  // 尝试填入n
    if ((i === 8 && j === 8) || _gen_new_answer(j===8?i+1:i, j===8?0:j+1, m)) return true;  // 如果已经填上最后一个或者下游返回可行结果。则返回可行
  }
  m[i][j] = null; // 取消本次尝试
  return false; // 返回不可行，让上游换其他方案。
}

function gen_new_answer() {
  const m = [...Array(9).keys()].map(x => [...Array(9).keys()].map(x => null));
  _gen_new_answer(0, 0, m);
  return m;
}

function drop_blanks(m, prob=0.7) {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[0].length; j++) {
      m[i][j] = Math.random() > prob? m[i][j] : null;
    }
  }
  return m;
}


