/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/
const commontest = require('./commontest')

commontest.do('DPT3', [
  { apdu_data: [0x00], jsval: {decr_incr: 0, data: 0}},
  { apdu_data: [0x06], jsval: {decr_incr: 0, data: 6}}
]);

commontest.do('DPT3.007', [
  { apdu_data: [0x01], jsval: {decr_incr: 0, data: 1}},
  { apdu_data: [0x05], jsval: {decr_incr: 0, data: 5}},
  { apdu_data: [0x08], jsval: {decr_incr: 1, data: 0}},
  { apdu_data: [0x0f], jsval: {decr_incr: 1, data: 7}}
]);
