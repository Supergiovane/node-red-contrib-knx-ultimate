const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const { reviveRawValue } = require('../nodes/knxUltimate-config').__test

// #543: the GA values cache must hold Buffers only, whether the value comes from the persist file or from the bus.
describe('knxUltimate-config – persist file rawValue (#543)', () => {
  it('turns the JSON form of a Buffer back into a Buffer', () => {
    const fromFile = JSON.parse(JSON.stringify({ rawValue: Buffer.from([0x0c, 0x1a]) })).rawValue
    expect(Buffer.isBuffer(fromFile)).to.equal(false)
    const revived = reviveRawValue(fromFile)
    expect(Buffer.isBuffer(revived)).to.equal(true)
    expect(revived.toString('hex')).to.equal('0c1a')
  })

  it('leaves a Buffer received from the bus as it is', () => {
    const buf = Buffer.from([1])
    expect(reviveRawValue(buf)).to.equal(buf)
  })

  it('leaves values that are not a Buffer as they are', () => {
    expect(reviveRawValue(null)).to.equal(null)
    expect(reviveRawValue(undefined)).to.equal(undefined)
    expect(reviveRawValue({ data: 'x' })).to.deep.equal({ data: 'x' })
  })

  it('the initial read from file uses the cached Buffer and issues a READ also with an empty persist file', () => {
    const src = fs.readFileSync(path.join(__dirname, '../nodes/knxUltimate-config.js'), 'utf8')
    const start = src.indexOf('function DoInitialReadFromKNXBusOrFile')
    const loop = src.slice(start, src.indexOf('Then, after all values have been read from file', start))
    expect(loop).to.not.include('rawValue.data')
    expect(loop).to.not.include('node.exposedGAs.length > 0')
    expect(loop).to.include('Buffer.isBuffer(oExposedGA.rawValue)')
  })
})
