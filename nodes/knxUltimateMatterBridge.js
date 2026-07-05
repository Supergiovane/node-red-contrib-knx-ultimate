const path = require('path')
const dptlib = require('knxultimate').dptlib

// The running Matter servers, keyed by node id. Kept OUTSIDE the node lifecycle:
// a re-deploy must NOT restart the Matter server, otherwise the paired controllers
// resume their session without re-reading the structure and never see device changes.
// The devices are reconciled live instead; the server is closed only when the node
// is deleted/disabled or Node-RED shuts down.
const runningBridges = new Map()

// Exposes KNX group addresses as Matter devices (bridge/aggregator):
// external Matter controllers (Alexa, Google Home, Apple Home...) commission this
// bridge once and control/see every configured KNX virtual device.
module.exports = function (RED) {
  function knxUltimateMatterBridge (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined

    node.topic = node.name
    node.name = config.name === undefined || config.name === '' ? 'Matter Bridge (BETA)' : config.name
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

    node.bridgePort = Number(config.bridgePort) || 5540
    node.bridgeDeviceName = config.bridgeDeviceName || 'KNX-Ultimate Bridge'
    node.readStatusAtStartup = config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes'
    node.enableNodePINS = config.enableNodePINS === 'yes'
    node.inputs = node.enableNodePINS ? 1 : 0
    node.outputs = node.enableNodePINS ? 1 : 0
    node.devices = []
    try {
      node.devices = Array.isArray(config.devices) ? config.devices : JSON.parse(config.devices || '[]')
    } catch (error) {
      node.devices = []
    }

    node.matterBridge = null
    node.matterInstanceId = `knxultimate-bridge-${node.id.replace(/[^a-zA-Z0-9]/g, '')}`
    node.matterStoragePath = path.join(RED.settings.userDir || '.', 'knxultimatestorage', 'matter')
    let startupTimer = null
    let initialReadTimer = null
    let closing = false

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

    // Precompute the routing tables:
    // statusRoutes: GA -> [{ deviceId, fn, dpt }] (KNX -> Matter)
    // commandRoutes: deviceId + fn -> { ga, dpt } (Matter -> KNX)
    const statusRoutes = new Map()
    const commandRoutes = new Map()
    // Reads a device config value, also recovering the corrupted keys written by early
    // 5.2.0 editors (jQuery UI polluted the key with " ui-autocomplete-input").
    const devConfigValue = (dev, key) => {
      if (dev[key] !== undefined) return (dev[key] || '').trim()
      const corrupted = dev[`${key} ui-autocomplete-input`]
      return (corrupted || '').trim()
    }
    node.devices.forEach((dev) => {
      const functions = DEVICE_FUNCTIONS[dev.type] || []
      functions.forEach((fnDef) => {
        const ga = devConfigValue(dev, fnDef.ga)
        if (ga === '') return
        const dpt = devConfigValue(dev, fnDef.dpt) || fnDef.fallbackDpt
        if (fnDef.direction === 'status') {
          if (!statusRoutes.has(ga)) statusRoutes.set(ga, [])
          statusRoutes.get(ga).push({ deviceId: dev.id, fn: fnDef.fn, dpt })
        } else {
          commandRoutes.set(`${dev.id}#${fnDef.fn}`, { ga, dpt })
        }
      })
    })

    const updateBridgeStatus = () => {
      try {
        if (node.matterBridge === null) {
          node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Matter bridge starting...' })
          return
        }
        const info = node.matterBridge.getPairingInfo()
        if (!info.running) {
          node.setNodeStatus({ fill: 'red', shape: 'ring', text: 'Matter bridge stopped' })
        } else if (info.commissioned) {
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: `Bridge online, paired with ${info.fabrics.length} controller(s), ${info.deviceCount} device(s), ${commandRoutes.size} cmd GA, ${statusRoutes.size} status GA` })
        } else {
          node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: `Awaiting pairing. Code ${info.manualPairingCode || ''}, ${info.deviceCount} device(s)` })
        }
      } catch (error) { /* empty */ }
    }

    // Ask the KNX bus for the current values of all status GAs, so the Matter
    // attributes are populated before a controller reads them.
    const doInitialRead = () => {
      if (!node.readStatusAtStartup) return
      if (!node.serverKNX) return // Flow-only bridge (no KNX gateway): nothing to read
      try {
        let delay = 0
        statusRoutes.forEach((routes, ga) => {
          delay += 200
          setTimeout(() => {
            safeSendToKNX({ grpaddr: ga, payload: '', dpt: '', outputtype: 'read' }, 'read')
          }, delay)
        })
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Initial read error ${error.message}` })
      }
    }

    const bindEngineEvents = (engine) => {
      // Matter -> KNX: a controller (Alexa...) sent a command to a bridged device
      engine.on('command', (command) => {
        try {
          const dev = node.devices.find((d) => d.id === command.deviceId)
          // Forward every controller command to the flow, when the pins are enabled
          if (node.enableNodePINS) {
            try {
              node.send({
                topic: dev !== undefined ? dev.name : command.deviceId,
                payload: command.value,
                device: dev !== undefined ? { id: dev.id, type: dev.type, name: dev.name } : { id: command.deviceId },
                matter: command
              })
            } catch (error) { /* empty */ }
          }
          const route = commandRoutes.get(`${command.deviceId}#${command.fn}`)
          if (route === undefined) {
            if (node.enableNodePINS) return // Flow-only device: the flow already got the command
            // Make the misconfiguration visible instead of silently dropping the command
            node.setNodeStatus({
              fill: 'yellow',
              shape: 'ring',
              text: `No command GA configured for "${dev !== undefined ? dev.name : command.deviceId}" (${command.fn}): open the node, check the GA fields and re-deploy`,
              payload: ''
            })
            RED.log.warn(`knxUltimateMatterBridge: Matter command dropped, no GA route for ${command.deviceId}#${command.fn}`)
            return
          }
          if (!node.serverKNX) {
            // Flow-only bridge: with the PINs enabled the flow already received the command
            if (node.enableNodePINS) return
            node.setNodeStatus({
              fill: 'yellow',
              shape: 'ring',
              text: `No KNX gateway configured: enable the node PINs to handle "${dev !== undefined ? dev.name : command.deviceId}" from the flow`,
              payload: ''
            })
            return
          }
          safeSendToKNX({
            grpaddr: route.ga,
            payload: command.value,
            dpt: route.dpt,
            outputtype: 'write'
          }, 'write')
          node.setNodeStatus({
            fill: 'green',
            shape: 'dot',
            text: `Matter->KNX ${dev !== undefined ? dev.name : command.deviceId} ${command.fn}`,
            payload: command.value
          })
        } catch (error) {
          node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Matter->KNX error ${error.message}` })
        }
      })

      engine.on('commissioned', () => updateBridgeStatus())
      engine.on('decommissioned', () => updateBridgeStatus())
      engine.on('fabricsChanged', () => updateBridgeStatus())
      engine.on('online', () => {
        updateBridgeStatus()
        if (initialReadTimer !== null) clearTimeout(initialReadTimer)
        initialReadTimer = setTimeout(() => doInitialRead(), 5000)
      })
    }

    const buildEngineDefs = () => node.devices
      .filter((dev) => dev.id && dev.type && DEVICE_FUNCTIONS[dev.type] !== undefined)
      .map((dev) => ({ id: dev.id, type: dev.type, name: dev.name, invertPosition: dev.invertPosition === true }))

    const startBridge = async () => {
      try {
        const { classMatterBridge } = await import('./utils/matterBridgeEngine.mjs')
        const engineDefs = buildEngineDefs()
        const existing = runningBridges.get(node.id)

        if (existing !== undefined && existing.bridgeStatus === 'running' &&
          Number(existing.options.port) === node.bridgePort &&
          existing.options.deviceName === node.bridgeDeviceName) {
          // Re-deploy: reuse the running Matter server and reconcile the devices live,
          // so the paired controllers (Alexa & Co.) pick up the changes immediately.
          existing.removeAllListeners()
          node.matterBridge = existing
          bindEngineEvents(existing)
          await existing.reconcileDevices(engineDefs)
          updateBridgeStatus()
          if (initialReadTimer !== null) clearTimeout(initialReadTimer)
          initialReadTimer = setTimeout(() => doInitialRead(), 5000)
          return
        }

        if (existing !== undefined) {
          // Port or bridge name changed: a full restart is unavoidable
          try {
            existing.removeAllListeners()
            await existing.close()
          } catch (error) { /* empty */ }
          runningBridges.delete(node.id)
        }

        const engine = new classMatterBridge(node.matterStoragePath, node.matterInstanceId, {
          info: (m) => RED.log.info(m),
          warn: (m) => RED.log.warn(m),
          error: (m) => RED.log.error(m),
          debug: (m) => RED.log.debug(m)
        }, { port: node.bridgePort, deviceName: node.bridgeDeviceName })
        runningBridges.set(node.id, engine)
        node.matterBridge = engine
        bindEngineEvents(engine)
        await engine.start(engineDefs)
        updateBridgeStatus()
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Matter bridge start error: ${error.message}` })
        RED.log.error(`knxUltimateMatterBridge: start error: ${error.message}`)
      }
    }

    // KNX -> Matter: telegrams from the bus update the Matter attributes
    node.handleSend = (msg) => {
      try {
        if (!msg || !msg.knx) return
        if (msg.knx.event === 'GroupValue_Read') return
        const routes = statusRoutes.get(msg.knx.destination)
        if (routes === undefined || node.matterBridge === null) return
        routes.forEach((route) => {
          try {
            const value = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(route.dpt))
            if (value === undefined || value === null) return
            node.matterBridge.setDeviceState(route.deviceId, route.fn, value)
            const dev = node.devices.find((d) => d.id === route.deviceId)
            node.setNodeStatus({
              fill: 'blue',
              shape: 'dot',
              text: `KNX->Matter ${dev !== undefined ? dev.name : route.deviceId} ${route.fn}`,
              payload: value
            })
          } catch (error) {
            node.setNodeStatus({ fill: 'red', shape: 'dot', text: `KNX->Matter error ${error.message}` })
          }
        })
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `KNX->Matter error ${error.message}` })
      }
    }

    // Called by the admin endpoints (editor UI)
    node.getBridgePairingInfo = () => {
      if (node.matterBridge === null) return { running: false }
      return node.matterBridge.getPairingInfo()
    }

    node.factoryResetBridge = async () => {
      if (node.matterBridge === null) throw new Error('Matter bridge not started')
      await node.matterBridge.factoryReset()
      updateBridgeStatus()
    }

    if (node.serverKNX) {
      try {
        node.serverKNX.removeClient(node)
        node.serverKNX.addClient(node)
      } catch (error) {
        RED.log.error(`knxUltimateMatterBridge: register KNX client error ${error.message}`)
      }
    }

    // Flow input pin: updates the Matter state of a virtual device without going through the KNX bus.
    // msg.payload = { device: 'Kitchen light' (name or id), function: 'onoff'|'level'|'position'|'temperature'|..., value: ... }
    node.on('input', (msg, send, done) => {
      if (!node.enableNodePINS) {
        if (done) done()
        return
      }
      try {
        const payload = msg.payload || {}
        const deviceKey = (payload.device !== undefined ? payload.device : msg.topic || '').toString().trim()
        const fn = (payload.function || payload.fn || '').toString().trim()
        if (deviceKey === '' || fn === '' || payload.value === undefined) {
          throw new Error('msg.payload must be { device, function, value }')
        }
        const dev = node.devices.find((d) => d.id === deviceKey || (d.name || '').toLowerCase() === deviceKey.toLowerCase())
        if (dev === undefined) throw new Error(`Unknown bridge device "${deviceKey}"`)
        if (node.matterBridge === null) throw new Error('Matter bridge not started yet')
        node.matterBridge.setDeviceState(dev.id, fn, payload.value)
        node.setNodeStatus({ fill: 'green', shape: 'dot', text: `Flow->Matter ${dev.name} ${fn}`, payload: payload.value })
        if (done) done()
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Flow error ${error.message}`, payload: '' })
        if (done) done(error)
      }
    })

    node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Matter bridge starting in 5s...' })
    startupTimer = setTimeout(() => {
      (async () => {
        if (closing) return
        try {
          await startBridge()
        } catch (error) {
          RED.log.error(`knxUltimateMatterBridge: startup error: ${error.message}`)
        }
      })()
    }, 5000)

    // On re-deploy (removed === false) the Matter server stays alive: the new node
    // instance will reuse it and reconcile the devices, so paired controllers never
    // lose the session. The server is closed only when the node is deleted/disabled.
    node.on('close', (removed, done) => {
      closing = true
      try {
        if (startupTimer !== null) clearTimeout(startupTimer)
        if (initialReadTimer !== null) clearTimeout(initialReadTimer)
      } catch (error) { /* empty */ }
      try {
        if (node.serverKNX) node.serverKNX.removeClient(node)
      } catch (error) { /* empty */ }
      try {
        if (node.matterBridge !== null) node.matterBridge.removeAllListeners()
      } catch (error) { /* empty */ }
      (async () => {
        try {
          if (removed === true && node.matterBridge !== null) {
            await node.matterBridge.close()
            runningBridges.delete(node.id)
          }
        } catch (error) { /* empty */ }
        node.matterBridge = null
        done()
      })()
    })
  }

  RED.nodes.registerType('knxUltimateMatterBridge', knxUltimateMatterBridge)
}
