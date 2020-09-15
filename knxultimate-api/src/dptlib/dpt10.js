/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT10.*: time (3 bytes)
//
const util = require('util');
var timeRegexp = /(\d{1,2}):(\d{1,2}):(\d{1,2})/;

// DPTFrame to parse a DPT10 frame.
// Always 8-bit aligned.

exports.formatAPDU = function(value) {
  var apdu_data = new Buffer(3);
  var dow, hour, minute, second;
  // day of week. NOTE: JS Sunday = 0
  switch(typeof value) {
    case 'string':
      // try to parse
      match = timeRegexp.exec(value);
      if (match) {
        dow = ((new Date().getDay()-7) % 7)+7;
        hour = parseInt(match[1]);
        minute = parseInt(match[2]);
        second = parseInt(match[3]);
      } else {
        knxLog.get().warn("DPT10: invalid time format (%s)", value);
      }
      break;
    case 'object':
      if (value.constructor.name != 'Date') {
        knxLog.get().warn('Must supply a Date or String for DPT10 time');
        break;
      }
    case 'number':
      value = new Date(value);
    default:
      dow = ((value.getDay()-7) % 7)+7;
      hour = value.getHours();
      minute = value.getMinutes();
      second = value.getSeconds();
  }
  apdu_data[0] = (dow<<5) + hour;
  apdu_data[1] = minute;
  apdu_data[2] = second;
  return apdu_data;
}

// return a JS Date from a DPT10 payload, with DOW/hour/month/seconds set to the buffer values.
// The week/month/year are inherited from the current timestamp.
exports.fromBuffer = function(buf) {
  if (buf.length != 3) knxLog.get().warn("DPT10: Buffer should be 3 bytes long")
  else {
    var d = new Date();
    var dow = (buf[0] & 0b11100000) >> 5;
    var hours = buf[0] & 0b00011111;
    var minutes = buf[1];
    var seconds = buf[2];
    if (hours >= 0 & hours <= 23 &
      minutes >= 0 & minutes <= 59 &
      seconds >= 0 & seconds <= 59) {
      if (d.getDay() != dow) {
        // adjust day of month to get the day of week right
        d.setDate(d.getDate() + dow - d.getDay());
      }
      d.setHours(hours);
      d.setMinutes(minutes);
      d.setSeconds(seconds);
    } else {
      knxLog.get().warn(
        "DPT10: buffer %j (decoded as %d:%d:%d) is not a valid time",
        buf, hours, minutes, seconds);
    }
    return d;
  }
}

// DPT10 base type info
exports.basetype = {
  "bitlength" : 24,
  "valuetype" : "composite",
  "desc" : "day of week + time of day"
}

// DPT10 subtypes info
exports.subtypes = {
  // 10.001 time of day
  "001" : {
      "name" : "DPT_TimeOfDay", "desc" : "time of day"
  }
}
