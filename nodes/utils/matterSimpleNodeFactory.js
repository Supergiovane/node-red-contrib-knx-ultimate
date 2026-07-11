/* eslint-disable max-len */
const dptlib = require('knxultimate').dptlib
const { CLUSTER, matterToKnx } = require('./matterKnxConverter')

const formatTsFor = (node) => {
  return (date) => {
    const d = date instanceof Date ? date : new Date(date)
    const provider = node.serverKNX
    if (provider && typeof provider.formatStatusTimestamp === 'function') return provider.formatStatusTimestamp(d)
    return `${d.getDate()}, ${d.toLocaleTimeString()}`
  }
}

const pushStatusFor = (node) => {
  return (status) => {
    if (!status) return
    const provider = node.serverKNX
    if (provider && typeof provider.applyStatusUpdate === 'function') {
      provider.applyStatusUpdate(node, status)
    } else {
      node.status(status)
    }
  }
}

const normalizeEndpoint = (value, fallback = 1) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

const normalizeNodeId = (value) => {
  if (value === undefined || value === null) return ''
  return String(value)
}

const boolFromKnx = (msg, dpt) => {
  const value = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(dpt || '1.001'))
  return value === true || value === 1 || value === 'true'
}

function createMatterSensorNode (RED, nodeType, spec) {
  function MatterSensorNode (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverMatter = RED.nodes.getNode(config.serverMatter) || undefined
    node.matterNodeId = normalizeNodeId(config.matterNodeId)
    node.matterEndpointId = normalizeEndpoint(config.matterEndpointId)
    node.matterDeviceName = config.matterDeviceName || ''
    node.name = config.name || node.matterDeviceName || spec.defaultName
    node.topic = node.name
    node.currentDeviceValue = undefined
    node.initializingAtStart = config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes'
    const pinsSetting = config.enableNodePINS === undefined || config.enableNodePINS === 'yes' || config.enableNodePINS === true
    node.enableNodePINS = pinsSetting ? 'yes' : 'no'
    node.outputs = pinsSetting ? 1 : 0
    if (!node.serverKNX && node.outputs === 0) {
      node.enableNodePINS = 'yes'
      node.outputs = 1
    }
    const formatTs = formatTsFor(node)
    const pushStatus = pushStatusFor(node)

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          pushStatus({ fill: 'red', shape: 'dot', text: `KNX server missing (${context}) (${formatTs(new Date())})` })
          return
        }
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id })
      } catch (error) {
        pushStatus({ fill: 'red', shape: 'dot', text: `KNX send error ${error.message}` })
      }
    }

    node.setNodeStatus = ({ fill, shape, text, payload }) => {
      try {
        const safePayload = payload === undefined ? '' : (typeof payload === 'object' ? JSON.stringify(payload) : payload.toString())
        node.sKNXNodeStatusText = `|KNX: ${text} ${safePayload} (${formatTs(new Date())})`
        pushStatus({ fill, shape, text: (node.sMatterNodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

    node.setNodeStatusMatter = ({ fill, shape, text, payload }) => {
      try {
        const safePayload = payload === undefined ? '' : (typeof payload === 'object' ? JSON.stringify(payload) : payload.toString())
        node.sMatterNodeStatusText = `|Matter: ${text} ${safePayload} (${formatTs(new Date())})`
        pushStatus({ fill, shape, text: node.sMatterNodeStatusText + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

    const mapValue = (event) => {
      let value = matterToKnx(spec.clusterId, spec.attributeName, event.value)
      if (value === undefined) return undefined
      if (typeof spec.transform === 'function') value = spec.transform(value, event)
      return value
    }

    const publishValue = (value, rawEvent, outputtype = 'write') => {
      if (value === undefined || Number.isNaN(value)) return
      node.currentDeviceValue = value
      const msg = {
        topic: config.ga,
        dpt: config.dpt || spec.defaultDpt,
        payload: value,
        name: node.name,
        event: spec.eventName,
        rawEvent
      }
      if (msg.topic) {
        safeSendToKNX({
          grpaddr: msg.topic,
          payload: msg.payload,
          dpt: msg.dpt,
          outputtype
        }, outputtype)
      }
      node.setNodeStatusMatter({
        fill: 'blue',
        shape: 'ring',
        text: 'Matter->KNX',
        payload: value
      })
      if (node.enableNodePINS === 'yes') node.send(msg)
    }

    node.handleMatterNodeInitialized = () => {
      if (!node.initializingAtStart) return
      try {
        const manager = node.serverMatter ? node.serverMatter.matterManager : undefined
        if (!manager || typeof manager.getCachedAttribute !== 'function') return
        const value = manager.getCachedAttribute(node.matterNodeId, node.matterEndpointId, spec.clusterId, spec.attributeName)
        publishValue(mapValue({ value }), {
          nodeId: node.matterNodeId,
          endpointId: node.matterEndpointId,
          clusterId: spec.clusterId,
          attributeName: spec.attributeName,
          value
        })
      } catch (error) {
        node.setNodeStatusMatter({ fill: 'red', shape: 'dot', text: `Initial read error ${error.message}`, payload: '' })
      }
    }

    node.handleSendMatter = (event) => {
      try {
        if (normalizeNodeId(event.nodeId) !== node.matterNodeId) return
        if (Number(event.endpointId) !== Number(node.matterEndpointId)) return
        if (Number(event.clusterId) !== Number(spec.clusterId)) return
        if (event.attributeName !== spec.attributeName) return
        publishValue(mapValue(event), event)
      } catch (error) {
        node.setNodeStatusMatter({ fill: 'red', shape: 'dot', text: `Matter error ${error.message}`, payload: '' })
      }
    }

    node.handleSend = (msg) => {
      try {
        if (!msg.knx || msg.knx.event !== 'GroupValue_Read') return
        if (msg.knx.destination !== config.ga) return
        if (node.currentDeviceValue === undefined) return
        publishValue(node.currentDeviceValue, { source: 'knx-read' }, 'response')
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `KNX read error ${error.message}`, payload: '' })
      }
    }

    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }
    if (node.serverMatter) {
      node.serverMatter.removeClient(node)
      node.serverMatter.addClient(node)
    }

    node.on('close', (done) => {
      if (node.serverKNX) node.serverKNX.removeClient(node)
      if (node.serverMatter) node.serverMatter.removeClient(node)
      done()
    })
  }

  RED.nodes.registerType(nodeType, MatterSensorNode)
}

function createMatterOnOffNode (RED, nodeType, spec = {}) {
  function MatterOnOffNode (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverMatter = RED.nodes.getNode(config.serverMatter) || undefined
    node.matterNodeId = normalizeNodeId(config.matterNodeId)
    node.matterEndpointId = normalizeEndpoint(config.matterEndpointId)
    node.matterDeviceName = config.matterDeviceName || ''
    node.name = config.name || node.matterDeviceName || spec.defaultName || 'Matter Plug'
    node.topic = node.name
    node.currentDeviceValue = undefined
    node.initializingAtStart = config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes'
    node.enableNodePINS = config.enableNodePINS === 'yes'
    node.inputs = node.enableNodePINS ? 1 : 0
    node.outputs = node.enableNodePINS ? 1 : 0
    const formatTs = formatTsFor(node)
    const pushStatus = pushStatusFor(node)

    const setStatusMatter = ({ fill, shape, text, payload }) => {
      try {
        const safePayload = payload === undefined ? '' : (typeof payload === 'object' ? JSON.stringify(payload) : payload.toString())
        node.sMatterNodeStatusText = `|Matter: ${text} ${safePayload} (${formatTs(new Date())})`
        pushStatus({ fill, shape, text: node.sMatterNodeStatusText + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }
    node.setNodeStatusMatter = setStatusMatter

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          pushStatus({ fill: 'red', shape: 'dot', text: `KNX server missing (${context}) (${formatTs(new Date())})` })
          return
        }
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id })
      } catch (error) {
        pushStatus({ fill: 'red', shape: 'dot', text: `KNX send error ${error.message}` })
      }
    }

    const publishState = (value, rawEvent, outputtype = 'write') => {
      const boolValue = value === true
      node.currentDeviceValue = boolValue
      if (config.GAPlugState) {
        safeSendToKNX({
          grpaddr: config.GAPlugState,
          payload: boolValue,
          dpt: config.dptPlugState || '1.001',
          outputtype
        }, outputtype)
      }
      setStatusMatter({
        fill: boolValue ? 'green' : 'blue',
        shape: boolValue ? 'dot' : 'ring',
        text: 'Matter plug',
        payload: boolValue
      })
      if (node.enableNodePINS) {
        node.send({
          payload: boolValue,
          on: { on: boolValue },
          rawEvent
        })
      }
    }

    const writeOnOff = (value) => {
      try {
        const manager = node.serverMatter ? node.serverMatter.matterManager : undefined
        if (!manager || typeof manager.writeMatterQueueAdd !== 'function') throw new Error('Matter controller not ready')
        const ret = manager.writeMatterQueueAdd({
          nodeId: node.matterNodeId,
          endpointId: node.matterEndpointId,
          clusterId: CLUSTER.ON_OFF,
          kind: 'command',
          name: value ? 'on' : 'off'
        })
        if (ret && typeof ret.catch === 'function') ret.catch(() => { })
        publishState(value, { source: 'command' })
      } catch (error) {
        setStatusMatter({ fill: 'red', shape: 'dot', text: `Matter command error ${error.message}`, payload: '' })
      }
    }

    node.handleMatterNodeInitialized = () => {
      if (!node.initializingAtStart) return
      try {
        const manager = node.serverMatter ? node.serverMatter.matterManager : undefined
        if (!manager || typeof manager.getCachedAttribute !== 'function') return
        const value = manager.getCachedAttribute(node.matterNodeId, node.matterEndpointId, CLUSTER.ON_OFF, 'onOff')
        if (value !== undefined) publishState(value === true, { source: 'initial-read', value })
      } catch (error) {
        setStatusMatter({ fill: 'red', shape: 'dot', text: `Initial read error ${error.message}`, payload: '' })
      }
    }

    node.handleSendMatter = (event) => {
      try {
        if (normalizeNodeId(event.nodeId) !== node.matterNodeId) return
        if (Number(event.endpointId) !== Number(node.matterEndpointId)) return
        if (Number(event.clusterId) !== Number(CLUSTER.ON_OFF)) return
        if (event.attributeName !== 'onOff') return
        const value = matterToKnx(CLUSTER.ON_OFF, 'onOff', event.value)
        publishState(value === true, event)
      } catch (error) {
        setStatusMatter({ fill: 'red', shape: 'dot', text: `Matter error ${error.message}`, payload: '' })
      }
    }

    node.handleSend = (msg) => {
      try {
        if (!msg.knx) return
        if (msg.knx.event === 'GroupValue_Read') {
          if (msg.knx.destination === config.GAPlugState && node.currentDeviceValue !== undefined) {
            publishState(node.currentDeviceValue, { source: 'knx-read' }, 'response')
          }
          return
        }
        if (msg.knx.destination !== config.GAPlugSwitch) return
        writeOnOff(boolFromKnx(msg, config.dptPlugSwitch || '1.001'))
      } catch (error) {
        setStatusMatter({ fill: 'red', shape: 'dot', text: `KNX error ${error.message}`, payload: '' })
      }
    }

    node.on('input', (msg, send, done) => {
      if (!node.enableNodePINS) {
        if (done) done()
        return
      }
      try {
        let value
        if (msg.payload !== undefined) value = msg.payload
        if (msg.on && msg.on.on !== undefined) value = msg.on.on
        writeOnOff(value === true || value === 1 || value === 'true')
        if (done) done()
      } catch (error) {
        setStatusMatter({ fill: 'red', shape: 'dot', text: `Flow error ${error.message}`, payload: '' })
        if (done) done(error)
      }
    })

    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }
    if (node.serverMatter) {
      node.serverMatter.removeClient(node)
      node.serverMatter.addClient(node)
    }

    node.on('close', (done) => {
      if (node.serverKNX) node.serverKNX.removeClient(node)
      if (node.serverMatter) node.serverMatter.removeClient(node)
      done()
    })
  }

  RED.nodes.registerType(nodeType, MatterOnOffNode)
}

module.exports = { createMatterSensorNode, createMatterOnOffNode }
