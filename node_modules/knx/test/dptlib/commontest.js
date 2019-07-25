/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const test = require('tape');
const DPTLib = require('../../src/dptlib');
const assert = require('assert');

/* common DPT unit test. Tries to
- 1. marshal a JS value into an apdu.data (Buffer) and compare it output to the expected value
- 2. unmarshal the produced APDU from step 1 and compare it to the initial JS value
- 3. unmarshal the expected APDU from the test definition and compare it to the initial JS value
*/

// marshalling test (JS value to APDU)
function marshalTest(t, dptid, jsval, apdu) {
  var marshalled = {};
  DPTLib.populateAPDU(jsval, marshalled, dptid);
  // console.log('%j --> %j', apdu.constructor.name, marshalled.data)
  t.deepEqual(marshalled.data, apdu,
    `${dptid}.populateAPDU(${jsval}:${typeof jsval}) should be marshalled as \"0x${apdu.toString('hex')}\", got: \"0x${marshalled.data.toString('hex')}\"`
  );
  return marshalled.data;
};

function unmarshalTest(t, dptid, jsval, data) {
  var dpt = DPTLib.resolve(dptid);
  var unmarshalled = DPTLib.fromBuffer(data, dpt);
  //console.log('%s: %j --> %j', dpt.id, rhs, converted);
  var msg = `${dptid}.fromBuffer(${JSON.stringify(data)}) should unmarshall to ${JSON.stringify(jsval)}, got: ${JSON.stringify(unmarshalled)}`
  switch (typeof jsval) {
    case 'object':
      t.deepEqual(unmarshalled, jsval, msg);
      break;
    case 'number':
      t.equal(unmarshalled.toPrecision(15), jsval.toPrecision(15), msg);
      break;
    default:
      t.ok(unmarshalled == jsval, msg);
  }
};

module.exports = {
  do: function(dptid, tests) {
    var dpt = DPTLib.resolve(dptid);
    var desc = (dpt.hasOwnProperty('subtype') && dpt.subtype.desc) || dpt.basetype.desc;
    test(`${dptid}: ${desc}`, function(t) {
      Object.keys(tests).forEach(function(key) {
        var apdu = Buffer.from(tests[key].apdu_data);
        var jsval = tests[key].jsval;
        //console.log(dptid + ': apdu=%j jsval=%j', apdu, jsval);
        // 1. marshalling test (JS value to APDU)
        var marshalled_data = marshalTest(t, dptid, jsval, apdu);
        // 2. unmarshal from APDU produced by step 1
        unmarshalTest(t, dptid, jsval, marshalled_data);
        // 3. unmarshal from test APDU
        unmarshalTest(t, dptid, jsval, apdu);
      });
      t.end();
    });
  }
}
