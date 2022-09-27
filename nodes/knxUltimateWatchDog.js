const ping = require('ping')

module.exports = function (RED) {
  function knxUltimateWatchDog (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.server = RED.nodes.getNode(config.server)
    node.dpt = '1.001'
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyreadrequest = true
    node.notifyresponse = true
    node.notifywrite = false
    node.initialread = false
    node.listenallga = false
    node.outputtype = 'write'
    node.outputRBE = false
    node.inputRBE = false
    node.currentPayload = ''
    node.topic = config.topic !== undefined ? config.topic : ''
    node.retryInterval = config.retryInterval !== undefined ? config.retryInterval * 1000 : 10000
    node.maxRetry = config.maxRetry !== undefined ? config.maxRetry : 6
    node.autoStart = config.autoStart !== undefined ? config.autoStart : true
    node.beatNumber = 0 // Telegram counter
    node.timerWatchDog = null
    node.isWatchDog = true
    node.checkLevel = config.checkLevel !== undefined ? config.checkLevel : 'Ethernet'
    node.icountMessageInWindow = 0

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      if (node.server == null) { node.status({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
      if (node.icountMessageInWindow == -999) return // Locked out, doesn't change status.
      const dDate = new Date()
      // 30/08/2019 Display only the things selected in the config
      GA = (typeof GA === 'undefined' || GA == '') ? '' : '(' + GA + ') '
      devicename = devicename || ''
      dpt = (typeof dpt === 'undefined' || dpt == '') ? '' : ' DPT' + dpt
      node.status({ fill, shape, text: GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) === true ? ' ' + devicename : '') + (node.server.statusDisplayDataPoint === true ? dpt : '') + (node.server.statusDisplayLastUpdate === true ? ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' : '') + ' ' + text })
    }

    if (!node.server) return

    function handleTheDog () {
      node.beatNumber += 1
      if (node.beatNumber > node.maxRetry) {
        // Confirmed connection error
        node.beatNumber = 0 // Reset Counter
        const msg = {
          type: 'BUSError',
          checkPerformed: node.checkLevel,
          nodeid: node.id,
          payload: true,
          description: 'Watchdog elapsed with no response.'
        }
        node.send(msg)
      } else {
        if (node.checkLevel === 'Ethernet') {
          // 23/05/2020 using ping
          const cfg = {
            timeout: 2
          }
          ping.sys.probe(node.server.host, function (isAlive) {
            if (isAlive) {
              node.watchDogTimerReset()
            } else {
              node.setNodeStatus({ fill: 'yellow', shape: 'dot', text: 'Check level ' + node.checkLevel + ', failed ping ' + node.beatNumber + ' of ' + node.maxRetry, payload: '', GA: '', dpt: '', devicename: '' })
            };
          }, cfg)
        } else {
          // Issue a read request
          if (node.server.knxConnection) {
            node.server.writeQueueAdd({ grpaddr: node.topic, payload: '', dpt: '', outputtype: 'read' })
            node.setNodeStatus({ fill: 'grey', shape: 'dot', text: 'Checking level ' + node.checkLevel + ', with beat telegram ' + node.beatNumber + ' of ' + node.maxRetry, payload: '', GA: '', dpt: '', devicename: '' })
          };
        }
      };
    };

    // This function is called by the knx-ultimate config node.
    node.watchDogTimerReset = () => {
      // Resets the watchdog, means all is OK
      if (node.checkLevel === 'Ethernet') {
        node.beatNumber = 0 // Reset counter
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Basic check level unicast ' + node.checkLevel + ' - Interface OK.', payload: '', GA: node.topic, dpt: '', devicename: '' })
        }, 500)
      } else {
        // With this check level "Ethernet + KNX Twisted Pair", i need to obtain the "Response" from the physical device, otherwise the connection TP is broken.
        node.beatNumber = 0 // Reset counter
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Full check level ' + node.checkLevel + ' - KNX BUS OK.', payload: '', GA: node.topic, dpt: '', devicename: '' })
        }, 500)
      };
    }

    // 16/02/2020 This function is called by the knx-ultimate config node.
    node.signalNodeErrorCalledByConfigNode = _oError => {
      // Report an error from knx-ultimate node.
      // let oError = {nodeid:node.id,topic:node.outputtopic,devicename:devicename,GA:GA,text:text};
      const msg = {
        type: 'NodeError',
        checkPerformed: 'Self KNX-Ultimate node reporting a red color status',
        nodeid: _oError.nodeid,
        payload: true,
        description: _oError.text,
        completeError: _oError
      }
      node.send(msg)
    }

    node.StartWatchDogTimer = () => {
      node.beatNumber = 0
      if (node.timerWatchDog !== null) clearInterval(node.timerWatchDog)
      node.timerWatchDog = setInterval(handleTheDog, node.retryInterval) // 02/01/2020 Start the timer that handles the queue of telegrams
      node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'WatchDog started.', payload: '', GA: '', dpt: '', devicename: '' })
    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
      node.send(msg)
    }

    node.on('input', function (msg) {
      if (typeof msg === 'undefined') return

      if (msg.hasOwnProperty('start')) {
        if (msg.start === true) {
          node.StartWatchDogTimer()
        } else {
          if (node.timerWatchDog !== null) clearInterval(node.timerWatchDog)
          node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'WatchDog stopped.', payload: '', GA: '', dpt: '', devicename: '' })
        };
      };

      if (node.server === undefined) return

      // 01/02/2020 Dinamic change of the KNX Gateway IP, Port and Physical Address
      // This new thing has been requested by proServ RealKNX staff.
      if (msg.hasOwnProperty('setGatewayConfig')) {
        node.server.setGatewayConfig(msg.setGatewayConfig.IP, msg.setGatewayConfig.Port, msg.setGatewayConfig.PhysicalAddress, msg.setGatewayConfig.BindToEthernetInterface, msg.setGatewayConfig.Protocol, msg.setGatewayConfig.importCSV)
        const ret = {
          type: 'setGatewayConfig',
          checkPerformed: 'The Watchdog node changed the gateway configuration.',
          nodeid: node.id,
          payload: true,
          description: 'New Config issued to the gateway. IP:' + (msg.setGatewayConfig.IP || 'Unchanged') + ' Port:' + (msg.setGatewayConfig.Port || 'Unchanged') + ' PhysicalAddress:' + (msg.setGatewayConfig.PhysicalAddress || 'Unchanged') + ' Protocol:' + (msg.setGatewayConfig.Protocol || 'Unchanged') + ' BindLocalInterface:' + (msg.setGatewayConfig.BindToEthernetInterface || 'Unchanged' + ' importCSV:' + (msg.setGatewayConfig.importCSV || 'Unchanged')),
          completeError: ''
        }
        node.send(ret)
      };

      // 05/05/2021 force connection/disconnectio of the gateway
      if (msg.hasOwnProperty('connectGateway')) {
        node.server.connectGateway(msg.connectGateway)
        const ret = {
          type: 'connectGateway',
          checkPerformed: 'The Watchdog issued a connection/disconnection to the gateway.',
          nodeid: node.id,
          payload: msg.connectGateway,
          description: 'Connection',
          completeError: ''
        }
        node.send(ret)
      }
    })

    node.on('close', function (done) {
      if (node.timerWatchDog !== null) clearInterval(node.timerWatchDog)
      if (node.server) {
        node.server.removeClient(node)
      };
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    // Unsubscribe(Subscribe)
    if (node.server) {
      if (node.timerWatchDog !== null) clearInterval(node.timerWatchDog)
      node.server.removeClient(node)
      if (node.topic || node.listenallga) {
        node.server.addClient(node)
        if (node.autoStart) node.StartWatchDogTimer() // Autostart watchdog
      }
    }
  }
  RED.nodes.registerType('knxUltimateWatchDog', knxUltimateWatchDog)
}
