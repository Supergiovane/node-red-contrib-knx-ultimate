'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TLVInfo = void 0
class TLVInfo {
  constructor (type, length, info) {
    this.type = type
    this.length = length
    this.info = info
  }

  static createFromBuffer (buffer, offset = 0) {
    const type = buffer.readUInt8(offset++)
    const length = buffer.readUInt8(offset++)
    const info = Buffer.alloc(length)
    for (let i = 0; i < length; i++) {
      info.writeUInt8(buffer.readUInt8(offset++), i)
    }
    return new TLVInfo(type, length, info)
  }

  toBuffer () {
    const buffer = Buffer.alloc(2)
    buffer.writeUInt8(this.type, 0)
    buffer.writeUInt8(this.length, 1)
    return Buffer.concat([buffer, this.info])
  }
}
exports.TLVInfo = TLVInfo
// # sourceMappingURL=TLVInfo.js.map
