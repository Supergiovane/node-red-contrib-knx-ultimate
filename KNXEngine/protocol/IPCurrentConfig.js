'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.IPCurrentConfig = void 0
const KNXConstants_1 = require('./KNXConstants')
const KNXUtils_1 = require('./KNXUtils')
const IP_CURRENT_CONFIG_LENGTH = 20
class IPCurrentConfig {
  constructor (_ip, _mask, gateway, dhcpServer, assignment) {
    this.assignment = assignment
    this._type = KNXConstants_1.KNX_CONSTANTS.IP_CONFIG
    this.ip = _ip
    this.mask = _mask
    this.gateway = gateway
    this.dhcpServer = dhcpServer
    this.assignment = assignment
  }

  get type () {
    return this._type
  }

  set ip (ip) {
    this._splitIP = (0, KNXUtils_1.splitIP)(ip)
  }

  get ip () {
    return this._splitIP.input
  }

  set mask (mask) {
    this._splitMask = (0, KNXUtils_1.splitIP)(mask, 'mask')
  }

  get mask () {
    return this._splitMask.input
  }

  set gateway (gateway) {
    this._splitGateway = (0, KNXUtils_1.splitIP)(gateway, 'gateway')
  }

  set dhcpServer (dhcpServer) {
    this._splitDhcpServer = (0, KNXUtils_1.splitIP)(dhcpServer, 'dhcpServer')
  }

  get dhcpServer () {
    return this._splitDhcpServer.input
  }

  get length () {
    return IP_CURRENT_CONFIG_LENGTH
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
    if (type !== KNXConstants_1.KNX_CONSTANTS.IP_CONFIG) {
      throw new Error(`Invalid IPConfig type ${type}`)
    }
    const ip = []
    for (let i = 1; i <= 4; i++) {
      ip.push(buffer.readUInt8(offset++))
    }
    const textIP = ip.join('.')
    const mask = []
    for (let i = 1; i <= 4; i++) {
      mask.push(buffer.readUInt8(offset++))
    }
    const textMask = mask.join('.')
    const gateway = []
    for (let i = 1; i <= 4; i++) {
      gateway.push(buffer.readUInt8(offset++))
    }
    const textGateway = gateway.join('.')
    const dhcpServer = []
    for (let i = 1; i <= 4; i++) {
      dhcpServer.push(buffer.readUInt8(offset++))
    }
    const textDhcpServer = dhcpServer.join('.')
    const assignment = buffer.readUInt8(offset)
    return new IPCurrentConfig(textIP, textMask, textGateway, textDhcpServer, assignment)
  }

  toBuffer () {
    const buffer = Buffer.alloc(this.length)
    let offset = 0
    buffer.writeUInt8(this.length, offset++)
    buffer.writeUInt8(KNXConstants_1.KNX_CONSTANTS.IP_CONFIG, offset++)
    for (let i = 1; i <= KNXConstants_1.KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
      buffer.writeUInt8(Number(this._splitIP[i]), offset++)
    }
    for (let i = 1; i <= KNXConstants_1.KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
      buffer.writeUInt8(Number(this._splitMask[i]), offset++)
    }
    for (let i = 1; i <= KNXConstants_1.KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
      buffer.writeUInt8(Number(this._splitGateway[i]), offset++)
    }
    for (let i = 1; i <= KNXConstants_1.KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
      buffer.writeUInt8(Number(this._splitDhcpServer[i]), offset++)
    }
    buffer.writeUInt8(this.assignment, offset)
    return buffer
  }
}
exports.IPCurrentConfig = IPCurrentConfig

// # sourceMappingURL=IPCurrentConfig.js.map
