'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KNXDisconnectRequest = void 0
const KNXConstants_1 = require('./KNXConstants')
const KNXPacket_1 = require('./KNXPacket')
const HPAI_1 = require('./HPAI')
class KNXDisconnectRequest extends KNXPacket_1.KNXPacket {
  constructor (channelID, hpaiControl = HPAI_1.HPAI.NULLHPAI) {
    super(KNXConstants_1.KNX_CONSTANTS.DISCONNECT_REQUEST, hpaiControl.length + 2)
    this.channelID = channelID
    this.hpaiControl = hpaiControl
  }

  static createFromBuffer (buffer, offset = 0) {
    if (offset >= buffer.length) {
      throw new Error('Buffer too short')
    }
    const channelID = buffer.readUInt8(offset++)
    offset++
    const hpaiControl = HPAI_1.HPAI.createFromBuffer(buffer, offset)
    return new KNXDisconnectRequest(channelID, hpaiControl)
  }

  toBuffer () {
    const buffer = Buffer.alloc(2)
    buffer.writeUInt8(this.channelID, 0)
    buffer.writeUInt8(0, 1)
    return Buffer.concat([
      this.header.toBuffer(),
      buffer,
      this.hpaiControl.toBuffer()
    ])
  }
}
exports.KNXDisconnectRequest = KNXDisconnectRequest
// # sourceMappingURL=KNXDisconnectRequest.js.map
