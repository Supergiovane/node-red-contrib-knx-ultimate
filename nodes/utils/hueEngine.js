'use strict'

const { EventEmitter } = require('events')
const http = require('./http.js')
const EventSource = require('eventsource');

class classHUE extends EventEmitter {
  constructor(_hueBridgeIP, _username, _clientkey, _bridgeid, _sysLogger) {
    super()
    this.setup(_hueBridgeIP, _username, _clientkey, _bridgeid, _sysLogger)
  }

  setup = async (_hueBridgeIP, _username, _clientkey, _bridgeid, _sysLogger) => {
    this.hueBridgeIP = _hueBridgeIP
    this.username = _username
    this.clientkey = _clientkey
    this.bridgeid = _bridgeid
    this.commandQueue = []
    this.closePushEventStream = false
    this.timerwriteQueueAdd = setTimeout(this.handleQueue, 15000) // First start. Allow the KNX to connect
    this.sysLogger = _sysLogger

    // #############################################
    const options = {
      headers: {
        'hue-application-key': this.username,
      },
      https: {
        rejectUnauthorized: false
      }
    };

    // Connect
    this.connect = async () => {

      this.es = new EventSource('https://' + this.hueBridgeIP + '/eventstream/clip/v2', options);

      this.es.onmessage = (event) => {
        try {
          if (event && event.type === 'message' && event.data) {
            const data = JSON.parse(event.data);
            data.forEach(element => {
              if (element.type === 'update') {
                element.data.forEach(ev => {
                  this.emit('event', ev)
                })
              }
            })
          }
        } catch (error) {
          if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: this.es.onmessage: ' + error.message)
        }

      };

      this.es.onopen = () => {
        //if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: SSE-Connected')
        //this.emit('connected');   
      }

      this.es.onerror = (error) => {
        try {
          this.es.close()
          this.es = null
          if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: request.on(error): ' + error.message)
        } catch (error) {
        }
        //this.emit('error', err)
      };

      // Initialize the http wrapper, to use the provided key.
      // This http wrapper is used to get the data from HUE brigde
      try {
        this.hueApiV2 = await http.use({
          key: this.username,
          prefix: 'https://' + this.hueBridgeIP + '/clip/v2'
        });
        // Load all resources, to avoid too many call to the HUE bridge and speed up the showing of the device mnames, during typing in the config window
        this.hueAllResources = await this.hueApiV2.get('/resource')
        this.hueAllRooms = await this.hueApiV2.get('/resource/room')
        this.hueAllDevices = await this.hueApiV2.get('/resource/device')
      } catch (error) {
        if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: this.hueApiV2 = await http.use: ' + error.message)
      }

      // 31/07/2023 Every now and then, restart the connection to the eventsource, because it can goes down without knowing that
      if (this.timerReconnect !== undefined) clearInterval(this.timerReconnect)
      this.timerReconnect = setInterval(() => {
        try {
          this.es.close()
          this.es = null
        } catch (error) {
        }
        this.connect()
      }, 300000)

    }
    // First connection
    this.connect()
  }

  // #############################################


  // Handle the send queue
  // ######################################
  handleQueue = async () => {
    if (this.commandQueue.length > 0) {
      //const jRet = { ...this.commandQueue.shift() } //Clone the object by value
      const jRet = this.commandQueue.shift()
      switch (jRet._operation) {
        case 'setLight':
          // It can be a light or a grouped light
          try {
            const ok = await this.hueApiV2.put('/resource/light/' + jRet._lightID, jRet._state)
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.info('KNXUltimatehueEngine: classHUE: handleQueue: setLight light: ' + error.message)
          }
          break
        case 'setGroupedLight':
          try {
            const ok = await this.hueApiV2.put('/resource/grouped_light/' + jRet._lightID, jRet._state)
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.info('KNXUltimatehueEngine: classHUE: handleQueue: setLight grouped_light: ' + error.message)
          }
          break
        case 'getLight':
          try {
            const jReturn = await this.hueApiV2.get('/resource/light/' + jRet._lightID)
            jRet._callback(jReturn[0]) // Need to call the callback, because the event is absolutely async
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.info('KNXUltimatehueEngine: classHUE: handleQueue: getLight light: ' + error.message)
          }
          break
        case 'getGroupedLight':
          try {
            const jReturn = await this.hueApiV2.get('/resource/grouped_light/' + jRet._lightID)
            jRet._callback(jReturn[0]) // Need to call the callback, because the event is absolutely async
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.info('KNXUltimatehueEngine: classHUE: handleQueue: getLight grouped_light: ' + error.message)
          }
          break
        case 'setScene':
          try {
            const sceneID = jRet._lightID
            const ok = await this.hueApiV2.put('/resource/scene/' + sceneID, jRet._state)
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.info('KNXUltimatehueEngine: classHUE: handleQueue: setScene: ' + error.message)
          }
          break
        case 'stopScene':
          try {
            const allResources = await this.hueApiV2.get('/resource')
            const sceneID = jRet._lightID
            const jScene = allResources.find(res => res.id === sceneID) || ''
            const linkedLight = allResources.find(res => res.id === jScene.group.rid).children || ''
            linkedLight.forEach(light => {
              this.writeHueQueueAdd(light.rid, jRet._state, 'setLight')
            });
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: handleQueue: stopScene: ' + error.message)
          }
          break
        case 'getBattery':
          try {
            const jReturn = await this.hueApiV2.get('/resource/device_power/' + jRet._lightID)
            jRet._callback(jReturn[0]) // Need to call the callback, because the event is absolutely async
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: handleQueue: getBattery: ' + error.message)
          }
        case 'getLightLevel':
          try {
            const jReturn = await this.hueApiV2.get('/resource/light_level/' + jRet._lightID)
            jRet._callback(jReturn[0]) // Need to call the callback, because the event is absolutely async
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: handleQueue: getLightLevel: ' + error.message)
          }
          break
        case 'getTemperature':
          try {
            const jReturn = await this.hueApiV2.get('/resource/temperature/' + jRet._lightID)
            jRet._callback(jReturn[0]) // Need to call the callback, because the event is absolutely async
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: handleQueue: getTemperature: ' + error.message)
          }
          break
        default:
          break
      }
    }
     // The Hue bridge allows about 10 telegram per second, so i need to make a queue manager
    this.timerwriteQueueAdd = setTimeout(this.handleQueue, 100)
  }




writeHueQueueAdd = async (_lightID, _state, _operation, _callback) => {
  // Add the new item
  this.commandQueue.push({ _lightID, _state, _operation, _callback })
}
// ######################################



// Get all devices and join it with relative rooms, by adding the room name to the device name
getResources = async (_rtype, _host, _username) => {
  try {
    // Api V2

    // Returns capitalized string
    function capStr(s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const retArray = []
    let allResources = undefined
    if (_rtype === 'light' || _rtype === 'grouped_light')
      allResources = await this.hueAllResources.filter(a => a.type === 'light' || a.type === 'grouped_light')
    else {
      allResources = await this.hueAllResources.filter(a => a.type === _rtype)
    }
    for (let index = 0; index < allResources.length; index++) {
      const resource = allResources[index];
      // Get the owner
      try {
        let resourceName = ''
        let sRoom = ''
        if (_rtype === 'light' || _rtype === 'grouped_light') {
          // It's a service, having a owner
          const owners = await this.hueAllResources.filter(a => a.id === resource.owner.rid)
          for (let index = 0; index < owners.length; index++) {
            const owner = owners[index];
            //resourceName += (owner.metadata !== undefined && owner.metadata.name !== undefined) ? owner.metadata.name + ' and ' : ' and '
            resourceName += owner.metadata.name + ' and '
            const room = await this.hueAllRooms.find(child => child.children.find(a => a.rid === owner.id))
            sRoom += room !== undefined ? room.metadata.name + ' + ' : ' + '
          }
          sRoom = sRoom.slice(0, -(' + '.length))
          resourceName = resourceName.slice(0, -(' and '.length))
          resourceName += sRoom !== '' ? ' - Room: ' + sRoom : ''
          retArray.push({ name: capStr(resource.type) + ': ' + resourceName, id: resource.id, deviceObject:resource })
        }
        if (_rtype === 'scene') {
          resourceName = resource.metadata.name || '**Name Not Found**'
          // Get the linked zone
          const zone = await this.hueAllResources.find(res => res.id === resource.group.rid)
          resourceName += ' - ' + capStr(resource.group.rtype) + ': ' + zone.metadata.name
          retArray.push({ name: capStr(_rtype) + ': ' + resourceName, id: resource.id })
        }
        if (_rtype === 'button') {
          let linkedDevName = await this.hueAllResources.find(dev => dev.type === 'device' && dev.services.find(serv => serv.rid === resource.id)).metadata.name || ''
          const controlID = resource.metadata !== undefined ? (resource.metadata.control_id || '') : ''
          retArray.push({ name: capStr(_rtype) + ': ' + linkedDevName + ', button ' + controlID, id: resource.id })
        }
        if (_rtype === 'motion') {
          let linkedDevName = await this.hueAllResources.find(dev => dev.type === 'device' && dev.services.find(serv => serv.rid === resource.id)).metadata.name || ''
          retArray.push({ name: capStr(_rtype) + ': ' + linkedDevName, id: resource.id })
        }
        if (_rtype === 'relative_rotary') {
          let linkedDevName = await this.hueAllResources.find(dev => dev.type === 'device' && dev.services.find(serv => serv.rid === resource.id)).metadata.name || ''
          retArray.push({ name: 'Rotary: ' + linkedDevName, id: resource.id })
        }
        if (_rtype === 'light_level') {
          let Room = await this.hueAllRooms.find(room => room.children.find(child => child.rid === resource.owner.rid))
          let linkedDevName = await this.hueAllResources.find(dev => dev.type === 'device' && dev.services.find(serv => serv.rid === resource.id)).metadata.name || ''
          retArray.push({ name: 'Light Level: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: resource.id })
        }
        if (_rtype === 'temperature') {
          let Room = await this.hueAllRooms.find(room => room.children.find(child => child.rid === resource.owner.rid))
          let linkedDevName = await this.hueAllResources.find(dev => dev.type === 'device' && dev.services.find(serv => serv.rid === resource.id)).metadata.name || ''
          retArray.push({ name: 'Temperature: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: resource.id })
        }
        if (_rtype === 'device_power') {
          let Room = await this.hueAllRooms.find(room => room.children.find(child => child.rid === resource.owner.rid))
          let linkedDevName = await this.hueAllResources.find(dev => dev.type === 'device' && dev.services.find(serv => serv.rid === resource.id)).metadata.name || ''
          retArray.push({ name: 'Battery: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: resource.id })
        }
      } catch (error) {
        //retArray.push({ name: _rtype + ': ERROR ' + error.message, id: resource.id })
      }
    }
    return { devices: retArray }
  } catch (error) {
    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimateHue: hueEngine: classHUE: getDevices: error ' + error.message)
    return ({ devices: error.message })
  }
}

close = async () => {
  return new Promise((resolve, reject) => {
    try {
      if (this.timerReconnect !== undefined) clearInterval(this.timerReconnect)
      this.closePushEventStream = true
      if (this.es !== null) this.es.close();
      this.es = null;
      setTimeout(() => {
        resolve(true)
      }, 500)
    } catch (error) {
      reject(error)
    }
  })
}
}
module.exports.classHUE = classHUE
