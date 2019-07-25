/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/
const commontest = require('./commontest');
// DPT5 without subtype: no scaling
commontest.do('DPT5', [
  { apdu_data: [0x00], jsval: 0},
  { apdu_data: [0x40], jsval: 64},
  { apdu_data: [0x41], jsval: 65},
  { apdu_data: [0x80], jsval: 128},
  { apdu_data: [0xff], jsval: 255}
]);
// 5.001 percentage (0=0..ff=100%)
commontest.do('DPT5.001', [
  { apdu_data: [0x00], jsval: 0 },
  { apdu_data: [0x80], jsval: 50},
  { apdu_data: [0xff], jsval: 100}
]);
// 5.003 angle (degrees 0=0, ff=360)
commontest.do('DPT5.003', [
  { apdu_data:  [0x00], jsval: 0 },
  { apdu_data:  [0x80], jsval: 181 },
  { apdu_data:  [0xff], jsval: 360 }
]);
