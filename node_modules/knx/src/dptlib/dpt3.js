/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const log = require('log-driver').logger;

//
// DPT3.*: 4-bit dimming/blinds control
//
exports.formatAPDU = function(value) {
  if (!value) log.warn("DPT3: cannot write null value");
  else {
    var apdu_data = new Buffer(1);
    if (typeof value == 'object' &&
      value.hasOwnProperty('decr_incr') &&
      value.hasOwnProperty('data')) {
      apdu_data[0] = (value.decr_incr << 3) + (value.data & 0b00000111);
    } else {
      log.error("Must supply a value object of {decr_incr, data}");
    }
    //log.trace('formatAPU returns %j', apdu_data);
    return apdu_data;
  }
}

exports.fromBuffer = function(buf) {
  if (buf.length != 1) {
    log.error("DPT3: Buffer should be 1 byte long");
  } else {
    return {
      decr_incr: (buf[0] & 0b00001000) >> 3,
      data:      (buf[0] & 0b00000111)
    }
  };
}

exports.basetype = {
  "bitlength": 4,
  "valuetype": "composite",
  "desc": "4-bit relative dimming control"
}

exports.subtypes = {
  // 3.007 dimming control
  "007": {
    "name": "DPT_Control_Dimming",
    "desc": "dimming control"
  },

  // 3.008 blind control
  "008": {
    "name": "DPT_Control_Blinds",
    "desc": "blinds control"
  }
}

/*
        2.6.3.5 Behavior
Status
off     dimming actuator switched off
on      dimming actuator switched on, constant brightness, at least
        minimal brightness dimming
dimming actuator switched on, moving from actual value in direction of
        set value
Events
    position = 0        off command
    position = 1        on command
    control = up dX     command, dX more bright dimming
    control = down dX   command, dX less bright dimming
    control = stop      stop command
    value = 0           dimming value = off
    value = x%          dimming value = x% (not zero)
    value_reached       actual value reached set value

The step size dX for up and down dimming may be 1/1, 1/2, 1/4, 1/8, 1/16, 1/32 and 1/64 of
the full dimming range (0 - FFh).

3.007 dimming control
3.008 blind control
*/
