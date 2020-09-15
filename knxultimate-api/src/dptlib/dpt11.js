/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');
const util = require('util');
//
// DPT11.*: date
//
exports.formatAPDU = function(value) {
  if (!value) knxLog.get().error("cannot write null value for DPT11")
  else {
    var apdu_data = new Buffer(3);
    switch(typeof value) {
      case 'string':
      case 'number':
        value = new Date(value);
        break;
      case 'object':
        // this expects the month property to be zero-based (January = 0, etc.)
        if (value.constructor.name != 'Date' &&
          value.hasOwnProperty('day') &&
          value.hasOwnProperty('month') &&
          value.hasOwnProperty('year')) {
          value = new Date(parseInt(value.year), parseInt(value.month), parseInt(value.day));
        }
    }
    if (isNaN(value.getDate())) {
      knxLog.get().error('Must supply a numeric timestamp, Date or String object for DPT11 Date');
    } else {
      apdu_data[0] = value.getDate();
      apdu_data[1] = value.getMonth() + 1;
      var year = value.getFullYear();
      apdu_data[2] = year - (year >= 2000 ? 2000 : 1900);
    }
    return apdu_data;
  }
}

exports.fromBuffer = function(buf) {
  if (buf.length != 3) knxLog.get().error("Buffer should be 3 bytes long")
  else {
    var day   = (buf[0] & 31);      //0b00011111);
    var month = (buf[1] & 15);      //0b00001111);
    var year  = (buf[2] & 127);     //0b01111111);
    year = year + (year > 89 ? 1900 : 2000)
    if (day >= 1 & day <= 31 &
      month >= 1 & month <= 12 &
      year >= 1990 & year <= 2089) {
      return new Date(year, month-1, day);
    } else {
      knxLog.get().error(
        "%j => %d/%d/%d is not valid date according to DPT11, setting to 1990/01/01",
        buf, day, month, year);
      //return new Date(1990, 01, 01);
      throw new Error('Error converting date buffer to Date object.');
    }
  }
}

// DPT11 base type info
exports.basetype = {
  bitlength : 24,
  valuetype : 'composite',
  desc : "3-byte date value"
}

// DPT11 subtypes info
exports.subtypes = {
  // 11.001 date
  "001" : {
      name : "DPT_Date", desc : "Date"
  }
}
