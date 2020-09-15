/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
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
      "desc" : "DPT_SceneNumber", "name" : "Scene Number",
  }
}
