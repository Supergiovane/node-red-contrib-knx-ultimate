/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

//
// DPT17: Scene number
//

// TODO: implement fromBuffer, formatAPDU

// DPT17 basetype info
exports.basetype = {
  bitlength : 8,
  valuetype : 'basic',
  desc : "scene number"
}

// DPT17 subtypes
exports.subtypes = {
  // 17.001 Scene number
  "001" : { use : "G",
      name : "DPT_SceneNumber", desc : "Scene Number",
  },
}
