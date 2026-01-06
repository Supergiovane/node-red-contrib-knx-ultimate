module.exports = function (RED) {
  function knxUltimateHueCameraMotion (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.serverHue = RED.nodes.getNode(config.serverHue) || undefined
    node.topic = node.name
    node.name = config.name === undefined ? 'Hue' : config.name
    node.dpt = ''
    node.notifyreadrequest = true
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = false
    node.notifywrite = true
    node.initialread = true
    node.listenallga = true // Don't remove
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.currentPayload = ''
    node.passthrough = 'no'
    node.formatmultiplyvalue = 1
    node.formatnegativevalue = 'leave'
    node.formatdecimalsvalue = 2
    node.hueDevice = config.hueDevice
    node.dptCameraMotion = config.dptCameraMotion
    node.motionDPT = (config.dptCameraMotion && config.dptCameraMotion !== '') ? config.dptCameraMotion : '1.001'
    node.initializingAtStart = (config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes')
    node.currentDeviceValue = false
    node.enableNodePINS = (config.enableNodePINS === undefined || config.enableNodePINS === 'yes')
    node.outputs = node.enableNodePINS ? 1 : 0

    if (!node.serverKNX && node.enableNodePINS !== 'yes') {
      node.enableNodePINS = 'yes'
      node.outputs = 1
    }

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

    const formatTs = (date) => {
      const d = date instanceof Date ? date : new Date(date)
      const provider = node.serverKNX
      if (provider && typeof provider.formatStatusTimestamp === 'function') return provider.formatStatusTimestamp(d)
      return `${d.getDate()}, ${d.toLocaleTimeString()}`
    }

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          const now = new Date()
          updateStatus({ fill: 'red', shape: 'dot', text: `KNX server missing (${context}) (${formatTs(now)})` })
          return
        }
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id })
      } catch (error) {
        updateStatus({ fill: 'red', shape: 'dot', text: `KNX send error ${error.message}` })
      }
    }

    node.setNodeStatus = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sKNXNodeStatusText = `|KNX: ${text} ${payload} (${formatTs(dDate)})`
        pushStatus({ fill, shape, text: (node.sHUENodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = ''
        const dDate = new Date()
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
        node.sHUENodeStatusText = `|HUE: ${text} ${payload} (${formatTs(dDate)})`
        pushStatus({ fill, shape, text: node.sHUENodeStatusText + ' ' + (node.sKNXNodeStatusText || '') })
      } catch (error) { /* empty */ }
    }

    const mapMotionValue = (_event) => {
      const motion = _event?.motion
      if (!motion) return undefined

      const readBoolean = (candidate) => {
        if (typeof candidate === 'boolean') return candidate
        if (candidate && typeof candidate.value === 'boolean') return candidate.value
        return undefined
      }

      let value = readBoolean(motion.motion)
      if (value === undefined && motion.motion_report) {
        value = readBoolean(motion.motion_report.motion)
      }
      if (value === undefined && motion.motion_report && typeof motion.motion_report.motion === 'boolean') {
        value = motion.motion_report.motion
      }
      if (value === undefined && typeof motion.motion_valid === 'boolean') {
        value = motion.motion_valid
      }
      if (value === undefined) {
        value = readBoolean(motion.motion_valid)
      }
      return value
    }

    node.handleSend = (msg) => {
      if (!msg || !msg.knx) return
      if (msg.knx.event === 'GroupValue_Read') {
        switch (msg.knx.destination) {
          case config.GAcameraMotion:
            node.sendResponseToKNX(node.currentDeviceValue)
            break
          default:
            break
        }
      }
    }

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id !== config.hueDevice) return
        const motionValue = mapMotionValue(_event)
        if (motionValue === undefined) return

        const knxMsgPayload = {
          topic: config.GAcameraMotion,
          dpt: node.motionDPT,
          payload: motionValue === true || motionValue === 1 || motionValue === '1' ? true : Boolean(motionValue),
          name: node.name,
          event: 'motion',
          rawEvent: _event
        }

        if (knxMsgPayload.topic) {
          safeSendToKNX({
            grpaddr: knxMsgPayload.topic,
            payload: knxMsgPayload.payload,
            dpt: knxMsgPayload.dpt,
            outputtype: 'write'
          }, 'write')
        }
        node.currentDeviceValue = knxMsgPayload.payload

        updateStatus({
          fill: 'green',
          shape: 'dot',
          text: `HUE->KNX ${knxMsgPayload.payload} (${formatTs(new Date())})`
        })

        if (node.enableNodePINS) {
          node.send(knxMsgPayload)
        }
        node.setNodeStatusHue({
          fill: 'blue',
          shape: 'ring',
          text: 'HUE->KNX',
          payload: knxMsgPayload.payload
        })
      } catch (error) {
        updateStatus({
          fill: 'red',
          shape: 'dot',
          text: `HUE->KNX error ${error.message} (${formatTs(new Date())})`
        })
      }
    }

    node.sendResponseToKNX = (_level) => {
      if (!node.serverKNX) return
      const knxMsgPayload = {
        topic: config.GAcameraMotion,
        dpt: node.motionDPT,
        payload: !!(_level === true || _level === 1 || _level === '1')
      }
      if (knxMsgPayload.topic) {
        safeSendToKNX({
          grpaddr: knxMsgPayload.topic,
          payload: knxMsgPayload.payload,
          dpt: knxMsgPayload.dpt,
          outputtype: 'response'
        }, 'response')
      }
    }

    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }
    if (node.serverHue) {
      node.serverHue.removeClient(node)
      node.serverHue.addClient(node)
    }

    node.on('close', (done) => {
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      if (node.serverHue) {
        node.serverHue.removeClient(node)
      }
      done()
    })
  }
  RED.nodes.registerType('knxUltimateHueCameraMotion', knxUltimateHueCameraMotion)
}
