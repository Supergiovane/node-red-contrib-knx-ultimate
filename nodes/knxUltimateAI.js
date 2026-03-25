// KNX Ultimate AI / Traffic Analyzer
const loggerClass = require('./utils/sysLogger')
const fs = require('fs')
const path = require('path')

const coerceBoolean = (value) => (value === true || value === 'true')

let adminEndpointsRegistered = false
const aiRuntimeNodes = new Map()
const knxAiVueDistDir = path.join(__dirname, 'plugins', 'knxUltimateAI-vue')

const sendKnxAiVueIndex = (res) => {
  const entryPath = path.join(knxAiVueDistDir, 'index.html')
  fs.stat(entryPath, (error, stats) => {
    if (error || !stats || !stats.isFile()) {
      res.status(503).type('text/plain').send('KNX AI Vue build not found. Run "npm run knx-ai:build" in the module root.')
      return
    }
    res.sendFile(entryPath, (sendError) => {
      if (!sendError || res.headersSent) return
      res.status(sendError.statusCode || 500).type('text/plain').send(sendError.message || String(sendError))
    })
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
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs || 30000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: Object.assign({ 'content-type': 'application/json' }, headers || {}),
      body: JSON.stringify(body || {}),
      signal: controller.signal
    })
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
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs || 20000)
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

    RED.httpAdmin.get('/knxUltimateAI/sidebar/page', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendKnxAiVueIndex(res)
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/page-vue', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendKnxAiVueIndex(res)
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/page/assets/:file', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
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

    RED.httpAdmin.get('/knxUltimateAI/sidebar/theme/:theme.css', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      const themeName = String(req.params?.theme || '').trim().toLowerCase()
      const allowed = {
        mix: 'knxUltimateAI-theme-mix.css',
        green: 'knxUltimateAI-theme-green.css',
        lavender: 'knxUltimateAI-theme-lavender.css'
      }
      const fileName = allowed[themeName]
      if (!fileName) {
        res.status(404).type('text/plain').send('Theme not found')
        return
      }
      const cssPath = path.join(__dirname, 'plugins', 'themes', fileName)
      res.type('text/css; charset=utf-8')
      res.sendFile(cssPath, (error) => {
        if (!error) return
        if (!res.headersSent) {
          res.status(error.statusCode || 500).type('text/plain').send(error.message || String(error))
        }
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

    RED.httpAdmin.post('/knxUltimateAI/models', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const body = req.body || {}
        const nodeId = body.nodeId ? String(body.nodeId) : ''

        let provider = body.provider ? String(body.provider) : ''
        let baseUrl = body.baseUrl ? String(body.baseUrl) : ''
        let apiKey = sanitizeApiKey(body.apiKey || '')
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
          const tagsUrl = (() => {
            const raw = String(baseUrl || '').trim()
            if (!raw) return 'http://localhost:11434/api/tags'
            try {
              const u = new URL(raw)
              if (/\/api\/chat\/?$/.test(u.pathname)) u.pathname = u.pathname.replace(/\/api\/chat\/?$/, '/api/tags')
              else if (/\/api\/generate\/?$/.test(u.pathname)) u.pathname = u.pathname.replace(/\/api\/generate\/?$/, '/api/tags')
              else if (!/\/api\/tags\/?$/.test(u.pathname)) u.pathname = '/api/tags'
              return u.toString()
            } catch (error) {
              return 'http://localhost:11434/api/tags'
            }
          })()
          const json = await getJson({ url: tagsUrl })
          const models = (json && Array.isArray(json.models)) ? json.models.map(m => m.name).filter(Boolean) : []
          res.json({ provider, baseUrl: tagsUrl, models })
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
  }

  function knxUltimateAI(config) {
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
    // Prefer Node-RED credentials store, fallback to legacy config field (backward compatible)
    node.llmApiKey = sanitizeApiKey((node.credentials && node.credentials.llmApiKey) ? node.credentials.llmApiKey : (config.llmApiKey || ''))
    node.llmModel = config.llmModel || 'gpt-4o-mini'
    node.llmSystemPrompt = config.llmSystemPrompt || 'You are a KNX building automation assistant. Analyze KNX bus traffic and provide actionable insights.'
    node.llmTemperature = (config.llmTemperature === undefined || config.llmTemperature === '') ? 0.2 : Number(config.llmTemperature)
    node.llmMaxTokens = (config.llmMaxTokens === undefined || config.llmMaxTokens === '') ? 600 : Number(config.llmMaxTokens)
    node.llmTimeoutMs = (config.llmTimeoutMs === undefined || config.llmTimeoutMs === '') ? 30000 : Number(config.llmTimeoutMs)
    node.llmMaxEventsInPrompt = (config.llmMaxEventsInPrompt === undefined || config.llmMaxEventsInPrompt === '') ? 600 : Number(config.llmMaxEventsInPrompt)
    node.llmIncludeRaw = config.llmIncludeRaw !== undefined ? coerceBoolean(config.llmIncludeRaw) : false
    node.llmIncludeFlowContext = config.llmIncludeFlowContext !== undefined ? coerceBoolean(config.llmIncludeFlowContext) : true
    node.llmMaxFlowNodesInPrompt = (config.llmMaxFlowNodesInPrompt === undefined || config.llmMaxFlowNodesInPrompt === '')
      ? 80
      : Number(config.llmMaxFlowNodesInPrompt)
    node.llmIncludeDocsSnippets = config.llmIncludeDocsSnippets !== undefined ? coerceBoolean(config.llmIncludeDocsSnippets) : true
    node.llmDocsLanguage = config.llmDocsLanguage ? String(config.llmDocsLanguage) : 'it'
    node.llmDocsMaxSnippets = (config.llmDocsMaxSnippets === undefined || config.llmDocsMaxSnippets === '') ? 5 : Number(config.llmDocsMaxSnippets)
    node.llmDocsMaxChars = (config.llmDocsMaxChars === undefined || config.llmDocsMaxChars === '') ? 3000 : Number(config.llmDocsMaxChars)

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
      const repeatCandidate = (msg.knx && msg.knx.repeated !== undefined) ? msg.knx.repeated
        : (msg.knx && msg.knx.repeat !== undefined) ? msg.knx.repeat
          : (msg.knx && msg.knx.isRepeated !== undefined) ? msg.knx.isRepeated
            : (msg.repeated !== undefined) ? msg.repeated
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

    const buildLLMPrompt = ({ question, summary }) => {
      const maxEvents = Math.max(10, node.llmMaxEventsInPrompt)
      const recent = node._history.slice(-maxEvents)
      const wantsSvgChart = shouldGenerateSvgChart(question)
      const lines = recent.map(t => {
        const payloadStr = normalizeValueForCompare(t.payload)
        const rawStr = (node.llmIncludeRaw && t.rawHex) ? ` raw=${t.rawHex}` : ''
        const devName = t.devicename ? ` (${t.devicename})` : ''
        return `${new Date(t.ts).toISOString()} ${t.event} ${t.source} -> ${t.destination}${devName} dpt=${t.dpt} payload=${payloadStr}${rawStr}`
      })

      let flowContext = ''
      if (node.llmIncludeFlowContext) {
        const ttlMs = 10 * 1000
        const now = nowMs()
        if (node._flowContextCache && node._flowContextCache.text && (now - (node._flowContextCache.at || 0)) < ttlMs) {
          flowContext = node._flowContextCache.text
        } else {
          flowContext = buildKnxUltimateFlowInventory({ maxNodes: Math.max(0, Number(node.llmMaxFlowNodesInPrompt) || 0) })
          if (flowContext && flowContext.length > 8000) flowContext = flowContext.slice(0, 8000) + '\n...'
          node._flowContextCache = { at: now, text: flowContext }
        }
      }

      let docsContext = ''
      if (node.llmIncludeDocsSnippets) {
        const ttlMs = 30 * 1000
        const now = nowMs()
        const q = String(question || '').trim()
        if (node._docsContextCache && node._docsContextCache.text && node._docsContextCache.question === q && (now - (node._docsContextCache.at || 0)) < ttlMs) {
          docsContext = node._docsContextCache.text
        } else {
          const preferredLangDir = (node.llmDocsLanguage && node.llmDocsLanguage !== 'auto') ? node.llmDocsLanguage : ''
          docsContext = buildRelevantDocsContext({
            moduleRootDir,
            question: q,
            preferredLangDir,
            maxSnippets: Math.max(1, Number(node.llmDocsMaxSnippets) || 1),
            maxChars: Math.max(500, Number(node.llmDocsMaxChars) || 500)
          })
          node._docsContextCache = { at: now, question: q, text: docsContext }
        }
      }
      return [
        'KNX bus summary (JSON):',
        safeStringify(summary),
        '',
        flowContext ? 'Node-RED context:' : '',
        flowContext ? flowContext : '',
        flowContext ? '' : '',
        docsContext ? docsContext : '',
        docsContext ? '' : '',
        wantsSvgChart ? 'SVG output rules:' : '',
        wantsSvgChart ? '- Return exactly one fenced SVG block using ```svg ... ```.' : '',
        wantsSvgChart ? '- Inside the fence, output only a valid standalone <svg>...</svg>.' : '',
        wantsSvgChart ? '- Do not use JavaScript, external URLs, or <foreignObject>.' : '',
        wantsSvgChart ? '- Prefer width via viewBox and include labels + legend when useful.' : '',
        wantsSvgChart ? '' : '',
        'Recent KNX telegrams:',
        lines.join('\n'),
        '',
        'User request:',
        question || ''
      ].join('\n')
    }

    const callLLM = async ({ question }) => {
      if (!node.llmEnabled) throw new Error('LLM is disabled in node config')
      if (!node.llmApiKey && node.llmProvider !== 'ollama') {
        throw new Error('Missing API key: paste only the OpenAI key (starts with sk-), without "Bearer"')
      }
      const summary = rebuildCachedSummaryNow()
      const userContent = buildLLMPrompt({ question, summary })

      if (node.llmProvider === 'ollama') {
        const url = node.llmBaseUrl || 'http://localhost:11434/api/chat'
        const body = {
          model: node.llmModel || 'llama3.1',
          stream: false,
          messages: [
            { role: 'system', content: node.llmSystemPrompt || '' },
            { role: 'user', content: userContent }
          ],
          options: {
            temperature: node.llmTemperature
          }
        }
        const json = await postJson({ url, body, timeoutMs: node.llmTimeoutMs })
        const content = json && json.message && typeof json.message.content === 'string' ? json.message.content : safeStringify(json)
        const finalContent = ensureSvgChartResponse({ question, summary, content })
        return { provider: 'ollama', model: body.model, content: finalContent, summary }
      }

      // Default: OpenAI-compatible chat/completions
      const url = node.llmBaseUrl || 'https://api.openai.com/v1/chat/completions'
      const headers = {}
      if (node.llmApiKey) headers.authorization = `Bearer ${node.llmApiKey}`
      const baseBody = {
        model: node.llmModel,
        temperature: node.llmTemperature,
        messages: [
          { role: 'system', content: node.llmSystemPrompt || '' },
          { role: 'user', content: userContent }
        ]
      }

      // Some OpenAI models (and some compatible gateways) require `max_completion_tokens` instead of `max_tokens`.
      // Try with `max_tokens` first for broad compatibility, then fallback once if the server rejects it.
      const bodyWithMaxTokens = Object.assign({ max_tokens: node.llmMaxTokens }, baseBody)
      const bodyWithMaxCompletionTokens = Object.assign({ max_completion_tokens: node.llmMaxTokens }, baseBody)

      let json
      try {
        json = await postJson({ url, headers, body: bodyWithMaxTokens, timeoutMs: node.llmTimeoutMs })
      } catch (error) {
        const msg = (error && error.message) ? String(error.message) : ''
        if (msg.includes("Unsupported parameter: 'max_tokens'") || msg.includes('max_completion_tokens')) {
          json = await postJson({ url, headers, body: bodyWithMaxCompletionTokens, timeoutMs: node.llmTimeoutMs })
        } else if (msg.includes("Unsupported parameter: 'max_completion_tokens'")) {
          json = await postJson({ url, headers, body: bodyWithMaxTokens, timeoutMs: node.llmTimeoutMs })
        } else {
          throw error
        }
      }
      const content = json && json.choices && json.choices[0] && json.choices[0].message && typeof json.choices[0].message.content === 'string'
        ? json.choices[0].message.content
        : safeStringify(json)
      const finalContent = ensureSvgChartResponse({ question, summary, content })
      return { provider: 'openai_compat', model: baseBody.model, content: finalContent, summary }
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

        node.warn(`knxUltimateAI: unknown command '${cmd}'. Supported: reset, summary, ask`)
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
