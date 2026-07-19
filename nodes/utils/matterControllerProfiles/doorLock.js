'use strict'

const dptlib = require('knxultimate').dptlib

const DOOR_LOCK_CLUSTER_ID = 0x0101
const LOCK_STATE = {
  NOT_FULLY_LOCKED: 0,
  LOCKED: 1,
  UNLOCKED: 2,
  UNLATCHED: 3
}

const decodeKnxBoolean = (msg, dpt) => {
  if (msg && msg.knx && Buffer.isBuffer(msg.knx.rawValue)) {
    return !!dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(dpt || '1.001'))
  }
  return !!(msg && msg.payload)
}

const lockStateName = (value) => {
  switch (Number(value)) {
    case LOCK_STATE.LOCKED: return 'locked'
    case LOCK_STATE.UNLOCKED: return 'unlocked'
    case LOCK_STATE.NOT_FULLY_LOCKED: return 'notFullyLocked'
    case LOCK_STATE.UNLATCHED: return 'unlatched'
    default: return 'unknown'
  }
}

const lockStateToBoolean = (value) => {
  // KNX DPT 1 can represent only two states. Do not collapse transitional or
  // ambiguous Matter lock states into a potentially unsafe locked/unlocked value.
  if (Number(value) === LOCK_STATE.LOCKED) return true
  if (Number(value) === LOCK_STATE.UNLOCKED) return false
  return undefined
}

const setupDoorLockProfile = (RED, node, config) => {
  // Profiles initialize the same flags consumed by knxUltimate-config as ordinary
  // KNX nodes. In particular, listenallga must remain enabled for handleSend calls.
  node.name = config.name || node.matterDeviceName || 'Control Matter door lock from KNX'
  node.topic = node.name
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
  node.currentLockState = undefined
  node.knxUltimateAcceptedGAs = [config.GALightSwitch, config.GALightState]
    .map((ga) => String(ga || '').trim())
    .filter((ga) => ga !== '')

  const setStatus = (fill, shape, text) => node.status({ fill, shape, text })
  // knxUltimate-config invokes this synchronously from addClient(). Profiles return
  // early from the main light constructor, so they must expose the callback before
  // registering with the shared KNX configuration node.
  node.setNodeStatus = ({ fill = 'grey', shape = 'ring', text = '' } = {}) => setStatus(fill, shape, text)

  const commandArgs = () => {
    // Matter represents the remote credential as bytes. Keep the PIN in Node-RED's
    // credential store and materialize the Buffer only for the outgoing command.
    const pin = String(node.credentials?.doorLockPin || '')
    return pin === '' ? {} : { pinCode: Buffer.from(pin, 'utf8') }
  }

  const sendFlow = (source, state, rawState) => {
    if (config.enableNodePINS !== 'yes') return
    node.send({
      topic: node.topic,
      payload: state,
      matter: {
        source,
        nodeId: node.matterNodeId,
        endpointId: node.matterEndpointId,
        clusterId: DOOR_LOCK_CLUSTER_ID,
        lockState: rawState,
        lockStateName: rawState === undefined ? (state ? 'locked' : 'unlocked') : lockStateName(rawState)
      }
    })
  }

  const writeKnxState = (state, outputtype = 'write') => {
    const ga = String(config.GALightState || '').trim()
    if (ga === '' || !node.serverKNX) return
    node.serverKNX.sendKNXTelegramToKNXEngine({
      grpaddr: ga,
      payload: state,
      dpt: config.dptLightState || '1.001',
      outputtype,
      nodecallerid: node.id
    })
  }

  const publishMatterState = (rawState, source = 'matter') => {
    node.currentLockState = Number(rawState)
    const state = lockStateToBoolean(rawState)
    const name = lockStateName(rawState)
    // Attribute reports update KNX state only; they never enqueue a Matter command.
    // This one-way path is the primary feedback-loop guard for Door Lock endpoints.
    if (state !== undefined) writeKnxState(state)
    sendFlow(source, state, rawState)
    setStatus(state === undefined ? 'yellow' : 'blue', state === undefined ? 'ring' : 'dot', `Matter: ${name}`)
  }

  const queueCommand = (locked, source = 'knx') => {
    const manager = node.serverMatter?.matterManager
    if (!manager) throw new Error('Matter controller not ready')
    const capabilities = (() => {
      try { return JSON.parse(config.matterDeviceCapabilities || '{}') } catch (error) { return {} }
    })()
    // Never invent optional operations: the editor persists the commands actually
    // advertised by this endpoint and runtime validation enforces that snapshot.
    if (locked && capabilities.lockDoor === false) throw new Error('The Matter endpoint does not expose lockDoor')
    if (!locked && capabilities.unlockDoor === false) throw new Error('The Matter endpoint does not expose unlockDoor')
    const queued = manager.writeMatterQueueAdd({
      nodeId: node.matterNodeId,
      endpointId: node.matterEndpointId,
      clusterId: DOOR_LOCK_CLUSTER_ID,
      kind: 'command',
      name: locked ? 'lockDoor' : 'unlockDoor',
      args: commandArgs()
    })
    if (queued && typeof queued.catch === 'function') {
      queued.catch((error) => {
        RED.log.error(`knxUltimateMatterControllerDevice DoorLock command: ${error.message}`)
        setStatus('red', 'ring', error.message)
      })
    }
    sendFlow(source, locked)
    setStatus('green', 'dot', `KNX→Matter: ${locked ? 'lock' : 'unlock'}`)
  }

  node.handleSend = (msg) => {
    try {
      if (!msg?.knx || !node.knxUltimateAcceptedGAs.includes(String(msg.knx.destination || '').trim())) return
      if (msg.knx.event === 'GroupValue_Read') {
        if (String(msg.knx.destination) === String(config.GALightState)) {
          const state = lockStateToBoolean(node.currentLockState)
          if (state !== undefined) writeKnxState(state, 'response')
        }
        return
      }
      if (String(msg.knx.destination) !== String(config.GALightSwitch)) return
      queueCommand(decodeKnxBoolean(msg, config.dptLightSwitch), 'knx')
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice DoorLock KNX: ${error.message}`)
      setStatus('red', 'ring', error.message)
    }
  }

  node.handleSendMatter = (event) => {
    try {
      if (String(event?.nodeId) !== String(node.matterNodeId)) return
      if (Number(event?.endpointId) !== Number(node.matterEndpointId)) return
      if (Number(event?.clusterId) !== DOOR_LOCK_CLUSTER_ID || event.attributeName !== 'lockState') return
      publishMatterState(event.value)
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice DoorLock Matter: ${error.message}`)
    }
  }
  node.handleMatterClusterEvent = () => {}
  node.handleMatterNodeInitialized = () => {
    try {
      // The controller engine already caches the initial attribute read. Reusing that
      // value avoids an extra request and publishes startup state through the same path.
      const value = node.serverMatter?.matterManager?.getCachedAttribute(
        node.matterNodeId,
        node.matterEndpointId,
        DOOR_LOCK_CLUSTER_ID,
        'lockState'
      )
      if (value !== undefined && value !== null) publishMatterState(value, 'initial')
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice DoorLock initial state: ${error.message}`)
    }
  }
  node.setNodeStatusMatter = (status) => {
    if (status && status.text) setStatus(status.fill || 'grey', status.shape || 'ring', status.text)
  }

  if (node.serverKNX) {
    node.serverKNX.removeClient(node)
    node.serverKNX.addClient(node)
  } else {
    setStatus('yellow', 'ring', 'No KNX gateway selected')
  }
  if (node.serverMatter) {
    node.serverMatter.removeClient(node)
    node.serverMatter.addClient(node)
  }

  node.on('input', (msg, send, done) => {
    try {
      const value = typeof msg.payload === 'object' && msg.payload !== null && msg.payload.locked !== undefined
        ? msg.payload.locked
        : msg.payload
      if (typeof value !== 'boolean') throw new Error('Door Lock input requires msg.payload boolean or { locked: boolean }')
      queueCommand(value, 'flow')
      if (done) done()
    } catch (error) {
      setStatus('red', 'ring', error.message)
      if (done) done(error)
      else node.error(error, msg)
    }
  })

  node.on('close', (done) => {
    try { if (node.serverKNX) node.serverKNX.removeClient(node) } catch (error) { /* empty */ }
    try { if (node.serverMatter) node.serverMatter.removeClient(node) } catch (error) { /* empty */ }
    done()
  })
}

module.exports = {
  DOOR_LOCK_CLUSTER_ID,
  LOCK_STATE,
  lockStateName,
  lockStateToBoolean,
  setupDoorLockProfile
}
