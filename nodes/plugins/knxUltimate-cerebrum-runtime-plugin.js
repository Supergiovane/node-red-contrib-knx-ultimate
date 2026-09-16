const {
  getKnxAiHomeAutomationRegistry,
  normalizeKnxAiFlowSendEvent
} = require('../utils/knxAiCerebrum')

const HOOK_ID = 'onSend.knxUltimateCerebrum'
const PROVIDER_ID = 'knx-ultimate:cerebrum-runtime'
const ADAPTER_ID = 'node-red-flow'
const DUPLICATE_WINDOW_MS = 750
const MAX_EVENTS_PER_MINUTE = 240

module.exports = RED => {
  const listeners = new Set()
  const recentFingerprints = new Map()
  let eventWindowStartedAt = Date.now()
  let eventWindowCount = 0

  const provider = {
    id: PROVIDER_ID,
    adapterId: ADAPTER_ID,
    title: 'Node-RED flow observer',
    subscribe (listener) {
      if (typeof listener !== 'function') return () => {}
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }

  const refreshEventWindow = now => {
    if ((now - eventWindowStartedAt) >= 60 * 1000) {
      eventWindowStartedAt = now
      eventWindowCount = 0
      recentFingerprints.clear()
    }
  }

  const allowEvent = (event, now) => {
    refreshEventWindow(now)
    if (eventWindowCount >= MAX_EVENTS_PER_MINUTE) return false
    const fingerprint = `${event.resourceId}|${event.details && event.details.topic}|${event.state}`
    const previous = Number(recentFingerprints.get(fingerprint) || 0)
    if (previous > 0 && (now - previous) < DUPLICATE_WINDOW_MS) return false
    recentFingerprints.set(fingerprint, now)
    eventWindowCount += 1
    return true
  }

  const observeSendEvents = sendEvents => {
    const events = Array.isArray(sendEvents) ? sendEvents : [sendEvents]
    events.forEach(sendEvent => {
      try {
        const now = Date.now()
        refreshEventWindow(now)
        if (eventWindowCount >= MAX_EVENTS_PER_MINUTE) return
        const event = normalizeKnxAiFlowSendEvent(sendEvent, { at: new Date(now).toISOString() })
        if (!event || !allowEvent(event, now)) return
        listeners.forEach(listener => {
          try { listener(event) } catch (error) { /* observer listeners cannot interrupt the flow */ }
        })
      } catch (error) { /* observing must never alter Node-RED message delivery */ }
    })
  }

  RED.plugins.registerPlugin('knxUltimateCerebrumRuntime', {
    type: 'runtime',
    onadd () {
      const registry = getKnxAiHomeAutomationRegistry()
      registry.registerAdapter({
        id: ADAPTER_ID,
        title: 'Node-RED flow observer',
        capabilities: ['flow-events', 'hue-events', 'matter-events', 'home-assistant-events'],
        access: 'observe'
      })
      registry.registerProvider(provider)
      if (RED.hooks && typeof RED.hooks.remove === 'function') RED.hooks.remove(HOOK_ID)
      if (RED.hooks && typeof RED.hooks.add === 'function') RED.hooks.add(HOOK_ID, observeSendEvents)
    }
  })
}
