// KNX Multi Routing - interconnect multiple KNX Ultimate gateways via Node-RED flows
const loggerClass = require('./utils/sysLogger')

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

    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    if (node.serverKNX === undefined) {
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
        if (node.serverKNX === null) { updateStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
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

      const routing = (p && p.knxMultiRouting) ? p.knxMultiRouting : (msg && msg.knxMultiRouting ? msg.knxMultiRouting : null)
      const originGatewayId = routing && routing.gateway && routing.gateway.id ? String(routing.gateway.id) : ''
      return { event, destination, source, apduData, bitlength, originGatewayId }
    }

    const canForward = (parsed) => {
      if (!parsed) return false
      if (!parsed.destination || typeof parsed.destination !== 'string') return false
      if (!node.serverKNX || node.serverKNX.linkStatus !== 'connected' || !node.serverKNX.knxConnection) return false
      if (node.dropIfSameGateway && parsed.originGatewayId && node.serverKNX && node.serverKNX.id && parsed.originGatewayId === node.serverKNX.id) return false
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

    node.on('input', function (msg) {
      try {
        const parsed = parseIncoming(msg)
        if (!canForward(parsed)) return
        forwardToBus(parsed)
        node.setNodeStatus({
          fill: 'green',
          shape: 'dot',
          text: 'Forwarded',
          payload: parsed.event || '',
          GA: parsed.destination,
          dpt: '',
          devicename: parsed.source || ''
        })
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Forward error: ${error.message || error}`, payload: '', GA: '', dpt: '', devicename: '' })
        node.error(error)
      }
    })

    node.on('close', function (done) {
      if (node.serverKNX) {
        try { node.serverKNX.removeClient(node) } catch (e) { /* ignore */ }
      }
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      try { node.serverKNX.removeClient(node) } catch (e) { /* ignore */ }
      try { node.serverKNX.addClient(node) } catch (e) { /* ignore */ }
    }

    updateStatus({ fill: 'grey', shape: 'dot', text: 'Routing ready' })
  }

  RED.nodes.registerType('knxUltimateMultiRouting', knxUltimateMultiRouting)
}
