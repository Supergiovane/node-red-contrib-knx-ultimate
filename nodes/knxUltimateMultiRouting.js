// KNX Multi Routing - interconnect multiple KNX Ultimate gateways via Node-RED flows
const loggerClass = require('./utils/sysLogger')
const os = require('os')

const toBoolean = (value, fallback) => {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  const s = String(value).trim().toLowerCase()
  if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true
  if (s === 'false' || s === '0' || s === 'no' || s === 'off') return false
  return fallback
}

const safeNumber = (value, fallback) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

const normalizeHex = (value) => {
  if (value === undefined || value === null) return ''
  const s = String(value).trim()
  if (s === '') return ''
  return s.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '')
}

const bufferFromMaybe = (value) => {
  if (value === undefined || value === null) return null
  if (Buffer.isBuffer(value)) return value
  if (Array.isArray(value)) return Buffer.from(value)
  if (typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) return Buffer.from(value.data)
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return null
    // Heuristic: if hex-like, decode as hex, else base64
    if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0) return Buffer.from(trimmed, 'hex')
    try { return Buffer.from(trimmed, 'base64') } catch (e) { return null }
  }
  return null
}

const CEMI_L_DATA_REQ = 0x11
const CEMI_L_DATA_IND = 0x29

const isWildcardHost = (host) => {
  const h = host === undefined || host === null ? '' : String(host).trim()
  return h === '' || h === '0.0.0.0' || h === '::' || h === '::0'
}

const guessAdvertiseHost = (listenHost) => {
  if (listenHost && !isWildcardHost(listenHost)) return String(listenHost)
  try {
    const ifaces = os.networkInterfaces()
    for (const entries of Object.values(ifaces)) {
      for (const entry of entries || []) {
        if (entry.family === 'IPv4' && !entry.internal) return entry.address
      }
    }
  } catch (e) { /* ignore */ }
  return '127.0.0.1'
}

let _knxultimateCache = null
const getKnxultimate = () => {
  if (_knxultimateCache) return _knxultimateCache
  _knxultimateCache = require('knxultimate')
  return _knxultimateCache
}

module.exports = function (RED) {
  function knxUltimateMultiRouting (config) {
    RED.nodes.createNode(this, config)
    const node = this

    node.mode = config.mode || 'gateway' // 'gateway' | 'server'
    node.serverKNX = (config.server && RED.nodes.getNode(config.server)) || undefined
    if (node.mode !== 'server' && node.serverKNX === undefined) {
      node.status({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })
      return
    }

    node.name = config.name || 'KNX Multi Routing'
    node.outputtopic = config.outputtopic || node.name
    node.topic = node.outputtopic
    node.dpt = ''

    // Capture all bus events
    node.listenallga = true
    node.notifyreadrequest = true
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.isMultiRouting = true

    // Forwarding controls (input -> KNX bus)
    // Basic loop protection: drop messages already tagged as originating from this same gateway.
    node.dropIfSameGateway = config.dropIfSameGateway !== undefined ? (config.dropIfSameGateway === true || config.dropIfSameGateway === 'true') : true
    node.respectRoutingCounter = toBoolean(config.respectRoutingCounter, true)
    node.decrementRoutingCounter = toBoolean(config.decrementRoutingCounter, false)

    // KNX/IP tunneling server (optional)
    node.tunnelServer = null
    node.tunnelSessions = new Set()
    node.tunnelGatewayId = ''
    node.tunnelAssignedIndividualAddress = ''
    node.tunnelAdvertiseHostTimer = null
    node.tunnelStatusRefreshTimer = null
    node.tunnelRxCount = 0
    node.tunnelLastRxAt = 0

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      try {
        if (provider && typeof provider.applyStatusUpdate === 'function') {
          provider.applyStatusUpdate(node, status)
        } else {
          node.status(status)
        }
      } catch (error) {
        try { node.status(status) } catch (e2) { /* ignore */ }
      }
    }

    const updateStatus = (status) => {
      if (!status) return
      pushStatus(status)
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      try {
        if ((node.mode !== 'server') && (node.serverKNX === null || node.serverKNX === undefined)) { updateStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
        const dDate = new Date()
        const ts = (node.serverKNX && typeof node.serverKNX.formatStatusTimestamp === 'function')
          ? node.serverKNX.formatStatusTimestamp(dDate)
          : `${dDate.getDate()}, ${dDate.toLocaleTimeString()}`
        GA = (typeof GA === 'undefined' || GA === '') ? '' : '(' + GA + ') '
        devicename = devicename || ''
        dpt = (typeof dpt === 'undefined' || dpt === '') ? '' : ' DPT' + dpt
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload
        updateStatus({ fill, shape, text: GA + payload + (node.listenallga === true ? ' ' + devicename : '') + ' (' + ts + ') ' + (text || '') })
      } catch (error) { /* empty */ }
    }

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { /* empty */ }

    const localGatewayIds = () => {
      const ids = new Set()
      if (node.serverKNX && node.serverKNX.id) ids.add(String(node.serverKNX.id))
      if (node.tunnelGatewayId) ids.add(String(node.tunnelGatewayId))
      return ids
    }

    // Called by knxUltimate-config.js to deliver bus telegrams (raw APDU + addresses)
    node.handleSend = (msg) => {
      try {
        const processed = applyRoutingCounterOnOutboundMsg(msg)
        if (!processed) return
        node.send(processed)
      } catch (error) {
        node.sysLogger?.error(`knxUltimateMultiRouting: output error: ${error.message}`)
      }
    }

    const tryParseCemiHex = (cemiHex) => {
      const clean = normalizeHex(cemiHex)
      if (!clean || clean.length % 2 !== 0) return null
      let KNXTunnelingRequest
      try { ({ KNXTunnelingRequest } = getKnxultimate()) } catch (e) { return null }
      try { return KNXTunnelingRequest.parseCEMIMessage(Buffer.from(clean, 'hex'), 0) } catch (e) { return null }
    }

    const getHopCountFromCemiHex = (cemiHex) => {
      const cemi = tryParseCemiHex(cemiHex)
      const hop = cemi && cemi.control ? Number(cemi.control.hopCount) : NaN
      return Number.isFinite(hop) ? hop : null
    }

    const decrementHopCountInCemiHex = (cemiHex) => {
      const cemi = tryParseCemiHex(cemiHex)
      if (!cemi || !cemi.control) return null
      const hop = Number(cemi.control.hopCount)
      if (!Number.isFinite(hop)) return null
      if (hop <= 0) return { oldHopCount: hop, newHopCount: hop, cemiHex: cemi.toBuffer().toString('hex') }
      const newHop = hop - 1
      cemi.control.hopCount = newHop
      return { oldHopCount: hop, newHopCount: newHop, cemiHex: cemi.toBuffer().toString('hex') }
    }

    const applyRoutingCounterOnOutboundMsg = (msg) => {
      if (!msg) return msg
      const p = msg.payload !== undefined ? msg.payload : msg
      const k = (p && p.knx) ? p.knx : (msg && msg.knx ? msg.knx : null)
      if (!k || typeof k !== 'object') return msg
      const cemiHex = (k.cemi && (k.cemi.hex || k.cemi)) ? (k.cemi.hex || k.cemi) : ''
      if (!cemiHex) return msg

      const hopCount = getHopCountFromCemiHex(cemiHex)
      if (hopCount !== null) {
        try { k.routingCounter = hopCount } catch (e) { /* ignore */ }
        try {
          if (k.cemi && typeof k.cemi === 'object') k.cemi.hopCount = hopCount
        } catch (e) { /* ignore */ }
      }

      if (node.respectRoutingCounter && hopCount === 0) {
        node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Dropped (routing counter 0)', payload: k.event || '', GA: k.destination || '', dpt: '', devicename: k.source || '' })
        return null
      }

      if (!node.decrementRoutingCounter) return msg
      if (hopCount === null) return msg

      const dec = decrementHopCountInCemiHex(cemiHex)
      if (!dec) return msg

      if (node.respectRoutingCounter && dec.newHopCount === 0) {
        node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Dropped (routing counter 0)', payload: k.event || '', GA: k.destination || '', dpt: '', devicename: k.source || '' })
        return null
      }

      try {
        if (k.cemi && typeof k.cemi === 'object' && 'hex' in k.cemi) k.cemi.hex = dec.cemiHex
        else k.cemi = dec.cemiHex
      } catch (e) { /* ignore */ }
      try { k.routingCounter = dec.newHopCount } catch (e) { /* ignore */ }
      try { if (k.cemi && typeof k.cemi === 'object') k.cemi.hopCount = dec.newHopCount } catch (e) { /* ignore */ }
      return msg
    }

    const parseIncoming = (msg) => {
      const p = (msg && msg.payload !== undefined) ? msg.payload : msg
      const k = (p && p.knx) ? p.knx : (msg && msg.knx ? msg.knx : p)
      if (!k || typeof k !== 'object') return null
      const destination = k.destination || k.grpaddr || k.ga || (k.address && k.address.destination) || ''
      const source = k.source || (k.address && k.address.source) || ''
      const event = k.event || ''

      const apdu = k.apdu || {}
      const apduData = bufferFromMaybe(apdu.data !== undefined ? apdu.data : (k.rawValue !== undefined ? k.rawValue : k.apduData))
      const bitlength = Number(apdu.bitlength !== undefined ? apdu.bitlength : (k.bitlength !== undefined ? k.bitlength : (apduData ? apduData.length * 8 : 0)))
      const cemiHex = (k.cemi && (k.cemi.hex || k.cemi)) ? (k.cemi.hex || k.cemi) : ''
      const hopCount = cemiHex ? getHopCountFromCemiHex(cemiHex) : null

      const routing = (p && p.knxMultiRouting) ? p.knxMultiRouting : (msg && msg.knxMultiRouting ? msg.knxMultiRouting : null)
      const originGatewayId = routing && routing.gateway && routing.gateway.id ? String(routing.gateway.id) : ''
      return { event, destination, source, apduData, bitlength, originGatewayId, cemiHex, hopCount }
    }

    const canForwardToGateway = (parsed) => {
      if (!parsed) return false
      if (!parsed.destination || typeof parsed.destination !== 'string') return false
      if (!node.serverKNX || node.serverKNX.linkStatus !== 'connected' || !node.serverKNX.knxConnection) return false
      if (node.dropIfSameGateway && parsed.originGatewayId && localGatewayIds().has(String(parsed.originGatewayId))) return false
      if (node.respectRoutingCounter && parsed.hopCount === 0) return false
      return true
    }

    const forwardToBus = (parsed) => {
      const client = node.serverKNX.knxConnection
      if (parsed.cemiHex) {
        const cemi = tryParseCemiHex(parsed.cemiHex)
        if (cemi && cemi.control) {
          // Apply routing-counter checks while forwarding to the BUS.
          const hop = Number(cemi.control.hopCount)
          if (Number.isFinite(hop)) {
            if (node.respectRoutingCounter && hop === 0) return
          }

          const isSerial = typeof client.isSerialTransport === 'function' ? client.isSerialTransport() : false
          const hostProtocol = client && client._options && client._options.hostProtocol ? String(client._options.hostProtocol) : ''
          let KNXProtocol
          try { ({ KNXProtocol } = getKnxultimate()) } catch (e) { KNXProtocol = null }
          if (!KNXProtocol || typeof client.send !== 'function') {
            // fall back to legacy methods below
          } else if (hostProtocol === 'Multicast' || isSerial) {
            cemi.msgCode = hostProtocol === 'Multicast' ? CEMI_L_DATA_IND : CEMI_L_DATA_REQ
            const knxPacketRequest = KNXProtocol.newKNXRoutingIndication(cemi)
            const expected = (typeof client.getSeqNumber === 'function') ? client.getSeqNumber() : 0
            client.send(knxPacketRequest, undefined, false, expected)
            return
          } else {
            // Tunneling
            cemi.msgCode = CEMI_L_DATA_REQ
            try {
              if (hostProtocol === 'TunnelTCP') cemi.control.ack = 0
              else cemi.control.ack = (client._options && client._options.suppress_ack_ldatareq) ? 0 : 1
            } catch (e) { /* ignore */ }

            const seqNum = (hostProtocol === 'TunnelTCP' && typeof client.secureIncTunnelSeq === 'function')
              ? client.secureIncTunnelSeq()
              : (typeof client.incSeqNumber === 'function' ? client.incSeqNumber() : 0)

            const ch = (client.channelID !== undefined && client.channelID !== null) ? client.channelID : (client._channelID || 0)
            const knxPacketRequest = KNXProtocol.newKNXTunnelingRequest(ch, seqNum, cemi)
            const wantsAck = !(client._options && client._options.suppress_ack_ldatareq)
            client.send(knxPacketRequest, wantsAck ? knxPacketRequest : undefined, false, seqNum)
            return
          }
        }
      }

      // Legacy: re-create telegram from event+APDU (routing counter will be reset by the library).
      const ga = parsed.destination
      if (parsed.event === 'GroupValue_Write') {
        if (!parsed.apduData) return
        if (typeof client.writeRaw !== 'function') throw new Error('KNX client does not support writeRaw')
        client.writeRaw(ga, parsed.apduData, parsed.bitlength)
        return
      }
      if (parsed.event === 'GroupValue_Response') {
        if (!parsed.apduData) return
        if (typeof client.respondRaw !== 'function') throw new Error('KNX client does not support respondRaw')
        client.respondRaw(ga, parsed.apduData, parsed.bitlength)
        return
      }
      if (parsed.event === 'GroupValue_Read') {
        if (typeof client.read !== 'function') throw new Error('KNX client does not support read')
        client.read(ga)
        return
      }
    }

    const canForwardToTunnel = (parsed) => {
      if (!parsed) return false
      if (!node.tunnelServer) return false
      if (!parsed.cemiHex) return false
      if (node.dropIfSameGateway && parsed.originGatewayId && localGatewayIds().has(String(parsed.originGatewayId))) return false
      if (node.respectRoutingCounter && parsed.hopCount === 0) return false
      return true
    }

    const forwardToTunnel = (parsed) => {
      const clean = normalizeHex(parsed.cemiHex)
      if (!clean || clean.length % 2 !== 0) return
      let KNXTunnelingRequest
      try { ({ KNXTunnelingRequest } = getKnxultimate()) } catch (e) { throw new Error('knxultimate KNXTunnelingRequest not available') }
      const cemi = KNXTunnelingRequest.parseCEMIMessage(Buffer.from(clean, 'hex'), 0)
      node.tunnelServer.injectCemi(cemi)
    }

    const updateTunnelStatus = (extraText) => {
      if (node.mode !== 'server') return
      const addr = node.tunnelServer && typeof node.tunnelServer.address === 'object' ? node.tunnelServer.address : null
      const host = addr ? addr.host : (config.tunnelListenHost || '0.0.0.0')
      const port = addr ? addr.port : safeNumber(config.tunnelListenPort, 3671)
      const sessionsFromServer = node.tunnelServer && node.tunnelServer.sessions && typeof node.tunnelServer.sessions.size === 'number'
        ? node.tunnelServer.sessions.size
        : null
      const sessionsFromEvents = node.tunnelSessions ? node.tunnelSessions.size : 0
      const sessions = sessionsFromServer !== null ? sessionsFromServer : sessionsFromEvents
      const adv = (node.tunnelServer && node.tunnelServer.options && node.tunnelServer.options.advertiseHost) ? node.tunnelServer.options.advertiseHost : ''
      const tail = extraText ? ` ${extraText}` : ''
      const advText = adv ? ` adv:${adv}` : ''
      const rxText = node.tunnelRxCount ? ` rx:${node.tunnelRxCount}` : ''
      updateStatus({ fill: 'green', shape: 'dot', text: `Tunnel ${host}:${port}${advText} sessions:${sessions}${rxText}${tail}` })
    }

    const startTunnelServerIfNeeded = () => {
      if (node.mode !== 'server') return
      let KNXIPTunnelServer
      try { ({ KNXIPTunnelServer } = require('knxultimate')) } catch (e) {
        updateStatus({ fill: 'red', shape: 'dot', text: 'KNX/IP Server: knxultimate missing KNXIPTunnelServer' })
        node.error('KNX/IP Server mode requires knxultimate with KNXIPTunnelServer exported.')
        return
      }

      node.tunnelGatewayId = (config.tunnelGatewayId && String(config.tunnelGatewayId).trim()) || String(node.id)
      node.tunnelAssignedIndividualAddress = (config.tunnelAssignedIndividualAddress && String(config.tunnelAssignedIndividualAddress).trim()) || '15.15.255'

      const listenHost = (config.tunnelListenHost && String(config.tunnelListenHost).trim()) || '0.0.0.0'
      const listenPort = safeNumber(config.tunnelListenPort, 3671)
      const advertiseHostConfigured = (config.tunnelAdvertiseHost && String(config.tunnelAdvertiseHost).trim()) || ''
      const advertiseHost = advertiseHostConfigured || guessAdvertiseHost(listenHost)
      const maxSessions = Math.max(1, safeNumber(config.tunnelMaxSessions, 1))

      const loglevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'

      node.tunnelServer = new KNXIPTunnelServer({
        listenHost,
        listenPort,
        advertiseHost,
        assignedIndividualAddress: node.tunnelAssignedIndividualAddress,
        maxSessions,
        loglevel
      })

      // If the OS network was not ready at boot, periodically refresh auto-advertise host.
      // This affects only new client connections (CONNECT_RESPONSE payload).
      if (!advertiseHostConfigured) {
        const refreshAdvertiseHost = () => {
          try {
            if (!node.tunnelServer || !node.tunnelServer.options) return
            const next = guessAdvertiseHost(listenHost)
            const cur = node.tunnelServer.options.advertiseHost
            if (next && cur !== next) {
              node.tunnelServer.options.advertiseHost = next
              updateTunnelStatus('(adv host updated)')
            }
          } catch (e) { /* ignore */ }
        }
        try {
          node.tunnelAdvertiseHostTimer = setInterval(refreshAdvertiseHost, 10000)
          if (node.tunnelAdvertiseHostTimer && typeof node.tunnelAdvertiseHostTimer.unref === 'function') node.tunnelAdvertiseHostTimer.unref()
        } catch (e) { /* ignore */ }
      }

      node.tunnelServer.on('error', (err) => {
        updateStatus({ fill: 'red', shape: 'dot', text: `Tunnel error: ${err.message}` })
        node.error(err)
      })

      node.tunnelServer.on('listening', () => {
        updateTunnelStatus('')
      })

      node.tunnelServer.on('sessionUp', (s) => {
        try { node.tunnelSessions.add(s.channelId) } catch (e) { /* ignore */ }
        updateTunnelStatus('client connected')
      })

      node.tunnelServer.on('sessionDown', (s) => {
        try { if (s && s.channelId) node.tunnelSessions.delete(s.channelId) } catch (e) { /* ignore */ }
        updateTunnelStatus('client disconnected')
      })

      node.tunnelServer.on('rawTelegram', (knx, info) => {
        try {
          node.tunnelRxCount = (node.tunnelRxCount || 0) + 1
          node.tunnelLastRxAt = Date.now()
          const msg = {
            topic: node.outputtopic || knx.destination,
            payload: {
              knx,
              knxMultiRouting: {
                gateway: { id: node.tunnelGatewayId, name: node.name || '', physAddr: node.tunnelAssignedIndividualAddress || '' },
                receivedAt: Date.now(),
                tunnel: { channelId: info && info.channelId ? info.channelId : undefined }
              }
            }
          }
          const processed = applyRoutingCounterOnOutboundMsg(msg)
          if (!processed) return
          node.send(processed)
        } catch (error) {
          node.sysLogger?.error(`knxUltimateMultiRouting: tunnel rawTelegram output error: ${error.message}`)
        }
      })

      // Periodic refresh to surface session count even if Node-RED doesn't show transient updates.
      try {
        node.tunnelStatusRefreshTimer = setInterval(() => updateTunnelStatus(''), 5000)
        if (node.tunnelStatusRefreshTimer && typeof node.tunnelStatusRefreshTimer.unref === 'function') node.tunnelStatusRefreshTimer.unref()
      } catch (e) { /* ignore */ }

      updateStatus({ fill: 'grey', shape: 'dot', text: 'Starting KNX/IP Server...' })
      Promise.resolve()
        .then(() => node.tunnelServer.start())
        .then(() => updateTunnelStatus(''))
        .catch((err) => {
          updateStatus({ fill: 'red', shape: 'dot', text: `Tunnel start failed: ${err.message}` })
          node.error(err)
        })
    }

    node.on('input', function (msg) {
      try {
        const parsed = parseIncoming(msg)
        if (node.respectRoutingCounter && parsed && parsed.hopCount === 0) {
          node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Dropped (routing counter 0)', payload: parsed.event || '', GA: parsed.destination, dpt: '', devicename: parsed.source || '' })
          return
        }

        if (node.decrementRoutingCounter && parsed && parsed.cemiHex && parsed.hopCount !== null && parsed.hopCount > 0) {
          const dec = decrementHopCountInCemiHex(parsed.cemiHex)
          if (dec) {
            if (node.respectRoutingCounter && dec.newHopCount === 0) {
              node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Dropped (routing counter 0)', payload: parsed.event || '', GA: parsed.destination, dpt: '', devicename: parsed.source || '' })
              return
            }
            parsed.cemiHex = dec.cemiHex
            parsed.hopCount = dec.newHopCount
          }
        }

        if (node.mode === 'server') {
          if (!canForwardToTunnel(parsed)) return
          forwardToTunnel(parsed)
        } else {
          if (!canForwardToGateway(parsed)) return
          forwardToBus(parsed)
        }

        node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Forwarded', payload: parsed.event || '', GA: parsed.destination, dpt: '', devicename: parsed.source || '' })
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Forward error: ${error.message || error}`, payload: '', GA: '', dpt: '', devicename: '' })
        node.error(error)
      }
    })

    node.on('close', function (done) {
      const shutdown = async () => {
        if (node.serverKNX) {
          try { node.serverKNX.removeClient(node) } catch (e) { /* ignore */ }
        }
        if (node.tunnelAdvertiseHostTimer) {
          try { clearInterval(node.tunnelAdvertiseHostTimer) } catch (e) { /* ignore */ }
          node.tunnelAdvertiseHostTimer = null
        }
        if (node.tunnelStatusRefreshTimer) {
          try { clearInterval(node.tunnelStatusRefreshTimer) } catch (e) { /* ignore */ }
          node.tunnelStatusRefreshTimer = null
        }
        if (node.tunnelServer) {
          try { await node.tunnelServer.stop() } catch (e) { /* ignore */ }
          node.tunnelServer = null
        }
      }
      Promise.resolve(shutdown()).then(() => done()).catch(() => done())
    })

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      try { node.serverKNX.removeClient(node) } catch (e) { /* ignore */ }
      try { node.serverKNX.addClient(node) } catch (e) { /* ignore */ }
    }

    startTunnelServerIfNeeded()

    if (node.mode !== 'server') updateStatus({ fill: 'grey', shape: 'dot', text: 'Routing ready' })
  }

  RED.nodes.registerType('knxUltimateMultiRouting', knxUltimateMultiRouting)
}
