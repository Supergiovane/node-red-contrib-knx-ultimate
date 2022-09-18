'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KNXDescriptionRequest = void 0
const KNXConstants_1 = require('./KNXConstants')
const KNXPacket_1 = require('./KNXPacket')
const HPAI_1 = require('./HPAI')
class KNXDescriptionRequest extends KNXPacket_1.KNXPacket {
  constructor (hpai) {
    super(KNXConstants_1.KNX_CONSTANTS.DESCRIPTION_REQUEST, hpai.length)
    this.hpai = hpai
  }

  static createFromBuffer (buffer, offset = 0) {
    if (offset + this.length >= buffer.length) {
      throw new Error('Buffer too short')
    }
    const hpai = HPAI_1.HPAI.createFromBuffer(buffer, offset)
    return new KNXDescriptionRequest(hpai)
  }

  toBuffer () {
    return Buffer.concat([this.header.toBuffer(), this.hpai.toBuffer()])
  }
}
exports.KNXDescriptionRequest = KNXDescriptionRequest
// # sourceMappingURL=KNXDescriptionRequest.js.map
