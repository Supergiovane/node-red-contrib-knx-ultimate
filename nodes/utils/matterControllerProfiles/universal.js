'use strict'

const UNIVERSAL_NODE_ID = '__UNIVERSAL__'

const setupUniversalProfile = (RED, node, config) => {
  node.name = config.name || node.matterDeviceName || 'Matter Universal Controller'
  node.topic = node.name
  node.matterProfile = 'universal'

  const status = (fill, shape, text) => node.status({ fill, shape, text })
  const manager = () => node.serverMatter?.matterManager
  const valueFrom = (msg, key) => msg[key] !== undefined ? msg[key] : msg.matter?.[key]

  node.setNodeStatusMatter = (value) => {
    if (!value?.text) return
    const ready = /^(connected|ready|controller ready)$/i.test(value.text)
    status(ready ? 'green' : (value.fill || 'yellow'), ready ? 'dot' : (value.shape || 'ring'), ready ? 'Universal Matter mode' : value.text)
  }

  node.handleSendMatter = (event) => {
    try {
      if (!event || event.nodeId === undefined || event.endpointId === undefined || event.clusterId === undefined) return
      const attributeName = event.attributeName ?? event.attributeId ?? 'attribute'
      const matter = {
        ...event,
        source: 'attributeReport',
        nodeId: String(event.nodeId),
        endpointId: Number(event.endpointId),
        clusterId: Number(event.clusterId),
        attributeName,
        value: event.value,
        timestamp: Date.now(),
        raw: event
      }
      node.send({
        topic: `matter/${matter.nodeId}/${matter.endpointId}/${matter.clusterId}/${attributeName}`,
        payload: event.value,
        matter
      })
      status('blue', 'dot', `Attribute: ${attributeName}`)
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice Universal attribute: ${error.message}`)
      status('red', 'ring', error.message)
    }
  }

  node.handleMatterClusterEvent = (event) => {
    try {
      if (!event || event.nodeId === undefined || event.endpointId === undefined || event.clusterId === undefined) return
      const eventName = event.eventName ?? event.eventId ?? 'event'
      const matter = {
        ...event,
        source: 'clusterEvent',
        nodeId: String(event.nodeId),
        endpointId: Number(event.endpointId),
        clusterId: Number(event.clusterId),
        eventName,
        timestamp: Date.now(),
        raw: event
      }
      node.send({
        topic: `matter/${matter.nodeId}/${matter.endpointId}/${matter.clusterId}/event/${eventName}`,
        payload: event.events !== undefined ? event.events : event.value,
        matter
      })
      status('blue', 'ring', `Event: ${eventName}`)
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice Universal cluster event: ${error.message}`)
      status('red', 'ring', error.message)
    }
  }

  node.handleMatterNodeInitialized = (event) => {
    try {
      const nodeId = event && typeof event === 'object' ? event.nodeId : event
      if (nodeId === undefined || nodeId === null || String(nodeId) === '') return
      node.send({
        topic: `matter/${String(nodeId)}/initialized`,
        payload: true,
        matter: {
          source: 'nodeInitialized',
          nodeId: String(nodeId),
          timestamp: Date.now(),
          raw: event
        }
      })
      status('green', 'dot', `Universal: node ${String(nodeId)}`)
    } catch (error) {
      RED.log.error(`knxUltimateMatterControllerDevice Universal initialization: ${error.message}`)
      status('red', 'ring', error.message)
    }
  }

  if (node.serverMatter) {
    node.serverMatter.removeClient(node)
    node.serverMatter.addClient(node)
  } else {
    status('yellow', 'ring', 'Matter controller not ready')
  }

  node.on('input', (msg, send, done) => {
    const output = typeof send === 'function' ? send : node.send.bind(node)
    Promise.resolve().then(async () => {
      const nodeIdValue = valueFrom(msg, 'nodeId')
      const endpointIdValue = valueFrom(msg, 'endpointId')
      const clusterIdValue = valueFrom(msg, 'clusterId')
      const command = valueFrom(msg, 'command')
      const attribute = valueFrom(msg, 'attribute')
      if (nodeIdValue === undefined || nodeIdValue === null || String(nodeIdValue) === '' ||
        endpointIdValue === undefined || endpointIdValue === null || String(endpointIdValue).trim() === '' ||
        clusterIdValue === undefined || clusterIdValue === null || String(clusterIdValue).trim() === '') {
        throw new Error('Matter input requires nodeId, endpointId and clusterId')
      }
      if ((command === undefined || command === null || command === '') &&
        (attribute === undefined || attribute === null || attribute === '')) {
        throw new Error('Matter input requires command or attribute')
      }
      const currentManager = manager()
      if (!currentManager) throw new Error('Matter controller not ready')
      const nodeId = String(nodeIdValue)
      const endpointId = Number(endpointIdValue)
      const clusterId = Number(clusterIdValue)
      if (!Number.isFinite(endpointId) || !Number.isFinite(clusterId)) {
        throw new Error('Matter input requires nodeId, endpointId and clusterId')
      }

      if (command !== undefined && command !== null && command !== '') {
        await currentManager.writeMatterQueueAdd({
          nodeId,
          endpointId,
          clusterId,
          kind: 'command',
          name: command,
          args: valueFrom(msg, 'args') ?? {}
        })
        status('green', 'dot', `Matter command: ${command}`)
        if (done) done()
        return
      }

      const value = valueFrom(msg, 'value')
      if (value !== undefined) {
        await currentManager.writeMatterQueueAdd({
          nodeId,
          endpointId,
          clusterId,
          kind: 'attributeWrite',
          name: attribute,
          args: value
        })
        status('green', 'dot', `Matter write: ${attribute}`)
        if (done) done()
        return
      }

      const readValue = await currentManager.readAttribute(
        nodeId,
        endpointId,
        clusterId,
        attribute,
        valueFrom(msg, 'requestFromRemote') === true
      )
      output({
        ...msg,
        payload: readValue,
        matter: {
          ...(msg.matter || {}),
          source: 'inputRead',
          nodeId,
          endpointId,
          clusterId,
          attribute
        }
      })
      status('blue', 'dot', `Matter read: ${attribute}`)
      if (done) done()
    }).catch((error) => {
      status('red', 'ring', error.message)
      if (typeof done === 'function') done(error)
      else node.error(error, msg)
    })
  })

  node.on('close', (done) => {
    try { if (node.serverMatter) node.serverMatter.removeClient(node) } catch (error) { /* empty */ }
    done()
  })
}

module.exports = { UNIVERSAL_NODE_ID, setupUniversalProfile }
