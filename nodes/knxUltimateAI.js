// KNX Ultimate AI / Traffic Analyzer
const loggerClass = require('./utils/sysLogger')
const dptlib = require('knxultimate').dptlib
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { getRequestAccessToken, normalizeAuthFromAccessTokenQuery } = require('./utils/httpAdminAccessToken')
let googleTranslateTTS = null
try {
  googleTranslateTTS = require('google-translate-tts')
} catch (error) {
  googleTranslateTTS = null
}

const coerceBoolean = (value) => (value === true || value === 'true')

let adminEndpointsRegistered = false
const aiRuntimeNodes = new Map()
const knxAiVueDistDir = path.join(__dirname, 'plugins', 'knxUltimateAI-vue')

const sendKnxAiVueIndex = (req, res) => {
  const entryPath = path.join(knxAiVueDistDir, 'index.html')
  fs.readFile(entryPath, 'utf8', (error, html) => {
    if (error || typeof html !== 'string') {
      res.status(503).type('text/plain').send('KNX AI Vue build not found. Run "npm run knx-ai:build" in the module root.')
      return
    }
    const rawToken = getRequestAccessToken(req)
    if (!rawToken) {
      res.type('text/html').send(html)
      return
    }
    const encodedToken = encodeURIComponent(rawToken)
    const htmlWithToken = html
      .replace('./assets/app.js', `./assets/app.js?access_token=${encodedToken}`)
      .replace('./assets/app.css', `./assets/app.css?access_token=${encodedToken}`)
    res.type('text/html').send(htmlWithToken)
  })
}

const sendStaticFileSafe = ({ rootDir, relativePath, res }) => {
  const rootPath = path.resolve(rootDir)
  const requestedPath = String(relativePath || '').replace(/^\/+/, '')
  const fullPath = path.resolve(rootPath, requestedPath)
  if (!fullPath.startsWith(rootPath + path.sep) && fullPath !== rootPath) {
    res.status(403).type('text/plain').send('Forbidden')
    return
  }
  fs.stat(fullPath, (statError, stats) => {
    if (statError || !stats || !stats.isFile()) {
      res.status(404).type('text/plain').send('File not found')
      return
    }
    res.sendFile(fullPath, (sendError) => {
      if (!sendError || res.headersSent) return
      res.status(sendError.statusCode || 500).type('text/plain').send(sendError.message || String(sendError))
    })
  })
}

const GOOGLE_TRANSLATE_MAX_CHARS = 200

const stripId3v2 = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < 10) return buffer
  if (buffer[0] !== 0x49 || buffer[1] !== 0x44 || buffer[2] !== 0x33) return buffer
  const size =
    ((buffer[6] & 0x7f) << 21) |
    ((buffer[7] & 0x7f) << 14) |
    ((buffer[8] & 0x7f) << 7) |
    (buffer[9] & 0x7f)
  const tagEnd = 10 + size
  if (tagEnd <= 10 || tagEnd >= buffer.length) return buffer
  return buffer.subarray(tagEnd)
}

const splitGoogleTranslateText = (text, maxLen = GOOGLE_TRANSLATE_MAX_CHARS) => {
  const chunks = []
  let remaining = String(text || '').trim()
  if (!remaining) return chunks
  const breakChars = ['\n', '.', '!', '?', ';', ':', ',', ' ']
  while (remaining.length > maxLen) {
    const window = remaining.slice(0, maxLen + 1)
    let breakAt = -1
    for (const ch of breakChars) {
      const idx = window.lastIndexOf(ch)
      if (idx > breakAt) breakAt = idx
    }
    if (breakAt <= 0) breakAt = maxLen
    const cutAt = breakAt === maxLen ? maxLen : breakAt + 1
    const chunk = remaining.slice(0, cutAt).trim()
    if (chunk) chunks.push(chunk)
    remaining = remaining.slice(cutAt).trimStart()
  }
  if (remaining) chunks.push(remaining)
  return chunks
}

const synthesizeGoogleTranslateSpeech = async ({ text, voice = 'it', slow = false } = {}) => {
  if (!googleTranslateTTS || typeof googleTranslateTTS.synthesize !== 'function') {
    throw new Error('Google Translate TTS is not available')
  }
  const resolvedVoice = typeof voice === 'string' && voice.includes('-') ? voice.split('-')[0] : String(voice || 'it')
  const textChunks = splitGoogleTranslateText(text, GOOGLE_TRANSLATE_MAX_CHARS)
  if (!textChunks.length) return Buffer.from([])
  if (textChunks.length === 1) {
    return await googleTranslateTTS.synthesize({
      text: textChunks[0],
      voice: resolvedVoice,
      slow: slow === true
    })
  }
  const buffers = []
  for (let i = 0; i < textChunks.length; i += 1) {
    // Google Translate TTS accepts only short chunks; concatenate the resulting mp3 frames.
    // eslint-disable-next-line no-await-in-loop
    const chunkBuffer = await googleTranslateTTS.synthesize({
      text: textChunks[i],
      voice: resolvedVoice,
      slow: slow === true
    })
    buffers.push(i === 0 ? chunkBuffer : stripId3v2(chunkBuffer))
  }
  return Buffer.concat(buffers)
}

const sanitizeApiKey = (value) => {
  if (value === undefined || value === null) return ''
  let key = String(value).trim()
  if (key === '') return ''
  // Node-RED password placeholder when credential is already set
  if (key === '__PWRD__') return ''
  // Common copy/paste mistakes
  key = key.replace(/^authorization:\s*/i, '')
  key = key.replace(/^bearer\s+/i, '')
  key = key.replace(/^"(.+)"$/, '$1').replace(/^'(.+)'$/, '$1')
  // If user pasted a full header line, extract the token-like part
  const match = key.match(/(sk-[A-Za-z0-9_-]{10,})/)
  if (match) return match[1]
  return key
}

const safeStringify = (value) => {
  try {
    if (value === undefined) return ''
    if (typeof value === 'string') return value
    return JSON.stringify(value)
  } catch (error) {
    return String(value)
  }
}

const truncatePromptText = (value, maxChars = 10000) => {
  const text = String(value || '')
  const limit = Math.max(256, Number(maxChars) || 0)
  if (text.length <= limit) return text
  const marker = '\n...[truncated]'
  const keep = Math.max(0, limit - marker.length)
  return text.slice(0, keep) + marker
}

const compactObjectForPrompt = (value, { preferredKeys = [], maxEntries = 40, formatValue } = {}) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const source = value
  const out = {}
  const preferred = Array.isArray(preferredKeys) ? preferredKeys.map(key => String(key || '').trim()).filter(Boolean) : []
  const preferredSet = new Set(preferred)
  const keys = [
    ...preferred,
    ...Object.keys(source).filter(key => !preferredSet.has(key))
  ]
  const limit = Math.max(1, Number(maxEntries) || 1)
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue
    const raw = source[key]
    const normalized = typeof formatValue === 'function' ? formatValue(raw, key) : raw
    out[key] = normalized
    if (Object.keys(out).length >= limit) break
  }
  return out
}

const takeLastItemsByCharBudget = (items, maxChars = 7000) => {
  const source = Array.isArray(items) ? items : []
  const limit = Math.max(200, Number(maxChars) || 0)
  const selected = []
  let total = 0
  for (let i = source.length - 1; i >= 0; i -= 1) {
    const item = String(source[i] || '')
    if (!item) continue
    const next = item.length + (selected.length > 0 ? 1 : 0)
    if (selected.length > 0 && (total + next) > limit) break
    selected.push(item)
    total += next
  }
  return selected.reverse()
}

const buildLlmSummarySnapshot = (summary) => {
  const s = summary && typeof summary === 'object' ? summary : {}
  const topGAs = Array.isArray(s.topGAs) ? s.topGAs.slice(0, 30) : []
  const topGaKeys = topGAs
    .map(item => String(item && item.ga ? item.ga : '').trim())
    .filter(Boolean)

  const graph = s.graph && typeof s.graph === 'object'
    ? {
        windowSec: Number(s.graph.windowSec || 0),
        edges: (Array.isArray(s.graph.edges) ? s.graph.edges : []).slice(0, 60),
        hotEdgesDelta: (Array.isArray(s.graph.hotEdgesDelta) ? s.graph.hotEdgesDelta : []).slice(0, 40),
        anomalyLifecycle: (Array.isArray(s.graph.anomalyLifecycle) ? s.graph.anomalyLifecycle : []).slice(0, 30)
      }
    : {}

  const flowMapTopology = s.flowMapTopology && typeof s.flowMapTopology === 'object'
    ? {
        mode: String(s.flowMapTopology.mode || '').trim(),
        windowSec: Number(s.flowMapTopology.windowSec || 0),
        nodes: (Array.isArray(s.flowMapTopology.nodes) ? s.flowMapTopology.nodes : []).slice(0, 80).map((node) => ({
          id: String(node && node.id ? node.id : '').trim(),
          displayId: String(node && node.displayId ? node.displayId : '').trim(),
          kind: String(node && node.kind ? node.kind : '').trim(),
          subtitle: String(node && node.subtitle ? node.subtitle : '').trim(),
          payload: compactPayloadForNodeLabel(node && Object.prototype.hasOwnProperty.call(node, 'payload') ? node.payload : '', 36),
          anomalyCount: Number(node && node.anomalyCount ? node.anomalyCount : 0),
          lastSeenAtMs: Number(node && node.lastSeenAtMs ? node.lastSeenAtMs : 0)
        })),
        edges: (Array.isArray(s.flowMapTopology.edges) ? s.flowMapTopology.edges : []).slice(0, 120).map((edge) => ({
          from: String(edge && edge.from ? edge.from : '').trim(),
          to: String(edge && edge.to ? edge.to : '').trim(),
          linkType: String(edge && edge.linkType ? edge.linkType : '').trim(),
          event: String(edge && edge.event ? edge.event : '').trim(),
          currentWindowCount: Number(edge && edge.currentWindowCount ? edge.currentWindowCount : 0),
          totalCount: Number(edge && edge.totalCount ? edge.totalCount : 0),
          delta: Number(edge && edge.delta ? edge.delta : 0),
          delayMs: Number(edge && edge.delayMs ? edge.delayMs : 0),
          lastAt: String(edge && edge.lastAt ? edge.lastAt : '').trim()
        }))
      }
    : undefined

  return {
    meta: s.meta && typeof s.meta === 'object' ? s.meta : {},
    counters: s.counters && typeof s.counters === 'object' ? s.counters : {},
    byEvent: s.byEvent && typeof s.byEvent === 'object' ? s.byEvent : {},
    topGAs,
    topSources: (Array.isArray(s.topSources) ? s.topSources : []).slice(0, 20),
    patterns: (Array.isArray(s.patterns) ? s.patterns : []).slice(0, 30),
    gaLastSeenAt: compactObjectForPrompt(s.gaLastSeenAt, { preferredKeys: topGaKeys, maxEntries: 60 }),
    gaLastPayload: compactObjectForPrompt(s.gaLastPayload, {
      preferredKeys: topGaKeys,
      maxEntries: 60,
      formatValue: value => compactPayloadForNodeLabel(value, 42)
    }),
    flowKnownCount: Number(s.flowKnownCount || 0),
    busConnection: s.busConnection && typeof s.busConnection === 'object' ? s.busConnection : {},
    anomalyLifecycle: (Array.isArray(s.anomalyLifecycle) ? s.anomalyLifecycle : []).slice(-40),
    graph,
    flowMapTopology
  }
}

const extractJsonFragmentFromText = (value) => {
  const text = String(value || '').trim()
  if (!text) throw new Error('Empty AI response')
  const normalizeCandidate = (input) => String(input || '')
    .replace(/^\uFEFF/, '')
    .replace(/^\s*json\s*\n/i, '')
    .trim()

  const tryParse = (input) => {
    const source = normalizeCandidate(input)
    if (!source) return null
    try {
      return JSON.parse(source)
    } catch (error) { }
    // Fallback: tolerate comments and trailing commas that some models emit.
    const relaxed = source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/,\s*([}\]])/g, '$1')
      .trim()
    if (!relaxed || relaxed === source) return null
    try {
      return JSON.parse(relaxed)
    } catch (error) {
      return null
    }
  }

  const extractBalancedJsonSlices = (input, maxSlices = 24) => {
    const source = String(input || '')
    const out = []
    for (let i = 0; i < source.length; i += 1) {
      const ch = source[i]
      if (ch !== '{' && ch !== '[') continue
      const stack = [ch === '{' ? '}' : ']']
      let inString = false
      let escaped = false
      for (let j = i + 1; j < source.length; j += 1) {
        const current = source[j]
        if (inString) {
          if (escaped) {
            escaped = false
            continue
          }
          if (current === '\\') {
            escaped = true
            continue
          }
          if (current === '"') inString = false
          continue
        }
        if (current === '"') {
          inString = true
          continue
        }
        if (current === '{') {
          stack.push('}')
          continue
        }
        if (current === '[') {
          stack.push(']')
          continue
        }
        if ((current === '}' || current === ']') && stack.length) {
          if (current !== stack[stack.length - 1]) break
          stack.pop()
          if (!stack.length) {
            const slice = normalizeCandidate(source.slice(i, j + 1))
            if (slice) out.push(slice)
            i = j
            break
          }
        }
      }
      if (out.length >= maxSlices) break
    }
    return out
  }

  const candidates = []
  const seen = new Set()
  const pushCandidate = (input) => {
    const normalized = normalizeCandidate(input)
    if (!normalized || seen.has(normalized)) return
    seen.add(normalized)
    candidates.push(normalized)
  }

  pushCandidate(text)
  const fencedRe = /```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/g
  let fenceMatch
  while ((fenceMatch = fencedRe.exec(text)) !== null) {
    pushCandidate(fenceMatch[1])
  }

  for (const candidate of candidates) {
    const direct = tryParse(candidate)
    if (direct !== null) return direct

    const objectStart = candidate.indexOf('{')
    const objectEnd = candidate.lastIndexOf('}')
    if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
      const parsedObject = tryParse(candidate.slice(objectStart, objectEnd + 1))
      if (parsedObject !== null) return parsedObject
    }
    const arrayStart = candidate.indexOf('[')
    const arrayEnd = candidate.lastIndexOf(']')
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      const parsedArray = tryParse(candidate.slice(arrayStart, arrayEnd + 1))
      if (parsedArray !== null) return parsedArray
    }

    const balancedSlices = extractBalancedJsonSlices(candidate)
    for (const slice of balancedSlices) {
      const parsedSlice = tryParse(slice)
      if (parsedSlice !== null) return parsedSlice
    }
  }

  const preview = text.slice(0, 180).replace(/\s+/g, ' ').trim()
  throw new Error(`The LLM response did not contain valid JSON${preview ? ` (preview: ${preview})` : ''}`)
}

const normalizeValueForCompare = (value) => {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (Buffer.isBuffer(value)) return `buffer:${value.toString('hex')}`
  if (typeof value === 'object') return safeStringify(value)
  return String(value)
}

const nowMs = () => Date.now()
const roundTo = (value, digits = 2) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  const f = 10 ** Math.max(0, Number(digits) || 0)
  return Math.round(n * f) / f
}

const percentileFromArray = (values, percentile = 0.95) => {
  const arr = Array.isArray(values) ? values.filter(v => Number.isFinite(Number(v))).map(v => Number(v)) : []
  if (!arr.length) return 0
  arr.sort((a, b) => a - b)
  const p = Math.max(0, Math.min(1, Number(percentile) || 0))
  if (arr.length === 1) return arr[0]
  const idx = Math.floor((arr.length - 1) * p)
  return arr[idx]
}

const edgeKey = (from, to) => `${from} -> ${to}`

const computeAnomalySeverity = (payload) => {
  const p = payload || {}
  let ratio = 1
  if (p.thresholdPerSec > 0 && p.ratePerSec > 0) ratio = Number(p.ratePerSec) / Number(p.thresholdPerSec)
  if (p.thresholdChanges > 0 && p.changesInWindow > 0) ratio = Number(p.changesInWindow) / Number(p.thresholdChanges)
  if (!Number.isFinite(ratio) || ratio <= 0) ratio = 1
  if (ratio >= 3) return { label: 'critical', score: roundTo(ratio, 2) }
  if (ratio >= 2) return { label: 'high', score: roundTo(ratio, 2) }
  if (ratio >= 1.25) return { label: 'medium', score: roundTo(ratio, 2) }
  return { label: 'low', score: roundTo(ratio, 2) }
}

const SVG_REQUEST_RE = /\b(svg|chart|graph|plot|diagram|bar|pie|line|grafico|grafici|diagramma|istogramma|torta)\b/i
const SVG_PRESENT_RE = /```svg[\s\S]*?```|<svg[\s>][\s\S]*?<\/svg>/i

const escapeXml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

const truncateLabel = (value, maxLen = 14) => {
  const s = String(value || '')
  if (s.length <= maxLen) return s
  return s.slice(0, Math.max(1, maxLen - 2)) + '..'
}

const shouldGenerateSvgChart = (question) => SVG_REQUEST_RE.test(String(question || ''))

const stripPayloadDecimals = (value) => {
  if (value === undefined || value === null) return value
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return value
    return Math.trunc(value)
  }
  if (Array.isArray(value)) return value.map(v => stripPayloadDecimals(v))
  if (typeof value === 'object') {
    const out = {}
    Object.keys(value).forEach((k) => {
      out[k] = stripPayloadDecimals(value[k])
    })
    return out
  }
  if (typeof value === 'string') {
    const s = String(value).trim()
    if (s === '') return ''
    if (/^[+-]?\d+(?:\.\d+)?$/.test(s)) {
      const n = Number(s)
      if (Number.isFinite(n)) return String(Math.trunc(n))
    }
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        const parsed = JSON.parse(s)
        return safeStringify(stripPayloadDecimals(parsed))
      } catch (error) {
        return s
      }
    }
    return s
  }
  return value
}

const compactPayloadForNodeLabel = (value, maxLen = 28) => {
  const normalizedPayload = stripPayloadDecimals(value)
  let s = normalizeValueForCompare(normalizedPayload)
  s = String(s || '').replace(/\s+/g, ' ').trim()
  if (s.length <= maxLen) return s
  return s.slice(0, Math.max(1, maxLen - 2)) + '..'
}

const normalizeAreaText = (value) => String(value || '')
  .replace(/\s+/g, ' ')
  .replace(/[–—]/g, '-')
  .trim()

const slugifyAreaText = (value) => normalizeAreaText(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80) || 'area'

const pushUniqueValue = (list, value, maxItems = 6) => {
  const normalized = normalizeAreaText(value)
  if (!normalized) return
  if (!Array.isArray(list)) return
  if (list.includes(normalized)) return
  if (list.length >= maxItems) return
  list.push(normalized)
}

const normalizeGaRoleValue = (value, fallback = 'auto') => {
  const raw = normalizeAreaText(value).toLowerCase()
  if (['auto', 'command', 'status', 'neutral'].includes(raw)) return raw
  return fallback
}

const parseEtsHierarchyLabel = (value) => {
  const raw = normalizeAreaText(value)
  if (!raw) {
    return {
      raw: '',
      deviceLabel: '',
      mainGroup: '',
      middleGroup: '',
      hierarchyPath: ''
    }
  }
  const match = raw.match(/^\(([^()]+)\)\s*(.*)$/)
  if (!match) {
    return {
      raw,
      deviceLabel: raw,
      mainGroup: '',
      middleGroup: '',
      hierarchyPath: ''
    }
  }
  const hierarchy = String(match[1] || '')
    .split('->')
    .map(part => normalizeAreaText(part))
    .filter(Boolean)
  return {
    raw,
    deviceLabel: normalizeAreaText(match[2] || raw),
    mainGroup: hierarchy[0] || '',
    middleGroup: hierarchy[1] || '',
    hierarchyPath: hierarchy.join(' / ')
  }
}

const AREA_TAG_RULES = [
  { tag: 'lighting', pattern: /\b(light|lights|lighting|luce|luci|lamp|dimmer)\b/i },
  { tag: 'hvac', pattern: /\b(hvac|clima|climate|fan\s?coil|fancoil|heating|cooling|thermo|temp|temperature)\b/i },
  { tag: 'shading', pattern: /\b(blind|blinds|shutter|shutters|jalousie|curtain|curtains|tapparella|tapparelle)\b/i },
  { tag: 'presence', pattern: /\b(presence|occupancy|motion|presence detector|pir|presence sensor|presence)\b/i },
  { tag: 'access', pattern: /\b(door|doors|window|windows|access|lock|badge|porta|porte|finestra|finestre)\b/i },
  { tag: 'energy', pattern: /\b(power|energy|meter|consumption|load|carico|consumo|misura)\b/i }
]

const inferAreaTags = ({ mainGroup, middleGroup, deviceLabel, dpt }) => {
  const text = [mainGroup, middleGroup, deviceLabel, dpt].filter(Boolean).join(' ')
  const tags = []
  AREA_TAG_RULES.forEach((rule) => {
    if (rule.pattern.test(text)) tags.push(rule.tag)
  })
  return tags
}

const buildSuggestedAreasFromCsv = (csv) => {
  const rows = Array.isArray(csv) ? csv : []
  const areasById = new Map()
  let hierarchicalGaCount = 0
  let secondaryGroupCount = 0
  let mainGroupCount = 0

  const ensureArea = ({ id, kind, name, parentName, pathTokens }) => {
    const key = String(id || '').trim()
    if (!key) return null
    if (!areasById.has(key)) {
      areasById.set(key, {
        id: key,
        kind: String(kind || 'area').trim() || 'area',
        name: normalizeAreaText(name || ''),
        parentName: normalizeAreaText(parentName || ''),
        pathTokens: Array.isArray(pathTokens) ? pathTokens.map(token => normalizeAreaText(token)).filter(Boolean) : [],
        gaSet: new Set(),
        dptSet: new Set(),
        tags: new Set(),
        sampleGAs: [],
        sampleLabels: []
      })
      if (kind === 'secondary_group') secondaryGroupCount += 1
      if (kind === 'main_group') mainGroupCount += 1
    }
    return areasById.get(key)
  }

  const registerAreaRow = ({ areaId, kind, name, parentName, pathTokens, row, parsed }) => {
    const area = ensureArea({ id: areaId, kind, name, parentName, pathTokens })
    if (!area) return
    const ga = normalizeAreaText(row && row.ga)
    const dpt = normalizeAreaText(row && row.dpt)
    if (ga) area.gaSet.add(ga)
    if (dpt) area.dptSet.add(dpt)
    pushUniqueValue(area.sampleGAs, ga, 6)
    pushUniqueValue(area.sampleLabels, parsed && parsed.deviceLabel, 4)
    inferAreaTags({
      mainGroup: parsed && parsed.mainGroup,
      middleGroup: parsed && parsed.middleGroup,
      deviceLabel: parsed && parsed.deviceLabel,
      dpt
    }).forEach(tag => area.tags.add(tag))
  }

  rows.forEach((row) => {
    const ga = normalizeAreaText(row && row.ga)
    if (!ga) return
    const parsed = parseEtsHierarchyLabel(row && row.devicename)
    if (parsed.mainGroup || parsed.middleGroup) hierarchicalGaCount += 1

    if (parsed.mainGroup) {
      registerAreaRow({
        areaId: `main:${slugifyAreaText(parsed.mainGroup)}`,
        kind: 'main_group',
        name: parsed.mainGroup,
        parentName: '',
        pathTokens: [parsed.mainGroup],
        row,
        parsed
      })
    }

    if (parsed.mainGroup && parsed.middleGroup) {
      registerAreaRow({
        areaId: `secondary:${slugifyAreaText(parsed.mainGroup)}:${slugifyAreaText(parsed.middleGroup)}`,
        kind: 'secondary_group',
        name: parsed.middleGroup,
        parentName: parsed.mainGroup,
        pathTokens: [parsed.mainGroup, parsed.middleGroup],
        row,
        parsed
      })
    }
  })

  const suggested = Array.from(areasById.values())
    .map((entry) => {
      const gaCount = entry.gaSet.size
      const dptCount = entry.dptSet.size
      const path = entry.pathTokens.join(' / ')
      return {
        id: entry.id,
        kind: entry.kind,
        name: entry.name,
        baseName: entry.name,
        parentId: entry.kind === 'secondary_group' ? `main:${slugifyAreaText(entry.parentName)}` : '',
        parentName: entry.parentName,
        baseParentName: entry.parentName,
        path,
        basePath: path,
        gaCount,
        dptCount,
        gaList: Array.from(entry.gaSet.values()).sort(),
        dptList: Array.from(entry.dptSet.values()).sort(),
        tags: Array.from(entry.tags.values()).sort(),
        baseTags: Array.from(entry.tags.values()).sort(),
        sampleGAs: entry.sampleGAs.slice(0, 6),
        sampleLabels: entry.sampleLabels.slice(0, 4),
        description: entry.kind === 'secondary_group'
          ? `${entry.parentName || 'ETS'} / ${entry.name} (${gaCount} GA)`
          : `${entry.name} (${gaCount} GA)`,
        priority: entry.kind === 'secondary_group' ? 2 : 1
      }
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      if (b.gaCount !== a.gaCount) return b.gaCount - a.gaCount
      return String(a.path || a.name || '').localeCompare(String(b.path || b.name || ''))
    })

  return {
    source: rows.length ? 'ets_csv' : 'none',
    generatedAt: new Date().toISOString(),
    totals: {
      gaCount: rows.length,
      hierarchicalGaCount,
      suggestedAreaCount: suggested.length,
      secondaryGroupCount,
      mainGroupCount
    },
    suggested
  }
}

const buildGaCatalogFromCsv = (csv) => {
  const rows = Array.isArray(csv) ? csv : []
  const byGa = new Map()
  rows.forEach((row) => {
    const ga = normalizeAreaText(row && row.ga)
    if (!ga || byGa.has(ga)) return
    const parsed = parseEtsHierarchyLabel(row && row.devicename)
    const dpt = normalizeAreaText(row && row.dpt)
    const label = normalizeAreaText(parsed.deviceLabel || row.devicename || ga)
    const roleDetails = inferSignalRoleDetails({ label, dpt })
    const tags = inferAreaTags({
      mainGroup: parsed.mainGroup,
      middleGroup: parsed.middleGroup,
      deviceLabel: label,
      dpt
    })
    byGa.set(ga, {
      ga,
      dpt,
      label,
      etsName: normalizeAreaText(row && row.devicename),
      baseRole: roleDetails.role,
      baseRoleSource: roleDetails.source,
      role: roleDetails.role,
      roleSource: roleDetails.source,
      roleOverride: 'auto',
      mainGroup: parsed.mainGroup || '',
      middleGroup: parsed.middleGroup || '',
      hierarchyPath: parsed.hierarchyPath || '',
      tags,
      valueOptions: getDptValueOptions(dpt)
    })
  })
  return Array.from(byGa.values())
    .sort((a, b) => {
      const left = `${a.hierarchyPath} ${a.label} ${a.ga}`.trim()
      const right = `${b.hierarchyPath} ${b.label} ${b.ga}`.trim()
      return left.localeCompare(right)
    })
}

const applyGaRoleOverridesToCatalog = ({ catalog, roleOverrides }) => {
  const rawCatalog = Array.isArray(catalog) ? catalog : []
  const overrides = roleOverrides && typeof roleOverrides === 'object' ? roleOverrides : {}
  return rawCatalog.map((item) => {
    const ga = String(item && item.ga ? item.ga : '').trim()
    const overrideRole = normalizeGaRoleValue(overrides[ga], 'auto')
    return Object.assign({}, item, {
      role: overrideRole === 'auto' ? normalizeGaRoleValue(item && item.baseRole ? item.baseRole : item && item.role ? item.role : 'neutral', 'neutral') : overrideRole,
      roleSource: overrideRole === 'auto'
        ? String(item && item.baseRoleSource ? item.baseRoleSource : item && item.roleSource ? item.roleSource : 'unknown_rule')
        : 'user_override',
      roleOverride: overrideRole
    })
  })
}

const isAmbiguousGaRoleSource = (source) => {
  const value = normalizeAreaText(source).toLowerCase()
  return value === 'dpt_rule' || value === 'unknown_rule'
}

const normalizeGaRoleSuggestionPayload = ({ payload, gaCatalogMap }) => {
  const parsed = payload && typeof payload === 'object' ? payload : {}
  const rawRoles = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.roles)
      ? parsed.roles
      : Array.isArray(parsed.items)
        ? parsed.items
        : []
  const overrides = {}
  rawRoles.forEach((entry) => {
    const ga = normalizeAreaText(entry && (entry.ga || entry.groupAddress || entry.address))
    if (!ga || !gaCatalogMap.has(ga)) return
    const role = normalizeGaRoleValue(entry && entry.role, 'auto')
    if (role === 'auto') return
    overrides[ga] = role
  })
  return overrides
}

const normalizeLanguageCode = (value, fallback = 'en') => {
  const raw = normalizeAreaText(value).toLowerCase()
  if (!raw) return fallback
  const match = raw.match(/^[a-z]{2,3}/)
  return match ? match[0] : fallback
}

const extractLanguageCodeFromHeader = (value, fallback = 'en') => {
  const raw = normalizeAreaText(value)
  if (!raw) return fallback
  const first = raw.split(',')[0] || ''
  return normalizeLanguageCode(first, fallback)
}

const languageNameFromCode = (value) => {
  const code = normalizeLanguageCode(value, 'en')
  const map = {
    it: 'Italian',
    en: 'English',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    pt: 'Portuguese',
    nl: 'Dutch'
  }
  return map[code] || code
}

const enrichSuggestedAreasWithSummary = ({ baseSnapshot, summary }) => {
  const snapshot = baseSnapshot && typeof baseSnapshot === 'object' ? baseSnapshot : buildSuggestedAreasFromCsv([])
  const gaLastSeenAt = summary && typeof summary.gaLastSeenAt === 'object' ? summary.gaLastSeenAt : {}
  const gaLastPayload = summary && typeof summary.gaLastPayload === 'object' ? summary.gaLastPayload : {}
  const analysisWindowSec = Math.max(30, Number(summary && summary.meta && summary.meta.analysisWindowSec) || 0)
  const activeCutoffMs = nowMs() - (analysisWindowSec * 1000)
  let activeAreaCount = 0

  const suggested = (Array.isArray(snapshot.suggested) ? snapshot.suggested : []).map((area) => {
    let activeGaCount = 0
    let lastSeenAtMs = 0
    const recentPayloads = []
      ; (Array.isArray(area.sampleGAs) ? area.sampleGAs : []).forEach((ga) => {
      const ts = new Date(String(gaLastSeenAt[ga] || '')).getTime()
      if (Number.isFinite(ts) && ts > 0) {
        lastSeenAtMs = Math.max(lastSeenAtMs, ts)
        if (ts >= activeCutoffMs) activeGaCount += 1
      }
      if (gaLastPayload[ga] !== undefined) {
        pushUniqueValue(recentPayloads, `${ga}: ${compactPayloadForNodeLabel(gaLastPayload[ga], 22)}`, 4)
      }
    })
    if (activeGaCount > 0) activeAreaCount += 1
    return Object.assign({}, area, {
      activeGaCount,
      activityPct: area.gaCount > 0 ? roundTo((activeGaCount / area.gaCount) * 100, 1) : 0,
      lastSeenAt: lastSeenAtMs > 0 ? new Date(lastSeenAtMs).toISOString() : '',
      recentPayloads
    })
  })

  return {
    source: snapshot.source || 'none',
    generatedAt: new Date().toISOString(),
    totals: Object.assign({}, snapshot.totals || {}, {
      activeAreaCount
    }),
    suggested
  }
}

const buildAreasPromptContext = (areasSnapshot) => {
  const suggested = Array.isArray(areasSnapshot && areasSnapshot.suggested) ? areasSnapshot.suggested : []
  if (!suggested.length) return ''
  const lines = suggested.slice(0, 12).map((area) => {
    const tags = Array.isArray(area.tags) && area.tags.length ? ` tags=${area.tags.join(',')}` : ''
    const activity = area.gaCount > 0 ? ` active=${Number(area.activeGaCount || 0)}/${Number(area.gaCount || 0)}` : ''
    return `- ${area.path || area.name} [${area.kind}]${activity}${tags}`
  })
  return [
    'Suggested installation areas derived from ETS hierarchy:',
    lines.join('\n')
  ].join('\n')
}

const ensureDirectorySync = (dirPath) => {
  const target = String(dirPath || '').trim()
  if (!target) return false
  try {
    fs.mkdirSync(target, { recursive: true })
    return true
  } catch (error) {
    return false
  }
}

const readJsonFileSafe = (filePath, fallbackValue) => {
  try {
    if (!fs.existsSync(filePath)) return fallbackValue
    const raw = fs.readFileSync(filePath, 'utf8')
    if (!raw || String(raw).trim() === '') return fallbackValue
    return JSON.parse(raw)
  } catch (error) {
    return fallbackValue
  }
}

const normalizeAreaOverridePayload = (payload) => {
  const p = payload && typeof payload === 'object' ? payload : {}
  const normalized = {}
  if (Object.prototype.hasOwnProperty.call(p, 'name')) normalized.name = normalizeAreaText(p.name)
  if (Object.prototype.hasOwnProperty.call(p, 'description')) normalized.description = normalizeAreaText(p.description)
  if (Object.prototype.hasOwnProperty.call(p, 'deleted')) normalized.deleted = p.deleted === true
  if (Object.prototype.hasOwnProperty.call(p, 'tags')) {
    normalized.tags = Array.isArray(p.tags)
      ? Array.from(new Set(p.tags.map(tag => slugifyAreaText(tag)).filter(Boolean))).slice(0, 12)
      : []
  }
  if (Object.prototype.hasOwnProperty.call(p, 'gaList')) {
    normalized.gaList = Array.isArray(p.gaList)
      ? Array.from(new Set(p.gaList.map(ga => normalizeAreaText(ga)).filter(Boolean))).slice(0, 5000)
      : []
  }
  return normalized
}

const normalizeCustomAreaId = (value, fallback = '') => {
  const raw = normalizeAreaText(value || fallback)
  const slug = slugifyAreaText(raw)
  return slug ? `custom:${slug}` : ''
}

const applyAreaOverridesToSnapshot = ({ snapshot, overrides, gaCatalog }) => {
  const baseSnapshot = snapshot && typeof snapshot === 'object' ? snapshot : buildSuggestedAreasFromCsv([])
  const rawOverrides = overrides && typeof overrides === 'object' ? overrides : {}
  const gaCatalogMap = new Map((Array.isArray(gaCatalog) ? gaCatalog : []).map(item => [String(item && item.ga ? item.ga : '').trim(), item]))
  const baseAreas = Array.isArray(baseSnapshot.suggested) ? baseSnapshot.suggested : []
  const byId = new Map()

  baseAreas.forEach((area) => {
    const override = rawOverrides[area.id] && typeof rawOverrides[area.id] === 'object'
      ? normalizeAreaOverridePayload(rawOverrides[area.id])
      : {}
    if (override.deleted === true) return
    byId.set(area.id, Object.assign({}, area, {
      customName: Object.prototype.hasOwnProperty.call(override, 'name') ? override.name : '',
      customDescription: Object.prototype.hasOwnProperty.call(override, 'description') ? override.description : '',
      customTags: Object.prototype.hasOwnProperty.call(override, 'tags') ? override.tags : null,
      customGaList: Object.prototype.hasOwnProperty.call(override, 'gaList') ? override.gaList : null,
      hasOverride: Object.keys(override).length > 0
    }))
  })

  Object.keys(rawOverrides).forEach((overrideId) => {
    if (byId.has(overrideId)) return
    const override = normalizeAreaOverridePayload(rawOverrides[overrideId])
    if (override.deleted === true) return
    const customGaList = Array.isArray(override.gaList) ? override.gaList.filter(ga => gaCatalogMap.has(ga)) : []
    const inferredTags = new Set(Array.isArray(override.tags) ? override.tags : [])
    const sampleLabels = []
    const dptSet = new Set()
    customGaList.forEach((ga) => {
      const item = gaCatalogMap.get(ga)
      if (!item) return
      if (item.dpt) dptSet.add(item.dpt)
      pushUniqueValue(sampleLabels, item.label, 4)
      ; (Array.isArray(item.tags) ? item.tags : []).forEach(tag => inferredTags.add(tag))
    })
    const customName = normalizeAreaText(override.name || overrideId.replace(/^custom:/, ''))
    const isLlmGenerated = String(overrideId || '').startsWith('llm:')
    byId.set(overrideId, {
      id: overrideId,
      kind: isLlmGenerated ? 'custom_llm' : 'custom_manual',
      name: customName,
      baseName: customName,
      parentId: '',
      parentName: '',
      baseParentName: '',
      path: customName,
      basePath: customName,
      gaCount: customGaList.length,
      dptCount: dptSet.size,
      gaList: customGaList,
      dptList: Array.from(dptSet.values()).sort(),
      tags: Array.from(inferredTags.values()).sort(),
      baseTags: Array.from(inferredTags.values()).sort(),
      sampleGAs: customGaList.slice(0, 6),
      sampleLabels,
      description: normalizeAreaText(override.description || `${customName} (${customGaList.length} GA)`),
      priority: 3,
      customName,
      customDescription: normalizeAreaText(override.description || ''),
      customTags: Array.isArray(override.tags) ? override.tags.slice(0, 12) : null,
      customGaList,
      hasOverride: true
    })
  })

  const resolveAreaName = (area) => normalizeAreaText((area && area.customName) || (area && area.baseName) || (area && area.name))

  byId.forEach((area) => {
    const parentArea = area.parentId ? byId.get(area.parentId) : null
    const resolvedName = resolveAreaName(area)
    const resolvedParentName = parentArea ? resolveAreaName(parentArea) : normalizeAreaText(area.baseParentName || area.parentName)
    const resolvedPath = parentArea
      ? [normalizeAreaText(parentArea.path || parentArea.name), resolvedName].filter(Boolean).join(' / ')
      : resolvedName
    let tags = Array.isArray(area.customTags) ? area.customTags.slice(0, 12) : (Array.isArray(area.baseTags) ? area.baseTags.slice(0, 12) : [])
    let gaList = Array.isArray(area.gaList) ? area.gaList.slice() : []
    let dptList = Array.isArray(area.dptList) ? area.dptList.slice() : []
    let sampleGAs = Array.isArray(area.sampleGAs) ? area.sampleGAs.slice(0, 6) : []
    let sampleLabels = Array.isArray(area.sampleLabels) ? area.sampleLabels.slice(0, 4) : []

    if (Array.isArray(area.gaList) && Array.isArray(area.customGaList)) {
      const filtered = area.customGaList
        .filter(ga => gaCatalogMap.has(ga))
      gaList = filtered
      const nextDptSet = new Set()
      const nextLabelSet = []
      const inferredTags = new Set()
      filtered.forEach((ga) => {
        const item = gaCatalogMap.get(ga)
        if (!item) return
        if (item.dpt) nextDptSet.add(item.dpt)
        pushUniqueValue(nextLabelSet, item.label, 4)
        ; (Array.isArray(item.tags) ? item.tags : []).forEach(tag => inferredTags.add(tag))
      })
      dptList = Array.from(nextDptSet.values()).sort()
      sampleGAs = filtered.slice(0, 6)
      sampleLabels = nextLabelSet
      if (!Array.isArray(area.customTags)) tags = Array.from(inferredTags.values()).sort()
    }
    const gaCount = gaList.length
    const dptCount = dptList.length
    const description = area.customDescription !== ''
      ? area.customDescription
      : area.kind === 'secondary_group'
        ? `${resolvedParentName || 'ETS'} / ${resolvedName} (${gaCount} GA)`
        : `${resolvedName} (${gaCount} GA)`
    Object.assign(area, {
      name: resolvedName,
      parentName: resolvedParentName,
      path: resolvedPath,
      tags,
      description,
      gaList,
      dptList,
      gaCount,
      dptCount,
      sampleGAs,
      sampleLabels
    })
  })

  return Object.assign({}, baseSnapshot, {
    generatedAt: new Date().toISOString(),
    suggested: Array.from(byId.values())
  })
}

const DEFAULT_AREA_PROFILES = [
  {
    id: 'area_diagnostic',
    builtIn: true,
    name: 'Control Area',
    description: 'General read-only diagnostic of the selected area based on ETS structure and current KNX activity.',
    minActivityPct: 20,
    maxSilentPct: 60,
    maxAnomalies: 2,
    targetTags: []
  },
  {
    id: 'lighting_area',
    builtIn: true,
    name: 'Lighting Area',
    description: 'Focus on lighting-oriented areas and highlight low activity or repeated anomalies.',
    minActivityPct: 15,
    maxSilentPct: 70,
    maxAnomalies: 1,
    targetTags: ['lighting']
  },
  {
    id: 'hvac_area',
    builtIn: true,
    name: 'HVAC Area',
    description: 'Focus on HVAC-oriented areas and check whether the related addresses are alive.',
    minActivityPct: 10,
    maxSilentPct: 80,
    maxAnomalies: 1,
    targetTags: ['hvac']
  }
]

const clampNumber = (value, { min = 0, max = 100, fallback = 0 } = {}) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  if (n < min) return min
  if (n > max) return max
  return n
}

const normalizeProfileText = (value, fallback = '') => normalizeAreaText(value || fallback)

const normalizeAreaProfilePayload = (payload, fallbackId = '') => {
  const p = payload && typeof payload === 'object' ? payload : {}
  const name = normalizeProfileText(p.name, 'Custom Area Profile')
  const baseId = normalizeAreaText(p.id || fallbackId || name)
  return {
    id: slugifyAreaText(baseId),
    builtIn: false,
    name,
    description: normalizeProfileText(p.description),
    minActivityPct: clampNumber(p.minActivityPct, { min: 0, max: 100, fallback: 20 }),
    maxSilentPct: clampNumber(p.maxSilentPct, { min: 0, max: 100, fallback: 60 }),
    maxAnomalies: clampNumber(p.maxAnomalies, { min: 0, max: 999, fallback: 2 }),
    targetTags: Array.isArray(p.targetTags)
      ? Array.from(new Set(p.targetTags.map(tag => slugifyAreaText(tag)).filter(Boolean))).slice(0, 12)
      : []
  }
}

const mergeAreaProfiles = ({ customProfiles }) => {
  const out = new Map()
  DEFAULT_AREA_PROFILES.forEach((profile) => {
    out.set(profile.id, Object.assign({}, profile))
  })
  ; (Array.isArray(customProfiles) ? customProfiles : []).forEach((profile, index) => {
    const normalized = normalizeAreaProfilePayload(profile, `custom-${index + 1}`)
    if (!normalized.id) return
    out.set(normalized.id, normalized)
  })
  return Array.from(out.values())
}

const severityRank = (status) => {
  const value = String(status || '').toLowerCase()
  if (value === 'fail') return 3
  if (value === 'warn') return 2
  if (value === 'pass') return 1
  return 0
}

const buildAreaProfileReport = ({ area, profile, summary, anomalies, generatedAt }) => {
  const safeArea = area && typeof area === 'object' ? area : {}
  const safeProfile = profile && typeof profile === 'object' ? profile : {}
  const safeSummary = summary && typeof summary === 'object' ? summary : {}
  const gaList = Array.isArray(safeArea.gaList) ? safeArea.gaList.slice() : []
  const gaSet = new Set(gaList.map(ga => String(ga || '').trim()).filter(Boolean))
  const gaLastSeenAt = safeSummary && typeof safeSummary.gaLastSeenAt === 'object' ? safeSummary.gaLastSeenAt : {}
  const gaLastPayload = safeSummary && typeof safeSummary.gaLastPayload === 'object' ? safeSummary.gaLastPayload : {}
  const analysisWindowSec = Math.max(30, Number(safeSummary && safeSummary.meta && safeSummary.meta.analysisWindowSec) || 0)
  const activeCutoffMs = nowMs() - (analysisWindowSec * 1000)
  const activeGAs = []
  const silentGAs = []

  gaList.forEach((ga) => {
    const ts = new Date(String(gaLastSeenAt[ga] || '')).getTime()
    if (Number.isFinite(ts) && ts > 0 && ts >= activeCutoffMs) {
      activeGAs.push(ga)
    } else {
      silentGAs.push(ga)
    }
  })

  const relevantAnomalies = (Array.isArray(anomalies) ? anomalies : [])
    .filter((entry) => {
      const ga = String(entry && entry.payload && entry.payload.ga ? entry.payload.ga : '').trim()
      return ga && gaSet.has(ga)
    })
    .slice(-50)
    .reverse()

  const totalGAs = gaList.length
  const activeGaCount = activeGAs.length
  const silentGaCount = silentGAs.length
  const activityPct = totalGAs > 0 ? roundTo((activeGaCount / totalGAs) * 100, 1) : 0
  const silentPct = totalGAs > 0 ? roundTo((silentGaCount / totalGAs) * 100, 1) : 0
  const tagMismatch = Array.isArray(safeProfile.targetTags) && safeProfile.targetTags.length > 0
    ? !safeProfile.targetTags.some(tag => Array.isArray(safeArea.tags) && safeArea.tags.includes(tag))
    : false

  const checks = [
    {
      id: 'scope_match',
      title: 'Profile scope alignment',
      status: tagMismatch ? 'warn' : 'pass',
      message: tagMismatch
        ? `Area tags ${Array.isArray(safeArea.tags) ? safeArea.tags.join(', ') : 'n/a'} do not match profile focus ${safeProfile.targetTags.join(', ')}.`
        : 'Area tags are compatible with the selected profile.',
      metrics: {
        areaTags: Array.isArray(safeArea.tags) ? safeArea.tags : [],
        targetTags: Array.isArray(safeProfile.targetTags) ? safeProfile.targetTags : []
      }
    },
    {
      id: 'activity',
      title: 'Area activity',
      status: activityPct >= Number(safeProfile.minActivityPct || 0) ? 'pass' : (activityPct > 0 ? 'warn' : 'fail'),
      message: `${activeGaCount}/${totalGAs} GA active in the last ${analysisWindowSec}s.`,
      metrics: {
        activeGaCount,
        totalGAs,
        activityPct,
        minActivityPct: Number(safeProfile.minActivityPct || 0)
      }
    },
    {
      id: 'silence',
      title: 'Silent addresses',
      status: silentPct <= Number(safeProfile.maxSilentPct || 100) ? 'pass' : (silentPct < 100 ? 'warn' : 'fail'),
      message: `${silentGaCount}/${totalGAs} GA silent in the current analysis window.`,
      metrics: {
        silentGaCount,
        totalGAs,
        silentPct,
        maxSilentPct: Number(safeProfile.maxSilentPct || 0)
      },
      sample: silentGAs.slice(0, 10).map(ga => ({
        ga,
        lastPayload: gaLastPayload[ga] || ''
      }))
    },
    {
      id: 'anomalies',
      title: 'Recent anomalies in area',
      status: relevantAnomalies.length <= Number(safeProfile.maxAnomalies || 0) ? 'pass' : 'warn',
      message: `${relevantAnomalies.length} recent anomalies match the selected area.`,
      metrics: {
        anomalyCount: relevantAnomalies.length,
        maxAnomalies: Number(safeProfile.maxAnomalies || 0)
      }
    }
  ]

  const suggestions = []
  if (tagMismatch) suggestions.push('Check whether the selected profile is appropriate for this area or add matching tags.')
  if (activityPct < Number(safeProfile.minActivityPct || 0)) suggestions.push('Run a guided verification on the area or trigger live activity before diagnosing.')
  if (silentGaCount > 0) suggestions.push('Inspect the silent GA list first: they are the best candidates for missing feedback or dormant devices.')
  if (relevantAnomalies.length > Number(safeProfile.maxAnomalies || 0)) suggestions.push('Open the anomaly list for this area and correlate the failing GA with the ETS object names.')
  if (!suggestions.length) suggestions.push('Area looks consistent in read-only mode. Continue with a focused active test only if the issue is still reproducible.')

  const overallStatus = checks
    .map(check => check.status)
    .sort((a, b) => severityRank(b) - severityRank(a))[0] || 'pass'

  return {
    id: `${safeProfile.id || 'profile'}:${safeArea.id || 'area'}:${Date.now()}`,
    generatedAt: generatedAt || new Date().toISOString(),
    mode: 'read_only',
    overallStatus,
    source: {
      type: 'profile',
      profileId: safeProfile.id || '',
      areaId: safeArea.id || ''
    },
    profile: {
      id: safeProfile.id || '',
      name: safeProfile.name || '',
      description: safeProfile.description || '',
      builtIn: safeProfile.builtIn === true
    },
    area: {
      id: safeArea.id || '',
      name: safeArea.name || '',
      path: safeArea.path || safeArea.name || '',
      tags: Array.isArray(safeArea.tags) ? safeArea.tags : []
    },
    metrics: {
      totalGAs,
      activeGaCount,
      silentGaCount,
      activityPct,
      silentPct,
      anomalyCount: relevantAnomalies.length,
      analysisWindowSec
    },
    checks,
    suggestions,
    anomalyHighlights: relevantAnomalies.slice(0, 8).map((entry) => ({
      at: entry.at || '',
      type: entry && entry.payload ? entry.payload.type : '',
      ga: entry && entry.payload ? entry.payload.ga : '',
      payload: entry && entry.payload ? entry.payload : {}
    }))
  }
}

const parseActuatorPayloadInput = (value) => {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') return value
  const raw = value.trim()
  if (raw === '') return ''
  if (/^(true|false)$/i.test(raw)) return raw.toLowerCase() === 'true'
  if (/^[+-]?\d+(?:\.\d+)?$/.test(raw)) return Number(raw)
  if ((raw.startsWith('{') && raw.endsWith('}')) || (raw.startsWith('[') && raw.endsWith(']'))) {
    try {
      return JSON.parse(raw)
    } catch (error) {
      return raw
    }
  }
  return raw
}

const normalizeActuatorTestPresetPayload = (payload, fallbackId = '') => {
  const p = payload && typeof payload === 'object' ? payload : {}
  const name = normalizeProfileText(p.name, 'Actuator Test')
  const baseId = normalizeAreaText(p.id || fallbackId || name)
  const sharedTimeout = clampNumber(p.timeoutMs, { min: 500, max: 60000, fallback: 5000 })
  return {
    id: slugifyAreaText(baseId),
    name,
    description: normalizeProfileText(p.description),
    commandGA: normalizeAreaText(p.commandGA),
    commandDPT: normalizeAreaText(p.commandDPT),
    commandPayload: typeof p.commandPayload === 'string' ? p.commandPayload : safeStringify(p.commandPayload),
    statusGA: normalizeAreaText(p.statusGA),
    statusDPT: normalizeAreaText(p.statusDPT),
    statusWriteTimeoutMs: clampNumber(p.statusWriteTimeoutMs !== undefined ? p.statusWriteTimeoutMs : p.timeoutMs, { min: 500, max: 60000, fallback: sharedTimeout }),
    statusResponseTimeoutMs: clampNumber(p.statusResponseTimeoutMs !== undefined ? p.statusResponseTimeoutMs : p.timeoutMs, { min: 500, max: 60000, fallback: sharedTimeout })
  }
}

const mergeActuatorTestPresets = ({ customPresets }) => {
  return (Array.isArray(customPresets) ? customPresets : [])
    .map((preset, index) => normalizeActuatorTestPresetPayload(preset, `actuator-${index + 1}`))
    .filter(preset => preset.id && preset.commandGA && preset.commandDPT)
}

const SIGNAL_STATUS_RE = /\b(status|state|feedback|fb|stato|riscontro|indicazione|actual|actual value|current state)\b/i
const SIGNAL_COMMAND_RE = /\b(command|cmd|switch|control|set|setpoint|on\/off|dim|dimmer|move|step|up|down|open|close|toggle|scene|comando|attiva|attivazione|start|stop)\b/i
const SIGNAL_SENSOR_RE = /\b(sensor|misura|measure|actual|temperature|temperatura|humidity|umidita|lux|brightness|illuminance|co2|meter|energy|power|consumption|wind|rain|anemometer|counter)\b/i
const SIGNAL_CATEGORY_RULES = [
  { id: 'lighting', pattern: /\b(light|lights|lighting|luce|luci|lamp|dimmer|dim)\b/i },
  { id: 'hvac', pattern: /\b(hvac|clima|climate|fan\s?coil|fancoil|heating|cooling|thermo|temp|temperature|setpoint|mode)\b/i },
  { id: 'shading', pattern: /\b(blind|blinds|shutter|shutters|jalousie|curtain|curtains|tapparella|tapparelle|venetian)\b/i },
  { id: 'access', pattern: /\b(door|doors|window|windows|lock|unlock|badge|porta|porte|finestra|finestre|serratura)\b/i },
  { id: 'scene', pattern: /\b(scene|scenario|scena)\b/i }
]

const normalizeSignalText = (value) => normalizeAreaText(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()

const ACTION_PATTERN_GROUPS = [
  {
    type: 'on',
    patterns: [
      /\bturn on\b/g, /\bturn(?:\s+\w+){1,4}\s+on\b/g,
      /\bswitch on\b/g, /\bswitch(?:\s+\w+){1,4}\s+on\b/g,
      /\bpower on\b/g, /\bpower(?:\s+\w+){1,4}\s+on\b/g,
      /\bstart\b/g, /\benable\b/g, /\bactivate\b/g,
      /\baccendi\b/g, /\battiva\b/g,
      /\ballume\b/g, /\bactive\b/g,
      /\beinschalten\b/g, /\baktivieren\b/g,
      /\benciende\b/g, /\bactivar\b/g,
      /\bliga\b/g, /\bativa\b/g,
      /\baan\b/g, /\binschakelen\b/g
    ]
  },
  {
    type: 'off',
    patterns: [
      /\bturn off\b/g, /\bturn(?:\s+\w+){1,4}\s+off\b/g,
      /\bswitch off\b/g, /\bswitch(?:\s+\w+){1,4}\s+off\b/g,
      /\bpower off\b/g, /\bpower(?:\s+\w+){1,4}\s+off\b/g,
      /\bdisable\b/g, /\bdeactivate\b/g, /\bshutdown\b/g,
      /\bspegni\b/g, /\bdisattiva\b/g,
      /\beteins\b/g, /\bdesactive\b/g,
      /\bausschalten\b/g, /\bdeaktivieren\b/g,
      /\bapaga\b/g, /\bdesactiva\b/g,
      /\bdesliga\b/g, /\bdesativa\b/g,
      /\buit\b/g, /\buitschakelen\b/g
    ]
  },
  {
    type: 'open',
    patterns: [
      /\bopen\b/g, /\braise\b/g, /\blift\b/g, /\bmove up\b/g,
      /\bapri\b/g, /\balza\b/g, /\bsolleva\b/g,
      /\bouvre\b/g, /\bmonte\b/g,
      /\boffnen\b/g, /\bhoch\b/g, /\bauf\b/g,
      /\babre\b/g, /\bsube\b/g,
      /\babrir\b/g, /\bsobe\b/g,
      /\bopenen\b/g, /\bomhoog\b/g
    ]
  },
  {
    type: 'close',
    patterns: [
      /\bclose\b/g, /\blower\b/g, /\bmove down\b/g,
      /\bchiudi\b/g, /\babbassa\b/g,
      /\bferme\b/g, /\bdescends?\b/g,
      /\bschliessen\b/g, /\brunter\b/g, /\bzu\b/g,
      /\bcierra\b/g, /\bbaja\b/g,
      /\bfechar\b/g, /\bdesce\b/g,
      /\bsluiten\b/g, /\bomlaag\b/g
    ]
  },
  {
    type: 'stop',
    patterns: [
      /\bstop\b/g, /\bhalt\b/g, /\bpause\b/g,
      /\bferma\b/g, /\barresta\b/g,
      /\barrete\b/g, /\bstoppe\b/g,
      /\banhalten\b/g, /\bstopp\b/g,
      /\bdeten\b/g, /\bparar\b/g,
      /\bpare\b/g,
      /\bstoppen\b/g
    ]
  }
]

const extractActionHitsFromText = (value) => {
  const text = normalizeSignalText(value)
  if (!text) return []
  const hits = []
  ACTION_PATTERN_GROUPS.forEach((group) => {
    group.patterns.forEach((regex) => {
      regex.lastIndex = 0
      let match
      while ((match = regex.exec(text)) !== null) {
        hits.push({ type: group.type, index: match.index, raw: match[0] })
      }
    })
  })
  return hits.sort((a, b) => a.index - b.index)
}

const detectPrimaryActionFromText = (value) => {
  const hits = extractActionHitsFromText(value)
  return hits[0] ? hits[0].type : ''
}

const actionImpliesTruthy = (action) => ['on', 'open'].includes(String(action || '').trim().toLowerCase())
const actionImpliesFalsy = (action) => ['off', 'close', 'stop'].includes(String(action || '').trim().toLowerCase())

const tokenizeSignalText = (value) => normalizeSignalText(value)
  .replace(/[()[\]{}]/g, ' ')
  .split(/[^a-z0-9]+/i)
  .map(token => token.trim())
  .filter(token => token.length >= 2)

const normalizeSignalStem = (value) => normalizeSignalText(value)
  .replace(/\b(status|state|feedback|fb|stato|riscontro|indicazione|command|cmd|control|set|switch|actual|value|current)\b/g, ' ')
  .replace(/\b(on|off|up|down|open|close)\b/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const parseGaTriplet = (value) => {
  const match = String(value || '').trim().match(/^(\d+)\/(\d+)\/(\d+)$/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

const computeGaDistanceScore = (left, right) => {
  const a = parseGaTriplet(left)
  const b = parseGaTriplet(right)
  if (!a || !b) return 0
  let score = 0
  if (a[0] === b[0]) score += 1
  if (a[1] === b[1]) score += 2
  const delta = Math.abs(a[2] - b[2])
  if (delta === 0) return 0
  if (delta <= 1) score += 4
  else if (delta <= 3) score += 2
  else if (delta <= 8) score += 1
  return score
}

const tokenIntersectionSize = (leftTokens, rightTokens) => {
  const left = new Set(Array.isArray(leftTokens) ? leftTokens : [])
  const right = new Set(Array.isArray(rightTokens) ? rightTokens : [])
  let matches = 0
  left.forEach((token) => {
    if (right.has(token)) matches += 1
  })
  return matches
}

const sameDptFamily = (left, right) => {
  const a = String(left || '').trim().split('.')[0]
  const b = String(right || '').trim().split('.')[0]
  return !!a && !!b && a === b
}

const isLikelyWritableDpt = (dpt) => {
  const value = String(dpt || '').trim()
  if (!value) return false
  return /^(1|2|3|5|6|7|8|9|14|17|18|20)\./.test(value)
}

const inferSignalCategory = ({ label, areaTags }) => {
  const text = [label, ...(Array.isArray(areaTags) ? areaTags : [])].filter(Boolean).join(' ')
  for (const rule of SIGNAL_CATEGORY_RULES) {
    if (rule.pattern.test(text)) return rule.id
  }
  return ''
}

const inferSignalRoleDetails = ({ label, dpt }) => {
  const text = normalizeSignalText(label)
  if (!text) return { role: 'neutral', source: 'unknown_rule' }
  if (SIGNAL_STATUS_RE.test(text)) return { role: 'status', source: 'status_rule' }
  if (SIGNAL_SENSOR_RE.test(text) && !SIGNAL_COMMAND_RE.test(text)) return { role: 'neutral', source: 'sensor_rule' }
  if (SIGNAL_COMMAND_RE.test(text)) return { role: 'command', source: 'command_rule' }
  if (isLikelyWritableDpt(dpt)) return { role: 'command', source: 'dpt_rule' }
  return { role: 'neutral', source: 'unknown_rule' }
}

const inferSignalRole = ({ label, dpt }) => {
  return inferSignalRoleDetails({ label, dpt }).role
}

const scoreSignalPair = ({ command, status }) => {
  if (!command || !status) return 0
  if (String(command.ga || '').trim() === String(status.ga || '').trim()) return 0
  let score = 0
  const commandStem = String(command.stem || '').trim()
  const statusStem = String(status.stem || '').trim()
  if (commandStem && statusStem && commandStem === statusStem) score += 10
  const commandTokens = tokenizeSignalText(command.label || commandStem)
  const statusTokens = tokenizeSignalText(status.label || statusStem)
  score += tokenIntersectionSize(commandTokens, statusTokens) * 2
  if (command.category && status.category && command.category === status.category) score += 2
  if (sameDptFamily(command.dpt, status.dpt)) score += 1
  if (command.hierarchyPath && status.hierarchyPath && command.hierarchyPath === status.hierarchyPath) score += 3
  if (command.mainGroup && status.mainGroup && command.mainGroup === status.mainGroup) score += 1
  if (command.middleGroup && status.middleGroup && command.middleGroup === status.middleGroup) score += 2
  score += computeGaDistanceScore(command.ga, status.ga)
  return score
}

const scoreCommandSignalForStep = ({ signal, step, prompt }) => {
  if (!signal || !step) return -1
  const rawCommandRef = normalizeSignalText(step.commandGA || '')
  const stepText = [
    step.title,
    step.description,
    step.reason,
    rawCommandRef,
    prompt
  ].filter(Boolean).join(' ')
  const stepTokens = tokenizeSignalText(stepText)
  const signalTokens = tokenizeSignalText([
    signal.label,
    signal.hierarchyPath,
    signal.category,
    signal.ga
  ].filter(Boolean).join(' '))
  let score = 0
  if (rawCommandRef) {
    const signalGa = normalizeSignalText(signal.ga)
    const signalLabel = normalizeSignalText(signal.label)
    const signalPath = normalizeSignalText(signal.hierarchyPath)
    if (rawCommandRef === signalGa) score += 100
    if (signalLabel && rawCommandRef === signalLabel) score += 80
    if (signalPath && rawCommandRef === signalPath) score += 70
    if (signalLabel && rawCommandRef && (signalLabel.includes(rawCommandRef) || rawCommandRef.includes(signalLabel))) score += 25
    if (signalPath && rawCommandRef && (signalPath.includes(rawCommandRef) || rawCommandRef.includes(signalPath))) score += 18
  }
  score += tokenIntersectionSize(stepTokens, signalTokens) * 4
  const stepStem = normalizeSignalStem(stepText)
  const signalStem = normalizeSignalStem([signal.label, signal.hierarchyPath].filter(Boolean).join(' '))
  if (stepStem && signalStem && stepStem === signalStem) score += 18
  if (step.commandDPT && signal.dpt && sameDptFamily(step.commandDPT, signal.dpt)) score += 6
  if (signal.role === 'command') score += 3
  return score
}

const resolveCommandSignalForStep = ({ step, catalog, prompt }) => {
  const commandSignals = Array.isArray(catalog && catalog.commandSignals) ? catalog.commandSignals : []
  if (!commandSignals.length) return null
  const exactGa = normalizeAreaText(step && step.commandGA)
  if (exactGa) {
    const exact = commandSignals.find(signal => signal && signal.ga === exactGa)
    if (exact) return exact
  }
  return commandSignals
    .map(signal => ({ signal, score: scoreCommandSignalForStep({ signal, step, prompt }) }))
    .sort((a, b) => b.score - a.score)[0]?.score > 0
    ? commandSignals
      .map(signal => ({ signal, score: scoreCommandSignalForStep({ signal, step, prompt }) }))
      .sort((a, b) => b.score - a.score)[0].signal
    : null
}

const toPlanPayloadString = (value, fallback = '') => {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'string') return value.trim()
  return safeStringify(value)
}

const normalizeTestPlanStepPayload = (payload, fallbackId = '') => {
  const p = payload && typeof payload === 'object' ? payload : {}
  const command = p.command && typeof p.command === 'object' ? p.command : {}
  const status = p.status && typeof p.status === 'object' ? p.status : {}
  const baseId = normalizeAreaText(p.id || fallbackId || `step-${Date.now()}`)
  const statusGA = normalizeAreaText(p.statusGA || status.ga)
  const kind = normalizeAreaText(p.kind || (statusGA ? 'write_and_verify' : 'write_only')).toLowerCase()
  const title = normalizeProfileText(p.title, 'KNX active test step')
  const description = normalizeProfileText(p.description)
  const reason = normalizeProfileText(p.reason)
  const action = normalizeAreaText(p.action).toLowerCase()
  const normalizedKind = ['write_and_verify', 'write_only', 'wait'].includes(kind) ? kind : (statusGA ? 'write_and_verify' : 'write_only')
  if (normalizedKind === 'wait') {
    return {
      id: slugifyAreaText(baseId),
      kind: 'wait',
      action: '',
      title: normalizeProfileText(p.title, 'Wait'),
      description,
      reason,
      delayMs: clampNumber(p.delayMs !== undefined ? p.delayMs : p.readDelayMs, { min: 0, max: 30000, fallback: 1200 }),
      commandGA: '',
      commandDPT: '',
      commandPayload: '',
      statusGA: '',
      statusDPT: '',
      expectedPayload: '',
      statusWriteTimeoutMs: 0,
      statusResponseTimeoutMs: 0
    }
  }
  const sharedTimeout = clampNumber(p.timeoutMs, { min: 500, max: 60000, fallback: 5000 })
  return {
    id: slugifyAreaText(baseId),
    kind: normalizedKind,
    action,
    title,
    description,
    reason,
    commandGA: normalizeAreaText(p.commandGA || command.ga),
    commandDPT: normalizeAreaText(p.commandDPT || command.dpt),
    commandPayload: resolvePayloadValueForDpt({
      value: p.commandPayload !== undefined ? p.commandPayload : command.payload,
      dptId: p.commandDPT || command.dpt,
      contextText: `${title} ${description} ${reason}`,
      action
    }),
    statusGA,
    statusDPT: normalizeAreaText(p.statusDPT || status.dpt),
    expectedPayload: resolvePayloadValueForDpt({
      value: toPlanPayloadString(
        p.expectedPayload !== undefined ? p.expectedPayload : (status.expectedPayload !== undefined ? status.expectedPayload : undefined),
        toPlanPayloadString(p.commandPayload !== undefined ? p.commandPayload : command.payload)
      ),
      dptId: p.statusDPT || status.dpt || p.commandDPT || command.dpt,
      contextText: `${title} ${description} ${reason}`,
      action
    }),
    statusWriteTimeoutMs: clampNumber(p.statusWriteTimeoutMs !== undefined ? p.statusWriteTimeoutMs : p.timeoutMs, { min: 500, max: 60000, fallback: sharedTimeout }),
    statusResponseTimeoutMs: clampNumber(p.statusResponseTimeoutMs !== undefined ? p.statusResponseTimeoutMs : p.timeoutMs, { min: 500, max: 60000, fallback: sharedTimeout })
  }
}

const normalizeAiTestPlanPayload = (payload, fallbackId = '') => {
  const p = payload && typeof payload === 'object' ? payload : {}
  const name = normalizeProfileText(p.name, 'KNX Active Test')
  const baseId = normalizeAreaText(p.id || fallbackId || name)
  const maxSteps = clampNumber(p.maxSteps, { min: 1, max: 500, fallback: 240 })
  return {
    id: slugifyAreaText(baseId),
    name,
    description: normalizeProfileText(p.description),
    areaId: normalizeAreaText(p.areaId),
    areaName: normalizeProfileText(p.areaName),
    prompt: normalizeProfileText(p.prompt),
    source: normalizeProfileText(p.source, 'ai'),
    generatedAt: normalizeProfileText(p.generatedAt, new Date().toISOString()),
    steps: (Array.isArray(p.steps) ? p.steps : [])
      .map((step, index) => normalizeTestPlanStepPayload(step, `${baseId || 'plan'}-step-${index + 1}`))
      .filter(step => step.id && (step.kind === 'wait' || (step.commandGA && step.commandDPT)))
      .slice(0, maxSteps)
  }
}

const mergeAiTestPlans = ({ customPlans }) => {
  return (Array.isArray(customPlans) ? customPlans : [])
    .map((plan, index) => normalizeAiTestPlanPayload(plan, `plan-${index + 1}`))
    .filter(plan => plan.id && plan.areaId && Array.isArray(plan.steps) && plan.steps.length > 0)
}

const extractTextFromContentParts = (value) => {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  const parts = []
  value.forEach((item) => {
    if (typeof item === 'string') {
      if (item.trim()) parts.push(item)
      return
    }
    if (!item || typeof item !== 'object') return
    if (typeof item.text === 'string' && item.text.trim()) {
      parts.push(item.text)
      return
    }
    if (typeof item.output_text === 'string' && item.output_text.trim()) {
      parts.push(item.output_text)
      return
    }
    if (item.type === 'text' && typeof item.value === 'string' && item.value.trim()) {
      parts.push(item.value)
      return
    }
    if (item.type === 'output_text' && typeof item.text === 'string' && item.text.trim()) {
      parts.push(item.text)
      return
    }
    if (item.type === 'refusal' && typeof item.refusal === 'string' && item.refusal.trim()) {
      parts.push(item.refusal)
    }
  })
  return parts.join('\n').trim()
}

const extractOpenAICompatText = (json) => {
  if (!json || typeof json !== 'object') return ''
  if (typeof json.output_text === 'string' && json.output_text.trim()) return json.output_text
  if (Array.isArray(json.output)) {
    const outputText = json.output
      .map(item => extractTextFromContentParts(item && typeof item === 'object' ? item.content : ''))
      .filter(Boolean)
      .join('\n')
      .trim()
    if (outputText) return outputText
  }
  const message = json && json.choices && json.choices[0] && json.choices[0].message
    ? json.choices[0].message
    : null
  if (!message || typeof message !== 'object') return ''
  if (typeof message.content === 'string' && message.content.trim()) return message.content
  const fromParts = extractTextFromContentParts(message.content)
  if (fromParts) return fromParts
  if (typeof message.refusal === 'string' && message.refusal.trim()) return message.refusal
  return ''
}

const buildOpenAICompatFallbackText = (json) => {
  const reason = String(json && json.choices && json.choices[0] && json.choices[0].finish_reason ? json.choices[0].finish_reason : '').trim()
  const usage = json && json.usage && typeof json.usage === 'object' ? json.usage : {}
  const promptTokens = Number(usage.prompt_tokens || 0)
  const completionTokens = Number(usage.completion_tokens || 0)
  const usageText = (promptTokens > 0 || completionTokens > 0)
    ? ` (prompt_tokens=${promptTokens}, completion_tokens=${completionTokens})`
    : ''
  if (reason === 'length') {
    return `The model stopped because of token limit${usageText}. Increase Max completion tokens and/or reduce prompt context (events/docs/flow), then retry.`
  }
  if (reason === 'content_filter') {
    return `The provider blocked the response with content filtering${usageText}.`
  }
  if (reason) {
    return `No assistant text was returned by the provider (finish_reason=${reason})${usageText}.`
  }
  return `No assistant text was returned by the provider${usageText}.`
}

const isOpenAICompatLengthFallbackText = (value) => {
  return /^The model stopped because of token limit\b/i.test(String(value || '').trim())
}

const DPT_OPTIONS_CACHE = new Map()

const getDptValueOptions = (dptId) => {
  const key = String(dptId || '').trim()
  if (!key) return []
  if (DPT_OPTIONS_CACHE.has(key)) return DPT_OPTIONS_CACHE.get(key) || []
  let options = []
  try {
    const resolved = dptlib.resolve(key)
    const enc = resolved && resolved.subtype ? resolved.subtype.enc : undefined
    if (Array.isArray(enc)) {
      options = enc.map((label, index) => ({
        value: index === 0 ? 'false' : (index === 1 ? 'true' : String(index)),
        label: String(label || '')
      })).filter(option => option.label)
    } else if (enc && typeof enc === 'object') {
      options = Object.keys(enc).map((value) => ({
        value: String(value),
        label: String(enc[value] || '')
      })).filter(option => option.label)
    }
  } catch (error) {
    options = []
  }
  DPT_OPTIONS_CACHE.set(key, options)
  return options
}

const resolvePayloadValueForDpt = ({ value, dptId, contextText = '', action = '' } = {}) => {
  const raw = toPlanPayloadString(value)
  const options = getDptValueOptions(dptId)
  if (!options.length) return raw

  const optionByValue = new Map(options.map(option => [String(option.value), option]))
  const normalizedRaw = normalizeSignalText(raw)
  const normalizedContext = normalizeSignalText(contextText)
  const combinedText = `${normalizedRaw} ${normalizedContext}`.trim()
  const resolvedAction = String(action || '').trim().toLowerCase() || detectPrimaryActionFromText(contextText || combinedText)

  if (resolvedAction) {
    if (actionImpliesTruthy(resolvedAction)) {
      const explicit = ['true', '1', '100'].find(candidate => optionByValue.has(candidate))
      if (explicit) return explicit
      const labelMatch = options.find(option => /\b(on|open|up|start|enable|enabled|active|acceso|accesa|aperto|aperta|su|einschalten|allume|enciende|liga|aan)\b/.test(normalizeSignalText(option.label)))
      if (labelMatch) return String(labelMatch.value)
    }
    if (actionImpliesFalsy(resolvedAction)) {
      const explicit = ['false', '0'].find(candidate => optionByValue.has(candidate))
      if (explicit) return explicit
      const labelMatch = options.find(option => /\b(off|close|down|stop|disable|disabled|inactive|chiuso|spento|giu|ausschalten|eteins|apaga|desliga|uit)\b/.test(normalizeSignalText(option.label)))
      if (labelMatch) return String(labelMatch.value)
    }
  }

  if (optionByValue.has(raw)) return raw

  const exactLabelMatch = options.find(option => normalizeSignalText(option.label) === normalizedRaw)
  if (exactLabelMatch) return String(exactLabelMatch.value)

  const containsLabelMatch = options.find(option => {
    const label = normalizeSignalText(option.label)
    return normalizedRaw && (label.includes(normalizedRaw) || normalizedRaw.includes(label))
  })
  if (containsLabelMatch) return String(containsLabelMatch.value)

  const trueLike = /\b(on|open|up|true|1|accendi|attiva|apri|su|acceso|accesa|accesi|accese|aperto|aperta|enabled|enable|start|allume|einschalten|enciende|liga|aan)\b/
  const falseLike = /\b(off|close|down|false|0|spegni|disattiva|chiudi|giu|spento|spenta|spenti|spente|chiuso|chiusa|disabled|disable|stop|ferma|eteins|ausschalten|apaga|desliga|uit)\b/

  if (trueLike.test(combinedText)) {
    const explicit = ['true', '1', '100'].find(candidate => optionByValue.has(candidate))
    if (explicit) return explicit
    const labelMatch = options.find(option => /\b(on|open|up|start|enable|enabled|active|acceso|accesa|aperto|aperta|su)\b/.test(normalizeSignalText(option.label)))
    if (labelMatch) return String(labelMatch.value)
  }
  if (falseLike.test(combinedText)) {
    const explicit = ['false', '0'].find(candidate => optionByValue.has(candidate))
    if (explicit) return explicit
    const labelMatch = options.find(option => /\b(off|close|down|stop|disable|disabled|inactive|spento|spenta|chiuso|chiusa|giu)\b/.test(normalizeSignalText(option.label)))
    if (labelMatch) return String(labelMatch.value)
  }

  return String(options[0].value)
}

const normalizePayloadForDptCompare = ({ value, dptId, contextText = '' } = {}) => {
  const normalized = resolvePayloadValueForDpt({ value, dptId, contextText })
  return normalizeValueForCompare(parseActuatorPayloadInput(normalized))
}

const formatPayloadForDptDisplay = ({ value, dptId, contextText = '' } = {}) => {
  const normalized = resolvePayloadValueForDpt({ value, dptId, contextText })
  const options = getDptValueOptions(dptId)
  if (options.length) {
    const hit = options.find(option => String(option.value) === String(normalized))
    if (hit && hit.label) return String(hit.label)
  }
  return normalizeValueForCompare(parseActuatorPayloadInput(normalized))
}

const normalizeTelegramEventName = (value) => String(value || '')
  .trim()
  .replace(/\s*\(.+?\)\s*/g, '')
  .trim()

const buildFallbackSvgChartFromSummary = ({ summary, question }) => {
  const s = summary || {}
  const topGAs = Array.isArray(s.topGAs) ? s.topGAs : []
  const byEvent = (s.byEvent && typeof s.byEvent === 'object') ? s.byEvent : {}

  let rows = topGAs
    .map((x) => ({ label: String((x && x.ga) || ''), value: Number((x && x.count) || 0) }))
    .filter(x => x.label && Number.isFinite(x.value) && x.value > 0)
    .slice(0, 8)

  let sourceLabel = 'Top Group Addresses'
  if (!rows.length) {
    rows = Object.keys(byEvent)
      .map((k) => ({ label: String(k || ''), value: Number(byEvent[k] || 0) }))
      .filter(x => x.label && Number.isFinite(x.value) && x.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
    sourceLabel = 'Events'
  }
  if (!rows.length) return ''

  const width = 920
  const height = 360
  const margin = { top: 56, right: 24, bottom: 84, left: 64 }
  const plotWidth = Math.max(120, width - margin.left - margin.right)
  const plotHeight = Math.max(120, height - margin.top - margin.bottom)
  const maxValue = Math.max(1, ...rows.map(r => Number(r.value || 0)))
  const slot = plotWidth / rows.length
  const barWidth = Math.max(12, Math.min(70, slot * 0.62))

  const yFor = (v) => margin.top + plotHeight - Math.round((Math.max(0, Number(v || 0)) / maxValue) * plotHeight)

  const bars = rows.map((r, idx) => {
    const cx = margin.left + (slot * idx) + (slot / 2)
    const x = Math.round(cx - (barWidth / 2))
    const y = yFor(r.value)
    const h = Math.max(1, margin.top + plotHeight - y)
    const labelY = margin.top + plotHeight + 18
    const valueY = Math.max(margin.top + 12, y - 6)
    const label = escapeXml(truncateLabel(r.label, 18))
    const val = Math.round(Number(r.value || 0))
    const fill = (idx % 2 === 0) ? '#1e73ff' : '#2fbf71'
    return [
      `<rect x="${x}" y="${y}" width="${Math.round(barWidth)}" height="${h}" rx="4" fill="${fill}" />`,
      `<text x="${Math.round(cx)}" y="${valueY}" font-size="11" text-anchor="middle" fill="#334155">${val}</text>`,
      `<text x="${Math.round(cx)}" y="${labelY}" font-size="11" text-anchor="middle" fill="#475569">${label}</text>`
    ].join('')
  }).join('')

  const titleQuestion = truncateLabel(String(question || 'KNX chart'), 58)
  const title = escapeXml(titleQuestion)
  const subTitle = escapeXml(`Source: ${sourceLabel}`)

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="KNX chart">`,
    '<rect x="0" y="0" width="100%" height="100%" fill="#ffffff"/>',
    `<text x="${margin.left}" y="28" font-family="Arial, sans-serif" font-size="18" fill="#0f172a">${title}</text>`,
    `<text x="${margin.left}" y="46" font-family="Arial, sans-serif" font-size="12" fill="#64748b">${subTitle}</text>`,
    `<line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${width - margin.right}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1"/>`,
    `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1"/>`,
    bars,
    '</svg>'
  ].join('')
}

const ensureSvgChartResponse = ({ question, summary, content }) => {
  const text = String(content || '')
  if (!shouldGenerateSvgChart(question)) return text
  if (SVG_PRESENT_RE.test(text)) return text
  const svg = buildFallbackSvgChartFromSummary({ summary, question })
  if (!svg) return text
  const header = 'SVG chart auto-generated from current KNX summary.'
  return `${text ? `${text}\n\n` : ''}${header}\n\n\`\`\`svg\n${svg}\n\`\`\``
}

const KNX_AI_DOCS_CACHE = {
  fileByPath: new Map(),
  helpIndexByLang: new Map(),
  wikiIndexByLang: new Map()
}

const readTextFileCached = (filePath, { maxBytes = 1024 * 1024 } = {}) => {
  try {
    const stat = fs.statSync(filePath)
    const key = String(filePath)
    const cached = KNX_AI_DOCS_CACHE.fileByPath.get(key)
    if (cached && cached.mtimeMs === stat.mtimeMs) return cached.text

    const data = fs.readFileSync(filePath, 'utf8')
    const text = (maxBytes && data.length > maxBytes) ? data.slice(0, maxBytes) : data
    KNX_AI_DOCS_CACHE.fileByPath.set(key, { mtimeMs: stat.mtimeMs, text })
    return text
  } catch (error) {
    return ''
  }
}

const extractHelpMarkdownFromLocaleHtml = (htmlText) => {
  try {
    const match = String(htmlText || '').match(/<script[^>]*data-help-name="[^"]+"[^>]*>([\s\S]*?)<\/script>/i)
    if (!match) return ''
    return String(match[1] || '').trim()
  } catch (error) {
    return ''
  }
}

const getHelpIndexForLanguage = (moduleRootDir, langDir) => {
  const cacheKey = `${langDir}`
  if (KNX_AI_DOCS_CACHE.helpIndexByLang.has(cacheKey)) return KNX_AI_DOCS_CACHE.helpIndexByLang.get(cacheKey) || []

  const docs = []
  try {
    const base = path.join(moduleRootDir, 'nodes', 'locales', langDir)
    const entries = fs.readdirSync(base, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isFile()) continue
      if (!e.name.endsWith('.html')) continue
      const fp = path.join(base, e.name)
      const html = readTextFileCached(fp, { maxBytes: 512 * 1024 })
      const md = extractHelpMarkdownFromLocaleHtml(html)
      if (!md) continue
      const helpName = e.name.replace(/\.html$/i, '')
      docs.push({
        id: `help:${langDir}:${helpName}`,
        title: `Help: ${helpName}`,
        source: fp,
        text: md
      })
    }
  } catch (error) {
    // ignore
  }

  KNX_AI_DOCS_CACHE.helpIndexByLang.set(cacheKey, docs)
  return docs
}

const looksLikeLocalizedWikiPage = (filename) => {
  const name = String(filename || '')
  // e.g. it-*, de-*, fr-*, es-*, zh-CN-*
  return /^(?:[a-z]{2}(?:-[A-Z]{2})?|zh-CN)-/i.test(name)
}

const getWikiIndexForLanguage = (moduleRootDir, langDir) => {
  const cacheKey = `${langDir}`
  if (KNX_AI_DOCS_CACHE.wikiIndexByLang.has(cacheKey)) return KNX_AI_DOCS_CACHE.wikiIndexByLang.get(cacheKey) || []

  const docs = []
  try {
    const base = path.join(moduleRootDir, 'docs', 'wiki')
    const entries = fs.readdirSync(base, { withFileTypes: true })
    const files = entries
      .filter(e => e.isFile() && e.name.toLowerCase().endsWith('.md'))
      .map(e => e.name)
      .sort((a, b) => a.localeCompare(b))

    const limit = 250
    for (const name of files) {
      if (docs.length >= limit) break
      if (name.startsWith('_')) continue
      if (langDir === 'en') {
        if (looksLikeLocalizedWikiPage(name)) continue
      } else {
        if (!name.startsWith(`${langDir}-`)) continue
      }
      const fp = path.join(base, name)
      const text = readTextFileCached(fp, { maxBytes: 512 * 1024 })
      if (!text) continue
      docs.push({
        id: `wiki:${langDir}:${name}`,
        title: `Wiki: ${name.replace(/\.md$/i, '')}`,
        source: `docs/wiki/${name}`,
        text
      })
    }
  } catch (error) {
    // ignore
  }

  KNX_AI_DOCS_CACHE.wikiIndexByLang.set(cacheKey, docs)
  return docs
}

const tokenizeForSearch = (input) => {
  const raw = String(input || '').toLowerCase()
  const tokens = raw
    .replace(/[`"'()[\]{}<>]/g, ' ')
    .split(/[^a-z0-9./_-]+/i)
    .map(t => t.trim())
    .filter(Boolean)
  const stop = new Set(['the', 'and', 'or', 'for', 'with', 'this', 'that', 'from', 'into', 'what', 'how', 'why', 'when', 'where',
    'che', 'come', 'per', 'con', 'del', 'della', 'delle', 'dei', 'degli', 'una', 'uno', 'il', 'lo', 'la', 'le', 'un', 'in', 'su', 'da',
    'und', 'der', 'die', 'das', 'mit', 'für', 'ein', 'eine',
    'et', 'les', 'des', 'pour', 'avec',
    'que', 'con', 'para'
  ])
  return Array.from(new Set(tokens.filter(t => t.length >= 3 && !stop.has(t))))
}

const scoreText = (textLower, tokens) => {
  if (!textLower) return 0
  let score = 0
  for (const t of tokens) {
    if (!t) continue
    if (textLower.includes(t)) score += 1
  }
  return score
}

const extractSnippet = (fullText, tokens, { maxLen = 420 } = {}) => {
  const text = String(fullText || '')
  const lower = text.toLowerCase()
  let idx = -1
  let tokenHit = ''
  for (const t of tokens) {
    const p = lower.indexOf(t)
    if (p !== -1 && (idx === -1 || p < idx)) { idx = p; tokenHit = t }
  }
  if (idx === -1) return ''
  const half = Math.floor(maxLen / 2)
  const start = Math.max(0, idx - half)
  const end = Math.min(text.length, idx + Math.max(half, tokenHit.length + 40))
  let snippet = text.slice(start, end).trim()
  if (start > 0) snippet = '…' + snippet
  if (end < text.length) snippet = snippet + '…'
  snippet = snippet.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n')
  return snippet
}

const buildRelevantDocsContext = ({ moduleRootDir, question, preferredLangDir, maxSnippets = 5, maxChars = 3000 } = {}) => {
  const q = String(question || '').trim()
  if (!q) return ''

  const langCandidates = []
  if (preferredLangDir) langCandidates.push(preferredLangDir)
  if (!langCandidates.includes('en')) langCandidates.push('en')
  if (!langCandidates.includes('it')) langCandidates.push('it')

  const tokens = tokenizeForSearch(q)
  if (!tokens.length) return ''

  const docs = []

  // Always include packaged docs if present
  const readmePath = path.join(moduleRootDir, 'README.md')
  const changelogPath = path.join(moduleRootDir, 'CHANGELOG.md')
  const readme = readTextFileCached(readmePath, { maxBytes: 1024 * 1024 })
  if (readme) docs.push({ id: 'README.md', title: 'README', source: 'README.md', text: readme })
  const changelog = readTextFileCached(changelogPath, { maxBytes: 1024 * 1024 })
  if (changelog) docs.push({ id: 'CHANGELOG.md', title: 'CHANGELOG', source: 'CHANGELOG.md', text: changelog })

  // Help files in preferred language (fallbacks)
  for (const lang of langCandidates) {
    const helpDocs = getHelpIndexForLanguage(moduleRootDir, lang)
    docs.push(...helpDocs)
  }

  // Wiki docs (repo-only; may not be available in npm package)
  for (const lang of langCandidates) {
    const wikiDocs = getWikiIndexForLanguage(moduleRootDir, lang)
    docs.push(...wikiDocs)
  }

  // Examples (file names only + small excerpt)
  try {
    const examplesDir = path.join(moduleRootDir, 'examples')
    const entries = fs.readdirSync(examplesDir, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isFile()) continue
      if (!e.name.toLowerCase().endsWith('.json')) continue
      const fp = path.join(examplesDir, e.name)
      const hint = `Node-RED importable flow example: ${e.name}`
      const body = readTextFileCached(fp, { maxBytes: 32 * 1024 })
      docs.push({ id: `example:${e.name}`, title: hint, source: `examples/${e.name}`, text: `${hint}\n\n${body}` })
    }
  } catch (e) { /* ignore */ }

  const scored = docs
    .map(d => {
      const lower = String(d.text || '').toLowerCase()
      return { doc: d, score: scoreText(lower, tokens) }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const out = []
  const used = new Set()
  let totalChars = 0

  for (const item of scored) {
    if (out.length >= Math.max(1, Number(maxSnippets) || 1)) break
    const d = item.doc
    const key = d.id || d.source || d.title
    if (used.has(key)) continue
    const snippet = extractSnippet(d.text, tokens, { maxLen: 520 })
    if (!snippet) continue

    const block = [
      `[${d.title}] (${d.source})`,
      snippet
    ].join('\n')

    if (totalChars + block.length > Math.max(500, Number(maxChars) || 0)) break
    totalChars += block.length + 2
    out.push(block)
    used.add(key)
  }

  if (!out.length) return ''
  return ['Relevant documentation excerpts:', out.join('\n\n')].join('\n')
}

const postJson = async ({ url, headers, body, timeoutMs }) => {
  const resolvedTimeoutMs = Math.max(1000, Number(timeoutMs) || 30000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), resolvedTimeoutMs)
  try {
    let res
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: Object.assign({ 'content-type': 'application/json' }, headers || {}),
        body: JSON.stringify(body || {}),
        signal: controller.signal
      })
    } catch (error) {
      const isAbort = (error && error.name === 'AbortError') || /\babort(ed)?\b/i.test(String(error && error.message ? error.message : ''))
      if (isAbort) {
        throw new Error(`LLM request timeout after ${Math.round(resolvedTimeoutMs / 1000)}s. Increase "Timeout ms" in the KNX AI node settings or reduce prompt context.`)
      }
      throw error
    }
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (error) {
      json = { raw: text }
    }
    if (!res.ok) {
      const message = (json && (json.error?.message || json.message)) ? (json.error?.message || json.message) : `HTTP ${res.status}`
      const err = new Error(message)
      err.status = res.status
      err.response = json
      throw err
    }
    return json
  } finally {
    clearTimeout(timer)
  }
}

const getJson = async ({ url, headers, timeoutMs }) => {
  const resolvedTimeoutMs = Math.max(1000, Number(timeoutMs) || 20000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), resolvedTimeoutMs)
  try {
    const res = await fetch(url, { method: 'GET', headers: headers || {}, signal: controller.signal })
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (error) {
      json = { raw: text }
    }
    if (!res.ok) {
      const message = (json && (json.error?.message || json.message)) ? (json.error?.message || json.message) : `HTTP ${res.status}`
      const err = new Error(message)
      err.status = res.status
      err.response = json
      throw err
    }
    return json
  } finally {
    clearTimeout(timer)
  }
}

const deriveModelsUrlFromBaseUrl = (baseUrl) => {
  const raw = String(baseUrl || '').trim()
  if (!raw) return 'https://api.openai.com/v1/models'
  try {
    const u = new URL(raw)
    const path = u.pathname || '/'
    if (/\/chat\/completions\/?$/.test(path)) {
      u.pathname = path.replace(/\/chat\/completions\/?$/, '/models')
      return u.toString()
    }
    if (/\/responses\/?$/.test(path)) {
      u.pathname = path.replace(/\/responses\/?$/, '/models')
      return u.toString()
    }
    if (/\/models\/?$/.test(path)) {
      u.pathname = path.replace(/\/models\/?$/, '/models')
      return u.toString()
    }
    if (/\/v1\/?$/.test(path)) {
      u.pathname = path.replace(/\/v1\/?$/, '/v1/models')
      return u.toString()
    }
    const v1Idx = path.indexOf('/v1')
    if (v1Idx >= 0) {
      u.pathname = path.slice(0, v1Idx + 3) + '/models'
      return u.toString()
    }
    u.pathname = '/v1/models'
    return u.toString()
  } catch (error) {
    return 'https://api.openai.com/v1/models'
  }
}

const OPENAI_COMPAT_DEFAULT_CHAT_URL = 'https://api.openai.com/v1/chat/completions'
const OLLAMA_DEFAULT_CHAT_URL = 'http://localhost:11434/api/chat'

const normalizeUrlForCompare = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  try {
    const u = new URL(raw)
    u.hash = ''
    u.search = ''
    u.pathname = String(u.pathname || '/').replace(/\/+$/, '')
    return u.toString().toLowerCase()
  } catch (error) {
    return raw.replace(/\/+$/, '').toLowerCase()
  }
}

const isOpenAiDefaultChatUrl = (value) => {
  return normalizeUrlForCompare(value) === normalizeUrlForCompare(OPENAI_COMPAT_DEFAULT_CHAT_URL)
}

const resolveOllamaChatUrl = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return OLLAMA_DEFAULT_CHAT_URL
  if (isOpenAiDefaultChatUrl(raw)) return OLLAMA_DEFAULT_CHAT_URL
  return raw
}

const isLikelyConnectionFailure = (error) => {
  const message = String(error && error.message ? error.message : '')
  const causeMessage = String(error && error.cause && error.cause.message ? error.cause.message : '')
  const merged = `${message} ${causeMessage}`.toLowerCase()
  return (
    merged.includes('fetch failed') ||
    merged.includes('econnrefused') ||
    merged.includes('enotfound') ||
    merged.includes('ehostunreach') ||
    merged.includes('network') ||
    merged.includes('socket') ||
    merged.includes('connect')
  )
}

const decorateOllamaConnectionError = ({ error, url, action }) => {
  if (!isLikelyConnectionFailure(error)) return error
  const step = String(action || 'reach the API')
  const err = new Error(`Cannot reach Ollama at ${url} while trying to ${step}. Ensure Ollama is running (start the Ollama app or run "ollama serve"), then retry. If Node-RED runs in Docker, use host.docker.internal instead of localhost.`)
  err.status = 502
  return err
}

const deriveOllamaApiUrl = (baseUrl, endpointPath = '/api/chat') => {
  const raw = resolveOllamaChatUrl(baseUrl)
  const normalizedEndpointPath = String(endpointPath || '/api/chat').startsWith('/') ? String(endpointPath || '/api/chat') : ('/' + String(endpointPath || '/api/chat'))
  try {
    const u = new URL(raw)
    if (/\/api\/(chat|generate|tags|pull)\/?$/.test(u.pathname)) {
      u.pathname = u.pathname.replace(/\/api\/(chat|generate|tags|pull)\/?$/, normalizedEndpointPath)
    } else {
      u.pathname = normalizedEndpointPath
    }
    return u.toString()
  } catch (error) {
    return OLLAMA_DEFAULT_CHAT_URL.replace(/\/api\/chat\/?$/, normalizedEndpointPath)
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)))

const spawnDetached = ({ command, args = [] }) => {
  return new Promise((resolve, reject) => {
    let settled = false
    let child
    try {
      child = spawn(command, args, {
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      })
    } catch (error) {
      reject(error)
      return
    }

    child.on('error', (error) => {
      if (settled) return
      settled = true
      reject(error)
    })

    child.unref()
    setTimeout(() => {
      if (settled) return
      settled = true
      resolve({ command, args, pid: child.pid || 0 })
    }, 400)
  })
}

const getOllamaServeCandidates = () => {
  const base = [
    { command: 'ollama', args: ['serve'] },
    { command: '/usr/bin/ollama', args: ['serve'] },
    { command: '/usr/local/bin/ollama', args: ['serve'] },
    { command: '/opt/homebrew/bin/ollama', args: ['serve'] }
  ]
  if (process.platform === 'darwin') {
    base.push({ command: '/Applications/Ollama.app/Contents/MacOS/Ollama', args: ['serve'] })
  }
  if (process.platform === 'win32') {
    base.unshift({ command: 'ollama.exe', args: ['serve'] })
  }
  const seen = new Set()
  return base.filter((entry) => {
    const key = `${entry.command} ${entry.args.join(' ')}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const waitForOllamaReady = async ({ baseUrl, timeoutMs = 20000 }) => {
  const tagsUrl = deriveOllamaApiUrl(baseUrl, '/api/tags')
  const stopAt = Date.now() + Math.max(1000, Number(timeoutMs) || 20000)
  let lastError = null
  while (Date.now() < stopAt) {
    try {
      const json = await getJson({ url: tagsUrl, timeoutMs: 1500 })
      return { tagsUrl, json }
    } catch (error) {
      lastError = error
      // eslint-disable-next-line no-await-in-loop
      await delay(800)
    }
  }
  throw lastError || new Error(`Timeout waiting for Ollama at ${tagsUrl}`)
}

const ensureOllamaServerRunning = async ({ baseUrl, autoStart = false, timeoutMs = 22000 }) => {
  const resolvedBaseUrl = resolveOllamaChatUrl(baseUrl)
  const tagsUrl = deriveOllamaApiUrl(resolvedBaseUrl, '/api/tags')

  try {
    const json = await getJson({ url: tagsUrl, timeoutMs: 1500 })
    return { started: false, tagsUrl, json, baseUrl: resolvedBaseUrl }
  } catch (probeError) {
    if (!autoStart) throw decorateOllamaConnectionError({ error: probeError, url: tagsUrl, action: 'load models' })
  }

  const candidates = getOllamaServeCandidates()
  const attempted = []
  const deadline = Date.now() + Math.max(2000, Number(timeoutMs) || 22000)
  for (const candidate of candidates) {
    const remainingMs = deadline - Date.now()
    if (remainingMs <= 0) break
    try {
      // eslint-disable-next-line no-await-in-loop
      await spawnDetached(candidate)
      const waitBudget = Math.max(1500, Math.min(9000, remainingMs))
      // eslint-disable-next-line no-await-in-loop
      const ready = await waitForOllamaReady({ baseUrl: resolvedBaseUrl, timeoutMs: waitBudget })
      return {
        started: true,
        startedBy: candidate.command,
        tagsUrl: ready.tagsUrl,
        json: ready.json,
        baseUrl: resolvedBaseUrl
      }
    } catch (error) {
      attempted.push(`${candidate.command}: ${String(error && error.message ? error.message : error)}`)
    }
  }

  const err = new Error(`Unable to auto-start Ollama at ${tagsUrl}. Tried: ${attempted.join(' | ') || 'no command candidates'}. Start Ollama manually or set a reachable base URL.`)
  err.status = 502
  throw err
}

const isProbablyChatModelId = (id) => {
  const s = String(id || '').toLowerCase()
  if (!s) return false
  if (s.includes('embedding')) return false
  if (s.includes('whisper')) return false
  if (s.includes('tts')) return false
  if (s.includes('dall-e') || s.includes('dalle')) return false
  if (s.includes('moderation')) return false
  return true
}

module.exports = function (RED) {
  const flowGACache = { at: 0, set: new Set() }
  const flowNodeCatalogCache = { at: 0, catalog: null }

  const extractGAsFromValue = ({ value, outSet, gaRe, maxItems = 4000 }) => {
    if (!(outSet instanceof Set)) return
    if (outSet.size >= maxItems) return
    if (value === undefined || value === null) return
    if (typeof value === 'string') {
      gaRe.lastIndex = 0
      let match = gaRe.exec(value)
      while (match) {
        outSet.add(String(match[0] || ''))
        if (outSet.size >= maxItems) return
        match = gaRe.exec(value)
      }
      return
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        extractGAsFromValue({ value: value[i], outSet, gaRe, maxItems })
        if (outSet.size >= maxItems) return
      }
      return
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value)
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        extractGAsFromValue({ value: value[k], outSet, gaRe, maxItems })
        if (outSet.size >= maxItems) return
      }
    }
  }

  const addToMapSet = (map, key, value) => {
    if (!key || !value) return
    let set = map.get(key)
    if (!set) {
      set = new Set()
      map.set(key, set)
    }
    set.add(value)
  }

  const collectFlowGAs = ({ ttlMs = 10000, maxItems = 4000 } = {}) => {
    const now = nowMs()
    if (flowGACache.set && (now - Number(flowGACache.at || 0)) <= Math.max(1000, Number(ttlMs || 10000))) {
      return flowGACache.set
    }
    const set = new Set()
    try {
      if (typeof RED.nodes.eachNode !== 'function') return set
      const gaRe = /\b\d{1,3}\/\d{1,3}\/\d{1,3}\b/g

      RED.nodes.eachNode((n) => {
        if (!n || typeof n !== 'object') return
        const type = String(n.type || '')
        if (!type.startsWith('knxUltimate') || type === 'knxUltimate-config') return
        extractGAsFromValue({ value: n, outSet: set, gaRe, maxItems })
      })
    } catch (error) {
      // Ignore discovery issues and return best-effort set.
    }
    flowGACache.at = now
    flowGACache.set = set
    return set
  }

  const collectFlowNodeCatalog = ({ ttlMs = 10000, maxNodes = 1200, maxGAsPerNode = 80 } = {}) => {
    const now = nowMs()
    const ttl = Math.max(1000, Number(ttlMs || 10000))
    if (flowNodeCatalogCache.catalog && (now - Number(flowNodeCatalogCache.at || 0)) <= ttl) {
      return flowNodeCatalogCache.catalog
    }

    const catalog = {
      nodes: new Map(),
      gaReadersByGA: new Map(),
      gaWritersByGA: new Map(),
      listenAllReaders: new Set(),
      nodeWireEdges: []
    }
    try {
      if (typeof RED.nodes.eachNode !== 'function') return catalog
      const gaRe = /\b\d{1,3}\/\d{1,3}\/\d{1,3}\b/g
      const knxNodeIds = new Set()
      const wireCandidates = []

      RED.nodes.eachNode((n) => {
        if (!n || typeof n !== 'object') return
        const type = String(n.type || '')
        if (!type.startsWith('knxUltimate') || type === 'knxUltimate-config' || type === 'knxUltimateAI') return
        if (catalog.nodes.size >= maxNodes) return

        const nodeId = String(n.id || '').trim()
        if (!nodeId) return
        knxNodeIds.add(nodeId)

        const gaRefs = new Set()
        const topic = String(n.topic || '').trim()
        if (topic) extractGAsFromValue({ value: topic, outSet: gaRefs, gaRe, maxItems: maxGAsPerNode })
        extractGAsFromValue({ value: n, outSet: gaRefs, gaRe, maxItems: maxGAsPerNode })
        const gaList = Array.from(gaRefs.values()).slice(0, maxGAsPerNode)

        const listenAllGA = n.listenallga === true || n.listenallga === 'true'
        const notifyWrite = n.notifywrite === true || n.notifywrite === 'true'
        const notifyResponse = n.notifyresponse === true || n.notifyresponse === 'true'
        const notifyRead = n.notifyreadrequest === true || n.notifyreadrequest === 'true'
        const outputType = String(n.outputtype || '').toLowerCase()

        let canRead = true
        let canWrite = true
        if (type === 'knxUltimate') {
          canRead = listenAllGA || notifyWrite || notifyResponse || notifyRead
          canWrite = !!topic || outputType === 'write' || outputType === 'response' || outputType === 'read' || outputType === 'update'
        }

        const nodeInfo = {
          id: nodeId,
          type,
          name: String(n.name || '').trim(),
          topic,
          gaRefs: gaList,
          listenAllGA,
          canRead,
          canWrite
        }
        catalog.nodes.set(nodeId, nodeInfo)

        if (listenAllGA && canRead) {
          catalog.listenAllReaders.add(nodeId)
        }
        for (let i = 0; i < gaList.length; i++) {
          const ga = String(gaList[i] || '').trim()
          if (!ga) continue
          if (canRead) addToMapSet(catalog.gaReadersByGA, ga, nodeId)
          if (canWrite) addToMapSet(catalog.gaWritersByGA, ga, nodeId)
        }

        if (Array.isArray(n.wires)) {
          for (let i = 0; i < n.wires.length; i++) {
            const out = n.wires[i]
            if (!Array.isArray(out)) continue
            for (let j = 0; j < out.length; j++) {
              const toId = String(out[j] || '').trim()
              if (!toId) continue
              wireCandidates.push({ from: nodeId, to: toId })
            }
          }
        }
      })

      catalog.nodeWireEdges = wireCandidates
        .filter(e => knxNodeIds.has(e.from) && knxNodeIds.has(e.to))
        .slice(0, 4000)
    } catch (error) {
      // ignore and return best effort catalog
    }

    flowNodeCatalogCache.at = now
    flowNodeCatalogCache.catalog = catalog
    return catalog
  }

  const buildKnxUltimateFlowInventory = ({ maxNodes = 80 } = {}) => {
    const tabById = new Map()
    const gatewaysById = new Map()
    const knxNodes = []

    try {
      if (typeof RED.nodes.eachNode !== 'function') return ''

      // First pass: collect tabs + gateways
      RED.nodes.eachNode((n) => {
        if (!n || typeof n !== 'object') return
        const type = String(n.type || '')
        if (type === 'tab') {
          tabById.set(String(n.id || ''), String(n.label || n.name || ''))
          return
        }
        if (type === 'knxUltimate-config') {
          gatewaysById.set(String(n.id || ''), {
            id: String(n.id || ''),
            name: String(n.name || ''),
            physAddr: String(n.physAddr || '')
          })
        }
      })

      // Second pass: collect KNX Ultimate nodes (all flows)
      RED.nodes.eachNode((n) => {
        if (!n || typeof n !== 'object') return
        const type = String(n.type || '')
        if (!type.startsWith('knxUltimate') || type === 'knxUltimate-config') return

        const tabId = String(n.z || '')
        const tabLabel = tabById.get(tabId) || ''
        const id = String(n.id || '')
        const name = String(n.name || '')
        const server = String(n.server || '')
        const gw = gatewaysById.get(server) || null

        const entry = {
          tabLabel,
          type,
          id,
          name,
          gatewayId: server,
          gatewayName: gw ? gw.name : '',
          topic: n.topic !== undefined ? String(n.topic) : '',
          dpt: n.dpt !== undefined ? String(n.dpt) : ''
        }

        if (type === 'knxUltimate') {
          entry.listenAllGA = n.listenallga === true || n.listenallga === 'true'
          entry.outputType = n.outputtype !== undefined ? String(n.outputtype) : ''
          entry.notifyWrite = n.notifywrite === true || n.notifywrite === 'true'
          entry.notifyResponse = n.notifyresponse === true || n.notifyresponse === 'true'
          entry.notifyRead = n.notifyreadrequest === true || n.notifyreadrequest === 'true'
        } else if (type === 'knxUltimateMultiRouting') {
          entry.outputTopic = n.outputtopic !== undefined ? String(n.outputtopic) : ''
          entry.dropIfSameGateway = n.dropIfSameGateway === true || n.dropIfSameGateway === 'true'
        } else if (type === 'knxUltimateRouterFilter') {
          entry.gaMode = n.gaMode !== undefined ? String(n.gaMode) : ''
          entry.gaPatterns = n.gaPatterns !== undefined ? String(n.gaPatterns) : ''
          entry.srcMode = n.srcMode !== undefined ? String(n.srcMode) : ''
          entry.srcPatterns = n.srcPatterns !== undefined ? String(n.srcPatterns) : ''
          entry.rewriteGA = n.rewriteGA === true || n.rewriteGA === 'true'
          entry.gaRewriteRules = n.gaRewriteRules !== undefined ? String(n.gaRewriteRules) : ''
          entry.rewriteSource = n.rewriteSource === true || n.rewriteSource === 'true'
          entry.srcRewriteRules = n.srcRewriteRules !== undefined ? String(n.srcRewriteRules) : ''
        }

        knxNodes.push(entry)
      })
    } catch (error) {
      return ''
    }

    if (!knxNodes.length && !gatewaysById.size) return ''

    const sorted = knxNodes
      .sort((a, b) => {
        const at = (a.tabLabel || '').localeCompare(b.tabLabel || '')
        if (at !== 0) return at
        const an = (a.name || a.id).localeCompare(b.name || b.id)
        if (an !== 0) return an
        return (a.type || '').localeCompare(b.type || '')
      })
      .slice(0, Math.max(0, Number(maxNodes) || 0))

    const shorten = (id) => (id && id.length > 8) ? id.slice(0, 8) : id
    const safeLine = (s) => String(s || '').replace(/\s+/g, ' ').trim()

    const lines = []
    lines.push('Node-RED flow inventory (KNX Ultimate):')

    if (gatewaysById.size) {
      lines.push(`Gateways (knxUltimate-config): ${gatewaysById.size}`)
      for (const g of Array.from(gatewaysById.values()).sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id)).slice(0, 20)) {
        const bits = []
        bits.push(`- ${shorten(g.id)}`)
        if (g.name) bits.push(`name="${safeLine(g.name)}"`)
        if (g.physAddr) bits.push(`physAddr=${safeLine(g.physAddr)}`)
        lines.push(bits.join(' '))
      }
      if (gatewaysById.size > 20) lines.push('- ...')
    }

    lines.push(`KNX Ultimate nodes: ${knxNodes.length}${knxNodes.length > sorted.length ? ` (showing first ${sorted.length})` : ''}`)
    for (const n of sorted) {
      const parts = []
      if (n.tabLabel) parts.push(`[${safeLine(n.tabLabel)}]`)
      parts.push(n.type)
      parts.push(shorten(n.id))
      if (n.name) parts.push(`name="${safeLine(n.name)}"`)
      if (n.gatewayName) parts.push(`gw="${safeLine(n.gatewayName)}"`)
      if (!n.gatewayName && n.gatewayId) parts.push(`gwId=${shorten(n.gatewayId)}`)

      if (n.type === 'knxUltimate') {
        if (n.topic) parts.push(`topic=${safeLine(n.topic)}`)
        if (n.dpt) parts.push(`dpt=${safeLine(n.dpt)}`)
        parts.push(`listenAll=${n.listenAllGA ? 'true' : 'false'}`)
      } else if (n.type === 'knxUltimateMultiRouting') {
        if (n.outputTopic) parts.push(`outputTopic=${safeLine(n.outputTopic)}`)
        parts.push(`dropTagged=${n.dropIfSameGateway ? 'true' : 'false'}`)
      } else if (n.type === 'knxUltimateRouterFilter') {
        if (n.gaMode && n.gaMode !== 'off') parts.push(`gaMode=${safeLine(n.gaMode)}`)
        if (n.gaPatterns) parts.push(`gaPatterns="${safeLine(n.gaPatterns)}"`)
        if (n.srcMode && n.srcMode !== 'off') parts.push(`srcMode=${safeLine(n.srcMode)}`)
        if (n.srcPatterns) parts.push(`srcPatterns="${safeLine(n.srcPatterns)}"`)
        if (n.rewriteGA) parts.push('rewriteGA=true')
        if (n.gaRewriteRules) parts.push(`gaRewriteRules="${safeLine(n.gaRewriteRules)}"`)
        if (n.rewriteSource) parts.push('rewriteSource=true')
        if (n.srcRewriteRules) parts.push(`srcRewriteRules="${safeLine(n.srcRewriteRules)}"`)
      } else {
        if (n.topic) parts.push(`topic=${safeLine(n.topic)}`)
      }
      lines.push(`- ${parts.join(' ')}`)
    }

    return lines.join('\n').trim()
  }

  if (!adminEndpointsRegistered) {
    adminEndpointsRegistered = true

    RED.httpAdmin.use('/knxUltimateAI/sidebar', normalizeAuthFromAccessTokenQuery)

    RED.httpAdmin.get('/knxUltimateAI/sidebar/page', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendKnxAiVueIndex(req, res)
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/page-vue', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendKnxAiVueIndex(req, res)
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/page/assets/:file', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendStaticFileSafe({
        rootDir: knxAiVueDistDir,
        relativePath: path.join('assets', String(req.params?.file || '')),
        res
      })
    })

    // Alias for relative asset URLs resolved from ".../sidebar/page?nodeId=..."
    // which become ".../sidebar/assets/<file>" in browsers.
    RED.httpAdmin.get('/knxUltimateAI/sidebar/assets/:file', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendStaticFileSafe({
        rootDir: knxAiVueDistDir,
        relativePath: path.join('assets', String(req.params?.file || '')),
        res
      })
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/page-vue/assets/:file', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendStaticFileSafe({
        rootDir: knxAiVueDistDir,
        relativePath: path.join('assets', String(req.params?.file || '')),
        res
      })
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/nodes', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const nodes = Array.from(aiRuntimeNodes.values()).map((n) => ({
          id: n.id,
          name: n.name || '',
          topic: n.topic || '',
          gatewayId: n.serverKNX ? n.serverKNX.id : '',
          gatewayName: (n.serverKNX && n.serverKNX.name) ? n.serverKNX.name : '',
          llmEnabled: !!n.llmEnabled,
          llmProvider: n.llmProvider || '',
          llmModel: n.llmModel || ''
        })).sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
        res.json({ nodes })
      } catch (error) {
        res.status(500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/state', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const nodeId = req.query?.nodeId ? String(req.query.nodeId) : ''
        const fresh = req.query?.fresh === '1' || req.query?.fresh === 1 || req.query?.fresh === true || req.query?.fresh === 'true'
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.getSidebarState !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        res.json(n.getSidebarState({ fresh }))
      } catch (error) {
        res.status(500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/ask', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const question = req.body?.question ? String(req.body.question) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!question || question.trim() === '') {
          res.status(400).json({ error: 'Missing question' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.sidebarAsk !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.sidebarAsk(question)
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/save', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const areaId = req.body?.areaId ? String(req.body.areaId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!areaId) {
          res.status(400).json({ error: 'Missing areaId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.saveAreaDefinition !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.saveAreaDefinition({
          areaId,
          name: req.body?.name,
          description: req.body?.description,
          tags: req.body?.tags,
          gaList: req.body?.gaList
        })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/reset', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const areaId = req.body?.areaId ? String(req.body.areaId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!areaId) {
          res.status(400).json({ error: 'Missing areaId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.resetAreaDefinition !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.resetAreaDefinition({ areaId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/delete', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const areaId = req.body?.areaId ? String(req.body.areaId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!areaId) {
          res.status(400).json({ error: 'Missing areaId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.deleteAreaDefinition !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.deleteAreaDefinition({ areaId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/delete-llm', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.deleteAllLlmAreas !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.deleteAllLlmAreas()
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/catalog', RED.auth.needsPermission('knxUltimate-config.read'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.getGaCatalog !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.getGaCatalog()
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/ga-role/save', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.saveGaRoleOverride !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.saveGaRoleOverride(req.body || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/create', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.createAreaDefinition !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.createAreaDefinition(req.body || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/regenerate-llm', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.regenerateLlmAreas !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.regenerateLlmAreas()
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/areas/suggest-llm', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.suggestAreaDraftWithLlm !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.suggestAreaDraftWithLlm(req.body || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/profiles/save', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.saveAreaProfile !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.saveAreaProfile(req.body || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/profiles/delete', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const profileId = req.body?.profileId ? String(req.body.profileId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!profileId) {
          res.status(400).json({ error: 'Missing profileId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.deleteAreaProfile !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.deleteAreaProfile({ profileId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/profiles/run', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const areaId = req.body?.areaId ? String(req.body.areaId) : ''
        const profileId = req.body?.profileId ? String(req.body.profileId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.runAreaProfile !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.runAreaProfile({ areaId, profileId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/config/export', RED.auth.needsPermission('knxUltimate-config.read'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.exportAiConfig !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.exportAiConfig()
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/config/import', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const configPayload = req.body?.config
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.importAiConfig !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.importAiConfig(configPayload)
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/actuator-tests/save', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.saveActuatorTestPreset !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.saveActuatorTestPreset(req.body || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/actuator-tests/delete', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const presetId = req.body?.presetId ? String(req.body.presetId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!presetId) {
          res.status(400).json({ error: 'Missing presetId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.deleteActuatorTestPreset !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.deleteActuatorTestPreset({ presetId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/actuator-tests/run', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.runActuatorTest !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.runActuatorTest(req.body || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-plans/catalog', RED.auth.needsPermission('knxUltimate-config.read'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const areaId = req.body?.areaId ? String(req.body.areaId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!areaId) {
          res.status(400).json({ error: 'Missing areaId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.getAreaSignalCatalog !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.getAreaSignalCatalog({ areaId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-plans/generate', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const areaId = req.body?.areaId ? String(req.body.areaId) : ''
        const prompt = req.body?.prompt ? String(req.body.prompt) : ''
        const language = req.body?.language
          ? String(req.body.language)
          : extractLanguageCodeFromHeader(req.headers && req.headers['accept-language'] ? String(req.headers['accept-language']) : '', 'en')
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!areaId) {
          res.status(400).json({ error: 'Missing areaId' })
          return
        }
        if (!prompt.trim()) {
          res.status(400).json({ error: 'Missing prompt' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.generateAiTestPlan !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.generateAiTestPlan({ areaId, prompt, language })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-plans/save', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.saveAiTestPlan !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.saveAiTestPlan(req.body?.plan || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-plans/delete', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const planId = req.body?.planId ? String(req.body.planId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!planId) {
          res.status(400).json({ error: 'Missing planId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.deleteAiTestPlan !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.deleteAiTestPlan({ planId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-plans/run', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.runAiTestPlan !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.runAiTestPlan({
          planId: req.body?.planId,
          plan: req.body?.plan
        })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-plans/run-step', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const areaId = req.body?.areaId ? String(req.body.areaId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!areaId) {
          res.status(400).json({ error: 'Missing areaId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.runAiTestPlanStep !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.runAiTestPlanStep({
          areaId,
          step: req.body?.step
        })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-results/save', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.saveAiTestResult !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.saveAiTestResult(req.body?.report || {})
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/test-results/delete', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const reportId = req.body?.reportId ? String(req.body.reportId) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!reportId) {
          res.status(400).json({ error: 'Missing reportId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.deleteAiTestResult !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.deleteAiTestResult({ reportId })
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/tts/googletranslate', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const text = String(req.body?.text || '').trim()
        const voice = String(req.body?.voice || 'it').trim() || 'it'
        const slow = coerceBoolean(req.body?.slow)
        if (!text) {
          res.status(400).json({ error: 'Missing text' })
          return
        }
        const mp3Buffer = await synthesizeGoogleTranslateSpeech({ text, voice, slow })
        res.set('content-type', 'audio/mpeg')
        res.set('cache-control', 'no-store, max-age=0')
        res.status(200).send(mp3Buffer)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/models', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const body = req.body || {}
        const nodeId = body.nodeId ? String(body.nodeId) : ''

        let provider = body.provider ? String(body.provider) : ''
        let baseUrl = body.baseUrl ? String(body.baseUrl) : ''
        let apiKey = sanitizeApiKey(body.apiKey || '')
        const autoStart = coerceBoolean(body.autoStart)
        const includeAll = body.includeAll === true || body.includeAll === 'true'

        const deployedNode = nodeId ? RED.nodes.getNode(nodeId) : null
        if (deployedNode && deployedNode.type !== 'knxUltimateAI') {
          res.status(400).json({ error: 'Invalid nodeId' })
          return
        }

        if (!provider && deployedNode) provider = deployedNode.llmProvider || 'openai_compat'
        if (!baseUrl && deployedNode) baseUrl = deployedNode.llmBaseUrl || ''
        if (!apiKey && deployedNode && deployedNode.credentials && deployedNode.credentials.llmApiKey) {
          apiKey = sanitizeApiKey(deployedNode.credentials.llmApiKey)
        }

        provider = provider || 'openai_compat'

        if (provider === 'ollama') {
          const started = await ensureOllamaServerRunning({ baseUrl, autoStart, timeoutMs: 22000 })
          const tagsUrl = started.tagsUrl
          const json = started.json || await getJson({ url: tagsUrl })
          const models = (json && Array.isArray(json.models)) ? json.models.map(m => m.name).filter(Boolean) : []
          res.json({ provider, baseUrl: tagsUrl, models, ollamaStarted: !!started.started, startedBy: started.startedBy || '' })
          return
        }

        // OpenAI-compatible: /v1/models
        const modelsUrl = deriveModelsUrlFromBaseUrl(baseUrl)
        const headers = {}
        if (apiKey) headers.authorization = `Bearer ${apiKey}`
        const json = await getJson({ url: modelsUrl, headers })

        let ids = []
        if (json && Array.isArray(json.data)) {
          ids = json.data.map(m => m && m.id).filter(Boolean)
        } else if (json && Array.isArray(json.models)) {
          ids = json.models.map(m => (typeof m === 'string' ? m : m && m.id)).filter(Boolean)
        }

        if (!includeAll) {
          ids = ids.filter(isProbablyChatModelId)
        }
        ids.sort()

        res.json({ provider, baseUrl: modelsUrl, models: ids, filtered: !includeAll })
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/ollama/pull', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const body = req.body || {}
        const nodeId = body.nodeId ? String(body.nodeId) : ''
        let baseUrl = body.baseUrl ? String(body.baseUrl) : ''
        const model = String(body.model || '').trim() || 'llama3.1'

        const deployedNode = nodeId ? RED.nodes.getNode(nodeId) : null
        if (deployedNode && deployedNode.type !== 'knxUltimateAI') {
          res.status(400).json({ error: 'Invalid nodeId' })
          return
        }

        if (!baseUrl && deployedNode) baseUrl = deployedNode.llmBaseUrl || ''
        const started = await ensureOllamaServerRunning({ baseUrl, autoStart: true, timeoutMs: 26000 })
        const pullUrl = deriveOllamaApiUrl(baseUrl, '/api/pull')
        let json
        try {
          json = await postJson({
            url: pullUrl,
            body: { model, stream: false },
            timeoutMs: 1000 * 60 * 15
          })
        } catch (error) {
          throw decorateOllamaConnectionError({ error, url: pullUrl, action: `install model "${model}"` })
        }
        const status = String((json && (json.status || json.message)) || '').trim()
        res.json({ ok: true, model, pullUrl, status, ollamaStarted: !!started.started, startedBy: started.startedBy || '' })
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })
  }

  function knxUltimateAI (config) {
    RED.nodes.createNode(this, config)
    const node = this

    const moduleRootDir = path.join(__dirname, '..')

    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    if (node.serverKNX === undefined) {
      node.status({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })
      return
    }

    node.name = config.name || 'KNX AI'
    node.topic = config.topic || node.name
    node.outputtopic = node.topic
    node.dpt = ''

    node.notifyreadrequest = config.notifyreadrequest !== undefined ? coerceBoolean(config.notifyreadrequest) : true
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = config.notifyresponse !== undefined ? coerceBoolean(config.notifyresponse) : true
    node.notifywrite = config.notifywrite !== undefined ? coerceBoolean(config.notifywrite) : true
    node.initialread = false
    node.listenallga = true
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.currentPayload = ''

    node.analysisWindowSec = Number(config.analysisWindowSec || 60)
    node.historyWindowSec = Number(config.historyWindowSec || 300)
    node.emitIntervalSec = Number(config.emitIntervalSec || 0)
    node.topN = Number(config.topN || 10)

    node.rateWindowSec = Number(config.rateWindowSec || 10)
    node.maxTelegramPerSecOverall = Number(config.maxTelegramPerSecOverall || 0)
    node.maxTelegramPerSecPerGA = Number(config.maxTelegramPerSecPerGA || 0)

    node.flapWindowSec = Number(config.flapWindowSec || 30)
    node.flapMaxChanges = Number(config.flapMaxChanges || 0)

    node.enablePattern = config.enablePattern !== undefined ? coerceBoolean(config.enablePattern) : true
    node.patternMaxLagMs = Number(config.patternMaxLagMs || 1500)
    node.patternMinCount = Number(config.patternMinCount || 8)

    node.llmEnabled = config.llmEnabled !== undefined ? coerceBoolean(config.llmEnabled) : false
    node.llmProvider = config.llmProvider || 'openai_compat'
    node.llmBaseUrl = config.llmBaseUrl || 'https://api.openai.com/v1/chat/completions'
    if (node.llmProvider === 'ollama') {
      node.llmBaseUrl = resolveOllamaChatUrl(node.llmBaseUrl)
    }
    // Prefer Node-RED credentials store, fallback to legacy config field (backward compatible)
    node.llmApiKey = sanitizeApiKey((node.credentials && node.credentials.llmApiKey) ? node.credentials.llmApiKey : (config.llmApiKey || ''))
    node.llmModel = config.llmModel || 'gpt-4o-mini'
    node.llmSystemPrompt = config.llmSystemPrompt || 'You are a KNX building automation assistant. Analyze KNX bus traffic and provide actionable insights.'
    node.llmTemperature = (config.llmTemperature === undefined || config.llmTemperature === '') ? 0.2 : Number(config.llmTemperature)
    node.llmMaxTokens = (config.llmMaxTokens === undefined || config.llmMaxTokens === '') ? 50000 : Number(config.llmMaxTokens)
    node.llmTimeoutMs = (config.llmTimeoutMs === undefined || config.llmTimeoutMs === '') ? 120000 : Number(config.llmTimeoutMs)
    node.llmMaxEventsInPrompt = (config.llmMaxEventsInPrompt === undefined || config.llmMaxEventsInPrompt === '') ? 120 : Number(config.llmMaxEventsInPrompt)
    node.llmIncludeRaw = config.llmIncludeRaw !== undefined ? coerceBoolean(config.llmIncludeRaw) : false
    node.llmIncludeFlowContext = config.llmIncludeFlowContext !== undefined ? coerceBoolean(config.llmIncludeFlowContext) : true
    node.llmMaxFlowNodesInPrompt = (config.llmMaxFlowNodesInPrompt === undefined || config.llmMaxFlowNodesInPrompt === '')
      ? 400
      : Number(config.llmMaxFlowNodesInPrompt)
    node.llmIncludeDocsSnippets = config.llmIncludeDocsSnippets !== undefined ? coerceBoolean(config.llmIncludeDocsSnippets) : true
    node.llmDocsLanguage = config.llmDocsLanguage ? String(config.llmDocsLanguage) : 'it'
    node.llmDocsMaxSnippets = (config.llmDocsMaxSnippets === undefined || config.llmDocsMaxSnippets === '') ? 5 : Number(config.llmDocsMaxSnippets)
    node.llmDocsMaxChars = (config.llmDocsMaxChars === undefined || config.llmDocsMaxChars === '') ? 60000 : Number(config.llmDocsMaxChars)

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      try {
        if (provider && typeof provider.applyStatusUpdate === 'function') {
          provider.applyStatusUpdate(node, status)
        } else {
          node.status(status)
        }
      } catch (error) {
        try { node.status(status) } catch (e2) { /* ignore */ }
      }
    }

    const updateStatus = (status) => {
      if (!status) return
      pushStatus(status)
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      try {
        if (node.serverKNX === null) { updateStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
        trackBusConnectionStatus({ text })
        const dDate = new Date()
        const ts = (node.serverKNX && typeof node.serverKNX.formatStatusTimestamp === 'function')
          ? node.serverKNX.formatStatusTimestamp(dDate)
          : `${dDate.getDate()}, ${dDate.toLocaleTimeString()}`
        GA = (typeof GA === 'undefined' || GA === '') ? '' : '(' + GA + ') '
        devicename = devicename || ''
        dpt = (typeof dpt === 'undefined' || dpt === '') ? '' : ' DPT' + dpt
        payload = typeof payload === 'object' ? safeStringify(payload) : payload
        updateStatus({ fill, shape, text: GA + payload + (node.listenallga === true ? ' ' + devicename : '') + ' (' + ts + ') ' + (text || '') })
      } catch (error) { /* empty */ }
    }

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { /* empty */ }

    node._history = []
    node._gaState = new Map()
    node._timerEmit = null
    node._lastOverallAnomalyAt = 0
    node._lastSummary = null
    node._lastSummaryAt = 0
    node._summaryRebuildTimer = null
    node._anomalies = []
    node._assistantLog = []
    node._flowContextCache = { at: 0, text: '' }
    node._docsContextCache = { at: 0, question: '', text: '' }
    node._areaSuggestionCache = { ref: null, snapshot: buildSuggestedAreasFromCsv([]) }
    node._persistedAiConfigCache = null
    node._lastAreaProfileReport = null
    node._lastActuatorTestReport = null
    node._telegramWaiters = []
    node._transitionStats = new Map()
    node._transitionRecent = []
    node._anomalyLifecycle = new Map()
    node._gaRateSeries = new Map()
    node._gaLabelCsvCache = { ref: null, map: {} }
    node._busConnectionWatchTimer = null
    node._busConnectionState = (node.serverKNX && typeof node.serverKNX.linkStatus === 'string')
      ? String(node.serverKNX.linkStatus).toLowerCase()
      : 'unknown'
    node._busConnectionHadConnected = node._busConnectionState === 'connected'
    node._busConnectionPendingRestore = false
    node._busConnectionTimeline = [{
      state: node._busConnectionState === 'connected' ? 'connected' : 'disconnected',
      startedAtMs: nowMs(),
      endedAtMs: 0
    }]
    node._busConnectionWindowSec = 12 * 60 * 60

    // Register runtime instance for sidebar visibility
    aiRuntimeNodes.set(node.id, node)

    const extractTelegram = (msg) => {
      if (!msg || !msg.knx) return null
      const raw = msg.knx.rawValue
      const rawHex = Buffer.isBuffer(raw) ? raw.toString('hex') : undefined
      const parseRepeatFlag = (value) => {
        if (value === true || value === 1 || value === '1') return true
        if (value === false || value === 0 || value === '0') return false
        if (typeof value === 'string') {
          const v = value.trim().toLowerCase()
          if (v === 'true' || v === 'yes' || v === 'on') return true
          if (v === 'false' || v === 'no' || v === 'off') return false
        }
        return false
      }
      const repeatCandidate = (msg.knx && msg.knx.repeated !== undefined)
        ? msg.knx.repeated
        : (msg.knx && msg.knx.repeat !== undefined)
            ? msg.knx.repeat
            : (msg.knx && msg.knx.isRepeated !== undefined)
                ? msg.knx.isRepeated
                : (msg.repeated !== undefined)
                    ? msg.repeated
                    : msg.repeat
      const repeated = parseRepeatFlag(repeatCandidate)
      return {
        ts: nowMs(),
        echoed: msg.echoed === true,
        repeated,
        event: msg.knx.event || '',
        source: msg.knx.source || '',
        destination: msg.knx.destination || '',
        dpt: msg.knx.dpt || '',
        dptdesc: msg.knx.dptdesc || '',
        devicename: msg.devicename || '',
        payload: msg.payload,
        payloadmeasureunit: msg.payloadmeasureunit || '',
        rawHex
      }
    }

    const resolveTelegramWaiters = (telegram) => {
      if (!telegram || !Array.isArray(node._telegramWaiters) || node._telegramWaiters.length === 0) return
      const pending = []
      for (let i = 0; i < node._telegramWaiters.length; i++) {
        const waiter = node._telegramWaiters[i]
        if (!waiter || waiter.done === true) continue
        let matched = false
        try {
          matched = typeof waiter.match === 'function' ? waiter.match(telegram) : false
        } catch (error) {
          matched = false
        }
        if (matched) {
          waiter.done = true
          try { if (waiter.timer) clearTimeout(waiter.timer) } catch (error) { /* ignore */ }
          try { waiter.resolve(telegram) } catch (error) { /* ignore */ }
          continue
        }
        pending.push(waiter)
      }
      node._telegramWaiters = pending
    }

    const waitForTelegram = ({ destination, events = [], minTs = 0, timeoutMs = 6000 } = {}) => {
      const targetGA = String(destination || '').trim()
      const eventSet = new Set((Array.isArray(events) ? events : []).map(evt => normalizeTelegramEventName(evt)).filter(Boolean))
      if (!targetGA) return Promise.reject(new Error('Missing destination'))
      return new Promise((resolve, reject) => {
        const waiter = {
          done: false,
          match: (telegram) => {
            if (!telegram || String(telegram.destination || '').trim() !== targetGA) return false
            if (Number(telegram.ts || 0) < Number(minTs || 0)) return false
            if (eventSet.size > 0 && !eventSet.has(normalizeTelegramEventName(telegram.event))) return false
            return true
          },
          resolve,
          reject,
          timer: setTimeout(() => {
            waiter.done = true
            node._telegramWaiters = (node._telegramWaiters || []).filter(item => item !== waiter)
            reject(new Error(`Timeout waiting for telegram ${targetGA}`))
          }, Math.max(250, Number(timeoutMs || 6000)))
        }

        for (let index = node._history.length - 1; index >= 0; index--) {
          const telegram = node._history[index]
          if (waiter.match(telegram)) {
            waiter.done = true
            clearTimeout(waiter.timer)
            resolve(telegram)
            return
          }
          if (Number(telegram && telegram.ts ? telegram.ts : 0) < Number(minTs || 0)) break
        }

        node._telegramWaiters.push(waiter)
      })
    }

    const describeRecentTelegramForGA = ({ destination, minTs = 0 } = {}) => {
      const targetGA = String(destination || '').trim()
      if (!targetGA) return ''
      for (let index = node._history.length - 1; index >= 0; index--) {
        const telegram = node._history[index]
        if (!telegram || String(telegram.destination || '').trim() !== targetGA) continue
        if (Number(telegram.ts || 0) < Number(minTs || 0)) break
        const payloadLabel = formatPayloadForDptDisplay({
          value: telegram.payload,
          dptId: telegram.dpt || '',
          contextText: ''
        })
        return ` Last seen on ${targetGA}: ${normalizeTelegramEventName(telegram.event) || 'unknown'} / ${payloadLabel || normalizeValueForCompare(telegram.payload)}.`
      }
      return ''
    }

    const trimHistory = (now) => {
      const maxAgeMs = Math.max(5, node.historyWindowSec) * 1000
      const cutoff = now - maxAgeMs
      while (node._history.length > 0 && node._history[0].ts < cutoff) node._history.shift()
      const maxEvents = Math.max(100, Number(config.maxEvents || 5000))
      while (node._history.length > maxEvents) node._history.shift()
    }

    const getGALabelsFromCsv = () => {
      const csv = (node.serverKNX && Array.isArray(node.serverKNX.csv)) ? node.serverKNX.csv : []
      if (!csv.length) return {}
      if (node._gaLabelCsvCache && node._gaLabelCsvCache.ref === csv && node._gaLabelCsvCache.map) {
        return node._gaLabelCsvCache.map
      }
      const map = {}
      for (let i = 0; i < csv.length; i++) {
        const row = csv[i] || {}
        const ga = String(row.ga || '').trim()
        const name = String(row.devicename || '').trim()
        if (!ga || !name) continue
        if (!map[ga]) map[ga] = name
      }
      node._gaLabelCsvCache = { ref: csv, map }
      return map
    }

    const touchGARateSeries = (ga) => {
      const key = String(ga || '').trim()
      if (!key) return null
      let entry = node._gaRateSeries.get(key)
      if (!entry) {
        entry = {
          ga: key,
          points: [],
          lastSampleAt: 0,
          lastRatePerSec: 0,
          maxRatePerSec: 0,
          anomalyCount: 0
        }
      }
      node._gaRateSeries.set(key, entry)
      return entry
    }

    const sampleGARate = ({ ga, now, ratePerSec }) => {
      const entry = touchGARateSeries(ga)
      if (!entry) return
      const n = Number(ratePerSec || 0)
      if (!Number.isFinite(n)) return
      if (entry.lastSampleAt && (now - entry.lastSampleAt) < 1000) {
        entry.lastRatePerSec = roundTo(n, 3)
        if (n > entry.maxRatePerSec) entry.maxRatePerSec = roundTo(n, 3)
        return
      }
      entry.lastSampleAt = now
      entry.lastRatePerSec = roundTo(n, 3)
      if (n > entry.maxRatePerSec) entry.maxRatePerSec = roundTo(n, 3)
      entry.points.push({ ts: now, ratePerSec: roundTo(n, 3) })
      while (entry.points.length > 240) entry.points.shift()
      node._gaRateSeries.set(entry.ga, entry)
    }

    const pruneGARateSeries = (now) => {
      const ttlMs = Math.max(60, Number(node.historyWindowSec || 60)) * 2000
      for (const [ga, entry] of node._gaRateSeries.entries()) {
        if (!entry || !Array.isArray(entry.points)) {
          node._gaRateSeries.delete(ga)
          continue
        }
        while (entry.points.length > 0 && (now - entry.points[0].ts) > ttlMs) entry.points.shift()
        const stale = !entry.lastSampleAt || (now - entry.lastSampleAt) > ttlMs
        if (stale && entry.points.length === 0 && (entry.anomalyCount || 0) === 0) {
          node._gaRateSeries.delete(ga)
          continue
        }
        node._gaRateSeries.set(ga, entry)
      }
      if (node._gaRateSeries.size <= 300) return
      const sorted = Array.from(node._gaRateSeries.values())
        .sort((a, b) => (b.lastSampleAt || 0) - (a.lastSampleAt || 0))
        .slice(0, 300)
      node._gaRateSeries = new Map(sorted.map(e => [e.ga, e]))
    }

    const updateAnomalyLifecycle = ({ payload, now }) => {
      const p = payload || {}
      const type = String(p.type || 'anomaly')
      const ga = String(p.ga || 'BUS')
      const key = `${type}:${ga}`
      const sev = computeAnomalySeverity(p)
      let item = node._anomalyLifecycle.get(key)
      if (!item) {
        item = {
          key,
          type,
          ga,
          startedAtMs: now,
          lastSeenAtMs: now,
          count: 0,
          severity: sev.label,
          severityScore: sev.score,
          maxSeverityScore: sev.score,
          lastPayload: p
        }
      }
      item.lastSeenAtMs = now
      item.count += 1
      item.severityScore = sev.score
      item.lastPayload = p
      if (sev.score >= (item.maxSeverityScore || 0)) {
        item.maxSeverityScore = sev.score
        item.severity = sev.label
      }
      node._anomalyLifecycle.set(key, item)

      const rateSeries = touchGARateSeries(ga)
      if (rateSeries) {
        rateSeries.anomalyCount = Number(rateSeries.anomalyCount || 0) + 1
        node._gaRateSeries.set(ga, rateSeries)
      }
    }

    const buildAnomalyLifecycleSnapshot = (now) => {
      const activeWindowMs = Math.max(10, Number(node.analysisWindowSec || 10)) * 2000
      const pruneWindowMs = Math.max(30, Number(node.historyWindowSec || 30)) * 4000
      const out = []
      for (const [key, item] of node._anomalyLifecycle.entries()) {
        if (!item || !item.lastSeenAtMs) continue
        if ((now - item.lastSeenAtMs) > pruneWindowMs) {
          node._anomalyLifecycle.delete(key)
          continue
        }
        const active = (now - item.lastSeenAtMs) <= activeWindowMs
        out.push({
          key: item.key,
          type: item.type,
          ga: item.ga,
          count: item.count,
          startedAt: new Date(item.startedAtMs).toISOString(),
          lastSeenAt: new Date(item.lastSeenAtMs).toISOString(),
          active,
          severity: item.severity,
          severityScore: roundTo(item.maxSeverityScore || item.severityScore || 0, 2),
          lastPayload: item.lastPayload || {}
        })
      }
      return out.sort((a, b) => String(b.lastSeenAt).localeCompare(String(a.lastSeenAt))).slice(0, 120)
    }

    const trackTransitionTelemetry = (telegram) => {
      const now = telegram.ts
      const to = String(telegram.destination || '')
      if (!to) return
      const lagMsLimit = Math.max(100, Number(node.patternMaxLagMs || 100))
      const cutoff = now - lagMsLimit
      while (node._transitionRecent.length > 0 && node._transitionRecent[0].ts < cutoff) node._transitionRecent.shift()
      if (node._transitionRecent.length > 220) {
        node._transitionRecent = node._transitionRecent.slice(node._transitionRecent.length - 220)
      }

      for (let i = 0; i < node._transitionRecent.length; i++) {
        const prev = node._transitionRecent[i]
        if (!prev || !prev.destination || prev.destination === to) continue
        const lagMs = now - prev.ts
        if (lagMs <= 0 || lagMs > lagMsLimit) continue
        const from = String(prev.destination)
        const k = edgeKey(from, to)
        let edge = node._transitionStats.get(k)
        if (!edge) {
          edge = {
            key: k,
            from,
            to,
            count: 0,
            lastAt: 0,
            lags: [],
            samples: [],
            recentTs: [],
            eventsTotal: {}
          }
        }
        edge.count += 1
        edge.lastAt = now
        edge.lags.push(lagMs)
        while (edge.lags.length > 400) edge.lags.shift()

        const ev = String(telegram.event || 'unknown')
        edge.eventsTotal[ev] = (edge.eventsTotal[ev] || 0) + 1
        edge.samples.push({ ts: now, lagMs, event: ev })
        while (edge.samples.length > 220) edge.samples.shift()
        edge.recentTs.push(now)
        while (edge.recentTs.length > 400) edge.recentTs.shift()

        node._transitionStats.set(k, edge)
      }

      node._transitionRecent.push({
        ts: now,
        destination: to,
        event: String(telegram.event || 'unknown')
      })
    }

    const pruneTransitionStats = (now) => {
      const ttlMs = Math.max(30, Number(node.historyWindowSec || 30)) * 2000
      const recentKeepMs = Math.max(10, Number(node.rateWindowSec || 10)) * 3000
      for (const [k, edge] of node._transitionStats.entries()) {
        if (!edge || !edge.lastAt) {
          node._transitionStats.delete(k)
          continue
        }
        edge.samples = Array.isArray(edge.samples) ? edge.samples.filter(s => (now - s.ts) <= ttlMs) : []
        edge.recentTs = Array.isArray(edge.recentTs) ? edge.recentTs.filter(ts => (now - ts) <= recentKeepMs) : []
        if ((now - edge.lastAt) > ttlMs && edge.samples.length === 0 && edge.recentTs.length === 0) {
          node._transitionStats.delete(k)
          continue
        }
        node._transitionStats.set(k, edge)
      }
      if (node._transitionStats.size <= 500) return
      const sorted = Array.from(node._transitionStats.values())
        .sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0))
        .slice(0, 500)
      node._transitionStats = new Map(sorted.map(e => [e.key, e]))
    }

    const buildGraphTelemetry = ({ now, patterns = [], flowKnownGASet = new Set() } = {}) => {
      pruneTransitionStats(now)
      const analysisWindowMs = Math.max(5, Number(node.analysisWindowSec || 5)) * 1000
      const hotWindowMs = Math.max(10, Number(node.rateWindowSec || 10)) * 1000
      const hasFlowCatalog = flowKnownGASet instanceof Set && flowKnownGASet.size > 0
      const analysisCutoff = now - analysisWindowMs
      const currentCutoff = now - hotWindowMs
      const previousCutoff = now - (hotWindowMs * 2)
      const patternKeys = new Set(
        (Array.isArray(patterns) ? patterns : [])
          .filter(p => p && p.from && p.to)
          .map(p => edgeKey(String(p.from), String(p.to)))
      )

      const transitions = []
      for (const edge of node._transitionStats.values()) {
        if (!edge || !edge.from || !edge.to) continue
        const fromInFlow = !hasFlowCatalog || flowKnownGASet.has(String(edge.from || ''))
        const toInFlow = !hasFlowCatalog || flowKnownGASet.has(String(edge.to || ''))
        // Keep only flow<->flow and flow<->external relations.
        if (hasFlowCatalog && !fromInFlow && !toInFlow) continue
        const samples = Array.isArray(edge.samples) ? edge.samples.filter(s => s.ts >= analysisCutoff) : []
        const recentTs = Array.isArray(edge.recentTs) ? edge.recentTs : []
        const currentWindowCount = recentTs.filter(ts => ts >= currentCutoff).length
        const previousWindowCount = recentTs.filter(ts => ts >= previousCutoff && ts < currentCutoff).length
        if (currentWindowCount === 0 && !patternKeys.has(edge.key)) continue

        const lagValues = samples.map(s => Number(s.lagMs || 0)).filter(v => Number.isFinite(v) && v > 0)
        const eventCounts = {}
        for (let i = 0; i < samples.length; i++) {
          const ev = String(samples[i].event || 'unknown')
          eventCounts[ev] = (eventCounts[ev] || 0) + 1
        }

        transitions.push({
          key: edge.key,
          from: edge.from,
          to: edge.to,
          totalCount: Number(edge.count || 0),
          currentWindowCount,
          previousWindowCount,
          delta: currentWindowCount - previousWindowCount,
          lastAt: edge.lastAt ? new Date(edge.lastAt).toISOString() : '',
          fromInFlow,
          toInFlow,
          linkType: fromInFlow && toInFlow ? 'flow-flow' : (fromInFlow ? 'flow-external' : 'external-flow'),
          lagMs: {
            min: lagValues.length ? Math.min(...lagValues) : 0,
            avg: lagValues.length ? roundTo(lagValues.reduce((acc, v) => acc + v, 0) / lagValues.length, 1) : 0,
            p95: lagValues.length ? roundTo(percentileFromArray(lagValues, 0.95), 1) : 0,
            max: lagValues.length ? Math.max(...lagValues) : 0
          },
          edgeByEvent: eventCounts,
          recentTimeline: samples.slice(-10).map(s => ({
            at: new Date(s.ts).toISOString(),
            lagMs: roundTo(s.lagMs, 1),
            event: s.event
          }))
        })
      }

      transitions.sort((a, b) => {
        if (b.currentWindowCount !== a.currentWindowCount) return b.currentWindowCount - a.currentWindowCount
        if (b.totalCount !== a.totalCount) return b.totalCount - a.totalCount
        return String(a.key).localeCompare(String(b.key))
      })

      const patternTransitions = transitions.slice(0, 150)
      const edgeByEvent = patternTransitions.map(e => ({
        key: e.key,
        from: e.from,
        to: e.to,
        currentWindowCount: e.currentWindowCount,
        totalCount: e.totalCount,
        edgeByEvent: e.edgeByEvent,
        fromInFlow: !!e.fromInFlow,
        toInFlow: !!e.toInFlow,
        linkType: e.linkType || ''
      }))

      const hotEdgesDelta = patternTransitions
        .filter(e => e.delta !== 0)
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        .slice(0, 60)
        .map(e => ({
          key: e.key,
          from: e.from,
          to: e.to,
          currentWindowCount: e.currentWindowCount,
          previousWindowCount: e.previousWindowCount,
          delta: e.delta
        }))

      return {
        windowSec: Math.round(hotWindowMs / 1000),
        patternTransitions,
        edgeByEvent,
        hotEdgesDelta
      }
    }

    const buildGARateSeries = ({ now, topGAs = [], patterns = [], anomalyLifecycle = [] } = {}) => {
      pruneGARateSeries(now)
      const candidates = new Set()
        ; (topGAs || []).forEach(x => { if (x && x.ga) candidates.add(String(x.ga)) })
      ; (patterns || []).forEach(p => {
        if (p && p.from) candidates.add(String(p.from))
        if (p && p.to) candidates.add(String(p.to))
      })
      ; (anomalyLifecycle || []).forEach(a => { if (a && a.ga) candidates.add(String(a.ga)) })

      if (!candidates.size) {
        const recent = Array.from(node._gaRateSeries.values())
          .sort((a, b) => (b.lastSampleAt || 0) - (a.lastSampleAt || 0))
          .slice(0, 30)
        recent.forEach(r => candidates.add(r.ga))
      }

      const cutoff = now - (Math.max(30, Number(node.historyWindowSec || 30)) * 1000)
      const out = []
      for (const ga of candidates.values()) {
        const entry = node._gaRateSeries.get(ga)
        if (!entry || !Array.isArray(entry.points) || entry.points.length === 0) continue
        const points = entry.points.filter(p => p.ts >= cutoff).slice(-120)
        if (!points.length) continue
        const lastRatePerSec = Number(points[points.length - 1].ratePerSec || 0)
        const maxRatePerSec = points.reduce((acc, p) => Math.max(acc, Number(p.ratePerSec || 0)), 0)
        out.push({
          ga,
          lastRatePerSec: roundTo(lastRatePerSec, 3),
          maxRatePerSec: roundTo(maxRatePerSec, 3),
          anomalyCount: Number(entry.anomalyCount || 0),
          points: points.map(p => ({ at: new Date(p.ts).toISOString(), ratePerSec: Number(p.ratePerSec || 0) }))
        })
      }

      return out
        .sort((a, b) => {
          if (b.lastRatePerSec !== a.lastRatePerSec) return b.lastRatePerSec - a.lastRatePerSec
          if (b.maxRatePerSec !== a.maxRatePerSec) return b.maxRatePerSec - a.maxRatePerSec
          return String(a.ga).localeCompare(String(b.ga))
        })
        .slice(0, 60)
    }

    const buildSummary = (now) => {
      const windowMs = Math.max(5, node.analysisWindowSec) * 1000
      const cutoff = now - windowMs
      const items = node._history.filter(t => t.ts >= cutoff)
      const flowKnownGAs = Array.from(collectFlowGAs({ ttlMs: 10000, maxItems: 4000 }).values())
      const flowKnownGASet = new Set(flowKnownGAs.map(ga => String(ga || '').trim()).filter(Boolean))
      const byEvent = {}
      const byGA = {}
      const bySource = {}
      const gaNameCounts = {}
      const gaLastSeenMs = {}
      const gaLastPayload = {}
      let unknownDpt = 0
      let echoedCount = 0
      let repeatedCount = 0
      for (let i = 0; i < items.length; i++) {
        const t = items[i]
        const eventBase = String(t.event || 'unknown')
        const eventKey = t.repeated ? `${eventBase} (repeat)` : eventBase
        byEvent[eventKey] = (byEvent[eventKey] || 0) + 1
        byGA[t.destination] = (byGA[t.destination] || 0) + 1
        bySource[t.source] = (bySource[t.source] || 0) + 1
        const gaKey = String(t.destination || '').trim()
        if (gaKey) {
          gaLastSeenMs[gaKey] = Math.max(Number(gaLastSeenMs[gaKey] || 0), Number(t.ts || 0))
          gaLastPayload[gaKey] = compactPayloadForNodeLabel(t.payload, 34)
        }
        if (t.destination && t.devicename) {
          const ga = String(t.destination).trim()
          const name = String(t.devicename).trim()
          if (ga && name) {
            if (!gaNameCounts[ga]) gaNameCounts[ga] = {}
            gaNameCounts[ga][name] = (gaNameCounts[ga][name] || 0) + 1
          }
        }
        if (!t.dpt || t.dpt === 'unknown') unknownDpt += 1
        if (t.echoed) echoedCount += 1
        if (t.repeated) repeatedCount += 1
      }
      const topGAs = Object.keys(byGA)
        .map(ga => ({ ga, count: byGA[ga] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, Math.max(1, node.topN))
      const topSources = Object.keys(bySource)
        .map(src => ({ source: src, count: bySource[src] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, Math.max(1, Math.min(10, node.topN)))

      const overallRate = items.length / Math.max(1, node.analysisWindowSec)

      const gaLabels = {}
      Object.keys(gaNameCounts).forEach((ga) => {
        const names = gaNameCounts[ga] || {}
        const sorted = Object.keys(names).sort((a, b) => names[b] - names[a])
        if (sorted.length > 0) gaLabels[ga] = sorted[0]
      })
      const csvGaLabels = getGALabelsFromCsv()
      Object.keys(byGA).forEach((ga) => {
        if (gaLabels[ga]) return
        const fallback = String(csvGaLabels[ga] || '').trim()
        if (fallback) gaLabels[ga] = fallback
      })
      gaLabels.BUS = node.name || 'KNX AI'

      let patterns = []
      if (node.enablePattern) {
        const maxItems = Math.min(items.length, 400)
        const slice = items.slice(items.length - maxItems)
        const lagMs = Math.max(100, node.patternMaxLagMs)
        const hasFlowCatalog = flowKnownGASet.size > 0
        const pairs = new Map()
        for (let i = 0; i < slice.length; i++) {
          const a = slice[i]
          for (let j = i + 1; j < slice.length; j++) {
            const b = slice[j]
            const delta = b.ts - a.ts
            if (delta > lagMs) break
            if (!a.destination || !b.destination) continue
            if (a.destination === b.destination) continue
            if (hasFlowCatalog && !flowKnownGASet.has(String(a.destination || '')) && !flowKnownGASet.has(String(b.destination || ''))) continue
            const key = `${a.destination} -> ${b.destination}`
            pairs.set(key, (pairs.get(key) || 0) + 1)
          }
        }
        patterns = Array.from(pairs.entries())
          .map(([k, count]) => {
            const parts = k.split(' -> ')
            return { from: parts[0], to: parts[1], count, withinMs: lagMs }
          })
          .filter(p => p.count >= Math.max(2, node.patternMinCount))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }

      const anomalyLifecycle = buildAnomalyLifecycleSnapshot(now)
      const anomalyByGA = {}
      anomalyLifecycle.forEach((a) => {
        const ga = String(a && a.ga ? a.ga : '').trim()
        if (!ga) return
        anomalyByGA[ga] = (anomalyByGA[ga] || 0) + Math.max(1, Number(a && a.count ? a.count : 1))
      })
      const busConnection = buildBusConnectionSummary(now)
      const graphTelemetry = buildGraphTelemetry({ now, patterns, flowKnownGASet })
      const gaRateSeries = buildGARateSeries({
        now,
        topGAs,
        patterns,
        anomalyLifecycle
      })
      const flowNodeCatalog = collectFlowNodeCatalog({ ttlMs: 10000, maxNodes: 1200, maxGAsPerNode: 80 })

      const buildFlowMapTopology = () => {
        const graphNodes = new Map()
        const edgeMap = new Map()
        const nodeScore = {}
        const windowSec = Math.max(5, Number(node.rateWindowSec || 10))
        const currentCutoff = now - (windowSec * 1000)
        const previousCutoff = now - (windowSec * 2000)
        const responseReplyLagMs = 4000
        const responseReplyDelayMs = 1000
        const nodeLastSeenMs = {}
        const nodeLastPayload = {}
        const sourceLastSeenMs = {}
        const sourceLastPayload = {}
        const pendingReadsByGA = new Map()
        const gaAddressRe = /^\d{1,3}\/\d{1,3}\/\d{1,3}$/

        const isGAInFlow = (ga) => {
          const gaKey = String(ga || '').trim()
          if (!gaKey) return false
          if (flowKnownGASet.size && flowKnownGASet.has(gaKey)) return true
          if (flowNodeCatalog.gaReadersByGA.has(gaKey)) return true
          if (flowNodeCatalog.gaWritersByGA.has(gaKey)) return true
          return false
        }

        const touchNodeScore = (id, value) => {
          if (!id) return
          nodeScore[id] = Number(nodeScore[id] || 0) + Number(value || 0)
        }

        const ensureNode = (entry) => {
          if (!entry || !entry.id) return
          const id = String(entry.id || '').trim()
          if (!id) return
          if (!graphNodes.has(id)) {
            graphNodes.set(id, Object.assign({
              id,
              displayId: id,
              kind: 'ga',
              subtitle: '',
              payload: '',
              lastSeenAtMs: 0,
              inFlow: true,
              anomalyCount: 0,
              listenAllGA: false
            }, entry))
            return
          }
          const cur = graphNodes.get(id)
          cur.displayId = String(cur.displayId || entry.displayId || id)
          cur.kind = entry.kind || cur.kind || 'ga'
          if (!cur.subtitle && entry.subtitle) cur.subtitle = String(entry.subtitle)
          if (!cur.payload && entry.payload) cur.payload = String(entry.payload)
          cur.inFlow = entry.inFlow !== undefined ? !!entry.inFlow : cur.inFlow
          cur.lastSeenAtMs = Math.max(Number(cur.lastSeenAtMs || 0), Number(entry.lastSeenAtMs || 0))
          cur.anomalyCount = Math.max(Number(cur.anomalyCount || 0), Number(entry.anomalyCount || 0))
          cur.listenAllGA = entry.listenAllGA !== undefined ? !!entry.listenAllGA : !!cur.listenAllGA
          graphNodes.set(id, cur)
        }

        const ensureGANode = (ga) => {
          const gaKey = String(ga || '').trim()
          if (!gaKey) return
          ensureNode({
            id: gaKey,
            displayId: gaKey,
            kind: 'ga',
            subtitle: String(gaLabels[gaKey] || '').trim(),
            payload: String(gaLastPayload[gaKey] || '').trim(),
            lastSeenAtMs: Number(gaLastSeenMs[gaKey] || 0),
            inFlow: isGAInFlow(gaKey),
            anomalyCount: Number(anomalyByGA[gaKey] || 0)
          })
        }

        const ensureSourceNode = (sourceAddr) => {
          const src = String(sourceAddr || '').trim()
          if (!src) return
          ensureNode({
            id: `S:${src}`,
            displayId: src,
            kind: 'source',
            subtitle: 'KNX source',
            payload: String(sourceLastPayload[src] || '').trim(),
            lastSeenAtMs: Number(sourceLastSeenMs[src] || 0),
            inFlow: false,
            anomalyCount: 0
          })
        }

        const ensureFlowNode = (nodeId) => {
          const nid = String(nodeId || '').trim()
          if (!nid) return
          const nodeInfo = flowNodeCatalog.nodes.get(nid)
          const display = nodeInfo && nodeInfo.name ? String(nodeInfo.name).trim() : nid.slice(0, 8)
          const subtitleBits = []
          if (nodeInfo && nodeInfo.type) subtitleBits.push(String(nodeInfo.type))
          if (nodeInfo && nodeInfo.topic) subtitleBits.push(String(nodeInfo.topic))
          ensureNode({
            id: `N:${nid}`,
            displayId: display || nid,
            kind: 'node',
            subtitle: subtitleBits.join(' | '),
            payload: String(nodeLastPayload[nid] || '').trim(),
            lastSeenAtMs: Number(nodeLastSeenMs[nid] || 0),
            inFlow: true,
            anomalyCount: 0,
            listenAllGA: !!(nodeInfo && nodeInfo.listenAllGA)
          })
        }

        const ensureEdge = ({ from, to, fromKind = '', toKind = '' }) => {
          const fromId = String(from || '').trim()
          const toId = String(to || '').trim()
          if (!fromId || !toId || fromId === toId) return null
          const key = `${fromId} -> ${toId}`
          let edge = edgeMap.get(key)
          if (!edge) {
            const resolveInFlow = (id) => {
              if (!id) return false
              if (id.startsWith('N:')) return true
              if (id.startsWith('S:')) return false
              const known = graphNodes.get(id)
              if (known && known.inFlow !== undefined) return known.inFlow !== false
              return isGAInFlow(id)
            }
            const fromInFlow = resolveInFlow(fromId)
            const toInFlow = resolveInFlow(toId)
            let linkType = 'flow-flow'
            if (fromKind === 'node' && toKind === 'node') linkType = 'node-node'
            else if (fromKind === 'node' || toKind === 'node') {
              linkType = fromInFlow && toInFlow ? 'flow-flow' : (fromInFlow ? 'flow-external' : 'external-flow')
            } else {
              linkType = fromInFlow && toInFlow ? 'flow-flow' : 'external'
            }
            edge = {
              key,
              from: fromId,
              to: toId,
              fromKind: fromKind || (fromId.startsWith('N:') ? 'node' : (fromId.startsWith('S:') ? 'source' : 'ga')),
              toKind: toKind || (toId.startsWith('N:') ? 'node' : (toId.startsWith('S:') ? 'source' : 'ga')),
              fromInFlow,
              toInFlow,
              linkType,
              totalCount: 0,
              currentWindowCount: 0,
              previousWindowCount: 0,
              delta: 0,
              weight: 0,
              delayMs: 0,
              keepVisible: false,
              viaGa: '',
              lastAtMs: 0,
              lastAt: '',
              edgeByEvent: {}
            }
            edgeMap.set(key, edge)
          }
          return edge
        }

        const addTrafficEdge = ({ from, to, telegram, eventOverride = '', delayMs = 0, keepVisible = false, viaGa = '' }) => {
          const edge = ensureEdge({ from, to })
          if (!edge) return
          edge.totalCount += 1
          if (telegram.ts >= currentCutoff) edge.currentWindowCount += 1
          else if (telegram.ts >= previousCutoff) edge.previousWindowCount += 1
          edge.delayMs = Math.max(Number(edge.delayMs || 0), Math.max(0, Number(delayMs || 0)))
          edge.keepVisible = edge.keepVisible === true || keepVisible === true
          if (!edge.viaGa && viaGa) edge.viaGa = String(viaGa || '').trim()
          edge.lastAtMs = Math.max(Number(edge.lastAtMs || 0), Number(telegram.ts || 0))
          const eventBase = eventOverride ? String(eventOverride) : String(telegram.event || 'unknown')
          const eventKey = telegram.repeated ? `${eventBase} (repeat)` : eventBase
          edge.edgeByEvent[eventKey] = (edge.edgeByEvent[eventKey] || 0) + 1
        }

        // Static wiring between KNX nodes in Node-RED flow.
        for (let i = 0; i < flowNodeCatalog.nodeWireEdges.length; i++) {
          const w = flowNodeCatalog.nodeWireEdges[i]
          const fromNodeId = String(w && w.from ? w.from : '').trim()
          const toNodeId = String(w && w.to ? w.to : '').trim()
          if (!fromNodeId || !toNodeId) continue
          ensureFlowNode(fromNodeId)
          ensureFlowNode(toNodeId)
          ensureEdge({ from: `N:${fromNodeId}`, to: `N:${toNodeId}`, fromKind: 'node', toKind: 'node' })
        }

        // Static node<->GA topology from flow configuration (visible even with zero traffic).
        for (const nodeInfo of flowNodeCatalog.nodes.values()) {
          if (!nodeInfo || !nodeInfo.id) continue
          const nid = String(nodeInfo.id || '').trim()
          if (!nid) continue
          ensureFlowNode(nid)
          const gaRefs = Array.isArray(nodeInfo.gaRefs) ? nodeInfo.gaRefs : []
          for (let i = 0; i < gaRefs.length; i++) {
            const ga = String(gaRefs[i] || '').trim()
            if (!ga) continue
            ensureGANode(ga)
            if (nodeInfo.canRead) {
              ensureEdge({ from: ga, to: `N:${nid}`, fromKind: 'ga', toKind: 'node' })
            }
            if (nodeInfo.canWrite) {
              ensureEdge({ from: `N:${nid}`, to: ga, fromKind: 'node', toKind: 'ga' })
            }
          }
        }

        const allReaders = Array.from(flowNodeCatalog.listenAllReaders.values())
        for (let i = 0; i < items.length; i++) {
          const t = items[i]
          const ga = String(t && t.destination ? t.destination : '').trim()
          if (!ga) continue
          ensureGANode(ga)
          const payloadCompact = compactPayloadForNodeLabel(t.payload, 34)
          const sourceAddr = String(t && t.source ? t.source : '').trim()
          const eventNameLower = String(t && t.event ? t.event : '').toLowerCase()

          if (sourceAddr) {
            sourceLastSeenMs[sourceAddr] = Math.max(Number(sourceLastSeenMs[sourceAddr] || 0), Number(t.ts || 0))
            sourceLastPayload[sourceAddr] = payloadCompact
            const sourceLooksGA = gaAddressRe.test(sourceAddr)
            const sourceNodeId = sourceLooksGA ? sourceAddr : `S:${sourceAddr}`
            if (sourceLooksGA) ensureGANode(sourceAddr)
            else ensureSourceNode(sourceAddr)

            const writersForGA = flowNodeCatalog.gaWritersByGA.get(ga)
            const hasMappedWriter = !!(writersForGA && writersForGA.size > 0)
            const shouldDrawSourceEdge = !(t.echoed === true && hasMappedWriter)
            if (shouldDrawSourceEdge) {
              addTrafficEdge({ from: sourceNodeId, to: ga, telegram: t })
            }

            let pendingReads = pendingReadsByGA.get(ga)
            if (!pendingReads) pendingReads = []
            while (pendingReads.length > 0 && (Number(t.ts || 0) - Number(pendingReads[0].ts || 0)) > responseReplyLagMs) pendingReads.shift()

            if (eventNameLower.includes('read')) {
              pendingReads.push({ ts: Number(t.ts || 0), requesterId: sourceNodeId })
            } else if (eventNameLower.includes('response') && pendingReads.length > 0) {
              const pending = pendingReads.shift()
              const requesterId = String(pending && pending.requesterId ? pending.requesterId : '').trim()
              if (requesterId && requesterId !== sourceNodeId) {
                if (requesterId.startsWith('N:')) ensureFlowNode(requesterId.slice(2))
                else if (requesterId.startsWith('S:')) ensureSourceNode(requesterId.slice(2))
                else ensureGANode(requesterId)
                addTrafficEdge({
                  from: ga,
                  to: requesterId,
                  telegram: t,
                  eventOverride: 'GroupValue_Response (reply)',
                  delayMs: responseReplyDelayMs,
                  keepVisible: true
                })

                addTrafficEdge({
                  from: sourceNodeId,
                  to: requesterId,
                  telegram: t,
                  eventOverride: 'GroupValue_Response (responder)',
                  delayMs: responseReplyDelayMs,
                  keepVisible: true,
                  viaGa: ga
                })
              }
            }

            if (pendingReads.length > 0) pendingReadsByGA.set(ga, pendingReads)
            else pendingReadsByGA.delete(ga)
          }

          const readers = new Set()
          const specificReaders = flowNodeCatalog.gaReadersByGA.get(ga)
          if (specificReaders) {
            for (const nodeId of specificReaders.values()) readers.add(String(nodeId || ''))
          }
          for (let r = 0; r < allReaders.length; r++) {
            readers.add(String(allReaders[r] || ''))
          }
          for (const nodeId of readers.values()) {
            const nid = String(nodeId || '').trim()
            if (!nid) continue
            ensureFlowNode(nid)
            nodeLastSeenMs[nid] = Math.max(Number(nodeLastSeenMs[nid] || 0), Number(t.ts || 0))
            nodeLastPayload[nid] = payloadCompact
            addTrafficEdge({ from: ga, to: `N:${nid}`, telegram: t })
          }

          // Echoed telegrams are likely generated by local Node-RED writers.
          if (t.echoed === true) {
            const writers = flowNodeCatalog.gaWritersByGA.get(ga)
            if (writers) {
              for (const nodeId of writers.values()) {
                const nid = String(nodeId || '').trim()
                if (!nid) continue
                ensureFlowNode(nid)
                nodeLastSeenMs[nid] = Math.max(Number(nodeLastSeenMs[nid] || 0), Number(t.ts || 0))
                nodeLastPayload[nid] = payloadCompact
                addTrafficEdge({ from: `N:${nid}`, to: ga, telegram: t })
              }
            }
          }
        }

        Object.keys(anomalyByGA).forEach((ga) => ensureGANode(ga))

        const edges = Array.from(edgeMap.values())
          .map((e) => {
            e.delta = Number(e.currentWindowCount || 0) - Number(e.previousWindowCount || 0)
            e.weight = Number(e.currentWindowCount || 0)
            e.delayMs = Math.max(0, Number(e.delayMs || 0))
            e.keepVisible = e.keepVisible === true
            e.viaGa = String(e.viaGa || '').trim()
            e.lastAt = e.lastAtMs > 0 ? new Date(e.lastAtMs).toISOString() : ''
            const score = Math.max(Number(e.currentWindowCount || 0), Number(e.totalCount || 0))
            touchNodeScore(e.from, score)
            touchNodeScore(e.to, score)
            return e
          })
          .sort((a, b) => {
            if (b.weight !== a.weight) return b.weight - a.weight
            if (b.totalCount !== a.totalCount) return b.totalCount - a.totalCount
            return String(a.key).localeCompare(String(b.key))
          })
          .slice(0, 600)

        const nodeIdsInEdges = new Set()
        edges.forEach((e) => {
          nodeIdsInEdges.add(String(e.from || ''))
          nodeIdsInEdges.add(String(e.to || ''))
        })
        const staticFlowNodeIds = new Set(
          Array.from(flowNodeCatalog.nodes.keys())
            .map(id => `N:${String(id || '').trim()}`)
            .filter(Boolean)
        )
        const nodes = Array.from(graphNodes.values())
          .filter((n) => {
            const id = String(n && n.id ? n.id : '')
            if (!id) return false
            if (nodeIdsInEdges.has(id)) return true
            if (staticFlowNodeIds.has(id)) return true
            if (Number(n && n.anomalyCount ? n.anomalyCount : 0) > 0) return true
            return false
          })
          .map((n) => {
            const id = String(n.id || '')
            const entry = Object.assign({}, n)
            if (id.startsWith('N:')) {
              const nid = id.slice(2)
              entry.payload = String(nodeLastPayload[nid] || entry.payload || '').trim()
              entry.lastSeenAtMs = Math.max(Number(entry.lastSeenAtMs || 0), Number(nodeLastSeenMs[nid] || 0))
            } else if (id.startsWith('S:')) {
              const src = id.slice(2)
              entry.payload = String(sourceLastPayload[src] || entry.payload || '').trim()
              entry.lastSeenAtMs = Math.max(Number(entry.lastSeenAtMs || 0), Number(sourceLastSeenMs[src] || 0))
              entry.anomalyCount = 0
            } else {
              entry.payload = String(gaLastPayload[id] || entry.payload || '').trim()
              entry.lastSeenAtMs = Math.max(Number(entry.lastSeenAtMs || 0), Number(gaLastSeenMs[id] || 0))
              entry.anomalyCount = Math.max(Number(entry.anomalyCount || 0), Number(anomalyByGA[id] || 0))
            }
            entry.score = Number(nodeScore[id] || 0)
            return entry
          })
          .sort((a, b) => {
            if (Number(b.score || 0) !== Number(a.score || 0)) return Number(b.score || 0) - Number(a.score || 0)
            return String(a.displayId || a.id || '').localeCompare(String(b.displayId || b.id || ''))
          })
          .slice(0, 600)

        if (nodes.length === 0 && flowKnownGASet.size > 0) {
          for (const ga of flowKnownGASet.values()) {
            const gaKey = String(ga || '').trim()
            if (!gaKey) continue
            nodes.push({
              id: gaKey,
              displayId: gaKey,
              kind: 'ga',
              subtitle: String(gaLabels[gaKey] || '').trim(),
              payload: String(gaLastPayload[gaKey] || '').trim(),
              lastSeenAtMs: Number(gaLastSeenMs[gaKey] || 0),
              inFlow: true,
              anomalyCount: Number(anomalyByGA[gaKey] || 0),
              score: 0
            })
            if (nodes.length >= 600) break
          }
        }

        return {
          mode: 'node-ga',
          windowSec,
          nodes,
          edges
        }
      }

      const flowMapTopology = buildFlowMapTopology()

      const gaLabelCandidates = new Set()
      Object.keys(byGA).forEach(ga => gaLabelCandidates.add(String(ga || '').trim()))
      topGAs.forEach(x => gaLabelCandidates.add(String((x && x.ga) || '').trim()))
      patterns.forEach(p => {
        gaLabelCandidates.add(String((p && p.from) || '').trim())
        gaLabelCandidates.add(String((p && p.to) || '').trim())
      })
      anomalyLifecycle.forEach(a => gaLabelCandidates.add(String((a && a.ga) || '').trim()))
      graphTelemetry.patternTransitions.forEach(e => {
        gaLabelCandidates.add(String((e && e.from) || '').trim())
        gaLabelCandidates.add(String((e && e.to) || '').trim())
      })
      if (flowMapTopology && Array.isArray(flowMapTopology.edges)) {
        flowMapTopology.edges.forEach((e) => {
          const from = String((e && e.from) || '')
          const to = String((e && e.to) || '')
          if (from && !from.startsWith('N:')) gaLabelCandidates.add(from)
          if (to && !to.startsWith('N:')) gaLabelCandidates.add(to)
        })
      }
      gaLabelCandidates.forEach((ga) => {
        if (!ga || ga === 'BUS' || gaLabels[ga]) return
        const fallback = String(csvGaLabels[ga] || '').trim()
        if (fallback) gaLabels[ga] = fallback
      })

      const gaLastSeenAt = {}
      Object.keys(gaLastSeenMs).forEach((ga) => {
        const ts = Number(gaLastSeenMs[ga] || 0)
        if (ts > 0) gaLastSeenAt[ga] = new Date(ts).toISOString()
      })

      return {
        meta: {
          nodeId: node.id,
          nodeName: node.name,
          generatedAt: new Date(now).toISOString(),
          analysisWindowSec: node.analysisWindowSec,
          historyWindowSec: node.historyWindowSec
        },
        counters: {
          telegrams: items.length,
          echoed: echoedCount,
          repeated: repeatedCount,
          unknownDpt,
          overallRatePerSec: Number(overallRate.toFixed(2))
        },
        byEvent,
        topGAs,
        topSources,
        patterns,
        gaLabels,
        gaLastSeenAt,
        gaLastPayload,
        flowKnownGAs,
        flowKnownCount: flowKnownGASet.size,
        patternTransitions: graphTelemetry.patternTransitions,
        edgeByEvent: graphTelemetry.edgeByEvent,
        hotEdgesDelta: graphTelemetry.hotEdgesDelta,
        flowMapTopology,
        busConnection,
        anomalyLifecycle,
        gaRateSeries,
        graph: {
          windowSec: graphTelemetry.windowSec,
          edges: graphTelemetry.patternTransitions,
          hotEdgesDelta: graphTelemetry.hotEdgesDelta,
          anomalyLifecycle: anomalyLifecycle.filter(a => a.active)
        }
      }
    }

    const rebuildCachedSummaryNow = () => {
      const now = nowMs()
      trimHistory(now)
      const summary = buildSummary(now)
      node._lastSummary = summary
      node._lastSummaryAt = now
      return summary
    }

    const scheduleRealtimeSummaryRebuild = () => {
      if (node._summaryRebuildTimer) return
      node._summaryRebuildTimer = setTimeout(() => {
        node._summaryRebuildTimer = null
        try { rebuildCachedSummaryNow() } catch (error) { /* ignore */ }
      }, 90)
    }

    const buildLLMPrompt = ({ question, summary, compact = false } = {}) => {
      const compactMode = compact === true
      const maxEventsRequested = Math.max(10, Number(node.llmMaxEventsInPrompt) || 120)
      const maxEvents = Math.min(compactMode ? 80 : 240, maxEventsRequested)
      const recent = node._history.slice(-maxEvents)
      const wantsSvgChart = shouldGenerateSvgChart(question)
      const areasSnapshot = buildAreasSnapshot({ summary })
      const areasContext = buildAreasPromptContext(areasSnapshot)
      const summaryForPrompt = buildLlmSummarySnapshot(summary)
      const summaryText = truncatePromptText(safeStringify(summaryForPrompt), compactMode ? 4000 : 10000)
      const lines = recent.map(t => {
        const payloadStr = normalizeValueForCompare(t.payload)
        const rawStr = (node.llmIncludeRaw && t.rawHex) ? ` raw=${t.rawHex}` : ''
        const devName = t.devicename ? ` (${t.devicename})` : ''
        return `${new Date(t.ts).toISOString()} ${t.event} ${t.source} -> ${t.destination}${devName} dpt=${t.dpt} payload=${payloadStr}${rawStr}`
      })
      const recentLines = takeLastItemsByCharBudget(lines, compactMode ? 2600 : 7000)

      let flowContext = ''
      if (node.llmIncludeFlowContext) {
        const flowMaxChars = compactMode ? 1400 : 5000
        const ttlMs = 10 * 1000
        const now = nowMs()
        if (node._flowContextCache && node._flowContextCache.text && (now - (node._flowContextCache.at || 0)) < ttlMs) {
          flowContext = node._flowContextCache.text
        } else {
          const configuredMaxFlowNodes = Math.max(0, Number(node.llmMaxFlowNodesInPrompt) || 0)
          const maxFlowNodes = compactMode
            ? (configuredMaxFlowNodes > 0 ? Math.min(configuredMaxFlowNodes, 30) : 0)
            : configuredMaxFlowNodes
          flowContext = buildKnxUltimateFlowInventory({ maxNodes: maxFlowNodes })
          flowContext = truncatePromptText(flowContext, flowMaxChars)
          node._flowContextCache = { at: now, text: flowContext }
        }
        flowContext = truncatePromptText(flowContext, flowMaxChars)
      }

      let docsContext = ''
      if (node.llmIncludeDocsSnippets) {
        const docsMaxCharsConfigured = Math.max(500, Math.min(5000, Number(node.llmDocsMaxChars) || 500))
        const docsMaxChars = compactMode ? Math.min(docsMaxCharsConfigured, 1200) : docsMaxCharsConfigured
        const docsMaxSnippetsConfigured = Math.max(1, Number(node.llmDocsMaxSnippets) || 1)
        const docsMaxSnippets = compactMode ? Math.min(docsMaxSnippetsConfigured, 2) : docsMaxSnippetsConfigured
        const ttlMs = 30 * 1000
        const now = nowMs()
        const q = String(question || '').trim()
        if (node._docsContextCache && node._docsContextCache.text && node._docsContextCache.question === q && (now - (node._docsContextCache.at || 0)) < ttlMs) {
          docsContext = truncatePromptText(node._docsContextCache.text, docsMaxChars)
        } else {
          const preferredLangDir = (node.llmDocsLanguage && node.llmDocsLanguage !== 'auto') ? node.llmDocsLanguage : ''
          docsContext = buildRelevantDocsContext({
            moduleRootDir,
            question: q,
            preferredLangDir,
            maxSnippets: docsMaxSnippets,
            maxChars: docsMaxChars
          })
          docsContext = truncatePromptText(docsContext, docsMaxChars)
          node._docsContextCache = { at: now, question: q, text: docsContext }
        }
      }
      return [
        'KNX bus summary (JSON):',
        summaryText,
        '',
        areasContext || '',
        areasContext ? '' : '',
        flowContext ? 'Node-RED context:' : '',
        flowContext || '',
        flowContext ? '' : '',
        docsContext || '',
        docsContext ? '' : '',
        wantsSvgChart ? 'SVG output rules:' : '',
        wantsSvgChart ? '- Return exactly one fenced SVG block using ```svg ... ```.' : '',
        wantsSvgChart ? '- Inside the fence, output only a valid standalone <svg>...</svg>.' : '',
        wantsSvgChart ? '- Do not use JavaScript, external URLs, or <foreignObject>.' : '',
        wantsSvgChart ? '- Prefer width via viewBox and include labels + legend when useful.' : '',
        wantsSvgChart ? '' : '',
        'Recent KNX telegrams:',
        recentLines.join('\n'),
        '',
        'User request:',
        question || ''
      ].join('\n')
    }

    const getAreasBaseSnapshot = () => {
      const csv = (node.serverKNX && Array.isArray(node.serverKNX.csv)) ? node.serverKNX.csv : []
      if (node._areaSuggestionCache && node._areaSuggestionCache.ref === csv && node._areaSuggestionCache.snapshot) {
        return node._areaSuggestionCache.snapshot
      }
      const snapshot = buildSuggestedAreasFromCsv(csv)
      node._areaSuggestionCache = { ref: csv, snapshot }
      return snapshot
    }

    const getGaCatalogSnapshot = () => {
      const csv = (node.serverKNX && Array.isArray(node.serverKNX.csv)) ? node.serverKNX.csv : []
      const roleOverrides = loadGaRoleOverrides()
      const roleOverridesKey = JSON.stringify(roleOverrides || {})
      if (node._gaCatalogCache && node._gaCatalogCache.ref === csv && node._gaCatalogCache.roleOverridesKey === roleOverridesKey && Array.isArray(node._gaCatalogCache.snapshot)) {
        return node._gaCatalogCache.snapshot
      }
      const snapshot = applyGaRoleOverridesToCatalog({
        catalog: buildGaCatalogFromCsv(csv),
        roleOverrides
      })
      node._gaCatalogCache = { ref: csv, roleOverridesKey, snapshot }
      return snapshot
    }

    const getLegacyAreaStorageFile = () => {
      const baseDir = (node.serverKNX && node.serverKNX.userDir)
        ? node.serverKNX.userDir
        : path.join(RED.settings.userDir, 'knxultimatestorage')
      return path.join(baseDir, 'knxai', 'areas', `knxai-areas-${node.id}.json`)
    }

    const getAiConfigStorageFile = () => {
      const baseDir = (node.serverKNX && node.serverKNX.userDir)
        ? node.serverKNX.userDir
        : path.join(RED.settings.userDir, 'knxultimatestorage')
      return path.join(baseDir, 'knxai', 'config', `knxai-config-${node.id}.json`)
    }

    const loadPersistedAiConfig = () => {
      if (node._persistedAiConfigCache && typeof node._persistedAiConfigCache === 'object') return node._persistedAiConfigCache
      const configPath = getAiConfigStorageFile()
      const configData = readJsonFileSafe(configPath, null)
      if (configData && typeof configData === 'object') {
        const normalized = {
          areas: configData.areas && typeof configData.areas === 'object' ? configData.areas : {},
          gaRoles: configData.gaRoles && typeof configData.gaRoles === 'object' ? configData.gaRoles : {},
          profiles: Array.isArray(configData.profiles) ? configData.profiles : [],
          actuatorTests: Array.isArray(configData.actuatorTests) ? configData.actuatorTests : [],
          testPlans: Array.isArray(configData.testPlans) ? configData.testPlans : [],
          testResults: Array.isArray(configData.testResults) ? configData.testResults : []
        }
        node._persistedAiConfigCache = normalized
        return normalized
      }
      const legacyPath = getLegacyAreaStorageFile()
      const legacyData = readJsonFileSafe(legacyPath, {})
      const normalized = {
        areas: legacyData && legacyData.areas && typeof legacyData.areas === 'object' ? legacyData.areas : {},
        gaRoles: {},
        profiles: [],
        actuatorTests: [],
        testPlans: [],
        testResults: []
      }
      node._persistedAiConfigCache = normalized
      return normalized
    }

    const clonePersistedTestResult = (value, fallback = null) => {
      try {
        return JSON.parse(JSON.stringify(value))
      } catch (error) {
        return fallback
      }
    }

    const normalizeAiTestResultPayload = (payload, fallbackId = '') => {
      const source = clonePersistedTestResult(payload, null)
      if (!source || typeof source !== 'object') return null
      const baseId = normalizeAreaText(source.id || fallbackId || `test-result-${Date.now()}`)
      const generatedAt = (() => {
        try {
          const iso = new Date(source.generatedAt || Date.now()).toISOString()
          return iso
        } catch (error) {
          return new Date().toISOString()
        }
      })()
      const report = Object.assign({}, source, {
        id: baseId,
        generatedAt,
        mode: normalizeAreaText(source.mode, 'ai_test_plan'),
        name: normalizeProfileText(source.name, 'Test Result'),
        description: normalizeProfileText(source.description),
        overallStatus: normalizeAreaText(source.overallStatus, 'pass')
      })
      report.suggestions = Array.isArray(source.suggestions)
        ? source.suggestions.map(item => normalizeProfileText(item)).filter(Boolean)
        : []
      report.steps = Array.isArray(source.steps)
        ? source.steps.map(step => clonePersistedTestResult(step, null)).filter(step => step && typeof step === 'object')
        : []
      report.checks = Array.isArray(source.checks)
        ? source.checks.map(check => clonePersistedTestResult(check, null)).filter(check => check && typeof check === 'object')
        : []
      report.metrics = source.metrics && typeof source.metrics === 'object' ? clonePersistedTestResult(source.metrics, {}) : {}
      report.area = source.area && typeof source.area === 'object' ? clonePersistedTestResult(source.area, {}) : {}
      report.profile = source.profile && typeof source.profile === 'object' ? clonePersistedTestResult(source.profile, {}) : {}
      report.source = source.source && typeof source.source === 'object' ? clonePersistedTestResult(source.source, {}) : {}
      report.command = source.command && typeof source.command === 'object' ? clonePersistedTestResult(source.command, {}) : undefined
      report.statusWrite = source.statusWrite && typeof source.statusWrite === 'object' ? clonePersistedTestResult(source.statusWrite, {}) : undefined
      report.statusResponse = source.statusResponse && typeof source.statusResponse === 'object' ? clonePersistedTestResult(source.statusResponse, {}) : undefined
      report.statusRead = source.statusRead && typeof source.statusRead === 'object' ? clonePersistedTestResult(source.statusRead, {}) : undefined
      report.anomalyHighlights = Array.isArray(source.anomalyHighlights)
        ? source.anomalyHighlights.map(item => clonePersistedTestResult(item, null)).filter(item => item && typeof item === 'object')
        : []
      return report
    }

    const AI_TEST_RESULTS_MAX = 200

    const writePersistedAiConfig = (partialConfig) => {
      const current = loadPersistedAiConfig()
      const nextConfig = {
        areas: partialConfig && partialConfig.areas && typeof partialConfig.areas === 'object'
          ? partialConfig.areas
          : (current.areas || {}),
        gaRoles: partialConfig && partialConfig.gaRoles && typeof partialConfig.gaRoles === 'object'
          ? partialConfig.gaRoles
          : (current.gaRoles || {}),
        profiles: partialConfig && Array.isArray(partialConfig.profiles)
          ? partialConfig.profiles
          : (Array.isArray(current.profiles) ? current.profiles : []),
        actuatorTests: partialConfig && Array.isArray(partialConfig.actuatorTests)
          ? partialConfig.actuatorTests
          : (Array.isArray(current.actuatorTests) ? current.actuatorTests : []),
        testPlans: partialConfig && Array.isArray(partialConfig.testPlans)
          ? partialConfig.testPlans
          : (Array.isArray(current.testPlans) ? current.testPlans : []),
        testResults: partialConfig && Array.isArray(partialConfig.testResults)
          ? partialConfig.testResults
            .map((report, index) => normalizeAiTestResultPayload(report, `report-${index + 1}`))
            .filter(Boolean)
            .slice(0, AI_TEST_RESULTS_MAX)
          : (Array.isArray(current.testResults) ? current.testResults : [])
      }
      const filePath = getAiConfigStorageFile()
      const dirPath = path.dirname(filePath)
      if (!ensureDirectorySync(dirPath)) throw new Error('Unable to create KNX AI storage directory')
      fs.writeFileSync(filePath, JSON.stringify({
        version: 3,
        updatedAt: new Date().toISOString(),
        nodeId: node.id,
        gatewayId: node.serverKNX ? node.serverKNX.id : '',
        areas: nextConfig.areas,
        gaRoles: nextConfig.gaRoles,
        profiles: nextConfig.profiles,
        actuatorTests: nextConfig.actuatorTests,
        testPlans: nextConfig.testPlans,
        testResults: nextConfig.testResults
      }, null, 2), 'utf8')
      node._persistedAiConfigCache = nextConfig
      return nextConfig
    }

    const loadAreaOverrides = () => {
      const current = loadPersistedAiConfig()
      return current && current.areas && typeof current.areas === 'object' ? current.areas : {}
    }

    const loadGaRoleOverrides = () => {
      const current = loadPersistedAiConfig()
      return current && current.gaRoles && typeof current.gaRoles === 'object' ? current.gaRoles : {}
    }

    const writeAreaOverrides = (overrides) => {
      const current = loadPersistedAiConfig()
      return writePersistedAiConfig({
        areas: overrides && typeof overrides === 'object' ? overrides : {},
        gaRoles: current.gaRoles && typeof current.gaRoles === 'object' ? current.gaRoles : {},
        profiles: Array.isArray(current.profiles) ? current.profiles : [],
        actuatorTests: Array.isArray(current.actuatorTests) ? current.actuatorTests : [],
        testPlans: Array.isArray(current.testPlans) ? current.testPlans : [],
        testResults: Array.isArray(current.testResults) ? current.testResults : []
      })
    }

    const writeGaRoleOverrides = (overrides) => {
      const current = loadPersistedAiConfig()
      return writePersistedAiConfig({
        areas: current.areas && typeof current.areas === 'object' ? current.areas : {},
        gaRoles: overrides && typeof overrides === 'object' ? overrides : {},
        profiles: Array.isArray(current.profiles) ? current.profiles : [],
        actuatorTests: Array.isArray(current.actuatorTests) ? current.actuatorTests : [],
        testPlans: Array.isArray(current.testPlans) ? current.testPlans : [],
        testResults: Array.isArray(current.testResults) ? current.testResults : []
      })
    }

    const loadCustomAreaProfiles = () => {
      const current = loadPersistedAiConfig()
      return Array.isArray(current.profiles) ? current.profiles : []
    }

    const writeCustomAreaProfiles = (profiles) => {
      const current = loadPersistedAiConfig()
      return writePersistedAiConfig({
        areas: current.areas && typeof current.areas === 'object' ? current.areas : {},
        gaRoles: current.gaRoles && typeof current.gaRoles === 'object' ? current.gaRoles : {},
        profiles: Array.isArray(profiles) ? profiles : [],
        actuatorTests: Array.isArray(current.actuatorTests) ? current.actuatorTests : [],
        testPlans: Array.isArray(current.testPlans) ? current.testPlans : [],
        testResults: Array.isArray(current.testResults) ? current.testResults : []
      })
    }

    const loadActuatorTestPresets = () => {
      const current = loadPersistedAiConfig()
      return Array.isArray(current.actuatorTests) ? current.actuatorTests : []
    }

    const writeActuatorTestPresets = (presets) => {
      const current = loadPersistedAiConfig()
      return writePersistedAiConfig({
        areas: current.areas && typeof current.areas === 'object' ? current.areas : {},
        gaRoles: current.gaRoles && typeof current.gaRoles === 'object' ? current.gaRoles : {},
        profiles: Array.isArray(current.profiles) ? current.profiles : [],
        actuatorTests: Array.isArray(presets) ? presets : [],
        testPlans: Array.isArray(current.testPlans) ? current.testPlans : [],
        testResults: Array.isArray(current.testResults) ? current.testResults : []
      })
    }

    const loadAiTestPlans = () => {
      const current = loadPersistedAiConfig()
      return Array.isArray(current.testPlans) ? current.testPlans : []
    }

    const writeAiTestPlans = (plans) => {
      const current = loadPersistedAiConfig()
      return writePersistedAiConfig({
        areas: current.areas && typeof current.areas === 'object' ? current.areas : {},
        gaRoles: current.gaRoles && typeof current.gaRoles === 'object' ? current.gaRoles : {},
        profiles: Array.isArray(current.profiles) ? current.profiles : [],
        actuatorTests: Array.isArray(current.actuatorTests) ? current.actuatorTests : [],
        testPlans: Array.isArray(plans) ? plans : [],
        testResults: Array.isArray(current.testResults) ? current.testResults : []
      })
    }

    const loadAiTestResults = () => {
      const current = loadPersistedAiConfig()
      return Array.isArray(current.testResults) ? current.testResults : []
    }

    const writeAiTestResults = (results) => {
      const current = loadPersistedAiConfig()
      return writePersistedAiConfig({
        areas: current.areas && typeof current.areas === 'object' ? current.areas : {},
        gaRoles: current.gaRoles && typeof current.gaRoles === 'object' ? current.gaRoles : {},
        profiles: Array.isArray(current.profiles) ? current.profiles : [],
        actuatorTests: Array.isArray(current.actuatorTests) ? current.actuatorTests : [],
        testPlans: Array.isArray(current.testPlans) ? current.testPlans : [],
        testResults: Array.isArray(results) ? results : []
      })
    }

    const buildAiTestResultsSnapshot = () => {
      return loadAiTestResults()
        .map((report, index) => normalizeAiTestResultPayload(report, `result-${index + 1}`))
        .filter(Boolean)
        .sort((a, b) => String(b.generatedAt || '').localeCompare(String(a.generatedAt || '')))
    }

    const appendAiTestResult = (reportPayload) => {
      const normalized = normalizeAiTestResultPayload(reportPayload, `result-${Date.now()}`)
      if (!normalized) throw new Error('Invalid test result payload')
      const nextResults = buildAiTestResultsSnapshot()
        .filter(report => String(report && report.id ? report.id : '') !== normalized.id)
      nextResults.unshift(normalized)
      writeAiTestResults(nextResults.slice(0, AI_TEST_RESULTS_MAX))
      return buildAiTestResultsSnapshot()
    }

    const deleteAiTestResultById = (reportId) => {
      const targetId = String(reportId || '').trim()
      if (!targetId) throw new Error('Missing reportId')
      const nextResults = buildAiTestResultsSnapshot()
        .filter(report => String(report && report.id ? report.id : '') !== targetId)
      writeAiTestResults(nextResults.slice(0, AI_TEST_RESULTS_MAX))
      return buildAiTestResultsSnapshot()
    }

    const buildAreasSnapshot = ({ summary } = {}) => {
      const baseSnapshot = getAreasBaseSnapshot()
      const mergedSnapshot = applyAreaOverridesToSnapshot({
        snapshot: baseSnapshot,
        overrides: loadAreaOverrides(),
        gaCatalog: getGaCatalogSnapshot()
      })
      const suggested = Array.isArray(mergedSnapshot.suggested) ? mergedSnapshot.suggested : []
      const filteredSuggested = suggested.filter((area) => {
        const kind = String(area && area.kind ? area.kind : '')
        return kind === 'custom_manual' || kind === 'custom_llm'
      })
      const filteredGaSet = new Set()
      filteredSuggested.forEach((area) => {
        (Array.isArray(area && area.gaList) ? area.gaList : []).forEach((ga) => {
          const normalizedGa = String(ga || '').trim()
          if (normalizedGa) filteredGaSet.add(normalizedGa)
        })
      })
      const filteredSnapshot = Object.assign({}, mergedSnapshot, {
        source: filteredSuggested.length ? 'custom' : 'none',
        totals: Object.assign({}, mergedSnapshot.totals || {}, {
          gaCount: filteredGaSet.size,
          hierarchicalGaCount: 0,
          secondaryGroupCount: 0,
          mainGroupCount: 0,
          suggestedAreaCount: filteredSuggested.length
        }),
        suggested: filteredSuggested
      })
      return enrichSuggestedAreasWithSummary({ baseSnapshot: filteredSnapshot, summary })
    }

    const buildProfilesSnapshot = () => {
      return mergeAreaProfiles({ customProfiles: loadCustomAreaProfiles() })
    }

    const buildActuatorTestsSnapshot = () => {
      return mergeActuatorTestPresets({ customPresets: loadActuatorTestPresets() })
    }

    const buildAiTestPlansSnapshot = () => {
      return mergeAiTestPlans({ customPlans: loadAiTestPlans() })
    }

    const buildAiConfigExport = ({ summary } = {}) => {
      return {
        version: 3,
        exportedAt: new Date().toISOString(),
        node: {
          id: node.id,
          name: node.name || '',
          gatewayId: node.serverKNX ? node.serverKNX.id : '',
          gatewayName: (node.serverKNX && node.serverKNX.name) ? node.serverKNX.name : ''
        },
        areas: loadAreaOverrides(),
        gaRoles: loadGaRoleOverrides(),
        profiles: loadCustomAreaProfiles(),
        actuatorTests: loadActuatorTestPresets(),
        testPlans: loadAiTestPlans(),
        testResults: loadAiTestResults(),
        live: {
          areas: buildAreasSnapshot({ summary }),
          profiles: buildProfilesSnapshot(),
          actuatorTests: buildActuatorTestsSnapshot(),
          testPlans: buildAiTestPlansSnapshot(),
          testResults: buildAiTestResultsSnapshot()
        }
      }
    }

    const buildAreaLlmCatalogLines = ({ gaCatalog, limit = 400 }) => {
      return (Array.isArray(gaCatalog) ? gaCatalog : [])
        .slice(0, Math.max(1, Number(limit) || 400))
        .map((item) => {
          const tags = Array.isArray(item && item.tags) && item.tags.length ? ` | tags ${item.tags.join(',')}` : ''
          const pathLabel = normalizeAreaText(item && item.hierarchyPath ? item.hierarchyPath : '')
          const pathChunk = pathLabel ? ` | path ${pathLabel}` : ''
          const role = normalizeAreaText(item && item.role ? item.role : item && item.baseRole ? item.baseRole : '')
          const roleSource = normalizeAreaText(item && item.roleSource ? item.roleSource : item && item.baseRoleSource ? item.baseRoleSource : '')
          const roleChunk = role ? ` | role ${role}${roleSource ? ` (${roleSource})` : ''}` : ''
          return `- ${item.ga} | dpt ${item.dpt || 'n/a'} | ${normalizeAreaText(item.label || item.ga)}${pathChunk}${roleChunk}${tags}`
        })
    }

    const normalizeAreaSuggestionPayload = ({ candidate, gaCatalogMap, fallbackIndex = 0, idPrefix = 'llm' }) => {
      const source = candidate && typeof candidate === 'object' ? candidate : {}
      const rawGaList = Array.isArray(source.gaList)
        ? source.gaList
        : Array.isArray(source.groupAddresses)
          ? source.groupAddresses
          : Array.isArray(source.gas)
            ? source.gas
            : []
      const gaList = Array.from(new Set(rawGaList.map(ga => normalizeAreaText(ga)).filter(ga => gaCatalogMap.has(ga)))).slice(0, 5000)
      if (!gaList.length) return null
      const fallbackName = `LLM Area ${fallbackIndex + 1}`
      const name = normalizeAreaText(source.name || source.title || fallbackName)
      const description = normalizeAreaText(source.description || source.note || '')
      const tags = Array.isArray(source.tags)
        ? Array.from(new Set(source.tags.map(tag => slugifyAreaText(tag)).filter(Boolean))).slice(0, 12)
        : []
      let areaId = normalizeAreaText(source.id || '')
      if (areaId) {
        areaId = `${idPrefix}:${slugifyAreaText(areaId)}`
      } else {
        areaId = `${idPrefix}:${slugifyAreaText(name || fallbackName)}`
      }
      return {
        id: areaId,
        name: name || fallbackName,
        description,
        tags,
        gaList
      }
    }

    const buildAreaRegenerationPrompt = ({ gaCatalog }) => {
      const lines = buildAreaLlmCatalogLines({ gaCatalog, limit: 500 })
      return [
        'Create practical operational KNX areas for an installer.',
        'Analyze the following KNX group addresses and cluster them into meaningful areas.',
        'Each area must group related GA that belong to the same room, zone, or functional unit.',
        'Return JSON only.',
        '',
        'JSON format:',
        '{ "areas": [ { "name": "string", "description": "string", "tags": ["string"], "gaList": ["0/0/1"] } ] }',
        '',
        'Rules:',
        '- Use only GA present in the list below.',
        '- Each area must contain at least 2 GA.',
        '- Prefer room/zone/function oriented areas.',
        '- Keep the number of areas reasonable.',
        '- Do not invent GA.',
        '',
        'Group addresses:',
        lines.join('\n')
      ].join('\n')
    }

    const buildAreaDraftSuggestionPrompt = ({ prompt, draftName, draftDescription, currentGaList, gaCatalog }) => {
      const lines = buildAreaLlmCatalogLines({ gaCatalog, limit: 500 })
      const currentGaLines = Array.isArray(currentGaList) && currentGaList.length
        ? currentGaList.map(ga => `- ${ga}`).join('\n')
        : '- none'
      return [
        'Help an installer compose a custom KNX area.',
        'Given the installer request and the available group addresses, choose the GA that belong to the requested area.',
        'Return JSON only.',
        '',
        'JSON format:',
        '{ "name": "string", "description": "string", "tags": ["string"], "gaList": ["0/0/1"] }',
        '',
        'Rules:',
        '- Use only GA present in the list below.',
        '- Keep existing GA if they still fit the request.',
        '- Do not invent GA.',
        '- Prefer a clean operational area that an installer would actually use.',
        '',
        `Installer request: ${prompt || ''}`,
        `Draft name: ${draftName || ''}`,
        `Draft description: ${draftDescription || ''}`,
        'Current GA:',
        currentGaLines,
        '',
        'Available group addresses:',
        lines.join('\n')
      ].join('\n')
    }

    const buildGaRoleSuggestionPrompt = ({ gaCatalog }) => {
      const lines = (Array.isArray(gaCatalog) ? gaCatalog : []).map((item) => {
        const pathLabel = normalizeAreaText(item && item.hierarchyPath ? item.hierarchyPath : '')
        const pathChunk = pathLabel ? ` | path ${pathLabel}` : ''
        const etsName = normalizeAreaText(item && item.etsName ? item.etsName : '')
        const etsChunk = etsName ? ` | ets ${etsName}` : ''
        const mainChunk = normalizeAreaText(item && item.mainGroup ? item.mainGroup : '') ? ` | main ${normalizeAreaText(item.mainGroup)}` : ''
        const middleChunk = normalizeAreaText(item && item.middleGroup ? item.middleGroup : '') ? ` | middle ${normalizeAreaText(item.middleGroup)}` : ''
        const currentRole = normalizeAreaText(item && item.baseRole ? item.baseRole : item && item.role ? item.role : 'neutral')
        const currentSource = normalizeAreaText(item && item.baseRoleSource ? item.baseRoleSource : item && item.roleSource ? item.roleSource : '')
        return `- ${item.ga} | dpt ${item.dpt || 'n/a'} | label ${normalizeAreaText(item.label || item.ga)}${etsChunk}${mainChunk}${middleChunk}${pathChunk} | current ${currentRole}${currentSource ? ` (${currentSource})` : ''}`
      })
      return [
        'Classify the KNX role of each group address.',
        'Return JSON only.',
        '',
        'JSON format:',
        '{ "roles": [ { "ga": "0/0/1", "role": "command|status|neutral" } ] }',
        '',
        'Rules:',
        '- Use only the listed GA.',
        '- command = actuator command or setpoint object.',
        '- status = feedback, state, indication, actual result, read/response object.',
        '- neutral = sensor, measurement, scene support, or unclear.',
        '- Prefer status when the GA clearly represents feedback/state.',
        '- Use the ETS name, label, hierarchy, and multilingual wording to infer the role.',
        '- The names may contain Italian, English, German, French, Spanish, Portuguese, or mixed KNX installer wording.',
        '- If unsure, return neutral.',
        '',
        'Group addresses to classify:',
        lines.join('\n')
      ].join('\n')
    }

    const buildTestPlanTranslationPrompt = ({ language, languageName, plan }) => {
      const safePlan = plan && typeof plan === 'object' ? plan : {}
      const payload = {
        steps: (Array.isArray(safePlan.steps) ? safePlan.steps : []).map((step) => ({
          id: String(step && step.id ? step.id : ''),
          title: normalizeProfileText(step && step.title),
          description: normalizeProfileText(step && step.description)
        }))
      }
      return [
        `Translate the following KNX test step titles and descriptions into ${languageName || language}.`,
        'Return JSON only.',
        '',
        'JSON format:',
        '{ "steps": [ { "id": "string", "title": "string", "description": "string" } ] }',
        '',
        'Rules:',
        '- Keep every step id unchanged.',
        '- Translate only title and description.',
        '- Do not change KNX addresses, payloads, DPT, identifiers, or technical meaning.',
        '- Use concise installer-friendly wording.',
        '',
        safeStringify(payload)
      ].join('\n')
    }

    const translateTestPlanLabelsWithLlm = async ({ language, plan }) => {
      const targetLanguage = normalizeLanguageCode(language, 'en')
      const targetLanguageName = languageNameFromCode(targetLanguage)
      if (targetLanguage === 'en') {
        return {
          plan,
          provider: '',
          model: '',
          translated: false
        }
      }
      if (!node.llmEnabled) {
        return {
          plan,
          provider: '',
          model: '',
          translated: false
        }
      }
      const jsonMaxTokens = Math.max(50000, Number(node.llmMaxTokens) || 0)
      const llmResponse = await callLLMChat({
        systemPrompt: [
          'You are a KNX installer assistant.',
          'Translate only human-readable KNX test labels.',
          'Return JSON only.'
        ].join(' '),
        userContent: buildTestPlanTranslationPrompt({ language: targetLanguage, languageName: targetLanguageName, plan }),
        maxTokensOverride: jsonMaxTokens
      })
      const parsed = extractJsonFragmentFromText(llmResponse.content)
      const translatedSteps = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed && parsed.steps)
          ? parsed.steps
          : Array.isArray(parsed && parsed.translations)
            ? parsed.translations
            : Array.isArray(parsed && parsed.items)
              ? parsed.items
              : []
      if (!translatedSteps.length) {
        return {
          plan,
          provider: llmResponse.provider || '',
          model: llmResponse.model || '',
          translated: false
        }
      }
      const translatedById = new Map(translatedSteps.map((step) => [String(step && step.id ? step.id : '').trim(), step]))
      const nextPlan = Object.assign({}, plan, {
        steps: (Array.isArray(plan && plan.steps) ? plan.steps : []).map((step) => {
          const translated = translatedById.get(String(step && step.id ? step.id : '').trim())
          if (!translated) return step
          return Object.assign({}, step, {
            title: normalizeProfileText(translated.title, step.title || ''),
            description: normalizeProfileText(translated.description, step.description || '')
          })
        })
      })
      return {
        plan: nextPlan,
        provider: llmResponse.provider || '',
        model: llmResponse.model || '',
        translated: true
      }
    }

    const suggestGaRoleOverridesWithLlm = async ({ gaCatalog }) => {
      const candidates = (Array.isArray(gaCatalog) ? gaCatalog : []).filter(item => item && item.ga && isAmbiguousGaRoleSource(item.baseRoleSource || item.roleSource))
      if (!candidates.length) return {}
      const jsonMaxTokens = Math.max(50000, Number(node.llmMaxTokens) || 0)
      const llmResponse = await callLLMChat({
        systemPrompt: [
          'You are a KNX installation modeling assistant.',
          'Classify KNX group addresses as command, status, or neutral for installers.',
          'Return JSON only.'
        ].join(' '),
        userContent: buildGaRoleSuggestionPrompt({ gaCatalog: candidates }),
        maxTokensOverride: jsonMaxTokens
      })
      const parsed = extractJsonFragmentFromText(llmResponse.content)
      const gaCatalogMap = new Map(candidates.map(item => [String(item.ga).trim(), item]))
      const suggested = normalizeGaRoleSuggestionPayload({ payload: parsed, gaCatalogMap })
      const overrides = {}
      Object.entries(suggested).forEach(([ga, role]) => {
        const item = gaCatalogMap.get(ga)
        if (!item) return
        const baseRole = normalizeGaRoleValue(item.baseRole || item.role, 'neutral')
        if (role !== baseRole) overrides[ga] = role
      })
      return overrides
    }

    const getCsvRowsByGa = () => {
      const csv = (node.serverKNX && Array.isArray(node.serverKNX.csv)) ? node.serverKNX.csv : []
      if (node._csvRowsByGaCache && node._csvRowsByGaCache.ref === csv && node._csvRowsByGaCache.map instanceof Map) {
        return node._csvRowsByGaCache.map
      }
      const out = new Map()
      csv.forEach((row) => {
        const ga = normalizeAreaText(row && row.ga)
        if (!ga || out.has(ga)) return
        out.set(ga, row || {})
      })
      node._csvRowsByGaCache = { ref: csv, map: out }
      return out
    }

    const buildAreaSignalCatalog = ({ areaId, summary } = {}) => {
      const targetAreaId = String(areaId || '').trim()
      if (!targetAreaId) throw new Error('Missing areaId')
      const safeSummary = summary || rebuildCachedSummaryNow()
      const areas = buildAreasSnapshot({ summary: safeSummary })
      const area = Array.isArray(areas.suggested) ? areas.suggested.find(item => item.id === targetAreaId) : null
      if (!area) throw new Error(`Area '${targetAreaId}' not found`)

      const gaLastSeenAt = safeSummary && typeof safeSummary.gaLastSeenAt === 'object' ? safeSummary.gaLastSeenAt : {}
      const gaLastPayload = safeSummary && typeof safeSummary.gaLastPayload === 'object' ? safeSummary.gaLastPayload : {}
      const rowsByGa = getCsvRowsByGa()
      const gaCatalogMap = new Map(getGaCatalogSnapshot().map(item => [String(item && item.ga ? item.ga : '').trim(), item]))
      const dptOptionsById = {}

      const signals = (Array.isArray(area.gaList) ? area.gaList : [])
        .map((ga) => {
          const row = rowsByGa.get(ga) || {}
          const catalogItem = gaCatalogMap.get(ga) || {}
          const parsed = parseEtsHierarchyLabel(row.devicename)
          const label = normalizeAreaText(catalogItem.label || parsed.deviceLabel || row.devicename || ga)
          const dpt = normalizeAreaText(catalogItem.dpt || row.dpt)
          const valueOptions = Array.isArray(catalogItem.valueOptions) && catalogItem.valueOptions.length
            ? catalogItem.valueOptions
            : getDptValueOptions(dpt)
          if (dpt && valueOptions.length) dptOptionsById[dpt] = valueOptions
          const role = normalizeGaRoleValue(catalogItem.role, inferSignalRole({ label, dpt }))
          const stem = normalizeSignalStem(label) || slugifyAreaText(label)
          const category = inferSignalCategory({ label, areaTags: area.tags })
          return {
            ga,
            dpt,
            label,
            valueOptions,
            role,
            roleSource: normalizeAreaText(catalogItem.roleSource || ''),
            roleOverride: normalizeGaRoleValue(catalogItem.roleOverride, 'auto'),
            baseRole: normalizeGaRoleValue(catalogItem.baseRole, role),
            baseRoleSource: normalizeAreaText(catalogItem.baseRoleSource || ''),
            stem,
            category,
            mainGroup: parsed.mainGroup || '',
            middleGroup: parsed.middleGroup || '',
            lastSeenAt: gaLastSeenAt[ga] || '',
            lastPayload: gaLastPayload[ga] !== undefined ? gaLastPayload[ga] : '',
            hierarchyPath: parsed.hierarchyPath || area.path || area.name || ''
          }
        })
        .filter(signal => signal.ga)

      const commandSignals = signals.filter(signal => signal.role === 'command')
      const statusSignals = signals.filter(signal => signal.role === 'status')
      const neutralSignals = signals.filter(signal => signal.role === 'neutral')

      const pairs = commandSignals
        .map((command) => {
          let bestStatus = null
          let bestScore = 0
          statusSignals.forEach((status) => {
            const score = scoreSignalPair({ command, status })
            if (score > bestScore) {
              bestScore = score
              bestStatus = status
            }
          })
          const status = bestScore >= 4 ? bestStatus : null
          return {
            id: `${slugifyAreaText(command.ga)}-${slugifyAreaText(status ? status.ga : 'nostatus')}`,
            category: command.category || (status && status.category) || '',
            score: bestScore,
            label: command.label,
            command,
            status
          }
        })
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return String(a.label || a.command.ga || '').localeCompare(String(b.label || b.command.ga || ''))
        })

      return {
        area: {
          id: area.id,
          name: area.name || '',
          path: area.path || area.name || '',
          tags: Array.isArray(area.tags) ? area.tags : [],
          gaCount: Number(area.gaCount || 0)
        },
        stats: {
          signalCount: signals.length,
          commandCount: commandSignals.length,
          statusCount: statusSignals.length,
          neutralCount: neutralSignals.length,
          pairCount: pairs.filter(pair => !!pair.status).length
        },
        dptOptionsById,
        signals,
        commandSignals,
        statusSignals,
        neutralSignals,
        pairs
      }
    }

    const inferDefaultPayloadForSignal = ({ signal, prompt }) => {
      const dpt = String(signal && signal.dpt ? signal.dpt : '').trim()
      const text = normalizeSignalText(prompt)
      const action = detectPrimaryActionFromText(prompt)
      if (/^1\./.test(dpt)) {
        if (actionImpliesTruthy(action) || /\b(on|true|1|accendi|attiva|apri|up|su|allume|einschalten|enciende|liga|aan)\b/.test(text)) return 'true'
        if (actionImpliesFalsy(action) || /\b(off|false|0|spegni|disattiva|chiudi|down|giu|ferma|stop|eteins|ausschalten|apaga|desliga|uit)\b/.test(text)) return 'false'
        return 'true'
      }
      if (/^5\./.test(dpt)) {
        const percentMatch = text.match(/\b(\d{1,3})\s*%/)
        if (percentMatch) return String(Math.max(0, Math.min(100, Number(percentMatch[1] || 0))))
        if (action === 'open' || /\b(open|apri|up|su|ouvre|offnen|abre|abrir|openen)\b/.test(text)) return '100'
        if (action === 'close' || /\b(close|chiudi|down|giu|ferme|schliessen|cierra|fechar|sluiten)\b/.test(text)) return '0'
        return '100'
      }
      return ''
    }

    const extractPromptActionSequence = (prompt) => {
      return extractActionHitsFromText(prompt).map(hit => hit.type)
    }

    const payloadFromPromptAction = ({ signal, action, fallbackPrompt }) => {
      const dpt = String(signal && signal.dpt ? signal.dpt : '').trim()
      const valueOptions = Array.isArray(signal && signal.valueOptions) ? signal.valueOptions : []
      const actionName = String(action || '').trim().toLowerCase()

      if (/^1\./.test(dpt)) {
        if (['on', 'open'].includes(actionName)) return 'true'
        if (['off', 'close', 'stop'].includes(actionName)) return 'false'
      }

      if (/^5\./.test(dpt)) {
        if (actionName === 'open' || actionName === 'on') return '100'
        if (actionName === 'close' || actionName === 'off' || actionName === 'stop') return '0'
      }

      if (valueOptions.length) {
        const labelsByValue = new Map(valueOptions.map(option => [String(option.value), normalizeSignalText(option.label)]))
        if (['on', 'open'].includes(actionName)) {
          const direct = ['true', '1', '100'].find(value => labelsByValue.has(value))
          if (direct) return direct
          const byLabel = valueOptions.find(option => /\b(on|open|up|start|enable|enabled|active|aperto|acceso|su)\b/.test(normalizeSignalText(option.label)))
          if (byLabel) return String(byLabel.value)
        }
        if (['off', 'close', 'stop'].includes(actionName)) {
          const direct = ['false', '0'].find(value => labelsByValue.has(value))
          if (direct) return direct
          const byLabel = valueOptions.find(option => /\b(off|close|down|stop|disable|disabled|inactive|chiuso|spento|giu)\b/.test(normalizeSignalText(option.label)))
          if (byLabel) return String(byLabel.value)
        }
      }

      return inferDefaultPayloadForSignal({ signal, prompt: fallbackPrompt })
    }

    const supportsPresetActionForSignal = ({ signal, action, prompt }) => {
      if (!signal || !signal.ga) return false
      const dpt = String(signal.dpt || '').trim()
      const actionName = String(action || '').trim().toLowerCase()
      if (!actionName) return false
      if (/^1\./.test(dpt)) return ['on', 'off', 'open', 'close', 'stop'].includes(actionName)
      if (/^5\./.test(dpt)) return ['on', 'off', 'open', 'close', 'stop'].includes(actionName)
      const payload = payloadFromPromptAction({ signal, action, fallbackPrompt: prompt })
      return String(payload || '').trim() !== ''
    }

    const buildDeterministicPresetTestPlan = ({ areaId, prompt, catalog }) => {
      const requestedActions = Array.from(new Set(extractPromptActionSequence(prompt).filter(Boolean)))
      const actionSequence = requestedActions.length ? requestedActions : ['on']
      const targetCategory = inferPromptScopeCategory(prompt)
      const areaText = normalizeSignalText(prompt)
      const pairByCommandGA = new Map((Array.isArray(catalog && catalog.pairs) ? catalog.pairs : [])
        .filter(pair => pair && pair.command && pair.command.ga)
        .map(pair => [pair.command.ga, pair]))

      const commandSignals = (Array.isArray(catalog && catalog.commandSignals) ? catalog.commandSignals : [])
        .filter((signal) => {
          if (!signal || !signal.ga) return false
          if (targetCategory && String(signal.category || '').trim().toLowerCase() !== targetCategory) return false
          if (targetCategory === 'lighting' && !/^1\./.test(String(signal.dpt || '').trim())) return false
          return true
        })
        .filter((signal) => {
          const haystack = normalizeSignalText([
            signal.label,
            signal.category,
            signal.hierarchyPath,
            signal.role
          ].filter(Boolean).join(' '))
          if (targetCategory === 'lighting') return /\b(light|lights|lighting|luce|luci)\b/.test(areaText) ? /\b(light|lights|lighting|luce|luci)\b/.test(haystack) || /^1\./.test(String(signal.dpt || '').trim()) : true
          if (targetCategory === 'shading') return /\b(shading|shade|shades|blind|blinds|cover|covers|tapparella|tapparelle|veneziana|veneziane)\b/.test(haystack)
          if (targetCategory === 'hvac') return /\b(hvac|heating|cooling|climate|thermostat|fan|clima|climate|temperatura)\b/.test(haystack)
          return true
        })
        .filter((signal) => actionSequence.every(action => supportsPresetActionForSignal({ signal, action, prompt })))
        .sort((a, b) => String(a.label || a.ga || '').localeCompare(String(b.label || b.ga || '')))

      const steps = []
      let stepIndex = 1
      actionSequence.forEach((action, actionIndex) => {
        commandSignals.forEach((command) => {
          const pair = pairByCommandGA.get(command.ga) || null
          const status = pair && pair.status ? pair.status : null
          const commandPayload = payloadFromPromptAction({ signal: command, action, fallbackPrompt: prompt })
          if (String(commandPayload || '').trim() === '') return
          const actionLabel = action === 'on'
            ? 'Turn on'
            : action === 'off'
              ? 'Turn off'
              : action === 'open'
                ? 'Open'
                : action === 'close'
                  ? 'Close'
                  : action === 'stop'
                    ? 'Stop'
                    : 'Set'
          steps.push({
            id: `step-${stepIndex++}`,
            kind: status ? 'write_and_verify' : 'write_only',
            action,
            title: status ? `${actionLabel} ${command.label} and verify feedback` : `${actionLabel} ${command.label}`,
            description: status
              ? `Send ${commandPayload} to ${command.ga} and verify ${status.ga}.`
              : `Send ${commandPayload} to ${command.ga}.`,
            reason: 'Generated from the selected test template and ETS area catalog.',
            commandGA: command.ga,
            commandDPT: command.dpt,
            commandPayload,
            statusGA: status ? status.ga : '',
            statusDPT: status ? status.dpt : '',
            expectedPayload: commandPayload,
            statusWriteTimeoutMs: 5000,
            statusResponseTimeoutMs: 5000
          })
        })
        if (actionIndex < actionSequence.length - 1 && commandSignals.length) {
          steps.push({
            id: `step-${stepIndex++}`,
            kind: 'wait',
            title: 'Wait for state propagation',
            description: 'Pause before the next command phase.',
            reason: 'Inserted automatically between command phases.',
            delayMs: 1200
          })
        }
      })

      return normalizeAiTestPlanPayload({
        id: `plan-${areaId}-${Date.now()}`,
        name: `Template Test ${catalog && catalog.area ? (catalog.area.name || 'Area') : 'Area'}`,
        description: 'Deterministic active test plan generated from the selected test template.',
        areaId,
        areaName: catalog && catalog.area ? (catalog.area.path || catalog.area.name || '') : '',
        prompt,
        source: 'template',
        generatedAt: new Date().toISOString(),
        steps
      }, `plan-${areaId}-${Date.now()}`)
    }

    const inferPromptScopeCategory = (prompt) => {
      const text = normalizeSignalText(prompt)
      if (/\b(light|lights|lighting)\b/.test(text)) return 'lighting'
      if (/\b(hvac|heating|cooling|climate|thermostat)\b/.test(text)) return 'hvac'
      if (/\b(shading|shade|shades|blind|blinds|cover|covers)\b/.test(text)) return 'shading'
      return ''
    }

    const finalizeAiTestPlanFromCatalog = ({ rawPlan, areaId, prompt, catalog }) => {
      const commandsByGa = new Map((Array.isArray(catalog && catalog.commandSignals) ? catalog.commandSignals : []).map(signal => [signal.ga, signal]))
      const statusByGa = new Map((Array.isArray(catalog && catalog.statusSignals) ? catalog.statusSignals : []).map(signal => [signal.ga, signal]))
      const pairByCommandGA = new Map((Array.isArray(catalog && catalog.pairs) ? catalog.pairs : []).map(pair => [pair.command && pair.command.ga ? pair.command.ga : '', pair]))
      const promptActions = extractPromptActionSequence(prompt)
      let activeStepCursor = 0
      const normalized = normalizeAiTestPlanPayload(Object.assign({}, rawPlan || {}, {
        areaId,
        areaName: catalog && catalog.area ? (catalog.area.path || catalog.area.name || '') : '',
        prompt,
        source: (rawPlan && rawPlan.source) ? rawPlan.source : 'ai',
        generatedAt: (rawPlan && rawPlan.generatedAt) ? rawPlan.generatedAt : new Date().toISOString()
      }), `plan-${areaId}-${Date.now()}`)
      const sourceSteps = Array.isArray(rawPlan && rawPlan.steps) && rawPlan.steps.length
        ? rawPlan.steps
        : normalized.steps

      const steps = sourceSteps.map((rawStep, index) => {
        const step = normalizeTestPlanStepPayload(rawStep, `step-${index + 1}`)
        if (step.kind === 'wait') {
          return normalizeTestPlanStepPayload({
            id: step.id || `step-${index + 1}`,
            kind: 'wait',
            title: step.title || 'Wait',
            description: step.description || '',
            reason: step.reason || '',
            delayMs: step.delayMs
          }, `step-${index + 1}`)
        }
        const command = commandsByGa.get(step.commandGA) || resolveCommandSignalForStep({ step, catalog, prompt })
        if (!command) return null
        const suggestedPair = pairByCommandGA.get(step.commandGA)
        const status = step.statusGA
          ? statusByGa.get(step.statusGA) || null
          : ((pairByCommandGA.get(command.ga) && pairByCommandGA.get(command.ga).status) ? pairByCommandGA.get(command.ga).status : (suggestedPair && suggestedPair.status ? suggestedPair.status : null))
        const action = normalizeAreaText(step.action).toLowerCase() || String(promptActions[activeStepCursor] || '').trim().toLowerCase()
        activeStepCursor += 1
        return normalizeTestPlanStepPayload({
          id: step.id || `step-${index + 1}`,
          kind: status ? (step.kind || 'write_and_verify') : 'write_only',
          action,
          title: step.title || (status ? `Write ${command.label} and verify` : `Write ${command.label}`),
          description: step.description || '',
          reason: step.reason || '',
          commandGA: command.ga,
          commandDPT: step.commandDPT || command.dpt,
          commandPayload: step.commandPayload || inferDefaultPayloadForSignal({ signal: command, prompt }),
          statusGA: status ? status.ga : '',
          statusDPT: status ? (step.statusDPT || status.dpt) : '',
          expectedPayload: step.expectedPayload || step.commandPayload || inferDefaultPayloadForSignal({ signal: command, prompt }),
          statusWriteTimeoutMs: status ? step.statusWriteTimeoutMs : 0,
          statusResponseTimeoutMs: status ? step.statusResponseTimeoutMs : 0
        }, `step-${index + 1}`)
      }).filter(Boolean)

      return Object.assign({}, normalized, {
        areaId,
        areaName: catalog && catalog.area ? (catalog.area.path || catalog.area.name || '') : '',
        prompt,
        steps
      })
    }

    const executeWaitStep = async (stepPayload = {}) => {
      const step = normalizeTestPlanStepPayload(stepPayload, stepPayload && stepPayload.id ? String(stepPayload.id) : 'wait-step')
      const delayMs = Math.max(0, Number(step.delayMs || 0))
      if (delayMs > 0) await new Promise(resolve => setTimeout(resolve, delayMs))
      return {
        id: step.id,
        title: step.title,
        description: step.description,
        reason: step.reason,
        kind: 'wait',
        status: 'pass',
        delayMs,
        message: delayMs > 0 ? `Waited ${delayMs} ms.` : 'No wait applied.'
      }
    }

    const executeActiveCommandStep = async (stepPayload = {}) => {
      const step = normalizeTestPlanStepPayload(stepPayload, stepPayload && stepPayload.id ? String(stepPayload.id) : 'active-step')
      if (!step.commandGA || !step.commandDPT) throw new Error('Command GA and DPT are required')
      if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') throw new Error('KNX gateway not available')
      if (node.serverKNX.linkStatus !== 'connected') throw new Error('KNX gateway is not connected')

      const commandPayload = parseActuatorPayloadInput(step.commandPayload)
      const commandPayloadLabel = formatPayloadForDptDisplay({
        value: step.commandPayload,
        dptId: step.commandDPT,
        contextText: `${step.title || ''} ${step.description || ''} ${step.reason || ''}`
      })
      const commandSentAt = nowMs()
      node.serverKNX.sendKNXTelegramToKNXEngine({
        grpaddr: step.commandGA,
        payload: commandPayload,
        dpt: step.commandDPT,
        outputtype: 'write',
        nodecallerid: node.id
      })

      const expectedPayload = parseActuatorPayloadInput(step.expectedPayload)
      const expectedPayloadLabel = formatPayloadForDptDisplay({
        value: expectedPayload,
        dptId: step.statusDPT || step.commandDPT || '',
        contextText: `${step.title || ''} ${step.description || ''} ${step.reason || ''}`
      })

      const runFeedbackCheck = async ({ name, events, timeoutMs, issueRead = false, minTs }) => {
        const checkTimeoutMs = Math.max(500, Number(timeoutMs || 6000))
        const checkStartedAt = Number(minTs || nowMs())
        if (issueRead) {
          node.serverKNX.sendKNXTelegramToKNXEngine({
            grpaddr: step.statusGA,
            payload: '',
            dpt: step.statusDPT || '',
            outputtype: 'read',
            nodecallerid: node.id
          })
        }
        try {
          const telegram = await waitForTelegram({
            destination: step.statusGA,
            events,
            minTs: checkStartedAt,
            timeoutMs: checkTimeoutMs
          })
          const compareDpt = step.statusDPT || telegram.dpt || step.commandDPT || ''
          const normalizedFeedback = normalizePayloadForDptCompare({
            value: telegram.payload,
            dptId: compareDpt,
            contextText: `${step.title || ''} ${step.description || ''} ${step.reason || ''}`
          })
          const feedbackPayloadLabel = formatPayloadForDptDisplay({
            value: telegram.payload,
            dptId: compareDpt,
            contextText: `${step.title || ''} ${step.description || ''} ${step.reason || ''}`
          })
          const normalizedExpected = normalizePayloadForDptCompare({
            value: expectedPayload,
            dptId: compareDpt,
            contextText: `${step.title || ''} ${step.description || ''} ${step.reason || ''}`
          })
          const coherent = normalizedFeedback === normalizedExpected
          return {
            name,
            ok: true,
            status: coherent ? 'pass' : 'fail',
            ga: step.statusGA,
            dpt: telegram.dpt || step.statusDPT || '',
            event: telegram.event || '',
            payload: telegram.payload,
            payloadLabel: feedbackPayloadLabel,
            expectedPayload,
            expectedPayloadLabel,
            normalizedPayload: normalizedFeedback,
            normalizedExpectedPayload: normalizedExpected,
            coherent,
            timeoutMs: checkTimeoutMs,
            at: new Date(telegram.ts || Date.now()).toISOString(),
            message: coherent
              ? `${name} coherent on ${step.statusGA}.`
              : `${name} returned ${feedbackPayloadLabel || normalizedFeedback || normalizeValueForCompare(telegram.payload)} instead of ${expectedPayloadLabel || normalizedExpected || normalizeValueForCompare(expectedPayload)}.`
          }
        } catch (error) {
          const diagnostic = describeRecentTelegramForGA({
            destination: step.statusGA,
            minTs: checkStartedAt
          })
          return {
            name,
            ok: false,
            status: 'fail',
            ga: step.statusGA,
            expectedPayload,
            expectedPayloadLabel,
            timeoutMs: checkTimeoutMs,
            error: `${error.message || String(error)}${diagnostic}`,
            message: `${name} not received on ${step.statusGA} within ${checkTimeoutMs} ms.${diagnostic}`.trim()
          }
        }
      }

      let statusWrite = null
      let statusResponse = null
      if (step.statusGA) {
        statusWrite = await runFeedbackCheck({
          name: 'Status write',
          events: ['GroupValue_Write'],
          timeoutMs: step.statusWriteTimeoutMs,
          issueRead: false,
          minTs: commandSentAt
        })
        const responseStartedAt = nowMs()
        statusResponse = await runFeedbackCheck({
          name: 'Read response',
          events: ['GroupValue_Response'],
          timeoutMs: step.statusResponseTimeoutMs,
          issueRead: true,
          minTs: responseStartedAt
        })
      }

      const feedbackChecks = [statusWrite, statusResponse].filter(Boolean)
      const passedChecks = feedbackChecks.filter(check => check.ok === true && check.coherent !== false).length
      const stepStatus = !feedbackChecks.length
        ? 'pass'
        : passedChecks === feedbackChecks.length
          ? 'pass'
          : passedChecks > 0
            ? 'warn'
            : 'fail'

      const message = !feedbackChecks.length
        ? 'Command telegram sent without status validation.'
        : passedChecks === feedbackChecks.length
          ? `Both status checks passed on ${step.statusGA}.`
          : passedChecks > 0
            ? `One status check passed and one failed on ${step.statusGA}.`
            : `Both status checks failed on ${step.statusGA}.`

      return {
        id: step.id,
        title: step.title,
        description: step.description,
        reason: step.reason,
        kind: step.kind,
        status: stepStatus,
        command: {
          ga: step.commandGA,
          dpt: step.commandDPT,
          payload: commandPayload,
          payloadLabel: commandPayloadLabel,
          sentAt: new Date(commandSentAt).toISOString()
        },
        statusWrite,
        statusResponse,
        statusRead: statusResponse,
        expectedPayload,
        expectedPayloadLabel,
        statusWriteTimeoutMs: Number(step.statusWriteTimeoutMs || 0),
        statusResponseTimeoutMs: Number(step.statusResponseTimeoutMs || 0),
        message
      }
    }

    node.getAreaSignalCatalog = async ({ areaId } = {}) => {
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        catalog: buildAreaSignalCatalog({ areaId, summary }),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.getGaCatalog = async () => {
      return {
        ok: true,
        gaCatalog: getGaCatalogSnapshot()
      }
    }

    node.saveGaRoleOverride = async ({ ga, role } = {}) => {
      const targetGa = normalizeAreaText(ga)
      if (!targetGa) throw new Error('Missing ga')
      const catalogMap = new Map(getGaCatalogSnapshot().map(item => [String(item && item.ga ? item.ga : '').trim(), item]))
      if (!catalogMap.has(targetGa)) throw new Error(`GA '${targetGa}' not found`)
      const normalizedRole = normalizeGaRoleValue(role, 'auto')
      const currentOverrides = Object.assign({}, loadGaRoleOverrides())
      if (normalizedRole === 'auto') delete currentOverrides[targetGa]
      else currentOverrides[targetGa] = normalizedRole
      writeGaRoleOverrides(currentOverrides)
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        ga: targetGa,
        role: normalizedRole,
        gaCatalog: getGaCatalogSnapshot(),
        areas: buildAreasSnapshot({ summary }),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.createAreaDefinition = async ({ id, name, description, tags, gaList } = {}) => {
      const currentOverrides = Object.assign({}, loadAreaOverrides())
      const normalizedId = normalizeCustomAreaId(id, name)
      if (!normalizedId) throw new Error('Missing custom area id or name')
      const nextOverride = normalizeAreaOverridePayload({
        name: normalizeAreaText(name || normalizedId.replace(/^custom:/, '')),
        description,
        tags,
        gaList
      })
      if (!nextOverride.name) throw new Error('Missing custom area name')
      currentOverrides[normalizedId] = nextOverride
      writeAreaOverrides(currentOverrides)
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        areaId: normalizedId,
        areas: buildAreasSnapshot({ summary }),
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.saveAreaDefinition = async ({ areaId, name, description, tags, gaList } = {}) => {
      const targetAreaId = String(areaId || '').trim()
      if (!targetAreaId) throw new Error('Missing areaId')
      const mergedSnapshot = applyAreaOverridesToSnapshot({
        snapshot: getAreasBaseSnapshot(),
        overrides: loadAreaOverrides(),
        gaCatalog: getGaCatalogSnapshot()
      })
      const exists = Array.isArray(mergedSnapshot.suggested) && mergedSnapshot.suggested.some(area => area.id === targetAreaId)
      const isCustom = targetAreaId.startsWith('custom:') || targetAreaId.startsWith('llm:')
      if (!exists && !isCustom) throw new Error(`Area '${targetAreaId}' not found`)
      const currentOverrides = Object.assign({}, loadAreaOverrides())
      const nextOverride = normalizeAreaOverridePayload({ name, description, tags, gaList })
      const shouldPersist = Object.keys(nextOverride).length > 0
      if (shouldPersist) currentOverrides[targetAreaId] = nextOverride
      else delete currentOverrides[targetAreaId]
      writeAreaOverrides(currentOverrides)
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        areaId: targetAreaId,
        areas: buildAreasSnapshot({ summary }),
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.resetAreaDefinition = async ({ areaId } = {}) => {
      const targetAreaId = String(areaId || '').trim()
      if (!targetAreaId) throw new Error('Missing areaId')
      const currentOverrides = Object.assign({}, loadAreaOverrides())
      delete currentOverrides[targetAreaId]
      writeAreaOverrides(currentOverrides)
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        areaId: targetAreaId,
        areas: buildAreasSnapshot({ summary }),
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.deleteAreaDefinition = async ({ areaId } = {}) => {
      const targetAreaId = String(areaId || '').trim()
      if (!targetAreaId) throw new Error('Missing areaId')
      const baseSnapshot = getAreasBaseSnapshot()
      const existsInBase = Array.isArray(baseSnapshot.suggested) && baseSnapshot.suggested.some(area => area.id === targetAreaId)
      const currentOverrides = Object.assign({}, loadAreaOverrides())
      if (existsInBase) {
        currentOverrides[targetAreaId] = normalizeAreaOverridePayload({ deleted: true })
      } else {
        delete currentOverrides[targetAreaId]
      }
      writeAreaOverrides(currentOverrides)
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        areaId: targetAreaId,
        areas: buildAreasSnapshot({ summary }),
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.deleteAllLlmAreas = async () => {
      const currentOverrides = Object.assign({}, loadAreaOverrides())
      const llmAreaIds = Object.keys(currentOverrides).filter(key => String(key || '').startsWith('llm:'))
      llmAreaIds.forEach((areaId) => {
        delete currentOverrides[areaId]
      })
      writeAreaOverrides(currentOverrides)
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        deletedCount: llmAreaIds.length,
        areas: buildAreasSnapshot({ summary }),
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot(),
        gaCatalog: getGaCatalogSnapshot()
      }
    }

    node.regenerateLlmAreas = async () => {
      if (!node.llmEnabled) throw new Error('LLM is disabled in the KNX AI node config')
      const gaCatalog = getGaCatalogSnapshot()
      if (!Array.isArray(gaCatalog) || !gaCatalog.length) throw new Error('No ETS group addresses available')
      const jsonMaxTokens = Math.max(50000, Number(node.llmMaxTokens) || 0)
      const llmResponse = await callLLMChat({
        systemPrompt: [
          'You are a KNX installation modeling assistant.',
          'Group KNX group addresses into practical installer-friendly operational areas.',
          'Return JSON only.'
        ].join(' '),
        userContent: buildAreaRegenerationPrompt({ gaCatalog }),
        maxTokensOverride: jsonMaxTokens
      })
      const parsed = extractJsonFragmentFromText(llmResponse.content)
      const rawAreas = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed && parsed.areas)
          ? parsed.areas
          : []
      if (!rawAreas.length) throw new Error('The LLM did not return any areas')
      const gaCatalogMap = new Map(gaCatalog.map(item => [String(item && item.ga ? item.ga : '').trim(), item]))
      const normalizedAreas = rawAreas
        .map((candidate, index) => normalizeAreaSuggestionPayload({
          candidate,
          gaCatalogMap,
          fallbackIndex: index,
          idPrefix: 'llm'
        }))
        .filter(Boolean)
      if (!normalizedAreas.length) throw new Error('The LLM areas did not contain valid group addresses')

      let nextGaRoles = Object.assign({}, loadGaRoleOverrides())
      try {
        const selectedGaSet = new Set(normalizedAreas.flatMap(area => Array.isArray(area.gaList) ? area.gaList : []).map(ga => String(ga || '').trim()).filter(Boolean))
        const llmRoleOverrides = await suggestGaRoleOverridesWithLlm({
          gaCatalog: gaCatalog.filter(item => selectedGaSet.has(String(item && item.ga ? item.ga : '').trim()))
        })
        if (llmRoleOverrides && typeof llmRoleOverrides === 'object' && Object.keys(llmRoleOverrides).length) {
          nextGaRoles = Object.assign({}, nextGaRoles, llmRoleOverrides)
          writeGaRoleOverrides(nextGaRoles)
        }
      } catch (error) {
        node.warn(`KNX AI role classification skipped: ${error.message || String(error)}`)
      }

      const nextOverrides = Object.assign({}, loadAreaOverrides())
      Object.keys(nextOverrides).forEach((key) => {
        if (String(key || '').startsWith('llm:')) delete nextOverrides[key]
      })
      normalizedAreas.forEach((area, index) => {
        const baseId = String(area.id || `llm:area-${index + 1}`)
        let finalId = baseId
        let suffix = 2
        while (Object.prototype.hasOwnProperty.call(nextOverrides, finalId)) {
          finalId = `${baseId}-${suffix++}`
        }
        nextOverrides[finalId] = normalizeAreaOverridePayload({
          name: area.name,
          description: area.description,
          tags: area.tags,
          gaList: area.gaList
        })
      })
      writeAreaOverrides(nextOverrides)
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        generatedCount: normalizedAreas.length,
        provider: llmResponse && llmResponse.provider ? llmResponse.provider : '',
        model: llmResponse && llmResponse.model ? llmResponse.model : '',
        gaCatalog: getGaCatalogSnapshot(),
        areas: buildAreasSnapshot({ summary }),
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.suggestAreaDraftWithLlm = async ({ prompt, name, description, gaList } = {}) => {
      if (!node.llmEnabled) throw new Error('LLM is disabled in the KNX AI node config')
      const installerPrompt = String(prompt || '').trim()
      if (!installerPrompt) throw new Error('Missing prompt')
      const gaCatalog = getGaCatalogSnapshot()
      if (!Array.isArray(gaCatalog) || !gaCatalog.length) throw new Error('No ETS group addresses available')
      const jsonMaxTokens = Math.max(50000, Number(node.llmMaxTokens) || 0)
      const llmResponse = await callLLMChat({
        systemPrompt: [
          'You are a KNX installation modeling assistant.',
          'Choose the best group addresses for a custom installer-defined area.',
          'Return JSON only.'
        ].join(' '),
        userContent: buildAreaDraftSuggestionPrompt({
          prompt: installerPrompt,
          draftName: name,
          draftDescription: description,
          currentGaList: Array.isArray(gaList) ? gaList : [],
          gaCatalog
        }),
        maxTokensOverride: jsonMaxTokens
      })
      const parsed = extractJsonFragmentFromText(llmResponse.content)
      const gaCatalogMap = new Map(gaCatalog.map(item => [String(item && item.ga ? item.ga : '').trim(), item]))
      const suggestion = normalizeAreaSuggestionPayload({
        candidate: parsed,
        gaCatalogMap,
        fallbackIndex: 0,
        idPrefix: 'draft'
      })
      if (!suggestion || !Array.isArray(suggestion.gaList) || !suggestion.gaList.length) {
        throw new Error('The LLM did not return valid group addresses for this area')
      }
      try {
        const llmRoleOverrides = await suggestGaRoleOverridesWithLlm({
          gaCatalog: gaCatalog.filter(item => suggestion.gaList.includes(String(item && item.ga ? item.ga : '').trim()))
        })
        if (llmRoleOverrides && typeof llmRoleOverrides === 'object' && Object.keys(llmRoleOverrides).length) {
          const nextGaRoles = Object.assign({}, loadGaRoleOverrides(), llmRoleOverrides)
          writeGaRoleOverrides(nextGaRoles)
        }
      } catch (error) {
        node.warn(`KNX AI draft GA role classification skipped: ${error.message || String(error)}`)
      }
      return {
        ok: true,
        suggestion: {
          name: suggestion.name,
          description: suggestion.description,
          tags: suggestion.tags,
          gaList: suggestion.gaList
        },
        provider: llmResponse && llmResponse.provider ? llmResponse.provider : '',
        model: llmResponse && llmResponse.model ? llmResponse.model : '',
        gaCatalog: getGaCatalogSnapshot()
      }
    }

    node.saveAreaProfile = async (profilePayload = {}) => {
      const normalized = normalizeAreaProfilePayload(profilePayload, profilePayload && profilePayload.id ? String(profilePayload.id) : '')
      if (!normalized.id) throw new Error('Missing profile id')
      if (DEFAULT_AREA_PROFILES.some(profile => profile.id === normalized.id)) {
        throw new Error(`Profile id '${normalized.id}' is reserved by a built-in profile`)
      }
      const customProfiles = loadCustomAreaProfiles()
      const nextProfiles = customProfiles.filter(profile => String(profile && profile.id ? profile.id : '') !== normalized.id)
      nextProfiles.push(normalized)
      writeCustomAreaProfiles(nextProfiles)
      return {
        ok: true,
        profileId: normalized.id,
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.deleteAreaProfile = async ({ profileId } = {}) => {
      const targetId = String(profileId || '').trim()
      if (!targetId) throw new Error('Missing profileId')
      if (DEFAULT_AREA_PROFILES.some(profile => profile.id === targetId)) {
        throw new Error('Built-in profiles cannot be deleted')
      }
      const nextProfiles = loadCustomAreaProfiles().filter(profile => String(profile && profile.id ? profile.id : '') !== targetId)
      writeCustomAreaProfiles(nextProfiles)
      return {
        ok: true,
        profileId: targetId,
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.runAreaProfile = async ({ areaId, profileId } = {}) => {
      const targetAreaId = String(areaId || '').trim()
      const targetProfileId = String(profileId || '').trim()
      if (!targetAreaId) throw new Error('Missing areaId')
      if (!targetProfileId) throw new Error('Missing profileId')
      const summary = rebuildCachedSummaryNow()
      const areas = buildAreasSnapshot({ summary })
      const profiles = buildProfilesSnapshot()
      const area = Array.isArray(areas.suggested) ? areas.suggested.find(item => item.id === targetAreaId) : null
      const profile = Array.isArray(profiles) ? profiles.find(item => item.id === targetProfileId) : null
      if (!area) throw new Error(`Area '${targetAreaId}' not found`)
      if (!profile) throw new Error(`Profile '${targetProfileId}' not found`)
      const report = buildAreaProfileReport({
        area,
        profile,
        summary,
        anomalies: node._anomalies.slice(-100),
        generatedAt: new Date().toISOString()
      })
      node._lastAreaProfileReport = report
      const testResults = appendAiTestResult(report)
      return {
        ok: true,
        report,
        areas,
        profiles,
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot(),
        testResults
      }
    }

    node.saveActuatorTestPreset = async (presetPayload = {}) => {
      const normalized = normalizeActuatorTestPresetPayload(presetPayload, presetPayload && presetPayload.id ? String(presetPayload.id) : '')
      if (!normalized.id) throw new Error('Missing preset id')
      if (!normalized.commandGA || !normalized.commandDPT) throw new Error('Command GA and DPT are required')
      const customPresets = loadActuatorTestPresets()
      const nextPresets = customPresets.filter(preset => String(preset && preset.id ? preset.id : '') !== normalized.id)
      nextPresets.push(normalized)
      writeActuatorTestPresets(nextPresets)
      return {
        ok: true,
        presetId: normalized.id,
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.deleteActuatorTestPreset = async ({ presetId } = {}) => {
      const targetId = String(presetId || '').trim()
      if (!targetId) throw new Error('Missing presetId')
      const nextPresets = loadActuatorTestPresets().filter(preset => String(preset && preset.id ? preset.id : '') !== targetId)
      writeActuatorTestPresets(nextPresets)
      return {
        ok: true,
        presetId: targetId,
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.runActuatorTest = async (testPayload = {}) => {
      const test = normalizeActuatorTestPresetPayload(testPayload, testPayload && testPayload.id ? String(testPayload.id) : 'manual-actuator-test')
      const generatedAt = new Date().toISOString()
      const executed = await executeActiveCommandStep({
        id: test.id,
        title: test.name || 'Actuator Test',
        description: test.description || '',
        kind: test.statusGA ? 'write_and_verify' : 'write_only',
        commandGA: test.commandGA,
        commandDPT: test.commandDPT,
        commandPayload: test.commandPayload,
        statusGA: test.statusGA,
        statusDPT: test.statusDPT,
        expectedPayload: test.commandPayload,
        statusWriteTimeoutMs: test.statusWriteTimeoutMs,
        statusResponseTimeoutMs: test.statusResponseTimeoutMs
      })

      const report = {
        id: `${test.id || 'actuator'}:${Date.now()}`,
        generatedAt,
        mode: 'active_test',
        name: test.name || 'Actuator Test',
        description: test.description || '',
        source: {
          type: 'actuator_test',
          presetId: test.id || '',
          areaId: normalizeAreaText(test.areaId),
          commandGA: test.commandGA || ''
        },
        command: executed.command,
        statusWrite: executed.statusWrite,
        statusResponse: executed.statusResponse,
        statusRead: executed.statusRead,
        overallStatus: executed.status
      }
      node._lastActuatorTestReport = report
      const testResults = appendAiTestResult(report)
      return {
        ok: true,
        report,
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot(),
        testResults
      }
    }

    node.saveAiTestPlan = async (planPayload = {}) => {
      const normalized = normalizeAiTestPlanPayload(planPayload, planPayload && planPayload.id ? String(planPayload.id) : `plan-${Date.now()}`)
      if (!normalized.id) throw new Error('Missing plan id')
      if (!normalized.areaId) throw new Error('Missing areaId')
      if (!Array.isArray(normalized.steps) || normalized.steps.length === 0) throw new Error('The test plan has no executable steps')
      const nextPlans = loadAiTestPlans().filter(plan => String(plan && plan.id ? plan.id : '') !== normalized.id)
      nextPlans.push(normalized)
      writeAiTestPlans(nextPlans)
      return {
        ok: true,
        planId: normalized.id,
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.deleteAiTestPlan = async ({ planId } = {}) => {
      const targetId = String(planId || '').trim()
      if (!targetId) throw new Error('Missing planId')
      const nextPlans = loadAiTestPlans().filter(plan => String(plan && plan.id ? plan.id : '') !== targetId)
      writeAiTestPlans(nextPlans)
      return {
        ok: true,
        planId: targetId,
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    node.runAiTestPlan = async ({ planId, plan } = {}) => {
      const normalizedInput = plan && typeof plan === 'object' ? normalizeAiTestPlanPayload(plan, plan.id || `plan-${Date.now()}`) : null
      const resolvedPlan = normalizedInput && normalizedInput.steps.length
        ? normalizedInput
        : buildAiTestPlansSnapshot().find(item => item.id === String(planId || '').trim())
      if (!resolvedPlan) throw new Error('Test plan not found')
      if (!resolvedPlan.areaId) throw new Error('Missing areaId in test plan')

      const summary = rebuildCachedSummaryNow()
      const catalog = buildAreaSignalCatalog({ areaId: resolvedPlan.areaId, summary })
      const finalPlan = finalizeAiTestPlanFromCatalog({
        rawPlan: resolvedPlan,
        areaId: resolvedPlan.areaId,
        prompt: resolvedPlan.prompt || '',
        catalog
      })
      if (!finalPlan.steps.length) throw new Error('The test plan has no valid steps for the selected area')

      const generatedAt = new Date().toISOString()
      const stepResults = []
      for (const step of finalPlan.steps) {
        // Sequential execution avoids overlapping writes on the KNX bus.
        // Each step can optionally wait for its feedback telegram before continuing.
        // This keeps the report deterministic and easier to audit.
        // eslint-disable-next-line no-await-in-loop
        const result = step.kind === 'wait'
          ? await executeWaitStep(step)
          : await executeActiveCommandStep(step)
        stepResults.push(result)
      }

      const metrics = {
        totalSteps: stepResults.length,
        pass: stepResults.filter(item => item.status === 'pass').length,
        warn: stepResults.filter(item => item.status === 'warn').length,
        fail: stepResults.filter(item => item.status === 'fail').length
      }
      const overallStatus = metrics.fail > 0 ? 'fail' : (metrics.warn > 0 ? 'warn' : 'pass')
      const suggestions = []
      if (metrics.fail > 0) suggestions.push('At least one feedback object returned an incoherent value. Check the actuator/status pairing in ETS first.')
      if (metrics.warn > 0) suggestions.push('Some steps did not receive feedback in time. Verify the status group address and the actuator programming.')
      if (overallStatus === 'pass') suggestions.push('The selected active test completed with coherent feedback on all verified steps.')

      const report = {
        id: `${finalPlan.id}:${Date.now()}`,
        generatedAt,
        mode: 'ai_test_plan',
        overallStatus,
        name: finalPlan.name,
        description: finalPlan.description,
        prompt: finalPlan.prompt,
        source: {
          type: 'ai_test_plan',
          planId: finalPlan.id,
          areaId: finalPlan.areaId || ''
        },
        area: catalog.area,
        metrics,
        steps: stepResults,
        suggestions
      }
      node._lastAiTestPlanReport = report
      const testResults = appendAiTestResult(report)
      return {
        ok: true,
        report,
        testPlans: buildAiTestPlansSnapshot(),
        testResults
      }
    }

    node.runAiTestPlanStep = async ({ areaId, step } = {}) => {
      const targetAreaId = String(areaId || '').trim()
      if (!targetAreaId) throw new Error('Missing areaId')
      const summary = rebuildCachedSummaryNow()
      const catalog = buildAreaSignalCatalog({ areaId: targetAreaId, summary })
      if (!catalog || !catalog.area) throw new Error(`Area '${targetAreaId}' not found`)
      const finalPlan = finalizeAiTestPlanFromCatalog({
        rawPlan: {
          id: `step-${Date.now()}`,
          name: 'Ad-hoc Step',
          description: '',
          areaId: targetAreaId,
          prompt: '',
          steps: [step || {}]
        },
        areaId: targetAreaId,
        prompt: '',
        catalog
      })
      if (!Array.isArray(finalPlan.steps) || !finalPlan.steps.length) {
        throw new Error('The step is not valid for the selected area')
      }
      const stepResult = finalPlan.steps[0].kind === 'wait'
        ? await executeWaitStep(finalPlan.steps[0])
        : await executeActiveCommandStep(finalPlan.steps[0])
      return {
        ok: true,
        area: catalog.area,
        stepResult
      }
    }

    node.exportAiConfig = async () => {
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return buildAiConfigExport({ summary })
    }

    node.saveAiTestResult = async (reportPayload = {}) => {
      const report = normalizeAiTestResultPayload(reportPayload, `result-${Date.now()}`)
      if (!report) throw new Error('Invalid report payload')
      if (report.mode === 'ai_test_plan') node._lastAiTestPlanReport = report
      if (report.mode === 'active_test') node._lastActuatorTestReport = report
      if (report.mode === 'read_only') node._lastAreaProfileReport = report
      const testResults = appendAiTestResult(report)
      return {
        ok: true,
        report,
        testResults
      }
    }

    node.deleteAiTestResult = async ({ reportId } = {}) => {
      const targetId = String(reportId || '').trim()
      if (!targetId) throw new Error('Missing reportId')
      const testResults = deleteAiTestResultById(targetId)
      return {
        ok: true,
        reportId: targetId,
        testResults
      }
    }

    node.importAiConfig = async (payload) => {
      const p = payload && typeof payload === 'object' ? payload : {}
      const nextAreas = p.areas && typeof p.areas === 'object' ? p.areas : {}
      const nextGaRoles = p.gaRoles && typeof p.gaRoles === 'object'
        ? Object.fromEntries(Object.entries(p.gaRoles)
          .map(([ga, role]) => [normalizeAreaText(ga), normalizeGaRoleValue(role, 'auto')])
          .filter(([ga, role]) => ga && role !== 'auto'))
        : {}
      const nextProfiles = Array.isArray(p.profiles) ? p.profiles.map((profile, index) => normalizeAreaProfilePayload(profile, `import-${index + 1}`)) : []
      const nextActuatorTests = Array.isArray(p.actuatorTests) ? p.actuatorTests.map((preset, index) => normalizeActuatorTestPresetPayload(preset, `import-actuator-${index + 1}`)) : []
      const nextTestPlans = Array.isArray(p.testPlans) ? p.testPlans.map((plan, index) => normalizeAiTestPlanPayload(plan, `import-plan-${index + 1}`)) : []
      const nextTestResults = Array.isArray(p.testResults) ? p.testResults.map((report, index) => normalizeAiTestResultPayload(report, `import-result-${index + 1}`)).filter(Boolean) : []
      writePersistedAiConfig({
        areas: nextAreas,
        gaRoles: nextGaRoles,
        profiles: nextProfiles,
        actuatorTests: nextActuatorTests,
        testPlans: nextTestPlans,
        testResults: nextTestResults
      })
      const summary = node._lastSummary || rebuildCachedSummaryNow()
      return {
        ok: true,
        areas: buildAreasSnapshot({ summary }),
        profiles: buildProfilesSnapshot(),
        actuatorTests: buildActuatorTestsSnapshot(),
        testPlans: buildAiTestPlansSnapshot(),
        testResults: buildAiTestResultsSnapshot()
      }
    }

    const callLLMChat = async ({ systemPrompt, userContent, jsonSchema = null, maxTokensOverride = null }) => {
      if (!node.llmEnabled) throw new Error('LLM is disabled in node config')
      if (!node.llmApiKey && node.llmProvider !== 'ollama') {
        throw new Error('Missing API key: paste only the OpenAI key (starts with sk-), without "Bearer"')
      }
      const maxTokensRaw = (maxTokensOverride !== null && maxTokensOverride !== undefined && maxTokensOverride !== '')
        ? Number(maxTokensOverride)
        : Number(node.llmMaxTokens)
      const resolvedMaxTokens = Number.isFinite(maxTokensRaw) && maxTokensRaw > 0 ? Math.round(maxTokensRaw) : 10000
      const configuredTimeoutMs = Number(node.llmTimeoutMs)
      const resolvedTimeoutMs = Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0 ? Math.round(configuredTimeoutMs) : 30000
      const effectiveTimeoutMs = Math.max(120000, resolvedTimeoutMs)

      if (node.llmProvider === 'ollama') {
        const url = resolveOllamaChatUrl(node.llmBaseUrl)
        const body = {
          model: node.llmModel || 'llama3.1',
          stream: false,
          messages: [
            { role: 'system', content: systemPrompt || node.llmSystemPrompt || '' },
            { role: 'user', content: userContent }
          ],
          options: {
            temperature: node.llmTemperature
          }
        }
        let json
        try {
          json = await postJson({ url, body, timeoutMs: effectiveTimeoutMs })
        } catch (error) {
          if (isLikelyConnectionFailure(error)) {
            await ensureOllamaServerRunning({ baseUrl: url, autoStart: true, timeoutMs: 22000 })
            json = await postJson({ url, body, timeoutMs: effectiveTimeoutMs })
          } else {
            throw decorateOllamaConnectionError({ error, url, action: 'chat with the model' })
          }
        }
        const content = json && json.message && typeof json.message.content === 'string' ? json.message.content : safeStringify(json)
        return { provider: 'ollama', model: body.model, content, finishReason: String(json && json.done_reason ? json.done_reason : '') }
      }

      // Default: OpenAI-compatible chat/completions
      const url = node.llmBaseUrl || 'https://api.openai.com/v1/chat/completions'
      const headers = {}
      if (node.llmApiKey) headers.authorization = `Bearer ${node.llmApiKey}`
      const baseBody = {
        model: node.llmModel,
        temperature: node.llmTemperature,
        messages: [
          { role: 'system', content: systemPrompt || node.llmSystemPrompt || '' },
          { role: 'user', content: userContent }
        ]
      }
      const shouldUseNativeJsonSchema = false

      const schemaBody = shouldUseNativeJsonSchema
        ? Object.assign({}, baseBody, {
          response_format: {
            type: 'json_schema',
            json_schema: jsonSchema
          }
        })
        : baseBody

      // Some OpenAI models (and some compatible gateways) require `max_completion_tokens` instead of `max_tokens`.
      // Try with `max_tokens` first for broad compatibility, then fallback once if the server rejects it.
      const bodyWithMaxTokens = Object.assign({ max_tokens: resolvedMaxTokens }, schemaBody)
      const bodyWithMaxCompletionTokens = Object.assign({ max_completion_tokens: resolvedMaxTokens }, schemaBody)
      const plainBodyWithMaxTokens = Object.assign({ max_tokens: resolvedMaxTokens }, baseBody)
      const plainBodyWithMaxCompletionTokens = Object.assign({ max_completion_tokens: resolvedMaxTokens }, baseBody)

      const isResponseFormatCompatibilityError = (message) => {
        const msg = String(message || '')
        return msg.includes("Unsupported parameter: 'response_format'") ||
          msg.includes('Invalid schema for response_format') ||
          msg.includes('response_format') ||
          msg.includes('json_schema')
      }

      let json
      try {
        json = await postJson({ url, headers, body: bodyWithMaxTokens, timeoutMs: effectiveTimeoutMs })
      } catch (error) {
        const msg = (error && error.message) ? String(error.message) : ''
        if (isResponseFormatCompatibilityError(msg)) {
          try {
            json = await postJson({ url, headers, body: plainBodyWithMaxTokens, timeoutMs: effectiveTimeoutMs })
          } catch (innerError) {
            const innerMsg = (innerError && innerError.message) ? String(innerError.message) : ''
            if (innerMsg.includes("Unsupported parameter: 'max_tokens'") || innerMsg.includes('max_completion_tokens')) {
              json = await postJson({ url, headers, body: plainBodyWithMaxCompletionTokens, timeoutMs: effectiveTimeoutMs })
            } else if (innerMsg.includes("Unsupported parameter: 'max_completion_tokens'")) {
              json = await postJson({ url, headers, body: plainBodyWithMaxTokens, timeoutMs: effectiveTimeoutMs })
            } else {
              throw innerError
            }
          }
        } else if (msg.includes("Unsupported parameter: 'max_tokens'") || msg.includes('max_completion_tokens')) {
          json = await postJson({ url, headers, body: bodyWithMaxCompletionTokens, timeoutMs: effectiveTimeoutMs })
        } else if (msg.includes("Unsupported parameter: 'max_completion_tokens'")) {
          json = await postJson({ url, headers, body: bodyWithMaxTokens, timeoutMs: effectiveTimeoutMs })
        } else {
          throw error
        }
      }
      const content = extractOpenAICompatText(json) || buildOpenAICompatFallbackText(json)
      const finishReason = String(json && json.choices && json.choices[0] && json.choices[0].finish_reason ? json.choices[0].finish_reason : '')
      return { provider: 'openai_compat', model: baseBody.model, content, finishReason }
    }

    node.generateAiTestPlan = async ({ areaId, prompt, language } = {}) => {
      const targetAreaId = String(areaId || '').trim()
      const question = String(prompt || '').trim()
      const targetLanguage = normalizeLanguageCode(language, 'en')
      if (!targetAreaId) throw new Error('Missing areaId')
      if (!question) throw new Error('Missing prompt')
      const summary = rebuildCachedSummaryNow()
      const catalog = buildAreaSignalCatalog({ areaId: targetAreaId, summary })
      let plan = buildDeterministicPresetTestPlan({
        areaId: targetAreaId,
        prompt: question,
        catalog
      })
      if (!plan || !Array.isArray(plan.steps) || plan.steps.length === 0) {
        throw new Error('The selected test template did not produce executable steps for this area')
      }
      plan.prompt = question
      let translation = {
        provider: '',
        model: '',
        translated: false
      }
      try {
        translation = await translateTestPlanLabelsWithLlm({
          language: targetLanguage,
          plan
        })
        plan = translation.plan || plan
      } catch (error) {
        translation = {
          provider: '',
          model: '',
          translated: false,
          error: error.message || String(error)
        }
      }

      return {
        ok: true,
        plan,
        catalog,
        generation: {
          provider: 'deterministic',
          model: '',
          normalizedPrompt: question,
          translationProvider: '',
          translationModel: '',
          fallback: false,
          error: translation.error || '',
          language: targetLanguage,
          languageName: languageNameFromCode(targetLanguage),
          translated: translation.translated === true,
          translationProvider: translation.provider || '',
          translationModel: translation.model || ''
        },
        testPlans: buildAiTestPlansSnapshot()
      }
    }

    const callLLM = async ({ question }) => {
      const summary = rebuildCachedSummaryNow()
      const userContent = buildLLMPrompt({ question, summary })
      const configuredMaxTokens = Math.max(10000, Number(node.llmMaxTokens) || 0)
      let ret = await callLLMChat({
        systemPrompt: node.llmSystemPrompt || '',
        userContent,
        maxTokensOverride: configuredMaxTokens
      })
      const finishReason = String(ret && ret.finishReason ? ret.finishReason : '').trim().toLowerCase()
      const lengthLimited = finishReason === 'length' || isOpenAICompatLengthFallbackText(ret && ret.content)
      if (lengthLimited) {
        const compactPrompt = buildLLMPrompt({ question, summary, compact: true })
        const retryMaxTokens = Math.min(16000, Math.max(10000, Math.round(configuredMaxTokens * 1.25)))
        try {
          ret = await callLLMChat({
            systemPrompt: node.llmSystemPrompt || '',
            userContent: compactPrompt,
            maxTokensOverride: retryMaxTokens
          })
        } catch (retryError) {
          // Keep the first provider answer if retry fails.
        }
      }
      const finalContent = ensureSvgChartResponse({ question, summary, content: ret.content })
      return Object.assign({}, ret, { content: finalContent, summary })
    }

    const emitSummary = () => {
      try {
        const summary = rebuildCachedSummaryNow()
        node.send([{ topic: node.outputtopic, payload: summary, knxAi: { type: 'summary' } }, null, null])
        const best = summary.topGAs && summary.topGAs[0] ? `${summary.topGAs[0].ga} (${summary.topGAs[0].count})` : 'no traffic'
        updateStatus({ fill: 'green', shape: 'dot', text: `AI ${summary.counters.overallRatePerSec}/s top ${best}` })
      } catch (error) {
        try { node.sysLogger?.error(`knxUltimateAI emitSummary error: ${error.message || error}`) } catch (e) { /* ignore */ }
        updateStatus({ fill: 'red', shape: 'dot', text: `AI summary error: ${error.message || error}` })
      }
    }

    const recordAnomaly = (payload) => {
      try {
        const now = nowMs()
        const entry = { at: new Date(now).toISOString(), ts: now, payload }
        node._anomalies.push(entry)
        while (node._anomalies.length > 200) node._anomalies.shift()
        updateAnomalyLifecycle({ payload, now })
      } catch (error) { /* empty */ }
    }

    const appendBusConnectionTimeline = ({ state, atMs }) => {
      const nextState = state === 'connected' ? 'connected' : 'disconnected'
      const ts = Number.isFinite(Number(atMs)) && Number(atMs) > 0 ? Number(atMs) : nowMs()
      const keepMs = Math.max(12 * 60 * 60, Number(node._busConnectionWindowSec || 0)) * 2000
      if (!Array.isArray(node._busConnectionTimeline) || node._busConnectionTimeline.length === 0) {
        node._busConnectionTimeline = [{ state: nextState, startedAtMs: ts, endedAtMs: 0 }]
        return
      }

      const timeline = node._busConnectionTimeline
      const lastIdx = timeline.length - 1
      const last = timeline[lastIdx] || null
      if (last && last.state === nextState) {
        if (last.endedAtMs && last.endedAtMs >= ts) last.endedAtMs = 0
        timeline[lastIdx] = last
      } else {
        if (last) {
          last.endedAtMs = ts
          timeline[lastIdx] = last
        }
        timeline.push({ state: nextState, startedAtMs: ts, endedAtMs: 0 })
      }

      while (timeline.length > 1) {
        const first = timeline[0]
        const firstEnd = Number(first && first.endedAtMs ? first.endedAtMs : 0)
        if (!firstEnd || (ts - firstEnd) <= keepMs) break
        timeline.shift()
      }

      if (timeline.length > 240) {
        node._busConnectionTimeline = timeline.slice(timeline.length - 240)
      } else {
        node._busConnectionTimeline = timeline
      }
    }

    const buildBusConnectionSummary = (now) => {
      const windowSec = Math.max(12 * 60 * 60, Number(node._busConnectionWindowSec || 0))
      const windowMs = windowSec * 1000
      const windowStartMs = now - windowMs
      const timeline = Array.isArray(node._busConnectionTimeline) ? node._busConnectionTimeline : []
      const segments = []
      let connectedMs = 0
      let disconnectedMs = 0

      for (let i = 0; i < timeline.length; i++) {
        const item = timeline[i] || {}
        const state = item.state === 'connected' ? 'connected' : 'disconnected'
        const startedAtMs = Number(item.startedAtMs || 0)
        const endedAtMs = Number(item.endedAtMs || 0) > 0 ? Number(item.endedAtMs) : now
        if (!Number.isFinite(startedAtMs) || startedAtMs <= 0) continue
        const effectiveStartMs = Math.max(startedAtMs, windowStartMs)
        const effectiveEndMs = Math.min(endedAtMs, now)
        if (effectiveEndMs <= effectiveStartMs) continue
        const durationMs = effectiveEndMs - effectiveStartMs
        if (state === 'connected') connectedMs += durationMs
        else disconnectedMs += durationMs
        segments.push({
          state,
          startedAt: new Date(effectiveStartMs).toISOString(),
          endedAt: new Date(effectiveEndMs).toISOString(),
          durationSec: roundTo(durationMs / 1000, 1),
          ratioStart: roundTo((effectiveStartMs - windowStartMs) / windowMs, 4),
          ratioWidth: roundTo(durationMs / windowMs, 4),
          active: Number(item.endedAtMs || 0) <= 0
        })
      }

      const knownMs = connectedMs + disconnectedMs
      return {
        currentState: node._busConnectionState === 'connected' ? 'connected' : 'disconnected',
        windowSec,
        windowStartAt: new Date(windowStartMs).toISOString(),
        windowEndAt: new Date(now).toISOString(),
        connectedSec: roundTo(connectedMs / 1000, 1),
        disconnectedSec: roundTo(disconnectedMs / 1000, 1),
        connectedPct: roundTo((connectedMs / windowMs) * 100, 2),
        disconnectedPct: roundTo((disconnectedMs / windowMs) * 100, 2),
        knownCoveragePct: roundTo((knownMs / windowMs) * 100, 2),
        segments
      }
    }

    const emitBusConnectionEvent = ({ type, previousState, currentState, statusText }) => {
      const payload = {
        type,
        event: currentState,
        previousState: previousState || 'unknown',
        currentState,
        gatewayId: node.serverKNX ? node.serverKNX.id : '',
        gatewayName: (node.serverKNX && node.serverKNX.name) ? node.serverKNX.name : '',
        statusText: String(statusText || '').trim(),
        at: new Date().toISOString()
      }
      recordAnomaly(payload)
      node.send([null, {
        topic: node.outputtopic,
        payload,
        knxAi: {
          type: 'anomaly',
          event: type,
          gatewayId: payload.gatewayId,
          gatewayName: payload.gatewayName
        }
      }, null])
    }

    const trackBusConnectionStatus = ({ text }) => {
      const statusText = String(text || '').trim()
      let nextState = ''
      if (/^Connected\./i.test(statusText)) nextState = 'connected'
      if (/^Disconnected\b/i.test(statusText)) nextState = 'disconnected'
      if (nextState === '') return
      applyBusConnectionStateChange({ nextState, statusText })
    }

    const applyBusConnectionStateChange = ({ nextState, statusText }) => {
      const previousState = node._busConnectionState || 'unknown'
      if (previousState === nextState) return
      node._busConnectionState = nextState
      appendBusConnectionTimeline({ state: nextState, atMs: nowMs() })

      if (nextState === 'connected') {
        if (node._busConnectionPendingRestore) {
          emitBusConnectionEvent({
            type: 'bus_connection_restored',
            previousState,
            currentState: nextState,
            statusText
          })
          node._busConnectionPendingRestore = false
        }
        node._busConnectionHadConnected = true
        return
      }

      if (node._busConnectionHadConnected) {
        emitBusConnectionEvent({
          type: 'bus_connection_lost',
          previousState,
          currentState: nextState,
          statusText
        })
        node._busConnectionPendingRestore = true
      }
    }

    const pollBusConnectionStatus = () => {
      try {
        const raw = String((node.serverKNX && node.serverKNX.linkStatus) ? node.serverKNX.linkStatus : '').trim().toLowerCase()
        if (raw !== 'connected' && raw !== 'disconnected') return
        applyBusConnectionStateChange({
          nextState: raw,
          statusText: `Polled gateway state: ${raw}`
        })
      } catch (error) { /* ignore */ }
    }

    const maybeEmitOverallAnomaly = (now) => {
      const windowMs = Math.max(2, node.rateWindowSec) * 1000
      const cutoff = now - windowMs
      const items = node._history.filter(t => t.ts >= cutoff)
      const rate = items.length / Math.max(1, node.rateWindowSec)
      sampleGARate({ ga: 'BUS', now, ratePerSec: rate })
      if (!node.maxTelegramPerSecOverall || node.maxTelegramPerSecOverall <= 0) return
      if (rate <= node.maxTelegramPerSecOverall) return
      if (now - node._lastOverallAnomalyAt < 2000) return
      node._lastOverallAnomalyAt = now
      const payload = {
        type: 'overall_rate',
        ratePerSec: Number(rate.toFixed(2)),
        thresholdPerSec: node.maxTelegramPerSecOverall,
        windowSec: node.rateWindowSec,
        observedTelegrams: items.length
      }
      recordAnomaly(payload)
      node.send([null, {
        topic: node.outputtopic,
        payload,
        knxAi: { type: 'anomaly' }
      }, null])
      updateStatus({ fill: 'red', shape: 'ring', text: `AI bus rate high: ${rate.toFixed(1)}/s` })
    }

    const maybeEmitGAAnomalies = (telegram) => {
      const now = telegram.ts
      const ga = telegram.destination || ''
      if (!ga) return
      const state = node._gaState.get(ga) || { tsList: [], changeTsList: [], lastValue: undefined, lastValueTs: 0, lastAnomalyAt: 0 }

      const rateWindowMs = Math.max(2, node.rateWindowSec) * 1000
      const rateCutoff = now - rateWindowMs
      state.tsList.push(now)
      while (state.tsList.length > 0 && state.tsList[0] < rateCutoff) state.tsList.shift()
      const gaRatePerSec = state.tsList.length / Math.max(1, node.rateWindowSec)
      sampleGARate({ ga, now, ratePerSec: gaRatePerSec })

      // Rate per GA
      if (node.maxTelegramPerSecPerGA && node.maxTelegramPerSecPerGA > 0) {
        const rate = gaRatePerSec
        if (rate > node.maxTelegramPerSecPerGA && (now - state.lastAnomalyAt) > 2000) {
          state.lastAnomalyAt = now
          const payload = {
            type: 'ga_rate',
            ga,
            ratePerSec: Number(rate.toFixed(2)),
            thresholdPerSec: node.maxTelegramPerSecPerGA,
            windowSec: node.rateWindowSec,
            observedTelegrams: state.tsList.length
          }
          recordAnomaly(payload)
          node.send([null, {
            topic: node.outputtopic,
            payload,
            knxAi: { type: 'anomaly', ga }
          }, null])
        }
      }

      // Flapping / rapid changes
      if (node.flapMaxChanges && node.flapMaxChanges > 0) {
        const windowMs = Math.max(5, node.flapWindowSec) * 1000
        const currentValue = normalizeValueForCompare(telegram.payload)
        if (state.lastValue !== undefined && currentValue !== state.lastValue) {
          const cutoff = now - windowMs
          state.changeTsList.push(now)
          while (state.changeTsList.length > 0 && state.changeTsList[0] < cutoff) state.changeTsList.shift()
          if (state.changeTsList.length >= node.flapMaxChanges && (now - state.lastAnomalyAt) > 2000) {
            state.lastAnomalyAt = now
            const payload = {
              type: 'ga_flap',
              ga,
              changesInWindow: state.changeTsList.length,
              thresholdChanges: node.flapMaxChanges,
              windowSec: node.flapWindowSec,
              lastValue: state.lastValue,
              currentValue
            }
            recordAnomaly(payload)
            node.send([null, {
              topic: node.outputtopic,
              payload,
              knxAi: { type: 'anomaly', ga }
            }, null])
          }
        }
        state.lastValue = currentValue
        state.lastValueTs = now
      }

      node._gaState.set(ga, state)
    }

    // Called by knxUltimate-config.js
    node.handleSend = (msg) => {
      try {
        const telegram = extractTelegram(msg)
        if (!telegram) return
        node._history.push(telegram)
        resolveTelegramWaiters(telegram)
        trackTransitionTelemetry(telegram)
        const now = telegram.ts
        trimHistory(now)
        maybeEmitGAAnomalies(telegram)
        maybeEmitOverallAnomaly(now)
        scheduleRealtimeSummaryRebuild()
      } catch (error) {
        try { node.sysLogger?.error(`knxUltimateAI handleSend error: ${error.message || error}`) } catch (e) { /* ignore */ }
      }
    }

    const handleCommand = async (msg) => {
      try {
        const cmd = (msg && msg.topic !== undefined) ? String(msg.topic).toLowerCase() : ''
        if (cmd === 'reset') {
          node._history = []
          node._gaState = new Map()
          node._transitionStats = new Map()
          node._transitionRecent = []
          node._anomalyLifecycle = new Map()
          node._gaRateSeries = new Map()
          node._busConnectionTimeline = [{
            state: node._busConnectionState === 'connected' ? 'connected' : 'disconnected',
            startedAtMs: nowMs(),
            endedAtMs: 0
          }]
          node._lastSummary = null
          node._lastSummaryAt = 0
          if (node._summaryRebuildTimer) {
            clearTimeout(node._summaryRebuildTimer)
            node._summaryRebuildTimer = null
          }
          updateStatus({ fill: 'grey', shape: 'dot', text: 'AI reset' })
          node.send([{ topic: node.outputtopic, payload: { ok: true }, knxAi: { type: 'reset' } }, null, null])
          return
        }

        if (cmd === 'summary' || cmd === 'stats' || cmd === 'top' || cmd === '') {
          emitSummary()
          return
        }

        if (cmd === 'ask') {
          const question = (msg.prompt !== undefined)
            ? String(msg.prompt)
            : (typeof msg.payload === 'string' ? msg.payload : safeStringify(msg.payload))
          updateStatus({ fill: 'blue', shape: 'ring', text: 'AI thinking...' })
          try {
            const ret = await callLLM({ question })
            node._assistantLog.push({ at: new Date().toISOString(), question, content: ret.content, provider: ret.provider, model: ret.model })
            while (node._assistantLog.length > 50) node._assistantLog.shift()
            node.send([null, null, {
              topic: node.outputtopic,
              payload: ret.content,
              knxAi: { type: 'llm', provider: ret.provider, model: ret.model, question },
              summary: ret.summary
            }])
            updateStatus({ fill: 'green', shape: 'dot', text: 'AI answer ready' })
          } catch (error) {
            node._assistantLog.push({ at: new Date().toISOString(), question, error: error.message || String(error) })
            while (node._assistantLog.length > 50) node._assistantLog.shift()
            node.send([null, null, {
              topic: node.outputtopic,
              payload: { error: error.message || String(error) },
              knxAi: { type: 'llm_error', question }
            }])
            updateStatus({ fill: 'red', shape: 'dot', text: `AI error: ${error.message || error}` })
          }
          return
        }

        if (cmd === 'run_profile') {
          const areaId = msg.areaId !== undefined ? String(msg.areaId) : (msg.payload && msg.payload.areaId ? String(msg.payload.areaId) : '')
          const profileId = msg.profileId !== undefined ? String(msg.profileId) : (msg.payload && msg.payload.profileId ? String(msg.payload.profileId) : '')
          const ret = await node.runAreaProfile({ areaId, profileId })
          node.send([{
            topic: node.outputtopic,
            payload: ret.report,
            knxAi: { type: 'profile_report', areaId, profileId }
          }, null, null])
          updateStatus({ fill: 'green', shape: 'dot', text: `Profile ${profileId} on ${areaId}` })
          return
        }

        if (cmd === 'run_actuator_test') {
          const payload = msg.payload && typeof msg.payload === 'object' ? msg.payload : {}
          const ret = await node.runActuatorTest(Object.assign({}, payload, {
            id: msg.id !== undefined ? msg.id : payload.id,
            name: msg.name !== undefined ? msg.name : payload.name,
            commandGA: msg.commandGA !== undefined ? msg.commandGA : payload.commandGA,
            commandDPT: msg.commandDPT !== undefined ? msg.commandDPT : payload.commandDPT,
            commandPayload: msg.commandPayload !== undefined ? msg.commandPayload : payload.commandPayload,
            statusGA: msg.statusGA !== undefined ? msg.statusGA : payload.statusGA,
            statusDPT: msg.statusDPT !== undefined ? msg.statusDPT : payload.statusDPT,
            statusWriteTimeoutMs: msg.statusWriteTimeoutMs !== undefined ? msg.statusWriteTimeoutMs : (msg.timeoutMs !== undefined ? msg.timeoutMs : (payload.statusWriteTimeoutMs !== undefined ? payload.statusWriteTimeoutMs : payload.timeoutMs)),
            statusResponseTimeoutMs: msg.statusResponseTimeoutMs !== undefined ? msg.statusResponseTimeoutMs : (msg.timeoutMs !== undefined ? msg.timeoutMs : (payload.statusResponseTimeoutMs !== undefined ? payload.statusResponseTimeoutMs : payload.timeoutMs))
          }))
          node.send([{
            topic: node.outputtopic,
            payload: ret.report,
            knxAi: { type: 'actuator_test_report', commandGA: ret.report.command.ga }
          }, null, null])
          updateStatus({ fill: 'green', shape: 'dot', text: `Actuator test ${ret.report.command.ga}` })
          return
        }

        if (cmd === 'run_test_plan') {
          const payload = msg.payload && typeof msg.payload === 'object' ? msg.payload : {}
          const ret = await node.runAiTestPlan({
            planId: msg.planId !== undefined ? msg.planId : payload.planId,
            plan: msg.plan !== undefined ? msg.plan : payload.plan
          })
          node.send([{
            topic: node.outputtopic,
            payload: ret.report,
            knxAi: { type: 'ai_test_plan_report', areaId: ret.report && ret.report.area ? ret.report.area.id : '' }
          }, null, null])
          updateStatus({ fill: 'green', shape: 'dot', text: `Test plan ${ret.report.name || ret.report.id}` })
          return
        }

        node.warn(`knxUltimateAI: unknown command '${cmd}'. Supported: reset, summary, ask, run_profile, run_actuator_test, run_test_plan`)
      } catch (error) {
        try { node.sysLogger?.error(`knxUltimateAI handleCommand error: ${error.message || error}`) } catch (e) { /* ignore */ }
        try { node.error(error) } catch (e) { /* ignore */ }
        updateStatus({ fill: 'red', shape: 'dot', text: `AI command error: ${error.message || error}` })
      }
    }

    node.getSidebarState = ({ fresh = false } = {}) => {
      try {
        const now = nowMs()
        trimHistory(now)
        // Keep sidebar data live even when client polls with fresh=0:
        // rebuild summary when cache is missing/stale.
        const summaryTtlMs = 350
        const lastAt = Number(node._lastSummaryAt || 0)
        const isStale = !lastAt || (now - lastAt) > summaryTtlMs
        const shouldRebuild = fresh || !node._lastSummary || isStale
        const summary = shouldRebuild ? rebuildCachedSummaryNow() : node._lastSummary
        const areas = buildAreasSnapshot({ summary })
        return {
          node: {
            id: node.id,
            type: node.type,
            name: node.name || '',
            topic: node.topic || '',
            gatewayId: node.serverKNX ? node.serverKNX.id : '',
            gatewayName: (node.serverKNX && node.serverKNX.name) ? node.serverKNX.name : '',
            llmEnabled: !!node.llmEnabled,
            llmProvider: node.llmProvider || '',
            llmModel: node.llmModel || ''
          },
          summary,
          areas,
          profiles: buildProfilesSnapshot(),
          profileReport: node._lastAreaProfileReport,
          actuatorTests: buildActuatorTestsSnapshot(),
          actuatorTestReport: node._lastActuatorTestReport,
          testPlans: buildAiTestPlansSnapshot(),
          testPlanReport: node._lastAiTestPlanReport,
          testResults: buildAiTestResultsSnapshot(),
          anomalies: node._anomalies.slice(-50),
          assistant: node._assistantLog.slice(-30)
        }
      } catch (error) {
        return {
          node: {
            id: node.id,
            type: node.type,
            name: node.name || '',
            topic: node.topic || ''
          },
          summary: { error: error.message || String(error) },
          areas: buildSuggestedAreasFromCsv([]),
          profiles: mergeAreaProfiles({ customProfiles: [] }),
          profileReport: null,
          actuatorTests: [],
          actuatorTestReport: null,
          testPlans: [],
          testPlanReport: null,
          testResults: [],
          anomalies: [],
          assistant: []
        }
      }
    }

    node.sidebarAsk = async (question) => {
      const q = String(question || '').trim()
      if (q === '') throw new Error('Missing question')
      updateStatus({ fill: 'blue', shape: 'ring', text: 'AI thinking...' })
      const ret = await callLLM({ question: q })
      node._assistantLog.push({ at: new Date().toISOString(), question: q, content: ret.content, provider: ret.provider, model: ret.model })
      while (node._assistantLog.length > 50) node._assistantLog.shift()
      updateStatus({ fill: 'green', shape: 'dot', text: 'AI answer ready' })
      return { answer: ret.content, provider: ret.provider, model: ret.model, summary: ret.summary }
    }

    node.on('input', function (msg) {
      try {
        const p = handleCommand(msg)
        if (p && typeof p.catch === 'function') {
          p.catch((error) => {
            try { node.sysLogger?.error(`knxUltimateAI input error: ${error.message || error}`) } catch (e) { /* ignore */ }
            try { node.error(error) } catch (e) { /* ignore */ }
          })
        }
      } catch (error) {
        try { node.sysLogger?.error(`knxUltimateAI input error: ${error.message || error}`) } catch (e) { /* ignore */ }
        try { node.error(error) } catch (e) { /* ignore */ }
      }
    })

    node.on('close', function (done) {
      try {
        if (node._timerEmit) clearInterval(node._timerEmit)
        if (node._busConnectionWatchTimer) clearInterval(node._busConnectionWatchTimer)
        if (node._summaryRebuildTimer) {
          clearTimeout(node._summaryRebuildTimer)
          node._summaryRebuildTimer = null
        }
        if (Array.isArray(node._telegramWaiters)) {
          node._telegramWaiters.forEach((waiter) => {
            try { if (waiter && waiter.timer) clearTimeout(waiter.timer) } catch (error) { /* ignore */ }
            try { if (waiter && typeof waiter.reject === 'function') waiter.reject(new Error('Node closed')) } catch (error) { /* ignore */ }
          })
          node._telegramWaiters = []
        }
      } catch (error) { /* empty */ }
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      try { aiRuntimeNodes.delete(node.id) } catch (e) { }
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      try { node.serverKNX.removeClient(node) } catch (e) { /* ignore */ }
      try { node.serverKNX.addClient(node) } catch (e) { /* ignore */ }
    }

    if (node.emitIntervalSec && node.emitIntervalSec > 0) {
      if (node._timerEmit) clearInterval(node._timerEmit)
      node._timerEmit = setInterval(() => {
        try { emitSummary() } catch (e) { /* emitSummary already guards */ }
      }, Math.max(5, node.emitIntervalSec) * 1000)
    }

    if (node._busConnectionWatchTimer) clearInterval(node._busConnectionWatchTimer)
    node._busConnectionWatchTimer = setInterval(() => {
      pollBusConnectionStatus()
    }, 1000)
    pollBusConnectionStatus()

    updateStatus({ fill: 'grey', shape: 'dot', text: 'AI ready' })
  }

  RED.nodes.registerType('knxUltimateAI', knxUltimateAI, {
    credentials: {
      llmApiKey: { type: 'password' }
    }
  })
}
