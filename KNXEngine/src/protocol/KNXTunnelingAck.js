'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KNXTunnelingAck = void 0
const KNXPacket_1 = require('./KNXPacket')
const KNXConstants_1 = require('./KNXConstants')
class KNXTunnelingAck extends KNXPacket_1.KNXPacket {
  constructor (channelID, seqCounter, status) {
    super(KNXConstants_1.KNX_CONSTANTS.TUNNELING_ACK, 4)
    this.channelID = channelID
    this.seqCounter = seqCounter
    this.status = status
  }

  static createFromBuffer (buffer, offset = 0) {
    if (offset >= buffer.length) {
      throw new Error('Buffer too short')
    }
    const structureLength = buffer.readUInt8(offset)
    if (offset + structureLength > buffer.length) {
      throw new Error('Buffer too short')
    }
    offset += 1
    const channelID = buffer.readUInt8(offset++)
    const seqCounter = buffer.readUInt8(offset++)
    const status = buffer.readUInt8(offset)
    return new KNXTunnelingAck(channelID, seqCounter, status)
  }

  toBuffer () {
    const buffer = Buffer.alloc(this.length)
    buffer.writeUInt8(this.length, 0)
    buffer.writeUInt8(this.channelID, 1)
    buffer.writeUInt8(this.seqCounter, 2)
    buffer.writeUInt8(this.status, 3)
    return Buffer.concat([this.header.toBuffer(), buffer])
  }
}
exports.KNXTunnelingAck = KNXTunnelingAck
// # sourceMappingURL=KNXTunnelingAck.js.map
