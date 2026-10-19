const { expect } = require('chai')
const LDataInd = require('knxultimate/build/protocol/cEMI/LDataInd').default
const { getGroupServiceEvent } = require('../nodes/knxUltimate-config').__test

// cEMI L_Data.ind body without msgCode: addLen, Ctrl1, Ctrl2, src 1.1.10, dst, L, TPCI/APCI...
const parse = (bytes) => LDataInd.createFromBuffer(Buffer.from(bytes))

describe('knxUltimate-config – getGroupServiceEvent', () => {
  it('reports GroupValue_Write to a group address', () => {
    // Ctrl2 AT = 1, dst 1/2/3, L = 1, TPCI 00, APCI 81
    const cemi = parse([0x00, 0xbc, 0xe0, 0x11, 0x0a, 0x0a, 0x03, 0x01, 0x00, 0x81])
    expect(getGroupServiceEvent(cemi)).to.equal('GroupValue_Write')
  })

  it('reports GroupValue_Read and GroupValue_Response to a group address', () => {
    const read = parse([0x00, 0xbc, 0xe0, 0x11, 0x0a, 0x0a, 0x03, 0x01, 0x00, 0x00])
    const response = parse([0x00, 0xbc, 0xe0, 0x11, 0x0a, 0x0a, 0x03, 0x01, 0x00, 0x41])
    expect(getGroupServiceEvent(read)).to.equal('GroupValue_Read')
    expect(getGroupServiceEvent(response)).to.equal('GroupValue_Response')
  })

  it('ignores a point-to-point telegram whose APCI bits look like a group service', () => {
    // Ctrl2 AT = 0, dst 1.1.20, L = 1, TPCI 00, APCI 81
    const cemi = parse([0x00, 0xb0, 0x60, 0x11, 0x0a, 0x11, 0x14, 0x01, 0x00, 0x81])
    expect(cemi.npdu.isGroupWrite).to.equal(true)
    expect(getGroupServiceEvent(cemi)).to.equal(null)
  })

  it('ignores transport control TPDUs (T_Connect, T_ACK, T_Disconnect)', () => {
    const control = { addressType: 0 }
    // As parsed by knxultimate with TPCI-only support
    const tConnect = { control, npdu: { isTransportControl: true, isGroupRead: false, isGroupResponse: false, isGroupWrite: false } }
    // As parsed by knxultimate <= 6.2.0: npdu undefined
    const legacy = { control, npdu: undefined }
    expect(getGroupServiceEvent(tConnect)).to.equal(null)
    expect(getGroupServiceEvent(legacy)).to.equal(null)
  })

  it('keeps hand-built datagrams without an address type', () => {
    const cemi = { control: { repeat: 1 }, npdu: { isGroupWrite: true } }
    expect(getGroupServiceEvent(cemi)).to.equal('GroupValue_Write')
  })

  it('ignores a transport control TPDU even if the group flags were set', () => {
    const cemi = { control: { addressType: 1 }, npdu: { isTransportControl: true, isGroupRead: true } }
    expect(getGroupServiceEvent(cemi)).to.equal(null)
  })
})
