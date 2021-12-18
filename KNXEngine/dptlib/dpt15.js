/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

//
//  DPT15.*: Access data
//

// TODO: implement fromBuffer, formatAPDU

//  DPT15 base type info
exports.basetype = {
  "bitlength" : 32,
  "valuetype" : "basic",
  "desc" : "4-byte access control data"
}

//  DPT15 subtypes info
exports.subtypes = {
  "000" : {
    "name" : "Entrance access"
  }
}
