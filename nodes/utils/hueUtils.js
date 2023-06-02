'use strict'

//const hueApi = require('node-hue-api')
const hueApiV2 = require('node-hue')
const { EventEmitter } = require('events')

class classHUE extends EventEmitter {
  constructor(_HUEBridgeIP, _username, _clientkey) {
    super()
    this.HUEBridgeIP = _HUEBridgeIP
    this.username = _username
    this.clientkey = _clientkey
    this.startPushEvents()
  }

  getAllLights = async () => {
    try {
      // V2
      const hue = hueApiV2.connect({ host: this.HUEBridgeIP, key: this.username })
      const allLights = await hue.getLights()
      //  allLights.forEach(light => {
      //    console.log(JSON.stringify(light))
      //    console.log("\n")
      //    console.log("\n")
      //  })

      // V2
      // const bridgeHUE = await hueApi.v3.api.createLocal(this.HUEBridgeIP).connect(this.username)
      // const allLights = await bridgeHUE.lights.getAll()
      // allLights.forEach(light => {
      //   console.log(light.toStringDetailed())
      // })

      return { lights: allLights }
    } catch (error) {
      console.log('KNXUltimateHue: classHUE: error ' + error.message)
      return ({ lights: error.message })
    }
  }

  setLightState = async (_lightID, _state = { on: { on: true } }) => {
    try {
      const hue = hueApiV2.connect({ host: this.HUEBridgeIP, key: this.username })
      const ok = await hue.setLight(_lightID, _state)
      return ok
      // _state = new hueApi.model.LightState().on(true).bri_inc(50)
      // const bridgeHUE = await hueApi.v3.api.createLocal(this.HUEBridgeIP).connect(this.username)
      // const jRet = await bridgeHUE.lights.setLightState(_lightID, _state)
      // return jRet
    } catch (error) {
      return ({ error: error.message })
    }
  }

  startPushEvents = async () => {
    try {
      const listener = (event) => {
        event.data.forEach(oEvento => {
          this.emit('event', oEvento)
        })
        //console.log(JSON.stringify(event, 1, 1))
      }
      const hue = hueApiV2.connect({
        host: this.HUEBridgeIP,
        key: this.username,
        eventListener: listener // The eventlistener is given as option
      })
    } catch (error) {

    }
  }
}
module.exports.classHUE = classHUE

