const KNX_AI_CAMERA_REGISTRY_KEY = Symbol.for('node-red.knx-ai.camera-adapters.v1')
const KNX_AI_CAMERA_IMAGE_MAX_BYTES = 6 * 1024 * 1024
const KNX_AI_CAMERA_MAX_ACTIONS = 8

const clampText = (value, maxChars = 240) => String(value === undefined || value === null ? '' : value)
  .trim()
  .slice(0, Math.max(0, Number(maxChars) || 0))

const normalizeSearchText = value => clampText(value, 300)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

const uniqueTexts = values => Array.from(new Set((Array.isArray(values) ? values : [])
  .map(value => clampText(value, 240))
  .filter(Boolean)))

// Runtime contract for optional camera suites. A package registers one adapter
// manifest and one provider per configured controller. Providers expose:
//   listCameras({ force }) -> camera[]
//   takeSnapshot({ cameraId, cameraName, highQuality }) -> { data, mediaType, camera }
//   subscribe(listener) -> unsubscribe(), with normalized camera event objects.
// The global Symbol lets separately installed Node-RED packages share the same
// in-process registry without either package importing the other one.
const getKnxAiCameraAdapterRegistry = () => {
  const existing = globalThis[KNX_AI_CAMERA_REGISTRY_KEY]
  if (existing && existing.version === 1 && existing.adapters instanceof Map && existing.providers instanceof Map) return existing
  const registry = {
    version: 1,
    adapters: new Map(),
    providers: new Map(),
    listeners: new Set(),
    registerAdapter (adapter) {
      if (!adapter || !adapter.id) return
      this.adapters.set(String(adapter.id), Object.freeze(Object.assign({}, adapter)))
      this.listeners.forEach(listener => {
        try { listener({ type: 'adapter_registered', adapter: this.adapters.get(String(adapter.id)) }) } catch (error) { /* ignore */ }
      })
    },
    registerProvider (provider) {
      if (!provider || !provider.id) return
      this.providers.set(String(provider.id), provider)
      this.listeners.forEach(listener => {
        try { listener({ type: 'provider_registered', provider }) } catch (error) { /* ignore */ }
      })
    },
    unregisterProvider (providerId) {
      const id = String(providerId || '')
      const provider = this.providers.get(id)
      if (!provider) return
      this.providers.delete(id)
      this.listeners.forEach(listener => {
        try { listener({ type: 'provider_unregistered', provider }) } catch (error) { /* ignore */ }
      })
    },
    subscribe (listener) {
      if (typeof listener !== 'function') return () => {}
      this.listeners.add(listener)
      return () => this.listeners.delete(listener)
    }
  }
  globalThis[KNX_AI_CAMERA_REGISTRY_KEY] = registry
  return registry
}

const normalizeKnxAiCameraRegistration = (value = {}) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const id = clampText(source.cameraId || source.id, 160)
  const name = clampText(source.cameraName || source.name || id, 240)
  const state = clampText(source.state, 80).toUpperCase()
  const online = typeof source.online === 'boolean'
    ? source.online
    : state
      ? ['CONNECTED', 'ONLINE'].includes(state)
      : null
  if (!id && !name) return null
  return {
    id,
    name,
    aliases: uniqueTexts([name, id].concat(Array.isArray(source.aliases) ? source.aliases : [])),
    source: clampText(source.source || 'camera-adapter', 80),
    adapterId: clampText(source.adapterId, 120),
    adapterTitle: clampText(source.adapterTitle, 240),
    providerId: clampText(source.providerId, 200),
    controllerId: clampText(source.controllerId, 160),
    controllerName: clampText(source.controllerName, 240),
    nativeCameraId: clampText(source.nativeCameraId, 160),
    state,
    online,
    objectTypes: uniqueTexts(source.objectTypes).map(normalizeCameraObjectType).filter(Boolean).slice(0, 24),
    lines: (Array.isArray(source.lines) ? source.lines : []).slice(0, 80),
    zones: (Array.isArray(source.zones) ? source.zones : []).slice(0, 80),
    lastSeenAt: clampText(source.lastSeenAt || new Date().toISOString(), 64)
  }
}

const resolveKnxAiCamera = ({ target, cameras } = {}) => {
  const requested = normalizeSearchText(target)
  const list = (Array.isArray(cameras) ? cameras : [])
    .map(normalizeKnxAiCameraRegistration)
    .filter(Boolean)
  if (!requested) return { camera: null, ambiguous: false }

  const exact = list.filter(camera => [camera.id, camera.name].concat(camera.aliases)
    .some(alias => normalizeSearchText(alias) === requested))
  if (exact.length === 1) return { camera: exact[0], ambiguous: false }
  if (exact.length > 1) return { camera: null, ambiguous: true }

  const partial = list.filter(camera => [camera.id, camera.name].concat(camera.aliases)
    .some(alias => {
      const normalizedAlias = normalizeSearchText(alias)
      return normalizedAlias && (normalizedAlias.includes(requested) || requested.includes(normalizedAlias))
    }))
  if (partial.length === 1) return { camera: partial[0], ambiguous: false }
  return { camera: null, ambiguous: partial.length > 1 }
}

const normalizeCameraEventType = value => {
  const raw = normalizeSearchText(value).replace(/\s+/g, '')
  if (['smartdetect', 'objectdetect', 'objectdetection', 'smartdetection'].includes(raw)) return 'smartDetect'
  if (['smartdetectline', 'line', 'linecrossing', 'crossline'].includes(raw)) return 'smartDetectLine'
  if (['smartdetectzone', 'zone', 'intrusionzone', 'intrusion'].includes(raw)) return 'smartDetectZone'
  if (['smartdetectloiterzone', 'loiter', 'loiterzone'].includes(raw)) return 'smartDetectLoiterZone'
  if (['motion', 'movement'].includes(raw)) return 'motion'
  if (['ring', 'doorbell'].includes(raw)) return 'ring'
  if (['smartaudiodetect', 'audio'].includes(raw)) return 'smartAudioDetect'
  return clampText(value, 80)
}

const normalizeCameraObjectType = value => {
  const raw = normalizeSearchText(value).replace(/\s+/g, '')
  if (['person', 'people', 'persona', 'persone', 'human', 'someone', 'qualcuno'].includes(raw)) return 'person'
  if (['animal', 'animale', 'animali', 'pet', 'pets', 'dog', 'cat', 'cane', 'gatto'].includes(raw)) return 'animal'
  if (['vehicle', 'vehicles', 'veicolo', 'veicoli', 'car', 'auto', 'automobile'].includes(raw)) return 'vehicle'
  if (['face', 'volto', 'faccia'].includes(raw)) return 'face'
  if (['licenseplate', 'numberplate', 'targa'].includes(raw)) return 'licenseplate'
  if (['package', 'parcel', 'pacco'].includes(raw)) return 'package'
  return normalizeSearchText(value).replace(/\s+/g, '')
}

const normalizeCameraActionType = value => {
  const raw = normalizeSearchText(value).replace(/\s+/g, '_')
  if (['snapshot', 'get_snapshot', 'send_snapshot', 'camera_snapshot'].includes(raw)) return 'snapshot'
  if (['analyze', 'analyse', 'analyze_snapshot', 'describe_snapshot', 'vision'].includes(raw)) return 'analyze'
  if (['watch', 'subscribe', 'notify', 'create_watch'].includes(raw)) return 'watch'
  if (['unwatch', 'unsubscribe', 'stop', 'remove_watch', 'delete_watch'].includes(raw)) return 'unwatch'
  if (['list', 'list_watches', 'show_watches'].includes(raw)) return 'list_watches'
  return ''
}

const normalizeKnxAiCameraAction = (value, cameras = []) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const type = normalizeCameraActionType(value.type || value.action || value.operation)
  if (!type) return null
  const target = clampText(value.cameraId || value.cameraName || value.camera || value.target, 240)
  const resolved = resolveKnxAiCamera({ target, cameras })
  const camera = resolved.camera
  let eventType = normalizeCameraEventType(value.eventType || value.event)
  const requestedScope = clampText(value.scopeId || value.scopeName || value.zoneId || value.lineId || value.zone || value.line, 240)
  const availableScopes = camera
    ? eventType === 'smartDetectLine'
      ? camera.lines
      : ['smartDetectZone', 'smartDetectLoiterZone'].includes(eventType)
        ? camera.zones
        : []
    : []
  const normalizedScopeTarget = normalizeSearchText(requestedScope)
  const matchingScopes = normalizedScopeTarget
    ? (Array.isArray(availableScopes) ? availableScopes : []).filter(scope => [scope && scope.id, scope && scope.name]
        .some(candidate => normalizeSearchText(candidate) === normalizedScopeTarget))
    : []
  const resolvedScope = matchingScopes.length === 1 ? matchingScopes[0] : null
  const objectTypes = uniqueTexts(Array.isArray(value.objectTypes)
    ? value.objectTypes
    : [value.objectType || value.smartDetectType]).map(normalizeCameraObjectType).filter(Boolean).slice(0, 12)
  // A plain motion event has no classified object metadata. Convert requests
  // such as "motion caused by a person/animal" to the generic smart-detection
  // family so they can match Protect zone, line, or loiter detections.
  if (type === 'watch' && eventType === 'motion' && objectTypes.length > 0) eventType = 'smartDetect'
  return {
    type,
    cameraId: camera ? camera.id : clampText(value.cameraId, 160),
    cameraName: camera ? camera.name : clampText(value.cameraName || value.camera || value.target, 240),
    unresolvedTarget: camera ? '' : target,
    unresolved: Boolean(target && !camera),
    ambiguous: resolved.ambiguous,
    eventType,
    scopeId: resolvedScope ? clampText(resolvedScope.id, 160) : clampText(value.scopeId || value.zoneId || value.lineId, 160),
    scopeName: resolvedScope ? clampText(resolvedScope.name || resolvedScope.id, 240) : clampText(value.scopeName || value.zone || value.line, 240),
    unresolvedScope: Boolean(requestedScope && camera && !resolvedScope),
    ambiguousScope: matchingScopes.length > 1,
    objectTypes,
    cooldownSeconds: Math.max(10, Math.min(86400, Number(value.cooldownSeconds) || 60)),
    sendSnapshot: value.sendSnapshot !== false,
    reason: clampText(value.reason, 500)
  }
}

const normalizeKnxAiCameraActions = ({ actions, cameras } = {}) => (Array.isArray(actions) ? actions : [])
  .slice(0, KNX_AI_CAMERA_MAX_ACTIONS)
  .map(action => normalizeKnxAiCameraAction(action, cameras))
  .filter(Boolean)

const normalizeKnxAiCameraEvent = value => {
  const meta = value && typeof value === 'object' && !Array.isArray(value) && value.eventType
    ? value
    : null
  if (!meta) return null
  return {
    cameraId: clampText(meta.cameraId, 160),
    cameraName: clampText(meta.cameraName, 240),
    eventType: normalizeCameraEventType(meta.eventType),
    scopeId: clampText(meta.scopeId, 160),
    scopeName: clampText(meta.scopeName, 240),
    objectTypes: uniqueTexts(Array.isArray(meta.objectTypes) ? meta.objectTypes : []).map(normalizeSearchText).filter(Boolean),
    eventId: clampText(meta.eventId, 160),
    active: meta.active !== false,
    at: clampText(meta.at || new Date().toISOString(), 64),
    raw: meta.raw
  }
}

const cameraWatchMatchesEvent = (watch, event) => {
  if (!watch || !event) return false
  const watchCameraId = clampText(watch.cameraId, 160)
  const eventCameraId = clampText(event.cameraId, 160)
  if (watchCameraId && eventCameraId && watchCameraId !== eventCameraId) return false
  if ((!watchCameraId || !eventCameraId) && normalizeSearchText(watch.cameraName) !== normalizeSearchText(event.cameraName)) return false
  const wantedObjects = (Array.isArray(watch.objectTypes) ? watch.objectTypes : []).map(normalizeCameraObjectType).filter(Boolean)
  const watchEventType = normalizeCameraEventType(watch.eventType)
  const eventType = normalizeCameraEventType(event.eventType)
  const genericSmartDetection = watchEventType === 'smartDetect'
    || (watchEventType === 'motion' && wantedObjects.length > 0)
  if (genericSmartDetection) {
    if (!['smartDetectZone', 'smartDetectLine', 'smartDetectLoiterZone'].includes(eventType)) return false
  } else if (watchEventType && watchEventType !== eventType) return false
  const watchScope = normalizeSearchText(watch.scopeId || watch.scopeName)
  const eventScopeCandidates = [event.scopeId, event.scopeName].map(normalizeSearchText).filter(Boolean)
  if (watchScope && !eventScopeCandidates.some(candidate => candidate === watchScope || candidate.includes(watchScope) || watchScope.includes(candidate))) return false
  if (wantedObjects.length) {
    const detectedObjects = (Array.isArray(event.objectTypes) ? event.objectTypes : []).map(normalizeCameraObjectType).filter(Boolean)
    if (!detectedObjects.some(type => wantedObjects.includes(type))) return false
  }
  return true
}

const normalizeKnxAiCameraImage = ({ data, mediaType } = {}) => {
  if (!Buffer.isBuffer(data)) throw new Error('The camera snapshot is not binary image data')
  if (data.length === 0) throw new Error('The camera snapshot is empty')
  if (data.length > KNX_AI_CAMERA_IMAGE_MAX_BYTES) throw new Error(`The camera snapshot exceeds ${KNX_AI_CAMERA_IMAGE_MAX_BYTES} bytes`)
  const type = clampText(mediaType || 'image/jpeg', 80).toLocaleLowerCase().split(';')[0]
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(type)) throw new Error(`Unsupported camera image type: ${type}`)
  return { data, mediaType: type, bytes: data.length }
}

const buildKnxAiCameraNotificationText = ({ language, event } = {}) => {
  const lang = clampText(language || 'en', 8).toLocaleLowerCase()
  const camera = clampText(event && event.cameraName, 240) || clampText(event && event.cameraId, 160) || 'camera'
  const eventType = normalizeCameraEventType(event && event.eventType)
  const scope = clampText(event && (event.scopeName || event.scopeId), 240)
  const objectTypes = uniqueTexts(event && event.objectTypes).join(', ')
  const details = [scope, objectTypes].filter(Boolean).join(' — ')
  const suffix = details ? ` (${details})` : ''
  const labels = {
    it: { smartDetectLine: 'un attraversamento di linea', smartDetectZone: 'un ingresso in zona', smartDetectLoiterZone: 'una permanenza in zona', motion: 'un movimento', ring: 'un suono del campanello', smartAudioDetect: 'un evento audio intelligente' },
    de: { smartDetectLine: 'eine Linienüberquerung', smartDetectZone: 'einen Zoneneintritt', smartDetectLoiterZone: 'einen längeren Zonenaufenthalt', motion: 'eine Bewegung', ring: 'ein Klingeln', smartAudioDetect: 'ein intelligentes Audioereignis' },
    fr: { smartDetectLine: 'un franchissement de ligne', smartDetectZone: 'une entrée dans une zone', smartDetectLoiterZone: 'une présence prolongée dans une zone', motion: 'un mouvement', ring: 'une sonnerie', smartAudioDetect: 'un événement audio intelligent' },
    es: { smartDetectLine: 'un cruce de línea', smartDetectZone: 'una entrada en zona', smartDetectLoiterZone: 'una permanencia en zona', motion: 'un movimiento', ring: 'una llamada al timbre', smartAudioDetect: 'un evento de audio inteligente' },
    zh: { smartDetectLine: '越线事件', smartDetectZone: '进入区域事件', smartDetectLoiterZone: '区域徘徊事件', motion: '移动事件', ring: '门铃事件', smartAudioDetect: '智能音频事件' },
    en: { smartDetectLine: 'a line crossing', smartDetectZone: 'a zone entry', smartDetectLoiterZone: 'loitering in a zone', motion: 'motion', ring: 'a doorbell ring', smartAudioDetect: 'a smart audio event' }
  }
  const label = (labels[lang] || labels.en)[eventType] || (lang === 'zh' ? '摄像机事件' : lang === 'it' ? 'un evento' : lang === 'de' ? 'ein Ereignis' : lang === 'fr' ? 'un événement' : lang === 'es' ? 'un evento' : 'an event')
  const copy = {
    it: `La telecamera ${camera} ha rilevato ${label}${suffix}.`,
    de: `Die Kamera ${camera} hat ${label} erkannt${suffix}.`,
    fr: `La caméra ${camera} a détecté ${label}${suffix}.`,
    es: `La cámara ${camera} ha detectado ${label}${suffix}.`,
    zh: `摄像机 ${camera} 检测到${label}${suffix}。`,
    en: `Camera ${camera} detected ${label}${suffix}.`
  }
  return copy[lang] || copy.en
}

module.exports = {
  KNX_AI_CAMERA_IMAGE_MAX_BYTES,
  KNX_AI_CAMERA_MAX_ACTIONS,
  KNX_AI_CAMERA_REGISTRY_KEY,
  buildKnxAiCameraNotificationText,
  cameraWatchMatchesEvent,
  getKnxAiCameraAdapterRegistry,
  normalizeCameraEventType,
  normalizeCameraObjectType,
  normalizeKnxAiCameraAction,
  normalizeKnxAiCameraActions,
  normalizeKnxAiCameraEvent,
  normalizeKnxAiCameraImage,
  normalizeKnxAiCameraRegistration,
  normalizeSearchText,
  resolveKnxAiCamera
}
