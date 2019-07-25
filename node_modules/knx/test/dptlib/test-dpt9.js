/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

require('./commontest').do('DPT9', [
  { apdu_data: [0x00, 0x02], jsval: 0.02},
  { apdu_data: [0x87, 0xfe], jsval: -0.02},
  { apdu_data: [0x0c, 0x24], jsval: 21.2},
  { apdu_data: [0x0c, 0x7e], jsval: 23},
  { apdu_data: [0x5c, 0xc4], jsval: 24985.6},
  { apdu_data: [0xdb, 0x3c], jsval: -24985.6},
  { apdu_data: [0x7f, 0xfe], jsval: 670433.28},
  { apdu_data: [0xf8, 0x02], jsval: -670433.28},
]);
