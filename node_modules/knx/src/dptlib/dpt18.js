/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

//
// DPT18: 8-bit Scene Control
//

/*
    class DPT18_Frame < DPTFrame
        bit1  :exec_learn, {
            :display_name : "Execute=0, Learn = 1"
        }
        bit1  :pad, {
            :display_name : "Reserved bit"
        }
        bit6  :data, {
            :display_name : "Scene number"
        }
    end
*/

// TODO: implement fromBuffer, formatAPDU

// DPT18 basetype info
exports.basetype = {
  bitlength : 8,
  valuetype : 'composite',
  desc : "8-bit Scene Activate/Learn + number"
}

// DPT9 subtypes
exports.subtypes = {
  // 9.001 temperature (oC)
  "001" : {
      name : "DPT_SceneControl", desc : "scene control"
  },
}
