const dptlib = require('knxultimate').dptlib

// One KNX device exposed as a Matter device. It points to a matterbridge-config node
// (the actual Matter server/bridge, paired once by Alexa/Google/Apple Home) and registers
// itself as one bridged device. This is the opposite direction of the Matter Device node.
module.exports = function (RED) {
  // The functions of each device type, with their GA/DPT config fields.
  // direction 'command' = Matter -> KNX (write to the bus), 'status' = KNX -> Matter.
  const DEVICE_FUNCTIONS = {
    onofflight: [
      { fn: 'onoff', direction: 'command', ga: 'gaOnOff', dpt: 'dptOnOff', fallbackDpt: '1.001' },
      { fn: 'onoff', direction: 'status', ga: 'gaOnOffStatus', dpt: 'dptOnOffStatus', fallbackDpt: '1.001' }
    ],
    onoffplug: [
      { fn: 'onoff', direction: 'command', ga: 'gaOnOff', dpt: 'dptOnOff', fallbackDpt: '1.001' },
      { fn: 'onoff', direction: 'status', ga: 'gaOnOffStatus', dpt: 'dptOnOffStatus', fallbackDpt: '1.001' }
    ],
    dimmablelight: [
      { fn: 'onoff', direction: 'command', ga: 'gaOnOff', dpt: 'dptOnOff', fallbackDpt: '1.001' },
      { fn: 'onoff', direction: 'status', ga: 'gaOnOffStatus', dpt: 'dptOnOffStatus', fallbackDpt: '1.001' },
      { fn: 'level', direction: 'command', ga: 'gaLevel', dpt: 'dptLevel', fallbackDpt: '5.001' },
      { fn: 'level', direction: 'status', ga: 'gaLevelStatus', dpt: 'dptLevelStatus', fallbackDpt: '5.001' }
    ],
    rgblight: [
      { fn: 'onoff', direction: 'command', ga: 'gaOnOff', dpt: 'dptOnOff', fallbackDpt: '1.001' },
      { fn: 'onoff', direction: 'status', ga: 'gaOnOffStatus', dpt: 'dptOnOffStatus', fallbackDpt: '1.001' },
      { fn: 'level', direction: 'command', ga: 'gaLevel', dpt: 'dptLevel', fallbackDpt: '5.001' },
      { fn: 'level', direction: 'status', ga: 'gaLevelStatus', dpt: 'dptLevelStatus', fallbackDpt: '5.001' },
      { fn: 'rgb', direction: 'command', ga: 'gaRGB', dpt: 'dptRGB', fallbackDpt: '232.600' },
      { fn: 'rgb', direction: 'status', ga: 'gaRGBStatus', dpt: 'dptRGBStatus', fallbackDpt: '232.600' }
    ],
    colortemperaturelight: [
      { fn: 'onoff', direction: 'command', ga: 'gaOnOff', dpt: 'dptOnOff', fallbackDpt: '1.001' },
      { fn: 'onoff', direction: 'status', ga: 'gaOnOffStatus', dpt: 'dptOnOffStatus', fallbackDpt: '1.001' },
      { fn: 'level', direction: 'command', ga: 'gaLevel', dpt: 'dptLevel', fallbackDpt: '5.001' },
      { fn: 'level', direction: 'status', ga: 'gaLevelStatus', dpt: 'dptLevelStatus', fallbackDpt: '5.001' },
      { fn: 'colortemp', direction: 'command', ga: 'gaCT', dpt: 'dptCT', fallbackDpt: '7.600' },
      { fn: 'colortemp', direction: 'status', ga: 'gaCTStatus', dpt: 'dptCTStatus', fallbackDpt: '7.600' }
    ],
    temperaturesensor: [{ fn: 'temperature', direction: 'status', ga: 'gaStatus', dpt: 'dptStatus', fallbackDpt: '9.001' }],
    humiditysensor: [{ fn: 'humidity', direction: 'status', ga: 'gaStatus', dpt: 'dptStatus', fallbackDpt: '9.007' }],
    lightsensor: [{ fn: 'illuminance', direction: 'status', ga: 'gaStatus', dpt: 'dptStatus', fallbackDpt: '9.004' }],
    occupancysensor: [{ fn: 'occupancy', direction: 'status', ga: 'gaStatus', dpt: 'dptStatus', fallbackDpt: '1.011' }],
    contactsensor: [{ fn: 'contact', direction: 'status', ga: 'gaStatus', dpt: 'dptStatus', fallbackDpt: '1.002' }],
    windowcovering: [
      { fn: 'updown', direction: 'command', ga: 'gaUpDown', dpt: 'dptUpDown', fallbackDpt: '1.008' },
      { fn: 'stop', direction: 'command', ga: 'gaStop', dpt: 'dptStop', fallbackDpt: '1.017' },
      { fn: 'position', direction: 'command', ga: 'gaPosition', dpt: 'dptPosition', fallbackDpt: '5.001' },
      { fn: 'position', direction: 'status', ga: 'gaPositionStatus', dpt: 'dptPositionStatus', fallbackDpt: '5.001' }
    ],
    thermostat: [
      { fn: 'currenttemp', direction: 'status', ga: 'gaCurrentTemp', dpt: 'dptCurrentTemp', fallbackDpt: '9.001' },
      { fn: 'setpoint', direction: 'command', ga: 'gaSetpoint', dpt: 'dptSetpoint', fallbackDpt: '9.001' },
      { fn: 'setpoint', direction: 'status', ga: 'gaSetpointStatus', dpt: 'dptSetpointStatus', fallbackDpt: '9.001' }
    ],
    smokecoalarm: [
      { fn: 'smoke', direction: 'status', ga: 'gaSmoke', dpt: 'dptSmoke', fallbackDpt: '1.005' },
      { fn: 'co', direction: 'status', ga: 'gaCO', dpt: 'dptCO', fallbackDpt: '1.005' }
    ],
    waterleakdetector: [{ fn: 'leak', direction: 'status', ga: 'gaStatus', dpt: 'dptStatus', fallbackDpt: '1.005' }],
    airqualitysensor: [{ fn: 'co2', direction: 'status', ga: 'gaStatus', dpt: 'dptStatus', fallbackDpt: '9.008' }],
    fan: [
      { fn: 'fanspeed', direction: 'command', ga: 'gaFanSpeed', dpt: 'dptFanSpeed', fallbackDpt: '5.001' },
      { fn: 'fanspeed', direction: 'status', ga: 'gaFanSpeedStatus', dpt: 'dptFanSpeedStatus', fallbackDpt: '5.001' }
    ],
    robotvacuum: [] // Flow-only device: talks to the flow through the node PINs
  }

  function knxUltimateMatterBridge (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverMatterBridge = RED.nodes.getNode(config.serverMatterBridge) || undefined

    node.deviceType = config.deviceType || 'onofflight'
    node.name = config.name === undefined || config.name === '' ? 'Matter device' : config.name
    // The Matter device id is the (stable) Node-RED node id, so the endpoint survives re-deploys.
    node.matterDeviceId = node.id
    node.invertPosition = config.invertPosition === true || config.invertPosition === 'true'
    node.coverExposeAsDimmableLight = config.coverExposeAsDimmableLight === true || config.coverExposeAsDimmableLight === 'true'
    node.turnOnBehavior = config.turnOnBehavior || 'ignoreLevelAfterOn'
    node.ignoreLevelAfterOnMs = Number(config.ignoreLevelAfterOnMs)
    if (!Number.isFinite(node.ignoreLevelAfterOnMs) || node.ignoreLevelAfterOnMs < 0) node.ignoreLevelAfterOnMs = 800
    node.coverUpdateMode = config.coverUpdateMode || 'optimistic'
    node.coverStatusTimeoutMs = Number(config.coverStatusTimeoutMs)
    if (!Number.isFinite(node.coverStatusTimeoutMs) || node.coverStatusTimeoutMs < 0) node.coverStatusTimeoutMs = 3000
    node.readStatusAtStartup = config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes'
    node.enableNodePINS = config.enableNodePINS === 'yes'
    node.inputs = node.enableNodePINS ? 1 : 0
    node.outputs = node.enableNodePINS ? 1 : 0

    node.topic = ''
    node.dpt = ''
    node.notifyreadrequest = false
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = false
    node.notifywrite = true
    node.initialread = false
    node.listenallga = true // Don't remove
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.currentPayload = ''
    node.passthrough = 'no'
    node.formatmultiplyvalue = 1
    node.formatnegativevalue = 'leave'
    node.formatdecimalsvalue = 2

    let initialReadTimer = null
    let suppressLevelCommandsUntil = 0
    let coverStatusTimer = null

    const formatTs = (date) => {
      const d = date instanceof Date ? date : new Date(date)
      const provider = node.serverKNX
      if (provider && typeof provider.formatStatusTimestamp === 'function') return provider.formatStatusTimestamp(d)
      return `${d.getDate()}, ${d.toLocaleTimeString()}`
    }

    const pushStatus = (status) => {
      if (!status) return
      try {
        const provider = node.serverKNX
        if (provider && typeof provider.applyStatusUpdate === 'function') {
          provider.applyStatusUpdate(node, status)
        } else {
          node.status(status)
        }
      } catch (error) { /* empty */ }
    }

    node.setNodeStatus = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        pushStatus({ fill, shape, text: `${text} ${payload} (${formatTs(new Date())})` })
      } catch (error) { /* empty */ }
    }

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          node.setNodeStatus({ fill: 'red', shape: 'dot', text: `KNX server missing (${context})` })
          return
        }
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id })
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `KNX send error ${error.message}` })
      }
    }

    const clearCoverStatusTimer = () => {
      if (coverStatusTimer !== null) {
        clearTimeout(coverStatusTimer)
        coverStatusTimer = null
      }
    }

    // Precompute the routing tables for this single device:
    // statusRoutes: GA -> [{ fn, dpt }] (KNX -> Matter)
    // commandRoutes: fn -> { ga, dpt } (Matter -> KNX)
    const statusRoutes = new Map()
    const commandRoutes = new Map()
    const devConfigValue = (key) => (config[key] || '').toString().trim()
    ;(DEVICE_FUNCTIONS[node.deviceType] || []).forEach((fnDef) => {
      const ga = devConfigValue(fnDef.ga)
      if (ga === '') return
      const dpt = devConfigValue(fnDef.dpt) || fnDef.fallbackDpt
      if (fnDef.direction === 'status') {
        if (!statusRoutes.has(ga)) statusRoutes.set(ga, [])
        statusRoutes.get(ga).push({ fn: fnDef.fn, dpt })
      } else {
        commandRoutes.set(fnDef.fn, { ga, dpt })
      }
    })
    const hasStatusRouteFor = (fn) => {
      for (const routes of statusRoutes.values()) {
        if (routes.some((route) => route.fn === fn)) return true
      }
      return false
    }

    const applyOptimisticCoverPosition = (command) => {
      if (node.deviceType !== 'windowcovering' || node.coverUpdateMode !== 'optimistic' || !node.serverMatterBridge) return
      let optimisticPosition
      if (command.fn === 'position') optimisticPosition = command.value
      if (command.fn === 'updown') optimisticPosition = command.value === true ? 100 : 0
      if (optimisticPosition === undefined) return
      node.serverMatterBridge.setDeviceState(node.matterDeviceId, 'position', optimisticPosition)
      clearCoverStatusTimer()
      if (node.coverStatusTimeoutMs > 0 && hasStatusRouteFor('position')) {
        coverStatusTimer = setTimeout(() => {
          coverStatusTimer = null
          node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'Waiting for KNX cover status', payload: optimisticPosition })
        }, node.coverStatusTimeoutMs)
      }
    }
    node.knxUltimateAcceptedGAs = Array.from(statusRoutes.keys())

    // The device definition consumed by the bridge engine (via the config node).
    node.getMatterDef = () => ({
      id: node.matterDeviceId,
      type: node.deviceType,
      name: node.name,
      invertPosition: node.invertPosition === true,
      coverExposeAsDimmableLight: node.coverExposeAsDimmableLight === true,
      coverUpdateMode: node.coverUpdateMode
    })

    // Reflects the bridge (config node) status on this device node.
    node.handleBridgeStatus = () => {
      try {
        if (node.serverMatterBridge === undefined) {
          node.setNodeStatus({ fill: 'red', shape: 'ring', text: 'No Matter bridge selected' })
          return
        }
        const info = node.serverMatterBridge.getPairingInfo()
        if (!info.running) {
          node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Matter bridge starting...' })
        } else if (info.commissioned) {
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: `Ready (bridge paired with ${info.fabrics.length} controller(s))` })
        } else {
          node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: `Bridge awaiting pairing (code ${info.manualPairingCode || ''})` })
        }
      } catch (error) { /* empty */ }
    }

    // Matter -> KNX: a controller (Alexa...) sent a command to this device.
    node.handleMatterCommand = (command) => {
      try {
        if (node.deviceType === 'windowcovering' && command.matterDiagnostic && typeof node.log === 'function') {
          node.log(`Matter WindowCovering command: ${JSON.stringify({
            fn: command.fn,
            value: command.value,
            ...command.matterDiagnostic
          })}`)
        }
        if (node.enableNodePINS) {
          try {
            node.send({
              topic: node.name,
              payload: command.value,
              device: { id: node.matterDeviceId, type: node.deviceType, name: node.name },
              matter: command
            })
          } catch (error) { /* empty */ }
        }
        // Confirm the requested position to Matter even when this is a flow-only
        // device and no KNX command GA is configured.
        applyOptimisticCoverPosition(command)
        const route = commandRoutes.get(command.fn)
        if (route === undefined) {
          if (node.enableNodePINS) return // Flow-only device: the flow already got the command
          node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: `No command GA for ${command.fn}: check the node and re-deploy` })
          return
        }
        if (!node.serverKNX) {
          if (node.enableNodePINS) return
          node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: `No KNX gateway: enable the node PINs to handle ${command.fn}` })
          return
        }
        if (command.fn === 'onoff' && command.value === true && node.turnOnBehavior === 'ignoreLevelAfterOn') {
          suppressLevelCommandsUntil = Date.now() + node.ignoreLevelAfterOnMs
        }
        if (command.fn === 'level' && node.turnOnBehavior === 'ignoreLevelAfterOn' && Date.now() < suppressLevelCommandsUntil) {
          node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'Ignored Matter level after On', payload: command.value })
          return
        }
        safeSendToKNX({ grpaddr: route.ga, payload: command.value, dpt: route.dpt, outputtype: 'write' }, 'write')
        node.setNodeStatus({ fill: 'green', shape: 'dot', text: `Matter->KNX ${command.fn}`, payload: command.value })
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Matter->KNX error ${error.message}` })
      }
    }

    // KNX -> Matter: telegrams from the bus update the Matter attributes of this device.
    node.handleSend = (msg) => {
      try {
        if (!msg || !msg.knx) return
        if (msg.knx.event === 'GroupValue_Read') return
        const routes = statusRoutes.get(msg.knx.destination)
        if (routes === undefined || node.serverMatterBridge === undefined) return
        routes.forEach((route) => {
          try {
            const value = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(route.dpt))
            if (value === undefined || value === null) return
            node.serverMatterBridge.setDeviceState(node.matterDeviceId, route.fn, value)
            if (node.deviceType === 'windowcovering' && route.fn === 'position') clearCoverStatusTimer()
            node.setNodeStatus({ fill: 'blue', shape: 'dot', text: `KNX->Matter ${route.fn}`, payload: value })
          } catch (error) {
            node.setNodeStatus({ fill: 'red', shape: 'dot', text: `KNX->Matter error ${error.message}` })
          }
        })
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `KNX->Matter error ${error.message}` })
      }
    }

    // Ask the KNX bus for the current values of the status GAs, so the Matter
    // attributes are populated before a controller reads them.
    const doInitialRead = () => {
      if (!node.readStatusAtStartup || !node.serverKNX) return
      try {
        let delay = 0
        statusRoutes.forEach((routes, ga) => {
          delay += 200
          setTimeout(() => {
            safeSendToKNX({ grpaddr: ga, payload: '', dpt: '', outputtype: 'read' }, 'read')
          }, delay)
        })
      } catch (error) { /* empty */ }
    }

    // Register with the KNX gateway (to receive bus telegrams) and the Matter bridge.
    if (node.serverKNX) {
      try {
        node.serverKNX.removeClient(node)
        node.serverKNX.addClient(node)
      } catch (error) {
        RED.log.error(`knxUltimateMatterBridge: register KNX client error ${error.message}`)
      }
    }
    if (node.serverMatterBridge) {
      try {
        node.serverMatterBridge.registerDevice(node)
      } catch (error) {
        RED.log.error(`knxUltimateMatterBridge: register bridge device error ${error.message}`)
      }
    } else {
      node.setNodeStatus({ fill: 'red', shape: 'ring', text: 'No Matter bridge selected' })
    }

    initialReadTimer = setTimeout(() => doInitialRead(), 12000)

    // Flow input pin: updates the Matter state of this device without going through the KNX bus.
    // msg.payload = { function: 'onoff'|'level'|'position'|'temperature'|..., value: ... }
    node.on('input', (msg, send, done) => {
      if (!node.enableNodePINS) {
        if (done) done()
        return
      }
      try {
        const payload = msg.payload || {}
        const fn = (payload.function || payload.fn || '').toString().trim()
        if (fn === '' || payload.value === undefined) throw new Error('msg.payload must be { function, value }')
        if (node.serverMatterBridge === undefined) throw new Error('No Matter bridge selected')
        node.serverMatterBridge.setDeviceState(node.matterDeviceId, fn, payload.value)
        node.setNodeStatus({ fill: 'green', shape: 'dot', text: `Flow->Matter ${fn}`, payload: payload.value })
        if (done) done()
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Flow error ${error.message}`, payload: '' })
        if (done) done(error)
      }
    })

    node.on('close', (done) => {
      try {
        if (initialReadTimer !== null) clearTimeout(initialReadTimer)
        clearCoverStatusTimer()
      } catch (error) { /* empty */ }
      try {
        if (node.serverKNX) node.serverKNX.removeClient(node)
      } catch (error) { /* empty */ }
      try {
        if (node.serverMatterBridge) node.serverMatterBridge.unregisterDevice(node)
      } catch (error) { /* empty */ }
      if (done) done()
    })
  }

  RED.nodes.registerType('knxUltimateMatterBridge', knxUltimateMatterBridge)
}
