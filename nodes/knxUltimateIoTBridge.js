const loggerClass = require('./utils/sysLogger')

module.exports = function (RED) {
  function knxUltimateIoTBridge (config) {
    RED.nodes.createNode(this, config)
    const node = this

    node.serverKNX = RED.nodes.getNode(config.server) || undefined

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    if (!node.serverKNX) {
      pushStatus({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })
      return
    }

    node.name = config.name || 'KNX IoT Bridge'
    node.outputtopic = config.outputtopic || ''

    node.listenallga = true
    node.notifyreadrequest = true
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'

    node.emitOnChangeOnly = config.emitOnChangeOnly === true
    node.readOnDeploy = config.readOnDeploy === true
    node.acceptFlowInput = config.acceptFlowInput !== false // default true

    node.mappings = Array.isArray(config.mappings) ? config.mappings : []

    const safeNumber = (value, fallback = 0) => {
      if (value === null || value === undefined || value === '') return fallback
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : fallback
    }

    const sanitizeString = (value) => {
      if (typeof value === 'string') return value.trim()
      if (value === undefined || value === null) return ''
      return String(value).trim()
    }

    const normaliseDirection = (value) => {
      switch (value) {
        case 'knx-to-iot':
        case 'iot-to-knx':
        case 'bidirectional':
          return value
        default:
          return 'bidirectional'
      }
    }

    const normaliseType = (value) => {
      switch (value) {
        case 'mqtt':
        case 'rest':
        case 'modbus':
          return value
        default:
          return 'mqtt'
      }
    }

    const ensureId = (value) => {
      const id = sanitizeString(value)
      return id !== '' ? id : (RED.util && typeof RED.util.generateId === 'function' ? RED.util.generateId() : Math.random().toString(16).slice(2))
    }

    const cleanMapping = (raw) => {
      const mapping = { ...raw }
      mapping.id = ensureId(mapping.id)
      mapping.label = sanitizeString(mapping.label) || mapping.id
      mapping.ga = sanitizeString(mapping.ga)
      mapping.dpt = sanitizeString(mapping.dpt)
      mapping.direction = normaliseDirection(mapping.direction)
      mapping.iotType = normaliseType(mapping.iotType)
      mapping.target = sanitizeString(mapping.target)
      mapping.method = sanitizeString(mapping.method) || 'POST'
      mapping.modbusFunction = sanitizeString(mapping.modbusFunction) || 'writeHoldingRegister'
      mapping.scale = safeNumber(mapping.scale, 1)
      mapping.offset = safeNumber(mapping.offset, 0)
      mapping.template = sanitizeString(mapping.template)
      mapping.property = sanitizeString(mapping.property)
      mapping.enabled = mapping.enabled !== false
      mapping.timeout = safeNumber(mapping.timeout, 0)
      mapping.retry = safeNumber(mapping.retry, 0)
      return mapping
    }

    node.mappings = node.mappings.map(cleanMapping).filter((m) => m.ga !== '' && m.enabled)

    node.stateById = new Map()
    node.gaIndex = new Map()
    node.targetIndex = new Map()

    const registerMapping = (mapping) => {
      const existing = node.gaIndex.get(mapping.ga) || []
      existing.push(mapping)
      node.gaIndex.set(mapping.ga, existing)

      const key = mapping.iotType + '::' + (mapping.target || mapping.label)
      const targetList = node.targetIndex.get(key) || []
      targetList.push(mapping)
      node.targetIndex.set(key, targetList)
    }

    node.mappings.forEach(registerMapping)

    const buildStatusText = (baseText) => {
      const total = node.mappings.length
      return `${total} map(s) ${baseText || ''}`.trim()
    }

    const updateIdleStatus = () => {
      pushStatus({ fill: 'grey', shape: 'ring', text: buildStatusText('ready') })
    }

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { /* empty */ }

    node.setNodeStatus = ({ fill = 'grey', shape = 'ring', text = '', mapping, payload }) => {
      try {
        const extra = mapping ? ` ${mapping.ga}→${mapping.target || mapping.iotType}` : ''
        const valueStr = payload === undefined ? '' : ` ${JSON.stringify(payload)}`
        pushStatus({ fill, shape, text: buildStatusText(`${text}${extra}${valueStr}`) })
      } catch (error) {
        if (node.sysLogger) node.sysLogger.error(`Status update failed: ${error.message}`)
      }
    }

    const isBooleanDpt = (dpt) => typeof dpt === 'string' && dpt.startsWith('1.')

    const toBoolean = (value) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'number') return value !== 0
      if (typeof value === 'string') {
        const lowered = value.trim().toLowerCase()
        if (['true', '1', 'on', 'yes', 'open'].includes(lowered)) return true
        if (['false', '0', 'off', 'no', 'close', 'closed'].includes(lowered)) return false
      }
      if (value && typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'value')) return toBoolean(value.value)
        if (Object.prototype.hasOwnProperty.call(value, 'state')) return toBoolean(value.state)
      }
      return Boolean(value)
    }

    const applyScale = (value, mapping) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return (value * mapping.scale) + mapping.offset
      }
      return value
    }

    const revertScale = (value, mapping) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        const scaled = value - mapping.offset
        if (mapping.scale === 0) return scaled
        return scaled / mapping.scale
      }
      return value
    }

    const valuesAreEqual = (a, b) => {
      if (a === b) return true
      if (typeof a === 'number' && typeof b === 'number') {
        if (Number.isNaN(a) && Number.isNaN(b)) return true
        return a === b
      }
      if (typeof a === 'boolean' && typeof b === 'boolean') return a === b
      try {
        return JSON.stringify(a) === JSON.stringify(b)
      } catch (error) {
        return false
      }
    }

    const renderTemplate = (template, context) => {
      if (!template) return context.value
      return template
        .replace(/{{\s*value\s*}}/g, String(context.value))
        .replace(/{{\s*ga\s*}}/g, context.ga)
        .replace(/{{\s*target\s*}}/g, context.target)
        .replace(/{{\s*type\s*}}/g, context.type)
        .replace(/{{\s*label\s*}}/g, context.label)
        .replace(/{{\s*isoTimestamp\s*}}/g, new Date().toISOString())
    }

    const buildOutMessage = (mapping, value, meta) => {
      const context = {
        value,
        ga: mapping.ga,
        target: mapping.target,
        type: mapping.iotType,
        label: mapping.label,
        isoTimestamp: new Date().toISOString()
      }

      const payload = renderTemplate(mapping.template, context)
      const topic = mapping.iotType === 'mqtt'
        ? (mapping.target || node.outputtopic || mapping.ga)
        : (node.outputtopic || mapping.target || mapping.ga)

      const out = {
        topic,
        payload,
        bridge: {
          id: mapping.id,
          label: mapping.label,
          type: mapping.iotType,
          direction: 'knx-to-iot',
          target: mapping.target,
          method: mapping.method,
          modbusFunction: mapping.modbusFunction,
          property: mapping.property,
          timeout: mapping.timeout,
          retry: mapping.retry,
          scale: mapping.scale,
          offset: mapping.offset
        },
        knx: {
          ga: mapping.ga,
          dpt: mapping.dpt,
          event: meta.event,
          source: meta.source,
          ts: meta.ts,
          raw: meta.raw
        }
      }

      if (mapping.iotType === 'rest') {
        out.url = mapping.target || node.outputtopic || ''
        out.method = mapping.method || 'POST'
        if (mapping.property) out.property = mapping.property
        out.timeout = mapping.timeout
        out.retry = mapping.retry
        out.headers = meta.headers || {}
      }
      if (mapping.iotType === 'modbus') {
        out.modbusFunction = mapping.modbusFunction
        out.address = mapping.target
        if (mapping.property) out.property = mapping.property
        out.timeout = mapping.timeout
        out.retry = mapping.retry
      }
      if (mapping.iotType === 'mqtt' && mapping.property) {
        out.property = mapping.property
      }
      return out
    }

    const rememberKnxValue = (mapping, value) => {
      const current = node.stateById.get(mapping.id) || {}
      current.lastKnxValue = value
      current.updatedAt = Date.now()
      node.stateById.set(mapping.id, current)
    }

    const rememberIoTValue = (mapping, value) => {
      const current = node.stateById.get(mapping.id) || {}
      current.lastIoTValue = value
      current.updatedAt = Date.now()
      node.stateById.set(mapping.id, current)
    }

    const shouldEmitKnxValue = (mapping, value) => {
      if (!node.emitOnChangeOnly) return true
      const current = node.stateById.get(mapping.id)
      if (!current || current.lastKnxValue === undefined) return true
      return !valuesAreEqual(current.lastKnxValue, value)
    }

    const findMappingsByGA = (ga) => node.gaIndex.get(ga) || []

    const matchMappingForIoT = (msg) => {
      const bridge = msg.bridge || {}
      const type = bridge.type || (msg.iotType) || 'mqtt'
      const target = bridge.target || msg.topic || ''
      const id = bridge.id || bridge.mappingId

      if (id) {
        const mapping = node.mappings.find((m) => m.id === id)
        if (mapping) return mapping
      }

      const key = type + '::' + target
      const list = node.targetIndex.get(key)
      if (list && list.length > 0) return list[0]

      if (target && !target.includes('::')) {
        for (const m of node.mappings) {
          if (m.target === target) return m
        }
      }
      return null
    }

    const sendToKNX = (mapping, payload, meta = {}) => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          throw new Error('KNX gateway not available')
        }
        const telegram = {
          grpaddr: mapping.ga,
          payload,
          dpt: mapping.dpt || '',
          outputtype: meta.outputtype || 'write',
          nodecallerid: node.id
        }
        node.serverKNX.sendKNXTelegramToKNXEngine(telegram)
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`sendToKNX failed (${mapping.ga}): ${error.message}`)
        } else {
          RED.log.error(`knxUltimateIoTBridge sendToKNX failed (${mapping.ga}): ${error.message}`)
        }
        throw error
      }
    }

    const handleKnxTelegram = (msg) => {
      try {
        if (!msg) return
        const destination = msg.knx && msg.knx.destination ? msg.knx.destination : sanitizeString(msg.topic)
        if (!destination) return

        const meta = {
          event: msg.knx ? msg.knx.event : undefined,
          source: msg.knx ? msg.knx.source : undefined,
          ts: Date.now(),
          raw: msg.knx || {}
        }

        if (meta.event === 'GroupValue_Read') {
          // Skip read indications; we only emit when value is provided.
          return
        }

        const mappings = findMappingsByGA(destination)
        if (!mappings.length) return

        for (const mapping of mappings) {
          if (mapping.direction === 'iot-to-knx') continue
          let value = msg.payload
          if (isBooleanDpt(mapping.dpt)) {
            value = toBoolean(value)
          }
          if (typeof value === 'number') {
            value = applyScale(value, mapping)
          }
          if (!shouldEmitKnxValue(mapping, value)) continue

          const outMsg = buildOutMessage(mapping, value, meta)
          rememberKnxValue(mapping, value)
          node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'KNX→IoT', mapping, payload: value })
          node.send([outMsg, null])
        }
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`handleKnxTelegram error: ${error.message}`)
        } else {
          RED.log.error(`knxUltimateIoTBridge handleKnxTelegram error: ${error.message}`)
        }
      }
    }

    node.handleSend = handleKnxTelegram

    node.on('input', (msg, send, done) => {
      if (!node.acceptFlowInput) {
        if (done) done()
        return
      }
      const bridgeMapping = matchMappingForIoT(msg)
      if (!bridgeMapping) {
        node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'No mapping for input', payload: msg.topic })
        if (done) done()
        return
      }
      if (bridgeMapping.direction === 'knx-to-iot') {
        node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'Mapping is KNX→IoT only', mapping: bridgeMapping })
        if (done) done()
        return
      }

      let value = msg.payload
      if (isBooleanDpt(bridgeMapping.dpt)) {
        value = toBoolean(value)
      } else if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
        value = Number(value)
      }

      if (typeof value === 'number') {
        value = revertScale(value, bridgeMapping)
      }

      try {
        sendToKNX(bridgeMapping, value)
        rememberIoTValue(bridgeMapping, msg.payload)
        const ack = {
          topic: bridgeMapping.ga,
          payload: value,
          bridge: {
            id: bridgeMapping.id,
            label: bridgeMapping.label,
            type: bridgeMapping.iotType,
            direction: 'iot-to-knx',
            target: bridgeMapping.target,
            method: bridgeMapping.method,
            modbusFunction: bridgeMapping.modbusFunction,
            property: bridgeMapping.property,
            timeout: bridgeMapping.timeout,
            retry: bridgeMapping.retry
          }
        }
        if (bridgeMapping.iotType === 'rest') {
          ack.url = bridgeMapping.target || ''
          ack.method = bridgeMapping.method || 'POST'
        }
        if (bridgeMapping.iotType === 'modbus') {
          ack.address = bridgeMapping.target
          ack.modbusFunction = bridgeMapping.modbusFunction
        }
        node.setNodeStatus({ fill: 'blue', shape: 'dot', text: 'IoT→KNX', mapping: bridgeMapping, payload: msg.payload })
        if (send) send([null, ack]); else node.send([null, ack])
        if (done) done()
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message, mapping: bridgeMapping })
        if (done) done(error)
      }
    })

    node.on('close', (done) => {
      if (node.serverKNX && typeof node.serverKNX.removeClient === 'function') {
        try {
          node.serverKNX.removeClient(node)
        } catch (error) {
          /* empty */
        }
      }
      if (done) done()
    })

    const registerClient = () => {
      if (node.serverKNX) {
        try {
          if (typeof node.serverKNX.removeClient === 'function') {
            node.serverKNX.removeClient(node)
          }
          if (typeof node.serverKNX.addClient === 'function') {
            node.serverKNX.addClient(node)
          }
        } catch (error) {
          if (node.sysLogger) node.sysLogger.error(`registerClient failed: ${error.message}`)
        }
      }
    }

    const issueInitialReads = () => {
      if (!node.readOnDeploy) return
      if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') return
      for (const mapping of node.mappings) {
        if (mapping.direction === 'iot-to-knx') continue
        if (!mapping.ga) continue
        try {
          node.serverKNX.sendKNXTelegramToKNXEngine({
            grpaddr: mapping.ga,
            payload: '',
            dpt: '',
            outputtype: 'read',
            nodecallerid: node.id
          })
        } catch (error) {
          if (node.sysLogger) node.sysLogger.error(`Initial read failed (${mapping.ga}): ${error.message}`)
        }
      }
    }

    registerClient()
    updateIdleStatus()
    issueInitialReads()
  }

  RED.nodes.registerType('knxUltimateIoTBridge', knxUltimateIoTBridge)
}
