const loggerClass = require('./utils/sysLogger')

module.exports = function (RED) {
  function knxUltimateSceneController (config) {
    const fs = require('fs')
    const path = require('path')

    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.name = config.name || 'KNX Scene Controller'
    node.outputtopic = typeof config.outputtopic === 'undefined' ? '' : config.outputtopic
    node.topic = config.topic || ''
    node.dpt = config.dpt || '1.001'
    node.topicTrigger = config.topicTrigger || 'true'
    node.topicSave = config.topicSave || ''
    node.dptSave = config.dptSave || '1.001'
    node.topicSaveTrigger = config.topicSaveTrigger || 'true'
    node.listenallga = false // Dont' remove this.
    node.notifyreadrequest = false
    node.notifyresponse = false
    node.notifywrite = true // Dont' remove this.
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.rules = config.rules || [{}]
    node.isSceneController = true // Signal to config node, that this is a node scene controller
    node.userDir = path.join(RED.settings.userDir, 'knxultimatestorage') // 09/03/2020 Storage of ttsultimate (otherwise, at each upgrade to a newer version, the node path is wiped out and recreated, loosing all custom files)
    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { console.log(error.stack) }
    node.timerWait = null
    node.icountMessageInWindow = 0
    node.disabled = false // 21/09/2020 you can now disable the scene controller

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    const updateStatus = (status) => {
      if (!status) return
      pushStatus(status)
    }

    // 03/09/2021
    async function delay (ms) {
      return new Promise(function (resolve, reject) {
        try {
          node.timerWait = setTimeout(resolve, ms)
        } catch (error) {
          reject()
        }
      })
    }

    function setupDirectory (aPath) {
      try {
        return fs.statSync(aPath).isDirectory()
      } catch (e) {
        // Path does not exist
        if (e.code === 'ENOENT') {
          // Try and create it
          try {
            try {
              fs.mkdirSync(aPath, { recursive: true })
              if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('knxUltimate-Scene Controller: created directory path: ' + aPath)
            } catch (error) {
              if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimate-Scene Controller: failed to access path:: ' + aPath + ' : ' + error)
              return false
            }

            return true
          } catch (e) {
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimate-Scene Controller: failed to create path: ' + aPath + ' : ' + e)
          }
        }
        // Otherwise failure
        return false
      }
    }

    // This stores all scenes values, that are been saved.
    try {
      setupDirectory(node.userDir)
    } catch (error) { }
    if (!setupDirectory(node.userDir + '/scenecontroller')) {
      if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimate-Scene Controller: Unable to set up permanent files directory: ' + node.userDir + '/scenecontroller')
      node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'Unable to setup permanent files directory', payload: '', GA: '', dpt: '', devicename: node.name })
    } else {

    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      try {
        if (node.serverKNX === null) { updateStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
        if (node.icountMessageInWindow == -999) return // Locked out
        if (node.disabled === true) fill = 'grey' // 21/09/2020 if disabled, color is grey
        const dDate = new Date()
        const ts = (node.serverKNX && typeof node.serverKNX.formatStatusTimestamp === 'function')
          ? node.serverKNX.formatStatusTimestamp(dDate)
          : `${dDate.getDate()}, ${dDate.toLocaleTimeString()}`
        // 30/08/2019 Display only the things selected in the config
        GA = (typeof GA === 'undefined' || GA === '') ? '' : '(' + GA + ') '
        devicename = devicename || ''
        dpt = (typeof dpt === 'undefined' || dpt === '') ? '' : ' DPT' + dpt
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload
        updateStatus({ fill, shape, text: GA + payload + (node.listenallga === true ? ' ' + devicename : '') + ' (' + ts + ') ' + text })
        // 16/02/2020 signal errors to the server
        if (fill.toUpperCase() === 'RED') {
          if (node.serverKNX) {
            const oError = { nodeid: node.id, topic: node.outputtopic, devicename, GA, text }
            node.serverKNX.reportToWatchdogCalledByKNXUltimateNode(oError)
          };
        };
      } catch (error) {
      }
    }

    // 03/09/2021 Async function to allow await delay(x)
    async function RecallSceneAsync (_Payload, _ForceEvenControllerIsDisabled) {
      let curVal
      var newVal

      if (typeof _Payload === 'object') {
        // If payload is an object, parse it as object
        try {
          curVal = JSON.stringify(_Payload)
          if (node.topicTrigger.toString().indexOf('{') > -1) {
            // Sanitize string, if not having quotes
            var correctJson = node.topicTrigger.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
            try {
              newVal = JSON.stringify(JSON.parse(correctJson))
            } catch (error) {
              // Not a valid JSON, thread as normal.
              newVal = node.topicTrigger.toString().toLowerCase()
            }
          } else {
            // topicTrigge is not a JSON
            newVal = node.topicTrigger.toString().toLowerCase()
          }
        } catch (error) {
          // Invalid JSON, threat as normal.
          curVal = _Payload.toString().toLowerCase()
          newVal = node.topicTrigger.toString().toLowerCase()
        }
      } else {
        // Not a JSON, threath as normal.
        curVal = _Payload.toString().toLowerCase()
        newVal = node.topicTrigger.toString().toLowerCase()
      }

      if (curVal === 'false') {
        curVal = '0'
      }
      if (curVal === 'true') {
        curVal = '1'
      }
      if (curVal.toString().indexOf('"decr_incr":1') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        curVal = 'DIMUP'
      }
      if (curVal.toString().indexOf('"decr_incr":0') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        curVal = 'DIMDOWN'
      }
      if (newVal === 'false') {
        newVal = '0'
      }
      if (newVal === 'true') {
        newVal = '1'
      }
      if (newVal.toString().indexOf('"decr_incr":1') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        newVal = 'DIMUP'
      }
      if (newVal.toString().indexOf('"decr_incr":0') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        newVal = 'DIMDOWN'
      }
      // if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn(curVal + " new: " + newVal)
      if (curVal != newVal) return

      // 25/09/2020 If the node is disabled, doens't perform the action.
      if (node.disabled && !_ForceEvenControllerIsDisabled) {
        const t = setTimeout(() => {
          node.setNodeStatus({ fill: 'grey', shape: 'dot', text: 'Recall while disabled', payload: '', GA: '', dpt: '', devicename: '' })
        }, 500)
        node.send({ savescene: false, recallscene: true, savevalue: false, disabled: true })
        return
      }

      // Read the scene values from file, if any.
      let oSavedRules = null
      try {
        oSavedRules = fs.readFileSync(node.userDir + '/scenecontroller/SceneController_' + node.id)
        oSavedRules = JSON.parse(oSavedRules)
      } catch (error) { }

      // Update the node.rules with the values taken from the file, if any, otherwise leave the default value
      for (let i = 0; i < node.rules.length; i++) {
        // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
        var rule = node.rules[i]
        var newVal = null
        if (oSavedRules !== null) {
          const oSavedDev = oSavedRules.find(a => a.topic === rule.topic)
          if (typeof oSavedDev !== 'undefined') {
            newVal = oSavedDev.send
            if (newVal !== null) { rule.send = newVal.toString() }
          }
        }
        // If payload is an object, parse it as object
        var oPayload
        if (rule.send.toString().indexOf('{') > -1) {
          // Sanitize string, if not having quotes
          var correctJson = rule.send.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
          try {
            oPayload = JSON.parse(correctJson)
          } catch (error) {
            oPayload = rule.send
          }
        } else {
          oPayload = rule.send
        }

        // 03/09/2021 wait command?
        if (rule.topic.toLowerCase() === 'wait') {
          // if (isNaN(rule.send)) {
          if (rule.send === undefined || rule.send === '') {
            const t = setTimeout(() => {
              node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'Wait time is empty. See the WIKI for help.', payload: '', GA: '', dpt: '', devicename: '' })
            }, 1000)
          } else {
            // 25/05/2022 added support for seconds and minutes
            let msWait = 0
            try {
              if (rule.send.toString().endsWith('s')) {
                msWait = Number(rule.send.toString().slice(0, -1)) * 1000 // Seconds
              } else if (rule.send.toString().endsWith('m')) {
                msWait = Number(rule.send.toString().slice(0, -1)) * 60 * 1000 // Minutes
              } else if (rule.send.toString().endsWith('h')) {
                msWait = Number(rule.send.toString().slice(0, -1)) * 60 * 60 * 1000 // Hours
              } else {
                msWait = Number(rule.send)
              }
            } catch (error) {
              node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'Invalid wait time. See the WIKI for help: ' + error.message, payload: '', GA: '', dpt: '', devicename: '' })
            }
            await delay(msWait)
          }
        } else {
          // Topic is Group Address
          node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr: rule.topic, payload: oPayload, dpt: rule.dpt, outputtype: 'write', nodecallerid: node.id })
        }
      }
      const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
        node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Recall scene', payload: '', GA: '', dpt: '', devicename: '' })
      }, 1000)
      await delay(500)
      node.send({ savescene: false, recallscene: true, savevalue: false, disabled: false })
    }

    // 11/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Recall scene.
    node.RecallScene = (_Payload, _ForceEvenControllerIsDisabled) => {
      try {
        RecallSceneAsync(_Payload, _ForceEvenControllerIsDisabled)
      } catch (error) {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimateSceneController: Node ' + node.id + ' Recall scene error:' + error.message)
      }
    }

    // 11/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Save scene.
    node.SaveScene = (_Payload, _ForceEvenControllerIsDisabled) => {
      let curVal
      let newVal

      if (typeof _Payload === 'object') {
        // If payload is an object, parse it as object
        try {
          curVal = JSON.stringify(_Payload)
          if (node.topicSaveTrigger.toString().indexOf('{') > -1) {
            // Sanitize string, if not having quotes
            const correctJson = node.topicSaveTrigger.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
            try {
              newVal = JSON.stringify(JSON.parse(correctJson))
            } catch (error) {
              // Not a valid JSON, thread as normal.
              newVal = node.topicSaveTrigger.toString().toLowerCase()
            }
          } else {
            // topicTrigge is not a JSON
            newVal = node.topicSaveTrigger.toString().toLowerCase()
          }
        } catch (error) {
          // Invalid JSON, threat as normal.
          curVal = _Payload.toString().toLowerCase()
          newVal = node.topicSaveTrigger.toString().toLowerCase()
        }
      } else {
        // Not a JSON, threath as normal.
        curVal = _Payload.toString().toLowerCase()
        newVal = node.topicSaveTrigger.toString().toLowerCase()
      }

      if (curVal === 'false') {
        curVal = '0'
      }
      if (curVal === 'true') {
        curVal = '1'
      }
      if (curVal.toString().indexOf('"decr_incr":1') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        curVal = 'DIMUP'
      }
      if (curVal.toString().indexOf('"decr_incr":0') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        curVal = 'DIMDOWN'
      }
      if (newVal === 'false') {
        newVal = '0'
      }
      if (newVal === 'true') {
        newVal = '1'
      }
      if (newVal.toString().indexOf('"decr_incr":1') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        newVal = 'DIMUP'
      }
      if (newVal.toString().indexOf('"decr_incr":0') > -1 && curVal.toString().indexOf('"data":0') == -1) { // Handling DIM
        newVal = 'DIMDOWN'
      }
      // if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn(curVal + " new: " + newVal)
      if (curVal != newVal) return

      // 25/09/2020 If the node is disabled, doens't perform the action.
      if (node.disabled && !_ForceEvenControllerIsDisabled) {
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setNodeStatus({ fill: 'grey', shape: 'dot', text: 'Saved while disabled', payload: '', GA: '', dpt: '', devicename: '' })
        }, 500)
        node.send({ savescene: true, recallscene: false, savevalue: false, disabled: true })
        return
      }

      // Save the currentPayload of each device in the scene
      for (let i = 0; i < node.rules.length; i++) {
        // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
        const oDevice = node.rules[i]
        if (oDevice.hasOwnProperty('currentPayload')) {
          oDevice.send = oDevice.currentPayload.toString()
        }
      }
      node.setNodeStatus({ fill: 'blue', shape: 'dot', text: 'Saved scene', payload: '', GA: '', dpt: '', devicename: '' })
      try {
        fs.writeFileSync(node.userDir + '/scenecontroller/SceneController_' + node.id, JSON.stringify(node.rules, null, 2), 'utf-8')
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'Error saving scene. Unable to access filesystem.', payload: '', GA: '', dpt: '', devicename: node.name })
        return
      }
      node.send({ savescene: true, recallscene: false, savevalue: false, disabled: false })
    }

    // 12/08/2020 Save the topic's value into the group address
    node.SaveValue = _msg => {
      if (_msg.hasOwnProperty('topic') && _msg.hasOwnProperty('payload')) {
        // Save the currentPayload into the group address
        for (let i = 0; i < node.rules.length; i++) {
          // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
          const oDevice = node.rules[i]
          if (oDevice.hasOwnProperty('topic') && oDevice.hasOwnProperty('currentPayload') && oDevice.topic === _msg.topic) {
            oDevice.currentPayload = _msg.payload
          }
        }
        node.setNodeStatus({ fill: 'blue', shape: 'dot', text: 'Saved value', payload: _msg.payload, GA: _msg.topic, dpt: '', devicename: '' })
        node.send({ savescene: false, recallscene: false, savevalue: true, disabled: node.disabled })
      } else {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: 'Error saving value; the msg.topic and msg.payload must be both present in the input message.', payload: '', GA: '', dpt: '', devicename: node.name })
      }
    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
      node.send(msg)
    }

    node.on('input', function (msg) {
      if (typeof msg === 'undefined') return

      if (!node.serverKNX) return // 29/08/2019 Server not instantiate
      if (node.serverKNX.linkStatus !== 'connected') {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimateSceneController: Lost link due to a connection error')
        return // 29/08/2019 If not connected, exit
      }

      // 07/02/2020 Revamped flood protection (avoid accepting too many messages as input)
      if (node.icountMessageInWindow == -999) return // Locked out
      if (node.icountMessageInWindow == 0) {
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          if (node.icountMessageInWindow >= 120) {
            // Looping detected
            node.setNodeStatus({ fill: 'red', shape: 'ring', text: 'DISABLED! Flood protection! Too many msg at the same time.', payload: '', GA: '', dpt: '', devicename: '' })
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimateSceneController: Node ' + node.id + " has been disabled due to Flood Protection. Too many messages in a timeframe. Check your flow's design or use RBE option.")
            node.icountMessageInWindow = -999 // Lock out node
          } else { node.icountMessageInWindow = -1 }
        }, 1000)
      }
      node.icountMessageInWindow += 1

      if (msg.hasOwnProperty('savescene')) node.SaveScene(node.topicSaveTrigger, true)
      if (msg.hasOwnProperty('recallscene')) node.RecallScene(node.topicTrigger, true)
      if (msg.hasOwnProperty('savevalue')) node.SaveValue(msg)
      if (msg.hasOwnProperty('disabled')) {
        if (msg.disabled === true) {
          node.disabled = true
          node.setNodeStatus({ fill: 'grey', shape: 'dot', text: 'Disabled', payload: '', GA: '', dpt: '', devicename: '' })
        } else {
          node.disabled = false
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Enabled', payload: '', GA: '', dpt: '', devicename: '' })
        }
      }
    })

    node.on('close', function (done) {
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }
  }
  RED.nodes.registerType('knxUltimateSceneController', knxUltimateSceneController)
}
