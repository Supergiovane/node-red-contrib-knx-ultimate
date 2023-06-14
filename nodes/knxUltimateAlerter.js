
module.exports = function (RED) {
  function knxUltimateAlerter(config) {
    const fs = require('fs')
    const path = require('path')
    const mkdirp = require('mkdirp')
    //const Address = require('./../KNXEngine/protocol/KNXAddress')
    //const KnxConstants = require('./../KNXEngine/protocol/KNXConstants')

    RED.nodes.createNode(this, config)
    const node = this
    node.server = RED.nodes.getNode(config.server)
    node.name = config.name || 'KNX Alerter'
    node.listenallga = true // Dont' remove this.
    node.notifyreadrequest = false
    node.notifyresponse = true
    node.notifywrite = true // Dont' remove this.
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.rules = config.rules || [{}]
    node.isalertnode = true // Signal to config node, that this is a node scene controller
    node.userDir = path.join(RED.settings.userDir, 'knxultimatestorage') // 09/03/2020 Storage of ttsultimate (otherwise, at each upgrade to a newer version, the node path is wiped out and recreated, loosing all custom files)
    node.alertedDevices = []
    node.curIndexAlertedDevice = 0
    node.timerSend = null
    node.whentostart = config.whentostart === undefined ? 'ifnewalert' : config.whentostart
    node.timerinterval = (config.timerinterval === undefined || config.timerinterval == '') ? '2' : config.timerinterval
    if (config.initialreadGAInRules === undefined) {
      node.initialread = true
    } else {
      node.initialread = config.initialreadGAInRules !== '0'
    }

    try {
      node.sysLogger = require('./utils/sysLogger.js').get({ loglevel: node.server.loglevel || 'error' }) // 08/04/2021 new logger to adhere to the loglevel selected in the config-window
    } catch (error) {
      node.sysLogger = 'error'
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      try {
        if (node.server === null) return
        // Log only service statuses, not the GA values
        if (dpt !== undefined) return
        if (dpt !== '') return

        const dDate = new Date()
        // 30/08/2019 Display only the things selected in the config
        GA = (typeof GA === 'undefined' || GA == '') ? '' : '(' + GA + ') '
        devicename = devicename || ''
        dpt = (typeof dpt === 'undefined' || dpt == '') ? '' : ' DPT' + dpt
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload
        node.status({ fill, shape, text: GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) === true ? ' ' + devicename : '') + (node.server.statusDisplayDataPoint === true ? dpt : '') + (node.server.statusDisplayLastUpdate === true ? ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' : '') + ' ' + text })
      } catch (error) {

      }
    }

    // Used to call the status update from the config node.
    node.setLocalStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      const dDate = new Date()
      // 30/08/2019 Display only the things selected in the config
      GA = (typeof GA === 'undefined' || GA == '') ? '' : '(' + GA + ') '
      devicename = devicename || ''
      dpt = (typeof dpt === 'undefined' || dpt == '') ? '' : ' DPT' + dpt
      try {
        node.status({ fill, shape, text: GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) === true ? ' ' + devicename : '') + (node.server.statusDisplayDataPoint === true ? dpt : '') + (node.server.statusDisplayLastUpdate === true ? ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' : '') + ' ' + text })
      } catch (error) {
      }
    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
      try {
        if (!msg.knx.dpt.startsWith('1.')) return
      } catch (error) {
        return
      }
      let bFound = false // 24/04/2021 true if the cycle below found a match, otherwise false

      // Update the node.rules with the values taken from the file, if any, otherwise leave the default value
      for (let i = 0; i < node.rules.length; i++) {
        // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, longdevicename: rowRuleLongDeviceName}
        var rule = node.rules[i]
        if (msg.topic === rule.topic) {
          if (msg.payload == true) {
            bFound = true
            // Add the device to the array of alertedDevices
            const oTrovato = node.alertedDevices.find(a => a.topic === rule.topic)
            if (oTrovato === undefined) {
              node.alertedDevices.unshift({ topic: rule.topic, devicename: rule.devicename, longdevicename: rule.longdevicename }) // Add to the begin of array
              if (node.whentostart === 'ifnewalert') node.send([null, null, node.getThirdPinMSG()])
            }
            node.setLocalStatus({ fill: 'red', shape: 'dot', text: 'Alert', payload: '', GA: msg.topic, dpt: '', devicename: rule.devicename })
          } else {
            // Remove the device from the array
            node.alertedDevices = node.alertedDevices.filter(a => a.topic !== msg.topic)
            node.setLocalStatus({ fill: 'green', shape: 'dot', text: 'Restore', payload: '', GA: msg.topic, dpt: '', devicename: rule.devicename })
          }
        }
      }

      // If there's some device to alert, stop current timer and restart
      // This allow the last alerted device to be outputted immediately
      if (bFound && node.whentostart === 'ifnewalert' && node.alertedDevices.length > 0) {
        clearTimeout(node.timerSend)
        // Send directly the second and third message PIN
        node.send([null, node.getSecondPinMSG(), null])
        node.curIndexAlertedDevice = 0 // Restart form the beginning
        node.startTimer()
      }
    }

    // Get the msg to be outputted on second PIN
    node.getSecondPinMSG = () => {
      if (node.alertedDevices.length > 0) {
        const msg = {}
        let sRet = ''
        let sRetLong = ''
        let sTopic = ''
        node.alertedDevices.forEach(function (item) {
          sTopic += item.topic + ', '
          if (item.devicename !== undefined && item.devicename !== '') sRet += item.devicename + ', '
          if (item.longdevicename !== undefined && item.longdevicename !== '') sRetLong += item.longdevicename + ', '
        })
        sTopic = sTopic.slice(0, -2)
        if (sRet.length > 2) sRet = sRet.slice(0, -2)
        if (sRetLong.length > 2) sRetLong = sRetLong.slice(0, -2)
        msg.topic = sTopic
        msg.devicename = sRet
        msg.longdevicename = sRetLong
        msg.count = node.alertedDevices.length
        msg.payload = true
        return msg
      }
    }

    // Get the msg to be outputted on third PIN
    node.getThirdPinMSG = () => {
      if (node.alertedDevices.length > 0) {
        const msg = {}
        let sRet = ''
        let sRetLong = ''
        let sTopic = ''
        const item = node.alertedDevices[0] // Pick the last alerted device
        sTopic = item.topic
        if (item.devicename !== undefined && item.devicename !== '') sRet = item.devicename
        if (item.longdevicename !== undefined && item.longdevicename !== '') sRetLong = item.longdevicename
        msg.topic = sTopic
        msg.devicename = sRet
        msg.longdevicename = sRetLong
        msg.count = node.alertedDevices.length
        msg.payload = true
        return msg
      }
    }

    // 24/04/2021 perform a read on all GA in the rule list. Called both from node.on("input") and knxUltimate-config
    node.initialReadAllDevicesInRules = () => {
      if (node.server) {
        let grpaddr = ''
        for (let i = 0; i < node.rules.length; i++) {
          // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, longdevicename: rowRuleLongDeviceName}
          const rule = node.rules[i]
          // READ: Send a Read request to the bus
          grpaddr = rule.topic
          try {
            // Check if it's a group address
            //const ret = Address.KNXAddress.createFromString(grpaddr, Address.KNXAddress.TYPE_GROUP)
            node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'Read', payload: '', GA: grpaddr, dpt: '', devicename: rule.devicename })
            node.server.writeQueueAdd({ grpaddr, payload: '', dpt: '', outputtype: 'read', nodecallerid: node.id })
          } catch (error) {
            node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'Not a KNX GA ' + error.message, payload: '', GA: grpaddr, dpt: '', devicename: rule.devicename })
          }
        }
      } else {
        node.setLocalStatus({ fill: 'red', shape: 'ring', text: 'No gateway selected. Unable to read from KNX bus', payload: '', GA: '', dpt: '', devicename: '' })
      }
    }

    node.on('input', function (msg) {
      if (typeof msg === 'undefined') return
      if (msg.hasOwnProperty('start')) {
        clearTimeout(node.timerSend)
        node.curIndexAlertedDevice = 0 // Restart form the beginning
        if (node.alertedDevices.length > 0) {
          node.send([null, node.getSecondPinMSG(), node.getThirdPinMSG()])
          node.startTimer()
        } else {
          // Nothing more to output
          node.sendNoMoreDevices()
        }
        return
      }

      // 24/04/2021 if payload is read or the output type is set to "read", do a read
      if ((msg.hasOwnProperty('readstatus') && msg.readstatus === true)) {
        node.initialReadAllDevicesInRules()
        return
      }

      if (msg.topic === undefined) {
        node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'ERROR: You must provide a msg.topic', payload: '', GA: '', dpt: '', devicename: '' })
        return
      }
      if (msg.payload === undefined) {
        node.setLocalStatus({ fill: 'grey', shape: 'dot', text: 'ERROR: You must provide payload (true/false)', payload: '', GA: '', dpt: '', devicename: '' })
        return
      }
      msg.knx = { dpt: '1.001' }
      node.handleSend(msg)
    })

    node.on('close', function (done) {
      clearTimeout(node.timerSend)
      if (node.server) {
        node.server.removeClient(node)
      }
      done()
    })

    node.handleTimer = () => {
      if (node.alertedDevices.length > 0) {
        const count = node.alertedDevices.length
        if (node.curIndexAlertedDevice > count - 1) {
          node.curIndexAlertedDevice = 0
          if (node.whentostart === 'manualstart') {
            node.curIndexAlertedDevice = 0 // Restart form the beginning
            return
          }
        }
        // Create output message
        try {
          const curDev = node.alertedDevices[node.curIndexAlertedDevice] // is { topic: rule.topic, devicename: rule.devicename }
          const msg = {}
          msg.topic = curDev.topic
          msg.count = count
          msg.devicename = curDev.devicename
          msg.longdevicename = curDev.longdevicename
          msg.payload = true
          node.send([msg, null, null])
        } catch (error) {
        }
        node.curIndexAlertedDevice += 1
        // Restart timer
        node.startTimer()
      } else {
        // Nothing more to output
        node.sendNoMoreDevices()
      }
    }

    // Start timer
    node.startTimer = () => {
      clearTimeout(node.timerSend)
      node.timerSend = setTimeout(() => {
        node.handleTimer()
      }, node.timerinterval * 1000)
    }

    // As soon as there no more devices..
    node.sendNoMoreDevices = () => {
      const msg = {}
      msg.topic = ''
      msg.count = 0
      msg.devicename = ''
      msg.longdevicename = ''
      msg.payload = false
      node.send([msg, msg, msg])
    }

    // Init
    node.sendNoMoreDevices()

    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node)
      if (node.topic !== '' || node.topicSave !== '') {
        node.server.addClient(node)
      }
    }
  }
  RED.nodes.registerType('knxUltimateAlerter', knxUltimateAlerter)
}
