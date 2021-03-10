/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const util = require('util');
const ipaddr = require('ipaddr.js');
const Parser = require('binary-parser').Parser;
const BinaryProtocol = require('binary-protocol');
const KnxProtocol = new BinaryProtocol();
const KnxAddress = require('./Address');
const KnxConstants = require ('./KnxConstants');
const KnxLog = require('./KnxLog');

// defaults
KnxProtocol.twoLevelAddressing = false;
KnxProtocol.lengths = {};

// helper function: what is the byte length of an object?
function knxlen(objectName, context) {
  var lf = KnxProtocol.lengths[objectName];
  return (typeof lf === 'function') ? lf(context) : lf;
}

KnxProtocol.define('IPv4Endpoint', {
  read: function (propertyName) {
    this.pushStack({ addr: null, port: null})
      .raw('addr', 4)
      .UInt16BE('port')
      .tap(function (hdr) {
        hdr.addr = ipaddr.fromByteArray(hdr.addr);
      })
      .popStack(propertyName, function (data) {
        return data.addr.toString() + ':' + data.port;
       });
     },
  write: function (value) {
    if (!value) throw "cannot write null value for IPv4Endpoint"
    else {
      if (!(typeof value === 'string' && value.match(/\d*\.\d*\.\d*\.\d*:\d*/))) {
        throw "Invalid IPv4 endpoint, please set a string as  'ip.add.re.ss:port'";
      }
      var arr = value.split(':');
      this.raw(new Buffer.from(ipaddr.parse(arr[0]).toByteArray()), 4);
      this.UInt16BE(arr[1]);
    }
  }
});
KnxProtocol.lengths['IPv4Endpoint'] = function(value) {
  return (value ? 6 : 0);
};

/* CRI: connection request/response */
// creq[22] = 0x04;  /* structure len (4 bytes) */
// creq[23] = 0x04;  /* connection type: DEVICE_MGMT_CONNECTION = 0x03; TUNNEL_CONNECTION = 0x04; */
// creq[24] = 0x02;  /* KNX Layer (Tunnel Link Layer) */
// creq[25] = 0x00;  /* Reserved */
// ==> 4 bytes
KnxProtocol.define('CRI', {
  read: function (propertyName) {
    this
    .pushStack({ header_length: 0, connection_type: null, knx_layer: null, unused:null}) //
    .UInt8('header_length')
    .UInt8('connection_type')
    .UInt8('knx_layer')
    .UInt8('unused')
    .tap(function (hdr) {
      switch (hdr.connection_type) {
        case KnxConstants.CONNECTION_TYPE.DEVICE_MGMT_CONNECTION:
          break; // TODO
        case KnxConstants.CONNECTION_TYPE.TUNNEL_CONNECTION:
          break; // TODO
        default: throw "Unsupported connection type: " + hdr.connection_type;
      }
    })
    .popStack(propertyName, function (data) {
      if (KnxProtocol.debug) KnxLog.get().debug('read CRI: '+JSON.stringify(data));
      // pop the interim value off the stack and insert the real value into `propertyName`
      return data
    });
  },
  write: function (value) {
    if (!value) KnxLog.get().warn("CRI: cannot write null value for CRI")
    else {
      this
        .UInt8(0x04) // length
        .UInt8(value.connection_type)
        .UInt8(value.knx_layer)
        .UInt8(value.unused);
    }
  }
});
KnxProtocol.lengths['CRI'] = function(value) {
  return (value ? 4 : 0);
};

// connection state response/request
KnxProtocol.define('ConnState', {
  read: function (propertyName) {
    this.pushStack({  channel_id: null, status: null })
    .UInt8('channel_id')
    .UInt8('status')
    .popStack(propertyName, function (data) {
      if (KnxProtocol.debug) KnxLog.get().trace('read ConnState: %j', data);
      return data;
    });
  },
  write: function (value) {
    if (!value) KnxLog.get().error("cannot write null value for ConnState")
    else {
      this
        .UInt8(value.channel_id)
        .UInt8(value.status);
    }
  }
});
KnxProtocol.lengths['ConnState'] = function(value) {
  return (value ? 2 : 0);
}

// connection state response/request
KnxProtocol.define('TunnState', {
  read: function (propertyName) {
    this.pushStack({ header_length: null, channel_id: null, seqnum: null, rsvd: null})
    .UInt8('header_length')
    .UInt8('channel_id')
    .UInt8('seqnum')
    .UInt8('rsvd')
    .tap(function (hdr) {
      if (KnxProtocol.debug) KnxLog.get().trace('reading TunnState: %j', hdr);
      switch (hdr.status) {
        case 0x00:
          break;
        //default: throw "Connection State status: " + hdr.status;
      }
      return hdr;
    })
    .popStack(propertyName, function (data) {
      return data;
    });
  },
  write: function (value) {
    if (!value) KnxLog.get().error("TunnState: cannot write null value for TunnState")
    else {
      if (KnxProtocol.debug) KnxLog.get().trace('writing TunnState: %j', value);
      this
        .UInt8(0x04)
        .UInt8(value.channel_id)
        .UInt8(value.seqnum)
        .UInt8(value.rsvd);
    }
  }
});
KnxProtocol.lengths['TunnState'] = function(value) {
  return (value ? 4 : 0);
}

/* Connection HPAI */
//   creq[6]     =  /* Host Protocol Address Information (HPAI) Lenght */
//   creq[7]     =  /* IPv4 protocol UDP = 0x01, TCP = 0x02; */
//   creq[8-11]  =  /* IPv4 address  */
//   creq[12-13] =  /* IPv4 local port number for CONNECTION, CONNECTIONSTAT and DISCONNECT requests */
// ==> 8 bytes

/* Tunneling HPAI */
//   creq[14]    =  /* Host Protocol Address Information (HPAI) Lenght */
//   creq[15]    =  /* IPv4 protocol UDP = 0x01, TCP = 0x02; */
//   creq[16-19] =  /* IPv4 address  */
//   creq[20-21] =  /* IPv4 local port number for TUNNELING requests */
// ==> 8 bytes
KnxProtocol.define('HPAI', {
  read: function (propertyName) {
    this.pushStack({ header_length: 8, protocol_type: null, tunnel_endpoint: null})
    .UInt8('header_length')
    .UInt8('protocol_type')
    .IPv4Endpoint('tunnel_endpoint')
    .tap(function (hdr) {
      if (this.buffer.length < hdr.header_length) {
        if (KnxProtocol.debug) KnxLog.get().trace('%d %d %d', this.buffer.length, this.offset, hdr.header_length);
        throw "Incomplete KNXNet HPAI header";
      }
      if (KnxProtocol.debug) {
        KnxLog.get().trace('read HPAI: %j, proto = %s', hdr, KnxConstants.keyText('PROTOCOL_TYPE', hdr.protocol_type));
      }
      switch (hdr.protocol_type) {
        case KnxConstants.PROTOCOL_TYPE.IPV4_TCP:
          throw "TCP is not supported";
        default:
      }
    })
    .popStack(propertyName, function (data) {
      return data;
    });
  },
  write: function (value) {
    if (!value) KnxLog.get().error("HPAI: cannot write null value for HPAI")
    else {
      this
        .UInt8(0x08) // length: 8 bytes
        .UInt8(value.protocol_type)
        .IPv4Endpoint(value.tunnel_endpoint);
    }
  }
});
KnxProtocol.lengths['HPAI'] = function(value) {
  return (value ? 8 : 0);
}

/* ==================== APCI ====================== */
//
//  Message Code    = 0x11 - a L_Data.req primitive
//      COMMON EMI MESSAGE CODES FOR DATA LINK LAYER PRIMITIVES
//          FROM NETWORK LAYER TO DATA LINK LAYER
//          +---------------------------+--------------+-------------------------+---------------------+------------------+
//          | Data Link Layer Primitive | Message Code | Data Link Layer Service | Service Description | Common EMI Frame |
//          +---------------------------+--------------+-------------------------+---------------------+------------------+
//          |        L_Raw.req          |    0x10      |                         |                     |                  |
//          +---------------------------+--------------+-------------------------+---------------------+------------------+
//          |                           |              |                         | Primitive used for  | Sample Common    |
//          |        L_Data.req         |    0x11      |      Data Service       | transmitting a data | EMI frame        |
//          |                           |              |                         | frame               |                  |
//          +---------------------------+--------------+-------------------------+---------------------+------------------+
//          |        L_Poll_Data.req    |    0x13      |    Poll Data Service    |                     |                  |
//          +---------------------------+--------------+-------------------------+---------------------+------------------+
//          |        L_Raw.req          |    0x10      |                         |                     |                  |
//          +---------------------------+--------------+-------------------------+---------------------+------------------+
//          FROM DATA LINK LAYER TO NETWORK LAYER
//          +---------------------------+--------------+-------------------------+---------------------+
//          | Data Link Layer Primitive | Message Code | Data Link Layer Service | Service Description |
//          +---------------------------+--------------+-------------------------+---------------------+
//          |        L_Poll_Data.con    |    0x25      |    Poll Data Service    |                     |
//          +---------------------------+--------------+-------------------------+---------------------+
//          |                           |              |                         | Primitive used for  |
//          |        L_Data.ind         |    0x29      |      Data Service       | receiving a data    |
//          |                           |              |                         | frame               |
//          +---------------------------+--------------+-------------------------+---------------------+
//          |        L_Busmon.ind       |    0x2B      |   Bus Monitor Service   |                     |
//          +---------------------------+--------------+-------------------------+---------------------+
//          |        L_Raw.ind          |    0x2D      |                         |                     |
//          +---------------------------+--------------+-------------------------+---------------------+
//          |                           |              |                         | Primitive used for  |
//          |                           |              |                         | local confirmation  |
//          |        L_Data.con         |    0x2E      |      Data Service       | that a frame was    |
//          |                           |              |                         | sent (does not mean |
//          |                           |              |                         | successful receive) |
//          +---------------------------+--------------+-------------------------+---------------------+
//          |        L_Raw.con          |    0x2F      |                         |                     |
//          +---------------------------+--------------+-------------------------+---------------------+

//  Add.Info Length = 0x00 - no additional info
//  Control Field 1 = see the bit structure above
//  Control Field 2 = see the bit structure above
//  Source Address  = 0x0000 - filled in by router/gateway with its source address which is
//                    part of the KNX subnet
//  Dest. Address   = KNX group or individual address (2 byte)
//  Data Length     = Number of bytes of data in the APDU excluding the TPCI/APCI bits
//  APDU            = Application Protocol Data Unit - the actual payload including transport
//                    protocol control information (TPCI), application protocol control
//                    information (APCI) and data passed as an argument from higher layers of
//                    the KNX communication stack


/* ==================== CEMI ====================== */

// CEMI (start at position 6)
// +--------+--------+--------+--------+----------------+----------------+--------+----------------+
// |  Msg   |Add.Info| Ctrl 1 | Ctrl 2 | Source Address | Dest. Address  |  Data  |      APDU      |
// | Code   | Length |        |        |                |                | Length |                |
// +--------+--------+--------+--------+----------------+----------------+--------+----------------+
//   1 byte   1 byte   1 byte   1 byte      2 bytes          2 bytes       1 byte      2 bytes
/*
Control Field 1
          Bit  |
         ------+---------------------------------------------------------------
           7   | Frame Type  - 0x0 for extended frame
               |               0x1 for standard frame
         ------+---------------------------------------------------------------
           6   | Reserved
         ------+---------------------------------------------------------------
           5   | Repeat Flag - 0x0 repeat frame on medium in case of an error
               |               0x1 do not repeat
         ------+---------------------------------------------------------------
           4   | System Broadcast - 0x0 system broadcast
               |                    0x1 broadcast
         ------+---------------------------------------------------------------
           3   | Priority    - 0x0 system
               |               0x1 normal
         ------+               0x2 urgent
           2   |       service_type: -1,        0x3 low
         ------+---------------------------------------------------------------
           1   | Acknowledge Request - 0x0 no ACK requested
               | (L_Data.req)          0x1 ACK requested
         ------+---------------------------------------------------------------
           0   | Confirm      - 0x0 no error
               | (L_Data.con) - 0x1 error
         ------+---------------------------------------------------------------
Control Field 2
          Bit  |
         ------+---------------------------------------------------------------
           7   | Destination Address Type - 0x0 physical address, 0x1 group address
         ------+---------------------------------------------------------------
          6-4  | Hop Count (0-7)
         ------+---------------------------------------------------------------
          3-0  | Extended Frame Format - 0x0 standard frame
         ------+---------------------------------------------------------------
*/
// In the Common EMI frame, the APDU payload is defined as follows:

// +--------+--------+--------+--------+--------+
// | TPCI + | APCI + |  Data  |  Data  |  Data  |
// |  APCI  |  Data  |        |        |        |
// +--------+--------+--------+--------+--------+
//   byte 1   byte 2  byte 3     ...     byte 16

// For data that is 6 bits or less in length, only the first two bytes are used in a Common EMI
// frame. Common EMI frame also carries the information of the expected length of the Protocol
// Data Unit (PDU). Data payload can be at most 14 bytes long.  <p>

// The first byte is a combination of transport layer control information (TPCI) and application
// layer control information (APCI). First 6 bits are dedicated for TPCI while the two least
// significant bits of first byte hold the two most significant bits of APCI field, as follows:

//   Bit 1    Bit 2    Bit 3    Bit 4    Bit 5    Bit 6    Bit 7    Bit 8      Bit 1   Bit 2
// +--------+--------+--------+--------+--------+--------+--------+--------++--------+----....
// |        |        |        |        |        |        |        |        ||        |
// |  TPCI  |  TPCI  |  TPCI  |  TPCI  |  TPCI  |  TPCI  | APCI   |  APCI  ||  APCI  |
// |        |        |        |        |        |        |(bit 1) |(bit 2) ||(bit 3) |
// +--------+--------+--------+--------+--------+--------+--------+--------++--------+----....
// +                            B  Y  T  E    1                            ||       B Y T E  2
// +-----------------------------------------------------------------------++-------------....

//Total number of APCI control bits can be either 4 or 10. The second byte bit structure is as follows:

//   Bit 1    Bit 2    Bit 3    Bit 4    Bit 5    Bit 6    Bit 7    Bit 8      Bit 1   Bit 2
// +--------+--------+--------+--------+--------+--------+--------+--------++--------+----....
// |        |        |        |        |        |        |        |        ||        |
// |  APCI  |  APCI  | APCI/  |  APCI/ |  APCI/ |  APCI/ | APCI/  |  APCI/ ||  Data  |  Data
// |(bit 3) |(bit 4) | Data   |  Data  |  Data  |  Data  | Data   |  Data  ||        |
// +--------+--------+--------+--------+--------+--------+--------+--------++--------+----....
// +                            B  Y  T  E    2                            ||       B Y T E  3
// +-----------------------------------------------------------------------++-------------....

// control field
var ctrlStruct = new Parser()
  // byte 1
  .bit1('frameType')
  .bit1('reserved')
  .bit1('repeat')
  .bit1('broadcast')
  .bit2('priority')
  .bit1('acknowledge')
  .bit1('confirm')
  // byte 2
  .bit1('destAddrType')
  .bit3('hopCount')
  .bit4('extendedFrame');

// APDU: 2 bytes, tcpi = 6 bits, apci = 4 bits, remaining 6 bits = data (when length=1)
KnxProtocol.apduStruct = new Parser()
  .bit6('tpci')
  .bit4('apci')
  .bit6('data')

KnxProtocol.define('APDU', {
  read: function (propertyName) {
    this.pushStack({ apdu_length: null, apdu_raw: null, tpci: null, apci: null, data: null })
    .UInt8('apdu_length')
    .tap(function (hdr) {
      //if (KnxProtocol.debug) KnxLog.get().trace('--- parsing extra %d apdu bytes', hdr.apdu_length+1);
      this.raw('apdu_raw', hdr.apdu_length+1);
    }).tap(function (hdr) {
      // Parse the APDU. tcpi/apci bits split across byte boundary.
      // Typical example of protocol designed by committee.
      var apdu = KnxProtocol.apduStruct.parse(hdr.apdu_raw);
      hdr.tpci = apdu.tpci;
      hdr.apci = KnxConstants.APCICODES[apdu.apci];
      // APDU data should ALWAYS be a buffer, even for 1-bit payloads
      hdr.data = (hdr.apdu_length > 1) ?
        hdr.apdu_raw.slice(2) :
        new Buffer.from([apdu.data]);
      if (KnxProtocol.debug) KnxLog.get().trace(' unmarshalled APDU: %j', hdr);
    })
    .popStack(propertyName, function (data) {
      return data;
    });
  },
  write: function (value) {
    if (!value)      throw "cannot write null APDU value";
    var total_length = knxlen('APDU', value);
    //if (KnxProtocol.debug) KnxLog.get().trace('APDU.write: \t%j (total %d bytes)', value, total_length);
    if (KnxConstants.APCICODES.indexOf(value.apci) == -1) {
      KnxLog.get().error("invalid APCI code: %j", value);
    } else {
      if (total_length < 3) throw util.format("APDU is too small (%d bytes)", total_length);
      if (total_length > 17) throw util.format("APDU is too big (%d bytes)", total_length);
      // camel designed by committee: total length MIGHT or MIGHT NOT include the payload
      //     APDU length (1 byte) + TPCI/APCI: 6+4 bits + DATA: 6 bits (2 bytes)
      // OR: APDU length (1 byte) + TPCI/APCI: 6+4(+6 unused) bits (2bytes) + DATA: (1 to 14 bytes))
      this.UInt8(total_length - 2);
      var word =
        value.tpci * 0x400 +
        KnxConstants.APCICODES.indexOf(value.apci) * 0x40;
      //
      if (total_length == 3) {
        // payload embedded in the last 6 bits
        word += parseInt(isFinite(value.data) && (typeof value.data !== 'object') ? value.data : value.data[0]);
        this.UInt16BE(word);
      } else {
        this.UInt16BE(word);
        // payload follows TPCI+APCI word
        // KnxLog.get().trace('~~~%s, %j, %d', typeof value.data, value.data, total_length);
        this.raw(new Buffer.from(value.data, total_length-3));
      }
    }
  }
});

/* APDU length is truly chaotic: header and data can be interleaved (but
not always!), so that apdu_length=1 means _2_ bytes following the apdu_length */
KnxProtocol.lengths['APDU'] = function(value) {
  if (!value) return 0;
  // if we have the APDU bitlength, usually by the DPT, then simply use it
  if (value.bitlength || (value.data && value.data.bitlength)) {
    var bitlen = value.bitlength || value.data.bitlength;
    // KNX spec states that up to 6 bits of payload must fit into the TPCI
    // if payload larger than 6 bits, than append it AFTER the TPCI
    return 3 + (bitlen > 6 ? Math.ceil(bitlen / 8) : 0);
  }
  // not all requests carry a value; eg read requests
  if (!value.data) value.data = 0;
  if (value.data.length) {
    if (value.data.length < 1) throw ('APDU value is empty');
    if (value.data.length > 14) throw ('APDU value too big, must be <= 14 bytes');
    if (value.data.length == 1) {
      var v = value.data[0];
      if (!isNaN(parseFloat(v)) && isFinite(v) && v >= 0 && v <= 63) {
        // apdu_length + tpci/apci/6-bit integer == 1+2 bytes
        return 3;
      }
    }
    return 3 + value.data.length;
  } else {
    if (!isNaN(parseFloat(value.data)) && isFinite(value.data)
      && value.data >= 0 && value.data <= 63) {
      return 3
    } else {
      KnxLog.get().warn('Fix your code - APDU data payload must be a 6-bit int or an Array/Buffer (1 to 14 bytes), got: %j (%s)', value.data, typeof value.data);
      throw 'APDU payload must be a 6-bit int or an Array/Buffer (1 to 14 bytes)';
    }
  }
}

KnxProtocol.define('CEMI', {
  read: function (propertyName) {
    this.pushStack({ msgcode: 0, addinfo_length: -1, ctrl: null, src_addr: null, dest_addr: null, apdu: null })
    .UInt8('msgcode')
    .UInt8('addinfo_length')
    .raw('ctrl', 2)
    .raw('src_addr', 2)
    .raw('dest_addr', 2)
    .tap(function (hdr) {
      // parse 16bit control field
      hdr.ctrl = ctrlStruct.parse(hdr.ctrl);
      // KNX source addresses are always physical
      hdr.src_addr  = KnxAddress.toString(hdr.src_addr, KnxAddress.TYPE.PHYSICAL);
      hdr.dest_addr = KnxAddress.toString(hdr.dest_addr, hdr.ctrl.destAddrType);
      switch (hdr.msgcode) {
        case KnxConstants.MESSAGECODES['L_Data.req']:
        case KnxConstants.MESSAGECODES['L_Data.ind']:
        case KnxConstants.MESSAGECODES['L_Data.con']: {
          this.APDU('apdu');
          if (KnxProtocol.debug) KnxLog.get().trace('--- unmarshalled APDU ==> %j', hdr.apdu);
        }
      }
      return hdr;
    })
    .popStack(propertyName, function (data) {
      return data;
    });
  },
  write: function (value) {
    if (!value)      throw "cannot write null CEMI value";
    if (KnxProtocol.debug) KnxLog.get().trace('CEMI.write: \n\t%j', value);
    if (value.ctrl === null) throw "no Control Field supplied";
    var ctrlField1 =
      value.ctrl.frameType   * 0x80 +
      value.ctrl.reserved    * 0x40 +
      value.ctrl.repeat      * 0x20 +
      value.ctrl.broadcast   * 0x10 +
      value.ctrl.priority    * 0x04 +
      value.ctrl.acknowledge * 0x02 +
      value.ctrl.confirm;
    var ctrlField2 =
      value.ctrl.destAddrType* 0x80 +
      value.ctrl.hopCount    * 0x10 +
      value.ctrl.extendedFrame;
    this
      .UInt8(value.msgcode)
      .UInt8(value.addinfo_length)
      .UInt8(ctrlField1)
      .UInt8(ctrlField2)
      .raw(KnxAddress.parse(value.src_addr, KnxAddress.TYPE.PHYSICAL), 2)
      .raw(KnxAddress.parse(value.dest_addr, value.ctrl.destAddrType), 2);
    // only need to marshal an APDU if this is a
    // L_Data.* (requet/indication/confirmation)
    switch (value.msgcode) {
      case KnxConstants.MESSAGECODES['L_Data.req']:
      case KnxConstants.MESSAGECODES['L_Data.ind']:
      case KnxConstants.MESSAGECODES['L_Data.con']: {
        if (value.apdu === null) throw "no APDU supplied";
        this.APDU(value.apdu);
      }
    }
  }
});
KnxProtocol.lengths['CEMI'] = function(value) {
  if (!value) return 0;
  var apdu_length = knxlen('APDU', value.apdu);
  if (KnxProtocol.debug) KnxLog.get().trace('knxlen of cemi: %j == %d', value, 8 + apdu_length);
  return 8 + apdu_length;
}


// +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
// | Header Length | Protocol Version 
// | (06h)         | (10h) 
// | +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
// | Service Type Identifier 
// | (2 Octet) 
// | +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
// | Total Length 
// | (2 Octet) 
// | +-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+-7-+-6-+-5-+-4-+-3-+-2-+-1-+-0-+
KnxProtocol.define('KNXNetHeader', {
  read: function (propertyName) {
    this.pushStack({ header_length: 0, protocol_version: -1, service_type: -1, total_length: 0})
    .UInt8   ('header_length')
    .UInt8   ('protocol_version')
    .UInt16BE('service_type')
    .UInt16BE('total_length')
    .tap(function (hdr) {
      if (KnxProtocol.debug) KnxLog.get().trace('read KNXNetHeader :%j', hdr);
      if (this.buffer.length + hdr.header_length < this.total_length)
        throw util.format("Incomplete KNXNet packet: got %d bytes (expected %d)",
          this.buffer.length + hdr.header_length, this.total_length);
      switch (hdr.service_type) {
//        case SERVICE_TYPE.SEARCH_REQUEST:
        case KnxConstants.SERVICE_TYPE.CONNECT_REQUEST: {
          this
            .HPAI('hpai')
            .HPAI('tunn')
            .CRI('cri');
           break;
        }
        case KnxConstants.SERVICE_TYPE.CONNECT_RESPONSE:
        case KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST:
        case KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_RESPONSE:
        case KnxConstants.SERVICE_TYPE.DISCONNECT_REQUEST:
        case KnxConstants.SERVICE_TYPE.DISCONNECT_RESPONSE: {
          this.ConnState('connstate');
          if (hdr.total_length > 8) this.HPAI('hpai');
          if (hdr.total_length > 16) this.CRI('cri');
          break;
        }
        case KnxConstants.SERVICE_TYPE.DESCRIPTION_RESPONSE: {
          this.raw('value', hdr.total_length);
          break;
        }
        // most common case:
        case KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST:
          this.TunnState('tunnstate');
          this.CEMI('cemi');
          break;
        case KnxConstants.SERVICE_TYPE.TUNNELING_ACK:
          this.TunnState('tunnstate');
          break;
        case KnxConstants.SERVICE_TYPE.ROUTING_INDICATION:
          this.CEMI('cemi');
          break;
        default: {
          KnxLog.get().warn("read KNXNetHeader: unhandled serviceType = %s", KnxConstants.keyText('SERVICE_TYPE', hdr.service_type));
        }
      }
    })
    .popStack(propertyName, function (data) {
      if (KnxProtocol.debug) KnxLog.get().trace(JSON.stringify(data, null, 4));
      return data;
    });
  },
  write: function (value) {
    if (!value) throw "cannot write null KNXNetHeader value"
    value.total_length = knxlen('KNXNetHeader', value);
    if (KnxProtocol.debug) KnxLog.get().trace("writing KnxHeader:", value);
    this
      .UInt8(6)    // header length (6 bytes constant)
      .UInt8(0x10) // protocol version 1.0 (anche per KNX Secure) 02/03/2021
      .UInt16BE(value.service_type)
      .UInt16BE(value.total_length);
    switch (value.service_type) {
      //case SERVICE_TYPE.SEARCH_REQUEST:
      case KnxConstants.SERVICE_TYPE.CONNECT_REQUEST: {
        if (value.hpai) this.HPAI(value.hpai);
        if (value.tunn) this.HPAI(value.tunn);
        if (value.cri)  this.CRI(value.cri);
        break;
      }
      case KnxConstants.SERVICE_TYPE.CONNECT_RESPONSE:
      case KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST:
      case KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_RESPONSE:
      case KnxConstants.SERVICE_TYPE.DISCONNECT_REQUEST: {
        if (value.connstate) this.ConnState(value.connstate);
        if (value.hpai)     this.HPAI(value.hpai);
        if (value.cri)      this.CRI(value.cri);
        break;
      }
      // most common case:
      case KnxConstants.SERVICE_TYPE.ROUTING_INDICATION:
      case KnxConstants.SERVICE_TYPE.TUNNELING_ACK:
      case KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST: {
        if (value.tunnstate) this.TunnState(value.tunnstate);
        if (value.cemi)      this.CEMI(value.cemi);
        break;
      }
      // case KnxConstants.SERVICE_TYPE.DESCRIPTION_RESPONSE: {
      default: {
        throw util.format(
          "write KNXNetHeader: unhandled serviceType = %s (%j)",
          KnxConstants.keyText('SERVICE_TYPE', value), value);
      }
    }
  }
});
KnxProtocol.lengths['KNXNetHeader'] = function(value) {
  if (!value) throw "Must supply a valid KNXNetHeader value";
  switch (value.service_type) {
    //case SERVICE_TYPE.SEARCH_REQUEST:
    case KnxConstants.SERVICE_TYPE.CONNECT_REQUEST:
      return 6
        + knxlen('HPAI', value.hpai)
        + knxlen('HPAI', value.tunn)
        + knxlen('CRI', value.cri);
    case KnxConstants.SERVICE_TYPE.CONNECT_RESPONSE:
    case KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST:
    case KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_RESPONSE:
    case KnxConstants.SERVICE_TYPE.DISCONNECT_REQUEST:
      return 6
        + knxlen('ConnState', value.connstate)
        + knxlen('HPAI', value.hpai)
        + knxlen('CRI', value.cri);
    case KnxConstants.SERVICE_TYPE.TUNNELING_ACK:
    case KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST:
      return 6
        + knxlen('TunnState', value.tunnstate)
        + knxlen('CEMI', value.cemi);
    case KnxConstants.SERVICE_TYPE.ROUTING_INDICATION:
      return 6
        + knxlen('CEMI', value.cemi);
    };
}

module.exports = KnxProtocol;
