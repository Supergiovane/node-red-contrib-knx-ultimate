const loggerClass = require('./utils/sysLogger')

module.exports = function (RED) {
  function knxUltimateGarage (config) {
    RED.nodes.createNode(this, config)
    const node = this

    node.serverKNX = RED.nodes.getNode(config.server) || undefined

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    if (node.serverKNX === undefined) {
      pushStatus({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })
      return
    }

    node.name = config.name || 'KNX Garage'
    node.outputtopic = config.outputtopic || ''

    node.listenallga = true
    node.notifyreadrequest = true
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { console.log(error.stack) }

    node.setNodeStatus = ({ fill = 'grey', shape = 'ring', text: statusText = '', payload = '', GA = '', dpt = '', devicename = '' }) => {
      try {
        if (!node.serverKNX) {
          pushStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' })
          return
        }
        const dDate = new Date()
        const ts = (node.serverKNX && typeof node.serverKNX.formatStatusTimestamp === 'function')
          ? node.serverKNX.formatStatusTimestamp(dDate, { legacyDayLabel: true })
          : `day ${dDate.getDate()}, ${dDate.toLocaleTimeString()}`
        const gaLabel = GA ? `(${GA}) ` : ''
        const deviceLabel = devicename ? ` ${devicename}` : ''
        const dptLabel = dpt ? ` DPT${dpt}` : ''
        let payloadLabel = ''
        if (payload !== undefined && payload !== null && payload !== '') {
          payloadLabel = typeof payload === 'object' ? JSON.stringify(payload) : `${payload}`
        }
        const composed = `${gaLabel}${payloadLabel}${deviceLabel}${dptLabel} (${ts}) ${statusText}`.trim()
        pushStatus({ fill, shape, text: composed })
        if (fill && fill.toUpperCase() === 'RED' && node.serverKNX && typeof node.serverKNX.reportToWatchdogCalledByKNXUltimateNode === 'function') {
          node.serverKNX.reportToWatchdogCalledByKNXUltimateNode({ nodeid: node.id, topic: node.outputtopic, devicename, GA, text: statusText })
        }
      } catch (error) {
        if (node.sysLogger) node.sysLogger.error(`Status update failed: ${error.message}`)
      }
    }

    const MOVEMENT_PULSE_MS = 1500

    const boolFromConfig = (value) => (value === true || value === 'true')
    const boolFromPayload = (value) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'number') return value !== 0
      if (typeof value === 'string') {
        const trimmed = value.trim().toLowerCase()
        if (trimmed === 'true' || trimmed === '1' || trimmed === 'on' || trimmed === 'open') return true
        if (trimmed === 'false' || trimmed === '0' || trimmed === 'off' || trimmed === 'close' || trimmed === 'closed') return false
      }
      if (value && typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'value')) return boolFromPayload(value.value)
        if (Object.prototype.hasOwnProperty.call(value, 'state')) return boolFromPayload(value.state)
      }
      return false
    }

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX) return
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id })
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`Garage send failed (${context}): ${error.message}`)
        } else {
          RED.log.error(`knxUltimateGarage send failed (${context}): ${error.message}`)
        }
      }
    }

    const emitEvent = (event, payload = {}) => {
      if (!node.emitEvents) return
      node.send([
        {
          topic: node.outputtopic || node.gaCommand || node.name,
          event,
          payload,
          state: node.doorState,
          disabled: node.disabled,
          holdOpen: node.holdOpenActive,
          obstruction: node.obstructionActive
        }
      ])
    }

    node.gaCommand = (config.gaCommand || '').trim()
    node.dptCommand = config.dptCommand || '1.001'
    node.gaImpulse = (config.gaImpulse || '').trim()
    node.dptImpulse = config.dptImpulse || '1.017'
    node.gaHoldOpen = (config.gaHoldOpen || '').trim()
    node.dptHoldOpen = config.dptHoldOpen || '1.001'
    node.gaDisable = (config.gaDisable || '').trim()
    node.dptDisable = config.dptDisable || '1.001'
    node.gaPhotocell = (config.gaPhotocell || '').trim()
    node.dptPhotocell = config.dptPhotocell || '1.001'
    node.gaMoving = (config.gaMoving || '').trim()
    node.dptMoving = config.dptMoving || '1.001'
    node.gaObstruction = (config.gaObstruction || '').trim()
    node.dptObstruction = config.dptObstruction || '1.001'

    node.nameCommandGA = config.nameCommand || ''
    node.nameImpulseGA = config.nameImpulse || ''
    node.nameHoldOpenGA = config.nameHoldOpen || ''
    node.nameDisableGA = config.nameDisable || ''
    node.namePhotocellGA = config.namePhotocell || ''
    node.nameMovingGA = config.nameMoving || ''
    node.nameObstructionGA = config.nameObstruction || ''

    node.autoCloseEnabled = boolFromConfig(config.autoCloseEnable)
    node.autoCloseSeconds = Math.max(0, Number(config.autoCloseSeconds || 0))
    node.emitEvents = boolFromConfig(config.emitEvents)

    node.disabled = false
    node.holdOpenActive = false
    node.obstructionActive = false
    node.photocellActive = false
    node.doorState = 'closed'
    node.autoCloseTimer = null
    node.autoCloseDeadline = 0
    node.movementTimer = null
    node.lastImpulseValue = false
    node.commandEchoBlockUntil = 0
    node.impulseEchoBlockUntil = 0

    const cancelAutoClose = () => {
      if (node.autoCloseTimer) {
        clearTimeout(node.autoCloseTimer)
        node.autoCloseTimer = null
      }
      node.autoCloseDeadline = 0
    }

    const setMovement = (active, reason = '') => {
      if (node.gaMoving === '') return
      safeSendToKNX({ grpaddr: node.gaMoving, payload: !!active, dpt: node.dptMoving, outputtype: 'write' }, reason || 'movement')
    }

    const scheduleMovementPulse = () => {
      if (node.gaMoving === '') return
      setMovement(true, 'movement-start')
      if (node.movementTimer) clearTimeout(node.movementTimer)
      node.movementTimer = setTimeout(() => {
        setMovement(false, 'movement-stop')
        node.movementTimer = null
      }, MOVEMENT_PULSE_MS)
    }

    const setObstruction = (active, reason = '') => {
      if (node.obstructionActive === active) return
      node.obstructionActive = active
      if (node.gaObstruction !== '') {
        safeSendToKNX({ grpaddr: node.gaObstruction, payload: !!active, dpt: node.dptObstruction, outputtype: 'write' }, reason || 'obstruction')
      }
      emitEvent('obstruction', { active, reason })
      updateStatus()
    }

    const scheduleAutoClose = () => {
      cancelAutoClose()
      if (node.doorState !== 'open') return
      if (!node.autoCloseEnabled) return
      if (node.autoCloseSeconds <= 0) return
      if (node.holdOpenActive) return
      if (node.disabled) return
      node.autoCloseDeadline = Date.now() + node.autoCloseSeconds * 1000
      node.autoCloseTimer = setTimeout(() => {
        node.autoCloseTimer = null
        node.autoCloseDeadline = 0
        closeDoor('auto-close')
      }, node.autoCloseSeconds * 1000)
      updateStatus()
    }

    const updateStatus = (override = null) => {
      if (override) {
        node.setNodeStatus(override)
        return
      }
      if (node.disabled) {
        node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Disabled', payload: true, GA: node.gaDisable, dpt: node.dptDisable, devicename: node.nameDisableGA })
        return
      }
      if (node.obstructionActive) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'Obstruction', payload: true, GA: node.gaObstruction, dpt: node.dptObstruction, devicename: node.nameObstructionGA })
        return
      }
      const holdText = node.holdOpenActive ? ' (hold)' : ''
      switch (node.doorState) {
        case 'opening':
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Opening' + holdText, payload: true, GA: node.gaCommand, dpt: node.dptCommand, devicename: node.nameCommandGA })
          break
        case 'open': {
          if (node.autoCloseTimer && node.autoCloseDeadline > Date.now()) {
            const remaining = Math.max(0, Math.round((node.autoCloseDeadline - Date.now()) / 1000))
            node.setNodeStatus({ fill: 'green', shape: 'ring', text: `Open (${remaining}s)` + holdText, payload: true, GA: node.gaCommand, dpt: node.dptCommand, devicename: node.nameCommandGA })
          } else {
            node.setNodeStatus({ fill: 'green', shape: 'ring', text: 'Open' + holdText, payload: true, GA: node.gaCommand, dpt: node.dptCommand, devicename: node.nameCommandGA })
          }
          break
        }
        case 'closing':
          node.setNodeStatus({ fill: 'yellow', shape: 'dot', text: 'Closing', GA: node.gaCommand, dpt: node.dptCommand, devicename: node.nameCommandGA })
          break
        case 'closed':
          node.setNodeStatus({ fill: 'blue', shape: 'ring', text: 'Closed', payload: false, GA: node.gaCommand, dpt: node.dptCommand, devicename: node.nameCommandGA })
          break
        default:
          node.setNodeStatus({ fill: 'blue', shape: 'ring', text: node.doorState || 'Idle', GA: node.gaCommand })
      }
    }

    const finishMovement = (targetState) => {
      if (node.movementTimer) {
        clearTimeout(node.movementTimer)
        node.movementTimer = null
      }
      if (node.gaMoving !== '') setMovement(false, 'movement-finish')
      node.doorState = targetState
      if (targetState === 'open') scheduleAutoClose()
      updateStatus()
    }

    const openDoor = (source, { skipSend = false } = {}) => {
      if (node.disabled) {
        emitEvent('blocked', { reason: 'disabled', request: 'open', source })
        updateStatus({ fill: 'grey', shape: 'ring', text: 'Disabled', GA: node.gaDisable, dpt: node.dptDisable, devicename: node.nameDisableGA, payload: node.disabled })
        return
      }
      cancelAutoClose()
      node.doorState = 'opening'
      if (!skipSend) {
        if (node.gaCommand !== '') {
          safeSendToKNX({ grpaddr: node.gaCommand, payload: true, dpt: node.dptCommand, outputtype: 'write' }, source || 'open')
          node.commandEchoBlockUntil = Date.now() + 500
        } else if (node.gaImpulse !== '') {
          triggerImpulse('open')
        }
      }
      if (node.gaMoving !== '') scheduleMovementPulse()
      setTimeout(() => finishMovement('open'), 300)
      emitEvent('open', { source })
    }

    const closeDoor = (source, { skipSend = false } = {}) => {
      if (node.disabled) {
        emitEvent('blocked', { reason: 'disabled', request: 'close', source })
        updateStatus({ fill: 'grey', shape: 'ring', text: 'Disabled', GA: node.gaDisable, dpt: node.dptDisable, devicename: node.nameDisableGA, payload: node.disabled })
        return
      }
      if (node.holdOpenActive) {
        emitEvent('blocked', { reason: 'hold-open', request: 'close', source })
        scheduleAutoClose()
        return
      }
      node.doorState = 'closing'
      if (!skipSend) {
        if (node.gaCommand !== '') {
          safeSendToKNX({ grpaddr: node.gaCommand, payload: false, dpt: node.dptCommand, outputtype: 'write' }, source || 'close')
          node.commandEchoBlockUntil = Date.now() + 500
        } else if (node.gaImpulse !== '') {
          triggerImpulse('close')
        }
      }
      if (node.gaMoving !== '') scheduleMovementPulse()
      setTimeout(() => finishMovement('closed'), 300)
      emitEvent('close', { source })
    }

    const triggerImpulse = (source) => {
      if (node.gaImpulse === '') return
      safeSendToKNX({ grpaddr: node.gaImpulse, payload: true, dpt: node.dptImpulse, outputtype: 'write' }, source || 'impulse')
      node.impulseEchoBlockUntil = Date.now() + 500
      setTimeout(() => {
        safeSendToKNX({ grpaddr: node.gaImpulse, payload: false, dpt: node.dptImpulse, outputtype: 'write' }, 'impulse-reset')
      }, 250)
    }

    const toggleDoor = (source, { skipSend = false } = {}) => {
      if (node.doorState === 'open' || node.doorState === 'opening') {
        closeDoor(source, { skipSend })
      } else {
        openDoor(source, { skipSend })
      }
    }

    const handleHoldOpen = (value) => {
      const newState = !!value
      if (node.holdOpenActive === newState) return
      node.holdOpenActive = newState
      if (node.holdOpenActive) {
        cancelAutoClose()
        emitEvent('hold-open', { active: true })
      } else {
        if (node.doorState === 'open') scheduleAutoClose()
        emitEvent('hold-open', { active: false })
      }
      updateStatus()
    }

    const handleDisable = (value) => {
      const newState = !!value
      if (node.disabled === newState) return
      node.disabled = newState
      if (node.disabled) {
        cancelAutoClose()
        emitEvent('disabled', { active: true })
      } else {
        if (node.doorState === 'open') scheduleAutoClose()
        emitEvent('disabled', { active: false })
      }
      updateStatus()
    }

    const handlePhotocell = (value) => {
      const newState = !!value
      node.photocellActive = newState
      if (newState) {
        setObstruction(true, 'photocell')
        if (node.doorState === 'closing') {
          openDoor('photocell')
        } else {
          updateStatus()
        }
      } else {
        setObstruction(false, 'photocell-clear')
      }
    }

    const handleCommandIncoming = (value) => {
      const boolValue = !!value
      if (node.commandEchoBlockUntil > Date.now()) return
      if (boolValue) {
        openDoor('command', { skipSend: true })
      } else {
        closeDoor('command', { skipSend: true })
      }
    }

    const handleImpulseIncoming = (value) => {
      const current = !!value
      if (node.impulseEchoBlockUntil > Date.now()) {
        node.lastImpulseValue = current
        return
      }
      if (node.lastImpulseValue === current) return
      node.lastImpulseValue = current
      if (!current) return // rising edge only
      toggleDoor('impulse', { skipSend: true })
    }

    const respondToRead = (destination) => {
      const respond = (ga, payload, dpt) => {
        if (ga === '') return
        safeSendToKNX({ grpaddr: ga, payload, dpt, outputtype: 'response' }, 'read-response')
      }
      if (destination === node.gaCommand) {
        respond(node.gaCommand, node.doorState === 'open', node.dptCommand)
        return true
      }
      if (destination === node.gaHoldOpen) {
        respond(node.gaHoldOpen, node.holdOpenActive, node.dptHoldOpen)
        return true
      }
      if (destination === node.gaDisable) {
        respond(node.gaDisable, node.disabled, node.dptDisable)
        return true
      }
      if (destination === node.gaPhotocell) {
        respond(node.gaPhotocell, node.photocellActive, node.dptPhotocell)
        return true
      }
      if (destination === node.gaMoving) {
        respond(node.gaMoving, !!node.movementTimer, node.dptMoving)
        return true
      }
      if (destination === node.gaObstruction) {
        respond(node.gaObstruction, node.obstructionActive, node.dptObstruction)
        return true
      }
      return false
    }

    node.handleSend = (msg) => {
      try {
        if (!msg || !msg.knx || !msg.knx.destination) return
        const dest = msg.knx.destination
        if (msg.knx.event === 'GroupValue_Read') {
          respondToRead(dest)
          return
        }
        if (dest === node.gaCommand) {
          handleCommandIncoming(boolFromPayload(msg.payload))
          return
        }
        if (dest === node.gaImpulse) {
          handleImpulseIncoming(boolFromPayload(msg.payload))
          return
        }
        if (dest === node.gaHoldOpen) {
          handleHoldOpen(boolFromPayload(msg.payload))
          return
        }
        if (dest === node.gaDisable) {
          handleDisable(boolFromPayload(msg.payload))
          return
        }
        if (dest === node.gaPhotocell) {
          handlePhotocell(boolFromPayload(msg.payload))
          return
        }
        if (dest === node.gaObstruction) {
          setObstruction(boolFromPayload(msg.payload), 'external')
          return
        }
        if (dest === node.gaMoving) {
          const active = boolFromPayload(msg.payload)
          if (active) {
            node.doorState = 'moving'
          }
          updateStatus()
        }
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`Garage handleSend error: ${error.message}`)
        } else {
          RED.log.error(`knxUltimateGarage handleSend error: ${error.message}`)
        }
      }
    }

    node.on('input', (msg, send, done) => {
      try {
        const payload = msg.payload
        if (payload === undefined || payload === null) {
          if (done) done()
          return
        }
        if (typeof payload === 'string') {
          const lowered = payload.trim().toLowerCase()
          if (lowered === 'open') {
            openDoor('flow')
          } else if (lowered === 'close') {
            closeDoor('flow')
          } else if (lowered === 'toggle') {
            toggleDoor('flow')
          } else {
            if (boolFromPayload(payload)) openDoor('flow'); else closeDoor('flow')
          }
        } else if (typeof payload === 'boolean' || typeof payload === 'number' || typeof payload === 'object') {
          if (boolFromPayload(payload)) openDoor('flow'); else closeDoor('flow')
        }
        if (done) done()
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`Garage onInput error: ${error.message}`)
        } else {
          RED.log.error(`knxUltimateGarage onInput error: ${error.message}`)
        }
        if (done) done(error)
      }
    })

    updateStatus()

    scheduleAutoClose()

    node.on('close', (done) => {
      cancelAutoClose()
      if (node.movementTimer) clearTimeout(node.movementTimer)
      done()
    })
  }

  RED.nodes.registerType('knxUltimateGarage', knxUltimateGarage)
}
