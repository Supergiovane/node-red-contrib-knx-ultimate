/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

exports.formatAPDU = function(value) {
  var f = parseFloat(value);
  if (!isNaN(f) && isFinite(value)) {
    // numeric values (in native and string form) are truthy if NOT zero
    return new Buffer([Boolean(f) ? 1 : 0]);
  } else {
    // non-numeric value truthiness is Boolean true or the string 'true'.
    return new Buffer([(value == true || value == 'true') ? 1 : 0]);
  }
}

exports.fromBuffer = function(buf) {
  if (buf.length != 1) {
    knxLog.get().warn("DPT1.fromBuffer: buf should be 1 byte (got %d bytes)", buf.length);
  } else return (buf[0] != 0);
}

// DPT basetype info hash
exports.basetype = {
    'bitlength': 1,
    'valuetype': 'basic',
    'desc' : "1-bit value"
}

//  DPT subtypes info hash
exports.subtypes = {
    //  1.001 on/off
    "001": { "use" : "G",
        "name" : "DPT_Switch",
        "desc" : "switch",
        "enc" : { 0 : "Off", 1 : "On" }
    },

    //  1.002 boolean
    "002" : { "use" : "G",
        "name" : "DPT_Bool",
        "desc" : "bool",
        "enc" : { 0 : "false", 1 : "true" }
    },

    //  1.003 enable
    "003" : { "use" : "G",
        "name" : "DPT_Enable",
        "desc" : "enable",
        "enc" : { 0 : "disable", 1 : "enable" }
    },

    //  1.004 ramp
    "004" : { "use" : "FB",
        "name" : "DPT_Ramp",
        "desc" : "ramp",
        "enc" : { 0 : "No ramp", 1 : "Ramp" }
    },

    //  1.005 alarm
    "005" : { "use" : "FB",
        "name" : "DPT_Alarm",
        "desc" : "alarm",
        "enc" : { 0 : "No alarm", 1 : "Alarm" }
    },

    //  1.006 binary value
    "006" : { "use" : "FB",
        "name" : "DPT_BinaryValue",
        "desc" : "binary value",
        "enc" : { 0 : "Low", 1 : "High" }
    },

    //  1.007 step
    "007" : { "use" : "FB",
        "name" : "DPT_Step",
        "desc" : "step",
        "enc" : { 0 : "Decrease", 1 : "Increase" }
    },

    //  1.008 up/down
    "008" : { "use" : "G",
        "name" : "DPT_UpDown",
        "desc" : "up/down",
        "enc" : { 0 : "Up", 1 : "Down" }
    },

    //  1.009 open/close
    "009" : { "use" : "G",
        "name" : "DPT_OpenClose",
        "desc" : "open/close",
        "enc" : { 0 : "Open", 1 : "Close" }
    },

    //  1.010 start/stop
    "010" : { "use" : "G",
        "name" : "DPT_Start",
        "desc" : "start/stop",
        "enc" : { 0 : "Stop", 1 : "Start" }
    },

    //  1.011 state
    "011" : { "use" : "FB",
        "name" : "DPT_State",
        "desc" : "state",
        "enc" : { 0 : "Inactive", 1 : "Active" }
    },

    //  1.012 invert
    "012" : { "use" : "FB",
        "name" : "DPT_Invert",
        "desc" : "invert",
        "enc" : { 0 : "Not inverted", 1 : "inverted" }
    },

    //  1.013 dim send style
    "013" : { "use" : "FB",
        "name" : "DPT_DimSendStyle",
        "desc" : "dim send style",
        "enc" : { 0 : "Start/stop", 1 : "Cyclically" }
    },

    //  1.014 input source
    "014" : { "use" : "FB",
        "name" : "DPT_InputSource",
        "desc" : "input source",
        "enc" : { 0 : "Fixed", 1 : "Calculated" }
    },

    //  1.015 reset
    "015" : { "use" : "G",
        "name" : "DPT_Reset",
        "desc" : "reset",
        "enc" : { 0 : "no action(dummy)", 1 : "reset command(trigger)" }
    },

    //  1.016 acknowledge
    "016" : { "use" : "G",
        "name" : "DPT_Ack",
        "desc" : "ack",
        "enc" : { 0 : "no action(dummy)", 1 : "acknowledge command(trigger)" }
    },

    //  1.017 trigger
    "017" : { "use" : "G",
        "name" : "DPT_Trigger",
        "desc" : "trigger",
        "enc" : { 0 : "trigger", 1 : "trigger" }
    },

    //  1.018 occupied
    "018" : { "use" : "G",
        "name" : "DPT_Occupancy",
        "desc" : "occupancy",
        "enc" : { 0 : "not occupied", 1 : "occupied" }
    },

    //  1.019 open window or door
    "019" : { "use" : "G",
        "name" : "DPT_WindowDoor",
        "desc" : "open window/door",
        "enc" : { 0 : "closed", 1 : "open" }
    },

    //  1.021 and/or
    "021" : { "use" : "FB",
        "name" : "DPT_LogicalFunction",
        "desc" : "and/or",
        "enc" : { 0 : "logical function OR", 1 : "logical function AND" }
    },

    //  1.022 scene A/B
    "022" : { "use" : "FB",
        "name" : "DPT_Scene_AB",
        "desc" : "scene A/B",
        "enc" : { 0 : "scene A", 1 : "scene B" }
    },

    //  1.023 shutter/blinds mode
    "023" : { "use" : "FB",
        "name" : "DPT_ShutterBlinds_Mode",
        "desc" : "shutter/blinds mode",
        "enc" : { 0 : "only move Up/Down mode (shutter)", 1 : "move Up/Down + StepStop mode (blind)" }
    },

    //  1.100 cooling/heating     ---FIXME---
    "100" : {  "use" : "???",
        "name" : "DPT_Heat/Cool",
        "desc" : "heat/cool",
        "enc" : { 0 : "???", 1 : "???" }
    }
}
