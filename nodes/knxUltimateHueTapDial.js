module.exports = function (RED) {
  function knxUltimateHueTapDial (config) {
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
    node.isTimerDimStopRunning = false

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
          knxMsgPayload.topic = config.GArepeat
          knxMsgPayload.dpt = config.dptrepeat

          if (_event.relative_rotary.last_event.rotation.direction === 'clock_wise') {
            if (knxMsgPayload.dpt.startsWith('3.007')) {
              if (node.isTimerDimStopRunning === false) {
                // Set KNX Dim up/down start
                knxMsgPayload.payload = { decr_incr: 1, data: 5 } // Send to KNX bus
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX start Dim' + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
              }
              node.startDimStopper(knxMsgPayload)
            } else if (knxMsgPayload.dpt.startsWith('5.001')) {
              // 0 - maximum: 32767
              node.brightnessState < 100 ? node.brightnessState += 20 : node.brightnessState = 100
              knxMsgPayload.payload = node.brightnessState
            } else if (knxMsgPayload.dpt.startsWith('232.600')) {
              if (_event.relative_rotary.last_event.action === 'start') {
                // Random color
                knxMsgPayload.payload = { red: getRandomIntInclusive(0, 255), green: getRandomIntInclusive(0, 255), blue: getRandomIntInclusive(0, 255) }
                function getRandomIntInclusive (min, max) {
                  min = Math.ceil(min)
                  max = Math.floor(max)
                  return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
                }
                // Send to KNX bus
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX Change color clockwise' + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
              }
            }
          } else if (_event.relative_rotary.last_event.rotation.direction === 'counter_clock_wise') {
            if (knxMsgPayload.dpt.startsWith('3.007')) {
              if (node.isTimerDimStopRunning === false) {
                // Set KNX Dim up/down start
                knxMsgPayload.payload = { decr_incr: 0, data: 5 } // Send to KNX bus
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX start Dim' + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
              }
              node.startDimStopper(knxMsgPayload)
            } else if (knxMsgPayload.dpt.startsWith('5.001')) {
              node.brightnessState > 0 ? node.brightnessState -= 20 : node.brightnessState = 0
              knxMsgPayload.payload = node.brightnessState
            } else if (knxMsgPayload.dpt.startsWith('232.600')) {
              if (_event.relative_rotary.last_event.action === 'start') {
                // Set white color
                knxMsgPayload.payload = { red: 255, green: 255, blue: 255 }
                // Send to KNX bus
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX Change color counterclockwise' + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
              }
            }
          }

          // Setup the output msg
          knxMsgPayload.name = node.name
          knxMsgPayload.event = 'rotation ' + _event.relative_rotary.last_event.rotation.direction
          knxMsgPayload.payload = _event
          node.send(knxMsgPayload)
          node.setNodeStatusHue({ fill: 'blue', shape: 'ring', text: 'HUE->KNX', payload: knxMsgPayload.payload })
        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'HUE->KNX error ' + error.message + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
      }
    }

    // Timer to stop the dimming sequence
    node.startDimStopper = function (knxMsgPayload) {
      if (node.timerDimStop !== undefined) clearTimeout(node.timerDimStop)
      node.isTimerDimStopRunning = true
      node.timerDimStop = setTimeout(() => {
        console.log("Stop banana")
        // KNX Stop DIM
        knxMsgPayload.payload = { decr_incr: 0, data: 0 } // Payload for the output msg
        // Send to KNX bus
        if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
        if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.status({ fill: 'green', shape: 'dot', text: 'HUE->KNX Stop DIM' + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
        node.isTimerDimStopRunning = false
      }, 1500)
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
      if (node.serverHue) {
        node.serverHue.removeClient(node)
      }
      done()
    })
  }
  RED.nodes.registerType('knxUltimateHueTapDial', knxUltimateHueTapDial)
}
