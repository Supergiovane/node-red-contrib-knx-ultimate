'use strict'

const dptlib = require('knxultimate').dptlib
const { knxToMatter, matterToKnx } = require('../matterKnxConverter')

const isValidGroupAddress = (value) => {
  const parts = String(value || '').trim().split('/')
  if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) return false
  const [main, middle, sub] = parts.map(Number)
  return main >= 0 && main <= 31 && middle >= 0 && middle <= 7 && sub >= 0 && sub <= 255
}

const parseMappings = (value) => {
  try {
    const parsed = Array.isArray(value) ? value : JSON.parse(value || '[]')
    // Ignore incomplete or stale editor rows. Only mappings with a valid KNX address,
    // resolvable DPT and explicit Matter target are allowed into runtime routing.
    return parsed.filter((mapping) => {
      if (!mapping || !isValidGroupAddress(mapping.ga) || !mapping.target || !mapping.dpt) return false
      try { dptlib.resolve(mapping.dpt); return true } catch (error) { return false }
    })
  } catch (error) {
    return []
  }
}

const setupMappedEndpointProfile = (RED, node, config) => {
  node.name = config.name || node.matterDeviceName || 'Control Matter from KNX'
  node.topic = node.name
  node.mappings = parseMappings(config.matterMappings)
  node.knxUltimateAcceptedGAs = [...new Set(node.mappings.map((mapping) => String(mapping.ga).trim()))]
  node.notifyreadrequest = true
  node.notifyreadrequestalsorespondtobus = 'false'
  node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
  node.notifyresponse = false
  node.notifywrite = true
  node.initialread = true
  node.listenallga = true
  node.outputtype = 'write'
  node.outputRBE = 'false'
  node.inputRBE = 'false'
  node.passthrough = 'no'
  const enablePins = config.enableNodePINS === 'yes'
  let lastInitialReadTs = 0

  const status = (fill, shape, text) => node.status({ fill, shape, text })
  // knxUltimate-config calls setNodeStatus synchronously while adding the client.
  node.setNodeStatus = ({ fill = 'grey', shape = 'ring', text = '' } = {}) => status(fill, shape, text)
  const manager = () => node.serverMatter?.matterManager
  const sendKnx = (mapping, payload, outputtype = 'write') => {
    if (payload === undefined || !node.serverKNX) return false
    node.serverKNX.sendKNXTelegramToKNXEngine({
      grpaddr: mapping.ga,
      payload,
      dpt: mapping.dpt,
      outputtype,
      nodecallerid: node.id
    })
    return true
  }
  const sendCached = (mapping, outputtype) => {
    const currentManager = manager()
    if (!currentManager) return false
    // Cached reports are authoritative for KNX read responses and startup publication;
    // reading them must not generate a new Matter write or command.
    const value = currentManager.getCachedAttribute(node.matterNodeId, mapping.endpointId, mapping.clusterId, mapping.target)
    return sendKnx(mapping, matterToKnx(mapping.clusterId, mapping.target, value), outputtype)
  }
  const enqueue = (mapping, value) => {
    const currentManager = manager()
    if (!currentManager) throw new Error('Matter controller not ready')
    // Conversion happens before queueing so the Matter manager receives a canonical,
    // cluster-specific command or attribute write rather than a raw KNX payload.
    const action = knxToMatter(mapping, value)
    if (!action) return
    const queued = currentManager.writeMatterQueueAdd({
      nodeId: node.matterNodeId,
      endpointId: mapping.endpointId,
      clusterId: mapping.clusterId,
      kind: action.kind,
      name: action.name,
      args: action.args
    })
    if (queued && typeof queued.catch === 'function') queued.catch((error) => status('red', 'ring', error.message))
  }

  node.handleSend = (msg) => {
    try {
      if (!msg?.knx || !node.knxUltimateAcceptedGAs.includes(String(msg.knx.destination || '').trim())) return
      const matches = node.mappings.filter((mapping) => mapping.ga === msg.knx.destination)
      if (msg.knx.event === 'GroupValue_Read') {
        matches.filter((mapping) => mapping.direction === 'status').forEach((mapping) => sendCached(mapping, 'response'))
        return
      }
      matches.filter((mapping) => mapping.direction === 'command').forEach((mapping) => {
        const value = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(mapping.dpt))
        enqueue(mapping, value)
      })
      status('green', 'dot', 'KNX→Matter')
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice mapped KNX: ${error.message}`)
      status('red', 'ring', error.message)
    }
  }
  node.handleSendMatter = (event) => {
    try {
      // Attribute reports travel only toward KNX/flow. Keeping feedback separate from
      // enqueue() prevents programmatic state synchronization from echoing to Matter.
      if (String(event?.nodeId) !== String(node.matterNodeId) || Number(event?.endpointId) !== Number(node.matterEndpointId)) return
      node.mappings.filter((mapping) => mapping.direction === 'status' && Number(mapping.clusterId) === Number(event.clusterId) && mapping.target === event.attributeName).forEach((mapping) => {
        sendKnx(mapping, matterToKnx(event.clusterId, event.attributeName, event.value))
      })
      if (enablePins) node.send({ topic: `${event.clusterId}.${event.attributeName}`, payload: event.value, matter: event })
      status('blue', 'dot', `Matter→KNX: ${event.attributeName}`)
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice mapped Matter: ${error.message}`)
      status('red', 'ring', error.message)
    }
  }
  node.handleMatterClusterEvent = (event) => {
    // Cluster events have no implicit KNX mapping. They are exposed as raw flow output
    // only when the user explicitly enables the node pins.
    if (enablePins && String(event?.nodeId) === String(node.matterNodeId) && Number(event?.endpointId) === Number(node.matterEndpointId)) {
      node.send({ topic: `${event.clusterId}.${event.eventName}`, payload: event.events, matter: event })
    }
  }
  node.handleMatterNodeInitialized = () => {
    // nodeInitialized can be emitted more than once while sessions recover. Bound the
    // startup publication to avoid duplicate KNX telegram bursts during reconnects.
    if (config.readStatusAtStartup === 'no' || Date.now() - lastInitialReadTs < 5000) return
    let sent = 0
    node.mappings.filter((mapping) => mapping.direction === 'status').forEach((mapping) => { if (sendCached(mapping, 'write')) sent += 1 })
    if (sent > 0) lastInitialReadTs = Date.now()
  }
  node.setNodeStatusMatter = (value) => { if (value?.text) status(value.fill || 'grey', value.shape || 'ring', value.text) }

  if (node.serverKNX) { node.serverKNX.removeClient(node); node.serverKNX.addClient(node) } else status('yellow', 'ring', 'No KNX gateway selected')
  if (node.serverMatter) { node.serverMatter.removeClient(node); node.serverMatter.addClient(node) }
  node.on('input', (msg, send, done) => {
    try {
      const payload = msg.payload || {}
      const mapping = {
        endpointId: payload.endpointId ?? node.matterEndpointId,
        clusterId: payload.clusterId,
        targetKind: payload.command !== undefined ? 'command' : 'attribute',
        target: payload.command ?? payload.attribute
      }
      if (!mapping.target || mapping.clusterId === undefined) throw new Error('Matter input requires clusterId and command or attribute')
      enqueue(mapping, payload.args ?? payload.value)
      if (done) done()
    } catch (error) {
      if (done) done(error); else node.error(error, msg)
    }
  })
  node.on('close', (done) => {
    try { if (node.serverKNX) node.serverKNX.removeClient(node) } catch (error) { /* empty */ }
    try { if (node.serverMatter) node.serverMatter.removeClient(node) } catch (error) { /* empty */ }
    done()
  })
}

module.exports = { isValidGroupAddress, parseMappings, setupMappedEndpointProfile }
