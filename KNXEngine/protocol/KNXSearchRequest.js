'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KNXSearchRequest = void 0
const KNXConstants = require('./KNXConstants')
const KNXPacket = require('./KNXPacket')
const HPAI = require('./HPAI')
class KNXSearchRequest extends KNXPacket.KNXPacket {
  constructor (hpai) {
    super(KNXConstants.KNX_CONSTANTS.SEARCH_REQUEST, hpai.length)
    this.hpai = hpai
  }

  static createFromBuffer (buffer, offset = 0) {
    if (offset >= buffer.length) {
      throw new Error('Buffer too short')
    }
    const hpai = HPAI.HPAI.createFromBuffer(buffer, offset)
    return new KNXSearchRequest(hpai)
  }

  toBuffer () {
    return Buffer.concat([this.header.toBuffer(), this.hpai.toBuffer()])
  }
}
exports.KNXSearchRequest = KNXSearchRequest
// # sourceMappingURL=KNXSearchRequest.js.map
