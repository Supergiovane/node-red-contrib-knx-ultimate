'use strict'

//const hueApi = require('node-hue-api')
const hueApiV2 = require('node-hue')
const { EventEmitter } = require('events')

class classHUE extends EventEmitter {
  constructor(_HUEBridgeIP, _username, _clientkey, _bridgeid) {
    super()
    this.HUEBridgeIP = _HUEBridgeIP
    this.username = _username
    this.clientkey = _clientkey
    this.bridgeid = _bridgeid
    this.startPushEvents()
    this.timerWatchDog = undefined
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

  // Check the bridge for disconnections
  handleTheDog = async () => {
    this.timerWatchDog = setInterval(async () => {
      try {
        //const hue = hueApiV2.connect({ host: this.HUEBridgeIP, key: this.username })
        if (this.hue !== undefined) {
          const sRet = await this.hue.getBridges()
          if (sRet.filter(e => e.bridge_id.toString().toLowerCase() === this.bridgeid.toString().toLowerCase()).length === 0) {
            /* oBridge doesn't contains the element we're looking for */
            throw (new Error('This machine is online, but this bridgeid is not found: ' + this.bridgeid))
          }
        }
      } catch (error) {
        if (this.timerWatchDog !== null) clearInterval(this.timerWatchDog)
        if (this.hue !== undefined) this.hue.close()
        console.log('KNXUltimateHUEConfig: classHUE: timerWatchDog: ' + error.message)
        this.startPushEvents()
      }
    }, 5000)
  }

  listener = (event) => {
    event.data.forEach(oEvento => {
      this.emit('event', oEvento)
    })
  }

  startPushEvents = async () => {
    try {
      this.hue = await hueApiV2.connect({
        host: this.HUEBridgeIP,
        key: this.username,
        eventListener: this.listener // The eventlistener is given as option
      })
    } catch (error) {
      if (this.hue !== undefined) this.hue.close()
      console.log('KNXUltimateHUEConfig: classHUE: ' + error.message)
    }
    this.handleTheDog() // Start watchdog timer
  }
}
module.exports.classHUE = classHUE

