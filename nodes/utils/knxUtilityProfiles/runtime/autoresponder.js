// Private KNX Utility profile. Independent of the legacy palette entry point.
const loggerClass = require('../../sysLogger')
const { storageOf } = require('../../fileStorage')

module.exports = function (RED) {
  const dptlib = require('knxultimate').dptlib
  const path = require('path')

  // msg is:
  //  // Build final input message object
  //  return {
  //     topic: _outputtopic
  //     , payload: jsValue
  //     , devicename: (typeof _devicename !== 'undefined') ? _devicename : ""
  //     , payloadmeasureunit: sPayloadmeasureunit
  //     , payloadsubtypevalue: sPayloadsubtypevalue
  //     , knx:
  //     {
  //         event: _event
  //         , dpt: sInputDpt
  //         //, details: dpt
  //         , dptdesc: sDptdesc
  //         , source: _srcGA
  //         , destination: _destGA
  //         , rawValue: _Rawvalue
  //     }
  // };

  // The node.exposedGAs is and array of:
  // {
  //     address,
  //     dpt,
  //     payload
  // }

  function knxUltimateAutoResponder (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server)
    node.topic = node.name
    node.name = config.name === undefined ? 'Auto responder' : config.name
    node.outputtopic = node.name
    node.dpt = ''
    node.notifyreadrequest = true
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.listenallga = true
    node.outputtype = 'write'
    node.outputRBE = 'false' // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = 'false' // Apply or not RBE to the input (Messages coming from BUS)
    node.exposedGAs = []
    node.commandText = [] // Raw list Respond To

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
    if (!node.serverKNX) { updateStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { console.log(error.stack) }
    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      // try {
      //   if (node.serverKNX === null) { node.status({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
      //   GA = GA === undefined ? '' : GA
      //   payload = payload === undefined ? '' : payload
      //   payload = typeof payload === 'object' ? JSON.stringify(payload) : payload
      //   const dDate = new Date()
      //   node.status({ fill, shape, text: GA + ' ' + payload + ' ' + text + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' })
      // } catch (error) {
      // }
    }

    // The gateway's File Cache Control decides when the values reach the disk.
    const storage = storageOf(node.serverKNX)
    const persistFile = path.join(node.serverKNX.userDir, 'knxpersistvalues', 'knxpersist' + node.id + '.json')
    node.saveExposedGAs = (snapshot = false) => {
      try {
        // An empty configured list must also replace its previous saved values.
        // A snapshot is serialized now, as the list is about to be discarded.
        const serialize = () => JSON.stringify(node.exposedGAs)
        storage.writeFile(persistFile, snapshot ? serialize() : serialize)
      } catch (err) {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimateAutoResponder: unable to write peristent values to the file ' + persistFile + ' ' + err.message)
      }
    }

    node.loadExposedGAs = () => {
      const sFile = persistFile
      try {
        node.exposedGAs = JSON.parse(storage.readFile(sFile, 'utf8'))
      } catch (err) {
        node.exposedGAs = []
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn('knxUltimateAutoResponder: unable to read peristent file ' + sFile + ' ' + err.message)
      }
    }

    // Load persistent file
    try {
      node.loadExposedGAs()
      // Set all saved GAs to disabled. Will be enabled later (directive's list)
      node.exposedGAs.forEach(element => {
        element.enabled = false
      })
    } catch (error) {
    }

    // Add the ETS CSV file list to exposedGAs
    if (node.serverKNX.csv === undefined || node.serverKNX.csv === '' || node.serverKNX.csv.length === 0) {
      updateStatus({ fill: 'grey', shape: 'ring', text: 'No ETS file imported', payload: '', dpt: '', devicename: '' })
      // return;
    } else {
      node.serverKNX.csv.forEach(element => {
        const curGa = node.exposedGAs.find(a => a.address === element.ga)
        if (curGa === undefined) {
          node.exposedGAs.push({ address: element.ga, dpt: element.dpt, default: undefined, payload: undefined, enabled: false }) // "enabled" will be used to filter only the node.commandText directiver
        } else {
          curGa.enabled = false
        }
      })
      updateStatus({ fill: 'green', shape: 'ring', text: 'ETS file loaded', payload: '', dpt: '', devicename: '' })
    }

    // Fill the filter list
    try {
      node.commandText = JSON.parse(config.commandText)
    } catch (error) {
      updateStatus({ fill: 'red', shape: 'dot', text: 'JSON error: ' + error.message, payload: '', dpt: '', devicename: '' })
      if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: node.commandText = JSON.parse(config.commandText) ${error.stack}`)
      return
    }

    // Decode the commandText list be exploding the format 2/2/..
    node.commandText.forEach(element => {
      if (element.ga !== undefined && element.default !== undefined) {
        const defaultVal = element.default
        const dpt = element.dpt
        if (element.ga.includes('..')) {
          const start = Number(element.ga.substring(element.ga.lastIndexOf('/') + 1, element.ga.indexOf('..')))
          const end = Number(element.ga.substring(element.ga.indexOf('..') + 2))
          const twoLevel = element.ga.substring(0, element.ga.lastIndexOf('/') + 1)
          for (let index = start; index < end; index++) {
            const decAdd = twoLevel + index
            // Add also to the exposedGAs list, if not already present
            const curGa = node.exposedGAs.find(a => a.address === decAdd)
            if (curGa === undefined) {
              node.exposedGAs.push({ address: decAdd, dpt, default: defaultVal, payload: undefined, enabled: true })
            } else {
              if (dpt !== undefined) curGa.dpt = dpt // Take the Datapoint from the commandText directive, replacing from ETS CSV file, if exists.
              curGa.enabled = true
            }
          }
        } else {
          const curGa = node.exposedGAs.find(a => a.address === element.ga)
          if (curGa === undefined) {
            node.exposedGAs.push({ address: element.ga, dpt, default: defaultVal, payload: undefined, enabled: true })
          } else {
            if (dpt !== undefined) curGa.dpt = dpt // Take the Datapoint from the commandText directive, replacing from ETS CSV file, if exists.
            curGa.enabled = true
          }
        }
        updateStatus({ fill: 'green', shape: 'ring', text: 'JSON parsed: ' + node.commandText.length + ' directive(s).', payload: '', dpt: '', devicename: '' })
      } else {
        // Error
        updateStatus({ fill: 'red', shape: 'dot', text: 'JSON error: ga or default keys not set. Abort.', payload: '', dpt: '', devicename: '' })
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('knxUltimateAutoResponder: node.commandText.forEach(element.. JSON error: ga or default keys not set. Abort.')
      }
    })

    // Filter once after every directive has enabled its addresses. Filtering
    // inside the loop discards persisted payloads belonging to later entries;
    // skipping this step for [] leaves removed addresses able to respond.
    node.exposedGAs = node.exposedGAs.filter(ga => ga.enabled === true)
    node.saveExposedGAs()

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
      if (msg.knx !== undefined && msg.knx.event !== undefined && msg.knx.event !== 'GroupValue_Read') {
        // Save the value
        try {
          var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination)
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination) ${error.stack}`)
        }
        if (oGa !== undefined) {
          let decodedPayload
          try {
            // Don't care about the decoded payload, because knxUltimate-config could pass a TryToFindDatapoint from raw data
            // Take only RAW data and decode it with the dpt specified by the commandText directive
            decodedPayload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(oGa.dpt))
          } catch (error) {
            updateStatus({ fill: 'red', shape: 'dot', text: 'const decodedPayload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(oGa.dpt)); ' + error.message, payload: '', dpt: '', devicename: '' })
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: const decodedPayload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(oGa.dpt)); ${error.stack}`)
          }
          const changed = JSON.stringify(oGa.payload) !== JSON.stringify(decodedPayload)
          oGa.payload = decodedPayload
          if (changed) node.saveExposedGAs()
        }
      } else {
        try {
          let retVal
          const oFoundGA = node.exposedGAs.find(ga => ga.address === msg.knx.destination)
          if (oFoundGA === undefined) return
          if (oFoundGA.payload === undefined) {
            retVal = oFoundGA.default
          } else {
            retVal = oFoundGA.payload
          }
          if (retVal !== undefined) {
            const dDate = new Date()
            const ts = (node.serverKNX && typeof node.serverKNX.formatStatusTimestamp === 'function')
              ? node.serverKNX.formatStatusTimestamp(dDate)
              : `${dDate.getDate()}, ${dDate.toLocaleTimeString()}`
            if (oFoundGA.address !== undefined && oFoundGA.dpt !== undefined && retVal !== undefined) {
              node.serverKNX.sendKNXTelegramToKNXEngine({ grpaddr: oFoundGA.address, payload: retVal, dpt: oFoundGA.dpt, outputtype: 'response', nodecallerid: node.id })
              updateStatus({ fill: 'blue', shape: 'dot', text: 'Respond ' + oFoundGA.address + ' => ' + retVal + ' (' + ts + ')' })
            } else {
              updateStatus({ fill: 'yellow', shape: 'ring', text: 'Issue responding ' + oFoundGA.address + ' => ' + retVal + ' (' + ts + ')' })
            }
          }
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: after bFound ${error.stack}`)
        }
      }
    }

    node.on('input', function (msg) {

    })

    node.on('close', function (done) {
      node.saveExposedGAs(true)

      node.exposedGAs = []
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
  RED.nodes.registerType('knxUltimateAutoResponder', knxUltimateAutoResponder)
}
