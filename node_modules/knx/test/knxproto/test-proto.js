/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const knxnetprotocol = require('../../src/KnxProtocol.js');
const assert = require('assert');
const test = require('tape');
knxnetprotocol.debug = true;

//
test('KNX protocol unmarshaller', function(t) {
  var tests = {
    "ETS5 programming request": new Buffer([
      6, 16,   4,  32,  0,  20,  4,  34,
      1,  0, 197,   0, 17, 252, 17, 253,
      17, 1,   0, 238
    ])
  };
  Object.keys(tests).forEach((key, idx) => {
    var buf = tests[key];
    // unmarshal from a buffer...
    var reader = knxnetprotocol.createReader(buf);
    var writer = knxnetprotocol.createWriter();
    reader.KNXNetHeader('tmp');
    var decoded = reader.next()['tmp'];
    console.log("\n=== %s: %j ===> %j", key, buf, decoded);
    t.ok(decoded != undefined, `${key}: unmarshaled KNX datagram`);
  });
  t.end();
});

test('KNX protocol marshal+unmarshal', function(t) {
  var tests = {
    CONNECT_REQUEST: new Buffer(
      "06100205001a0801c0a80ab3d96d0801c0a80ab3d83604040200", 'hex'),
    CONNECT_RESPONSE: new Buffer(
      "061002060014030008010a0c17350e5704040000", 'hex'),
    "CONNECT_RESPONSE, failure E_NO_MORE_CONNECTIONS: 0x24": new Buffer(
      "0610020600080024", 'hex'),
    "tunneling request (GroupValue_Read) apdu=1byte": new Buffer(
      "061004200015040200002e00bce000000832010000", 'hex'),
    "tunneling request (GroupValue_Write) apdu=1byte": new Buffer(
      "061004200015040200002e00bce000000832010081", 'hex'),
    "tunneling request (GroupValue_Write) apdu=2byte": new Buffer(
      "061004200016040201002900bce00000083b0200804a", 'hex'),
    "routing indication": new Buffer(
      "0610053000112900bce0ff0f0908010000", 'hex'),
    DISCONNECT_REQUEST: new Buffer([
      6,  16,   2, 9, 0, 16, 142, 142,
      8, 1,  192, 168, 2, 222, 14, 87
    ]),
  };
  Object.keys(tests).forEach((key, idx) => {
    var buf = tests[key];
    // unmarshal from a buffer...
    var reader = knxnetprotocol.createReader(buf);
    var writer = knxnetprotocol.createWriter();
    reader.KNXNetHeader('tmp');
    var decoded = reader.next()['tmp'];
    console.log("\n=== %s: %j ===> %j", key, buf, decoded);
    t.ok(decoded != undefined, `${key}: unmarshaled KNX datagram`);
    // then marshal the datagram again into a buffer...
    writer.KNXNetHeader(decoded);
    if (Buffer.compare(buf, writer.buffer) != 0) {
      console.log("\n\n========\n  FAIL: %s\n========\nbuffer is different:\n", key);
      console.log('             0 1 2 3 4 5|6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9')
      console.log('expected   : %s', buf.toString('hex'));
      console.log('got instead: %s', writer.buffer.toString('hex'));
    }
    t.ok(Buffer.compare(buf, writer.buffer) == 0);
  });
  t.end();
});

test('KNX protocol marshaller', function(t) {
  var tests = {
    "compose tunneling request (write) apdu=1byte - turn ON a light": {
      hexbuf: "061004200015040200002e00bce000000832010081",
      dgram: {
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 21,
        tunnstate: {
          header_length: 4,
          channel_id: 2,
          seqnum: 0,
          rsvd: 0
        },
        cemi: {
          msgcode: 46,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 1,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '0.0.0',
          dest_addr: '1/0/50',
          apdu: {
            tpci: 0,
            apci: 'GroupValue_Write',
            data: 1
          }
        }
      }
    },

    "compose tunneling request (write) apdu=1byte - turn OFF a light": {
      hexbuf: "061004200015040200002e00bce000000832010080",
      dgram: {
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 21,
        tunnstate: {
          header_length: 4,
          channel_id: 2,
          seqnum: 0,
          rsvd: 0
        },
        cemi: {
          msgcode: 46,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 1,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '0.0.0',
          dest_addr: '1/0/50',
          apdu: {
            tpci: 0,
            apci: 'GroupValue_Write',
            data: [0]
          }
        }
      }
    },

    "compose tunneling request (write) apdu=2byte - DIMMING a light to 10%": {
      hexbuf: "061004200016040200002e00bce0000008320200800a",
      dgram: {
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 21,
        tunnstate: {
          header_length: 4,
          channel_id: 2,
          seqnum: 0,
          rsvd: 0
        },
        cemi: {
          msgcode: 46,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 1,
            hopCount: 6,
            extendedFrame: 0
          },
          src_addr: '0.0.0',
          dest_addr: '1/0/50',
          apdu: {
            bitlength: 8,
            tpci: 0,
            apci: 'GroupValue_Write',
            data: [10]
          }
        }
      }
    },

    "temperature response, apdu=2-byte": {
      hexbuf: "061004200017040200002e00BCD0110B000F0300400730",
      dgram: {
        header_length: 6,
        protocol_version: 16,
        service_type: 1056,
        total_length: 22,
        tunnstate: {
          header_length: 4,
          channel_id: 2,
          seqnum: 0,
          rsvd: 0
        },
        cemi: {
          msgcode: 46,
          addinfo_length: 0,
          ctrl: {
            frameType: 1,
            reserved: 0,
            repeat: 1,
            broadcast: 1,
            priority: 3,
            acknowledge: 0,
            confirm: 0,
            destAddrType: 1,
            hopCount: 5,
            extendedFrame: 0
          },
          src_addr: '1.1.11',
          dest_addr: '0/0/15',
          apdu: {
            bitlength: 16,
            tpci: 0,
            apci: 'GroupValue_Response',
            data: [0x07, 0x30]
          }
        }
      }
    },
  }


  Object.keys(tests).forEach((key, idx) => {
    var testcase = tests[key];
    var buf = typeof testcase.hexbuf == 'string' ?
        new Buffer(testcase.hexbuf.replace(/\s/g, ''), 'hex') : hexbuf;
    console.log("\n=== %s", key);
    // marshal the test datagram
    var writer = knxnetprotocol.createWriter();
    writer.KNXNetHeader(testcase.dgram);
    if (Buffer.compare(buf, writer.buffer) != 0) {
      // if this fails, unmarshal the buffer again to a datagram
      var reader = knxnetprotocol.createReader(writer.buffer);
      reader.KNXNetHeader('tmp');
      var decoded = reader.next()['tmp'];
      console.log("\n\n========\n  FAIL: %s\n========\nbuffer is different:\n", key);
      console.log('             0 1 2 3 4 5|6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9')
      console.log('expected   : %s', buf.toString('hex'));
      console.log('got instead: %s', writer.buffer.toString('hex'));
    }
    t.ok(Buffer.compare(buf, writer.buffer) == 0);
  });
  t.end();
});
