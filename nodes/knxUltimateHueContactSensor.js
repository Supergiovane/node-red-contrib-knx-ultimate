module.exports = function (RED) {
  function knxUltimateHueContactSensor (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverHue = RED.nodes.getNode(config.serverHue) || undefined
    node.topic = node.name
    node.name = config.name === undefined ? 'Hue' : config.name
    node.dpt = ''
    node.notifyreadrequest = false
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = false
    node.notifywrite = true
    node.initialread = true
    node.listenallga = true // Don't remove
    node.outputtype = 'write'
    node.outputRBE = false // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = false // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = '' // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = 'no'
    node.formatmultiplyvalue = 1
    node.formatnegativevalue = 'leave'
    node.formatdecimalsvalue = 2
    node.hueDevice = config.hueDevice
    // Re-publish the authoritative contact state at startup and after every event-stream
    // (re)connection. Without this, any contact_report event missed during an SSE reconnect
    // gap leaves KNX stuck on the last value seen (see issue #514).
    node.initializingAtStart = (config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes')
    // Timestamp (ms) of the last contact_report.changed we already applied to KNX. Used to
    // ignore stale/out-of-order reports (e.g. replays after a reconnect).
    node.lastContactChangedTs = undefined

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

    const formatTs = (date) => {
      const d = date instanceof Date ? date : new Date(date)
      const provider = node.serverKNX
      if (provider && typeof provider.formatStatusTimestamp === 'function') return provider.formatStatusTimestamp(d)
      return `${d.getDate()}, ${d.toLocaleTimeString()}`
    }

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          const now = new Date()
          updateStatus({ fill: 'red', shape: 'dot', text: `KNX server missing (${context}) (${formatTs(now)})` })
          return
        }
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id })
      } catch (error) {
        updateStatus({ fill: 'red', shape: 'dot', text: `KNX send error ${error.message}` })
      }
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload
    }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sKNXNodeStatusText = `|KNX: ${text} ${payload} (${formatTs(dDate)})`
        pushStatus({ fill, shape, text: (node.sHUENodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { }
    }
    // Used to call the status update from the HUE config node.
    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sHUENodeStatusText = `|HUE: ${text} ${payload} (${formatTs(dDate)})`
        pushStatus({ fill, shape, text: node.sHUENodeStatusText + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { }
    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = (msg) => {
    }

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id === config.hueDevice) {
          if (!_event.hasOwnProperty('contact_report')) {
            return
          }

          // contact_report.state is always the real current state (per Hue API v2), and
          // contact_report.changed is when it last changed. Ignore reports that are not newer
          // than the last one applied, so stale/replayed events after an SSE reconnect can't
          // flip KNX to a wrong state (issue #514).
          const changedTs = _event.contact_report.changed !== undefined ? new Date(_event.contact_report.changed).getTime() : NaN
          if (!Number.isNaN(changedTs)) {
            if (node.lastContactChangedTs !== undefined && changedTs <= node.lastContactChangedTs) {
              return
            }
            node.lastContactChangedTs = changedTs
          }

          const knxMsgPayload = {}
          knxMsgPayload.topic = config.GAcontact
          knxMsgPayload.dpt = config.dptcontact

          if (_event.hasOwnProperty('contact_report')) {
            knxMsgPayload.payload = _event.contact_report.state === 'contact'

            // Send to KNX bus
            if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
              safeSendToKNX({
                grpaddr: knxMsgPayload.topic,
                payload: knxMsgPayload.payload,
                dpt: knxMsgPayload.dpt,
                outputtype: 'write'
              }, 'write')
            }

            updateStatus({
              fill: 'green',
              shape: 'dot',
              text: `HUE->KNX ${JSON.stringify(knxMsgPayload.payload)} (${formatTs(new Date())})`
            })

            // Set up the output msg
            knxMsgPayload.name = node.name
            knxMsgPayload.event = 'contact'

            // Send payload
            knxMsgPayload.rawEvent = _event
            node.send(knxMsgPayload)
            node.setNodeStatusHue({
              fill: 'blue',
              shape: 'ring',
              text: 'HUE->KNX',
              payload: knxMsgPayload.payload
            })
          }
        }
      } catch (error) {
        updateStatus({
          fill: 'red',
          shape: 'dot',
          text: `HUE->KNX error ${error.message} (${formatTs(new Date())})`
        })
      }
    }

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }

    if (node.serverHue) {
      node.serverHue.removeClient(node)
      node.serverHue.addClient(node)
    }

    node.on('input', (msg) => {
    })

    node.on('close', (done) => {
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      if (node.serverHue) {
        node.serverHue.removeClient(node)
      }
      done()
    })
  }

  RED.nodes.registerType('knxUltimateHueContactSensor', knxUltimateHueContactSensor)
}
