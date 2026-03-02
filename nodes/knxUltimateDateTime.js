const loggerClass = require('./utils/sysLogger')

let sendNowEndpointRegistered = false

module.exports = function (RED) {
  if (!sendNowEndpointRegistered) {
    RED.httpAdmin.post('/knxUltimateDateTime/sendNow', RED.auth.needsPermission('knxUltimate-config.write'), (req, res) => {
      try {
        const { id } = req.body || {}
        if (!id) {
          res.status(400).json({ error: 'Missing node id' })
          return
        }
        const targetNode = RED.nodes.getNode(id)
        if (!targetNode) {
          res.status(404).json({ error: 'KNX DateTime node not found' })
          return
        }
        if (typeof targetNode.triggerSend !== 'function') {
          res.status(400).json({ error: 'Node does not support sendNow' })
          return
        }
        const result = targetNode.triggerSend({ reason: 'button' })
        res.json({ status: 'ok', queued: result && result.queued === true })
      } catch (error) {
        res.status(500).json({ error: error.message || 'KNX DateTime send failed' })
      }
    })
    sendNowEndpointRegistered = true
  }

  function knxUltimateDateTime (config) {
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

    node.name = config.name || 'KNX DateTime'
    node.outputtopic = config.outputtopic || ''

    node.gaDateTime = (config.gaDateTime || '').trim()
    node.nameDateTime = config.nameDateTime || ''
    node.gaDate = (config.gaDate || '').trim()
    node.nameDate = config.nameDate || ''
    node.gaTime = (config.gaTime || '').trim()
    node.nameTime = config.nameTime || ''

    node.sendOnDeploy = (config.sendOnDeploy === true || config.sendOnDeploy === 'true')
    node.sendOnDeployDelay = Math.max(0, Number(config.sendOnDeployDelay || 0))

    node.periodicSend = (config.periodicSend === true || config.periodicSend === 'true')
    node.periodicSendInterval = Math.max(1, Number(config.periodicSendInterval || 60))
    node.periodicSendUnit = (config.periodicSendUnit || 's').toString()

    node.listenallga = false
    node.notifyreadrequest = false
    node.notifyresponse = false
    node.notifywrite = false
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'

    node._timerDeploy = null
    node._timerPeriodic = null
    node._timerWaitConnected = null
    node._pendingSend = null

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { /* ignore */ }

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
          payloadLabel = payload && payload.constructor && payload.constructor.name === 'Date'
            ? payload.toLocaleString()
            : (typeof payload === 'object' ? JSON.stringify(payload) : `${payload}`)
        }
        const composed = `${gaLabel}${payloadLabel}${deviceLabel}${dptLabel} (${ts}) ${statusText}`.trim()
        pushStatus({ fill, shape, text: composed })
        if (fill && fill.toUpperCase() === 'RED' && node.serverKNX && typeof node.serverKNX.reportToWatchdogCalledByKNXUltimateNode === 'function') {
          node.serverKNX.reportToWatchdogCalledByKNXUltimateNode({ nodeid: node.id, topic: node.outputtopic, devicename, GA, text: statusText })
        }
      } catch (error) {
        node.sysLogger?.warn(`Status update failed: ${error.message}`)
      }
    }

    node.handleSend = (msg) => {
      node.send(msg)
    }

    const hasAnyDestination = () => {
      return !!(node.gaDateTime || node.gaDate || node.gaTime)
    }

    const isConnected = () => {
      try {
        return node.serverKNX && node.serverKNX.linkStatus === 'connected' && node.serverKNX.knxConnection !== null
      } catch (error) {
        return false
      }
    }

    const parseDateFromPayload = (payload) => {
      if (payload === undefined || payload === null || payload === '') return new Date()
      if (payload && payload.constructor && payload.constructor.name === 'Date') return payload
      if (typeof payload === 'number') return new Date(payload)
      if (typeof payload === 'string') {
        const trimmed = payload.trim()
        if (trimmed === '' || trimmed.toLowerCase() === 'now') return new Date()
        return new Date(trimmed)
      }
      if (typeof payload === 'object') {
        if (payload.dateTime) return parseDateFromPayload(payload.dateTime)
        if (payload.timestamp) return parseDateFromPayload(payload.timestamp)
        if (payload.epoch) return parseDateFromPayload(payload.epoch)
      }
      return new Date(payload)
    }

    const buildDestinations = () => {
      const list = []
      if (node.gaDateTime) {
        list.push({ ga: node.gaDateTime, dpt: '19.001', name: node.nameDateTime })
      }
      if (node.gaDate) {
        list.push({ ga: node.gaDate, dpt: '11.001', name: node.nameDate })
      }
      if (node.gaTime) {
        list.push({ ga: node.gaTime, dpt: '10.001', name: node.nameTime })
      }
      return list
    }

    const clearWaitConnectedTimer = () => {
      if (node._timerWaitConnected) {
        clearInterval(node._timerWaitConnected)
        node._timerWaitConnected = null
      }
    }

    const ensureWaitConnectedTimer = () => {
      if (node._timerWaitConnected) return
      node._timerWaitConnected = setInterval(() => {
        if (!node._pendingSend) {
          clearWaitConnectedTimer()
          return
        }
        if (!isConnected()) return
        const pending = node._pendingSend
        node._pendingSend = null
        clearWaitConnectedTimer()
        doSend(pending.date, pending.reason, pending.sourceMsg)
      }, 1500)
    }

    const doSend = (dateObj, reason, sourceMsg = null) => {
      if (!node.serverKNX) return
      const destinations = buildDestinations()
      if (destinations.length === 0) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'No group address configured' })
        return
      }

      destinations.forEach((dest) => {
        try {
          node.serverKNX.sendKNXTelegramToKNXEngine({
            grpaddr: dest.ga,
            payload: dateObj,
            dpt: dest.dpt,
            outputtype: 'write',
            nodecallerid: node.id
          })
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: `Sent (${reason})`, payload: dateObj, GA: dest.ga, dpt: dest.dpt, devicename: dest.name })
        } catch (error) {
          node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Send failed (${reason}): ${error.message}`, payload: dateObj, GA: dest.ga, dpt: dest.dpt, devicename: dest.name })
        }
      })

      const outMsg = {
        topic: node.outputtopic || node.name || 'knxUltimateDateTime',
        payload: dateObj,
        reason,
        sent: destinations.map((d) => ({ ga: d.ga, dpt: d.dpt, name: d.name })),
        knxUltimateDateTime: {
          date: dateObj && dateObj.constructor && dateObj.constructor.name === 'Date' ? dateObj.toISOString() : undefined
        }
      }
      if (sourceMsg && sourceMsg._msgid) outMsg._msgid = sourceMsg._msgid
      node.send(outMsg)
    }

    node.triggerSend = ({ reason = 'input', msg = null } = {}) => {
      if (!hasAnyDestination()) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'No group address configured' })
        return { queued: false }
      }

      let dateObj
      try {
        dateObj = parseDateFromPayload(msg ? msg.payload : undefined)
        if (!(dateObj && dateObj.constructor && dateObj.constructor.name === 'Date') || isNaN(dateObj.getTime())) {
          throw new Error('Invalid date/time payload')
        }
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Invalid payload: ${error.message}` })
        return { queued: false }
      }

      if (!isConnected()) {
        node._pendingSend = { date: dateObj, reason, sourceMsg: msg }
        node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: `Gateway not connected, queued (${reason})` })
        ensureWaitConnectedTimer()
        return { queued: true }
      }

      doSend(dateObj, reason, msg)
      return { queued: false }
    }

    const startTimers = () => {
      if (!hasAnyDestination()) {
        node.setNodeStatus({ fill: 'red', shape: 'ring', text: 'Configure at least one GA (DateTime/Date/Time)' })
        return
      }

      node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Ready' })

      if (node.sendOnDeploy) {
        if (node._timerDeploy) clearTimeout(node._timerDeploy)
        node._timerDeploy = setTimeout(() => {
          node.triggerSend({ reason: 'startup' })
        }, node.sendOnDeployDelay * 1000)
      }

      if (node.periodicSend) {
        const multiplier = node.periodicSendUnit === 'm' ? 60000 : 1000
        const intervalMs = Math.max(1000, node.periodicSendInterval * multiplier)
        if (node._timerPeriodic) clearInterval(node._timerPeriodic)
        node._timerPeriodic = setInterval(() => {
          node.triggerSend({ reason: 'periodic' })
        }, intervalMs)
      }
    }

    node.on('input', function (msg) {
      node.triggerSend({ reason: 'input', msg })
    })

    node.on('close', function (done) {
      try {
        if (node._timerDeploy) clearTimeout(node._timerDeploy)
        if (node._timerPeriodic) clearInterval(node._timerPeriodic)
        clearWaitConnectedTimer()
        node._timerDeploy = null
        node._timerPeriodic = null
        node._pendingSend = null
      } catch (error) { /* ignore */ }

      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      done()
    })

    // Subscribe to config node lifecycle and keep gateway connected even if this is the only node in the flow.
    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }

    startTimers()
  }

  RED.nodes.registerType('knxUltimateDateTime', knxUltimateDateTime)
}
