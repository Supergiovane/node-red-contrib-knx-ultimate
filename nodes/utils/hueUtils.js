'use strict'

// const hueApi = require('node-hue-api')
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
    this.hue = undefined
  }

  // Get all devices and join it with relative rooms, by adding the room name to the device name
  getDevices = async (_rtype, _host, _username) => {
    try {
      // V2
      const hue = hueApiV2.connect({ host: _host, key: _username })
      const retArray = []
      const allResources = await hue.getResources()
      const allRooms = await hue.getRooms()
      const newArray = allResources.filter(x => x.type === _rtype)
      // Add room name to the device name
      newArray.forEach(device => {
        // const Room = allRooms.find(room => {
        //   return room.children.find(child => child.rid === device.id)
        // })
        const Room = allRooms.find(room => room.children.find(child => child.rid === device.owner.rid))
        const linkedDevName = allResources.find(dev => dev.type === 'device' && dev.services.find(serv => serv.rid === device.id)).metadata.name || ''
        if (_rtype === 'button') {
          const controlID = device.metadata !== undefined ? (device.metadata.control_id || '') : ''
          retArray.push({ name: 'Button: ' + linkedDevName + (controlID !== '' ? ', button ' + controlID : '') + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: device.id })
        }
        if (_rtype === 'light') {
          retArray.push({ name: 'Light: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: device.id })
        }
        if (_rtype === 'motion') {
          retArray.push({ name: 'Motion: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: device.id })
        }
        if (_rtype === 'relative_rotary') {
          retArray.push({ name: 'Rotary: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: device.id })
        }
        if (_rtype === 'light_level') {
          retArray.push({ name: 'Light Level: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: device.id })
        }

      })
      return { devices: retArray }
    } catch (error) {
      console.log('KNXUltimateHue: HueUtils: classHUE: getDevices: error ' + error.message)
      return ({ devices: error.message })
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

  // Get light state
  getLight = async (_LightID) => {
    try {
      const hue = hueApiV2.connect({ host: this.HUEBridgeIP, key: this.username })
      return await hue.getLight(_LightID)
    } catch (error) {
      return ({ error: error.message })
    }
  }

  // Check the bridge for disconnections
  handleTheDog = async () => {
    this.timerWatchDog = setInterval(async () => {
      try {
        // const hue = hueApiV2.connect({ host: this.HUEBridgeIP, key: this.username })
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
        log: {
          trace: (msg) => { },
          debug: (msg) => { },
          info: (msg) => { },
          warn: (msg) => { },
          error: (msg) => { }
        },
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
