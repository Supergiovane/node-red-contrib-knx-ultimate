// KNX Multi Routing - interconnect multiple KNX Ultimate gateways via Node-RED flows
const loggerClass = require('./utils/sysLogger')

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

    // KNX/IP tunneling server (optional)
    node.tunnelServer = null
    node.tunnelSessions = new Set()
    node.tunnelGatewayId = ''
    node.tunnelAssignedIndividualAddress = ''

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
        node.send(msg)
      } catch (error) {
        node.sysLogger?.error(`knxUltimateMultiRouting: output error: ${error.message}`)
      }
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

      const routing = (p && p.knxMultiRouting) ? p.knxMultiRouting : (msg && msg.knxMultiRouting ? msg.knxMultiRouting : null)
      const originGatewayId = routing && routing.gateway && routing.gateway.id ? String(routing.gateway.id) : ''
      return { event, destination, source, apduData, bitlength, originGatewayId, cemiHex }
    }

    const canForwardToGateway = (parsed) => {
      if (!parsed) return false
      if (!parsed.destination || typeof parsed.destination !== 'string') return false
      if (!node.serverKNX || node.serverKNX.linkStatus !== 'connected' || !node.serverKNX.knxConnection) return false
      if (node.dropIfSameGateway && parsed.originGatewayId && localGatewayIds().has(String(parsed.originGatewayId))) return false
      return true
    }

    const forwardToBus = (parsed) => {
      const client = node.serverKNX.knxConnection
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
      return true
    }

    const forwardToTunnel = (parsed) => {
      const clean = normalizeHex(parsed.cemiHex)
      if (!clean || clean.length % 2 !== 0) return
      let KNXTunnelingRequest
      try { ({ KNXTunnelingRequest } = require('knxultimate')) } catch (e) { throw new Error('knxultimate KNXTunnelingRequest not available') }
      const cemi = KNXTunnelingRequest.parseCEMIMessage(Buffer.from(clean, 'hex'), 0)
      node.tunnelServer.injectCemi(cemi)
    }

    const updateTunnelStatus = (extraText) => {
      if (node.mode !== 'server') return
      const addr = node.tunnelServer && typeof node.tunnelServer.address === 'object' ? node.tunnelServer.address : null
      const host = addr ? addr.host : (config.tunnelListenHost || '0.0.0.0')
      const port = addr ? addr.port : safeNumber(config.tunnelListenPort, 3671)
      const sessions = node.tunnelSessions ? node.tunnelSessions.size : 0
      const tail = extraText ? ` ${extraText}` : ''
      updateStatus({ fill: 'green', shape: 'dot', text: `Tunnel ${host}:${port} sessions:${sessions}${tail}` })
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
      const advertiseHost = (config.tunnelAdvertiseHost && String(config.tunnelAdvertiseHost).trim()) || undefined
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
          node.send(msg)
        } catch (error) {
          node.sysLogger?.error(`knxUltimateMultiRouting: tunnel rawTelegram output error: ${error.message}`)
        }
      })

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
