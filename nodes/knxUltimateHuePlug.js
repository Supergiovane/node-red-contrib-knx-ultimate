const cloneDeep = require('lodash/cloneDeep')
const dptlib = require('knxultimate').dptlib

module.exports = function (RED) {
  function knxUltimateHuePlug (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverHue = RED.nodes.getNode(config.serverHue) || undefined

    node.topic = node.name
    node.name = config.name === undefined || config.name === '' ? 'Hue Plug' : config.name
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

    const hueDeviceParts = (config.hueDevice || '').split('#')
    node.hueDevice = hueDeviceParts[0] || ''
    node.hueDeviceType = hueDeviceParts[1] || 'plug'

    node.initializingAtStart = config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes'
    node.enableNodePINS = config.enableNodePINS === 'yes'

    node.inputs = node.enableNodePINS ? 1 : 0
    node.outputs = node.enableNodePINS ? 1 : 0

    node.currentHUEDevice = null
    const pendingKnxMessages = []
    const MAX_PENDING_KNX_MESSAGES = 5
    const PENDING_KNX_TTL_MS = 10000
    let pendingHueDeviceSnapshotPromise = null

    const prunePendingKnxMessages = (now = Date.now()) => {
      if (!pendingKnxMessages.length) return now
      while (pendingKnxMessages.length > 0 && (now - pendingKnxMessages[0].enqueuedAt) > PENDING_KNX_TTL_MS) {
        pendingKnxMessages.shift()
      }
      return now
    }

    const enqueuePendingKnxMessage = (msg) => {
      const now = prunePendingKnxMessages()
      const snapshot = {
        msg: (() => {
          try {
            return cloneDeep(msg)
          } catch (error) {
            return msg
          }
        })(),
        enqueuedAt: now
      }
      if (pendingKnxMessages.length >= MAX_PENDING_KNX_MESSAGES) {
        pendingKnxMessages.shift()
      }
      pendingKnxMessages.push(snapshot)
    }

    const ensureCurrentHueDevice = async ({ forceRefresh = false } = {}) => {
      if (!node.serverHue || typeof node.serverHue.getHueResourceSnapshot !== 'function') return undefined
      if (!node.hueDevice) return undefined
      if (pendingHueDeviceSnapshotPromise) {
        try {
          return await pendingHueDeviceSnapshotPromise
        } catch (error) {
          return undefined
        }
      }
      pendingHueDeviceSnapshotPromise = (async () => {
        try {
          const resource = await node.serverHue.getHueResourceSnapshot(node.hueDevice, { forceRefresh })
          if (!resource) return undefined
          node.currentHUEDevice = cloneDeep(resource)
          try {
            node.handleSendHUE(node.currentHUEDevice)
          } catch (error) {
            RED.log.debug(`knxUltimateHuePlug: ensureCurrentHueDevice handleSendHUE error ${error.message}`)
          }
          const now = prunePendingKnxMessages()
          const queued = pendingKnxMessages.splice(0).filter((entry) => (now - entry.enqueuedAt) <= PENDING_KNX_TTL_MS)
          queued.forEach(({ msg }) => {
            try {
              node.handleSend(msg)
            } catch (error) {
              RED.log.warn(`knxUltimateHuePlug: replay queued KNX command error ${error.message}`)
            }
          })
          return node.currentHUEDevice
        } catch (error) {
          RED.log.warn(`knxUltimateHuePlug: ensureCurrentHueDevice error ${error.message}`)
          return undefined
        } finally {
          pendingHueDeviceSnapshotPromise = null
        }
      })()
      return pendingHueDeviceSnapshotPromise
    }

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    const updateStatus = (status) => {
      if (!status) return
      pushStatus(status)
    }

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          const now = new Date()
          updateStatus({ fill: 'red', shape: 'dot', text: `KNX server missing (${context}) (${now.getDate()}, ${now.toLocaleTimeString()})` })
          return
        }
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id })
      } catch (error) {
        updateStatus({ fill: 'red', shape: 'dot', text: `KNX send error ${error.message}` })
      }
    }

    node.setNodeStatus = ({
      fill, shape, text, payload
    }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sKNXNodeStatusText = `|KNX: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`
        updateStatus({ fill, shape, text: (node.sHUENodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sHUENodeStatusText = `|HUE: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`
        updateStatus({ fill, shape, text: node.sHUENodeStatusText + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

    node.updateKNXPlugState = function updateKNXPlugState (_value, _outputtype = 'write') {
      if (!config.GAPlugState) return
      const knxMsgPayload = {}
      knxMsgPayload.topic = config.GAPlugState
      knxMsgPayload.dpt = config.dptPlugState
      knxMsgPayload.payload = Boolean(_value)
      if (knxMsgPayload.topic) {
        safeSendToKNX({
          grpaddr: knxMsgPayload.topic,
          payload: knxMsgPayload.payload,
          dpt: knxMsgPayload.dpt,
          outputtype: _outputtype
        }, _outputtype)
      }
      node.setNodeStatusHue({
        fill: 'blue',
        shape: knxMsgPayload.payload ? 'dot' : 'ring',
        text: 'HUE->KNX On/Off',
        payload: knxMsgPayload.payload
      })
    }

    node.updateKNXPlugPowerState = function updateKNXPlugPowerState (_value, _outputtype = 'write') {
      if (!config.GAPlugPowerState) return
      const knxMsgPayload = {}
      knxMsgPayload.topic = config.GAPlugPowerState
      knxMsgPayload.dpt = config.dptPlugPowerState
      knxMsgPayload.payload = Boolean(_value)
      if (knxMsgPayload.topic) {
        safeSendToKNX({
          grpaddr: knxMsgPayload.topic,
          payload: knxMsgPayload.payload,
          dpt: knxMsgPayload.dpt,
          outputtype: _outputtype
        }, _outputtype)
      }
      node.setNodeStatusHue({
        fill: 'blue',
        shape: knxMsgPayload.payload ? 'dot' : 'ring',
        text: 'HUE->KNX Power',
        payload: knxMsgPayload.payload
      })
    }

    node.handleSend = (msg) => {
      if (node.hueDevice === '') {
        node.setNodeStatusHue({ fill: 'red', shape: 'ring', text: 'Missing HUE plug selection', payload: '' })
        return
      }
      if (!node.currentHUEDevice) {
        if (node.serverHue && node.serverHue.linkStatus === 'connected') {
          node.setNodeStatusHue({ fill: 'yellow', shape: 'ring', text: 'Syncing with HUE bridge', payload: '' })
          enqueuePendingKnxMessage(msg)
          ensureCurrentHueDevice({ forceRefresh: true })
        } else {
          node.setNodeStatusHue({ fill: 'red', shape: 'ring', text: 'HUE bridge unavailable', payload: '' })
        }
        return
      }
      try {
        if (msg.knx.event !== 'GroupValue_Read') {
          switch (msg.knx.destination) {
            case config.GAPlugSwitch: {
              const value = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptPlugSwitch))
              const desiredState = value === true || value === 1
              node.serverHue?.hueManager.writeHueQueueAdd(node.hueDevice, { on: { on: desiredState } }, 'setPlug', node.hueDeviceType || 'plug')
              node.setNodeStatusHue({
                fill: 'green',
                shape: 'dot',
                text: 'KNX->HUE On/Off',
                payload: desiredState
              })
              if (!node.currentHUEDevice) node.currentHUEDevice = {}
              if (!node.currentHUEDevice.on) node.currentHUEDevice.on = {}
              node.currentHUEDevice.on.on = desiredState
              break
            }
            default:
              break
          }
        } else {
          switch (msg.knx.destination) {
            case config.GAPlugState:
              if (node.currentHUEDevice?.on?.on !== undefined) node.updateKNXPlugState(node.currentHUEDevice.on.on, 'response')
              break
            case config.GAPlugPowerState:
              if (node.currentHUEDevice?.power_state?.power_state !== undefined) {
                const powerState = node.currentHUEDevice.power_state.power_state === 'on'
                node.updateKNXPlugPowerState(powerState, 'response')
              }
              break
            default:
              break
          }
        }
      } catch (error) {
        node.setNodeStatusHue({ fill: 'red', shape: 'dot', text: `KNX->HUE error ${error.message}`, payload: '' })
      }
    }

    node.handleSendHUE = (_event) => {
      try {
        if (_event === undefined) return
        const eventType = (_event.type || '').toLowerCase()
        if (!['plug', 'smartplug', 'smart_plug', 'light'].includes(eventType)) return
        if (_event.id !== node.hueDevice) return

        node.currentHUEDevice = cloneDeep(_event)
        const onState = _event.on?.on === true
        node.updateKNXPlugState(onState)
        if (_event.power_state && _event.power_state.power_state !== undefined) {
          node.updateKNXPlugPowerState(_event.power_state.power_state === 'on')
        }
        node.setNodeStatusHue({
          fill: onState ? 'green' : 'blue',
          shape: onState ? 'dot' : 'ring',
          text: 'HUE plug',
          payload: onState
        })
        if (node.enableNodePINS) {
          const flowMsg = {
            payload: onState,
            on: _event.on,
            power_state: _event.power_state,
            rawEvent: _event
          }
          node.send(flowMsg)
        }
      } catch (error) {
        node.setNodeStatusHue({ fill: 'red', shape: 'dot', text: `HUE->KNX error ${error.message}`, payload: '' })
      }
    }

    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }
    if (node.serverHue) {
      try {
        node.serverHue.removeClient(node)
        node.serverHue.addClient(node)
        if (typeof node.serverHue.getHueResourceSnapshot === 'function') {
          ensureCurrentHueDevice({ forceRefresh: false })
        }
      } catch (error) {
        RED.log.error(`knxUltimateHuePlug: register client error ${error.message}`)
      }
    }

    node.on('input', (msg, send, done) => {
      if (!node.enableNodePINS) {
        if (done) done()
        return
      }
      try {
        const state = RED.util.cloneMessage(msg)
        node.serverHue?.hueManager.writeHueQueueAdd(node.hueDevice, state, 'setPlug', node.hueDeviceType || 'plug')
        node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'Flow->HUE', payload: state })
        if (done) done()
      } catch (error) {
        node.setNodeStatusHue({ fill: 'red', shape: 'dot', text: `Flow error ${error.message}`, payload: '' })
        if (done) done(error)
      }
    })

    node.on('close', () => {
      if (node.serverKNX) node.serverKNX.removeClient(node)
      if (node.serverHue) node.serverHue.removeClient(node)
    })
  }

  RED.nodes.registerType('knxUltimateHuePlug', knxUltimateHuePlug)
}
