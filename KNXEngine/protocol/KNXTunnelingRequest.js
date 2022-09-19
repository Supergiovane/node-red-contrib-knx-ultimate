'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KNXTunnelingRequest = void 0
const KNXPacket = require('./KNXPacket')
const KNXConstants = require('./KNXConstants')
const CEMIFactory = require('./cEMI/CEMIFactory')
class KNXTunnelingRequest extends KNXPacket.KNXPacket {
  constructor (channelID, seqCounter, cEMIMessage) {
    super(KNXConstants.KNX_CONSTANTS.TUNNELING_REQUEST, 4 + cEMIMessage.length)
    this.channelID = channelID
    this.seqCounter = seqCounter
    this.cEMIMessage = cEMIMessage
  }

  static parseCEMIMessage (buffer, offset) {
    if (offset > buffer.length) {
      throw new Error('Buffer too short')
    }
    const msgCode = buffer.readUInt8(offset++)
    return CEMIFactory.CEMIFactory.createFromBuffer(msgCode, buffer, offset)
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
    offset++
    const cEMIMessage = this.parseCEMIMessage(buffer, offset)
    return new KNXTunnelingRequest(channelID, seqCounter, cEMIMessage)
  }

  toBuffer () {
    const buffer = Buffer.alloc(4)
    buffer.writeUInt8(4, 0)
    buffer.writeUInt8(this.channelID, 1)
    buffer.writeUInt8(this.seqCounter, 2)
    buffer.writeUInt8(0, 3)
    return Buffer.concat([this.header.toBuffer(), buffer, this.cEMIMessage.toBuffer()])
  }
}
exports.KNXTunnelingRequest = KNXTunnelingRequest
// # sourceMappingURL=KNXTunnelingRequest.js.map
