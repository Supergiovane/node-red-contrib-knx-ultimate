'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.KNXDescriptionResponse = void 0
const KNXConstants_1 = require('./KNXConstants')
const KNXPacket_1 = require('./KNXPacket')
const DeviceInfo_1 = require('./DeviceInfo')
const ServiceFamilies_1 = require('./ServiceFamilies')
class KNXDescriptionResponse extends KNXPacket_1.KNXPacket {
  constructor (deviceInfo, serviceFamilies) {
    super(KNXConstants_1.KNX_CONSTANTS.DESCRIPTION_RESPONSE, deviceInfo.length + serviceFamilies.length)
    this.deviceInfo = deviceInfo
    this.serviceFamilies = serviceFamilies
  }

  static createFromBuffer (buffer, offset = 0) {
    if (offset + this.length >= buffer.length) {
      throw new Error('Buffer too short')
    }
    const deviceInfo = DeviceInfo_1.DeviceInfo.createFromBuffer(buffer, offset)
    offset += deviceInfo.length
    const serviceFamilies = ServiceFamilies_1.ServiceFamilies.createFromBuffer(buffer, offset)
    return new KNXDescriptionResponse(deviceInfo, serviceFamilies)
  }

  toBuffer () {
    return Buffer.concat([
      this.header.toBuffer(),
      this.deviceInfo.toBuffer(),
      this.serviceFamilies.toBuffer()
    ])
  }
}
exports.KNXDescriptionResponse = KNXDescriptionResponse
// # sourceMappingURL=KNXDescriptionResponse.js.map
