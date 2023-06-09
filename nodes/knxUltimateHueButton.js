module.exports = function (RED) {
  const dptlib = require('./../KNXEngine/dptlib')

  function knxUltimateHueButton(config) {
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
    node.toggleGArepeat = false // up or down if repeat field is set to DIM
    node.toggleGAshort_release = false

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload }) => {

    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
      const state = {}
      try {
        switch (msg.knx.destination) {
          case config.GAshort_releaseStatus:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptshort_release))
            node.toggleGAshort_release = msg.payload
            setTimeout(() => {
              node.status({ fill: 'blue', shape: 'dot', text: 'Updated Switch ' + msg.knx.destination + ' ' + JSON.stringify(msg.payload) + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
            }, 500)
            break
          case config.GArepeatStatus:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptrepeat))
            node.toggleGArepeat = msg.payload.decr_incr === 1
            setTimeout(() => {
              node.status({ fill: 'blue', shape: 'dot', text: 'Updated Dim ' + msg.knx.destination + ' ' + JSON.stringify(msg.payload) + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
            }, 500)
            break
          default:
            break
        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'KNX->HUE error ' + error.message + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
      }
    }

    node.handleSendHUE = _event => {
      try {
        if (_event.id === config.hueDevice) {
          const knxMsgPayload = {}

          // Switch
          if (_event.button.last_event === 'short_release') {
            knxMsgPayload.topic = config.GAshort_release
            knxMsgPayload.dpt = config.dptshort_release
            config.toggleValues ? (node.toggleGAshort_release = !node.toggleGAshort_release) : node.toggleGAshort_release = true
            knxMsgPayload.payload = node.toggleGAshort_release
            node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX ' + _event.button.last_event + ' ' + JSON.stringify(knxMsgPayload.payload) + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
          }
          // Dim
          if (_event.button.last_event === 'repeat') {
            knxMsgPayload.topic = config.GArepeat
            knxMsgPayload.dpt = config.dptrepeat
            if (!config.toggleValues) node.toggleGArepeat = true
            knxMsgPayload.payload = node.toggleGArepeat ? { decr_incr: 1, data: 5 } : { decr_incr: 0, data: 5 }
            node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX ' + _event.button.last_event + ' ' + JSON.stringify(knxMsgPayload.payload) + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
          }

          // Send to KNX bus
          if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
            node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
          }

          // Setup the output msg
          knxMsgPayload.name = node.name
          knxMsgPayload.event = _event.button.last_event
          knxMsgPayload.rawEvent = _event
          node.send(knxMsgPayload)
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
      node.serverHue.addClient(node)
    }

    node.on('input', function (msg) {

    })

    node.on('close', function (done) {
      if (node.server) {
        node.server.removeClient(node)
      }
      done()
    })
  }
  RED.nodes.registerType('knxUltimateHueButton', knxUltimateHueButton)
}
