const dptlib = require('knxultimate').dptlib
const matterKnxConverter = require('./utils/matterKnxConverter')

module.exports = function (RED) {
  function knxUltimateMatterDevice (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverMatter = RED.nodes.getNode(config.serverMatter) || undefined

    node.topic = node.name
    node.name = config.name === undefined || config.name === '' ? 'Matter Device (BETA)' : config.name
    node.dpt = ''
    node.notifyreadrequest = false
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = false
    node.notifywrite = true
    node.initialread = true
    node.listenallga = true // Don't remove
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.currentPayload = ''
    node.passthrough = 'no'
    node.formatmultiplyvalue = 1
    node.formatnegativevalue = 'leave'
    node.formatdecimalsvalue = 2

    node.matterNodeId = config.matterNodeId || ''
    node.mappings = []
    try {
      node.mappings = Array.isArray(config.mappings) ? config.mappings : JSON.parse(config.mappings || '[]')
    } catch (error) {
      node.mappings = []
    }

    node.initializingAtStart = config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes'
    node.enableNodePINS = config.enableNodePINS === 'yes'
    node.inputs = node.enableNodePINS ? 1 : 0
    node.outputs = node.enableNodePINS ? 1 : 0

    let lastInitialReadTs = 0

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    const formatTs = (date) => {
      const d = date instanceof Date ? date : new Date(date)
      const provider = node.serverKNX
      if (provider && typeof provider.formatStatusTimestamp === 'function') return provider.formatStatusTimestamp(d)
      return `${d.getDate()}, ${d.toLocaleTimeString()}`
    }

    node.setNodeStatus = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sKNXNodeStatusText = `|KNX: ${text} ${payload} (${formatTs(dDate)})`
        pushStatus({ fill, shape, text: (node.sMatterNodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

    node.setNodeStatusMatter = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sMatterNodeStatusText = `|Matter: ${text} ${payload} (${formatTs(dDate)})`
        pushStatus({ fill, shape, text: node.sMatterNodeStatusText + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

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

    const sendMappingToKNX = (mapping, payload, outputtype = 'write') => {
      if (payload === undefined || mapping.ga === undefined || mapping.ga === '') return
      safeSendToKNX({
        grpaddr: mapping.ga,
        payload,
        dpt: mapping.dpt,
        outputtype
      }, outputtype)
    }

    const getMatterManager = () => {
      if (!node.serverMatter || node.serverMatter.matterManager === null || node.serverMatter.matterManager === undefined) return undefined
      return node.serverMatter.matterManager
    }

    // Send the cached Matter value of a status mapping to KNX
    const sendCachedStatusToKNX = (mapping, outputtype = 'write') => {
      const manager = getMatterManager()
      if (manager === undefined) return false
      const rawValue = manager.getCachedAttribute(node.matterNodeId, mapping.endpointId, mapping.clusterId, mapping.target)
      if (rawValue === undefined) return false
      const payload = matterKnxConverter.matterToKnx(mapping.clusterId, mapping.target, rawValue)
      if (payload === undefined) return false
      sendMappingToKNX(mapping, payload, outputtype)
      return true
    }

    // KNX -> Matter
    node.handleSend = (msg) => {
      if (node.matterNodeId === '') {
        node.setNodeStatusMatter({ fill: 'red', shape: 'ring', text: 'Missing Matter device selection', payload: '' })
        return
      }
      try {
        if (msg.knx.event === 'GroupValue_Read') {
          // Respond to read requests with the cached Matter values
          node.mappings.filter((m) => m.direction === 'status' && m.ga === msg.knx.destination).forEach((mapping) => {
            if (sendCachedStatusToKNX(mapping, 'response')) {
              node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Response', payload: mapping.ga })
            }
          })
          return
        }
        const manager = getMatterManager()
        node.mappings.filter((m) => m.direction === 'command' && m.ga === msg.knx.destination).forEach((mapping) => {
          const value = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(mapping.dpt))
          const matterAction = matterKnxConverter.knxToMatter(mapping, value)
          if (matterAction === null) return
          if (manager === undefined || node.serverMatter.linkStatus !== 'connected') {
            node.setNodeStatusMatter({ fill: 'red', shape: 'ring', text: 'Matter controller unavailable', payload: '' })
            return
          }
          manager.writeMatterQueueAdd({
            nodeId: node.matterNodeId,
            endpointId: mapping.endpointId,
            clusterId: mapping.clusterId,
            kind: matterAction.kind,
            name: matterAction.name,
            args: matterAction.args
          })
          node.setNodeStatusMatter({
            fill: 'green',
            shape: 'dot',
            text: `KNX->Matter ${mapping.clusterName || mapping.clusterId}.${matterAction.name}`,
            payload: value
          })
        })
      } catch (error) {
        node.setNodeStatusMatter({ fill: 'red', shape: 'dot', text: `KNX->Matter error ${error.message}`, payload: '' })
      }
    }

    // Matter -> KNX (attribute change reported by the subscription)
    node.handleSendMatter = (_event) => {
      try {
        if (_event === undefined) return
        if (_event.nodeId !== node.matterNodeId) return
        const matchingMappings = node.mappings.filter((m) => m.direction === 'status' &&
          Number(m.endpointId) === Number(_event.endpointId) &&
          Number(m.clusterId) === Number(_event.clusterId) &&
          m.targetKind === 'attribute' &&
          m.target === _event.attributeName)
        matchingMappings.forEach((mapping) => {
          const payload = matterKnxConverter.matterToKnx(_event.clusterId, _event.attributeName, _event.value)
          if (payload === undefined) return
          sendMappingToKNX(mapping, payload, 'write')
          node.setNodeStatusMatter({
            fill: 'blue',
            shape: 'dot',
            text: `Matter->KNX ${_event.attributeName}`,
            payload
          })
        })
        if (node.enableNodePINS) {
          node.send({
            topic: `${_event.clusterId}.${_event.attributeName}`,
            payload: _event.value,
            matter: _event
          })
        }
      } catch (error) {
        node.setNodeStatusMatter({ fill: 'red', shape: 'dot', text: `Matter->KNX error ${error.message}`, payload: '' })
      }
    }

    // Cluster events (e.g. switch presses). Forwarded to the flow only.
    node.handleMatterClusterEvent = (_event) => {
      try {
        if (_event === undefined || _event.nodeId !== node.matterNodeId) return
        if (node.enableNodePINS) {
          node.send({
            topic: `${_event.clusterId}.${_event.eventName}`,
            payload: _event.events,
            matter: _event
          })
        }
      } catch (error) { /* empty */ }
    }

    // Called by matter-config when the paired node completed its initial sync (or reconnected)
    node.handleMatterNodeInitialized = () => {
      try {
        if (!node.initializingAtStart) return
        if (node.matterNodeId === '') return
        const now = Date.now()
        if ((now - lastInitialReadTs) < 5000) return // Avoid duplicate bursts on reconnections
        let sentCount = 0
        node.mappings.filter((m) => m.direction === 'status' && m.targetKind === 'attribute').forEach((mapping) => {
          if (sendCachedStatusToKNX(mapping, 'write')) sentCount += 1
        })
        if (sentCount > 0) {
          lastInitialReadTs = now
          node.setNodeStatusMatter({ fill: 'green', shape: 'dot', text: `Initial read: ${sentCount} value(s) sent`, payload: '' })
        }
      } catch (error) {
        node.setNodeStatusMatter({ fill: 'red', shape: 'dot', text: `Initial read error ${error.message}`, payload: '' })
      }
    }

    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }
    if (node.serverMatter) {
      try {
        node.serverMatter.removeClient(node)
        node.serverMatter.addClient(node)
      } catch (error) {
        RED.log.error(`knxUltimateMatterDevice: register client error ${error.message}`)
      }
    }

    // Flow input pin: send raw Matter commands/attribute writes.
    // msg.payload = { endpointId, clusterId, command: 'on', args: {...} } or { endpointId, clusterId, attribute: 'onOff', value: true }
    node.on('input', (msg, send, done) => {
      if (!node.enableNodePINS) {
        if (done) done()
        return
      }
      try {
        const manager = getMatterManager()
        if (manager === undefined) throw new Error('Matter controller unavailable')
        const payload = msg.payload || {}
        if (payload.command !== undefined) {
          manager.writeMatterQueueAdd({
            nodeId: node.matterNodeId,
            endpointId: payload.endpointId,
            clusterId: payload.clusterId,
            kind: 'command',
            name: payload.command,
            args: payload.args
          })
        } else if (payload.attribute !== undefined) {
          manager.writeMatterQueueAdd({
            nodeId: node.matterNodeId,
            endpointId: payload.endpointId,
            clusterId: payload.clusterId,
            kind: 'attributeWrite',
            name: payload.attribute,
            args: payload.value
          })
        } else {
          throw new Error('msg.payload must contain "command" or "attribute"')
        }
        node.setNodeStatusMatter({ fill: 'green', shape: 'dot', text: 'Flow->Matter', payload })
        if (done) done()
      } catch (error) {
        node.setNodeStatusMatter({ fill: 'red', shape: 'dot', text: `Flow error ${error.message}`, payload: '' })
        if (done) done(error)
      }
    })

    node.on('close', () => {
      if (node.serverKNX) node.serverKNX.removeClient(node)
      if (node.serverMatter) node.serverMatter.removeClient(node)
    })
  }

  RED.nodes.registerType('knxUltimateMatterDevice', knxUltimateMatterDevice)
}
