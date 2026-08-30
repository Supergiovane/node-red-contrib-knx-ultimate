const HOME_MEMORY_VERSION = 1
const HOME_MEMORY_MIN_KB = 64
const HOME_MEMORY_MAX_KB = 5120
const HOME_MEMORY_DEFAULT_KB = 5120
const HOME_MEMORY_MAX_EDUCATION_CHARS = 16000
const HOME_MEMORY_MAX_OBSERVATIONS = 120
const HOME_MEMORY_MAX_HABITS = 80
const HOME_MEMORY_MAX_NOTIFICATIONS = 80
const HOME_MEMORY_MAX_SEMANTIC_OBJECTS = 300

const normalizeText = (value) => String(value === undefined || value === null ? '' : value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim()

const clampHomeMemoryKb = (value) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return HOME_MEMORY_DEFAULT_KB
  return Math.max(HOME_MEMORY_MIN_KB, Math.min(HOME_MEMORY_MAX_KB, Math.round(parsed)))
}

const clampText = (value, maxChars) => {
  const text = String(value === undefined || value === null ? '' : value).trim()
  return text.length > maxChars ? text.slice(0, maxChars) : text
}

const clonePlain = (value, fallback) => {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    return fallback
  }
}

const matches = (text, expressions) => expressions.some(expression => expression.test(text))

const CONCEPT_PATTERNS = [
  {
    kind: 'cover',
    confidence: 0.96,
    patterns: [
      /\b(persian[ae]|tapparell[ae]|avvolgibil[ei]|venezian[ae])\b/,
      /\b(shutter|shutters|roller blind|roller blinds|blind|blinds)\b/,
      /\b(rollladen|rolllaeden|jalousie|jalousien)\b/,
      /\b(volet|volets|store|stores)\b/,
      /\b(persiana|persianas|contraventana|contraventanas)\b/,
      /(卷帘|百叶窗|遮阳帘|窗帘)/
    ]
  },
  {
    kind: 'window',
    confidence: 0.94,
    patterns: [
      /\b(finestr[ae]|serramento|serramenti)\b/,
      /\b(window|windows)\b/,
      /\b(fenster)\b/,
      /\b(fenetre|fenetres)\b/,
      /\b(ventana|ventanas)\b/,
      /(窗户|窗)/
    ]
  },
  {
    kind: 'door',
    confidence: 0.93,
    patterns: [
      /\b(porta|porte|portone|portoni)\b/,
      /\b(door|doors|gate|gates)\b/,
      /\b(tur|ture|tor|tore)\b/,
      /\b(porte|portes|portail|portails)\b/,
      /\b(puerta|puertas|porton|portones)\b/,
      /(门|大门|车库门)/
    ]
  },
  {
    kind: 'light',
    confidence: 0.92,
    patterns: [
      /\b(luce|luci|lampada|lampade|plafoniera|applique|piantana)\b/,
      /\b(light|lights|lamp|lamps|ceiling light)\b/,
      /\b(licht|leuchte|lampe|lampen)\b/,
      /\b(lumiere|lumieres|lampe|lampes)\b/,
      /\b(luz|luces|lampara|lamparas)\b/,
      /(灯|照明|灯光)/
    ]
  },
  {
    kind: 'temperature',
    confidence: 0.95,
    patterns: [
      /\b(temperatura|termometro)\b/,
      /\b(temperature|thermometer)\b/,
      /\b(temperatur|thermometer)\b/,
      /\b(temperature|thermometre)\b/,
      /\b(temperatura|termometro)\b/,
      /(温度|温度计)/
    ]
  },
  {
    kind: 'climate',
    confidence: 0.9,
    patterns: [
      /\b(riscaldamento|raffrescamento|climatizzazione|termostato|setpoint)\b/,
      /\b(heating|cooling|climate|thermostat|setpoint)\b/,
      /\b(heizung|kuhlung|klima|thermostat|sollwert)\b/,
      /\b(chauffage|refroidissement|climatisation|thermostat|consigne)\b/,
      /\b(calefaccion|refrigeracion|climatizacion|termostato|consigna)\b/,
      /(供暖|制冷|空调|恒温器|设定温度)/
    ]
  },
  {
    kind: 'occupancy',
    confidence: 0.9,
    patterns: [
      /\b(presenza|presenze|occupazione|movimento)\b/,
      /\b(presence|occupancy|motion)\b/,
      /\b(prasenz|anwesenheit|bewegung)\b/,
      /\b(presence|occupation|mouvement)\b/,
      /\b(presencia|ocupacion|movimiento)\b/,
      /(存在|占用|人体感应|移动)/
    ]
  },
  {
    kind: 'alarm',
    confidence: 0.92,
    patterns: [
      /\b(allarme|antifurto|fumo|allagamento)\b/,
      /\b(alarm|intrusion|smoke|flood)\b/,
      /\b(alarm|einbruch|rauch|wasserleck)\b/,
      /\b(alarme|intrusion|fumee|inondation)\b/,
      /\b(alarma|intrusion|humo|inundacion)\b/,
      /(报警|入侵|烟雾|漏水)/
    ]
  }
]

const AREA_PATTERNS = [
  {
    area: 'living_room',
    patterns: [
      /\b(soggiorno|salotto|living)\b/,
      /\b(wohnzimmer)\b/,
      /\b(sejour|salon)\b/,
      /\b(sala de estar|salon)\b/,
      /(客厅|起居室)/
    ]
  },
  {
    area: 'kitchen',
    patterns: [/\b(cucina|kitchen|kuche|cuisine|cocina)\b/, /(厨房)/]
  },
  {
    area: 'bedroom',
    patterns: [
      /\b(camera da letto|camera matrimoniale|bedroom)\b/,
      /\b(schlafzimmer)\b/,
      /\b(chambre)\b/,
      /\b(dormitorio|habitacion)\b/,
      /(卧室)/
    ]
  },
  {
    area: 'bathroom',
    patterns: [/\b(bagno|bathroom|bad|badezimmer|salle de bain|bano)\b/, /(浴室|卫生间)/
    ]
  },
  {
    area: 'office',
    patterns: [/\b(studio|office|buro|bureau|oficina)\b/, /(书房|办公室)/]
  },
  {
    area: 'garage',
    patterns: [/\b(garage|autorimessa|garaje)\b/, /(车库)/]
  },
  {
    area: 'hallway',
    patterns: [/\b(corridoio|ingresso|hallway|corridor|flur|entree|pasillo)\b/, /(走廊|入口|玄关)/]
  },
  {
    area: 'outdoor',
    patterns: [/\b(esterno|giardino|terrazzo|balcone|outdoor|garden|garten|jardin|exterior)\b/, /(户外|花园|阳台)/]
  }
]

const inferKnxAiHomeSemantic = (item = {}) => {
  const source = [
    item.mainGroup,
    item.middleGroup,
    item.hierarchyPath,
    item.label,
    item.etsName,
    Array.isArray(item.aliases) ? item.aliases.join(' ') : '',
    Array.isArray(item.tags) ? item.tags.join(' ') : ''
  ].filter(Boolean).join(' ')
  const normalized = normalizeText(source)
  const concept = CONCEPT_PATTERNS.find(entry => matches(normalized, entry.patterns))
  const areaMatch = AREA_PATTERNS.find(entry => matches(normalized, entry.patterns))
  const dpt = String(item.dpt || '').trim()
  const semantic = {
    kind: concept ? concept.kind : 'unknown',
    area: areaMatch ? areaMatch.area : '',
    confidence: concept ? concept.confidence : 0,
    sourceLanguage: /[\u3400-\u9fff]/.test(source) ? 'zh-CN' : 'auto',
    originalLabel: clampText(item.label || item.etsName || item.ga || '', 240),
    dpt
  }
  if (semantic.kind === 'unknown' && /^9\./.test(dpt)) {
    semantic.kind = 'measurement'
    semantic.confidence = 0.55
  }
  return semantic
}

const enrichKnxAiHomeCatalog = (catalog) => (Array.isArray(catalog) ? catalog : []).map(item => {
  return Object.assign({}, item, {
    semantic: inferKnxAiHomeSemantic(item)
  })
})

const createEmptyKnxAiHomeMemory = () => ({
  version: HOME_MEMORY_VERSION,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerSessionId: '',
  ownerLanguage: '',
  observations: [],
  habits: [],
  notifications: [],
  semanticObjects: []
})

const normalizeArray = (value, maxItems) => {
  const source = Array.isArray(value) ? value : []
  return source
    .filter(item => item && typeof item === 'object' && !Array.isArray(item))
    .slice(-maxItems)
    .map(item => clonePlain(item, {}))
}

const normalizeSemanticObjects = (value) => normalizeArray(value, HOME_MEMORY_MAX_SEMANTIC_OBJECTS)
  .map(item => ({
    ga: clampText(item.ga, 32),
    dpt: clampText(item.dpt, 32),
    label: clampText(item.label, 240),
    kind: clampText(item.kind, 80),
    area: clampText(item.area, 80),
    confidence: Number.isFinite(Number(item.confidence)) ? Number(item.confidence) : 0
  }))

const normalizeKnxAiHomeMemory = (value = {}) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    version: HOME_MEMORY_VERSION,
    createdAt: clampText(source.createdAt || new Date().toISOString(), 64),
    updatedAt: clampText(source.updatedAt || new Date().toISOString(), 64),
    ownerSessionId: clampText(source.ownerSessionId, 160),
    ownerLanguage: clampText(source.ownerLanguage, 16),
    observations: normalizeArray(source.observations, HOME_MEMORY_MAX_OBSERVATIONS),
    habits: normalizeArray(source.habits, HOME_MEMORY_MAX_HABITS),
    notifications: normalizeArray(source.notifications, HOME_MEMORY_MAX_NOTIFICATIONS),
    semanticObjects: normalizeSemanticObjects(source.semanticObjects)
  }
}

const addBoundedKnxAiObservation = (memory, observation) => {
  const target = normalizeKnxAiHomeMemory(memory)
  const item = clonePlain(observation, null)
  if (item) target.observations.push(item)
  target.observations = target.observations.slice(-HOME_MEMORY_MAX_OBSERVATIONS)
  target.updatedAt = new Date().toISOString()
  return target
}

const addBoundedKnxAiNotification = (memory, notification) => {
  const target = normalizeKnxAiHomeMemory(memory)
  const item = clonePlain(notification, null)
  if (item) target.notifications.push(item)
  target.notifications = target.notifications.slice(-HOME_MEMORY_MAX_NOTIFICATIONS)
  target.updatedAt = new Date().toISOString()
  return target
}

const updateKnxAiCoverHabit = (memory, { ga, label, area, durationMinutes, at } = {}) => {
  const target = normalizeKnxAiHomeMemory(memory)
  const normalizedGa = clampText(ga, 32)
  const duration = Math.max(0, Math.min(24 * 60, Number(durationMinutes) || 0))
  if (!normalizedGa || !duration) return target
  const existing = target.habits.find(item => item && item.ga === normalizedGa && item.type === 'cover_open_duration')
  const samples = existing ? Math.max(0, Number(existing.samples) || 0) : 0
  const previousAverage = existing ? Math.max(0, Number(existing.averageMinutes) || 0) : 0
  const next = {
    type: 'cover_open_duration',
    ga: normalizedGa,
    label: clampText(label || normalizedGa, 240),
    area: clampText(area, 80),
    samples: Math.min(1000000, samples + 1),
    averageMinutes: Number((((previousAverage * samples) + duration) / (samples + 1)).toFixed(1)),
    lastMinutes: Number(duration.toFixed(1)),
    updatedAt: clampText(at || new Date().toISOString(), 64)
  }
  if (existing) Object.assign(existing, next)
  else target.habits.push(next)
  target.habits = target.habits
    .sort((a, b) => String(a.updatedAt || '').localeCompare(String(b.updatedAt || '')))
    .slice(-HOME_MEMORY_MAX_HABITS)
  target.updatedAt = new Date().toISOString()
  return target
}

const escapeMarkdownCell = (value) => clampText(value, 260).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')

const buildKnxAiHomeMemoryMarkdown = ({ memory, maxKb } = {}) => {
  const targetBytes = clampHomeMemoryKb(maxKb) * 1024
  const bounded = normalizeKnxAiHomeMemory(memory)

  const render = () => {
    bounded.updatedAt = new Date().toISOString()
    const metadata = JSON.stringify(bounded)
    const lines = [
      '<!-- KNX_AI_HOME_MEMORY_V1',
      metadata,
      'KNX_AI_HOME_MEMORY_END -->',
      '',
      '# KNX AI Home Memory',
      '',
      `Updated: ${bounded.updatedAt}`,
      '',
      '## AI Education — configured on the KNX AI node',
      '',
      '_AI Education is intentionally not stored in learned memory and the model cannot modify it._',
      '',
      '## Semantic ETS model',
      '',
      '| GA | DPT | Kind | Area | Confidence | ETS label |',
      '|---|---|---|---|---:|---|'
    ]
    bounded.semanticObjects.forEach(item => {
      lines.push(`| ${escapeMarkdownCell(item.ga)} | ${escapeMarkdownCell(item.dpt)} | ${escapeMarkdownCell(item.kind)} | ${escapeMarkdownCell(item.area)} | ${Number(item.confidence || 0).toFixed(2)} | ${escapeMarkdownCell(item.label)} |`)
    })
    lines.push('', '## Learned habits', '')
    if (!bounded.habits.length) lines.push('_No stable habit has been learned yet._')
    bounded.habits.forEach(item => {
      lines.push(`- ${escapeMarkdownCell(item.label || item.ga)}: average open duration ${Number(item.averageMinutes || 0).toFixed(1)} minutes across ${Number(item.samples || 0)} observations; last ${Number(item.lastMinutes || 0).toFixed(1)} minutes.`)
    })
    lines.push('', '## Recent significant observations', '')
    if (!bounded.observations.length) lines.push('_No significant observation recorded._')
    bounded.observations.forEach(item => {
      lines.push(`- ${escapeMarkdownCell(item.at)} — ${escapeMarkdownCell(item.label || item.ga)}: ${escapeMarkdownCell(item.event || item.value || item.type)}`)
    })
    lines.push('', '## Proactive notification history', '')
    if (!bounded.notifications.length) lines.push('_No proactive notification sent._')
    bounded.notifications.forEach(item => {
      lines.push(`- ${escapeMarkdownCell(item.at)} — ${escapeMarkdownCell(item.label || item.ga)}: ${escapeMarkdownCell(item.reason || item.type)}`)
    })
    lines.push('')
    return lines.join('\n')
  }

  let markdown = render()
  while (Buffer.byteLength(markdown, 'utf8') > targetBytes) {
    if (bounded.observations.length) bounded.observations.shift()
    else if (bounded.notifications.length) bounded.notifications.shift()
    else if (bounded.habits.length) bounded.habits.shift()
    else if (bounded.semanticObjects.length) bounded.semanticObjects.pop()
    else break
    markdown = render()
  }
  return {
    markdown,
    memory: bounded,
    bytes: Buffer.byteLength(markdown, 'utf8'),
    maxBytes: targetBytes
  }
}

const parseKnxAiHomeMemoryMarkdown = (markdown) => {
  const text = String(markdown || '')
  const match = text.match(/<!-- KNX_AI_HOME_MEMORY_V1\s*\n([\s\S]*?)\nKNX_AI_HOME_MEMORY_END -->/)
  if (!match) return createEmptyKnxAiHomeMemory()
  try {
    return normalizeKnxAiHomeMemory(JSON.parse(match[1]))
  } catch (error) {
    return createEmptyKnxAiHomeMemory()
  }
}

const OPEN_RE = /\b(open|opened|up|aperto|aperta|aperti|aperte|offen|ouvert|ouverte|abierto|abierta)\b|打开|开启/
const CLOSED_RE = /\b(closed|close|down|chiuso|chiusa|chiusi|chiuse|geschlossen|ferme|fermee|cerrado|cerrada)\b|关闭|闭合/

const classifyKnxAiOpenState = ({ semantic, dpt, payload, valueOptions } = {}) => {
  const safeSemantic = semantic && typeof semantic === 'object' ? semantic : {}
  if (!['cover', 'window', 'door'].includes(safeSemantic.kind)) return null
  const dptId = String(dpt || safeSemantic.dpt || '').trim()
  const main = dptId.split('.')[0]
  if (main === '5' && safeSemantic.kind === 'cover') {
    const numeric = Number(payload)
    if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) return null
    return {
      open: numeric < 99,
      value: numeric,
      confidence: 0.78,
      reason: numeric < 99 ? 'cover_not_fully_closed' : 'cover_closed'
    }
  }
  if (main !== '1' || typeof payload !== 'boolean') return null
  const options = Array.isArray(valueOptions) ? valueOptions : []
  const matchingOption = options.find(option => {
    const raw = String(option && option.value !== undefined ? option.value : '').toLowerCase()
    return payload ? ['true', '1'].includes(raw) : ['false', '0'].includes(raw)
  })
  const valueLabel = normalizeText(matchingOption && matchingOption.label)
  if (OPEN_RE.test(valueLabel)) return { open: true, value: payload, confidence: 0.94, reason: 'explicit_open_value' }
  if (CLOSED_RE.test(valueLabel)) return { open: false, value: payload, confidence: 0.94, reason: 'explicit_closed_value' }
  return null
}

const parseClockMinutes = (value, fallback) => {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return fallback
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallback
  return (hour * 60) + minute
}

const isKnxAiQuietTime = ({ date = new Date(), start = '23:00', end = '07:00' } = {}) => {
  const startMinutes = parseClockMinutes(start, 23 * 60)
  const endMinutes = parseClockMinutes(end, 7 * 60)
  if (startMinutes === endMinutes) return false
  const current = (date.getHours() * 60) + date.getMinutes()
  if (startMinutes < endMinutes) return current >= startMinutes && current < endMinutes
  return current >= startMinutes || current < endMinutes
}

const normalizeHomeLanguage = (value) => {
  const raw = String(value || '').trim().toLowerCase()
  if (raw.startsWith('it')) return 'it'
  if (raw.startsWith('de')) return 'de'
  if (raw.startsWith('fr')) return 'fr'
  if (raw.startsWith('es')) return 'es'
  if (raw.startsWith('zh')) return 'zh-CN'
  return 'en'
}

const buildKnxAiProactiveFallback = ({ language, label, durationMinutes } = {}) => {
  const lang = normalizeHomeLanguage(language)
  const safeLabel = clampText(label || 'KNX object', 240)
  const minutes = Math.max(1, Math.round(Number(durationMinutes) || 1))
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  const duration = hours > 0 ? `${hours} h${remainder ? ` ${remainder} min` : ''}` : `${minutes} min`
  const messages = {
    en: `${safeLabel} has remained open or not fully closed for ${duration}. Would you like me to help you close it?`,
    it: `${safeLabel} risulta aperta o non completamente chiusa da ${duration}. Vuoi che ti aiuti a chiuderla?`,
    de: `${safeLabel} ist seit ${duration} geöffnet oder nicht vollständig geschlossen. Soll ich dir beim Schließen helfen?`,
    fr: `${safeLabel} est ouvert ou pas complètement fermé depuis ${duration}. Voulez-vous que je vous aide à le fermer ?`,
    es: `${safeLabel} lleva ${duration} abierto o sin cerrar completamente. ¿Quieres que te ayude a cerrarlo?`,
    'zh-CN': `${safeLabel} 已打开或未完全关闭 ${duration}。需要我帮你关闭吗？`
  }
  return messages[lang] || messages.en
}

module.exports = {
  HOME_MEMORY_DEFAULT_KB,
  HOME_MEMORY_MAX_EDUCATION_CHARS,
  HOME_MEMORY_MAX_HABITS,
  HOME_MEMORY_MAX_KB,
  HOME_MEMORY_MAX_NOTIFICATIONS,
  HOME_MEMORY_MAX_OBSERVATIONS,
  HOME_MEMORY_MAX_SEMANTIC_OBJECTS,
  HOME_MEMORY_MIN_KB,
  addBoundedKnxAiNotification,
  addBoundedKnxAiObservation,
  buildKnxAiHomeMemoryMarkdown,
  buildKnxAiProactiveFallback,
  clampHomeMemoryKb,
  classifyKnxAiOpenState,
  createEmptyKnxAiHomeMemory,
  enrichKnxAiHomeCatalog,
  inferKnxAiHomeSemantic,
  isKnxAiQuietTime,
  normalizeKnxAiHomeMemory,
  normalizeHomeLanguage,
  parseKnxAiHomeMemoryMarkdown,
  updateKnxAiCoverHabit
}
