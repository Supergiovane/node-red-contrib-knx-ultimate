/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
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
