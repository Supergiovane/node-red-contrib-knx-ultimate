/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog')

//
// DPT16: ASCII string (max 14 chars)
//

// Write to BUS
exports.formatAPDU = function (value) {
  if (typeof value !== 'string') {
    knxLog.get().error('Must supply a string value. Autoconversion to string')
    try {
      value = value.toString()
    } catch (error) {
      value = 'DPT Err'
    }
  }

  const buf = Buffer.alloc(14)
  if (this.subtypeid === '001') buf.write(value, 'latin1')
  if (this.subtypeid === '000') buf.write(value, 'ascii')
  return buf
}

// Read from BUS
exports.fromBuffer = function (buf) {
  if (buf.length != 14) {
    knxLog.get().error('DPT6: Buffer should be 14 byte long, got', buf.length)
    return null
  }
  if (this.subtypeid === '001') return buf.toString('latin1')
  if (this.subtypeid === '000') return buf.toString('ascii')
}

// DPT16 basetype info
exports.basetype = {
  bitlength: 14 * 8,
  valuetype: 'basic',
  desc: '14-character string',
  help:
    `// Send a text to a display
msg.payload = "Hello!"
return msg;`,
  helplink: ''
}

// DPT9 subtypes
exports.subtypes = {
  // 16.000 ASCII string
  '000': {
    use: 'G',
    desc: 'DPT_String_ASCII',
    name: 'ASCII string',
    force_encoding: 'US-ASCII'
  },

  // 16.001 ISO-8859-1 string
  '001': {
    use: 'G',
    desc: 'DPT_String_8859_1',
    name: 'ISO-8859-1 string',
    force_encoding: 'ISO-8859-1'
  }
}
