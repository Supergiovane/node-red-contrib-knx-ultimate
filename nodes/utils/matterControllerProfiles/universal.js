'use strict'

const UNIVERSAL_NODE_ID = '__UNIVERSAL__'
const POWER_SOURCE_FEATURE_BATTERY = 0x02

const setupUniversalProfile = (RED, node, config) => {
  node.name = config.name || node.matterDeviceName || 'Matter Universal Controller'
  node.topic = node.name
  node.matterProfile = 'universal'
  node.notifyreadrequest = true
  node.notifyresponse = false
  node.notifywrite = true
  node.listenallga = true
  node.outputtype = 'write'
  node.outputRBE = 'false'
  node.inputRBE = 'false'
  node.passthrough = 'no'
  const universalService = config.universalService || 'batteryMonitor'
  const lowBatteryGa = String(config.universalLowBatteryGA || '').trim()
  const lowBatteryTextGa = String(config.universalLowBatteryTextGA || '').trim()
  node.knxUltimateAcceptedGAs = [lowBatteryGa, lowBatteryTextGa].filter((ga) => ga !== '')
  const enabledUnlessFalse = (value) => value !== false && value !== 'false'
  const batteryOnlyLow = enabledUnlessFalse(config.universalBatteryOnlyLow)
  const emitInitialState = enabledUnlessFalse(config.universalEmitInitialState)
  const includeRawEvent = enabledUnlessFalse(config.universalIncludeRawEvent)
  const configuredBatteryThreshold = Number(config.universalBatteryThreshold ?? 20)
  const batteryThreshold = Number.isFinite(configuredBatteryThreshold)
    ? Math.min(100, Math.max(0, configuredBatteryThreshold))
    : 20
  const batteryStates = new Map()
  const lastEmittedBatteryStates = new Map()
  const deviceNames = new Map()
  const endpointNames = new Map()
  let lastKnxAlarm
  let lastLowKeys = ''
  let lowBatteryCycleTimer
  let lowBatteryCycleIndex = 0
  let currentLowBatteryText = ''

  const status = (fill, shape, text) => node.status({ fill, shape, text })
  const manager = () => node.serverMatter?.matterManager
  const valueFrom = (msg, key) => msg[key] !== undefined ? msg[key] : msg.matter?.[key]
  const batteryKey = (nodeId, endpointId) => `${String(nodeId)}/${Number(endpointId)}`
  const chargeLevelName = (value) => ['ok', 'warning', 'critical'][Number(value)] || value
  const replaceabilityName = (value) => ['unspecified', 'notReplaceable', 'userReplaceable', 'factoryReplaceable'][Number(value)] || value
  const isBatteryPowerSource = (state) => {
    const featureMap = Number(state.attributes.featureMap)
    return Number.isFinite(featureMap) && (featureMap & POWER_SOURCE_FEATURE_BATTERY) !== 0
  }

  const normalizedBattery = (state) => {
    const attributes = state.attributes
    const rawPercentRemaining = attributes.batPercentRemaining
    const percent = Number.isFinite(Number(rawPercentRemaining)) ? Number(rawPercentRemaining) / 2 : undefined
    const chargeLevel = attributes.batChargeLevel
    const replacementNeeded = attributes.batReplacementNeeded === true
    const lowBattery = (percent !== undefined && percent <= batteryThreshold) ||
      [1, 2, 'warning', 'critical'].includes(chargeLevel) ||
      replacementNeeded
    return {
      percent,
      rawPercentRemaining,
      chargeLevel: chargeLevel === undefined ? undefined : chargeLevelName(chargeLevel),
      replacementNeeded: attributes.batReplacementNeeded,
      replaceability: attributes.batReplaceability === undefined ? undefined : replaceabilityName(attributes.batReplaceability),
      voltageMv: attributes.batVoltage,
      status: attributes.status,
      lowBattery,
      threshold: batteryThreshold
    }
  }

  const batteryList = () => [...batteryStates.values()]
    .filter(isBatteryPowerSource)
    .map((state) => ({
      nodeId: state.nodeId,
      deviceName: state.deviceName,
      endpointId: state.endpointId,
      battery: normalizedBattery(state),
      lastSeen: state.lastSeen
    }))

  const sendKnx = (ga, payload, dpt, outputtype = 'write') => {
    if (ga === '' || !node.serverKNX?.sendKNXTelegramToKNXEngine) return
    node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr: ga, payload, dpt, outputtype, nodecallerid: node.id })
  }

  const lowBatteries = () => batteryList().filter((entry) => entry.battery.lowBattery)
  const batteryDisplayName = (entry) => String(entry.deviceName || `Matter ${entry.nodeId}/${entry.endpointId}`).slice(0, 14)
  const stopBatteryCycle = () => {
    if (lowBatteryCycleTimer) clearInterval(lowBatteryCycleTimer)
    lowBatteryCycleTimer = undefined
  }
  const sendNextLowBatteryName = () => {
    const entries = lowBatteries()
    if (entries.length === 0) return
    const entry = entries[lowBatteryCycleIndex % entries.length]
    lowBatteryCycleIndex = (lowBatteryCycleIndex + 1) % entries.length
    currentLowBatteryText = batteryDisplayName(entry)
    sendKnx(lowBatteryTextGa, currentLowBatteryText, '16.001')
  }
  const syncKnxBatteryOutputs = () => {
    const entries = lowBatteries()
    const alarm = entries.length > 0
    if (lastKnxAlarm !== alarm) {
      sendKnx(lowBatteryGa, alarm, '1.005')
      lastKnxAlarm = alarm
    }
    const lowKeys = entries.map((entry) => batteryKey(entry.nodeId, entry.endpointId)).sort().join(',')
    if (lowKeys === lastLowKeys) return
    lastLowKeys = lowKeys
    stopBatteryCycle()
    lowBatteryCycleIndex = 0
    if (!alarm) {
      currentLowBatteryText = ''
      sendKnx(lowBatteryTextGa, '', '16.001')
      return
    }
    sendNextLowBatteryName()
    lowBatteryCycleTimer = setInterval(sendNextLowBatteryName, 2000)
    lowBatteryCycleTimer.unref?.()
  }

  const refreshBatteryStatus = () => {
    const batteries = batteryList()
    const lowCount = batteries.filter((entry) => entry.battery.lowBattery).length
    status(lowCount > 0 ? 'yellow' : 'green', 'dot',
      lowCount > 0 ? `Batteries: ${batteries.length} (${lowCount} low)` : `Batteries: ${batteries.length}`)
  }

  const emitBatteryState = (state, source, rawEvent) => {
    const key = batteryKey(state.nodeId, state.endpointId)
    if (!isBatteryPowerSource(state)) {
      lastEmittedBatteryStates.delete(key)
      return
    }
    const battery = normalizedBattery(state)
    if (batteryOnlyLow && !battery.lowBattery) {
      lastEmittedBatteryStates.delete(key)
      return
    }
    const signature = JSON.stringify(battery)
    if (lastEmittedBatteryStates.get(key) === signature) return
    lastEmittedBatteryStates.set(key, signature)
    const timestamp = new Date().toISOString()
    node.send({
      topic: `matter/battery/${state.nodeId}/${state.endpointId}`,
      payload: {
        nodeId: state.nodeId,
        deviceName: state.deviceName,
        endpointId: state.endpointId,
        battery,
        timestamp
      },
      matter: {
        source,
        nodeId: state.nodeId,
        endpointId: state.endpointId,
        clusterId: 47,
        clusterName: rawEvent?.clusterName || 'PowerSource',
        attributeId: rawEvent?.attributeId,
        attributeName: rawEvent?.attributeName,
        value: rawEvent?.value,
        raw: includeRawEvent ? rawEvent : undefined
      }
    })
    syncKnxBatteryOutputs()
    refreshBatteryStatus()
  }

  const updateBatteryState = (event, source = 'batteryReport', emit = true) => {
    if (Number(event?.clusterId) !== 47 || event.attributeName === undefined) return
    const key = batteryKey(event.nodeId, event.endpointId)
    const state = batteryStates.get(key) || {
      nodeId: String(event.nodeId),
      deviceName: endpointNames.get(key) || deviceNames.get(String(event.nodeId)) || '',
      endpointId: Number(event.endpointId),
      attributes: {}
    }
    state.deviceName = endpointNames.get(key) || deviceNames.get(state.nodeId) || state.deviceName
    state.attributes[event.attributeName] = event.value
    state.lastSeen = new Date().toISOString()
    if (event.attributeName === 'featureMap' && !isBatteryPowerSource(state)) {
      batteryStates.delete(key)
      lastEmittedBatteryStates.delete(key)
      syncKnxBatteryOutputs()
      return
    }
    batteryStates.set(key, state)
    if (emit) {
      emitBatteryState(state, source, event)
      syncKnxBatteryOutputs()
    }
  }

  const scanBatterySnapshot = (nodeId) => {
    if (!node.serverMatter || !emitInitialState) return
    const details = node.serverMatter.getCommissionedNodesDetails?.() || []
    details.forEach((detail) => deviceNames.set(String(detail.nodeId), detail.name || ''))
    const selected = nodeId === undefined
      ? details
      : details.filter((detail) => String(detail.nodeId) === String(nodeId))
    selected.forEach((detail) => {
      try {
        const structure = node.serverMatter.getNodeStructure(String(detail.nodeId))
        ;(structure?.endpoints || []).forEach((endpoint) => {
          endpointNames.set(batteryKey(detail.nodeId, endpoint.endpointId), endpoint.name || detail.name || '')
          ;(endpoint.clusters || []).filter((cluster) => Number(cluster.id) === 47).forEach((cluster) => {
            const events = (cluster.attributes || [])
              .filter((attribute) => attribute.value !== undefined)
              .map((attribute) => ({
                nodeId: String(detail.nodeId),
                endpointId: Number(endpoint.endpointId),
                clusterId: 47,
                clusterName: cluster.name,
                attributeId: attribute.id,
                attributeName: attribute.name,
                value: attribute.value
              }))
            events.forEach((event) => updateBatteryState(event, 'batterySnapshot', false))
            const state = batteryStates.get(batteryKey(detail.nodeId, endpoint.endpointId))
            if (state) emitBatteryState(state, 'batterySnapshot', events.at(-1))
          })
        })
      } catch (error) {
        RED.log.debug(`knxUltimateMatterControllerDevice Universal battery snapshot: ${error.message}`)
      }
    })
    syncKnxBatteryOutputs()
    refreshBatteryStatus()
  }

  node.setNodeStatus = ({ fill = 'grey', shape = 'ring', text = '' } = {}) => {
    if (/disconnected|waiting|error/i.test(text)) status(fill, shape, text)
  }

  node.handleSend = (msg) => {
    if (msg?.knx?.event !== 'GroupValue_Read') return
    const destination = String(msg.knx.destination || '')
    if (destination === lowBatteryGa) sendKnx(lowBatteryGa, lowBatteries().length > 0, '1.005', 'response')
    if (destination === lowBatteryTextGa) sendKnx(lowBatteryTextGa, currentLowBatteryText, '16.001', 'response')
  }

  node.setNodeStatusMatter = (value) => {
    if (!value?.text) return
    if (/^(matter disconnected|waiting for matter controller)$/i.test(value.text)) {
      status(value.fill || 'red', value.shape || 'ring', value.text)
      return
    }
    if (universalService === 'batteryMonitor') {
      refreshBatteryStatus()
      return
    }
    status('green', 'dot', 'Universal Matter mode')
  }

  node.handleSendMatter = (event) => {
    try {
      if (!event || event.nodeId === undefined || event.endpointId === undefined || event.clusterId === undefined) return
      const attributeName = event.attributeName ?? event.attributeId ?? 'attribute'
      if (universalService === 'batteryMonitor') {
        updateBatteryState(event)
        return
      }
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
      if (universalService === 'batteryMonitor') return
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
      if (universalService === 'batteryMonitor') {
        scanBatterySnapshot(nodeId)
        return
      }
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
    if (universalService === 'batteryMonitor') {
      Promise.resolve().then(() => scanBatterySnapshot()).catch((error) => {
        RED.log.error(`knxUltimateMatterControllerDevice Universal battery startup: ${error.message}`)
      })
    }
  } else {
    status('yellow', 'ring', 'Matter controller not ready')
  }
  if (node.serverKNX) {
    node.serverKNX.removeClient(node)
    node.serverKNX.addClient(node)
  }

  node.on('input', (msg, send, done) => {
    const output = typeof send === 'function' ? send : node.send.bind(node)
    Promise.resolve().then(async () => {
      const action = msg.action ?? msg.payload?.action ?? msg.matter?.action
      if (action === 'getAllBatteries') {
        output({
          ...msg,
          payload: batteryList(),
          matter: {
            ...(msg.matter || {}),
            source: 'getAllBatteries',
            timestamp: Date.now()
          }
        })
        refreshBatteryStatus()
        if (done) done()
        return
      }
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
    stopBatteryCycle()
    try { if (node.serverKNX) node.serverKNX.removeClient(node) } catch (error) { /* empty */ }
    try { if (node.serverMatter) node.serverMatter.removeClient(node) } catch (error) { /* empty */ }
    done()
  })
}

module.exports = { UNIVERSAL_NODE_ID, setupUniversalProfile }
