module.exports = function (RED) {
  function knxUltimateHueBattery (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverHue = RED.nodes.getNode(config.serverHue) || undefined
    node.topic = node.name
    node.name = config.name === undefined ? 'Hue' : config.name
    node.dpt = ''
    node.notifyreadrequest = true
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = false
    node.notifywrite = true
    node.initialread = true
    node.listenallga = true // Don't remove
    node.outputtype = 'write'
    node.outputRBE = 'false' // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = 'false' // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = '' // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = 'no'
    node.formatmultiplyvalue = 1
    node.formatnegativevalue = 'leave'
    node.formatdecimalsvalue = 2
    node.hueDevice = config.hueDevice
    node.initializingAtStart = (config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes')
    node.currentDeviceValue = 0
    const pinsSetting = (config.enableNodePINS === undefined || config.enableNodePINS === 'yes' || config.enableNodePINS === true)
    node.enableNodePINS = pinsSetting ? 'yes' : 'no'
    node.outputs = pinsSetting ? 1 : 0
    if (!node.serverKNX && node.outputs === 0) {
      node.enableNodePINS = 'yes'
      node.outputs = 1
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

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload
    }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sKNXNodeStatusText = `|KNX: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`
        pushStatus({ fill, shape, text: (node.sHUENodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { }
    }
    // Used to call the status update from the HUE config node.
    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sHUENodeStatusText = `|HUE: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`
        pushStatus({ fill, shape, text: node.sHUENodeStatusText + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { }
    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = (msg) => {
      // Respond to KNX read telegram, by sending the current value as response telegram.
      if (msg.knx.event === 'GroupValue_Read') {
        switch (msg.knx.destination) {
          case config.GAbatterysensor:
            // To the KNX bus wires
            node.sendResponseToKNX(node.currentDeviceValue)
            break
          default:
            break
        }
      }
    }

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id === config.hueDevice) {
          if (!_event.hasOwnProperty('power_state') || _event.power_state.battery_level === undefined) return

          const knxMsgPayload = {}
          knxMsgPayload.topic = config.GAbatterysensor
          knxMsgPayload.dpt = config.dptbatterysensor

          knxMsgPayload.payload = _event.power_state.battery_level
          // Send to KNX bus
          if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
            safeSendToKNX({
              grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write'
            }, 'write')
          }
          node.currentDeviceValue = knxMsgPayload.payload

          // Setup the output msg
          knxMsgPayload.name = node.name
          knxMsgPayload.event = 'power_state'

          // Send payload
          knxMsgPayload.rawEvent = _event
          node.send(knxMsgPayload)
          node.setNodeStatusHue({
            fill: 'blue', shape: 'ring', text: 'HUE->KNX', payload: knxMsgPayload.payload
          })
        }
      } catch (error) {
        updateStatus({ fill: 'red', shape: 'dot', text: `HUE->KNX error ${error.message} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})` })
      }
    }

    node.sendResponseToKNX = (_level) => {
      const knxMsgPayload = {}
      knxMsgPayload.topic = config.GAbatterysensor
      knxMsgPayload.dpt = config.dptbatterysensor

      knxMsgPayload.payload = _level
      // Send to KNX bus
      if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
        safeSendToKNX({
          grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'response'
        }, 'response')
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
  RED.nodes.registerType('knxUltimateHueBattery', knxUltimateHueBattery)
}
