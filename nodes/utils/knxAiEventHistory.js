const KNX_AI_ADAPTER_HISTORY_MIN_HOURS = 24
const KNX_AI_HISTORY_DETAILS_MAX_CHARS = 12000

const clampText = (value, maxChars = 500) => String(value === undefined || value === null ? '' : value)
  .trim()
  .slice(0, Math.max(0, Number(maxChars) || 0))

const normalizeSearchText = value => clampText(value, 4000)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9./_-]+/g, ' ')
  .trim()

const parseTimestamp = (value, fallback = Date.now()) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value > 100000000000 ? value : value * 1000
  const parsed = new Date(String(value || '')).getTime()
  return Number.isFinite(parsed) ? parsed : fallback
}

const sanitizeHistoryValue = (value, depth = 0, seen = new Set()) => {
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return clampText(value, 1000)
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (typeof value === 'bigint') return String(value)
  if (Buffer.isBuffer(value)) return `[binary ${value.length} bytes]`
  if (typeof value !== 'object') return clampText(value, 1000)
  if (depth >= 3 || seen.has(value)) return '[nested]'
  seen.add(value)
  if (Array.isArray(value)) {
    const out = value.slice(0, 30).map(item => sanitizeHistoryValue(item, depth + 1, seen))
    seen.delete(value)
    return out
  }
  const out = {}
  Object.keys(value).slice(0, 60).forEach(key => {
    const normalizedKey = clampText(key, 120)
    if (!normalizedKey || /^(data|image|snapshot|buffer|base64)$/i.test(normalizedKey)) return
    out[normalizedKey] = sanitizeHistoryValue(value[key], depth + 1, seen)
  })
  seen.delete(value)
  return out
}

const normalizeKnxAiAdapterHistoryEvent = ({ event, adapter, provider, nowTs = Date.now() } = {}) => {
  const source = event && typeof event === 'object' && !Array.isArray(event) ? event : {}
  const adapterSource = adapter && typeof adapter === 'object' ? adapter : {}
  const providerSource = provider && typeof provider === 'object' ? provider : {}
  const ts = parseTimestamp(source.ts || source.timestamp || source.at || source.start || source.date, nowTs)
  const eventType = clampText(source.eventType || source.type || source.event || source.kind, 120)
  if (!eventType) return null
  const cameraId = clampText(source.cameraId || source.resourceId || source.deviceId, 200)
  const cameraName = clampText(source.cameraName || source.resourceName || source.deviceName, 300)
  const details = sanitizeHistoryValue(source.raw || source.details || source.metadata || {})
  let detailsText = ''
  try { detailsText = JSON.stringify(details) } catch (error) { detailsText = '' }
  return {
    ts,
    at: new Date(ts).toISOString(),
    adapterId: clampText(source.adapterId || providerSource.adapterId || adapterSource.id, 160),
    adapterTitle: clampText(source.adapterTitle || adapterSource.title || adapterSource.name, 240),
    providerId: clampText(source.providerId || providerSource.id, 220),
    providerTitle: clampText(source.providerTitle || providerSource.title || providerSource.name, 240),
    controllerId: clampText(source.controllerId || providerSource.controllerId, 180),
    controllerName: clampText(source.controllerName || providerSource.controllerName, 240),
    resourceType: clampText(source.resourceType || (cameraId || cameraName ? 'camera' : 'adapter'), 80),
    resourceId: cameraId,
    resourceName: cameraName,
    eventType,
    eventId: clampText(source.eventId || source.id, 200),
    active: source.active !== false,
    scopeId: clampText(source.scopeId, 180),
    scopeName: clampText(source.scopeName, 240),
    objectTypes: Array.from(new Set((Array.isArray(source.objectTypes) ? source.objectTypes : [])
      .map(value => clampText(value, 100))
      .filter(Boolean))).slice(0, 24),
    details: detailsText.length <= KNX_AI_HISTORY_DETAILS_MAX_CHARS ? details : { truncated: true }
  }
}

const HISTORY_STOP_WORDS = new Set([
  'a', 'al', 'alla', 'alle', 'anche', 'and', 'auf', 'aux', 'avec', 'che', 'con', 'da', 'dal', 'dalla', 'das', 'de', 'dei', 'del', 'della', 'des', 'di', 'die', 'do', 'du', 'e', 'el', 'en', 'et', 'for', 'gli', 'ha', 'hanno', 'i', 'il', 'in', 'is', 'la', 'le', 'les', 'lo', 'mit', 'nel', 'nella', 'of', 'on', 'or', 'per', 'pour', 'que', 'qui', 'se', 'sono', 'su', 'the', 'to', 'tra', 'un', 'una', 'und', 'was', 'what', 'with', 'zu'
])

const historyQuestionTokens = question => Array.from(new Set(normalizeSearchText(question)
  .split(/\s+/)
  .filter(token => token.length >= 2 && !HISTORY_STOP_WORDS.has(token) && !/^\d{1,4}$/.test(token))))
  .slice(0, 24)

const incrementCount = (map, key) => {
  const normalized = clampText(key, 500) || '(unknown)'
  map.set(normalized, Number(map.get(normalized) || 0) + 1)
}

const topCounts = (map, limit) => Array.from(map.entries())
  .map(([key, count]) => ({ key, count }))
  .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key))
  .slice(0, Math.max(1, Number(limit) || 1))

const buildEventSearchText = (event, kind) => {
  if (kind === 'knx') {
    return normalizeSearchText([
      event.event,
      event.source,
      event.destination,
      event.devicename,
      event.dpt,
      event.payloadmeasureunit,
      typeof event.payload === 'object' ? JSON.stringify(event.payload) : event.payload
    ].join(' '))
  }
  return normalizeSearchText([
    event.adapterId,
    event.adapterTitle,
    event.providerId,
    event.providerTitle,
    event.controllerId,
    event.controllerName,
    event.resourceType,
    event.resourceId,
    event.resourceName,
    event.eventType,
    event.scopeId,
    event.scopeName,
    ...(Array.isArray(event.objectTypes) ? event.objectTypes : []),
    event.details && typeof event.details === 'object' ? JSON.stringify(event.details) : ''
  ].join(' '))
}

const buildKnxAiHistoryEventKey = (event, kind = 'adapter') => {
  if (!event || typeof event !== 'object') return ''
  if (kind === 'knx') {
    let payload = ''
    try { payload = typeof event.payload === 'object' ? JSON.stringify(event.payload) : String(event.payload) } catch (error) { payload = '' }
    return [Number(event.ts || 0), event.event, event.source, event.destination, payload, event.rawHex].join('|')
  }
  return [Number(event.ts || 0), event.adapterId, event.providerId, event.resourceId, event.eventType, event.eventId, event.scopeId, (event.objectTypes || []).join(',')].join('|')
}

const createKnxAiHistoryAccumulator = ({ kind = 'adapter', question = '', limit = 120 } = {}) => {
  const normalizedKind = kind === 'knx' ? 'knx' : 'adapter'
  const maxItems = Math.max(1, Number(limit) || 120)
  const tokens = historyQuestionTokens(question)
  const recent = []
  const relevant = []
  const counts = {
    byEvent: new Map(),
    bySource: new Map(),
    byResource: new Map(),
    byObjectType: new Map(),
    byCombination: new Map()
  }
  let total = 0
  let active = 0
  let firstTs = 0
  let lastTs = 0

  const add = event => {
    if (!event || typeof event !== 'object') return
    const ts = Number(event.ts || new Date(event.at || '').getTime() || 0)
    if (!Number.isFinite(ts) || ts <= 0) return
    total += 1
    if (event.active !== false) active += 1
    firstTs = firstTs > 0 ? Math.min(firstTs, ts) : ts
    lastTs = Math.max(lastTs, ts)
    const eventName = normalizedKind === 'knx' ? event.event : event.eventType
    const sourceName = normalizedKind === 'knx'
      ? event.source
      : (event.adapterTitle || event.adapterId || event.providerTitle || event.providerId)
    const resourceName = normalizedKind === 'knx'
      ? `${event.destination || '?'}${event.devicename ? ` (${event.devicename})` : ''}`
      : (event.resourceName || event.resourceId || event.controllerName || event.controllerId)
    incrementCount(counts.byEvent, eventName)
    incrementCount(counts.bySource, sourceName)
    incrementCount(counts.byResource, resourceName)
    ;(Array.isArray(event.objectTypes) ? event.objectTypes : []).forEach(value => incrementCount(counts.byObjectType, value))
    const combination = normalizedKind === 'knx'
      ? `${resourceName || '?'} | ${eventName || '?'} | ${clampText(typeof event.payload === 'object' ? JSON.stringify(event.payload) : event.payload, 160)}`
      : `${resourceName || '?'} | ${eventName || '?'}${event.scopeName ? ` | ${event.scopeName}` : ''}${event.objectTypes && event.objectTypes.length ? ` | ${event.objectTypes.join(',')}` : ''}`
    incrementCount(counts.byCombination, combination)

    recent.push(event)
    if (recent.length > maxItems) recent.shift()
    if (tokens.length) {
      const haystack = buildEventSearchText(event, normalizedKind)
      let score = 0
      tokens.forEach(token => { if (haystack.includes(token)) score += token.length + 2 })
      if (score > 0) {
        relevant.push({ event, score, ts })
        if (relevant.length > maxItems * 4) {
          relevant.sort((left, right) => right.score - left.score || right.ts - left.ts)
          relevant.length = maxItems * 2
        }
      }
    }
  }

  const finish = () => {
    let events = recent
    if (relevant.length) {
      const selected = relevant
        .sort((left, right) => right.score - left.score || right.ts - left.ts)
        .slice(0, maxItems)
        .map(item => item.event)
      events = selected.sort((left, right) => Number(left.ts || 0) - Number(right.ts || 0))
    }
    return {
      events,
      summary: {
        kind: normalizedKind,
        totalEvents: total,
        activeEvents: active,
        inactiveEvents: total - active,
        firstAt: firstTs ? new Date(firstTs).toISOString() : '',
        lastAt: lastTs ? new Date(lastTs).toISOString() : '',
        selection: relevant.length ? 'question-relevant' : 'most-recent',
        selectedEvents: events.length,
        byEvent: topCounts(counts.byEvent, 20),
        bySource: topCounts(counts.bySource, 12),
        byResource: topCounts(counts.byResource, 30),
        byObjectType: topCounts(counts.byObjectType, 20),
        byCombination: topCounts(counts.byCombination, 40)
      }
    }
  }

  return { add, finish }
}

const formatKnxAiAdapterHistoryEventForPrompt = event => {
  if (!event || typeof event !== 'object') return ''
  const resource = event.resourceName || event.resourceId || event.controllerName || event.controllerId || '?'
  const scope = event.scopeName || event.scopeId
  const objects = Array.isArray(event.objectTypes) && event.objectTypes.length ? event.objectTypes.join(',') : ''
  return `${event.at || new Date(event.ts || Date.now()).toISOString()} | adapter ${event.adapterTitle || event.adapterId || '?'} | ${event.resourceType || 'resource'} ${resource} | ${event.eventType || '?'} | ${event.active === false ? 'inactive' : 'active'}${scope ? ` | scope ${scope}` : ''}${objects ? ` | objects ${objects}` : ''}`
}

module.exports = {
  KNX_AI_ADAPTER_HISTORY_MIN_HOURS,
  KNX_AI_HISTORY_DETAILS_MAX_CHARS,
  buildKnxAiHistoryEventKey,
  createKnxAiHistoryAccumulator,
  formatKnxAiAdapterHistoryEventForPrompt,
  normalizeKnxAiAdapterHistoryEvent,
  sanitizeHistoryValue
}
