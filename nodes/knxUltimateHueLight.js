module.exports = function (RED) {
  const dptlib = require('./../KNXEngine/src/dptlib')
  const hueColorConverter = require('./utils/hueColorConverter')

  function knxUltimateHueLight(config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.server = RED.nodes.getNode(config.server)
    node.serverHue = RED.nodes.getNode(config.serverHue)
    node.topic = node.name
    node.name = config.name === undefined ? 'Hue' : config.name
    node.outputtopic = node.name
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
    node.currentHUEDevice = undefined // At start, this value is filled by a call to HUE api. It stores a value representing the current light status.
    node.currentKNXGALightState = false // Stores the current KNX value for the GA
    node.DayTime = true
    node.isGrouped_light = config.hueDevice.split('#')[1] === 'grouped_light'
    config.hueDevice = config.hueDevice.split('#')[0]

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

    // This function is called by the hue-config.js
    node.handleSend = msg => {
      let state = {}
      try {
        switch (msg.knx.destination) {
          case config.GALightSwitch:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightSwitch))
            if (msg.payload === true) {
              if (node.DayTime) {
                // Day Time
                if (config.colorAtSwitchOnDayTime !== undefined && config.colorAtSwitchOnDayTime.toString().trim() !== '') {
                  // The user selected specific color/brightness at switch on.
                  let jColorChoosen = { red: 255, green: 255, blue: 255 }
                  jColorChoosen = JSON.parse(config.colorAtSwitchOnDayTime || '{ "red": 255, "green": 255, "blue": 255 }')
                  let gamut = null
                  if (node.currentHUEDevice !== undefined && node.currentHUEDevice.hasOwnProperty('color') && node.currentHUEDevice.color.hasOwnProperty('gamut_type')) {
                    gamut = node.currentHUEDevice.color.gamut_type
                  }
                  let dretXY = hueColorConverter.ColorConverter.rgbToXy(jColorChoosen.red, jColorChoosen.green, jColorChoosen.blue, gamut)
                  let dbright = hueColorConverter.ColorConverter.getBrightnessFromRGB(jColorChoosen.red, jColorChoosen.green, jColorChoosen.blue)
                  state = dbright > 0 ? { on: { on: true }, dimming: { brightness: dbright }, color: { xy: dretXY } } : { on: { on: false } }
                } else {
                  if (config.linkBrightnessToSwitchStatus === undefined || config.linkBrightnessToSwitchStatus === 'yes') {
                    state = { on: { on: true }, dimming: { brightness: 100 } }
                  } else {
                    state = { on: { on: true } }
                  }
                }
              } else {
                // Night Time
                if (config.enableDayNightLighting === true) {
                  let jColorChoosen = { red: 23, green: 4, blue: 0 }
                  jColorChoosen = JSON.parse(config.colorAtSwitchOnNightTime || '{ "red": 23, "green": 4, "blue": 0 }')
                  let gamut = null
                  if (node.currentHUEDevice !== undefined && node.currentHUEDevice.hasOwnProperty('color') && node.currentHUEDevice.color.hasOwnProperty('gamut_type')) {
                    gamut = node.currentHUEDevice.color.gamut_type
                  }
                  let dretXY = hueColorConverter.ColorConverter.rgbToXy(jColorChoosen.red, jColorChoosen.green, jColorChoosen.blue, gamut)
                  let dbright = hueColorConverter.ColorConverter.getBrightnessFromRGB(jColorChoosen.red, jColorChoosen.green, jColorChoosen.blue)
                  state = dbright > 0 ? { on: { on: true }, dimming: { brightness: dbright }, color: { xy: dretXY } } : { on: { on: false } }
                }
              }
            } else {
              if (config.linkBrightnessToSwitchStatus === undefined || config.linkBrightnessToSwitchStatus === 'yes') {
                state = { on: { on: false }, dimming: { brightness: 0 }, dynamics: { duration: 2000 } }
              } else {
                state = { on: { on: false } }
              }
            }
            node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
            node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: state })
            break
          case config.GALightDIM:
            // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
            // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightDIM))
            if (msg.payload.data > 0) {
              let dimDirection = msg.payload.decr_incr === 1 ? 'up' : 'down'
              // First, switch on the light if off
              if (node.currentHUEDevice !== undefined && node.currentHUEDevice.on.on === false && dimDirection === 'up') {
                if (config.linkBrightnessToSwitchStatus === undefined || config.linkBrightnessToSwitchStatus === 'yes') {
                  // Starts from minimum of 5
                  node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: true }, dimming: { brightness: 5 } }, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
                } else {
                  // Read the last HUE brightness status and starts from there
                  const lastDimVal = node.currentHUEDevice !== undefined ? node.currentHUEDevice.dimming.brightness : 5
                  node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: true }, dimming: { brightness: lastDimVal } }, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
                }
              }
              node.startDimStopper(dimDirection)
            } else {
              node.startDimStopper('stop')
            }
            node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: msg.payload })
            break
          case config.GADaylightSensor:
            if (config.enableDayNightLighting === true) {
              node.DayTime = Boolean(dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptDaylightSensor)))
              if (config.invertDayNight !== undefined && config.invertDayNight === true) node.DayTime = !node.DayTime
              node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE Daytime', payload: node.DayTime })
            } else {
              node.DayTime = true
            }
            break
          case config.GALightHSV:
            if (config.dptLightHSV === '3.007') {
              // MDT smartbutton will dim the color temperature
              // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
              // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightHSV))
              if (msg.payload.data > 0) {
                let dimDirectionTunableWhite = msg.payload.decr_incr === 1 ? 'up' : 'down'
                node.startDimStopperTunableWhite(dimDirectionTunableWhite)
              } else {
                node.startDimStopperTunableWhite('stop')
              }
            }
            node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: msg.payload })
            break
          case config.GALightBrightness:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightBrightness))
            state = { dimming: { brightness: msg.payload } }
            if (node.currentHUEDevice === undefined) {
              // Grouped light
              state.on = { on: msg.payload > 0 }
            } else {
              // Light
              if (node.currentHUEDevice.on.on === false && msg.payload > 0) state.on = { on: true }
              if (node.currentHUEDevice.on.on === true && msg.payload === 0) state.on = { on: false }
            }
            node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
            node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: state })
            break
          case config.GALightColor:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightColor))
            let gamut = null
            if (node.currentHUEDevice !== undefined && node.currentHUEDevice.hasOwnProperty('color') && node.currentHUEDevice.color.hasOwnProperty('gamut_type')) {
              gamut = node.currentHUEDevice.color.gamut_type
            }
            const retXY = hueColorConverter.ColorConverter.rgbToXy(msg.payload.red, msg.payload.green, msg.payload.blue, gamut)
            const bright = hueColorConverter.ColorConverter.getBrightnessFromRGB(msg.payload.red, msg.payload.green, msg.payload.blue)
            //state = bright > 0 ? { on: { on: true }, dimming: { brightness: bright }, color: { xy: retXY } } : { on: { on: false } }
            state = { dimming: { brightness: bright }, color: { xy: retXY } }
            if (node.currentHUEDevice === undefined) {
              // Grouped light
              state.on = { on: bright > 0 }
            } else {
              // Light
              if (node.currentHUEDevice.on.on === false && bright > 0) state.on = { on: true }
              if (node.currentHUEDevice.on.on === true && bright === 0) state = { on: { on: false }, dimming: { brightness: bright } }
            }
            node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
            node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: state })
            break
          case config.GALightBlink:
            const gaVal = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightBlink))
            if (gaVal) {
              node.timerBlink = setInterval(() => {
                if (node.blinkValue === undefined) node.blinkValue = true
                node.blinkValue = !node.blinkValue
                msg.payload = node.blinkValue
                // state = msg.payload === true ? { on: { on: true } } : { on: { on: false } }
                state = msg.payload === true ? { on: { on: true }, dimming: { brightness: 100 }, dynamics: { duration: 0 } } : { on: { on: false }, dynamics: { duration: 0 } }
                node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
              }, 1000)
            } else {
              if (node.timerBlink !== undefined) clearInterval(node.timerBlink)
              node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: false } }, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
            }
            node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: gaVal })
            break
          case config.GALightColorCycle:
            if (node.timerColorCycle !== undefined) clearInterval(node.timerColorCycle)
            const gaValColorCycle = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightColorCycle))
            if (gaValColorCycle === true) {
              node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: true } }, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
              node.timerColorCycle = setInterval(() => {
                try {
                  function getRandomIntInclusive(min, max) {
                    min = Math.ceil(min)
                    max = Math.floor(max)
                    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
                  }
                  const red = getRandomIntInclusive(0, 255)
                  const green = getRandomIntInclusive(0, 255)
                  const blue = getRandomIntInclusive(0, 255)
                  let gamut = null
                  if (node.currentHUEDevice !== undefined && node.currentHUEDevice.hasOwnProperty('color') && node.currentHUEDevice.color.hasOwnProperty('gamut_type')) {
                    gamut = node.currentHUEDevice.color.gamut_type
                  }
                  const retXY = hueColorConverter.ColorConverter.rgbToXy(red, green, blue, gamut)
                  const bright = hueColorConverter.ColorConverter.getBrightnessFromRGB(red, green, blue)
                  state = bright > 0 ? { on: { on: true }, dimming: { brightness: bright }, color: { xy: retXY } } : { on: { on: false } }
                  node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
                } catch (error) {
                }
              }, 10000)
            } else {
              node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: false } }, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
            }
            node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: gaValColorCycle })
            break
          default:
            break
        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'KNX->HUE error ' + (error.message || error) + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
      }
    }


    // Start dimming
    // ***********************************************************
    node.timerDim = undefined
    node.dimDirection = {}
    node.timeoutDim = 0
    node.startDimStopper = function (_direction) {
      node.timeoutDim = 0
      if (node.timerDim !== undefined) clearInterval(node.timerDim)
      if (_direction === 'stop') {
        return
      }
      switch (_direction) {
        case 'up':
          node.dimDirection = { dimming_delta: { action: 'up', brightness_delta: 10 } }
          break
        case 'down':
          node.dimDirection = { dimming_delta: { action: 'down', brightness_delta: 10 } }
          break
        default:
          break
      }
      node.timerDim = setInterval(() => {
        node.timeoutDim += 1
        if (node.timeoutDim > 150) { node.timeoutDim = 0; clearInterval(node.timerDim) }
        node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, node.dimDirection, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
      }, 700)
    }
    // ***********************************************************


    // Start dimming tunable white
    // mirek: required(integer minimum: 153, maximum: 500)
    // ***********************************************************
    node.timerDimTunableWhite = undefined
    node.dimDirectionTunableWhite = {}
    node.timeoutDimTunableWhite = 0
    node.startDimStopperTunableWhite = function (_direction) {
      node.timeoutDimTunableWhite = 0
      if (node.timerDimTunableWhite !== undefined) clearInterval(node.timerDimTunableWhite)
      if (_direction === 'stop') return
      switch (_direction) {
        case 'up':
          node.dimDirectionTunableWhite = { color_temperature_delta: { action: 'up', mirek_delta: 10 } }
          break
        case 'down':
          node.dimDirectionTunableWhite = { color_temperature_delta: { action: 'down', mirek_delta: 10 } }
          break
        default:
          break
      }
      node.timerDimTunableWhite = setInterval(() => {
        node.timeoutDimTunableWhite += 1
        if (node.timeoutDimTunableWhite > 150) { node.timeoutDimTunableWhite = 0; clearInterval(node.timerDimTunableWhite) }
        node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, node.dimDirectionTunableWhite, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))
      }, 700)
    }
    // ***********************************************************


    node.handleSendHUE = _event => {
      try {
        if (_event.id === config.hueDevice) {
          if (_event.hasOwnProperty('on')) {
            node.updateKNXLightState(_event.on.on)
            if (node.currentHUEDevice !== undefined) node.currentHUEDevice.on = _event.on // Update the internal object representing the current light
          }
          if (_event.hasOwnProperty('color')) {
            node.updateKNXLightColorState(_event.color)
            if (node.currentHUEDevice !== undefined) node.currentHUEDevice.color = _event.color // Update the internal object representing the current light
          }
          if (_event.hasOwnProperty('dimming')) {
            // Every once time, the light transmit the brightness value of 0.39.
            // To avoid wrongly turn light state on, exit
            if (_event.dimming.brightness < 1) _event.dimming.brightness = 0
            if (node.currentHUEDevice !== undefined && node.currentHUEDevice.hasOwnProperty('dimming') && node.currentHUEDevice.dimming.brightness === _event.dimming.brightness) return
            if (_event.dimming.brightness === undefined) return

            node.updateKNXBrightnessState(_event.dimming.brightness)
            // Send true/false to switch state
            node.updateKNXLightState(_event.dimming.brightness > 0)

            // If the brightness reaches zero, the hue lamp "on" property must be set to zero as well
            if (_event.dimming.brightness === 0) node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: false } }, (node.isGrouped_light === false ? 'setLight' : 'setGroupedLight'))

            if (node.currentHUEDevice !== undefined) node.currentHUEDevice.dimming = _event.dimming // Update the internal object representing the current light
          }
          if (_event.hasOwnProperty('color_temperature')) {
            node.updateKNXLightHSVState(_event.color_temperature.mirek)
            if (node.currentHUEDevice !== undefined) node.currentHUEDevice.color_temperature = _event.color_temperature // Update the internal object representing the current light
          }

        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'HUE->KNX error ' + knxMsgPayload.topic + ' ' + error.message || '' + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' })
      }
    }


    node.updateKNXBrightnessState = function (_value) {
      if (config.GALightBrightnessState !== undefined && config.GALightBrightnessState !== '') {
        const knxMsgPayload = {}
        knxMsgPayload.topic = config.GALightBrightnessState
        knxMsgPayload.dpt = config.dptLightBrightnessState
        knxMsgPayload.payload = _value
        // Send to KNX bus
        if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
        node.setNodeStatusHue({ fill: 'blue', shape: 'ring', text: 'HUE->KNX State', payload: knxMsgPayload.payload })
      }
    }
    node.updateKNXLightState = function (_value) {
      const knxMsgPayload = {}
      knxMsgPayload.topic = config.GALightState
      knxMsgPayload.dpt = config.dptLightState
      knxMsgPayload.payload = _value
      if (config.GALightState !== undefined && config.GALightState !== '') {
        if (node.currentKNXGALightState !== knxMsgPayload.payload) { // Check not to have already sent the value
          // Send to KNX bus
          if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
          node.setNodeStatusHue({ fill: 'blue', shape: 'ring', text: 'HUE->KNX State', payload: knxMsgPayload.payload })
        }
      }
      node.currentKNXGALightState = knxMsgPayload.payload // Stores the current value
    }

    node.updateKNXLightHSVState = function (_value) {
      if (config.GALightHSVState !== undefined && config.GALightHSVState !== '') {
        const knxMsgPayload = {}
        knxMsgPayload.topic = config.GALightHSVState
        knxMsgPayload.dpt = config.dptLightHSVState
        if (config.dptLightHSVState === '5.001') {
          const retPercent = hueColorConverter.ColorConverter.scale(_value, [153, 500], [0, 100])
          knxMsgPayload.payload = 100 - retPercent
        }
        // Send to KNX bus
        if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
        node.setNodeStatusHue({ fill: 'blue', shape: 'ring', text: 'HUE->KNX State', payload: knxMsgPayload.payload })
      }
    }

    node.updateKNXLightColorState = function (_value) {
      if (config.GALightColorState !== undefined && config.GALightColorState !== '') {
        const knxMsgPayload = {}
        knxMsgPayload.topic = config.GALightColorState
        knxMsgPayload.dpt = config.dptLightColorState
        knxMsgPayload.payload = hueColorConverter.ColorConverter.xyBriToRgb(_value.xy.x, _value.xy.y, (node.currentHUEDevice !== undefined ? node.currentHUEDevice.dimming.brightness : 100))
        // Send to KNX bus
        if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) node.server.writeQueueAdd({ grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id })
        node.setNodeStatusHue({ fill: 'blue', shape: 'ring', text: 'HUE->KNX State', payload: knxMsgPayload.payload })
      }
    }




    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node)
      node.server.addClient(node)
    }
    if (node.serverHue) {
      node.serverHue.removeClient(node)
      // I must get the light object, to store it in the node.currentHUEDevice variable
      // I queue the state request, by passing the callback to call whenever the HUE bridge send me the light status async
      if (node.serverHue !== null && node.serverHue.hueManager !== null) {
        (async () => {
          try {
            await node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, null, (node.isGrouped_light === false ? 'getLight' : 'getGroupedLight'), (jLight) => {
              node.currentHUEDevice = jLight
              node.serverHue.addClient(node)
            })
          } catch (err) {
            RED.log.error('Errore knxUltimateHueLight node.currentHUEDevice ' + err.message)
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
  RED.nodes.registerType('knxUltimateHueLight', knxUltimateHueLight)
}
