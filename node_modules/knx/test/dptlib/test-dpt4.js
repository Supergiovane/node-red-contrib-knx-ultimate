/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/
require('./commontest').do('DPT4', [
  { apdu_data: [0x40], jsval: "@"},
  { apdu_data: [0x76], jsval: "v"}
]);
