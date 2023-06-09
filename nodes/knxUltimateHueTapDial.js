module.exports = function (RED) {

  async function getLightState(node, _lightID) {
    return new Promise((resolve, reject) => {
      try {
        if (node !== null && node.serverHue !== null && node.serverHue.hueManager !== null) {
          node.serverHue.hueManager.getLight(_lightID).then(ret => {
            node.currentHUEDevice = ret[0]
            resolve(ret)
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  function knxUltimateHueTapDial(config) {
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
    node.brightnessState = 0

    // Read the state of the light and store it in the holding object
    try {
      if (config.hueLight !== undefined && config.hueLight !== '') getLightState(node, config.hueLight)
    } catch (error) {
    }



    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload }) => {

    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
    }

    node.handleSendHUE = _event => {
      try {
        if (_event.id === config.hueDevice) {
          const knxMsgPayload = {}
          knxMsgPayload.topic = config.GArepeat
          knxMsgPayload.dpt = config.dptrepeat
          if (_event.relative_rotary.last_event.rotation.direction === 'clock_wise') {
            if (knxMsgPayload.dpt.startsWith('3.007')) {
              knxMsgPayload.payload = { decr_incr: 1, data: 3 }
            } else if (knxMsgPayload.dpt.startsWith('5.001')) {
              //0 – maximum: 32767
              node.brightnessState < 100 ? node.brightnessState += 20 : node.brightnessState = 100
              knxMsgPayload.payload = node.brightnessState
            }
          } else if (_event.relative_rotary.last_event.rotation.direction === 'counter_clock_wise') {
            if (knxMsgPayload.dpt.startsWith('3.007')) {
              knxMsgPayload.payload = { decr_incr: 0, data: 3 }
            } else if (knxMsgPayload.dpt.startsWith('5.001')) {
              node.brightnessState > 0 ? node.brightnessState -= 20 : node.brightnessState = 0
              knxMsgPayload.payload = node.brightnessState
            }
          }

          // Send to KNX bus
          if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
          node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX ' + JSON.stringify(knxMsgPayload.payload) + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })

          // Setup the output msg
          knxMsgPayload.name = node.name
          knxMsgPayload.event = 'rotation ' + _event.relative_rotary.last_event.rotation.direction
          knxMsgPayload.payload = _event
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
  RED.nodes.registerType('knxUltimateHueTapDial', knxUltimateHueTapDial)
}
