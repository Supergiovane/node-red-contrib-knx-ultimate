/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2023 Supergiovane
*/

const knxLog = require('./../KnxLog')

//
// DPT28: ASCII string (variable length) UTF-8
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

  try {
    const buf = Buffer.alloc(14)
    if (this.subtypeid === '001') buf.write(value, 'utf-8')
    return buf
  } catch (error) {
    return error.message
  }
}

// Read from BUS
exports.fromBuffer = function (buf) {
  // nog length check because this is variable
  // if (buf.length != 14) {
  //  knxLog.get().error('DPT28: Buffer should be 14 byte long, got', buf.length)
  //  return null
  // }
  if (this.subtypeid === '001') return buf.toString('utf-8')
}

// DPT28 basetype info
exports.basetype = {
  bitlength: 14 * 8,
  valuetype: 'basic',
  desc: '14-character string',
  help:
        `// Send a text to a display
msg.payload = "Hello UTF-8!"
return msg;`,
  helplink: ''
}

// DPT28 subtypes
exports.subtypes = {
  // 28.001 UTF-8 string
  '001': {
    use: 'G',
    desc: 'DPT_String_UTF-8',
    name: 'UTF-8 string',
    force_encoding: 'UTF-8'
  }
}
