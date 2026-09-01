const {
  getKnxAiHomeAutomationRegistry,
  normalizeKnxAiHomeAutomationEvent
} = require('./utils/knxAiCerebrum')

const HOME_ASSISTANT_ADAPTER_ID = 'home-assistant'
const DEFAULT_REQUEST_TIMEOUT_MS = 15000

module.exports = function (RED) {
  function knxUltimateAIHomeAssistant (config) {
    RED.nodes.createNode(this, config)
    const node = this
    const registry = getKnxAiHomeAutomationRegistry()
    const requestTimeoutMs = Math.max(3000, Math.min(60000, Number(config.requestTimeoutMs) || DEFAULT_REQUEST_TIMEOUT_MS))
    const pendingRequests = new Map()
    const listeners = new Set()
    let requestSequence = 0
    let closing = false

    node.name = config.name || 'Cerebrum Home Assistant'

    const updateStatus = ({ fill = 'grey', shape = 'ring', text = '' } = {}) => {
      try { node.status({ fill, shape, text }) } catch (error) { /* ignore */ }
    }

    const notifyEvent = event => {
      listeners.forEach(listener => {
        try { listener(event) } catch (error) { /* ignore */ }
      })
    }

    const sendApiRequest = data => new Promise((resolve, reject) => {
      if (closing) return reject(new Error('Cerebrum Home Assistant is closing'))
      requestSequence += 1
      const requestId = `${node.id}:${Date.now()}:${requestSequence}`
      const timer = setTimeout(() => {
        pendingRequests.delete(requestId)
        updateStatus({ fill: 'yellow', shape: 'ring', text: 'ha-api timeout' })
        reject(new Error('Home Assistant ha-api request timed out; verify the round-trip wiring'))
      }, requestTimeoutMs)
      pendingRequests.set(requestId, { resolve, reject, timer })
      node.send({
        payload: {
          protocol: 'websocket',
          data,
          location: 'payload',
          locationType: 'msg'
        },
        knxAiCerebrum: {
          requestId,
          adapterId: HOME_ASSISTANT_ADAPTER_ID,
          providerId: node.id,
          direction: 'request'
        }
      })
      updateStatus({ fill: 'blue', shape: 'dot', text: 'querying ha-api' })
    })

    const provider = {
      id: node.id,
      adapterId: HOME_ASSISTANT_ADAPTER_ID,
      title: node.name,
      capabilities: ['entities', 'events', 'services', 'states'],
      listEntities: () => sendApiRequest({ type: 'get_states' }).then(result => Array.isArray(result) ? result : []),
      getEntity: entityId => sendApiRequest({ type: 'get_states' }).then(result => {
        const requested = String(entityId || '').trim().toLowerCase()
        return (Array.isArray(result) ? result : []).find(entity => String(entity && entity.entity_id || '').trim().toLowerCase() === requested) || null
      }),
      listServices: () => sendApiRequest({ type: 'get_services' }),
      callService: ({ domain, service, serviceData, target, authorization } = {}) => {
        const safeDomain = String(domain || '').trim()
        const safeService = String(service || '').trim()
        if (!safeDomain || !safeService) return Promise.reject(new Error('Home Assistant domain and service are required'))
        if (!authorization || authorization.confirmed !== true || authorization.source !== 'knxUltimateAI') {
          return Promise.reject(new Error('Home Assistant service calls require an explicit KNX AI confirmation authorization'))
        }
        return sendApiRequest({
          type: 'call_service',
          domain: safeDomain,
          service: safeService,
          service_data: serviceData && typeof serviceData === 'object' ? serviceData : {},
          target: target && typeof target === 'object' ? target : {}
        })
      },
      subscribe: listener => {
        if (typeof listener !== 'function') return () => {}
        listeners.add(listener)
        return () => listeners.delete(listener)
      }
    }

    registry.registerAdapter({
      id: HOME_ASSISTANT_ADAPTER_ID,
      title: 'Home Assistant',
      packageName: 'node-red-contrib-home-assistant-websocket',
      capabilities: provider.capabilities
    })
    registry.registerProvider(provider)

    node.on('input', function (msg, send, done) {
      try {
        const metadata = msg && msg.knxAiCerebrum && typeof msg.knxAiCerebrum === 'object' ? msg.knxAiCerebrum : {}
        const requestId = String(metadata.requestId || '')
        const pending = requestId ? pendingRequests.get(requestId) : null
        if (pending) {
          clearTimeout(pending.timer)
          pendingRequests.delete(requestId)
          if (msg && msg.error) pending.reject(new Error(String(msg.error.message || msg.error)))
          else pending.resolve(msg ? msg.payload : undefined)
          updateStatus({ fill: 'green', shape: 'dot', text: 'ha-api ready' })
          if (typeof done === 'function') done()
          return
        }

        const event = normalizeKnxAiHomeAutomationEvent(msg, {
          adapterId: HOME_ASSISTANT_ADAPTER_ID,
          providerId: node.id
        })
        if (event) {
          notifyEvent(event)
          updateStatus({ fill: 'green', shape: 'dot', text: event.entityId || event.eventType })
        }
        if (typeof done === 'function') done()
      } catch (error) {
        updateStatus({ fill: 'red', shape: 'dot', text: error.message || String(error) })
        if (typeof done === 'function') done(error)
        else node.error(error, msg)
      }
    })

    node.on('close', function (done) {
      closing = true
      registry.unregisterProvider(node.id)
      pendingRequests.forEach(pending => {
        clearTimeout(pending.timer)
        pending.reject(new Error('Cerebrum Home Assistant node closed'))
      })
      pendingRequests.clear()
      listeners.clear()
      if (typeof done === 'function') done()
    })

    updateStatus({ fill: 'yellow', shape: 'ring', text: 'wire output → ha-api → input' })
  }

  RED.nodes.registerType('knxUltimateAIHomeAssistant', knxUltimateAIHomeAssistant)
}

module.exports.__test = {
  DEFAULT_REQUEST_TIMEOUT_MS,
  HOME_ASSISTANT_ADAPTER_ID
}
