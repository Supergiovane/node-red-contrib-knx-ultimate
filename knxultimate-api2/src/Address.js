/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/
const KnxLog = require('./KnxLog')
const Parser = require('binary-parser').Parser
const KnxConstants = require('./KnxConstants')

//           +-----------------------------------------------+
// 16 bits   |              INDIVIDUAL ADDRESS               |
//           +-----------------------+-----------------------+
//           | OCTET 0 (high byte)   |  OCTET 1 (low byte)   |
//           +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//    bits   | 7| 6| 5| 4| 3| 2| 1| 0| 7| 6| 5| 4| 3| 2| 1| 0|
//           +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//           |  Subnetwork Address   |                       |
//           +-----------+-----------+     Device Address    |
//           |(Area Adrs)|(Line Adrs)|                       |
//           +-----------------------+-----------------------+

//           +-----------------------------------------------+
// 16 bits   |             GROUP ADDRESS (3 level)           |
//           +-----------------------+-----------------------+
//           | OCTET 0 (high byte)   |  OCTET 1 (low byte)   |
//           +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//    bits   | 7| 6| 5| 4| 3| 2| 1| 0| 7| 6| 5| 4| 3| 2| 1| 0|
//           +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//           |  | Main Grp  | Midd G |       Sub Group       |
//           +--+--------------------+-----------------------+
//           +-----------------------------------------------+
// 16 bits   |             GROUP ADDRESS (2 level)           |
//           +-----------------------+-----------------------+
//           | OCTET 0 (high byte)   |  OCTET 1 (low byte)   |
//           +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//    bits   | 7| 6| 5| 4| 3| 2| 1| 0| 7| 6| 5| 4| 3| 2| 1| 0|
//           +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//           |  | Main Grp  |            Sub Group           |
//           +--+--------------------+-----------------------+
// NOTE: ets4 can utilise all 5 bits for the main group (0..31)
let Address = {}

let threeLevelPhysical = (new Parser()).bit4('l1').bit4('l2').uint8('l3')
let threeLevelGroup = (new Parser()).bit5('l1').bit3('l2').uint8('l3')
let twoLevel = (new Parser()).bit5('l1').bit11('l2')

// convert address stored in two-byte buffer to string
Address.toString = function (buf /* buffer */, addrtype /* ADDRESS_TYPE */, twoLevelAddressing) {
  let group = (addrtype === KnxConstants.KNX_ADDR_TYPES.GROUP)
  let address = null

  // KnxLog.get().trace('%j, type: %d, %j', buf, addrtype, knxnetprotocol.twoLevelAddressing);
  if (!(typeof buf === 'object' && buf.constructor.name === 'Buffer' && buf.length === 2)) {
    throw Error('not a buffer, or not a 2-byte address buffer')
  }

  if (group && twoLevelAddressing) {
    // 2 level group
    let addr = twoLevel.parse(buf)

    address = [addr.l1, addr.l2].join('/')
  } else {
    // 3 level physical or group address
    let sep = (group ? '/' : '.')
    let addr = (group ? threeLevelGroup : threeLevelPhysical).parse(buf)

    address = [addr.l1, addr.l2, addr.l3].join(sep)
  }
  return address
}

// parse address string to 2-byte Buffer
Address.parse = function (addr /* string */, addrtype /* TYPE */, twoLevelAddressing) {
  if (!addr) {
    KnxLog.get().warn('Fix your code - no address given to Address.parse')
  }

  let group = (addrtype === KnxConstants.KNX_ADDR_TYPES.GROUP)
  let address = Buffer.alloc(2)
  let tokens = addr.split((group ? '/' : '.')).filter((w) => { return w.length > 0 })

  if (tokens.length < 2) throw Error('Invalid address (less than 2 tokens)')

  let hinibble = parseInt(tokens[0])
  let midnibble = parseInt(tokens[1])

  if (group && twoLevelAddressing) {
    // 2 level group address
    if (hinibble < 0 || hinibble > 31) throw Error('Invalid KNX 2-level main group')
    if (midnibble < 0 || midnibble > 2047) throw Error('Invalid KNX 2-level sub group')

    address.writeUInt16BE((hinibble << 11) + midnibble, 0)
  } else {
    if (tokens.length < 3) throw Error('Invalid address - missing 3rd token')
    let lonibble = parseInt(tokens[2])

    if (group) {
      // 3 level group address
      if (hinibble < 0 || hinibble > 31) throw Error('Invalid KNX 3-level main group')
      if (midnibble < 0 || midnibble > 7) throw Error('Invalid KNX 3-level mid group')
      if (lonibble < 0 || lonibble > 255) throw Error('Invalid KNX 3-level sub group')

      address.writeUInt8((hinibble << 3) + midnibble, 0)
      address.writeUInt8(lonibble, 1)
    } else {
      // 3 level physical address
      if (hinibble < 0 || hinibble > 15) throw Error('Invalid KNX area address')
      if (midnibble < 0 || midnibble > 15) throw Error('Invalid KNX line address')
      if (lonibble < 0 || lonibble > 255) throw Error('Invalid KNX device address')

      address.writeUInt8((hinibble << 4) + midnibble, 0)
      address.writeUInt8(lonibble, 1)
    }
  }
  return address
}

module.exports = Address
