/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
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
    "name" : "DPT_Access_Data"
  }
}
