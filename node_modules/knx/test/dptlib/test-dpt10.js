/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const test = require('tape');
const DPTLib = require('../../src/dptlib');
const assert = require('assert');

function timecompare(date1, sign, date2) {
  var hour1 = date1.getHours();
  var min1 = date1.getMinutes();
  var sec1 = date1.getSeconds();
  var hour2 = date2.getHours();
  var min2 = date2.getMinutes();
  var sec2 = date2.getSeconds();
  if (sign === '===') {
    if (hour1 === hour2 && min1 === min2 && sec1 === sec2) return true;
    else return false;
  } else if (sign === '>') {
    if (hour1 > hour2) return true;
    else if (hour1 === hour2 && min1 > min2) return true;
    else if (hour1 === hour2 && min1 === min2 && sec1 > sec2) return true;
    else return false;
  }
}

test('DPT10 time conversion', function(t) {
  var tests = [
    ['DPT10', [12, 23, 34], '12:23:34'],
    ['DPT10', [15, 45, 56], '15:45:56']
  ]
  for (var i = 0; i < tests.length; i++) {
    let dpt = DPTLib.resolve(tests[i][0]);
    let buf = new Buffer(tests[i][1]);
    let val = tests[i][2];

    // unmarshalling test (raw data to value)
    let converted = DPTLib.fromBuffer(buf, dpt);
    t.ok(converted == val,
      `${tests[i][0]} fromBuffer value ${val} => ${converted}`);

    // marshalling test (value to raw data)
    var apdu = {};
    DPTLib.populateAPDU(val, apdu, 'dpt10');
    t.ok(Buffer.compare(buf, apdu.data) == 0,
      `${tests[i][0]} formatAPDU value ${val} => ${converted}`);
  }
  t.end()
})
