'use strict'
// Thin wrapper around knxultimate's KNXClient for the live harness: connect,
// write/read group addresses, and receive decoded bus telegrams. Mirrors exactly
// how nodes/knxUltimate-config.js talks to the bus (same lib, same event names).
const knx = require('knxultimate')
const dptlib = require('knxultimate').dptlib

function connect (knxCfg, { onTelegram, onConnected } = {}) {
  const props = {
    ipAddr: knxCfg.ipAddr,
    ipPort: knxCfg.ipPort || 3671,
    hostProtocol: knxCfg.hostProtocol || 'TunnelUDP',
    physAddr: knxCfg.physAddr || '15.15.250',
    isSecureKNXEnabled: false,
    suppress_ack_ldatareq: false,
    loglevel: knxCfg.loglevel || 'error',
    localIPAddress: ''
  }
  const client = new knx.KNXClient(props)

  client.on(knx.KNXClientEvents.error, (err) => {
    console.error('[KNX] error:', err && err.message ? err.message : err)
  })
  client.on(knx.KNXClientEvents.disconnected, () => console.log('[KNX] disconnected'))
  client.on(knx.KNXClientEvents.connected, () => {
    console.log(`[KNX] connected to ${props.ipAddr}:${props.ipPort} (${props.hostProtocol})`)
    if (onConnected) onConnected(client)
  })
  client.on(knx.KNXClientEvents.indication, (datagram) => {
    try {
      const npdu = datagram.cEMIMessage.npdu
      let evt = null
      if (npdu.isGroupRead) evt = 'GroupValue_Read'
      else if (npdu.isGroupResponse) evt = 'GroupValue_Response'
      else if (npdu.isGroupWrite) evt = 'GroupValue_Write'
      const dest = datagram.cEMIMessage.dstAddress.toString()
      const src = datagram.cEMIMessage.srcAddress.toString()
      if (onTelegram) onTelegram({ evt, dest, src, raw: npdu.dataValue })
    } catch (error) { /* ignore malformed frames */ }
  })

  client.Connect()
  return client
}

function decode (raw, dpt) {
  try { return dptlib.fromBuffer(raw, dptlib.resolve(dpt)) } catch (error) { return `<decode error: ${error.message}>` }
}

module.exports = { connect, decode, dptlib }
