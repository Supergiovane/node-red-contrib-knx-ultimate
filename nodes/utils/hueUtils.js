'use strict'

// const hueApi = require('node-hue-api')
const hueApiV2 = require('node-hue')
const { EventEmitter } = require('events')


const https = require('https');





class classHUE extends EventEmitter {
  constructor(_hueBridgeIP, _username, _clientkey, _bridgeid) {
    super()
    this.setup(_hueBridgeIP, _username, _clientkey, _bridgeid)
  }

  setup = async (_hueBridgeIP, _username, _clientkey, _bridgeid) => {
    this.hueBridgeIP = _hueBridgeIP
    this.username = _username
    this.clientkey = _clientkey
    this.bridgeid = _bridgeid
    this.commandQueue = []
    this.timerwriteQueueAdd = setTimeout(this.handleQueue, 3000) // First start

    // start the SSE Stream Receiver
    const options = {
      host: _hueBridgeIP, // Indirizzo IP del tuo bridge Philips Hue
      path: '/eventstream/clip/v2', // Il percorso dell'API per gli eventi
      method: 'GET',
      headers: {
        'Connection': 'keep-alive',
        'hue-application-key': _username
        //'Accept': 'text/event-stream'
      },
      rejectUnauthorized: false
    }

    // Funzione per la gestione della risposta
    const handleResponse = (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const events = JSON.parse(data)
          // An array event "Container", can have multiple events.
          // for..loop is more efficent. We need speed.
          for (let index = 0; index < events.length; index++) {
            const oEvento = events[index]
            if (oEvento.type === 'update') {
              for (let index = 0; index < oEvento.data.length; index++) {
                const element = oEvento.data[index]
                this.emit('event', element)
              }
            }
          }
        } catch (error) {
          console.log('KNXUltimateHUEConfig: classHUE: response.on(end): ' + error.message)
        }
        req();
      });
    };
    // Funzione per richiedere gli eventi
    const req = () => {
      const request = https.request(options, handleResponse);
      request.on('error', (error) => {
        console.log('KNXUltimateHUEConfig: classHUE: request.on(error): ' + error.message)
        // Restart the connection
        setTimeout(() => {
          req();
        }, 2000);
      });
      request.end();
    };

    // Starts the connection for the first time
    req();
  }

  // Handle the sed queue
  handleQueue = async () => {
    if (this.commandQueue.length > 0) {
      const jRet = this.commandQueue.shift()
      try {
        const hue = hueApiV2.connect({ host: this.hueBridgeIP, key: this.username })
        const ok = await hue.setLight(jRet._lightID, jRet._state)
      } catch (error) {
        console.log('KNXUltimateHUEConfig: classHUE: handleQueue: ' + error.message)
        return ({ error: error.message })
      }
    }
    // The Hue bridge allows about 10 telegram per second, so i need to make a queue manager
    setTimeout(this.handleQueue, 100)
  }
  writeHueQueueAdd = async (_lightID, _state) => {
    this.commandQueue.push({ _lightID, _state })
  }


  // Get all devices and join it with relative rooms, by adding the room name to the device name
  getResources = async (_rtype, _host, _username) => {
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
        if (_rtype === 'temperature') {
          retArray.push({ name: 'Temp: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: device.id })
        }
        if (_rtype === 'scene') {
          retArray.push({ name: 'Temp: ' + linkedDevName + (Room !== undefined ? ', room ' + Room.metadata.name : ''), id: device.id })
        }

      })
      return { devices: retArray }
    } catch (error) {
      console.log('KNXUltimateHue: HueUtils: classHUE: getDevices: error ' + error.message)
      return ({ devices: error.message })
    }
  }


  // Get light state
  getLight = async (_LightID) => {
    try {
      const hue = hueApiV2.connect({ host: this.hueBridgeIP, key: this.username })
      return await hue.getLight(_LightID)
    } catch (error) {
      console.log('KNXUltimateHUEConfig: classHUE: getLight: ' + error.message)
    }
  }
  
}
module.exports.classHUE = classHUE
