<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const storageKey = 'knxUltimateAI:selectedNodeId'
const autoKey = 'knxUltimateAI:autoRefresh'
const themeKey = 'knxUltimateAI:theme'
const flowPrefsKey = 'knxUltimateAI:flowPreview'
const THEMES = ['mix', 'green', 'lavender']
const PRESET_QUESTIONS = [
  'Summarize the current KNX traffic and highlight the busiest group addresses.',
  'Explain any anomalies you see and suggest what to check first.',
  'Generate an SVG bar chart of Top Group Addresses with counts and title.'
]
const FLOW_EVENT_COLORS = {
  write: '#7a68d8',
  response: '#46b86d',
  read: '#d99a34',
  repeat: '#c34747',
  other: '#9a93b8'
}

const queryNodeId = (() => {
  try {
    return new URLSearchParams(window.location.search).get('nodeId') || ''
  } catch (error) {
    return ''
  }
})()

const state = reactive({
  nodes: [],
  selectedNodeId: '',
  autoRefresh: loadBoolean(autoKey, true),
  theme: normalizeTheme(loadString(themeKey, 'mix')),
  flowMaxNodes: loadFlowPrefs().maxNodes,
  flowSelectedGa: loadFlowPrefs().selectedGa,
  flowSearch: '',
  status: 'Ready',
  loadingNodes: false,
  loadingState: false,
  asking: false,
  stateData: null,
  lastError: '',
  chatMessages: [],
  chatDraft: '',
  pollStateHandle: null,
  pollNodesHandle: null
})
const flowCardRef = ref(null)
const isFlowFullscreen = ref(false)

function loadString (key, fallback = '') {
  try {
    return window.localStorage ? (window.localStorage.getItem(key) || fallback) : fallback
  } catch (error) {
    return fallback
  }
}

function loadBoolean (key, fallback) {
  try {
    if (!window.localStorage) return fallback
    const raw = window.localStorage.getItem(key)
    if (raw === null || raw === undefined || raw === '') return fallback
    return raw === 'true'
  } catch (error) {
    return fallback
  }
}

function loadFlowPrefs () {
  try {
    if (!window.localStorage) return { maxNodes: 14, selectedGa: [] }
    const raw = window.localStorage.getItem(flowPrefsKey)
    if (!raw) return { maxNodes: 14, selectedGa: [] }
    const parsed = JSON.parse(raw)
    const maxNodes = Math.max(4, Math.min(32, Number(parsed && parsed.maxNodes) || 14))
    const selectedGa = Array.isArray(parsed && parsed.selectedGa)
      ? Array.from(new Set(parsed.selectedGa.map(item => String(item || '').trim()).filter(Boolean))).slice(0, 80)
      : []
    return { maxNodes, selectedGa }
  } catch (error) {
    return { maxNodes: 14, selectedGa: [] }
  }
}

function saveString (key, value) {
  try {
    if (window.localStorage) window.localStorage.setItem(key, String(value ?? ''))
  } catch (error) {}
}

function saveBoolean (key, value) {
  try {
    if (window.localStorage) window.localStorage.setItem(key, value ? 'true' : 'false')
  } catch (error) {}
}

function saveFlowPrefs () {
  try {
    if (!window.localStorage) return
    window.localStorage.setItem(flowPrefsKey, JSON.stringify({
      maxNodes: Math.max(4, Math.min(32, Number(state.flowMaxNodes) || 14)),
      selectedGa: Array.from(new Set((state.flowSelectedGa || []).map(item => String(item || '').trim()).filter(Boolean))).slice(0, 80)
    }))
  } catch (error) {}
}

async function toggleFlowFullscreen () {
  const target = flowCardRef.value
  if (!target || typeof target.requestFullscreen !== 'function') return
  try {
    if (document.fullscreenElement === target) {
      await document.exitFullscreen()
    } else if (!document.fullscreenElement) {
      await target.requestFullscreen()
    }
  } catch (error) {}
}

function syncFullscreenState () {
  isFlowFullscreen.value = document.fullscreenElement === flowCardRef.value
}

function normalizeTheme (value) {
  const t = String(value || '').trim().toLowerCase()
  return THEMES.includes(t) ? t : 'mix'
}

function apiUrl (tail) {
  return new URL(tail, window.location.href).toString()
}

function setStatus (text) {
  state.status = String(text || '')
}

async function requestJson (url, options) {
  const response = await fetch(url, Object.assign({ credentials: 'same-origin' }, options || {}))
  const text = await response.text()
  let json = {}
  try {
    json = text ? JSON.parse(text) : {}
  } catch (error) {
    json = { error: text || `HTTP ${response.status}` }
  }
  if (!response.ok) {
    const baseMessage = (json && json.error) ? json.error : `HTTP ${response.status}`
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Authentication required or insufficient permissions (${response.status}).`)
    }
    throw new Error(baseMessage)
  }
  return json
}

function normalizeChatText (value) {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch (error) {
    return String(value)
  }
}

function escapeHtml (value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isTableSeparatorLine (line) {
  const s = String(line || '').trim()
  return s.includes('-') && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(s)
}

function parsePipeRow (line) {
  let s = String(line || '').trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map(c => String(c || '').trim())
}

function parseAlignments (sepLine) {
  return parsePipeRow(sepLine).map((cell) => {
    const value = String(cell || '').trim()
    const left = value.startsWith(':')
    const right = value.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    return 'left'
  })
}

function basicMarkdownToHtml (markdown) {
  const lines = String(markdown || '').split(/\r?\n/)
  let html = ''
  let inCode = false

  const renderInline = (text) => {
    let out = String(text || '')
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
      const safeHref = /^javascript:/i.test(String(href || '').trim()) ? '#' : href
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
    return out
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^```/.test(line.trim())) {
      inCode = !inCode
      html += inCode ? '<pre><code>' : '</code></pre>'
      continue
    }
    if (inCode) {
      html += `${line}\n`
      continue
    }

    if (/^###\s+/.test(line)) { html += `<h3>${line.replace(/^###\s+/, '')}</h3>`; continue }
    if (/^##\s+/.test(line)) { html += `<h2>${line.replace(/^##\s+/, '')}</h2>`; continue }
    if (/^#\s+/.test(line)) { html += `<h1>${line.replace(/^#\s+/, '')}</h1>`; continue }

    if (line.includes('|') && i + 1 < lines.length && isTableSeparatorLine(lines[i + 1])) {
      const headers = parsePipeRow(line)
      const aligns = parseAlignments(lines[i + 1])
      const rows = []
      i += 2
      while (i < lines.length && lines[i] && lines[i].includes('|') && !/^```/.test(lines[i].trim())) {
        rows.push(parsePipeRow(lines[i]))
        i++
      }
      i -= 1
      const colCount = Math.max(headers.length, aligns.length, ...(rows.map(row => row.length)), 0)
      html += '<div class="chat-table-wrap"><table><thead><tr>'
      for (let index = 0; index < colCount; index++) {
        html += `<th style="text-align:${aligns[index] || 'left'};">${renderInline(headers[index] || '')}</th>`
      }
      html += '</tr></thead><tbody>'
      rows.forEach((row) => {
        html += '<tr>'
        for (let index = 0; index < colCount; index++) {
          html += `<td style="text-align:${aligns[index] || 'left'};">${renderInline(row[index] || '')}</td>`
        }
        html += '</tr>'
      })
      html += '</tbody></table></div>'
      continue
    }

    const isUnordered = /^\s*[-*]\s+/.test(line)
    const isOrdered = /^\s*\d+\.\s+/.test(line)
    if (isUnordered || isOrdered) {
      const listTag = isOrdered ? 'ol' : 'ul'
      const itemRe = isOrdered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/
      html += `<${listTag}>`
      while (i < lines.length && itemRe.test(lines[i])) {
        html += `<li>${renderInline(lines[i].replace(itemRe, ''))}</li>`
        i++
      }
      i -= 1
      html += `</${listTag}>`
      continue
    }

    if (line.trim() === '') {
      html += '<br>'
      continue
    }
    html += `<p>${renderInline(line)}</p>`
  }

  if (inCode) html += '</code></pre>'
  return html
}

function decodeBasicHtmlEntities (value) {
  return String(value || '')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
}

function extractInlineSvgCandidates (value) {
  const out = []
  const re = /<svg[\s\S]*?<\/svg>/gi
  let match
  while ((match = re.exec(String(value || ''))) !== null) {
    if (match && match[0]) out.push(String(match[0]))
  }
  return out
}

const SVG_ALLOWED_TAGS = new Set([
  'svg', 'g', 'path', 'line', 'polyline', 'polygon', 'circle', 'ellipse', 'rect',
  'text', 'tspan', 'title', 'desc', 'defs', 'marker', 'lineargradient', 'radialgradient',
  'stop', 'clippath'
])

const SVG_ALLOWED_ATTRS = new Set([
  'xmlns', 'xmlns:xlink', 'viewbox', 'preserveaspectratio', 'width', 'height', 'role', 'aria-label',
  'id', 'class', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
  'd', 'points', 'transform', 'fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity',
  'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-size', 'font-family',
  'font-weight', 'text-anchor', 'dominant-baseline', 'offset', 'stop-color', 'stop-opacity',
  'gradientunits', 'gradienttransform', 'fx', 'fy', 'marker-start', 'marker-mid', 'marker-end',
  'markerwidth', 'markerheight', 'refx', 'refy', 'orient', 'markerunits', 'href', 'xlink:href',
  'clip-path', 'clippathunits'
])

function sanitizeSvgMarkup (svgMarkup) {
  try {
    const parser = new window.DOMParser()
    const doc = parser.parseFromString(String(svgMarkup || ''), 'image/svg+xml')
    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) return ''
    const root = doc.documentElement
    if (String(root.tagName || '').toLowerCase() !== 'svg') return ''

    const sanitizeNode = (node) => {
      const tag = String(node.tagName || '').toLowerCase()
      if (!SVG_ALLOWED_TAGS.has(tag)) {
        node.remove()
        return
      }
      Array.from(node.attributes || []).forEach((attr) => {
        const name = String(attr.name || '').toLowerCase()
        const value = String(attr.value || '')
        if (name.startsWith('on') || !SVG_ALLOWED_ATTRS.has(name)) {
          node.removeAttribute(attr.name)
          return
        }
        if ((name === 'href' || name === 'xlink:href') && value && !String(value).trim().startsWith('#')) {
          node.removeAttribute(attr.name)
        }
      })
      Array.from(node.childNodes || []).forEach((child) => {
        if (child.nodeType === 1) sanitizeNode(child)
        else if (child.nodeType !== 3) child.remove()
      })
    }

    sanitizeNode(root)
    if (!root.getAttribute('viewBox') && !root.getAttribute('viewbox')) {
      root.setAttribute('viewBox', '0 0 920 360')
    }
    root.setAttribute('role', root.getAttribute('role') || 'img')
    const out = new window.XMLSerializer().serializeToString(root)
    return out.length > 120000 ? '' : out
  } catch (error) {
    return ''
  }
}

function renderMarkdownToHtml (markdown) {
  return basicMarkdownToHtml(escapeHtml(markdown || ''))
}

function renderAssistantHtml (value) {
  const raw = normalizeChatText(value)
  const trimmed = raw.trim()
  if (!trimmed) return renderMarkdownToHtml('(empty answer)')

  const fenceRe = /```(?:svg|xml|html)?\s*([\s\S]*?)```/gi
  let html = ''
  let cursor = 0
  let hasSvg = false
  let match

  while ((match = fenceRe.exec(raw)) !== null) {
    const before = raw.slice(cursor, match.index)
    if (before.trim()) html += renderMarkdownToHtml(before)
    const blockRaw = String(match[1] || '')
    const decoded = decodeBasicHtmlEntities(blockRaw)
    const svgCandidates = extractInlineSvgCandidates(decoded)
    if (svgCandidates.length) {
      let rendered = 0
      svgCandidates.forEach((candidate) => {
        const safeSvg = sanitizeSvgMarkup(candidate)
        if (safeSvg) {
          rendered++
          hasSvg = true
          html += `<div class="chat-svg-wrap">${safeSvg}</div>`
        }
      })
      if (!rendered) html += `<pre><code>${escapeHtml(blockRaw)}</code></pre>`
    } else {
      const safeSvg = sanitizeSvgMarkup(decoded)
      if (safeSvg) {
        hasSvg = true
        html += `<div class="chat-svg-wrap">${safeSvg}</div>`
      } else {
        html += `<pre><code>${escapeHtml(blockRaw)}</code></pre>`
      }
    }
    cursor = match.index + match[0].length
  }

  const tail = raw.slice(cursor)
  if (tail.trim()) html += renderMarkdownToHtml(tail)

  if (!hasSvg) {
    const decodedRaw = decodeBasicHtmlEntities(raw)
    const safeSvgs = Array.from(new Set([
      ...extractInlineSvgCandidates(raw),
      ...extractInlineSvgCandidates(decodedRaw)
    ])).map(candidate => sanitizeSvgMarkup(candidate)).filter(Boolean)
    if (safeSvgs.length) {
      const withoutInline = raw
        .replace(/<svg[\s\S]*?<\/svg>/gi, '')
        .replace(/&lt;svg[\s\S]*?&lt;\/svg&gt;/gi, '')
        .trim()
      html = withoutInline ? renderMarkdownToHtml(withoutInline) : ''
      safeSvgs.forEach((safeSvg) => {
        html += `<div class="chat-svg-wrap">${safeSvg}</div>`
      })
    }
  }

  return html || renderMarkdownToHtml(trimmed)
}

function formatDurationCompact (seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hours) return `${hours}h ${minutes}m`
  if (minutes) return `${minutes}m ${secs}s`
  return `${secs}s`
}

function formatClockLabel (value) {
  if (!value) return 'n/a'
  try {
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch (error) {
    return 'n/a'
  }
}

function formatDateTime (value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString()
  } catch (error) {
    return String(value)
  }
}

function normalizeAnomalyPayload (entry) {
  return entry && entry.payload && typeof entry.payload === 'object' ? entry.payload : {}
}

function toTrimmedText (value) {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

function shortNodeLabel (value) {
  const s = String(value || '').trim()
  return s.length > 14 ? `${s.slice(0, 12)}..` : s
}

function shortNodeSubtitle (value) {
  const s = String(value || '').trim()
  if (!s) return ''
  return s.length > 28 ? `${s.slice(0, 26)}..` : s
}

function shortNodePayload (value) {
  const s = toTrimmedText(value).replace(/\s+/g, ' ')
  if (!s) return ''
  return s.length > 30 ? `${s.slice(0, 28)}..` : s
}

function normalizeEvent (eventName) {
  const e = String(eventName || '').toLowerCase()
  if (e.includes('repeat')) return 'repeat'
  if (e.includes('write')) return 'write'
  if (e.includes('response')) return 'response'
  if (e.includes('read')) return 'read'
  return 'other'
}

function dominantEventType (edgeByEvent) {
  const buckets = { write: 0, response: 0, read: 0, repeat: 0, other: 0 }
  Object.keys(edgeByEvent || {}).forEach((name) => {
    const value = Number(edgeByEvent[name] || 0)
    if (value <= 0) return
    buckets[normalizeEvent(name)] += value
  })
  return Object.keys(buckets).sort((a, b) => buckets[b] - buckets[a])[0] || 'other'
}

function buildFlowSource (data) {
  const summary = data && data.summary ? data.summary : {}
  const anomaliesRaw = Array.isArray(data && data.anomalies) ? data.anomalies : []
  const patternTransitions = Array.isArray(summary.patternTransitions) ? summary.patternTransitions : []
  const patterns = Array.isArray(summary.patterns) ? summary.patterns : []
  const gaLabels = summary && typeof summary.gaLabels === 'object' ? summary.gaLabels : {}
  const gaLastPayload = summary && typeof summary.gaLastPayload === 'object' ? summary.gaLastPayload : {}
  const gaLastSeenAt = summary && typeof summary.gaLastSeenAt === 'object' ? summary.gaLastSeenAt : {}
  const flowKnownGASet = new Set((Array.isArray(summary.flowKnownGAs) ? summary.flowKnownGAs : []).map(item => String(item || '').trim()).filter(Boolean))
  const anomalyByGA = {}

  anomaliesRaw.forEach((entry) => {
    const ga = String(entry && entry.payload && entry.payload.ga ? entry.payload.ga : 'BUS').trim() || 'BUS'
    anomalyByGA[ga] = (anomalyByGA[ga] || 0) + 1
  })

  const topology = summary && summary.flowMapTopology && typeof summary.flowMapTopology === 'object' ? summary.flowMapTopology : null
  const topologyNodes = Array.isArray(topology && topology.nodes) ? topology.nodes : []
  const topologyEdges = Array.isArray(topology && topology.edges) ? topology.edges : []
  const edgeMap = new Map()

  const appendEdge = (raw) => {
    const from = String(raw && raw.from ? raw.from : '').trim()
    const to = String(raw && raw.to ? raw.to : '').trim()
    if (!from || !to || from === to) return
    const key = `${from}->${to}`
    const next = {
      key,
      from,
      to,
      weight: Math.max(1, Number(raw && (raw.weight ?? raw.currentWindowCount ?? raw.totalCount ?? raw.count) || 1)),
      delta: Number(raw && raw.delta ? raw.delta : 0),
      edgeByEvent: raw && typeof raw.edgeByEvent === 'object' ? raw.edgeByEvent : {},
      lastAtMs: (() => {
        const direct = Number(raw && raw.lastAtMs ? raw.lastAtMs : 0)
        if (Number.isFinite(direct) && direct > 0) return direct
        const ts = new Date(String(raw && raw.lastAt ? raw.lastAt : '')).getTime()
        return Number.isFinite(ts) ? ts : 0
      })(),
      linkType: String(raw && raw.linkType ? raw.linkType : '').trim()
    }
    if (!edgeMap.has(key)) {
      edgeMap.set(key, next)
      return
    }
    const current = edgeMap.get(key)
    current.weight += next.weight
    current.delta += next.delta
    current.lastAtMs = Math.max(Number(current.lastAtMs || 0), Number(next.lastAtMs || 0))
    Object.keys(next.edgeByEvent || {}).forEach((eventName) => {
      current.edgeByEvent[eventName] = Number(current.edgeByEvent[eventName] || 0) + Number(next.edgeByEvent[eventName] || 0)
    })
  }

  if (topologyEdges.length) {
    topologyEdges.forEach(appendEdge)
  } else if (patternTransitions.length) {
    patternTransitions.forEach(appendEdge)
  } else {
    patterns.forEach((pattern) => appendEdge({
      from: pattern && pattern.from,
      to: pattern && pattern.to,
      count: pattern && pattern.count,
      edgeByEvent: {}
    }))
  }

  const nodesById = new Map()
  const ensureNode = (id, seed = {}) => {
    const key = String(id || '').trim()
    if (!key) return null
    if (!nodesById.has(key)) {
      nodesById.set(key, {
        id: key,
        displayId: String(seed.displayId || key).trim() || key,
        kind: String(seed.kind || (key.startsWith('N:') ? 'node' : 'ga')).trim() || 'ga',
        subtitle: String(seed.subtitle || '').trim(),
        payload: toTrimmedText(seed.payload),
        anomalyCount: Number(seed.anomalyCount || anomalyByGA[key] || 0),
        inFlow: seed.inFlow !== undefined ? !!seed.inFlow : (flowKnownGASet.size ? flowKnownGASet.has(key) || key === 'BUS' || key.startsWith('N:') : true),
        lastSeenAtMs: Number(seed.lastSeenAtMs || 0),
        score: Number(seed.score || 0)
      })
    }
    return nodesById.get(key)
  }

  topologyNodes.forEach((node) => {
    const id = String(node && node.id ? node.id : '').trim()
    if (!id) return
    ensureNode(id, {
      displayId: node && node.displayId,
      kind: node && node.kind,
      subtitle: node && node.subtitle ? node.subtitle : gaLabels[id],
      payload: node && node.payload !== undefined ? node.payload : gaLastPayload[id],
      anomalyCount: Number(node && node.anomalyCount ? node.anomalyCount : anomalyByGA[id] || 0),
      inFlow: node && node.inFlow !== undefined ? !!node.inFlow : undefined,
      lastSeenAtMs: Number(node && node.lastSeenAtMs ? node.lastSeenAtMs : new Date(String(node && node.lastAt ? node.lastAt : gaLastSeenAt[id] || '')).getTime() || 0),
      score: Number(node && node.score ? node.score : 0)
    })
  })

  Array.from(edgeMap.values()).forEach((edge) => {
    ensureNode(edge.from, {
      subtitle: gaLabels[edge.from],
      payload: gaLastPayload[edge.from],
      lastSeenAtMs: new Date(String(gaLastSeenAt[edge.from] || '')).getTime() || edge.lastAtMs || 0
    })
    ensureNode(edge.to, {
      subtitle: gaLabels[edge.to],
      payload: gaLastPayload[edge.to],
      lastSeenAtMs: new Date(String(gaLastSeenAt[edge.to] || '')).getTime() || edge.lastAtMs || 0
    })
    const fromNode = nodesById.get(edge.from)
    const toNode = nodesById.get(edge.to)
    if (fromNode) fromNode.score += Number(edge.weight || 0)
    if (toNode) toNode.score += Number(edge.weight || 0)
  })

  ;(Array.isArray(summary.topGAs) ? summary.topGAs : []).slice(0, 12).forEach((entry) => {
    const id = String(entry && entry.ga ? entry.ga : '').trim()
    if (!id) return
    const node = ensureNode(id, {
      subtitle: entry && entry.label ? entry.label : gaLabels[id],
      payload: gaLastPayload[id],
      lastSeenAtMs: new Date(String(gaLastSeenAt[id] || '')).getTime() || 0
    })
    if (node) node.score += Number(entry && entry.count ? entry.count : 0)
  })

  return {
    nodes: Array.from(nodesById.values()),
    edges: Array.from(edgeMap.values()).sort((a, b) => Number(b.weight || 0) - Number(a.weight || 0)).slice(0, 48),
    telemetryWindowSec: Number(summary && summary.graph && summary.graph.windowSec ? summary.graph.windowSec : summary?.meta?.analysisWindowSec || 0)
  }
}

function buildVisibleFlowGraph (source) {
  const allNodes = Array.isArray(source && source.nodes) ? source.nodes.slice() : []
  const allEdges = Array.isArray(source && source.edges) ? source.edges.slice() : []
  const selectedSet = new Set((state.flowSelectedGa || []).map(item => String(item || '').trim()).filter(Boolean))
  const maxNodes = Math.max(4, Math.min(32, Number(state.flowMaxNodes) || 14))
  let visibleNodes = allNodes.slice().sort((a, b) => {
    const scoreA = Number(a.anomalyCount || 0) * 10 + Number(a.score || 0)
    const scoreB = Number(b.anomalyCount || 0) * 10 + Number(b.score || 0)
    if (scoreB !== scoreA) return scoreB - scoreA
    return String(a.id || '').localeCompare(String(b.id || ''))
  })

  if (selectedSet.size) {
    const neighborIds = new Set(selectedSet)
    allEdges.forEach((edge) => {
      if (selectedSet.has(edge.from)) neighborIds.add(edge.to)
      if (selectedSet.has(edge.to)) neighborIds.add(edge.from)
    })
    visibleNodes = visibleNodes.filter(node => neighborIds.has(node.id))
  } else {
    visibleNodes = visibleNodes.slice(0, maxNodes)
  }

  const visibleIds = new Set(visibleNodes.map(node => node.id))
  const visibleEdges = allEdges.filter(edge => visibleIds.has(edge.from) && visibleIds.has(edge.to))
  const visibleWeightMax = Math.max(...visibleEdges.map(edge => Number(edge.weight || 0)), 1)
  const cols = Math.max(2, Math.min(6, Math.ceil(Math.sqrt(Math.max(visibleNodes.length, 4) * 1.5))))
  const rows = Math.max(1, Math.ceil(visibleNodes.length / cols))
  const width = 1080
  const height = Math.max(420, 140 + ((rows - 1) * 150))
  const positions = new Map()
  visibleNodes.forEach((node, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const x = cols === 1 ? width / 2 : 90 + (col * ((width - 180) / Math.max(cols - 1, 1)))
    const y = 92 + (row * 148)
    positions.set(node.id, { x, y, row, col })
  })

  const now = Date.now()
  const edges = visibleEdges.map((edge, index) => {
    const fromPos = positions.get(edge.from)
    const toPos = positions.get(edge.to)
    if (!fromPos || !toPos) return null
    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y
    const distance = Math.max(Math.hypot(dx, dy), 1)
    const ux = dx / distance
    const uy = dy / distance
    const nodeRadius = 24
    const startX = fromPos.x + (ux * (nodeRadius + 2))
    const startY = fromPos.y + (uy * (nodeRadius + 2))
    const endX = toPos.x - (ux * (nodeRadius + 8))
    const endY = toPos.y - (uy * (nodeRadius + 8))
    const perpX = -uy
    const perpY = ux
    const bend = 28 + ((index % 3) * 14)
    const sign = index % 2 === 0 ? 1 : -1
    const controlX = ((startX + endX) / 2) + (perpX * bend * sign)
    const controlY = ((startY + endY) / 2) + (perpY * bend * sign)
    const eventType = dominantEventType(edge.edgeByEvent)
    const active = Number(edge.lastAtMs || 0) > 0 && (now - Number(edge.lastAtMs || 0)) <= 5000
    return {
      key: edge.key,
      from: edge.from,
      to: edge.to,
      d: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
      width: (0.9 + ((Number(edge.weight || 0) / visibleWeightMax) * 1.7)).toFixed(2),
      color: FLOW_EVENT_COLORS[eventType] || FLOW_EVENT_COLORS.other,
      opacity: active ? 0.82 : 0.24,
      markerId: `flow-arrow-${eventType}`,
      tooltip: `${edge.from} -> ${edge.to} | traffic: ${Number(edge.weight || 0)}${edge.delta ? ` | delta: ${edge.delta > 0 ? '+' : ''}${edge.delta}` : ''}`,
      active
    }
  }).filter(Boolean)

  return {
    width,
    height,
    telemetryWindowSec: Number(source && source.telemetryWindowSec ? source.telemetryWindowSec : 0),
    nodes: visibleNodes.map((node) => {
      const pos = positions.get(node.id)
      const lastSeenAtMs = Number(node.lastSeenAtMs || 0)
      return Object.assign({}, node, pos, {
        shortLabel: shortNodeLabel(node.displayId || node.id),
        shortSubtitle: shortNodeSubtitle(node.subtitle),
        shortPayload: shortNodePayload(node.payload),
        isIdle: lastSeenAtMs > 0 && (now - lastSeenAtMs) > 45000
      })
    }),
    edges,
    maxNodes,
    selectedCount: selectedSet.size
  }
}

const selectedNode = computed(() => state.nodes.find(node => node.id === state.selectedNodeId) || null)
const summary = computed(() => state.stateData && state.stateData.summary ? state.stateData.summary : {})
const nodeInfo = computed(() => state.stateData && state.stateData.node ? state.stateData.node : {})
const anomalies = computed(() => Array.isArray(state.stateData && state.stateData.anomalies) ? state.stateData.anomalies.slice().reverse() : [])
const topGroups = computed(() => Array.isArray(summary.value.topGAs) ? summary.value.topGAs.slice(0, 10) : [])
const eventEntries = computed(() => {
  const byEvent = summary.value && summary.value.byEvent && typeof summary.value.byEvent === 'object' ? summary.value.byEvent : {}
  return Object.keys(byEvent)
    .map((name) => ({ name, count: Number(byEvent[name] || 0) }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
})
const maxEventCount = computed(() => Math.max(...eventEntries.value.map(item => item.count), 1))
const flowSource = computed(() => buildFlowSource(state.stateData))
const flowGraph = computed(() => buildVisibleFlowGraph(flowSource.value))
const flowSelectableNodes = computed(() => {
  const search = String(state.flowSearch || '').trim().toLowerCase()
  return flowSource.value.nodes
    .slice()
    .sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')))
    .filter((node) => {
      if (!search) return true
      const haystack = `${node.id} ${node.subtitle || ''}`.toLowerCase()
      return haystack.includes(search)
    })
    .slice(0, 120)
})
const busConnection = computed(() => {
  const bus = summary.value && summary.value.busConnection && typeof summary.value.busConnection === 'object' ? summary.value.busConnection : null
  return bus
})
const summaryText = computed(() => {
  const s = summary.value || {}
  if (!Object.keys(s).length) return 'No data available.'
  const counters = s.counters || {}
  const lines = []
  lines.push(nodeInfo.value.name || selectedNode.value?.name || 'KNX AI')
  lines.push(`Analysis window: ${Number(s.meta?.analysisWindowSec || 0)}s`)
  lines.push(`Telegrams: ${Number(counters.telegrams || 0)} | Rate: ${Number(counters.overallRatePerSec || 0)}/s`)
  lines.push(`Echoed: ${Number(counters.echoed || 0)} | Repeat: ${Number(counters.repeated || 0)} | Unknown DPT: ${Number(counters.unknownDpt || 0)}`)
  if (busConnection.value) {
    lines.push(`Bus: ${String(busConnection.value.currentState || 'unknown')} | Connected: ${Number(busConnection.value.connectedPct || 0)}% | Disconnected: ${Number(busConnection.value.disconnectedPct || 0)}%`)
  }
  return lines.join('\n')
})
const busSegments = computed(() => {
  const bus = busConnection.value
  if (!bus || !Array.isArray(bus.segments)) return []
  return bus.segments.map((segment, index) => {
    const ratioStart = Math.max(0, Math.min(1, Number(segment && segment.ratioStart) || 0))
    const ratioWidth = Math.max(0, Math.min(1, Number(segment && segment.ratioWidth) || 0))
    return {
      key: `${index}-${segment?.startedAt || ''}`,
      left: `${(ratioStart * 100).toFixed(3)}%`,
      width: `${Math.max(ratioWidth * 100, 0.4).toFixed(3)}%`,
      title: `${segment?.state === 'connected' ? 'Connected' : 'Disconnected'} | ${formatClockLabel(segment?.startedAt)} -> ${formatClockLabel(segment?.endedAt)} | ${formatDurationCompact(segment?.durationSec || 0)}`,
      className: segment?.state === 'connected' ? 'segment-connected' : 'segment-disconnected'
    }
  }).filter(segment => Number.parseFloat(segment.width) > 0)
})
const chatMessages = computed(() => state.chatMessages.map((item, index) => ({
  key: `${index}-${item.kind}`,
  kind: item.kind,
  rawText: normalizeChatText(item.text),
  html: item.kind === 'assistant' ? renderAssistantHtml(item.text) : ''
})))

watch(() => state.selectedNodeId, (value) => {
  saveString(storageKey, value || '')
})

watch(() => state.autoRefresh, (value) => {
  saveBoolean(autoKey, value)
})

watch(() => state.theme, (value) => {
  saveString(themeKey, normalizeTheme(value))
  applyThemeLink()
})
watch(() => state.flowMaxNodes, (value) => {
  state.flowMaxNodes = Math.max(4, Math.min(32, Number(value) || 14))
  saveFlowPrefs()
})
watch(() => (state.flowSelectedGa || []).join('|'), () => {
  saveFlowPrefs()
})

function appendChat (kind, text) {
  state.chatMessages.push({ kind, text })
}

function clearChat () {
  state.chatMessages = []
}

function applyThemeLink () {
  const themeId = 'knx-ai-theme-link-vue'
  let link = document.getElementById(themeId)
  if (!link) {
    link = document.createElement('link')
    link.id = themeId
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  const theme = normalizeTheme(state.theme)
  const href = apiUrl(`theme/${theme}.css`)
  if (link.getAttribute('href') === href) return
  link.setAttribute('href', href)
  document.documentElement.setAttribute('data-theme', theme)
}

function preferredNodeId (nodes) {
  const queryPreferred = queryNodeId && nodes.find(node => node.id === queryNodeId) ? queryNodeId : ''
  const stored = loadString(storageKey, '')
  const storedPreferred = stored && nodes.find(node => node.id === stored) ? stored : ''
  return queryPreferred || storedPreferred || (nodes[0] ? nodes[0].id : '')
}

async function fetchNodes ({ preserveSelection = true } = {}) {
  state.loadingNodes = true
  setStatus('Loading nodes...')
  try {
    const data = await requestJson(apiUrl('nodes'))
    const nodes = Array.isArray(data && data.nodes) ? data.nodes : []
    state.nodes = nodes
    if (!nodes.length) {
      state.selectedNodeId = ''
      state.stateData = null
      state.lastError = 'No KNX AI nodes found.'
      setStatus(state.lastError)
      return
    }
    const nextId = preserveSelection && state.selectedNodeId && nodes.find(node => node.id === state.selectedNodeId)
      ? state.selectedNodeId
      : preferredNodeId(nodes)
    state.selectedNodeId = nextId
    state.lastError = ''
    setStatus('Ready')
  } catch (error) {
    state.lastError = error.message || 'Failed to load nodes'
    setStatus(state.lastError)
  } finally {
    state.loadingNodes = false
  }
}

async function fetchState ({ fresh = false } = {}) {
  if (!state.selectedNodeId || state.loadingState) return
  state.loadingState = true
  if (fresh) setStatus('Loading...')
  try {
    const data = await requestJson(apiUrl(`state?nodeId=${encodeURIComponent(state.selectedNodeId)}&fresh=${fresh ? 1 : 0}`))
    state.stateData = data
    state.lastError = ''
    setStatus('Ready')
  } catch (error) {
    state.lastError = error.message || 'Failed to load state'
    setStatus(state.lastError)
  } finally {
    state.loadingState = false
  }
}

async function onRefresh () {
  await fetchNodes({ preserveSelection: true })
  await fetchState({ fresh: true })
}

async function onNodeChange () {
  clearChat()
  await fetchState({ fresh: true })
}

async function sendAsk (questionOverride = '') {
  const useOverride = String(questionOverride || '').trim()
  const question = useOverride || String(state.chatDraft || '').trim()
  if (!question || !state.selectedNodeId) return
  appendChat('user', question)
  if (!useOverride) state.chatDraft = ''
  state.asking = true
  setStatus('Asking...')
  try {
    const data = await requestJson(apiUrl('ask'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nodeId: state.selectedNodeId, question })
    })
    appendChat('assistant', data && data.answer !== undefined ? data.answer : '')
    setStatus('Ready')
  } catch (error) {
    appendChat('error', error.message || 'Ask failed')
    setStatus(error.message || 'Ask failed')
  } finally {
    state.asking = false
  }
}

function startTimers () {
  if (!state.pollStateHandle) {
    state.pollStateHandle = window.setInterval(() => {
      if (!state.autoRefresh) return
      fetchState({ fresh: false })
    }, 1500)
  }
  if (!state.pollNodesHandle) {
    state.pollNodesHandle = window.setInterval(() => {
      fetchNodes({ preserveSelection: true })
    }, 15000)
  }
}

function stopTimers () {
  if (state.pollStateHandle) {
    window.clearInterval(state.pollStateHandle)
    state.pollStateHandle = null
  }
  if (state.pollNodesHandle) {
    window.clearInterval(state.pollNodesHandle)
    state.pollNodesHandle = null
  }
}

onMounted(async () => {
  document.addEventListener('fullscreenchange', syncFullscreenState)
  applyThemeLink()
  await fetchNodes({ preserveSelection: false })
  await fetchState({ fresh: true })
  startTimers()
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState)
  stopTimers()
})
</script>

<template>
  <div class="page-shell">
    <header class="topbar">
      <div class="brand">
        <p class="eyebrow">Vue Preview</p>
        <h1>KNX AI Web</h1>
        <p class="subhead">Nuova UI in Vue 3, servita dal backend di Node-RED. Ora include anche una flow map SVG nativa per lavorare senza uscire dalla preview.</p>
      </div>
      <div class="toolbar">
        <div class="theme-strip">
          <button
            v-for="themeOption in THEMES"
            :key="themeOption"
            class="theme-button"
            :class="{ active: state.theme === themeOption }"
            type="button"
            @click="state.theme = themeOption"
          >
            {{ themeOption }}
          </button>
        </div>
        <select v-model="state.selectedNodeId" class="node-select" @change="onNodeChange">
          <option v-for="node in state.nodes" :key="node.id" :value="node.id">
            {{ `${node.name || 'KNX AI'}${node.gatewayName ? ` | ${node.gatewayName}` : ''}` }}
          </option>
        </select>
        <label class="checkbox">
          <input v-model="state.autoRefresh" type="checkbox">
          <span>Auto refresh</span>
        </label>
        <button class="primary-button" type="button" :disabled="state.loadingNodes || state.loadingState" @click="onRefresh">
          Refresh
        </button>
      </div>
      <div class="statusbar">
        <span class="status-pill" :class="{ error: !!state.lastError }">{{ state.status }}</span>
        <span v-if="selectedNode" class="status-detail">Provider: {{ selectedNode.llmProvider || 'n/a' }} | Model: {{ selectedNode.llmModel || 'n/a' }}</span>
      </div>
    </header>

    <main class="content-grid">
      <section class="card card-summary">
        <div class="card-head">
          <h2>Summary</h2>
          <span v-if="summary.meta?.generatedAt" class="meta-chip">{{ formatDateTime(summary.meta.generatedAt) }}</span>
        </div>
        <pre class="summary-pre">{{ summaryText }}</pre>
        <div class="metric-grid">
          <article class="metric">
            <span>Telegrams</span>
            <strong>{{ Number(summary.counters?.telegrams || 0) }}</strong>
          </article>
          <article class="metric">
            <span>Rate</span>
            <strong>{{ Number(summary.counters?.overallRatePerSec || 0) }}/s</strong>
          </article>
          <article class="metric">
            <span>Repeat</span>
            <strong>{{ Number(summary.counters?.repeated || 0) }}</strong>
          </article>
          <article class="metric">
            <span>Unknown DPT</span>
            <strong>{{ Number(summary.counters?.unknownDpt || 0) }}</strong>
          </article>
        </div>
      </section>

      <section class="card">
        <div class="card-head">
          <h2>Top Group Addresses</h2>
          <span class="meta-chip">{{ topGroups.length }} visible</span>
        </div>
        <ul v-if="topGroups.length" class="rank-list">
          <li v-for="entry in topGroups" :key="entry.ga" class="rank-row">
            <span class="rank-title">{{ entry.ga }}</span>
            <span class="rank-label">{{ entry.label || 'Unlabeled' }}</span>
            <strong>{{ Number(entry.count || 0) }}</strong>
          </li>
        </ul>
        <p v-else class="empty-state">No top group address data available yet.</p>
      </section>

      <section class="card">
        <div class="card-head">
          <h2>Event Mix</h2>
          <span class="meta-chip">{{ eventEntries.length }} event types</span>
        </div>
        <ul v-if="eventEntries.length" class="event-list">
          <li v-for="eventEntry in eventEntries" :key="eventEntry.name" class="event-row">
            <span class="event-name">{{ eventEntry.name }}</span>
            <div class="event-bar">
              <span class="event-bar-fill" :style="{ width: `${Math.max((eventEntry.count / maxEventCount) * 100, 6)}%` }" />
            </div>
            <strong>{{ eventEntry.count }}</strong>
          </li>
        </ul>
        <p v-else class="empty-state">Event distribution will appear after the first samples.</p>
      </section>

      <section class="card card-bus">
        <div class="card-head">
          <h2>Bus Connection Persistence</h2>
          <span v-if="busConnection" class="meta-chip">{{ String(busConnection.currentState || 'unknown') }}</span>
        </div>
        <template v-if="busConnection">
          <div class="pill-row">
            <span class="pill success">Connected {{ formatDurationCompact(busConnection.connectedSec || 0) }}</span>
            <span class="pill danger">Disconnected {{ formatDurationCompact(busConnection.disconnectedSec || 0) }}</span>
            <span class="pill neutral">Coverage {{ Number(busConnection.knownCoveragePct || 0) }}%</span>
          </div>
          <div class="bus-track">
            <span
              v-for="segment in busSegments"
              :key="segment.key"
              class="bus-segment"
              :class="segment.className"
              :style="{ left: segment.left, width: segment.width }"
              :title="segment.title"
            />
          </div>
          <div class="bus-scale">
            <span>{{ formatClockLabel(busConnection.windowStartAt) }}</span>
            <span>{{ formatClockLabel(busConnection.windowEndAt) }}</span>
            <span>Now</span>
          </div>
          <p class="bus-note">Green shows time connected to the KNX bus. Red shows downtime inside the selected history window.</p>
        </template>
        <p v-else class="empty-state">Waiting for connection persistence data...</p>
      </section>

      <section ref="flowCardRef" class="card card-flow" :class="{ 'is-fullscreen': isFlowFullscreen }">
        <div class="card-head">
          <h2>Flow Map</h2>
          <div class="card-head-actions">
            <span class="meta-chip">
              Nodes {{ flowGraph.nodes.length }} | Links {{ flowGraph.edges.length }}
            </span>
            <button class="secondary-button" type="button" @click="toggleFlowFullscreen">
              {{ isFlowFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
            </button>
          </div>
        </div>
        <div class="flow-toolbar">
          <label class="flow-field">
            <span>Max nodes</span>
            <input v-model.number="state.flowMaxNodes" type="number" min="4" max="32" step="1">
          </label>
          <label class="flow-field flow-field-search">
            <span>Find GA</span>
            <input v-model="state.flowSearch" type="text" placeholder="Search GA or label">
          </label>
          <label class="flow-field flow-field-select">
            <span>Focus nodes</span>
            <select v-model="state.flowSelectedGa" multiple size="5">
              <option v-for="node in flowSelectableNodes" :key="node.id" :value="node.id">
                {{ `${node.id}${node.subtitle ? ` | ${node.subtitle}` : ''}` }}
              </option>
            </select>
          </label>
          <div class="flow-legend">
            <span><i class="legend-line legend-write" />Write</span>
            <span><i class="legend-line legend-response" />Response</span>
            <span><i class="legend-line legend-read" />Read</span>
            <span><i class="legend-line legend-repeat" />Repeat</span>
            <span><i class="legend-dot legend-anomaly" />Anomaly</span>
            <span><i class="legend-dot legend-external" />External</span>
          </div>
        </div>
        <div class="flow-frame">
          <svg
            v-if="flowGraph.nodes.length"
            class="flow-svg"
            :viewBox="`0 0 ${flowGraph.width} ${flowGraph.height}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker
                v-for="(color, type) in FLOW_EVENT_COLORS"
                :id="`flow-arrow-${type}`"
                :key="type"
                viewBox="0 0 10 8"
                markerWidth="10"
                markerHeight="8"
                refX="8.8"
                refY="4"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L10,4 L0,8 z" :fill="color" />
              </marker>
            </defs>
            <path
              v-for="edge in flowGraph.edges"
              :key="edge.key"
              class="flow-edge"
              :d="edge.d"
              :stroke="edge.color"
              :stroke-width="edge.width"
              :opacity="edge.opacity"
              :marker-end="`url(#${edge.markerId})`"
              :class="{ 'flow-edge-active': edge.active, 'flow-edge-idle': !edge.active }"
            >
              <title>{{ edge.tooltip }}</title>
            </path>
            <g v-for="node in flowGraph.nodes" :key="node.id" class="flow-node" :class="{ 'is-anomaly': node.anomalyCount > 0, 'is-external': !node.inFlow, 'is-idle': node.isIdle }">
              <circle :cx="node.x" :cy="node.y" r="24" />
              <text class="node-label" :x="node.x" :y="node.y + 1">{{ node.shortLabel }}</text>
              <text v-if="node.shortSubtitle" class="node-subtitle" :x="node.x" :y="node.y + 38">{{ node.shortSubtitle }}</text>
              <text v-if="node.shortPayload" class="node-payload" :x="node.x" :y="node.y + 52">{{ node.shortPayload }}</text>
              <text v-if="node.anomalyCount > 0" class="node-badge" :x="node.x" :y="node.y - 30">anomaly x{{ node.anomalyCount }}</text>
              <title>{{ `${node.id}${node.subtitle ? ` | ${node.subtitle}` : ''}${node.payload ? ` | payload: ${node.payload}` : ''}` }}</title>
            </g>
          </svg>
          <p v-else class="empty-state flow-empty">No topology data available yet.</p>
        </div>
        <p class="flow-note">Window {{ flowGraph.telemetryWindowSec || 0 }}s.</p>
      </section>

      <section class="card card-anomalies">
        <div class="card-head">
          <h2>Anomalies</h2>
          <span class="meta-chip">{{ anomalies.length }} recent</span>
        </div>
        <div v-if="anomalies.length" class="anomaly-list">
          <article v-for="entry in anomalies.slice(0, 20)" :key="`${entry.at}-${normalizeAnomalyPayload(entry).ga || ''}`" class="anomaly-card">
            <div class="anomaly-head">
              <strong>{{ normalizeAnomalyPayload(entry).type || 'anomaly' }}</strong>
              <span>{{ normalizeAnomalyPayload(entry).ga || 'no GA' }}</span>
            </div>
            <p class="anomaly-time">{{ entry.at || '' }}</p>
            <pre>{{ JSON.stringify(normalizeAnomalyPayload(entry), null, 2) }}</pre>
          </article>
        </div>
        <p v-else class="empty-state">No anomalies detected right now.</p>
      </section>

      <section class="card card-chat">
        <div class="card-head">
          <h2>Ask</h2>
          <span class="meta-chip">{{ nodeInfo.llmEnabled ? 'LLM enabled' : 'LLM disabled' }}</span>
        </div>
        <div class="preset-row">
          <button
            v-for="preset in PRESET_QUESTIONS"
            :key="preset"
            class="preset-button"
            type="button"
            :disabled="state.asking || !nodeInfo.llmEnabled"
            @click="sendAsk(preset)"
          >
            {{ preset }}
          </button>
        </div>
        <div class="ask-row">
          <input
            v-model="state.chatDraft"
            class="ask-input"
            type="text"
            :disabled="state.asking || !nodeInfo.llmEnabled"
            placeholder="Ask a question about KNX traffic..."
            @keydown.enter.prevent="sendAsk()"
          >
          <button class="primary-button" type="button" :disabled="state.asking || !nodeInfo.llmEnabled" @click="sendAsk()">
            Send
          </button>
        </div>
        <div class="chat-log">
          <article v-for="message in chatMessages" :key="message.key" class="chat-message" :class="`chat-${message.kind}`">
            <div v-if="message.kind === 'assistant'" v-html="message.html" />
            <pre v-else>{{ message.rawText }}</pre>
          </article>
          <article v-if="state.asking" class="chat-message chat-pending">Thinking...</article>
          <p v-if="!chatMessages.length && !state.asking" class="empty-state">Ask a question about KNX traffic. SVG responses are supported here as well.</p>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.page-shell {
  width: min(1660px, calc(100% - 18px));
  margin: 14px auto 28px;
}

.topbar {
  margin-bottom: 18px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.brand {
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brand h1 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1;
}

.subhead {
  max-width: 860px;
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
}

.toolbar,
.statusbar,
.theme-strip,
.checkbox,
.pill-row,
.preset-row,
.ask-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.toolbar {
  margin-bottom: 12px;
}

.theme-button,
.primary-button,
.preset-button,
.primary-link,
.secondary-button {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--text);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 14px;
  transition: 0.18s ease;
}

.theme-button.active,
.primary-button,
.primary-link {
  border-color: transparent;
  background: linear-gradient(135deg, var(--accent), #4bbf77);
  color: #fff;
}

.theme-button:hover,
.preset-button:hover,
.secondary-button:hover {
  background: var(--accent-soft);
  border-color: rgba(122, 104, 216, 0.4);
}

.primary-button:disabled,
.preset-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.node-select {
  min-width: min(360px, 100%);
}

.node-select,
.checkbox,
.summary-pre,
.chat-log,
.anomaly-card pre {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
}

.node-select {
  padding: 10px 12px;
  color: var(--text);
}

.checkbox {
  padding: 10px 12px;
  gap: 8px;
}

.statusbar {
  justify-content: space-between;
}

.status-pill,
.meta-chip,
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
}

.status-pill,
.meta-chip,
.pill.neutral {
  background: var(--accent-soft);
  color: var(--text);
}

.status-pill.error,
.pill.danger {
  background: var(--err-bg);
  color: #a4333a;
}

.pill.success {
  background: var(--ok-bg);
  color: #1b7d36;
}

.status-detail {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}

.card {
  grid-column: span 6;
  min-height: 240px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--card-radius);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow);
}

.card-summary,
.card-bus,
.card-chat,
.card-flow {
  grid-column: span 6;
}

.card-flow,
.card-anomalies {
  grid-column: span 6;
}

.card-flow {
  grid-column: span 12;
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.card-head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.card-head h2 {
  margin: 0;
  font-size: 18px;
}

.summary-pre,
.chat-log {
  margin: 0;
  padding: 14px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: "JetBrains Mono", "SFMono-Regular", monospace;
  font-size: 12px;
  line-height: 1.5;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.metric {
  padding: 12px;
  border-radius: 16px;
  background: var(--panel-soft);
}

.metric span {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.metric strong {
  font-size: 20px;
}

.rank-list,
.event-list,
.anomaly-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rank-row,
.event-row {
  display: grid;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(98, 87, 142, 0.14);
}

.rank-row {
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto;
}

.event-row {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) auto;
}

.rank-title,
.event-name {
  font-weight: 800;
}

.rank-label {
  color: var(--muted);
  font-size: 12px;
}

.event-bar {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(122, 104, 216, 0.12);
}

.event-bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), #4bbf77);
}

.bus-track {
  position: relative;
  height: 18px;
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid rgba(98, 87, 142, 0.2);
  border-radius: 999px;
  background: linear-gradient(180deg, #f6f3ff 0%, #efebfb 100%);
}

.bus-segment {
  position: absolute;
  top: 0;
  bottom: 0;
}

.segment-connected {
  background: linear-gradient(90deg, #4ad06d 0%, #38c45f 100%);
}

.segment-disconnected {
  background: linear-gradient(90deg, #eb6a74 0%, #d94b55 100%);
}

.bus-scale {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.bus-scale span:nth-child(2) {
  text-align: center;
}

.bus-scale span:nth-child(3) {
  text-align: right;
}

.bus-note,
.flow-note,
.empty-state {
  color: var(--muted);
  line-height: 1.5;
}

.flow-toolbar {
  display: grid;
  grid-template-columns: 120px minmax(180px, 1fr) minmax(220px, 1.2fr);
  gap: 12px;
  align-items: start;
}

.flow-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.flow-field input,
.flow-field select {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
  padding: 10px 12px;
}

.flow-field select {
  min-height: 128px;
}

.flow-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: center;
  padding: 10px 0 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.legend-line,
.legend-dot {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}

.legend-line {
  width: 18px;
  border-top: 3px solid currentColor;
}

.legend-write {
  color: #7a68d8;
}

.legend-response {
  color: #46b86d;
}

.legend-read {
  color: #d99a34;
}

.legend-repeat {
  color: #c34747;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-anomaly {
  background: #f08f92;
}

.legend-external {
  background: #f5d9a2;
}

.flow-frame {
  margin-top: 16px;
  overflow: auto;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,245,255,0.96) 100%);
}

.card-flow.is-fullscreen {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 18px;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.98);
  overflow: auto;
}

.card-flow.is-fullscreen .flow-frame {
  height: calc(100vh - 260px);
}

.card-flow.is-fullscreen .flow-svg {
  min-height: calc(100vh - 260px);
}

.flow-svg {
  width: 100%;
  min-width: 1180px;
  min-height: 420px;
  display: block;
}

.flow-empty {
  padding: 24px;
}

.flow-edge {
  fill: none;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.flow-edge-active {
  stroke-dasharray: 10 7;
  animation: graph-flow 1.25s linear infinite;
}

.flow-edge-idle {
  stroke-dasharray: 8 8;
  animation: none;
}

@keyframes graph-flow {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: -34;
  }
}

.flow-node circle {
  fill: #edf9ef;
  stroke: #4caf66;
  stroke-width: 2;
}

.flow-node.is-anomaly circle {
  fill: #fff1f1;
  stroke: #e53935;
}

.flow-node.is-external circle {
  fill: #fff8ea;
  stroke: #c98a1a;
  stroke-dasharray: 4 3;
}

.flow-node.is-idle circle {
  opacity: 0.7;
}

.node-label,
.node-subtitle,
.node-payload,
.node-badge {
  text-anchor: middle;
  dominant-baseline: middle;
}

.node-label {
  fill: #2f7f48;
  font-size: 12px;
  font-weight: 800;
}

.flow-node.is-external .node-label {
  fill: #9a6b24;
}

.node-subtitle {
  fill: #665f86;
  font-size: 10px;
}

.node-payload {
  fill: #645d84;
  font-size: 9px;
  font-family: "JetBrains Mono", "SFMono-Regular", monospace;
}

.node-badge {
  fill: #b3261e;
  font-size: 9px;
  font-weight: 800;
}

.anomaly-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.anomaly-card {
  padding: 14px;
  border-left: 4px solid var(--warn-border);
  border-radius: 18px;
  background: var(--warn-bg);
}

.anomaly-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
}

.anomaly-time {
  margin: 8px 0 10px;
  color: var(--muted);
  font-size: 12px;
}

.anomaly-card pre {
  margin: 0;
  padding: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
}

.chat-log {
  min-height: 280px;
}

.ask-row {
  margin-bottom: 12px;
}

.ask-input {
  flex: 1 1 260px;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
  padding: 11px 14px;
}

.chat-message {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 16px;
}

.chat-message pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.chat-user {
  background: rgba(122, 104, 216, 0.1);
}

.chat-assistant {
  background: rgba(91, 191, 115, 0.12);
}

.chat-error {
  background: var(--err-bg);
}

.chat-pending {
  background: rgba(98, 87, 142, 0.08);
  color: var(--muted);
}

:deep(.chat-svg-wrap) {
  margin-top: 10px;
  overflow: auto;
  border: 1px solid rgba(122, 104, 216, 0.25);
  border-radius: 14px;
  background: #fff;
  padding: 8px;
}

:deep(.chat-svg-wrap svg) {
  width: 100%;
  height: auto;
  display: block;
}

:deep(.chat-table-wrap) {
  overflow: auto;
}

:deep(.chat-table-wrap table),
:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

:deep(th),
:deep(td) {
  padding: 6px 8px;
  border: 1px solid rgba(98, 87, 142, 0.16);
}

@media (max-width: 1100px) {
  .card,
  .card-summary,
  .card-bus,
  .card-chat,
  .card-flow,
  .card-anomalies {
    grid-column: span 12;
  }
}

@media (max-width: 720px) {
  .page-shell {
    width: min(100% - 16px, 1440px);
    margin-top: 8px;
  }

  .topbar,
  .card {
    padding: 14px;
    border-radius: 20px;
  }

  .rank-row,
  .event-row,
  .metric-grid,
  .flow-toolbar {
    grid-template-columns: 1fr;
  }

  .statusbar {
    align-items: flex-start;
  }
}
</style>
