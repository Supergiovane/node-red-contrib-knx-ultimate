module.exports = function (RED) {
  function knxUltimateHueBattery(config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.server = RED.nodes.getNode(config.server)
    node.serverHue = RED.nodes.getNode(config.serverHue)
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

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload }) => {

    }
    // Used to call the status update from the HUE config node.
    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      if (payload === undefined) return
      const dDate = new Date()
      payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
      node.status({ fill, shape, text: text + ' ' + payload + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' })
    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
    }

    node.handleSendHUE = _event => {
      try {
        if (_event.id === config.hueDevice) {
          const knxMsgPayload = {}
          knxMsgPayload.topic = config.GAbatterysensor
          knxMsgPayload.dpt = config.dptbatterysensor

          if (_event.hasOwnProperty('power_state') && _event.power_state.hasOwnProperty('battery_level')) {
            knxMsgPayload.payload = _event.power_state.battery_level
            // Send to KNX bus
            if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
            
            // Setup the output msg
            knxMsgPayload.name = node.name
            knxMsgPayload.event = 'power_state'

            // Send payload
            knxMsgPayload.rawEvent = _event
            node.send(knxMsgPayload)
            node.setNodeStatusHue({ fill: 'blue', shape: 'ring', text: 'HUE->KNX', payload: knxMsgPayload.payload })
          }
        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'HUE->KNX error ' + error.message + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
      }
    }

    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node)
      node.server.addClient(node)
    }
    if (node.serverHue) {
      node.serverHue.removeClient(node)
      // I must get the object, to store read the battery status
      // I queue the state request, by passing the callback to call whenever the HUE bridge send me the light status async
      if (node.serverHue !== null && node.serverHue.hueManager !== null) {
        (async () => {
          try {
            node.serverHue.addClient(node)
            await node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, null, 'getBattery', (jLight) => {
              node.handleSendHUE(jLight)
            })
          } catch (err) {
            RED.log.error('Errore knxUltimateHueBattery subscribe: ' + err.message)
          }
        })()
      }
    }

    node.on('input', function (msg) {

    })

    node.on('close', function (done) {
      if (node.server) {
        node.server.removeClient(node)
      }
      if (node.serverHue) {
        node.serverHue.removeClient(node)
      }
      done()
    })
  }
  RED.nodes.registerType('knxUltimateHueBattery', knxUltimateHueBattery)
}
