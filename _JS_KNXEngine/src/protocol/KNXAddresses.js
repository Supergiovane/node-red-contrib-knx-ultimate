'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KNXAddresses = void 0
const KNXConstants_1 = require('./KNXConstants')
const KNXAddress_1 = require('./KNXAddress')
class KNXAddresses {
  constructor () {
    this._type = KNXConstants_1.KNX_CONSTANTS.KNX_ADDRESSES
    this._addresses = new Set()
  }

  get length () {
    return 2 + this._addresses.size * 2
  }

  get type () {
    return this._type
  }

  static createFromBuffer (buffer, offset = 0) {
    if (offset + this.length >= buffer.length) {
      throw new Error(`offset ${offset} out of buffer range ${buffer.length}`)
    }
    const structureLength = buffer.readUInt8(offset)
    if (offset + structureLength > buffer.length) {
      throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`)
    }
    offset++
    const type = buffer.readUInt8(offset++)
    if (type !== KNXConstants_1.KNX_CONSTANTS.KNX_ADDRESSES) {
      throw new Error(`Invalid KNXAddresses type ${type}`)
    }
    const knxAddresses = new KNXAddresses()
    for (let i = 2; i < structureLength; i += 2) {
      knxAddresses.add(buffer.readUInt16BE(offset))
      offset += 2
    }
    return knxAddresses
  }

  add (address) {
    this._addresses.add(KNXAddress_1.KNXAddress.createFromString(address))
  }

  toBuffer () {
    const buffer = Buffer.alloc(this.length)
    let offset = 0
    buffer.writeUInt8(this.length, offset++)
    buffer.writeUInt8(KNXConstants_1.KNX_CONSTANTS.KNX_ADDRESSES, offset++)
    for (const knxAddress of this._addresses) {
      buffer.writeUInt16BE(knxAddress.get(), offset)
      offset += 2
    }
    return buffer
  }
}
exports.KNXAddresses = KNXAddresses
// # sourceMappingURL=KNXAddresses.js.map
