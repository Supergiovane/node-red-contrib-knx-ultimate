module.exports = function (RED) {
  const dptlib = require('./../KNXEngine/dptlib')
  const hueColorConverter = require('./utils/hueColorConverter')


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
    node.toggle1 = false
    node.toggle2 = false // up or down if repeat field is set to DIM
    node.toggle3 = false
    node.toggle4 = false
    node.toggle4 = false
    node.toggle5 = false
    node.toggle5 = false
    node.rbeOutputPayload = undefined

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
          if (_event.button.last_event === 'initial_press') {
            knxMsgPayload.ga = config.GAinitial_press
            knxMsgPayload.dpt = config.dptinitial_press
            config.toggleValues ? node.toggle1 = !node.toggle1 : node.toggle1 = true
            knxMsgPayload.payload = node.toggle1
            // Toggle the DIM direction
            config.toggleValues ? node.toggle2 = !node.toggle2 : node.toggle2 = true
          }
          if (_event.button.last_event === 'repeat') {
            knxMsgPayload.ga = config.GArepeat
            knxMsgPayload.dpt = config.dptrepeat
            // True/False or DIM
            if (knxMsgPayload.dpt.startsWith('1.')) {
              config.toggleValues ? node.toggle2 = !node.toggle2 : node.toggle2 = true
              knxMsgPayload.payload = node.toggle2
            }
            if (knxMsgPayload.dpt.startsWith('3.007')) {
              if (!config.toggleValues) node.toggle2 = true
              knxMsgPayload.payload = node.toggle2 ? { decr_incr: 1, data: 5 } : { decr_incr: 0, data: 5 }
            }
          }
          if (_event.button.last_event === 'short_release') {
            knxMsgPayload.ga = config.GAshort_release
            knxMsgPayload.dpt = config.dptshort_release
            config.toggleValues ? node.toggle3 = !node.toggle3 : node.toggle3 = true
            knxMsgPayload.payload = node.toggle3
          }
          if (_event.button.last_event === 'long_release') {
            knxMsgPayload.ga = config.GAlong_release
            knxMsgPayload.dpt = config.dptlong_release
            config.toggleValues ? node.toggle4 = !node.toggle4 : node.toggle4 = true
            knxMsgPayload.payload = node.toggle4
          }
          if (_event.button.last_event === 'double_short_release') {
            knxMsgPayload.ga = config.GAdouble_short_release
            knxMsgPayload.dpt = config.dptdouble_short_release
            config.toggleValues ? node.toggle5 = !node.toggle5 : node.toggle5 = true
            knxMsgPayload.payload = node.toggle5
          }
          if (_event.button.last_event === 'long_press') {
            knxMsgPayload.ga = config.GAlong_press
            knxMsgPayload.dpt = config.dptlong_press
            config.toggleValues ? node.toggle6 = !node.toggle6 : node.toggle6 = true
            knxMsgPayload.payload = node.toggle6
          }
          // Send to KNX bus
          if (knxMsgPayload.ga !== undefined) {
            node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX ' + _event.button.last_event + ' ' + JSON.stringify(knxMsgPayload.payload) + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
            if (knxMsgPayload.ga !== '' && knxMsgPayload.ga !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.ga, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
          }
          // Setup the output msg
          knxMsgPayload.topic = knxMsgPayload.ga
          delete knxMsgPayload.ga
          knxMsgPayload.name = node.name
          knxMsgPayload.event = _event.button.last_event

          // Applying rbe filter
          if (config.outputSimpleMode && knxMsgPayload.payload !== node.rbeOutputPayload) {
            node.rbeOutputPayload = knxMsgPayload.payload
          } else {
            node.send(knxMsgPayload)
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

    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node)
      node.server.addClient(node)
    }
  }
  RED.nodes.registerType('knxUltimateHueButton', knxUltimateHueButton)
}
