/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

require('./commontest').do('DPT7', [
  { apdu_data: [0x00, 0x11], jsval: 17},
  { apdu_data: [0x01, 0x00], jsval: 256},
  { apdu_data: [0x10, 0x01], jsval: 4097},
  { apdu_data: [0xff, 0xff], jsval: 65535},
]);
