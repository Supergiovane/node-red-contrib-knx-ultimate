
// 10/09/2024 Setup the color logger
const loggerClass = require('./utils/sysLogger')
module.exports = function (RED) {
  function knxUltimateLoadControl(config) {
    // const Address = require('knxultimate')

    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    if (node.serverKNX === undefined) {
      node.status({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' });
      return;
    }
    node.name = config.name || 'KNX Load Control'
    node.topic = config.topic
    node.dpt = config.dpt
    node.listenallga = true // Dont' remove this.
    node.notifyreadrequest = false
    node.notifyresponse = true
    node.notifywrite = true // Dont' remove this.
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.isLoadControlNode = true // Signal to config node, that this is a Load Control node
    node.initialread = true
    node.formatmultiplyvalue = 1
    node.formatnegativevalue = 'zero'
    node.formatdecimalsvalue = 0
    node.setLocalStatusTotalWattTimer = null
    node.sheddingStage = 0
    node.timerIncreaseShedding = null
    node.timerDecreaseShedding = null
    node.sheddingCheckInterval = config.sheddingCheckInterval !== undefined ? config.sheddingCheckInterval * 1000 : 10000
    node.sheddingRestoreDelay = config.sheddingRestoreDelay !== undefined ? config.sheddingRestoreDelay * 1000 : 60000
    node.mainTimer = null
    node.totalWatt = 0 // Current total watt consumption
    node.wattLimit = config.wattLimit === undefined ? 3000 : Number(config.wattLimit)
    try {
      node.sysLogger = new loggerClass({ loglevel: node.serverKNX.loglevel, setPrefix: node.type + " <" + (node.name || node.id || '') + ">" });
    } catch (error) { console.log(error.stack) }
    node.deviceList = []
    for (let index = 1; index < 6; index++) {
      // Eval, the magic. Fill in the device list. DEFINITION DEVICELIST
      node.deviceList.push({
        ga: eval('config.GA' + index),
        dpt: eval('config.DPT' + index),
        name: eval('config.Name' + index),
        autoRestore: eval('config.autoRestore' + index),
        monitorGA: eval('config.MonitorGA' + index),
        monitorDPT: eval('config.MonitorDPT' + index),
        monitorName: eval('config.MonitorName' + index),
        monitorVal: null
      })
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      if (node.serverKNX === null) return
      // Log only service statuses, not the GA values
      try {
        if (dpt !== '') return
        const dDate = new Date()
        // 30/08/2019 Display only the things selected in the config
        GA = (typeof GA === 'undefined' || GA == '') ? '' : '(' + GA + ') '
        devicename = devicename || ''
        dpt = (typeof dpt === 'undefined' || dpt == '') ? '' : ' DPT' + dpt
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload
        node.status({ fill, shape, text: GA + payload + (node.listenallga === true ? ' ' + devicename : '') + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ' ' + text })
      } catch (error) {

      }
    }

    // Used to call the status update from this node
    node.setLocalStatus = ({ fill = 'green', shape = 'ring', text = '' }) => {
      if (text !== '') text += '.'
      const dDate = new Date()
      try {
        node.status({ fill, shape, text: text + ' Shed:' + node.sheddingStage + ' Power:' + node.totalWatt + 'W' + ' Limit:' + node.wattLimit + 'W (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' })
      } catch (error) {
      }
    }

    // This function is called by the knx-ultimate config node.
    node.handleSend = msg => {
      // Update the Total Watt?
      if (msg.topic === node.topic && msg.payload !== '' && msg.payload !== null && msg.payload !== undefined) {
        node.totalWatt = msg.payload
        // Update current consumption only if the node is in idle state
        if (node.timerIncreaseShedding === null && node.timerDecreaseShedding === null) {
          if (node.setLocalStatusTotalWattTimer === null) clearInterval(node.setLocalStatusTotalWattTimer)
          node.setLocalStatusTotalWattTimer = setTimeout(() => {
            node.setLocalStatus({ fill: 'grey' })
          }, 2000)
        }
        return
      }

      // Update the node.deviceList
      for (let i = 0; i < node.deviceList.length; i++) {
        // deviceList is an array of objects:
        // ga: eval("config.GA" + index),
        // dpt: eval("config.DPT" + index),
        // name: eval("config.Name" + index),
        // autoRestore : eval("config.autoRestore" + index),
        // monitorGA: eval("config.MonitorGA" + index),
        // monitorDPT: eval("config.MonitorDPT" + index),
        // monitorName: eval("config.MonitorName" + index),
        // monitorVal: null

        const oRow = node.deviceList[i]
        if (msg.topic === oRow.monitorGA && msg.payload !== null && msg.payload !== undefined) {
          oRow.monitorVal = msg.payload
          // node.setLocalStatus({ fill: "blue", shape: "dot", text: "Updated", payload: oRow.monitorVal, GA: msg.topic, dpt: "", devicename: oRow.monitorName });
        }
      }
    }

    // 03/02/2022 perform a read on all GA in the list
    node.initialReadAllDevicesInRules = () => {
      if (node.serverKNX) {
        // Read status of the Total Power GA
        if (node.topic !== undefined && node.topic !== null && node.topic !== '') node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr: node.topic, payload: '', dpt: '', outputtype: 'read', nodecallerid: node.id })

        for (let i = 0; i < node.deviceList.length; i++) {
          const grpaddr = node.deviceList[i].monitorGA
          if (grpaddr !== undefined && grpaddr !== '' && grpaddr !== null) {
            try {
              // Check if it's a group address
              // const ret = Address.KNXAddress.createFromString(grpaddr, Address.KNXAddress.TYPE_GROUP)
              // node.setLocalStatus({ fill: "grey", shape: "dot", text: "Read Power from BUS" });
              node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr, payload: '', dpt: '', outputtype: 'read', nodecallerid: node.id })
            } catch (error) {
              node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'Not a KNX GA ' + error.message })
            }
          }
        }
      } else {
        node.setLocalStatus({ fill: 'red', shape: 'ring', text: 'No gateway selected. Unable to read from KNX bus' })
      }
    }

    node.startMainTimer = () => {
      if (node.mainTimer !== null) clearInterval(node.mainTimer)// Clear the timer
      node.mainTimer = setInterval(() => {
        // Issue a READ on all GA's
        node.initialReadAllDevicesInRules()

        // Check consumption
        if (node.totalWatt > node.wattLimit) {
          // Start increasing shedding!
          if (node.sheddingStage < node.deviceList.length) {
            if (node.timerIncreaseShedding === null) {
              const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
                node.setLocalStatus({ fill: 'yellow', shape: 'dot', text: "I'm about to shed the load " + node.sheddingStage })
              }, 2000)
              if (node.timerDecreaseShedding !== null) clearTimeout(node.timerDecreaseShedding)// Clear the decreasing timer
              node.startTimerIncreaseShedding()
            }
          }
        } else if (node.totalWatt <= node.wattLimit) {
          // Start decreasing shedding!
          if (node.sheddingStage > 0) {
            if (node.timerDecreaseShedding === null) {
              const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
                node.setLocalStatus({ fill: 'yellow', shape: 'dot', text: "I'm about to unshed the load " + node.sheddingStage })
              }, 2000)
              if (node.timerIncreaseShedding !== null) clearTimeout(node.timerIncreaseShedding)// Clear the increasing timer
              node.startTimerDecreaseShedding()
            }
          }
        }
      }, 20000)
    }

    // Start the timer
    node.startTimerIncreaseShedding = () => {
      // Increase shedding timer (Switch off devices)
      if (node.timerIncreaseShedding !== null) clearTimeout(node.timerIncreaseShedding)
      node.timerIncreaseShedding = setTimeout(() => {
        if (node.serverKNX) {
          // Check consumption
          if (node.totalWatt > node.wattLimit) {
            // Start increasing shedding!
            if (node.sheddingStage < node.deviceList.length) {
              node.increaseShedding()
            }
          }
        }
        node.timerIncreaseShedding = null // Nullify the timer.
      }, node.sheddingCheckInterval)
    }

    // Start the timer
    node.startTimerDecreaseShedding = () => {
      // Decrease shedding timer (Switch devices on again)
      if (node.timerDecreaseShedding !== null) clearTimeout(node.timerDecreaseShedding)
      node.timerDecreaseShedding = setTimeout(() => {
        if (node.serverKNX) {
          // Check consumption
          if (node.totalWatt <= node.wattLimit) {
            // Start decreasing shedding!
            if (node.sheddingStage > 0) {
              node.decreaseShedding()
            }
          }
        }
        node.timerDecreaseShedding = null // Nullify timer
      }, node.sheddingRestoreDelay)
    }

    node.increaseShedding = () => {
      // deviceList is an array of objects:
      // ga: eval("config.GA" + index),
      // dpt: eval("config.DPT" + index),
      // name: eval("config.Name" + index),
      // autoRestore : eval("config.autoRestore" + index),
      // monitorGA: eval("config.MonitorGA" + index),
      // monitorDPT: eval("config.MonitorDPT" + index),
      // monitorName: eval("config.MonitorName" + index),
      // monitorVal: null
      if (node.sheddingStage >= node.deviceList.length) {
        node.sheddingStage = node.deviceList.length
        node.setLocalStatus({ fill: 'red', shape: 'dot', text: 'No more loads to shed!!' })
        return
      }

      node.sheddingStage++
      const iRowIndex = node.sheddingStage - 1 // Array is base 0
      const oRow = node.deviceList[iRowIndex]
      if (oRow.ga !== undefined && oRow.ga !== '' && oRow.ga !== null) {
        // Check if the device is in use. If not, turn off the device and further increase the shedding stage to turn off the next one.
        node.setLocalStatus({ fill: 'red', shape: 'dot', text: 'OFF ' + oRow.name })
        node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr: oRow.ga, payload: false, dpt: oRow.dpt, outputtype: 'write', nodecallerid: node.id })
      } else {
        node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'No GA defined' })
      }
      node.send({ topic: node.name || node.topic, operation: 'Increase Shedding', device: oRow.name || '', ga: oRow.ga || '', totalPowerConsumption: node.totalWatt, wattLimit: node.wattLimit, payload: node.sheddingStage })
      // Go furhter ?
      if (oRow.monitorGA !== undefined && oRow.monitorGA !== '' && oRow.monitorGA !== null) {
        // Minimum consumption must be at lease xx Watt
        if (oRow.monitorVal === null || oRow.monitorVal === undefined || oRow.monitorVal < 30) {
          // Switch off the next load, because this is already off, because the power consumption trascurable
          node.increaseShedding()
        }
      }
    }

    node.decreaseShedding = () => {
      // deviceList is an array of objects:
      // ga: eval("config.GA" + index),
      // dpt: eval("config.DPT" + index),
      // name: eval("config.Name" + index),
      // autoRestore : eval("config.autoRestore" + index),
      // monitorGA: eval("config.MonitorGA" + index),
      // monitorDPT: eval("config.MonitorDPT" + index),
      // monitorName: eval("config.MonitorName" + index),
      // monitorVal: null
      if (node.sheddingStage <= 0) {
        node.sheddingStage = 0
        node.setLocalStatus({ fill: 'green', shape: 'dot', text: 'All loads are ON' })
        return
      }

      node.sheddingStage--;
      let iRowIndex = node.sheddingStage // Array is base 0
      if (iRowIndex < 0) iRowIndex = 0
      if (iRowIndex > node.deviceList.length - 1) return

      const oRow = node.deviceList[iRowIndex]
      if (oRow.ga !== undefined && oRow.ga !== '' && oRow.ga !== null) {
        if (oRow.autoRestore === true) {
          // Check if the device is in use. If not, turn off the device and further increase the shedding stage to turn off the next one.
          node.setLocalStatus({ fill: 'green', shape: 'dot', text: 'ON ' + oRow.name })
          node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr: oRow.ga, payload: true, dpt: oRow.dpt, outputtype: 'write', nodecallerid: node.id })
        } else {
          // Cannot auto switch on the load.
          node.setLocalStatus({ fill: 'yellow', shape: 'dot', text: 'Auto Restore disabled ' + oRow.name })
        }
      } else {
        // No load GA defined
        node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'No Load GA defined' })
      }
      node.send({ topic: node.name || node.topic, operation: 'Decrease Shedding', device: oRow.name || '', ga: oRow.ga || '', totalPowerConsumption: node.totalWatt, wattLimit: node.wattLimit, payload: node.sheddingStage })

      if (node.sheddingStage < 0) {
        node.sheddingStage = 0
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setLocalStatus({ fill: 'green', shape: 'dot', text: 'All loads have been restored' })
        }, 1000)
      }
    }

    // Start
    node.startMainTimer()

    node.on('input', function (msg) {
      if (typeof msg === 'undefined') return

      // Reset the shedding and activate all loads
      if (msg.hasOwnProperty('reset')) {
        if (node.timerDecreaseShedding !== null) clearTimeout(node.timerDecreaseShedding)
        if (node.timerIncreaseShedding !== null) clearTimeout(node.timerIncreaseShedding)
        node.sheddingStage = 0
        for (let index = 0; index < node.deviceList.length; index++) {
          const oRow = node.deviceList[index]
          if (oRow.autoRestore === true) node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr: oRow.ga, payload: true, dpt: oRow.dpt, outputtype: 'write', nodecallerid: node.id })
        }
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setLocalStatus({ fill: 'green', shape: 'dot', text: 'All loads have been restored' })
        }, 1000)
        node.send({ topic: node.name || node.topic, operation: 'Reset', payload: node.sheddingStage })
      }

      // Disable the shedding node
      if (msg.hasOwnProperty('disable')) {
        if (node.timerDecreaseShedding !== null) clearTimeout(node.timerDecreaseShedding)
        if (node.timerIncreaseShedding !== null) clearTimeout(node.timerIncreaseShedding)
        if (node.mainTimer !== null) clearInterval(node.mainTimer)
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'Disabled' })
        }, 1000)
        node.send({ topic: node.name || node.topic, operation: 'Disabled', payload: node.sheddingStage })
      }

      // Disable the shedding node
      if (msg.hasOwnProperty('enable')) {
        if (node.timerDecreaseShedding !== null) clearTimeout(node.timerDecreaseShedding)
        if (node.timerIncreaseShedding !== null) clearTimeout(node.timerIncreaseShedding)
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setLocalStatus({ fill: 'green', shape: 'dot', text: 'Enabled' })
          // Restart timer
          node.startMainTimer()
        }, 1000)
        node.send({ topic: node.name || node.topic, operation: 'Enabled', payload: node.sheddingStage })
      }

      // 24/04/2021 if payload is read or the Telegram type is set to "read", do a read
      if ((msg.hasOwnProperty('readstatus') && msg.readstatus === true)) {
        node.initialReadAllDevicesInRules()
      }

      // 'shed', 'unshed', 'auto'
      // | `msg.shedding` | String. *shed* to start the formward shedding sequence, *unshed* to start reverse shedding. Use this msg to force the shedding timer to start/stop, ignoring the **Monitor Wh** group address. Set *auto* to enable again the **Monitor Wh** group address monitoring. |
      if (msg.shedding !== undefined) {
        switch (msg.shedding) {
          case 'shed':
            node.wattLimit = 1 // Faking to shed
            node.setLocalStatus({ fill: 'red', shape: 'dot', text: 'msg.shedding: SHED received.' });
            break;
          case 'unshed':
            node.wattLimit = 100000 // Faking to unshed
            node.setLocalStatus({ fill: 'green', shape: 'dot', text: 'msg.shedding: UNSHED received.' });
            break;
          case 'auto':
            node.wattLimit = config.wattLimit === undefined ? 3000 : Number(config.wattLimit);
            node.setLocalStatus({ fill: 'green', shape: 'ring', text: 'msg.shedding: AUTO received.' });
            break;
          default:
            break;
        }
      }

    })

    node.on('close', function (done) {
      if (node.mainTimer !== null) clearInterval(node.mainTimer)
      if (node.timerDecreaseShedding !== null) clearTimeout(node.timerDecreaseShedding)
      if (node.timerIncreaseShedding !== null) clearTimeout(node.timerIncreaseShedding)
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      if (node.topic !== '') {
        node.serverKNX.addClient(node)
      }
    }
  }
  RED.nodes.registerType('knxUltimateLoadControl', knxUltimateLoadControl)
}
