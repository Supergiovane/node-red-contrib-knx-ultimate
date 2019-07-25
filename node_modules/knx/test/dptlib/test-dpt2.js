/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

require('./commontest').do('DPT2', [
  { apdu_data: [0x00], jsval: {priority: 0 , data: 0}},
  { apdu_data: [0x01], jsval: {priority: 0 , data: 1}},
  { apdu_data: [0x02], jsval: {priority: 1 , data: 0}},
  { apdu_data: [0x03], jsval: {priority: 1 , data: 1}}
]);
