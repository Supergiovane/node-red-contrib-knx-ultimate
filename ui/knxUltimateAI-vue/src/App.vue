<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const storageKey = 'knxUltimateAI:selectedNodeId'
const autoKey = 'knxUltimateAI:autoRefresh'
const tabKey = 'knxUltimateAI:activeTab'
const settingsTabKey = 'knxUltimateAI:settingsTab'
const flowPrefsKey = 'knxUltimateAI:flowPreview'
const voiceKey = 'knxUltimateAI:voiceEnabled'
const sidebarKey = 'knxUltimateAI:sidebarExpanded'
const areaSelectionKeyPrefix = 'knxUltimateAI:selectedAreaId:'
const testAreaSelectionKeyPrefix = 'knxUltimateAI:selectedTestAreaId:'
const PRESET_QUESTIONS = [
  'Summarize the current KNX traffic and highlight the busiest group addresses.',
  'Explain any anomalies you see and suggest what to check first.',
  'Generate an SVG bar chart of Top Group Addresses with counts and title.'
]
const TEST_PROMPT_PRESETS = [
  {
    id: 'lights_on_off',
    title: 'Lights on, then off',
    prompt: 'Turn the lights on, then turn them off, and verify that the related status values are coherent.',
    description: 'Applies to all matching lighting command GA in the selected area.'
  },
  {
    id: 'area_activate',
    title: 'Activate main actuators',
    prompt: 'Activate the main actuators in the area and verify the status feedback to confirm that it follows the commands.',
    description: 'Builds a deterministic active test using the supported command GA in the selected area.'
  },
  {
    id: 'shading_open_close',
    title: 'Open and close shading',
    prompt: 'Open and close the shading actuators in the area, then verify that the status matches the commands sent.',
    description: 'Targets supported shading command GA in the selected area.'
  },
  {
    id: 'hvac_check',
    title: 'HVAC active check',
    prompt: 'Run a full test of the HVAC commands in the area and verify that setpoints and statuses are coherent.',
    description: 'Targets supported HVAC command GA in the selected area.'
  }
]
const AREA_GA_ROLE_OPTIONS = [
  { value: 'command', label: 'Command' },
  { value: 'status', label: 'Status' },
  { value: 'neutral', label: "Don't use in tests" }
]
const FLOW_EVENT_COLORS = {
  write: '#ff9800',
  response: '#46b86d',
  read: '#d99a34',
  repeat: '#c34747',
  other: '#8d8578'
}
const KNX_AI_VUE_DOCS_URL = 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/knxUltimateAI-vue'

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
  activeTab: loadString(tabKey, 'overview'),
  settingsTab: loadString(settingsTabKey, 'config'),
  autoRefresh: loadBoolean(autoKey, true),
  voiceEnabled: loadBoolean(voiceKey, true),
  flowMaxNodes: loadFlowPrefs().maxNodes,
  flowSelectedGa: loadFlowPrefs().selectedGa,
  flowShowUniversalNodes: loadFlowPrefs().showUniversalNodes,
  flowSearch: '',
  areaSearch: '',
  areaSearchOpen: false,
  areaSelectedId: '',
  testAreaSelectedId: '',
  areaDraftName: '',
  areaDraftDescription: '',
  areaDraftTags: '',
  areaDraftGaList: [],
  areaDraftId: '',
  areaDraftIsNew: false,
  areaLlmPrompt: '',
  areaLlmBusy: false,
  areaLlmError: '',
  areaLlmRegenerating: false,
  gaCatalog: [],
  gaCatalogSearch: '',
  gaCatalogLoading: false,
  areaGaRoleSavingGa: '',
  areaSaving: false,
  profileSelectedId: '',
  profileDraftMode: false,
  profileDraftId: '',
  profileDraftName: '',
  profileDraftDescription: '',
  profileDraftTargetTags: '',
  profileDraftMinActivityPct: 20,
  profileDraftMaxSilentPct: 60,
  profileDraftMaxAnomalies: 2,
  profileSaving: false,
  profileRunning: false,
  actuatorPresetSelectedId: '',
  actuatorDraftMode: false,
  actuatorDraftId: '',
  actuatorDraftName: '',
  actuatorDraftDescription: '',
  actuatorDraftCommandGA: '',
  actuatorDraftCommandDPT: '',
  actuatorDraftCommandPayload: '',
  actuatorDraftStatusGA: '',
  actuatorDraftStatusDPT: '',
  actuatorDraftStatusWriteTimeoutMs: 5000,
  actuatorDraftStatusResponseTimeoutMs: 5000,
  actuatorSaving: false,
  actuatorRunning: false,
  testPlanSelectedId: '',
  testPlanSearch: '',
  testPlanSearchOpen: false,
  selectedTestResultId: '',
  liveTestResultId: '',
  testResultsMenuOpen: true,
  testResultFocusMode: false,
  deletingTestResultId: '',
  testPlanPrompt: '',
  testPlanDraft: null,
  testPlanCatalog: null,
  testPlanCatalogLoading: false,
  testPlanCatalogError: '',
  testPlanGenerating: false,
  testPlanSaving: false,
  testPlanDeleting: false,
  testPlanRunning: false,
  testPlanGeneration: null,
  testPlanGenerationError: '',
  testPlanRunConfirmOpen: false,
  testPlanRunMode: 'single',
  testPlanRunningStepId: '',
  testPlanRepeatForever: false,
  testPlanRepeatStopRequested: false,
  testPlanDraftBaseline: '',
  testPlanUnsavedConfirmOpen: false,
  areaUnsavedConfirmOpen: false,
  testPlanPendingActionLabel: '',
  draggedTestPlanStepId: '',
  dragOverTestPlanStepId: '',
  showAiPlanner: true,
  testTemplateBuilderFocus: false,
  showAiAreaBuilder: false,
  areaBuilderFocus: false,
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
const configImportRef = ref(null)
const testPlanReportRef = ref(null)
const desktopSidebarExpanded = ref(loadBoolean(sidebarKey, true))
const mobileSidebarOpen = ref(false)
const isCompactViewport = ref(false)
const isSidebarExpanded = computed(() => (isCompactViewport.value ? mobileSidebarOpen.value : desktopSidebarExpanded.value))
let activeStepAudio = null
let testPlanBaselineData = null
let pendingTestPlanAction = null

function stopActiveStepAudio () {
  if (!activeStepAudio) return
  try {
    activeStepAudio.pause()
    activeStepAudio.src = ''
  } catch (error) {}
  activeStepAudio = null
}

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
    if (!window.localStorage) return { maxNodes: 14, selectedGa: [], showUniversalNodes: false }
    const raw = window.localStorage.getItem(flowPrefsKey)
    if (!raw) return { maxNodes: 14, selectedGa: [], showUniversalNodes: false }
    const parsed = JSON.parse(raw)
    const maxNodes = Math.max(4, Math.min(32, Number(parsed && parsed.maxNodes) || 14))
    const selectedGa = Array.isArray(parsed && parsed.selectedGa)
      ? Array.from(new Set(parsed.selectedGa.map(item => String(item || '').trim()).filter(Boolean))).slice(0, 80)
      : []
    const showUniversalNodes = parsed && parsed.showUniversalNodes === true
    return { maxNodes, selectedGa, showUniversalNodes }
  } catch (error) {
    return { maxNodes: 14, selectedGa: [], showUniversalNodes: false }
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

function syncViewportMode () {
  try {
    isCompactViewport.value = window.matchMedia('(max-width: 1100px)').matches
  } catch (error) {
    isCompactViewport.value = window.innerWidth <= 1100
  }
  if (!isCompactViewport.value) mobileSidebarOpen.value = false
}

function toggleSidebar () {
  if (isCompactViewport.value) {
    mobileSidebarOpen.value = mobileSidebarOpen.value !== true
    return
  }
  desktopSidebarExpanded.value = desktopSidebarExpanded.value !== true
}

function closeSidebarOnMobile () {
  if (isCompactViewport.value) mobileSidebarOpen.value = false
}

function onGlobalKeydown (event) {
  if (!event || event.key !== 'Escape') return
  closeSidebarOnMobile()
}

function areaSelectionKey (nodeId) {
  const id = String(nodeId || '').trim()
  return id ? `${areaSelectionKeyPrefix}${id}` : ''
}

function testAreaSelectionKey (nodeId) {
  const id = String(nodeId || '').trim()
  return id ? `${testAreaSelectionKeyPrefix}${id}` : ''
}

function loadSelectedAreaIdForNode (nodeId) {
  const key = areaSelectionKey(nodeId)
  return key ? loadString(key, '') : ''
}

function saveSelectedAreaIdForNode (nodeId, areaId) {
  const key = areaSelectionKey(nodeId)
  if (!key) return
  const value = String(areaId || '').trim()
  if (!value) return
  saveString(key, value)
}

function loadSelectedTestAreaIdForNode (nodeId) {
  const key = testAreaSelectionKey(nodeId)
  return key ? loadString(key, '') : ''
}

function saveSelectedTestAreaIdForNode (nodeId, areaId) {
  const key = testAreaSelectionKey(nodeId)
  if (!key) return
  const value = String(areaId || '').trim()
  if (!value) return
  saveString(key, value)
}

function restoreSelectedAreaForCurrentNode () {
  const storedAreaId = loadSelectedAreaIdForNode(state.selectedNodeId)
  if (!storedAreaId) return false
  if (!suggestedAreas.value.find(area => area.id === storedAreaId)) return false
  if (state.areaSelectedId === storedAreaId) return true
  state.areaSelectedId = storedAreaId
  return true
}

function restoreSelectedTestAreaForCurrentNode () {
  const storedAreaId = loadSelectedTestAreaIdForNode(state.selectedNodeId)
  if (!storedAreaId) return false
  if (!suggestedAreas.value.find(area => area.id === storedAreaId)) return false
  if (state.testAreaSelectedId === storedAreaId) return true
  state.testAreaSelectedId = storedAreaId
  return true
}

function saveFlowPrefs () {
  try {
    if (!window.localStorage) return
    window.localStorage.setItem(flowPrefsKey, JSON.stringify({
      maxNodes: Math.max(4, Math.min(32, Number(state.flowMaxNodes) || 14)),
      selectedGa: Array.from(new Set((state.flowSelectedGa || []).map(item => String(item || '').trim()).filter(Boolean))).slice(0, 80),
      showUniversalNodes: state.flowShowUniversalNodes === true
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

async function requestAudioBlob (url, options) {
  const response = await fetch(url, Object.assign({ credentials: 'same-origin', cache: 'no-store' }, options || {}))
  if (!response.ok) {
    const text = await response.text()
    let errorMessage = text || `HTTP ${response.status}`
    try {
      const parsed = text ? JSON.parse(text) : {}
      errorMessage = parsed && parsed.error ? parsed.error : errorMessage
    } catch (error) {}
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Authentication required or insufficient permissions (${response.status}).`)
    }
    throw new Error(errorMessage)
  }
  return await response.blob()
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

function cloneJson (value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    return fallback
  }
}

function normalizeStringListForSnapshot (list = []) {
  return Array.from(new Set((Array.isArray(list) ? list : []).map(item => String(item || '').trim()).filter(Boolean))).sort()
}

function parseAreaTagsInput (value = '') {
  return normalizeStringListForSnapshot(String(value || '').split(','))
}

function buildAreaDraftSnapshot (data = {}) {
  return JSON.stringify({
    isNew: data.isNew === true,
    areaId: String(data.areaId || '').trim(),
    name: String(data.name || '').trim(),
    description: String(data.description || '').trim(),
    tags: normalizeStringListForSnapshot(data.tags || []),
    gaList: normalizeStringListForSnapshot(data.gaList || []),
    llmPrompt: String(data.llmPrompt || '').trim()
  })
}

function buildTestPlanBaselineSnapshot (data = {}) {
  return JSON.stringify({
    prompt: String(data.prompt || ''),
    draft: cloneJson(data.draft, null)
  })
}

function captureCurrentTestPlanBaselineData () {
  return {
    selectedId: String(state.testPlanSelectedId || ''),
    prompt: String(state.testPlanPrompt || ''),
    draft: cloneJson(state.testPlanDraft, null),
    generation: cloneJson(state.testPlanGeneration, null),
    showAiPlanner: state.showAiPlanner === true
  }
}

function setCurrentTestPlanBaseline () {
  testPlanBaselineData = captureCurrentTestPlanBaselineData()
  state.testPlanDraftBaseline = buildTestPlanBaselineSnapshot(testPlanBaselineData)
}

function restoreCurrentTestPlanBaseline () {
  const source = cloneJson(testPlanBaselineData, null)
  if (!source) {
    state.testPlanSelectedId = ''
    state.testPlanPrompt = ''
    state.testPlanDraft = null
    state.testPlanGeneration = null
    state.testPlanRunConfirmOpen = false
    state.showAiPlanner = true
    return
  }
  state.testPlanSelectedId = String(source.selectedId || '')
  state.testPlanPrompt = String(source.prompt || '')
  state.testPlanDraft = cloneJson(source.draft, null)
  state.testPlanGeneration = cloneJson(source.generation, null)
  state.testPlanRunConfirmOpen = false
  state.showAiPlanner = source.showAiPlanner !== false
  if (source.draft && source.draft.areaId && suggestedAreas.value.find(area => area.id === source.draft.areaId)) {
    state.areaSelectedId = source.draft.areaId
  }
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

function isUniversalFlowNode (node) {
  return !!(node && node.kind === 'node' && node.listenAllGA)
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
        score: Number(seed.score || 0),
        listenAllGA: seed.listenAllGA === true
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
      score: Number(node && node.score ? node.score : 0),
      listenAllGA: node && node.listenAllGA === true
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
  let allNodes = Array.isArray(source && source.nodes) ? source.nodes.slice() : []
  const allEdges = Array.isArray(source && source.edges) ? source.edges.slice() : []
  if (state.flowShowUniversalNodes !== true) {
    allNodes = allNodes.filter(node => !isUniversalFlowNode(node))
  }
  const allowedIds = new Set(allNodes.map(node => node.id))
  const selectedSet = new Set(
    (state.flowSelectedGa || [])
      .map(item => String(item || '').trim())
      .filter(item => item && allowedIds.has(item))
  )
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
const areasState = computed(() => state.stateData && state.stateData.areas ? state.stateData.areas : { suggested: [], totals: {} })
const suggestedAreas = computed(() => Array.isArray(areasState.value && areasState.value.suggested) ? areasState.value.suggested : [])
const areaTotals = computed(() => areasState.value && areasState.value.totals ? areasState.value.totals : {})
const profiles = computed(() => Array.isArray(state.stateData && state.stateData.profiles) ? state.stateData.profiles : [])
const profileReport = computed(() => state.stateData && state.stateData.profileReport ? state.stateData.profileReport : null)
const actuatorTests = computed(() => Array.isArray(state.stateData && state.stateData.actuatorTests) ? state.stateData.actuatorTests : [])
const actuatorTestReport = computed(() => state.stateData && state.stateData.actuatorTestReport ? state.stateData.actuatorTestReport : null)
const testPlans = computed(() => Array.isArray(state.stateData && state.stateData.testPlans) ? state.stateData.testPlans : [])
const filteredTestPlans = computed(() => {
  const search = String(state.testPlanSearch || '').trim().toLowerCase()
  return testPlans.value.filter((plan) => {
    if (!search) return true
    const haystack = [
      plan.name,
      plan.description,
      plan.areaName,
      plan.areaId
    ].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(search)
  })
})
const testPlanReport = computed(() => state.stateData && state.stateData.testPlanReport ? state.stateData.testPlanReport : null)
const persistedTestResults = computed(() => Array.isArray(state.stateData && state.stateData.testResults) ? state.stateData.testResults : [])
const liveTestResult = computed(() => {
  if (!state.liveTestResultId || !testPlanReport.value || testPlanReport.value.id !== state.liveTestResultId) return null
  return Object.assign({}, testPlanReport.value, { live: state.testPlanRunning === true })
})
const sidebarTestResults = computed(() => {
  const out = []
  const seen = new Set()
  const pushResult = (report, live = false) => {
    if (!report || typeof report !== 'object' || !report.id) return
    const id = String(report.id)
    if (seen.has(id)) return
    seen.add(id)
    out.push(Object.assign({}, report, { live }))
  }
  pushResult(liveTestResult.value, true)
  persistedTestResults.value.forEach(report => pushResult(report, false))
  return out
})
const selectedTestResult = computed(() => {
  if (state.selectedTestResultId) {
    const found = sidebarTestResults.value.find(report => report && report.id === state.selectedTestResultId)
    if (found) return found
  }
  return liveTestResult.value || persistedTestResults.value[0] || null
})
const isViewingTestResultOnly = computed(() => {
  return state.activeTab === 'tests' && state.testResultFocusMode === true && !!selectedTestResult.value
})
const filteredAreas = computed(() => {
  const search = String(state.areaSearch || '').trim().toLowerCase()
  return suggestedAreas.value.filter((area) => {
    if (!search) return true
    const haystack = [
      area.path,
      area.name,
      area.parentName,
      ...(Array.isArray(area.tags) ? area.tags : []),
      ...(Array.isArray(area.sampleLabels) ? area.sampleLabels : [])
    ].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(search)
  })
})
const selectedArea = computed(() => {
  if (state.areaDraftIsNew === true && !String(state.areaSelectedId || '').trim()) return null
  if (state.areaSelectedId) {
    const found = suggestedAreas.value.find(area => area.id === state.areaSelectedId)
    if (found) return found
  }
  return null
})
const selectedTestArea = computed(() => {
  if (state.testAreaSelectedId) {
    const found = suggestedAreas.value.find(area => area.id === state.testAreaSelectedId)
    if (found) return found
  }
  return suggestedAreas.value[0] || null
})
const plannerCatalogArea = computed(() => {
  const draftAreaId = String(state.testPlanDraft && state.testPlanDraft.areaId ? state.testPlanDraft.areaId : '').trim()
  if (draftAreaId) {
    const found = suggestedAreas.value.find(area => area.id === draftAreaId)
    if (found) return found
  }
  return selectedTestArea.value
})
const filteredGaCatalog = computed(() => {
  const search = String(state.gaCatalogSearch || '').trim().toLowerCase()
  const selectedSet = new Set((state.areaDraftGaList || []).map(item => String(item || '').trim()).filter(Boolean))
  return (Array.isArray(state.gaCatalog) ? state.gaCatalog : [])
    .filter((item) => {
      if (!item || !item.ga || selectedSet.has(item.ga)) return false
      if (!search) return true
      const haystack = [
        item.ga,
        item.label,
        item.hierarchyPath,
        ...(Array.isArray(item.tags) ? item.tags : [])
      ].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(search)
    })
    .slice(0, 80)
})
const areaDraftGaDetails = computed(() => {
  const byGa = new Map((Array.isArray(state.gaCatalog) ? state.gaCatalog : []).map(item => [String(item && item.ga ? item.ga : '').trim(), item]))
  return (state.areaDraftGaList || []).map((ga) => {
    const item = byGa.get(String(ga || '').trim())
    return item || { ga: String(ga || '').trim(), label: '', dpt: '', hierarchyPath: '', tags: [] }
  })
})
const plannerCommandOptions = computed(() => Array.isArray(state.testPlanCatalog && state.testPlanCatalog.commandSignals) ? state.testPlanCatalog.commandSignals : [])
const plannerStatusOptions = computed(() => Array.isArray(state.testPlanCatalog && state.testPlanCatalog.statusSignals) ? state.testPlanCatalog.statusSignals : [])
const selectedProfile = computed(() => {
  if (state.profileDraftMode === true) return null
  if (state.profileSelectedId) {
    const found = profiles.value.find(profile => profile.id === state.profileSelectedId)
    if (found) return found
  }
  return profiles.value[0] || null
})
const selectedActuatorPreset = computed(() => {
  if (state.actuatorDraftMode === true) return null
  if (state.actuatorPresetSelectedId) {
    const found = actuatorTests.value.find(preset => preset.id === state.actuatorPresetSelectedId)
    if (found) return found
  }
  return actuatorTests.value[0] || null
})
const selectedTestPlan = computed(() => {
  if (!state.testPlanSelectedId) return null
  return testPlans.value.find(plan => plan.id === state.testPlanSelectedId) || null
})
const currentRunningStep = computed(() => {
  if (!state.testPlanRunningStepId || !state.testPlanDraft || !Array.isArray(state.testPlanDraft.steps)) return null
  return state.testPlanDraft.steps.find(step => String(step && step.id ? step.id : '') === state.testPlanRunningStepId) || null
})
const hasDraftSteps = computed(() => {
  return !!(state.testPlanDraft && Array.isArray(state.testPlanDraft.steps) && state.testPlanDraft.steps.length > 0)
})
const showAiPlannerSection = computed(() => state.showAiPlanner === true)
const showAiAreaBuilderSection = computed(() => state.showAiAreaBuilder === true)
const hasUnsavedTestPlanChanges = computed(() => {
  if (!state.testPlanDraft) return false
  return buildTestPlanBaselineSnapshot({
    prompt: state.testPlanPrompt,
    draft: state.testPlanDraft
  }) !== state.testPlanDraftBaseline
})
const hasUnsavedAreaChanges = computed(() => {
  const hasEditor = state.areaDraftIsNew === true || !!selectedArea.value
  if (!hasEditor) return false
  const currentSnapshot = buildAreaDraftSnapshot({
    isNew: state.areaDraftIsNew === true,
    areaId: String(state.areaDraftId || state.areaSelectedId || '').trim(),
    name: state.areaDraftName,
    description: state.areaDraftDescription,
    tags: parseAreaTagsInput(state.areaDraftTags),
    gaList: state.areaDraftGaList || [],
    llmPrompt: state.areaLlmPrompt
  })
  if (state.areaDraftIsNew === true) {
    const baselineNewSnapshot = buildAreaDraftSnapshot({
      isNew: true,
      areaId: '',
      name: 'New Area',
      description: '',
      tags: [],
      gaList: [],
      llmPrompt: ''
    })
    return currentSnapshot !== baselineNewSnapshot
  }
  const area = selectedArea.value
  if (!area) return false
  const baselineExistingSnapshot = buildAreaDraftSnapshot({
    isNew: false,
    areaId: String(area.id || '').trim(),
    name: String(area.name || ''),
    description: String(area.customDescription || ''),
    tags: Array.isArray(area.tags) ? area.tags : [],
    gaList: Array.isArray(area.gaList) ? area.gaList : [],
    llmPrompt: ''
  })
  return currentSnapshot !== baselineExistingSnapshot
})
const anomalies = computed(() => Array.isArray(state.stateData && state.stateData.anomalies) ? state.stateData.anomalies.slice().reverse() : [])
const topGroups = computed(() => {
  const rows = Array.isArray(summary.value.topGAs) ? summary.value.topGAs : []
  const gaLabels = summary.value && typeof summary.value.gaLabels === 'object' ? summary.value.gaLabels : {}
  return rows.slice(0, 10).map((entry) => {
    const item = entry && typeof entry === 'object' ? entry : {}
    const ga = String(item.ga || '').trim()
    const labelFromEntry = String(item.label || '').trim()
    const labelFromSummary = ga ? String(gaLabels[ga] || '').trim() : ''
    return Object.assign({}, item, {
      ga,
      label: labelFromEntry || labelFromSummary
    })
  })
})
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
    .filter(node => state.flowShowUniversalNodes === true || !isUniversalFlowNode(node))
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
  state.areaSelectedId = ''
  state.testAreaSelectedId = loadSelectedTestAreaIdForNode(value || '')
})

watch(() => state.autoRefresh, (value) => {
  saveBoolean(autoKey, value)
})

watch(() => state.voiceEnabled, (value) => {
  saveBoolean(voiceKey, value)
  if (value !== true) stopActiveStepAudio()
})

watch(desktopSidebarExpanded, (value) => {
  saveBoolean(sidebarKey, value)
})

watch(() => state.activeTab, (value) => {
  saveString(tabKey, value || 'overview')
})

watch(() => state.settingsTab, (value) => {
  saveString(settingsTabKey, value || 'config')
})

watch(() => state.flowMaxNodes, (value) => {
  state.flowMaxNodes = Math.max(4, Math.min(32, Number(value) || 14))
  saveFlowPrefs()
})
watch(() => (state.flowSelectedGa || []).join('|'), () => {
  saveFlowPrefs()
})
watch(() => state.flowShowUniversalNodes, (value) => {
  if (value !== true) {
    state.flowSelectedGa = (state.flowSelectedGa || []).filter((id) => {
      const node = flowSource.value.nodes.find(item => item.id === id)
      return !isUniversalFlowNode(node)
    })
  }
  saveFlowPrefs()
})

watch(() => suggestedAreas.value.map(area => area.id).join('|'), () => {
  if (!suggestedAreas.value.length) {
    state.areaSelectedId = ''
    state.testAreaSelectedId = ''
    if (state.activeTab === 'tests') state.activeTab = 'areas'
    return
  }
  if (state.areaDraftIsNew === true && !String(state.areaSelectedId || '').trim()) {
    const currentTestAreaId = String(state.testAreaSelectedId || '').trim()
    if (restoreSelectedTestAreaForCurrentNode()) return
    if (!currentTestAreaId || !suggestedAreas.value.find(area => area.id === currentTestAreaId)) {
      state.testAreaSelectedId = suggestedAreas.value[0].id
    }
    return
  }
  const currentAreaId = String(state.areaSelectedId || '').trim()
  if (currentAreaId && !suggestedAreas.value.find(area => area.id === currentAreaId)) {
    state.areaSelectedId = ''
  }
  const currentTestAreaId = String(state.testAreaSelectedId || '').trim()
  if (restoreSelectedTestAreaForCurrentNode()) {
    return
  }
  if (!currentTestAreaId || !suggestedAreas.value.find(area => area.id === currentTestAreaId)) {
    state.testAreaSelectedId = suggestedAreas.value[0].id
  }
})

watch(() => state.testAreaSelectedId, (value) => {
  if (!state.selectedNodeId) return
  saveSelectedTestAreaIdForNode(state.selectedNodeId, value || '')
})

watch(() => selectedArea.value ? JSON.stringify({
  id: selectedArea.value.id,
  name: selectedArea.value.name,
  customDescription: selectedArea.value.customDescription || '',
  tags: selectedArea.value.tags || []
}) : '', () => {
  if (state.areaDraftIsNew === true && !String(state.areaSelectedId || '').trim()) return
  const area = selectedArea.value
  if (!area) {
    state.areaDraftId = ''
    state.areaDraftName = ''
    state.areaDraftDescription = ''
    state.areaDraftTags = ''
    state.areaDraftGaList = []
    state.areaLlmPrompt = ''
    state.areaLlmError = ''
    state.areaDraftIsNew = false
    return
  }
  state.areaDraftId = String(area.id || '')
  state.areaDraftName = String(area.name || '')
  state.areaDraftDescription = String(area.customDescription || '')
  state.areaDraftTags = Array.isArray(area.tags) ? area.tags.join(', ') : ''
  state.areaDraftGaList = Array.isArray(area.gaList) ? area.gaList.slice() : []
  state.areaLlmPrompt = ''
  state.areaLlmError = ''
  state.areaDraftIsNew = false
})

watch(() => plannerCatalogArea.value ? plannerCatalogArea.value.id : '', async (areaId, previousAreaId) => {
  if (!areaId || !state.selectedNodeId) {
    state.testPlanCatalog = null
    state.testPlanCatalogError = ''
    return
  }
  if (previousAreaId && areaId !== previousAreaId) {
    state.testPlanRunConfirmOpen = false
    if (state.testPlanDraft && !state.testPlanSelectedId) {
      state.testPlanDraft.areaId = String(areaId || '')
      state.testPlanDraft.areaName = plannerCatalogArea.value
        ? String(plannerCatalogArea.value.path || plannerCatalogArea.value.name || '')
        : ''
    }
  }
  await fetchAreaSignalCatalog()
})

watch(() => profiles.value.map(profile => profile.id).join('|'), () => {
  if (!profiles.value.length) {
    state.profileSelectedId = ''
    return
  }
  if (state.profileDraftMode === true) return
  if (!state.profileSelectedId || !profiles.value.find(profile => profile.id === state.profileSelectedId)) {
    state.profileSelectedId = profiles.value[0].id
  }
})

watch(() => selectedProfile.value ? JSON.stringify({
  id: selectedProfile.value.id,
  name: selectedProfile.value.name,
  description: selectedProfile.value.description,
  targetTags: selectedProfile.value.targetTags || [],
  minActivityPct: selectedProfile.value.minActivityPct,
  maxSilentPct: selectedProfile.value.maxSilentPct,
  maxAnomalies: selectedProfile.value.maxAnomalies,
  builtIn: selectedProfile.value.builtIn === true
}) : '', () => {
  const profile = selectedProfile.value
  if (!profile) {
    state.profileDraftId = ''
    state.profileDraftName = ''
    state.profileDraftDescription = ''
    state.profileDraftTargetTags = ''
    state.profileDraftMinActivityPct = 20
    state.profileDraftMaxSilentPct = 60
    state.profileDraftMaxAnomalies = 2
    return
  }
  state.profileDraftId = String(profile.id || '')
  state.profileDraftName = String(profile.name || '')
  state.profileDraftDescription = String(profile.description || '')
  state.profileDraftTargetTags = Array.isArray(profile.targetTags) ? profile.targetTags.join(', ') : ''
  state.profileDraftMinActivityPct = Number(profile.minActivityPct || 20)
  state.profileDraftMaxSilentPct = Number(profile.maxSilentPct || 60)
  state.profileDraftMaxAnomalies = Number(profile.maxAnomalies || 2)
})

watch(() => actuatorTests.value.map(preset => preset.id).join('|'), () => {
  if (!actuatorTests.value.length) {
    state.actuatorPresetSelectedId = ''
    return
  }
  if (state.actuatorDraftMode === true) return
  if (!state.actuatorPresetSelectedId || !actuatorTests.value.find(preset => preset.id === state.actuatorPresetSelectedId)) {
    state.actuatorPresetSelectedId = actuatorTests.value[0].id
  }
})

watch(() => selectedActuatorPreset.value ? JSON.stringify({
  id: selectedActuatorPreset.value.id,
  name: selectedActuatorPreset.value.name,
  description: selectedActuatorPreset.value.description,
  commandGA: selectedActuatorPreset.value.commandGA,
  commandDPT: selectedActuatorPreset.value.commandDPT,
  commandPayload: selectedActuatorPreset.value.commandPayload,
  statusGA: selectedActuatorPreset.value.statusGA,
  statusDPT: selectedActuatorPreset.value.statusDPT,
  statusWriteTimeoutMs: selectedActuatorPreset.value.statusWriteTimeoutMs,
  statusResponseTimeoutMs: selectedActuatorPreset.value.statusResponseTimeoutMs
}) : '', () => {
  const preset = selectedActuatorPreset.value
  if (!preset) {
    state.actuatorDraftId = ''
    state.actuatorDraftName = ''
    state.actuatorDraftDescription = ''
    state.actuatorDraftCommandGA = ''
    state.actuatorDraftCommandDPT = ''
    state.actuatorDraftCommandPayload = ''
    state.actuatorDraftStatusGA = ''
    state.actuatorDraftStatusDPT = ''
    state.actuatorDraftStatusWriteTimeoutMs = 5000
    state.actuatorDraftStatusResponseTimeoutMs = 5000
    return
  }
  state.actuatorDraftId = String(preset.id || '')
  state.actuatorDraftName = String(preset.name || '')
  state.actuatorDraftDescription = String(preset.description || '')
  state.actuatorDraftCommandGA = String(preset.commandGA || '')
  state.actuatorDraftCommandDPT = String(preset.commandDPT || '')
  state.actuatorDraftCommandPayload = String(preset.commandPayload || '')
  state.actuatorDraftStatusGA = String(preset.statusGA || '')
  state.actuatorDraftStatusDPT = String(preset.statusDPT || '')
  state.actuatorDraftStatusWriteTimeoutMs = Number(preset.statusWriteTimeoutMs || 5000)
  state.actuatorDraftStatusResponseTimeoutMs = Number(preset.statusResponseTimeoutMs || 5000)
})

watch(() => testPlans.value.map(plan => plan.id).join('|'), () => {
  if (!testPlans.value.length) {
    state.testPlanSelectedId = ''
    return
  }
  if (state.testPlanSelectedId && !testPlans.value.find(plan => plan.id === state.testPlanSelectedId)) {
    state.testPlanSelectedId = ''
  }
})

watch(() => sidebarTestResults.value.map(report => report.id).join('|'), () => {
  if (!sidebarTestResults.value.length) {
    state.selectedTestResultId = ''
    return
  }
  if (!state.selectedTestResultId || !sidebarTestResults.value.find(report => report.id === state.selectedTestResultId)) {
    state.selectedTestResultId = String(sidebarTestResults.value[0].id || '')
  }
  if (state.liveTestResultId && persistedTestResults.value.some(report => String(report && report.id ? report.id : '') === state.liveTestResultId) && state.testPlanRunning !== true) {
    state.liveTestResultId = ''
  }
})

watch(() => `${state.selectedTestResultId}|${state.activeTab}`, () => {
  if (state.activeTab !== 'results' || !state.selectedTestResultId) return
  requestAnimationFrame(() => {
    const activeButton = document.querySelector('.results-page-list .area-list-item.active')
    if (activeButton && typeof activeButton.scrollIntoView === 'function') {
      activeButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
})

function appendChat (kind, text) {
  state.chatMessages.push({ kind, text })
}

function clearChat () {
  state.chatMessages = []
}

function buildTestPlanMetrics (stepResults, totalStepsOverride = null) {
  const results = Array.isArray(stepResults) ? stepResults : []
  const totalSteps = Math.max(results.length, Number(totalStepsOverride || 0))
  return {
    totalSteps,
    pass: results.filter(item => item && item.status === 'pass').length,
    warn: results.filter(item => item && item.status === 'warn').length,
    fail: results.filter(item => item && item.status === 'fail').length
  }
}

function buildTestPlanSuggestions (metrics) {
  const suggestions = []
  if (Number(metrics && metrics.fail) > 0) suggestions.push('At least one feedback object returned an incoherent value. Check the actuator/status pairing in ETS first.')
  if (Number(metrics && metrics.warn) > 0) suggestions.push('Some steps did not receive feedback in time. Verify the status group address and the actuator programming.')
  if (!suggestions.length) suggestions.push('The selected active test completed with coherent feedback on all verified steps.')
  return suggestions
}

function buildClientTestPlanReport ({ plan, area, stepResults, reportId = '' }) {
  const metrics = buildTestPlanMetrics(stepResults, Array.isArray(plan && plan.steps) ? plan.steps.length : 0)
  const overallStatus = metrics.fail > 0 ? 'fail' : (metrics.warn > 0 ? 'warn' : 'pass')
  return {
    id: String(reportId || `${plan.id || 'plan'}:${Date.now()}`),
    generatedAt: new Date().toISOString(),
    mode: 'ai_test_plan',
    overallStatus,
    name: plan.name,
    description: plan.description,
    prompt: plan.prompt,
    area,
    metrics,
    steps: stepResults,
    suggestions: buildTestPlanSuggestions(metrics)
  }
}

function testResultDisplayName (report) {
  if (!report || typeof report !== 'object') return 'Test result'
  return String(report.name || report.profile?.name || 'Test result')
}

function testResultAreaText (report) {
  if (!report || typeof report !== 'object') return ''
  return String(report.area?.path || report.area?.name || report.area?.id || '')
}

function testResultModeLabel (report) {
  const mode = String(report && report.mode ? report.mode : '').trim().toLowerCase()
  if (mode === 'ai_test_plan') return 'Test Plan'
  if (mode === 'active_test') return 'Actuator'
  if (mode === 'read_only') return 'Read-only'
  return mode || 'Test'
}

function testResultMetricCards (report) {
  const metrics = report && report.metrics && typeof report.metrics === 'object' ? report.metrics : {}
  if (String(report && report.mode ? report.mode : '') === 'read_only') {
    return [
      { label: 'Total GA', value: Number(metrics.totalGAs || 0) },
      { label: 'Active GA', value: Number(metrics.activeGaCount || 0) },
      { label: 'Silent GA', value: Number(metrics.silentGaCount || 0) },
      { label: 'Anomalies', value: Number(metrics.anomalyCount || 0) }
    ]
  }
  if (String(report && report.mode ? report.mode : '') === 'active_test') {
    return [
      { label: 'Command GA', value: report && report.command && report.command.ga ? report.command.ga : 'n/a' },
      { label: 'Status GA', value: report && (report.statusResponse?.ga || report.statusWrite?.ga || report.statusRead?.ga) ? (report.statusResponse?.ga || report.statusWrite?.ga || report.statusRead?.ga) : 'n/a' },
      { label: 'Status', value: report && report.overallStatus ? report.overallStatus : 'n/a' },
      { label: 'Generated', value: formatDateTime(report && report.generatedAt ? report.generatedAt : '') || 'n/a' }
    ]
  }
  return [
    { label: 'Total Steps', value: Number(metrics.totalSteps || 0) },
    { label: 'Pass', value: Number(metrics.pass || 0) },
    { label: 'Warn', value: Number(metrics.warn || 0) },
    { label: 'Fail', value: Number(metrics.fail || 0) }
  ]
}

function stringifyResultDetailValue (value) {
  if (value === undefined || value === null || value === '') return 'n/a'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value)
  } catch (error) {
    return String(value)
  }
}

function displayPayloadLabelForDpt (value, dpt, fallback = 'n/a') {
  const key = String(dpt || '').trim()
  const raw = value === undefined || value === null ? '' : String(value)
  if (!key) return raw || fallback
  const normalized = normalizePayloadForDptInput(raw, key)
  const option = dptValueOptions(key).find(item => String(item.value) === String(normalized))
  if (option && option.label) return option.label
  return raw || fallback
}

function formatFeedbackCheckResult (check) {
  if (!check || typeof check !== 'object') return 'n/a'
  const ga = check.ga || 'n/a'
  if (check.ok === true) {
    const payload = check.payloadLabel || stringifyResultDetailValue(check.payload)
    const status = check.coherent === false ? 'mismatch' : 'ok'
    return `${ga} / ${payload} / ${status}`
  }
  return `${ga} / ${check.error || 'timeout'}`
}

function formatResultMoment (value) {
  return formatDateTime(value || '') || 'n/a'
}

function sanitizeFileName (value, fallback = 'report') {
  const normalized = String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return normalized || fallback
}

function buildFeedbackResultGroups ({ command, statusWrite, statusResponse, statusRead, expectedPayloadLabel, expectedPayload }) {
  const resolvedResponse = statusResponse || statusRead
  return [
    {
      title: 'Command',
      items: [
        { label: 'Command', value: `${command?.ga || 'n/a'} / ${command?.payloadLabel || stringifyResultDetailValue(command?.payload)}` },
        { label: 'Command Sent', value: formatResultMoment(command?.sentAt) }
      ]
    },
    {
      title: 'Spontaneous Write From Status GA',
      items: [
        { label: 'Result', value: formatFeedbackCheckResult(statusWrite) },
        { label: 'Expected', value: statusWrite?.expectedPayloadLabel || expectedPayloadLabel || stringifyResultDetailValue(expectedPayload) },
        { label: 'Received At', value: formatResultMoment(statusWrite?.at) },
        { label: 'Event', value: statusWrite?.event || 'n/a' }
      ]
    },
    {
      title: 'Active Read Request To Status GA',
      items: [
        { label: 'Result', value: formatFeedbackCheckResult(resolvedResponse) },
        { label: 'Expected', value: resolvedResponse?.expectedPayloadLabel || expectedPayloadLabel || stringifyResultDetailValue(expectedPayload) },
        { label: 'Received At', value: formatResultMoment(resolvedResponse?.at) },
        { label: 'Event', value: resolvedResponse?.event || 'n/a' }
      ]
    }
  ]
}

function testResultEntries (report) {
  if (!report || typeof report !== 'object') return []
  if (Array.isArray(report.steps) && report.steps.length) {
    return report.steps.map((step) => {
      const details = step.kind === 'wait'
        ? [
            { label: 'Wait', value: `${Number(step.delayMs || 0)} ms` },
            { label: 'Reason', value: step.reason || 'Pause before next action' }
          ]
        : []
      return {
        id: String(step.id || `${report.id}-step`),
        title: step.title || step.id || 'Step',
        status: step.status || 'pass',
        message: step.message || step.description || '',
        details,
        detailGroups: step.kind === 'wait'
          ? []
          : buildFeedbackResultGroups({
            command: step.command,
            statusWrite: step.statusWrite,
            statusResponse: step.statusResponse,
            statusRead: step.statusRead,
            expectedPayloadLabel: step.expectedPayloadLabel,
            expectedPayload: step.expectedPayload
          })
      }
    })
  }
  if (Array.isArray(report.checks) && report.checks.length) {
    return report.checks.map((check) => ({
      id: String(check.id || `${report.id}-check`),
      title: check.title || check.id || 'Check',
      status: check.status || 'pass',
      message: check.message || '',
      details: [
        { label: 'Metrics', value: stringifyResultDetailValue(check.metrics || {}) },
        { label: 'Sample', value: stringifyResultDetailValue(check.sample || []) }
      ]
    }))
  }
  if (String(report.mode || '') === 'active_test') {
    return [{
      id: String(report.id || 'active-test'),
      title: report.name || 'Actuator Test',
      status: report.overallStatus || 'pass',
      message: report.overallStatus === 'pass'
        ? 'Both feedback checks passed.'
        : report.overallStatus === 'warn'
          ? 'One feedback check passed and one failed.'
          : 'Both feedback checks failed.',
      details: [],
      detailGroups: buildFeedbackResultGroups({
        command: report.command,
        statusWrite: report.statusWrite,
        statusResponse: report.statusResponse,
        statusRead: report.statusRead,
        expectedPayloadLabel: report.statusResponse?.expectedPayloadLabel || report.statusWrite?.expectedPayloadLabel || report.statusRead?.expectedPayloadLabel,
        expectedPayload: report.statusRead?.expectedPayload
      })
    }]
  }
  return []
}

function testResultSuggestions (report) {
  return Array.isArray(report && report.suggestions) ? report.suggestions : []
}

function testResultSourceRef (report) {
  const source = report && report.source && typeof report.source === 'object' ? report.source : {}
  const mode = String(report && report.mode ? report.mode : '').trim().toLowerCase()
  const areaId = String(source.areaId || report?.area?.id || '').trim()
  if (mode === 'ai_test_plan') {
    return {
      type: 'ai_test_plan',
      planId: String(source.planId || String(report.id || '').split(':')[0] || '').trim(),
      areaId
    }
  }
  if (mode === 'read_only') {
    return {
      type: 'profile',
      profileId: String(source.profileId || report?.profile?.id || '').trim(),
      areaId
    }
  }
  if (mode === 'active_test') {
    return {
      type: 'actuator_test',
      presetId: String(source.presetId || String(report.id || '').split(':')[0] || '').trim(),
      areaId
    }
  }
  return {
    type: '',
    areaId
  }
}

function canOpenSourceTest (report) {
  const source = testResultSourceRef(report)
  if (source.areaId && suggestedAreas.value.find(area => area.id === source.areaId)) return true
  if (source.type === 'ai_test_plan' && source.planId && testPlans.value.find(plan => plan.id === source.planId)) return true
  return source.type === 'profile' || source.type === 'actuator_test'
}

async function exportSelectedTestResultPdf () {
  const report = selectedTestResult.value
  if (!report || typeof report !== 'object') {
    setStatus('No test result selected to export')
    return
  }
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginLeft = 42
    const marginRight = 42
    const marginTop = 44
    const marginBottom = 42
    const contentWidth = pageWidth - marginLeft - marginRight
    let y = marginTop

    const ensureSpace = (needed = 14) => {
      if (y + needed <= pageHeight - marginBottom) return
      doc.addPage()
      y = marginTop
    }

    const writeWrapped = (text, {
      size = 11,
      bold = false,
      indent = 0,
      color = [35, 41, 52],
      lineHeight = 14,
      gapAfter = 0
    } = {}) => {
      const value = String(text || '').trim()
      if (!value) return
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setFontSize(size)
      doc.setTextColor(color[0], color[1], color[2])
      const lines = doc.splitTextToSize(value, Math.max(80, contentWidth - indent))
      for (const line of lines) {
        ensureSpace(lineHeight)
        doc.text(String(line), marginLeft + indent, y)
        y += lineHeight
      }
      if (gapAfter > 0) y += gapAfter
    }

    const writeSeparator = () => {
      ensureSpace(12)
      doc.setDrawColor(210, 214, 222)
      doc.line(marginLeft, y, pageWidth - marginRight, y)
      y += 12
    }

    const reportName = testResultDisplayName(report)
    const exportedAt = formatDateTime(new Date().toISOString()) || new Date().toISOString()
    const generatedAt = formatDateTime(report.generatedAt || '') || String(report.generatedAt || 'n/a')
    const areaText = testResultAreaText(report) || 'n/a'
    const modeLabel = testResultModeLabel(report)
    const overallStatus = String(report.overallStatus || 'n/a')
    const metricCards = testResultMetricCards(report)
    const entries = testResultEntries(report)
    const suggestions = testResultSuggestions(report)

    writeWrapped('KNX AI Test Result', { size: 17, bold: true, color: [20, 28, 39], lineHeight: 20 })
    writeWrapped(reportName, { size: 14, bold: true, color: [20, 28, 39], lineHeight: 17, gapAfter: 4 })
    writeWrapped(`Exported: ${exportedAt}`, { size: 10, color: [88, 96, 113] })
    writeWrapped(`Generated: ${generatedAt}`, { size: 10, color: [88, 96, 113] })
    writeWrapped(`Mode: ${modeLabel}`, { size: 10, color: [88, 96, 113] })
    writeWrapped(`Status: ${overallStatus}`, { size: 10, color: [88, 96, 113] })
    writeWrapped(`Area: ${areaText}`, { size: 10, color: [88, 96, 113] })
    writeWrapped(`Report ID: ${String(report.id || 'n/a')}`, { size: 10, color: [88, 96, 113], gapAfter: 2 })
    writeSeparator()

    if (metricCards.length) {
      writeWrapped('Metrics', { size: 12, bold: true, color: [20, 28, 39], gapAfter: 2 })
      metricCards.forEach((metric) => {
        writeWrapped(`${metric.label}: ${stringifyResultDetailValue(metric.value)}`, { size: 10, color: [35, 41, 52] })
      })
      y += 4
      writeSeparator()
    }

    writeWrapped(`Checks (${entries.length})`, { size: 12, bold: true, color: [20, 28, 39], gapAfter: 2 })
    if (!entries.length) {
      writeWrapped('No detailed entries stored for this report yet.', { size: 10, color: [88, 96, 113] })
    } else {
      entries.forEach((entry, index) => {
        writeWrapped(`${index + 1}. ${entry.title || 'Check'} [${String(entry.status || 'n/a').toUpperCase()}]`, { size: 11, bold: true, color: [31, 41, 55] })
        writeWrapped(entry.message || 'No additional details available.', { size: 10, color: [70, 78, 94] })
        if (Array.isArray(entry.detailGroups) && entry.detailGroups.length) {
          entry.detailGroups.forEach((group) => {
            writeWrapped(group.title || 'Details', { size: 10, bold: true, indent: 12, color: [35, 41, 52] })
            const items = Array.isArray(group.items) ? group.items : []
            items.forEach((detail) => {
              writeWrapped(`${detail.label}: ${stringifyResultDetailValue(detail.value)}`, { size: 10, indent: 24, color: [70, 78, 94] })
            })
          })
        } else {
          const details = Array.isArray(entry.details) ? entry.details : []
          details.forEach((detail) => {
            writeWrapped(`${detail.label}: ${stringifyResultDetailValue(detail.value)}`, { size: 10, indent: 12, color: [70, 78, 94] })
          })
        }
        y += 2
      })
    }

    if (suggestions.length) {
      y += 4
      writeSeparator()
      writeWrapped('Suggestions', { size: 12, bold: true, color: [20, 28, 39], gapAfter: 2 })
      suggestions.forEach((suggestion, index) => {
        writeWrapped(`${index + 1}. ${String(suggestion || '')}`, { size: 10, color: [35, 41, 52] })
      })
    }

    const reportDate = new Date(report.generatedAt || Date.now())
    const timestamp = Number.isFinite(reportDate.getTime())
      ? reportDate.toISOString().replace(/[:.]/g, '-')
      : String(Date.now())
    const fileName = `knx-ai-test-result-${sanitizeFileName(reportName, 'report')}-${timestamp}.pdf`
    doc.save(fileName)
    setStatus(`PDF exported (${fileName})`)
  } catch (error) {
    state.lastError = error && error.message ? error.message : 'Failed to export PDF'
    setStatus(state.lastError)
  }
}

function buildClientStepFailureResult (step, error, at = new Date().toISOString()) {
  const isWait = step && step.kind === 'wait'
  return {
    id: step && step.id ? step.id : `step-${Date.now()}`,
    title: step && step.title ? step.title : 'Test Step',
    description: step && step.description ? step.description : '',
    reason: step && step.reason ? step.reason : '',
    kind: step && step.kind ? step.kind : 'write_and_verify',
    status: 'warn',
    command: isWait ? null : {
      ga: step && step.commandGA ? step.commandGA : '',
      dpt: step && step.commandDPT ? step.commandDPT : '',
      payload: step ? step.commandPayload : undefined,
      sentAt: at
    },
    statusWrite: null,
    statusResponse: null,
    statusRead: null,
    expectedPayload: isWait ? undefined : (step ? step.expectedPayload : undefined),
    delayMs: Number(step && step.delayMs ? step.delayMs : 0),
    statusWriteTimeoutMs: isWait ? 0 : Number(step && step.statusWriteTimeoutMs ? step.statusWriteTimeoutMs : 0),
    statusResponseTimeoutMs: isWait ? 0 : Number(step && step.statusResponseTimeoutMs ? step.statusResponseTimeoutMs : 0),
    message: error && error.message ? error.message : 'Failed to run step'
  }
}

async function playStepAudioFromBlob (blob) {
  stopActiveStepAudio()
  return await new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob)
    const audio = new Audio(objectUrl)
    activeStepAudio = audio
    const cleanup = () => {
      if (activeStepAudio === audio) activeStepAudio = null
      audio.onended = null
      audio.onerror = null
      URL.revokeObjectURL(objectUrl)
    }
    audio.onended = () => {
      cleanup()
      resolve()
    }
    audio.onerror = () => {
      cleanup()
      reject(new Error('Audio playback failed'))
    }
    const playPromise = audio.play()
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch((error) => {
        cleanup()
        reject(error instanceof Error ? error : new Error(String(error)))
      })
    }
  })
}

function currentDraftStepById (stepId, fallbackStep = null) {
  const targetId = String(stepId || '').trim()
  if (!targetId || !state.testPlanDraft || !Array.isArray(state.testPlanDraft.steps)) return fallbackStep
  return state.testPlanDraft.steps.find(step => String(step && step.id ? step.id : '') === targetId) || fallbackStep
}

function detectSpeechLanguage (title, description = '') {
  const text = `${String(title || '')} ${String(description || '')}`.trim().toLowerCase()
  const paddedText = ` ${text} `
  if (!text) {
    const browserLanguage = String((navigator.language || 'it').split('-')[0] || 'it').trim().toLowerCase()
    return browserLanguage || 'it'
  }

  const hasAny = (tokens) => tokens.some(token => paddedText.includes(token))
  const weightedMatches = [
    {
      voice: 'it',
      score: [
        hasAny([' accendi ', ' spegni ', ' stato ', ' verifica ', ' coerente ', ' leggi ', ' apri ', ' chiudi ', ' attiva ', ' controlla ', ' area ', ' luce ', ' luci ', ' tapparella ', ' tapparelle ', ' clima ']) ? 3 : 0,
        /[àèéìíîòóù]/.test(text) ? 2 : 0
      ].reduce((sum, value) => sum + value, 0)
    },
    {
      voice: 'en',
      score: [
        hasAny([' turn on ', ' turn off ', ' verify ', ' feedback ', ' status ', ' check ', ' read ', ' open ', ' close ', ' command ', ' area ', ' light ', ' lights ']) ? 3 : 0
      ].reduce((sum, value) => sum + value, 0)
    },
    {
      voice: 'fr',
      score: [
        hasAny([' allume ', ' éteins ', ' etat ', ' état ', ' vérifier ', ' ouvre ', ' ferme ', ' lumière ', ' lumières ', ' zone ']) ? 3 : 0,
        /[àâçéèêëîïôûùüÿœ]/.test(text) ? 2 : 0
      ].reduce((sum, value) => sum + value, 0)
    },
    {
      voice: 'de',
      score: [
        hasAny([' einschalten ', ' ausschalten ', ' status ', ' prüfen ', ' öffne ', ' schließe ', ' licht ', ' bereich ']) ? 3 : 0,
        /[äöüß]/.test(text) ? 2 : 0
      ].reduce((sum, value) => sum + value, 0)
    },
    {
      voice: 'es',
      score: [
        hasAny([' enciende ', ' apaga ', ' estado ', ' verifica ', ' abre ', ' cierra ', ' luz ', ' luces ', ' zona ']) ? 3 : 0,
        /[áéíóúñü]/.test(text) ? 2 : 0
      ].reduce((sum, value) => sum + value, 0)
    },
    {
      voice: 'pt',
      score: [
        hasAny([' liga ', ' desliga ', ' estado ', ' verificar ', ' abre ', ' fecha ', ' luz ', ' luzes ', ' área ']) ? 3 : 0,
        /[ãõâêôçáéíóú]/.test(text) ? 2 : 0
      ].reduce((sum, value) => sum + value, 0)
    }
  ]

  weightedMatches.sort((a, b) => b.score - a.score)
  if (weightedMatches[0] && weightedMatches[0].score > 0) return weightedMatches[0].voice
  const browserLanguage = String((navigator.language || 'it').split('-')[0] || 'it').trim().toLowerCase()
  return browserLanguage || 'it'
}

function speechSpecFromStep (stepInput = {}, stepNumber = null) {
  const liveStep = currentDraftStepById(stepInput && stepInput.id ? stepInput.id : '', stepInput)
  const title = String(liveStep && liveStep.title ? liveStep.title : '').trim()
  const description = String(liveStep && liveStep.description ? liveStep.description : '').trim()
  const numericPrefix = Number.isInteger(stepNumber) && stepNumber > 0 ? `${stepNumber}. ` : ''
  return {
    text: `${numericPrefix}${title}`.trim(),
    voice: detectSpeechLanguage(title, description)
  }
}

async function speakTestStepTitle (stepInput = {}, stepNumber = null) {
  if (state.voiceEnabled !== true) return
  const speech = speechSpecFromStep(stepInput, stepNumber)
  const text = String(speech.text || '').trim()
  if (!text || !state.selectedNodeId) return
  const blob = await requestAudioBlob(`${apiUrl('tts/googletranslate')}?ts=${Date.now()}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      nodeId: state.selectedNodeId,
      text,
      voice: speech.voice,
      slow: false
    })
  })
  await playStepAudioFromBlob(blob)
}

async function speakText (text, description = '') {
  if (state.voiceEnabled !== true || !state.selectedNodeId) return
  const spokenText = String(text || '').trim()
  if (!spokenText) return
  const voice = detectSpeechLanguage(spokenText, description)
  const blob = await requestAudioBlob(`${apiUrl('tts/googletranslate')}?ts=${Date.now()}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      nodeId: state.selectedNodeId,
      text: spokenText,
      voice,
      slow: false
    })
  })
  await playStepAudioFromBlob(blob)
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
    const localLiveReport = state.testPlanRunning === true && state.liveTestResultId
      ? cloneJson(state.stateData && state.stateData.testPlanReport ? state.stateData.testPlanReport : null, null)
      : null
    const data = await requestJson(apiUrl(`state?nodeId=${encodeURIComponent(state.selectedNodeId)}&fresh=${fresh ? 1 : 0}`))
    if (localLiveReport && localLiveReport.id === state.liveTestResultId) {
      data.testPlanReport = localLiveReport
    }
    state.stateData = data
    nextTick(() => {
      if (state.areaDraftIsNew !== true && state.areaSelectedId && !suggestedAreas.value.find(area => area.id === state.areaSelectedId)) {
        state.areaSelectedId = ''
      }
      if (!restoreSelectedTestAreaForCurrentNode() && !state.testAreaSelectedId && suggestedAreas.value[0]) {
        state.testAreaSelectedId = suggestedAreas.value[0].id
      }
    })
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
  await fetchGaCatalog()
}

async function onNodeChange () {
  clearChat()
  state.selectedTestResultId = ''
  state.liveTestResultId = ''
  state.testResultFocusMode = false
  state.testAreaSelectedId = loadSelectedTestAreaIdForNode(state.selectedNodeId)
  await fetchState({ fresh: true })
  await fetchGaCatalog()
}

function resetTestsWorkspaceView () {
  state.selectedTestResultId = ''
  state.testResultFocusMode = false
  state.testPlanSelectedId = ''
  state.testPlanDraft = null
  state.testPlanPrompt = ''
  state.testPlanGeneration = null
  state.testPlanRunConfirmOpen = false
  state.testPlanUnsavedConfirmOpen = false
  state.showAiPlanner = true
  state.testTemplateBuilderFocus = false
  if (!restoreSelectedTestAreaForCurrentNode() && !state.testAreaSelectedId && suggestedAreas.value[0]) {
    state.testAreaSelectedId = suggestedAreas.value[0].id
  }
  resetPendingTestPlanAction()
  clearDraggedPlanStepState()
}

function openTemplateBuilderFocus () {
  state.showAiPlanner = true
  state.testTemplateBuilderFocus = true
}

function closeTemplateBuilderFocus () {
  state.testTemplateBuilderFocus = false
  state.showAiPlanner = false
}

function openAiAreaBuilderFocus () {
  state.showAiAreaBuilder = true
  state.areaBuilderFocus = true
}

function closeAiAreaBuilderFocus () {
  state.areaBuilderFocus = false
  state.showAiAreaBuilder = false
}

function resetAreasWorkspaceView () {
  state.areaSelectedId = ''
  state.areaDraftIsNew = false
  state.areaDraftId = ''
  state.areaDraftName = ''
  state.areaDraftDescription = ''
  state.areaDraftTags = ''
  state.areaDraftGaList = []
  state.areaLlmPrompt = ''
  state.areaLlmError = ''
  state.areaSearch = ''
  state.areaSearchOpen = false
  state.showAiAreaBuilder = false
  state.areaBuilderFocus = false
  state.areaUnsavedConfirmOpen = false
}

function closeAreaEditor () {
  if (hasUnsavedAreaChanges.value) {
    state.areaUnsavedConfirmOpen = true
    return
  }
  resetAreasWorkspaceView()
  setStatus('Area editor closed')
}

function closeAreaUnsavedConfirm () {
  state.areaUnsavedConfirmOpen = false
}

function discardAreaChangesAndCloseEditor () {
  state.areaUnsavedConfirmOpen = false
  resetAreasWorkspaceView()
  setStatus('Area editor closed')
}

function closeTestPlanEditor () {
  if (state.testPlanRunning) return
  requestTestPlanChange(() => {
    resetTestsWorkspaceView()
    state.testPlanSearchOpen = false
    setStatus('Test editor closed')
  }, 'close the current test editor')
}

function activateSettingsTab (tabId) {
  const target = String(tabId || '').trim()
  if (target !== 'node' && target !== 'config') return
  state.settingsTab = target
}

function activateSidebarTab (tabId) {
  const target = String(tabId || '').trim()
  if (!target) return
  if (target === 'tests' && suggestedAreas.value.length === 0) {
    setStatus('Define at least one area before using Tests')
    return
  }
  if (target === 'areas') {
    const hasSelectedArea = !!String(state.areaSelectedId || '').trim()
    const hasAreaDraft = state.areaDraftIsNew === true
    if (!hasSelectedArea && !hasAreaDraft) resetAreasWorkspaceView()
  }
  if (target === 'tests') {
    const hasSelectedPlan = !!String(state.testPlanSelectedId || '').trim()
    const hasSelectedResult = !!String(state.selectedTestResultId || '').trim()
    const hasDraft = !!state.testPlanDraft
    if (!hasSelectedPlan && !hasSelectedResult && !hasDraft) resetTestsWorkspaceView()
  }
  if (state.activeTab !== target) {
    state.activeTab = target
  } else {
    state.activeTab = ''
    nextTick(() => {
      state.activeTab = target
    })
  }
  closeSidebarOnMobile()
}

async function deleteTestResult (reportId) {
  const targetId = String(reportId || '').trim()
  if (!targetId || !state.selectedNodeId || state.deletingTestResultId) return
  state.deletingTestResultId = targetId
  try {
    const data = await requestJson(apiUrl('test-results/delete'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        reportId: targetId
      })
    })
    const nextResults = Array.isArray(data && data.testResults) ? data.testResults : []
    state.stateData = Object.assign({}, state.stateData || {}, {
      testResults: nextResults
    })
    if (state.selectedTestResultId === targetId) {
      state.selectedTestResultId = nextResults[0] && nextResults[0].id ? String(nextResults[0].id) : ''
      if (!nextResults.length) state.testResultFocusMode = false
    }
    if (state.liveTestResultId === targetId) state.liveTestResultId = ''
    setStatus('Test result deleted')
  } catch (error) {
    state.lastError = error.message || 'Failed to delete test result'
    setStatus(state.lastError)
  } finally {
    state.deletingTestResultId = ''
  }
}

function focusTestResult (reportId, { openMenu = true, activateTestsTab = false, activateResultsTab = false, resultOnly = true } = {}) {
  const id = String(reportId || '').trim()
  if (!id) return
  if (openMenu) state.testResultsMenuOpen = true
  const targetTab = activateResultsTab ? 'results' : (activateTestsTab ? 'tests' : '')
  const applyFocus = () => {
    if (targetTab) state.activeTab = targetTab
    state.selectedTestResultId = id
    state.testResultFocusMode = resultOnly === true
    nextTick(() => {
      const activeButton = document.querySelector('.results-page-list .area-list-item.active')
      if (activeButton && typeof activeButton.scrollIntoView === 'function') {
        activeButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    })
  }
  if (state.selectedTestResultId === id && (!targetTab || state.activeTab === targetTab)) {
    return
  }
  applyFocus()
}

function leaveTestResultFocusMode () {
  state.testResultFocusMode = false
}

function openSourceTestFromSelectedResult () {
  const report = selectedTestResult.value
  if (!report) return
  if (!suggestedAreas.value.length) {
    setStatus('Define at least one area before using Tests')
    return
  }
  const source = testResultSourceRef(report)
  state.activeTab = 'tests'
  state.testResultFocusMode = false
  if (source.type === 'ai_test_plan' && source.planId) {
    const plan = testPlans.value.find(item => item && item.id === source.planId)
    if (plan) {
      loadSelectedTestPlanDraft(plan)
      setStatus(`Opened source plan "${plan.name || plan.id}"`)
      return
    }
  }
  if (source.type === 'profile') {
    setStatus('Returned to the Tests page for the source read-only profile.')
    return
  }
  if (source.type === 'actuator_test') {
    setStatus('Returned to the Tests page for the source actuator test.')
    return
  }
  setStatus('Returned to the Tests page.')
}

async function persistTestResult (report) {
  if (!state.selectedNodeId || !report || typeof report !== 'object') return null
  const data = await requestJson(apiUrl('test-results/save'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      nodeId: state.selectedNodeId,
      report
    })
  })
  state.stateData = Object.assign({}, state.stateData || {}, {
    testResults: data.testResults || persistedTestResults.value,
    testPlanReport: data.report && data.report.mode === 'ai_test_plan' ? data.report : testPlanReport.value,
    actuatorTestReport: data.report && data.report.mode === 'active_test' ? data.report : actuatorTestReport.value,
    profileReport: data.report && data.report.mode === 'read_only' ? data.report : profileReport.value
  })
  if (data && data.report && data.report.id) {
    state.liveTestResultId = ''
    focusTestResult(data.report.id, { openMenu: true, activateResultsTab: true, resultOnly: true })
  }
  return data
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

async function saveAreaDefinition () {
  const area = selectedArea.value
  if (!state.selectedNodeId || state.areaSaving) return
  if (!state.areaDraftIsNew && !area) return
  const creating = state.areaDraftIsNew === true
  state.areaSaving = true
  setStatus(creating ? 'Creating area...' : 'Saving area...')
  try {
    const endpoint = creating ? 'areas/create' : 'areas/save'
    const data = await requestJson(apiUrl(endpoint), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        areaId: state.areaDraftIsNew ? undefined : area.id,
        name: state.areaDraftName,
        description: state.areaDraftDescription,
        tags: String(state.areaDraftTags || '')
          .split(',')
          .map(item => String(item || '').trim())
          .filter(Boolean),
        gaList: state.areaDraftGaList || []
      })
    })
    if (data && data.areas) {
      state.stateData = Object.assign({}, state.stateData || {}, { areas: data.areas })
      if (data.areaId) state.areaSelectedId = data.areaId
      state.areaLlmPrompt = ''
      state.areaLlmError = ''
      state.areaDraftIsNew = false
    } else {
      await fetchState({ fresh: true })
    }
    setStatus(creating ? 'Area created' : 'Area saved')
  } catch (error) {
    state.lastError = error.message || 'Failed to save area'
    setStatus(state.lastError)
  } finally {
    state.areaSaving = false
  }
}

async function resetAreaDefinition () {
  const area = selectedArea.value
  if (!area || !state.selectedNodeId || state.areaSaving) return
  state.areaSaving = true
  setStatus('Resetting area...')
  try {
    const data = await requestJson(apiUrl('areas/reset'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        areaId: area.id
      })
    })
    if (data && data.areas) {
      state.stateData = Object.assign({}, state.stateData || {}, { areas: data.areas })
    } else {
      await fetchState({ fresh: true })
    }
    setStatus('Area reset')
  } catch (error) {
    state.lastError = error.message || 'Failed to reset area'
    setStatus(state.lastError)
  } finally {
    state.areaSaving = false
  }
}

async function deleteAreaDefinition () {
  const area = selectedArea.value
  if (!area || !state.selectedNodeId || state.areaSaving) return
  state.areaSaving = true
  setStatus('Deleting area...')
  try {
    const data = await requestJson(apiUrl('areas/delete'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        areaId: area.id
      })
    })
    if (data && data.areas) {
      state.stateData = Object.assign({}, state.stateData || {}, { areas: data.areas })
      const nextAreas = Array.isArray(data.areas && data.areas.suggested) ? data.areas.suggested : []
      state.areaDraftIsNew = false
      state.areaSelectedId = nextAreas[0] && nextAreas[0].id ? nextAreas[0].id : ''
    } else {
      await fetchState({ fresh: true })
    }
    setStatus('Area deleted')
  } catch (error) {
    state.lastError = error.message || 'Failed to delete area'
    setStatus(state.lastError)
  } finally {
    state.areaSaving = false
  }
}

async function fetchAreaSignalCatalog () {
  const area = plannerCatalogArea.value
  if (!area || !state.selectedNodeId) {
    state.testPlanCatalog = null
    state.testPlanCatalogError = ''
    return
  }
  state.testPlanCatalogLoading = true
  state.testPlanCatalogError = ''
  try {
    const data = await requestJson(apiUrl('test-plans/catalog'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        areaId: area.id
      })
    })
    state.testPlanCatalog = data && data.catalog ? data.catalog : null
    if (data && data.testPlans) {
      state.stateData = Object.assign({}, state.stateData || {}, { testPlans: data.testPlans })
    }
  } catch (error) {
    state.testPlanCatalog = null
    state.testPlanCatalogError = error.message || 'Failed to load area command/status catalog'
  } finally {
    state.testPlanCatalogLoading = false
  }
}

async function fetchGaCatalog () {
  if (!state.selectedNodeId || state.gaCatalogLoading) return
  state.gaCatalogLoading = true
  try {
    const data = await requestJson(apiUrl('areas/catalog'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nodeId: state.selectedNodeId })
    })
    state.gaCatalog = Array.isArray(data && data.gaCatalog) ? data.gaCatalog : []
  } catch (error) {
    state.lastError = error.message || 'Failed to load GA catalog'
    setStatus(state.lastError)
  } finally {
    state.gaCatalogLoading = false
  }
}

function addGaToAreaDraft (ga) {
  const value = String(ga || '').trim()
  if (!value) return
  if ((state.areaDraftGaList || []).includes(value)) return
  state.areaDraftGaList = [...(state.areaDraftGaList || []), value]
}

function formatGaRoleLabel (value) {
  const role = String(value || '').trim().toLowerCase()
  const option = AREA_GA_ROLE_OPTIONS.find(item => item.value === role)
  if (option) return option.label
  if (role === 'auto') return 'Auto'
  return 'Command'
}

function formatAreaListOptionLabel (area) {
  const item = area && typeof area === 'object' ? area : {}
  const name = String(item.path || item.name || 'Area').trim()
  const kind = String(item.kind || '').trim()
  const gaCount = Number(item.gaCount || 0)
  const active = Number(item.activeGaCount || 0)
  const suffix = [kind, `${gaCount} GA`, `active ${active}`].filter(Boolean).join(' | ')
  return suffix ? `${name}   ${suffix}` : name
}

function selectAreaFromSearch (area) {
  const item = area && typeof area === 'object' ? area : null
  if (!item || !item.id) return
  state.areaDraftIsNew = false
  state.showAiAreaBuilder = false
  state.areaBuilderFocus = false
  state.areaSelectedId = item.id
  state.areaSearch = ''
  state.areaSearchOpen = false
}

function closeAreaSearchSoon () {
  setTimeout(() => {
    state.areaSearchOpen = false
  }, 150)
}

function formatTestPlanListOptionLabel (plan) {
  const item = plan && typeof plan === 'object' ? plan : {}
  const name = String(item.name || 'Plan').trim()
  const area = String(item.areaName || item.areaId || '').trim()
  const steps = Number(item.steps && item.steps.length ? item.steps.length : 0)
  const suffix = [area, `${steps} steps`].filter(Boolean).join(' | ')
  return suffix ? `${name}   ${suffix}` : name
}

function selectSavedPlanFromSearch (plan) {
  const item = plan && typeof plan === 'object' ? plan : null
  if (!item || !item.id) return
  selectSavedPlan(item)
  state.testPlanSearch = ''
  state.testPlanSearchOpen = false
}

function closeTestPlanSearchSoon () {
  setTimeout(() => {
    state.testPlanSearchOpen = false
  }, 150)
}

function getPreferredUiLanguage () {
  const htmlLang = String(document && document.documentElement && document.documentElement.lang ? document.documentElement.lang : '').trim().toLowerCase()
  if (htmlLang) return htmlLang.split('-')[0] || 'en'
  const browserLanguage = String((navigator.language || 'en')).trim().toLowerCase()
  return browserLanguage.split('-')[0] || 'en'
}

function removeGaFromAreaDraft (ga) {
  const value = String(ga || '').trim()
  if (!value) return
  state.areaDraftGaList = (state.areaDraftGaList || []).filter(item => item !== value)
}

async function saveAreaGaRole (ga, role) {
  const targetGa = String(ga || '').trim()
  if (!state.selectedNodeId || !targetGa || state.areaGaRoleSavingGa === targetGa) return
  state.areaGaRoleSavingGa = targetGa
  setStatus(`Saving role for ${targetGa}...`)
  try {
    const data = await requestJson(apiUrl('areas/ga-role/save'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        ga: targetGa,
        role
      })
    })
    if (Array.isArray(data && data.gaCatalog)) state.gaCatalog = data.gaCatalog
    if (data && data.areas) {
      state.stateData = Object.assign({}, state.stateData || {}, { areas: data.areas })
    }
    if (plannerCatalogArea.value && Array.isArray(plannerCatalogArea.value.gaList) && plannerCatalogArea.value.gaList.includes(targetGa)) {
      await fetchAreaSignalCatalog()
    }
    setStatus(`Role saved for ${targetGa}`)
  } catch (error) {
    state.lastError = error.message || 'Failed to save GA role'
    setStatus(state.lastError)
  } finally {
    state.areaGaRoleSavingGa = ''
  }
}

function startNewAreaDraft () {
  state.activeTab = 'areas'
  state.areaDraftIsNew = true
  state.areaSelectedId = ''
  state.areaDraftId = ''
  state.areaDraftName = 'New Area'
  state.areaDraftDescription = ''
  state.areaDraftTags = ''
  state.areaDraftGaList = []
  state.areaLlmPrompt = ''
  state.areaLlmError = ''
  state.showAiAreaBuilder = false
  state.areaBuilderFocus = false
}

async function regenerateLlmAreas () {
  if (!state.selectedNodeId || state.areaLlmRegenerating) return
  state.areaLlmRegenerating = true
  state.areaLlmError = ''
  setStatus('Regenerating AI areas...')
  try {
    const data = await requestJson(apiUrl('areas/regenerate-llm'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nodeId: state.selectedNodeId })
    })
    if (Array.isArray(data && data.gaCatalog)) state.gaCatalog = data.gaCatalog
    if (data && data.areas) {
      state.stateData = Object.assign({}, state.stateData || {}, { areas: data.areas })
    } else {
      await fetchState({ fresh: true })
    }
    setStatus(`AI areas regenerated (${Number(data && data.generatedCount ? data.generatedCount : 0)})`)
  } catch (error) {
    state.areaLlmError = error.message || 'Failed to regenerate AI areas'
    setStatus(state.areaLlmError)
  } finally {
    state.areaLlmRegenerating = false
  }
}

async function suggestAreaDraftWithLlm () {
  if (!state.selectedNodeId || state.areaLlmBusy) return
  const prompt = String(state.areaLlmPrompt || '').trim()
  if (!prompt) return
  state.areaLlmBusy = true
  state.areaLlmError = ''
  setStatus('AI is selecting area GA...')
  try {
    const data = await requestJson(apiUrl('areas/suggest-llm'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        prompt,
        name: state.areaDraftName,
        description: state.areaDraftDescription,
        gaList: state.areaDraftGaList || []
      })
    })
    const suggestion = data && data.suggestion ? data.suggestion : null
    if (Array.isArray(data && data.gaCatalog)) state.gaCatalog = data.gaCatalog
    if (!suggestion || !Array.isArray(suggestion.gaList) || !suggestion.gaList.length) {
      throw new Error('The AI did not return any group addresses')
    }
    if (!String(state.areaDraftName || '').trim() && suggestion.name) state.areaDraftName = String(suggestion.name)
    if (!String(state.areaDraftDescription || '').trim() && suggestion.description) state.areaDraftDescription = String(suggestion.description)
    if ((!state.areaDraftTags || !String(state.areaDraftTags).trim()) && Array.isArray(suggestion.tags) && suggestion.tags.length) {
      state.areaDraftTags = suggestion.tags.join(', ')
    }
    state.areaDraftGaList = Array.from(new Set([...(state.areaDraftGaList || []), ...suggestion.gaList.map(item => String(item || '').trim()).filter(Boolean)]))
    state.showAiAreaBuilder = false
    state.areaBuilderFocus = false
    setStatus(`AI added ${Number(suggestion.gaList.length || 0)} GA to the draft`)
  } catch (error) {
    state.areaLlmError = error.message || 'Failed to suggest area GA'
    setStatus(state.areaLlmError)
  } finally {
    state.areaLlmBusy = false
  }
}

function applyTestPromptPreset (preset) {
  if (preset && typeof preset === 'object') {
    state.testPlanPrompt = String(preset.prompt || '').trim()
    return
  }
  state.testPlanPrompt = String(preset || '').trim()
}

function pairForCommandGA (ga) {
  const target = String(ga || '').trim()
  if (!target) return null
  const pairs = Array.isArray(state.testPlanCatalog && state.testPlanCatalog.pairs) ? state.testPlanCatalog.pairs : []
  return pairs.find(pair => pair && pair.command && pair.command.ga === target) || null
}

function commandSignalByGA (ga) {
  const target = String(ga || '').trim()
  return plannerCommandOptions.value.find(item => item && item.ga === target) || null
}

function statusSignalByGA (ga) {
  const target = String(ga || '').trim()
  return plannerStatusOptions.value.find(item => item && item.ga === target) || null
}

function dptValueOptions (dpt) {
  const key = String(dpt || '').trim()
  if (!key) return []
  const byId = state.testPlanCatalog && state.testPlanCatalog.dptOptionsById && typeof state.testPlanCatalog.dptOptionsById === 'object'
    ? state.testPlanCatalog.dptOptionsById
    : {}
  return Array.isArray(byId[key]) ? byId[key] : []
}

function normalizeComparableText (value) {
  return String(value || '')
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

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

function detectPrimaryActionFromText (value) {
  const text = normalizeComparableText(value)
  if (!text) return ''
  const hits = []
  ACTION_PATTERN_GROUPS.forEach((group) => {
    group.patterns.forEach((regex) => {
      regex.lastIndex = 0
      let match
      while ((match = regex.exec(text)) !== null) {
        hits.push({ type: group.type, index: match.index })
      }
    })
  })
  hits.sort((a, b) => a.index - b.index)
  return hits[0] ? hits[0].type : ''
}

function actionImpliesTruthy (action) {
  return ['on', 'open'].includes(String(action || '').trim().toLowerCase())
}

function actionImpliesFalsy (action) {
  return ['off', 'close', 'stop'].includes(String(action || '').trim().toLowerCase())
}

function normalizePayloadForDptInput (value, dpt, contextText = '') {
  const options = dptValueOptions(dpt)
  if (!options.length) return String(value ?? '')
  const raw = String(value ?? '').trim()

  const normalizedRaw = normalizeComparableText(raw)
  const normalizedContext = normalizeComparableText(contextText)
  const combinedText = `${normalizedRaw} ${normalizedContext}`.trim()
  const action = detectPrimaryActionFromText(contextText || combinedText)

  if (action) {
    if (actionImpliesTruthy(action)) {
      const explicit = options.find(option => ['true', '1', '100'].includes(String(option.value)))
      if (explicit) return String(explicit.value)
      const labelMatch = options.find(option => /\b(on|open|up|start|enable|enabled|active|acceso|accesa|aperto|aperta|su|einschalten|allume|enciende|liga|aan)\b/.test(normalizeComparableText(option.label)))
      if (labelMatch) return String(labelMatch.value)
    }
    if (actionImpliesFalsy(action)) {
      const explicit = options.find(option => ['false', '0'].includes(String(option.value)))
      if (explicit) return String(explicit.value)
      const labelMatch = options.find(option => /\b(off|close|down|stop|disable|disabled|inactive|chiuso|spento|giu|ausschalten|eteins|apaga|desliga|uit)\b/.test(normalizeComparableText(option.label)))
      if (labelMatch) return String(labelMatch.value)
    }
  }

  if (options.some(option => String(option.value) === raw)) return raw

  const exactLabelMatch = options.find(option => normalizeComparableText(option.label) === normalizedRaw)
  if (exactLabelMatch) return String(exactLabelMatch.value)

  const containsLabelMatch = options.find(option => {
    const label = normalizeComparableText(option.label)
    return normalizedRaw && (label.includes(normalizedRaw) || normalizedRaw.includes(label))
  })
  if (containsLabelMatch) return String(containsLabelMatch.value)

  const trueLike = /\b(on|open|up|true|1|accendi|attiva|apri|su|acceso|accesa|accesi|accese|aperto|aperta|enabled|enable|start|allume|einschalten|enciende|liga|aan)\b/
  const falseLike = /\b(off|close|down|false|0|spegni|disattiva|chiudi|giu|spento|spenta|spenti|spente|chiuso|chiusa|disabled|disable|stop|ferma|eteins|ausschalten|apaga|desliga|uit)\b/

  if (trueLike.test(combinedText)) {
    const explicit = options.find(option => ['true', '1', '100'].includes(String(option.value)))
    if (explicit) return String(explicit.value)
    const labelMatch = options.find(option => /\b(on|open|up|start|enable|enabled|active|acceso|accesa|aperto|aperta|su)\b/.test(normalizeComparableText(option.label)))
    if (labelMatch) return String(labelMatch.value)
  }
  if (falseLike.test(combinedText)) {
    const explicit = options.find(option => ['false', '0'].includes(String(option.value)))
    if (explicit) return String(explicit.value)
    const labelMatch = options.find(option => /\b(off|close|down|stop|disable|disabled|inactive|spento|spenta|chiuso|chiusa|giu)\b/.test(normalizeComparableText(option.label)))
    if (labelMatch) return String(labelMatch.value)
  }

  return String(options[0].value)
}

function ensureStepPayloadFitsDpt (step) {
  if (!step) return
  const commandOptions = dptValueOptions(step.commandDPT)
  const expectedOptions = dptValueOptions(step.statusDPT || step.commandDPT)
  const action = String(step.action || '').trim().toLowerCase()
  if (commandOptions.length) {
    step.commandPayload = normalizePayloadForDptInput(step.commandPayload, step.commandDPT, action || `${step.title || ''} ${step.description || ''} ${step.reason || ''}`)
  }
  if (expectedOptions.length) {
    step.expectedPayload = normalizePayloadForDptInput(step.expectedPayload, step.statusDPT || step.commandDPT, action || `${step.title || ''} ${step.description || ''} ${step.reason || ''}`)
  }
}

function buildEditablePlanStep (seed = {}) {
  const isWait = String(seed.kind || '').trim().toLowerCase() === 'wait'
  if (isWait) {
    return {
      id: String(seed.id || `step-${Date.now()}-${Math.round(Math.random() * 1000)}`),
      kind: 'wait',
      action: '',
      collapsed: seed.collapsed !== false,
      title: String(seed.title || 'Wait'),
      description: String(seed.description || ''),
      reason: String(seed.reason || ''),
      delayMs: Number(seed.delayMs || seed.readDelayMs || 1200),
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
  const commandGA = String(seed.commandGA || '').trim() || String(plannerCommandOptions.value[0]?.ga || '')
  const pair = pairForCommandGA(commandGA)
  const command = commandSignalByGA(commandGA)
  const status = pair && pair.status ? pair.status : null
  const next = {
    id: String(seed.id || `step-${Date.now()}-${Math.round(Math.random() * 1000)}`),
    kind: String(seed.kind || (status ? 'write_and_verify' : 'write_only')),
    action: String(seed.action || '').trim().toLowerCase(),
    collapsed: seed.collapsed !== false,
    title: String(seed.title || (command ? `Step ${command.label}` : 'Manual Step')),
    description: String(seed.description || ''),
    reason: String(seed.reason || ''),
    commandGA,
    commandDPT: String(seed.commandDPT || command?.dpt || ''),
    commandPayload: String(seed.commandPayload ?? ''),
    statusGA: String(seed.statusGA || status?.ga || ''),
    statusDPT: String(seed.statusDPT || status?.dpt || ''),
    expectedPayload: String(seed.expectedPayload ?? seed.commandPayload ?? ''),
    statusWriteTimeoutMs: Number(seed.statusWriteTimeoutMs || seed.timeoutMs || 5000),
    statusResponseTimeoutMs: Number(seed.statusResponseTimeoutMs || seed.timeoutMs || 5000)
  }
  ensureStepPayloadFitsDpt(next)
  return next
}

function normalizeDraftPlanForEditing (plan) {
  const source = cloneJson(plan, null)
  if (!source) return null
  source.steps = (Array.isArray(source.steps) ? source.steps : []).map(step => buildEditablePlanStep(step))
  return source
}

function createEmptyAiTestPlanDraft () {
  return normalizeDraftPlanForEditing({
    id: '',
    name: '',
    description: '',
    areaId: selectedTestArea.value ? String(selectedTestArea.value.id || '') : '',
    areaName: selectedTestArea.value ? String(selectedTestArea.value.path || selectedTestArea.value.name || '') : '',
    prompt: '',
    source: 'manual',
    generatedAt: new Date().toISOString(),
    steps: []
  })
}

function refreshDraftStepFromCatalog (step) {
  if (!step) return
  if (step.kind === 'wait') return
  const command = commandSignalByGA(step.commandGA)
  const selectedStatus = statusSignalByGA(step.statusGA)
  const pair = pairForCommandGA(step.commandGA)
  if (command) step.commandDPT = String(command.dpt || '')
  if (selectedStatus) step.statusDPT = String(selectedStatus.dpt || '')
  if (pair && pair.status && (!step.statusGA || step.statusGA === '')) {
    step.statusGA = String(pair.status.ga || '')
    step.statusDPT = String(pair.status.dpt || '')
    step.kind = 'write_and_verify'
  }
  if (step.statusGA) {
    step.kind = 'write_and_verify'
  }
  if (!step.expectedPayload) step.expectedPayload = String(step.commandPayload ?? '')
  if (!step.statusGA) {
    step.statusDPT = ''
    step.kind = 'write_only'
  }
  ensureStepPayloadFitsDpt(step)
}

function addManualStepToPlan () {
  if (!state.testPlanDraft) return
  const next = {
    id: `step-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    kind: 'write_only',
    action: '',
    collapsed: true,
    title: 'Manual Step',
    description: '',
    reason: '',
    commandGA: '',
    commandDPT: '',
    commandPayload: '',
    statusGA: '',
    statusDPT: '',
    expectedPayload: '',
    statusWriteTimeoutMs: 5000,
    statusResponseTimeoutMs: 5000
  }
  state.testPlanDraft.steps = [...(state.testPlanDraft.steps || []), next]
}

function addWaitStepToPlan () {
  if (!state.testPlanDraft) return
  const next = buildEditablePlanStep({
    id: `wait-${(state.testPlanDraft.steps?.length || 0) + 1}`,
    kind: 'wait',
    title: 'Wait',
    description: 'Pause the test before the next action.',
    delayMs: 1200
  })
  state.testPlanDraft.steps = [...(state.testPlanDraft.steps || []), next]
}

function duplicatePlanStep (index) {
  if (!state.testPlanDraft || !Array.isArray(state.testPlanDraft.steps)) return
  const source = state.testPlanDraft.steps[index]
  if (!source) return
  const duplicate = buildEditablePlanStep(Object.assign({}, source, {
    id: `${source.id || 'step'}-copy`
  }))
  state.testPlanDraft.steps.splice(index + 1, 0, duplicate)
}

function removePlanStep (index) {
  if (!state.testPlanDraft || !Array.isArray(state.testPlanDraft.steps)) return
  state.testPlanDraft.steps.splice(index, 1)
}

function togglePlanStepCollapsed (step) {
  if (!step) return
  step.collapsed = step.collapsed !== true
}

function clearDraggedPlanStepState () {
  state.draggedTestPlanStepId = ''
  state.dragOverTestPlanStepId = ''
}

function onPlanStepDragStart (stepId, event) {
  const targetId = String(stepId || '').trim()
  if (!targetId) return
  state.draggedTestPlanStepId = targetId
  state.dragOverTestPlanStepId = ''
  if (event && event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', targetId)
  }
}

function onPlanStepDragEnter (stepId) {
  const targetId = String(stepId || '').trim()
  if (!targetId || !state.draggedTestPlanStepId || targetId === state.draggedTestPlanStepId) return
  state.dragOverTestPlanStepId = targetId
}

function movePlanStep (sourceId, targetId) {
  if (!state.testPlanDraft || !Array.isArray(state.testPlanDraft.steps)) return
  const fromId = String(sourceId || '').trim()
  const toId = String(targetId || '').trim()
  if (!fromId || !toId || fromId === toId) return
  const steps = state.testPlanDraft.steps.slice()
  const fromIndex = steps.findIndex(step => String(step && step.id ? step.id : '') === fromId)
  const toIndex = steps.findIndex(step => String(step && step.id ? step.id : '') === toId)
  if (fromIndex === -1 || toIndex === -1) return
  const [moved] = steps.splice(fromIndex, 1)
  steps.splice(toIndex, 0, moved)
  state.testPlanDraft.steps = steps
}

function onPlanStepDrop (targetStepId, event) {
  if (event) event.preventDefault()
  const sourceId = String(state.draggedTestPlanStepId || '').trim()
  const targetId = String(targetStepId || '').trim()
  if (sourceId && targetId && sourceId !== targetId) movePlanStep(sourceId, targetId)
  clearDraggedPlanStepState()
}

function openRunTestPlanConfirm () {
  if (!state.testPlanDraft || state.testPlanRunning) return
  state.testPlanRunMode = 'single'
  state.testPlanRepeatStopRequested = false
  state.testPlanRunConfirmOpen = true
}

function openRepeatTestPlanConfirm () {
  if (!state.testPlanDraft || state.testPlanRunning) return
  state.testPlanRunMode = 'repeat'
  state.testPlanRepeatStopRequested = false
  state.testPlanRunConfirmOpen = true
}

function closeRunTestPlanConfirm () {
  state.testPlanRunConfirmOpen = false
  state.testPlanRunMode = 'single'
}

function stopRepeatingTestPlan () {
  if (state.testPlanRepeatForever !== true) return
  state.testPlanRepeatStopRequested = true
  setStatus('Stopping repeat mode after the current cycle...')
}

function loadSelectedTestPlanDraft (plan = null) {
  const source = plan || selectedTestPlan.value
  if (!source) return
  state.testResultFocusMode = false
  state.testPlanSelectedId = String(source.id || '')
  state.testPlanDraft = normalizeDraftPlanForEditing(source)
  state.testPlanPrompt = String(source.prompt || '')
  state.testPlanGeneration = {
    provider: String(source.source || 'saved'),
    model: '',
    fallback: false,
    error: ''
  }
  state.testPlanRunConfirmOpen = false
  state.showAiPlanner = false
  state.testTemplateBuilderFocus = false
  setCurrentTestPlanBaseline()
}

function resetPendingTestPlanAction () {
  pendingTestPlanAction = null
  state.testPlanPendingActionLabel = ''
}

function closeUnsavedTestPlanConfirm () {
  state.testPlanUnsavedConfirmOpen = false
  resetPendingTestPlanAction()
}

function runPendingTestPlanAction () {
  const action = pendingTestPlanAction
  state.testPlanUnsavedConfirmOpen = false
  resetPendingTestPlanAction()
  if (typeof action === 'function') action()
}

function requestTestPlanChange (action, label = 'another plan') {
  if (!hasUnsavedTestPlanChanges.value) {
    action()
    return
  }
  pendingTestPlanAction = action
  state.testPlanPendingActionLabel = String(label || 'another plan')
  state.testPlanUnsavedConfirmOpen = true
}

function selectSavedPlan (plan) {
  if (!plan || !plan.id) return
  const targetId = String(plan.id)
  if (state.testPlanSelectedId === targetId) return
  requestTestPlanChange(() => loadSelectedTestPlanDraft(plan), `plan "${plan.name || targetId}"`)
}

function cancelTestPlanChanges () {
  restoreCurrentTestPlanBaseline()
  setStatus('Plan changes discarded')
}

async function saveCurrentTestPlanAndContinue () {
  const ok = await saveAiTestPlanDefinition()
  if (ok) runPendingTestPlanAction()
}

function startNewAiTestPlan () {
  if (!suggestedAreas.value.length) {
    setStatus('Define at least one area before creating a test plan')
    return
  }
  requestTestPlanChange(() => {
    state.activeTab = 'tests'
    state.testResultFocusMode = false
    state.testPlanSelectedId = ''
    state.testPlanDraft = createEmptyAiTestPlanDraft()
    state.testPlanGeneration = null
    state.testPlanRunConfirmOpen = false
    state.testPlanPrompt = ''
    state.showAiPlanner = false
    state.testTemplateBuilderFocus = false
    setCurrentTestPlanBaseline()
  }, 'a new plan')
}

function updateDraftTestArea (areaId) {
  const targetId = String(areaId || '').trim()
  if (!targetId) return
  const area = suggestedAreas.value.find(item => item && item.id === targetId)
  if (!area) return
  state.testAreaSelectedId = targetId
  if (state.testPlanDraft) {
    state.testPlanDraft.areaId = targetId
    state.testPlanDraft.areaName = String(area.path || area.name || '')
  }
}

function duplicateCurrentAiTestPlan () {
  const source = cloneJson(state.testPlanDraft || selectedTestPlan.value, null)
  if (!source) return
  state.activeTab = 'tests'
  state.testResultFocusMode = false
  state.testPlanSelectedId = ''
  state.testPlanRunConfirmOpen = false
  state.testPlanGeneration = {
    provider: 'duplicated',
    model: '',
    fallback: false,
    error: ''
  }
  source.id = ''
  source.name = String(source.name || 'Plan Draft').trim()
    ? `${String(source.name || 'Plan Draft').trim()} Copy`
    : 'Plan Copy'
  state.testPlanPrompt = String(source.prompt || state.testPlanPrompt || '')
  state.testPlanDraft = normalizeDraftPlanForEditing(source)
  state.showAiPlanner = true
  state.testTemplateBuilderFocus = false
  setCurrentTestPlanBaseline()
  setStatus('Plan duplicated')
}

async function generateAiTestPlan () {
  const area = selectedTestArea.value
  const prompt = String(state.testPlanPrompt || '').trim()
  const browserLanguage = getPreferredUiLanguage()
  if (!state.selectedNodeId || !area || !prompt || state.testPlanGenerating) return
  state.testPlanGenerating = true
  state.testTemplateBuilderFocus = false
  state.showAiPlanner = false
  state.testResultFocusMode = false
  state.testPlanGenerationError = ''
  setStatus('Building test plan...')
  try {
    const data = await requestJson(apiUrl('test-plans/generate'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        areaId: area.id,
        prompt,
        language: browserLanguage
      })
    })
    state.testPlanDraft = data && data.plan ? normalizeDraftPlanForEditing(data.plan) : null
    state.testPlanCatalog = data && data.catalog ? data.catalog : state.testPlanCatalog
    state.testPlanGeneration = data && data.generation ? data.generation : null
    state.testPlanGenerationError = ''
    state.testPlanSelectedId = ''
    state.testPlanRunConfirmOpen = false
    state.showAiPlanner = false
    if (data && data.testPlans) {
      state.stateData = Object.assign({}, state.stateData || {}, { testPlans: data.testPlans })
    }
    setCurrentTestPlanBaseline()
    setStatus('Test plan ready')
  } catch (error) {
    const message = error.message || 'Failed to build the test plan'
    state.lastError = message
    state.testPlanGenerationError = message
    state.testPlanGeneration = {
      provider: '',
      model: '',
      fallback: false,
      error: message
    }
    setStatus(message)
  } finally {
    state.testPlanGenerating = false
  }
}

async function saveAiTestPlanDefinition () {
  if (!state.selectedNodeId || !state.testPlanDraft || state.testPlanSaving) return false
  state.testPlanSaving = true
  setStatus('Saving test plan...')
  try {
    const data = await requestJson(apiUrl('test-plans/save'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        plan: Object.assign({}, state.testPlanDraft, { prompt: state.testPlanPrompt })
      })
    })
    if (data && data.testPlans) {
      state.stateData = Object.assign({}, state.stateData || {}, { testPlans: data.testPlans })
    }
    if (data && data.planId) state.testPlanSelectedId = data.planId
    if (data && data.planId && state.testPlanDraft) state.testPlanDraft.id = data.planId
    state.testPlanRunConfirmOpen = false
    setCurrentTestPlanBaseline()
    setStatus('Test plan saved')
    return true
  } catch (error) {
    state.lastError = error.message || 'Failed to save test plan'
    setStatus(state.lastError)
    return false
  } finally {
    state.testPlanSaving = false
  }
}

async function deleteAiTestPlanDefinition () {
  const plan = selectedTestPlan.value
  if (!plan || !state.selectedNodeId || state.testPlanDeleting) return
  state.testPlanDeleting = true
  setStatus('Deleting test plan...')
  try {
    const data = await requestJson(apiUrl('test-plans/delete'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        planId: plan.id
      })
    })
    if (data && data.testPlans) {
      state.stateData = Object.assign({}, state.stateData || {}, { testPlans: data.testPlans })
    }
    state.testPlanDraft = null
    state.testPlanGeneration = null
    state.testPlanRunConfirmOpen = false
    state.showAiPlanner = true
    state.testTemplateBuilderFocus = false
    setCurrentTestPlanBaseline()
    setStatus('Test plan deleted')
  } catch (error) {
    state.lastError = error.message || 'Failed to delete test plan'
    setStatus(state.lastError)
  } finally {
    state.testPlanDeleting = false
  }
}

async function runAiTestPlanDefinition (modeInput = 'single') {
  if (!state.selectedNodeId || !state.testPlanDraft || state.testPlanRunning) return
  const runMode = String(modeInput || state.testPlanRunMode || 'single').trim().toLowerCase()
  const repeatForever = runMode === 'repeat'
  state.testPlanRunning = true
  state.showAiPlanner = false
  state.testTemplateBuilderFocus = false
  state.testPlanRepeatForever = repeatForever
  state.testPlanRepeatStopRequested = false
  state.testPlanRunningStepId = ''
  state.testPlanRunConfirmOpen = false
  state.lastError = ''
  setStatus(repeatForever ? 'Running test plan in repeat mode...' : 'Running test plan...')
  try {
    const plan = JSON.parse(JSON.stringify(Object.assign({}, state.testPlanDraft, { prompt: state.testPlanPrompt })))
    const steps = Array.isArray(plan.steps) ? plan.steps : []
    if (!plan.areaId) throw new Error('Missing areaId in test plan')
    if (!steps.length) throw new Error('The test plan has no executable steps')
    let area = selectedTestArea.value
    let cycleNumber = 0
    do {
      cycleNumber += 1
      const liveReportId = `${plan.id || 'plan'}:${Date.now()}`
      const stepResults = []
      state.liveTestResultId = liveReportId
      state.testResultsMenuOpen = true
      focusTestResult(liveReportId, { openMenu: true, activateResultsTab: true, resultOnly: true })
      state.stateData = Object.assign({}, state.stateData || {}, {
        testPlanReport: buildClientTestPlanReport({
          plan,
          area,
          stepResults: [],
          reportId: liveReportId
        })
      })

      try {
        // Announce the plan name before the first executable step.
        // This makes the test session clearer for the installer on site.
        // eslint-disable-next-line no-await-in-loop
        await speakText(plan.name || 'Test plan', plan.description || '')
      } catch (error) {}

      for (let index = 0; index < steps.length; index += 1) {
        const step = steps[index]
        state.testPlanRunningStepId = step && step.id ? step.id : ''
        const cyclePrefix = repeatForever ? `Cycle ${cycleNumber} · ` : ''
        setStatus(`${cyclePrefix}Step ${index + 1}/${steps.length}: ${step && step.title ? step.title : 'Running...'}`)

        try {
          // Voice feedback is best-effort. A playback error must not stop the KNX test.
          // eslint-disable-next-line no-await-in-loop
          await speakTestStepTitle(step || { title: `Step ${index + 1}` }, index + 1)
        } catch (error) {
          setStatus(`Voice unavailable for step ${index + 1}. Continuing test...`)
        }

        try {
          // eslint-disable-next-line no-await-in-loop
          const data = await requestJson(apiUrl('test-plans/run-step'), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              nodeId: state.selectedNodeId,
              areaId: plan.areaId,
              step
            })
          })
          if (data && data.area) area = data.area
          stepResults.push(data && data.stepResult ? data.stepResult : buildClientStepFailureResult(step, new Error('Step returned no result')))
        } catch (error) {
          stepResults.push(buildClientStepFailureResult(step, error))
        }

        state.stateData = Object.assign({}, state.stateData || {}, {
          testPlanReport: buildClientTestPlanReport({
            plan,
            area,
            stepResults: stepResults.slice(),
            reportId: liveReportId
          })
        })
      }

      const finalReport = buildClientTestPlanReport({ plan, area, stepResults, reportId: liveReportId })
      state.stateData = Object.assign({}, state.stateData || {}, {
        testPlans: testPlans.value,
        testPlanReport: finalReport
      })
      focusTestResult(liveReportId, { openMenu: true, activateResultsTab: true, resultOnly: true })
      try {
        // eslint-disable-next-line no-await-in-loop
        await persistTestResult(finalReport)
      } catch (error) {
        state.lastError = error.message || 'Failed to save test result'
        setStatus(`Test completed, but the result was not saved: ${state.lastError}`)
      }
      if (repeatForever && state.testPlanRepeatStopRequested !== true) {
        state.testResultFocusMode = false
        setStatus(`Cycle ${cycleNumber} completed. Starting the next cycle...`)
      }
    } while (repeatForever && state.testPlanRepeatStopRequested !== true)
    state.testPlanRunConfirmOpen = false
    if (!state.lastError) setStatus(repeatForever ? 'Repeat mode stopped' : 'Test completed')
    requestAnimationFrame(() => {
      try {
        if (testPlanReportRef.value && typeof testPlanReportRef.value.scrollIntoView === 'function') {
          testPlanReportRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } catch (error) {}
    })
  } catch (error) {
    state.lastError = error.message || 'Failed to run test plan'
    setStatus(state.lastError)
  } finally {
    state.testPlanRunningStepId = ''
    stopActiveStepAudio()
    state.testPlanRunning = false
    state.testPlanRepeatForever = false
    state.testPlanRepeatStopRequested = false
    state.testPlanRunMode = 'single'
  }
}

function startNewProfileDraft () {
  state.activeTab = 'tests'
  state.profileDraftMode = true
  state.profileSelectedId = ''
  state.profileDraftId = ''
  state.profileDraftName = selectedArea.value ? `Control ${selectedArea.value.name || 'Area'}` : 'Custom Area Profile'
  state.profileDraftDescription = 'Read-only profile customized by the installer.'
  state.profileDraftTargetTags = Array.isArray(selectedArea.value && selectedArea.value.tags) ? selectedArea.value.tags.join(', ') : ''
  state.profileDraftMinActivityPct = 20
  state.profileDraftMaxSilentPct = 60
  state.profileDraftMaxAnomalies = 2
}

function startNewActuatorDraft () {
  state.activeTab = 'tests'
  state.actuatorDraftMode = true
  state.actuatorPresetSelectedId = ''
  state.actuatorDraftId = ''
  state.actuatorDraftName = selectedArea.value ? `Actuator ${selectedArea.value.name || 'Test'}` : 'Actuator Test'
  state.actuatorDraftDescription = 'Manual active test with command write, spontaneous status write check and explicit read-response check.'
  state.actuatorDraftCommandGA = selectedArea.value && Array.isArray(selectedArea.value.sampleGAs) && selectedArea.value.sampleGAs[0] ? selectedArea.value.sampleGAs[0] : ''
  state.actuatorDraftCommandDPT = ''
  state.actuatorDraftCommandPayload = 'true'
  state.actuatorDraftStatusGA = ''
  state.actuatorDraftStatusDPT = ''
  state.actuatorDraftStatusWriteTimeoutMs = 5000
  state.actuatorDraftStatusResponseTimeoutMs = 5000
}

async function saveProfileDefinition () {
  if (!state.selectedNodeId || state.profileSaving) return
  state.profileSaving = true
  setStatus('Saving profile...')
  try {
    const data = await requestJson(apiUrl('profiles/save'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        id: state.profileDraftId,
        name: state.profileDraftName,
        description: state.profileDraftDescription,
        targetTags: String(state.profileDraftTargetTags || '')
          .split(',')
          .map(item => String(item || '').trim())
          .filter(Boolean),
        minActivityPct: Number(state.profileDraftMinActivityPct),
        maxSilentPct: Number(state.profileDraftMaxSilentPct),
        maxAnomalies: Number(state.profileDraftMaxAnomalies)
      })
    })
    if (data && data.profiles) {
      state.stateData = Object.assign({}, state.stateData || {}, { profiles: data.profiles })
      state.profileDraftMode = false
      if (data.profileId) state.profileSelectedId = data.profileId
    } else {
      state.profileDraftMode = false
      await fetchState({ fresh: true })
    }
    setStatus('Profile saved')
  } catch (error) {
    state.lastError = error.message || 'Failed to save profile'
    setStatus(state.lastError)
  } finally {
    state.profileSaving = false
  }
}

async function deleteProfileDefinition () {
  const profile = selectedProfile.value
  if (!profile || profile.builtIn === true || !state.selectedNodeId || state.profileSaving) return
  state.profileSaving = true
  setStatus('Deleting profile...')
  try {
    const data = await requestJson(apiUrl('profiles/delete'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        profileId: profile.id
      })
    })
    if (data && data.profiles) {
      state.stateData = Object.assign({}, state.stateData || {}, { profiles: data.profiles })
      state.profileDraftMode = false
    } else {
      state.profileDraftMode = false
      await fetchState({ fresh: true })
    }
    setStatus('Profile deleted')
  } catch (error) {
    state.lastError = error.message || 'Failed to delete profile'
    setStatus(state.lastError)
  } finally {
    state.profileSaving = false
  }
}

async function runSelectedProfile () {
  if (!state.selectedNodeId || !selectedArea.value || !selectedProfile.value || state.profileRunning) return
  state.profileRunning = true
  setStatus('Running profile...')
  try {
    const data = await requestJson(apiUrl('profiles/run'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        areaId: selectedArea.value.id,
        profileId: selectedProfile.value.id
      })
    })
    state.stateData = Object.assign({}, state.stateData || {}, {
      areas: data.areas || areasState.value,
      profiles: data.profiles || profiles.value,
      profileReport: data.report || null,
      actuatorTests: data.actuatorTests || actuatorTests.value,
      testResults: data.testResults || persistedTestResults.value
    })
    focusTestResult(data && data.report && data.report.id ? data.report.id : '', { openMenu: true, activateResultsTab: true, resultOnly: true })
    setStatus('Profile report ready')
  } catch (error) {
    state.lastError = error.message || 'Failed to run profile'
    setStatus(state.lastError)
  } finally {
    state.profileRunning = false
  }
}

async function saveActuatorPreset () {
  if (!state.selectedNodeId || state.actuatorSaving) return
  state.actuatorSaving = true
  setStatus('Saving actuator preset...')
  try {
    const data = await requestJson(apiUrl('actuator-tests/save'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        id: state.actuatorDraftId,
        name: state.actuatorDraftName,
        description: state.actuatorDraftDescription,
        commandGA: state.actuatorDraftCommandGA,
        commandDPT: state.actuatorDraftCommandDPT,
        commandPayload: state.actuatorDraftCommandPayload,
        statusGA: state.actuatorDraftStatusGA,
        statusDPT: state.actuatorDraftStatusDPT,
        statusWriteTimeoutMs: Number(state.actuatorDraftStatusWriteTimeoutMs),
        statusResponseTimeoutMs: Number(state.actuatorDraftStatusResponseTimeoutMs)
      })
    })
    if (data && data.actuatorTests) {
      state.stateData = Object.assign({}, state.stateData || {}, { actuatorTests: data.actuatorTests })
      state.actuatorDraftMode = false
      if (data.presetId) state.actuatorPresetSelectedId = data.presetId
    } else {
      state.actuatorDraftMode = false
      await fetchState({ fresh: true })
    }
    setStatus('Actuator preset saved')
  } catch (error) {
    state.lastError = error.message || 'Failed to save actuator preset'
    setStatus(state.lastError)
  } finally {
    state.actuatorSaving = false
  }
}

async function deleteActuatorPreset () {
  const preset = selectedActuatorPreset.value
  if (!preset || !state.selectedNodeId || state.actuatorSaving) return
  state.actuatorSaving = true
  setStatus('Deleting actuator preset...')
  try {
    const data = await requestJson(apiUrl('actuator-tests/delete'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        presetId: preset.id
      })
    })
    if (data && data.actuatorTests) {
      state.stateData = Object.assign({}, state.stateData || {}, { actuatorTests: data.actuatorTests })
      state.actuatorDraftMode = false
    } else {
      state.actuatorDraftMode = false
      await fetchState({ fresh: true })
    }
    setStatus('Actuator preset deleted')
  } catch (error) {
    state.lastError = error.message || 'Failed to delete actuator preset'
    setStatus(state.lastError)
  } finally {
    state.actuatorSaving = false
  }
}

async function runActuatorTest () {
  if (!state.selectedNodeId || state.actuatorRunning) return
  state.actuatorRunning = true
  setStatus('Running actuator test...')
  try {
    const data = await requestJson(apiUrl('actuator-tests/run'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        id: state.actuatorDraftId,
        name: state.actuatorDraftName,
        description: state.actuatorDraftDescription,
        commandGA: state.actuatorDraftCommandGA,
        commandDPT: state.actuatorDraftCommandDPT,
        commandPayload: state.actuatorDraftCommandPayload,
        statusGA: state.actuatorDraftStatusGA,
        statusDPT: state.actuatorDraftStatusDPT,
        statusWriteTimeoutMs: Number(state.actuatorDraftStatusWriteTimeoutMs),
        statusResponseTimeoutMs: Number(state.actuatorDraftStatusResponseTimeoutMs)
      })
    })
    state.stateData = Object.assign({}, state.stateData || {}, {
      actuatorTests: data.actuatorTests || actuatorTests.value,
      actuatorTestReport: data.report || null,
      testResults: data.testResults || persistedTestResults.value
    })
    focusTestResult(data && data.report && data.report.id ? data.report.id : '', { openMenu: true, activateResultsTab: true, resultOnly: true })
    setStatus('Actuator test complete')
  } catch (error) {
    state.lastError = error.message || 'Failed to run actuator test'
    setStatus(state.lastError)
  } finally {
    state.actuatorRunning = false
  }
}

async function exportFullConfig () {
  if (!state.selectedNodeId) return
  setStatus('Exporting config...')
  try {
    const data = await requestJson(apiUrl('config/export'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nodeId: state.selectedNodeId })
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `knx-ai-config-${state.selectedNodeId}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    setStatus('Config exported')
  } catch (error) {
    state.lastError = error.message || 'Failed to export config'
    setStatus(state.lastError)
  }
}

function triggerConfigImport () {
  if (configImportRef.value) configImportRef.value.click()
}

async function importFullConfig (event) {
  const file = event && event.target && event.target.files && event.target.files[0] ? event.target.files[0] : null
  if (!file || !state.selectedNodeId) return
  setStatus('Importing config...')
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const data = await requestJson(apiUrl('config/import'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nodeId: state.selectedNodeId,
        config: parsed
      })
    })
    state.stateData = Object.assign({}, state.stateData || {}, {
      areas: data.areas || areasState.value,
      profiles: data.profiles || profiles.value,
      actuatorTests: data.actuatorTests || actuatorTests.value,
      testPlans: data.testPlans || testPlans.value,
      testResults: data.testResults || persistedTestResults.value
    })
    await fetchGaCatalog()
    setStatus('Config imported')
  } catch (error) {
    state.lastError = error.message || 'Failed to import config'
    setStatus(state.lastError)
  } finally {
    if (event && event.target) event.target.value = ''
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
  syncViewportMode()
  window.addEventListener('resize', syncViewportMode)
  document.addEventListener('keydown', onGlobalKeydown)
  document.addEventListener('fullscreenchange', syncFullscreenState)
  await fetchNodes({ preserveSelection: false })
  await fetchState({ fresh: true })
  await fetchGaCatalog()
  startTimers()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportMode)
  document.removeEventListener('keydown', onGlobalKeydown)
  document.removeEventListener('fullscreenchange', syncFullscreenState)
  stopTimers()
  stopActiveStepAudio()
})
</script>

<template>
  <header class="m-header">
    <div class="m-header-brand">
      <span class="m-logo-mark">K</span>
      <span class="hb-logo-text-mobile">KNX AI</span>
    </div>
    <button
      class="hamburger-icon"
      :class="{ 'hamburger-icon-cross': isSidebarExpanded }"
      type="button"
      :aria-expanded="isSidebarExpanded ? 'true' : 'false'"
      aria-controls="knx-ai-sidebar"
      aria-label="Toggle menu"
      @click="toggleSidebar"
    >
      <span />
      <span />
      <span />
      <span />
    </button>
  </header>

  <button
    v-if="isCompactViewport && isSidebarExpanded"
    class="sidebar-overlay"
    type="button"
    aria-label="Close menu"
    @click="closeSidebarOnMobile"
  />

  <div class="page-shell" :class="{ 'sidebar-collapsed': !isSidebarExpanded, 'sidebar-mobile-open': isCompactViewport && isSidebarExpanded }">
    <aside class="app-sidebar">
      <div id="knx-ai-sidebar" class="sidebar-brand-wrap">
        <div class="sidebar-brand-mark" aria-hidden="true">K</div>
        <div class="sidebar-brand">
          <p class="eyebrow">KNX Ultimate</p>
        </div>
        <button
          class="sidebar-collapse-toggle"
          type="button"
          :aria-expanded="isSidebarExpanded ? 'true' : 'false'"
          aria-controls="knx-ai-sidebar"
          aria-label="Toggle sidebar"
          @click="toggleSidebar"
        >
          <span class="sidebar-collapse-icon">{{ isSidebarExpanded ? (isCompactViewport ? '×' : '‹') : '›' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <button class="tab-button" :class="{ active: state.activeTab === 'overview' }" type="button" @click="activateSidebarTab('overview')">
          <span class="sidebar-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="sidebar-nav-svg"><path d="M3 10.8 12 3l9 7.8v9.2a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>
          </span>
          <span class="sidebar-nav-copy">
            <span class="sidebar-nav-title">Overview</span>
          </span>
        </button>
        <button class="tab-button" :class="{ active: state.activeTab === 'areas' }" type="button" @click="activateSidebarTab('areas')">
          <span class="sidebar-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="sidebar-nav-svg"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
          </span>
          <span class="sidebar-nav-copy">
            <span class="sidebar-nav-title">Areas</span>
          </span>
        </button>
        <button class="tab-button sidebar-nav-child" :class="{ active: state.activeTab === 'tests' }" type="button" :disabled="!suggestedAreas.length" @click="activateSidebarTab('tests')">
          <span class="sidebar-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="sidebar-nav-svg"><path d="M9 3h6v2h-1v4.3l5.5 8.8A2 2 0 0 1 17.8 21H6.2a2 2 0 0 1-1.7-2.9L10 9.3V5H9zm1.9 8.2L6.9 18h10.2l-4-6.8z"/></svg>
          </span>
          <span class="sidebar-nav-copy">
            <span class="sidebar-nav-title">Tests</span>
          </span>
        </button>
        <button class="tab-button sidebar-nav-child" :class="{ active: state.activeTab === 'results' }" type="button" @click="activateSidebarTab('results')">
          <span class="sidebar-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="sidebar-nav-svg"><path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z"/></svg>
          </span>
          <span class="sidebar-nav-copy">
            <span class="sidebar-nav-title">Test Results</span>
          </span>
        </button>
        <button class="tab-button" :class="{ active: state.activeTab === 'assistant' }" type="button" @click="activateSidebarTab('assistant')">
          <span class="sidebar-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="sidebar-nav-svg"><path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>
          </span>
          <span class="sidebar-nav-copy">
            <span class="sidebar-nav-title">Assistant</span>
          </span>
        </button>
        <button class="tab-button" :class="{ active: state.activeTab === 'settings' }" type="button" @click="activateSidebarTab('settings')">
          <span class="sidebar-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="sidebar-nav-svg"><path d="M19.14 12.94a7.43 7.43 0 0 0 .05-.94 7.43 7.43 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.18 7.18 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54a7.18 7.18 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.43 7.43 0 0 0-.05.94 7.43 7.43 0 0 0 .05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.04.71 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.59-.23 1.13-.55 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4z"/></svg>
          </span>
          <span class="sidebar-nav-copy">
            <span class="sidebar-nav-title">Settings</span>
          </span>
        </button>
      </nav>

      <div v-if="isSidebarExpanded" class="sidebar-panel sidebar-actions">
        <button class="primary-button sidebar-action-button" type="button" :disabled="state.loadingNodes || state.loadingState" @click="onRefresh">
          Refresh
        </button>
      </div>

      <div v-if="isSidebarExpanded" class="sidebar-footer">
        <span class="status-pill" :class="{ error: !!state.lastError }">{{ state.status }}</span>
        <span v-if="selectedNode" class="status-detail">Provider: {{ selectedNode.llmProvider || 'n/a' }} | Model: {{ selectedNode.llmModel || 'n/a' }}</span>
        <a class="sidebar-doc-link" :href="KNX_AI_VUE_DOCS_URL" target="_blank" rel="noopener noreferrer">
          Documentation: KNX AI Vue
        </a>
      </div>
    </aside>

    <section class="workspace-shell">
    <main class="content-grid workspace-main">
      <section v-if="state.activeTab === 'overview'" class="card card-summary">
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

      <section v-if="state.activeTab === 'areas'" class="card card-areas">
        <div class="card-head">
          <h2>Select an Area</h2>
          <div class="card-head-actions">
            <span class="meta-chip">{{ Number(areaTotals.suggestedAreaCount || 0) }} areas</span>
            <button class="secondary-button" type="button" :disabled="state.areaLlmRegenerating || !nodeInfo.llmEnabled" @click="regenerateLlmAreas">
              {{ state.areaLlmRegenerating ? 'Regenerating...' : 'Regenerate AI Areas' }}
            </button>
            <button class="secondary-button new-button" type="button" @click="startNewAreaDraft">
              New Area
            </button>
          </div>
        </div>
        <div class="areas-toolbar">
          <div class="pill-row">
            <span class="pill neutral">GA {{ Number(areaTotals.gaCount || 0) }}</span>
            <span class="pill neutral">Hierarchical {{ Number(areaTotals.hierarchicalGaCount || 0) }}</span>
            <span class="pill neutral">Secondary {{ Number(areaTotals.secondaryGroupCount || 0) }}</span>
            <span class="pill neutral">Active {{ Number(areaTotals.activeAreaCount || 0) }}</span>
          </div>
        </div>
        <div v-if="filteredAreas.length || state.areaDraftIsNew" class="areas-layout">
          <div v-if="!selectedArea && !state.areaDraftIsNew" class="area-listbox-shell">
            <label class="flow-field">
              <span>Areas</span>
              <div class="area-search-select">
                <input
                  v-model="state.areaSearch"
                  class="area-search-select-input"
                  type="text"
                  :placeholder="selectedArea ? formatAreaListOptionLabel(selectedArea) : 'Search area...'"
                  @focus="state.areaSearchOpen = true"
                  @input="state.areaSearchOpen = true"
                  @blur="closeAreaSearchSoon"
                >
                <div v-if="state.areaSearchOpen && filteredAreas.length" class="area-search-select-menu">
                  <button
                    v-for="area in filteredAreas.slice(0, 80)"
                    :key="area.id"
                    type="button"
                    class="area-search-select-option"
                    :class="{ active: selectedArea && selectedArea.id === area.id }"
                    @mousedown.prevent="selectAreaFromSearch(area)"
                  >
                    {{ formatAreaListOptionLabel(area) }}
                  </button>
                </div>
              </div>
            </label>
          </div>
          <article v-if="selectedArea || state.areaDraftIsNew" class="area-detail" :class="{ 'area-detail-wide': state.areaDraftIsNew }">
            <div class="area-editor">
              <div v-if="state.areaBuilderFocus !== true" class="card-head">
                <div>
                  <h4>Edit Area</h4>
                  <p class="area-detail-subhead">The installer can rename the area and decide exactly which group addresses belong to it. Everything is persisted per KNX AI node.</p>
                </div>
                <div class="card-head-actions action-cluster">
                  <button
                    v-if="state.areaDraftIsNew && !showAiAreaBuilderSection"
                    class="secondary-button"
                    type="button"
                    @click="openAiAreaBuilderFocus"
                  >
                    Show AI Area Builder
                  </button>
                  <button v-if="!state.areaDraftIsNew" class="danger-button" type="button" :disabled="state.areaSaving" @click="deleteAreaDefinition">
                    Delete Area
                  </button>
                  <button class="secondary-button" type="button" :disabled="state.areaSaving" @click="resetAreaDefinition">
                    Reset
                  </button>
                  <button class="primary-button" type="button" :disabled="state.areaSaving" @click="saveAreaDefinition">
                    {{ state.areaSaving ? 'Saving...' : 'Save Area' }}
                  </button>
                  <button class="secondary-button" type="button" :disabled="state.areaSaving" @click="closeAreaEditor">
                    Close
                  </button>
                </div>
              </div>
              <div v-if="state.areaBuilderFocus !== true" class="area-editor-grid">
                <label class="flow-field">
                  <span>Area name</span>
                  <input v-model="state.areaDraftName" type="text" placeholder="Installer alias">
                </label>
                <label class="flow-field area-editor-span">
                  <span>Description</span>
                  <textarea v-model="state.areaDraftDescription" rows="3" placeholder="Optional note for diagnostics and reports" />
                </label>
                <label class="flow-field area-editor-span">
                  <span>Add group addresses to this area</span>
                  <input v-model="state.gaCatalogSearch" type="text" placeholder="Search GA, label or ETS path">
                </label>
              </div>
              <div v-if="state.areaDraftIsNew && showAiAreaBuilderSection" class="ai-planner-shell area-llm-shell">
                <div class="ai-planner-shell-head" :class="{ 'template-builder-focus-head': state.areaBuilderFocus === true }">
                  <div>
                    <h4>AI Area Builder</h4>
                    <p class="area-detail-subhead">Describe the room, zone or function you want. The AI will suggest the most relevant group addresses for this draft.</p>
                  </div>
                  <div v-if="state.areaBuilderFocus === true" class="card-head-actions action-cluster">
                    <button class="secondary-button" type="button" @click="closeAiAreaBuilderFocus">
                      Close
                    </button>
                  </div>
                </div>
                <div class="area-editor-grid">
                  <label class="flow-field area-editor-span">
                    <span>Assistant prompt</span>
                    <textarea v-model="state.areaLlmPrompt" rows="3" placeholder="Example: Add all technical room lighting command and status GA." />
                  </label>
                </div>
                <div class="profile-runbar">
                  <button class="primary-button" type="button" :disabled="state.areaLlmBusy || !state.areaLlmPrompt.trim() || !nodeInfo.llmEnabled" @click="suggestAreaDraftWithLlm">
                    {{ state.areaLlmBusy ? 'Suggesting...' : 'Suggest GA with AI' }}
                  </button>
                </div>
                <p v-if="state.areaLlmError" class="planner-error-banner">
                  {{ state.areaLlmError }}
                </p>
                <p v-if="!nodeInfo.llmEnabled" class="area-detail-subhead">
                  Enable the AI in the KNX AI node to regenerate areas or suggest GA for a new draft.
                </p>
              </div>
              <div v-if="state.areaBuilderFocus !== true" class="area-ga-editor">
                <div>
                  <h4>Area GA membership</h4>
                  <ul v-if="areaDraftGaDetails.length" class="simple-list simple-list-mono area-ga-list">
                    <li v-for="item in areaDraftGaDetails" :key="item.ga" class="area-ga-item">
                      <div class="area-ga-main">
                        <strong>{{ item.ga }}</strong>
                        <span>{{ item.label || 'Unlabeled GA' }}<span v-if="item.dpt"> | DPT {{ item.dpt }}</span></span>
                        <span>Role {{ formatGaRoleLabel(item.role) }}<span v-if="item.roleSource"> | source {{ item.roleSource }}</span></span>
                      </div>
                      <div class="area-ga-actions">
                        <label class="flow-field area-ga-role-field">
                          <span>Role</span>
                          <select
                            :value="(item.roleOverride && item.roleOverride !== 'auto') ? item.roleOverride : (item.role || 'neutral')"
                            :disabled="state.areaGaRoleSavingGa === item.ga"
                            @change="saveAreaGaRole(item.ga, $event.target.value)"
                          >
                            <option v-for="option in AREA_GA_ROLE_OPTIONS" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </option>
                          </select>
                        </label>
                        <button class="secondary-button" type="button" @click="removeGaFromAreaDraft(item.ga)">
                          Remove
                        </button>
                      </div>
                    </li>
                  </ul>
                  <p v-else class="empty-state">No GA selected for this area yet.</p>
                </div>
                <div>
                  <div class="card-head">
                    <div>
                      <h4>Available GA</h4>
                      <p class="area-detail-subhead">Pick from the ETS catalog. Already selected GA are hidden from this list.</p>
                    </div>
                    <span class="meta-chip">{{ state.gaCatalogLoading ? 'Loading...' : `${filteredGaCatalog.length} visible` }}</span>
                  </div>
                  <div class="area-ga-catalog">
                    <button
                      v-for="item in filteredGaCatalog"
                      :key="item.ga"
                      type="button"
                      class="area-list-item"
                      @click="addGaToAreaDraft(item.ga)"
                    >
                      <span class="area-list-title">{{ item.ga }}</span>
                      <span class="area-list-meta">{{ item.label || 'Unlabeled GA' }}</span>
                      <span class="area-list-tags">{{ item.hierarchyPath || item.dpt || '' }}<span v-if="item.role"> | {{ formatGaRoleLabel(item.role) }}</span></span>
                    </button>
                  </div>
                </div>
              </div>
              <p v-if="state.areaBuilderFocus !== true" class="area-editor-note">
                Original ETS path: <strong>{{ state.areaDraftIsNew ? 'Manual area' : (selectedArea.basePath || selectedArea.path || selectedArea.name) }}</strong>
              </p>
            </div>
          </article>
        </div>
        <p v-else class="empty-state">No areas matched the current search or the ETS file does not expose a usable hierarchy yet.</p>
      </section>

      <section v-if="state.activeTab === 'tests'" class="card card-profiles" :class="{ 'card-results-focus': isViewingTestResultOnly }">
        <div class="card-head">
          <div>
            <h2>{{ isViewingTestResultOnly ? 'Test Result' : 'Test Planner' }}</h2>
            <p class="area-detail-subhead">
              {{ isViewingTestResultOnly ? 'Showing only the selected test report.' : 'Select an area, choose a standard test template, review the generated plan, then save or run it.' }}
            </p>
          </div>
          <div class="card-head-actions" v-if="!isViewingTestResultOnly">
            <span class="meta-chip">Area {{ selectedTestArea ? (selectedTestArea.path || selectedTestArea.name) : 'n/a' }}</span>
            <span class="meta-chip">{{ testPlans.length }} saved plans</span>
            <button class="secondary-button" type="button" :disabled="!state.testPlanDraft" @click="duplicateCurrentAiTestPlan">
              Duplicate Plan
            </button>
            <button class="secondary-button new-button" type="button" @click="startNewAiTestPlan">
              New Plan
            </button>
          </div>
          <div class="card-head-actions" v-else>
            <span class="meta-chip">{{ testResultModeLabel(selectedTestResult) }}</span>
            <button class="danger-button" type="button" :disabled="!selectedTestResult || state.deletingTestResultId === selectedTestResult.id" @click="deleteTestResult(selectedTestResult?.id)">
              {{ state.deletingTestResultId === selectedTestResult?.id ? 'Deleting...' : 'Delete' }}
            </button>
            <button class="secondary-button" type="button" @click="openSourceTestFromSelectedResult">
              Open Source Test
            </button>
          </div>
        </div>
        <div class="profiles-layout test-planner-layout" :class="{ 'result-only-layout': isViewingTestResultOnly }">
          <div class="profile-editor-stack">
            <article v-if="!isViewingTestResultOnly && !state.testPlanDraft && !state.testPlanRunning" class="area-detail planner-sidecard">
              <div class="card-head">
                <div>
                  <h3>Select test plan</h3>
                  <p class="area-detail-subhead">Reusable deterministic active tests saved by the installer.</p>
                </div>
              </div>
              <div class="area-listbox-shell">
                <label class="flow-field">
                  <span>Plans</span>
                  <div class="area-search-select">
                    <input
                      v-model="state.testPlanSearch"
                      class="area-search-select-input"
                      type="text"
                      :placeholder="selectedTestPlan ? formatTestPlanListOptionLabel(selectedTestPlan) : 'Search saved plan...'"
                      @focus="state.testPlanSearchOpen = true"
                      @input="state.testPlanSearchOpen = true"
                      @blur="closeTestPlanSearchSoon"
                    >
                    <div v-if="state.testPlanSearchOpen && filteredTestPlans.length" class="area-search-select-menu">
                      <button
                        v-for="plan in filteredTestPlans.slice(0, 80)"
                        :key="plan.id"
                        type="button"
                        class="area-search-select-option"
                        :class="{ active: selectedTestPlan && selectedTestPlan.id === plan.id }"
                        @mousedown.prevent="selectSavedPlanFromSearch(plan)"
                      >
                        {{ formatTestPlanListOptionLabel(plan) }}
                      </button>
                    </div>
                  </div>
                </label>
              </div>
              <p v-if="!testPlans.length" class="empty-state">No saved plans yet.</p>
            </article>

            <article v-if="!isViewingTestResultOnly && state.testPlanDraft" class="area-detail">
              <div v-if="state.testTemplateBuilderFocus !== true" class="card-head">
                <div>
                  <h3>{{ state.testPlanDraft?.name || 'Plan Draft' }}</h3>
                  <p class="area-detail-subhead" v-if="showAiPlannerSection">Choose a standard test template for the selected area, then build the plan deterministically from the ETS catalog.</p>
                </div>
                <div class="card-head-actions action-cluster">
                  <span v-if="hasUnsavedTestPlanChanges" class="meta-chip">Unsaved changes</span>
                  <button
                    class="secondary-button new-button"
                    type="button"
                    @click="startNewAiTestPlan"
                  >
                    New Plan
                  </button>
                  <button
                    v-if="!showAiPlannerSection"
                    class="secondary-button"
                    type="button"
                    @click="openTemplateBuilderFocus"
                  >
                    Show Template Builder
                  </button>
                  <label class="checkbox flow-toggle compact-toggle">
                    <input v-model="state.voiceEnabled" type="checkbox">
                    <span>Voice</span>
                  </label>
                  <button class="danger-button" type="button" :disabled="state.testPlanDeleting || !selectedTestPlan" @click="deleteAiTestPlanDefinition">
                    {{ state.testPlanDeleting ? 'Deleting...' : 'Delete' }}
                  </button>
                  <button class="secondary-button" type="button" :disabled="state.testPlanSaving || state.testPlanRunning" @click="closeTestPlanEditor">
                    Close
                  </button>
                  <button class="secondary-button" type="button" :disabled="state.testPlanSaving || !state.testPlanDraft" @click="saveAiTestPlanDefinition">
                    {{ state.testPlanSaving ? 'Saving...' : 'Save Plan' }}
                  </button>
                  <div v-if="hasDraftSteps" class="plan-run-actions">
                    <button
                      class="secondary-button"
                      type="button"
                      :disabled="(!state.testPlanDraft && state.testPlanRepeatForever !== true) || (state.testPlanRunning && state.testPlanRepeatForever !== true) || state.testPlanRepeatStopRequested === true"
                      @click="state.testPlanRepeatForever === true ? stopRepeatingTestPlan() : openRepeatTestPlanConfirm()"
                    >
                      {{ state.testPlanRepeatForever === true ? (state.testPlanRepeatStopRequested === true ? 'Stopping...' : 'Stop Repeat') : 'Repeat Forever' }}
                    </button>
                    <button class="primary-button" type="button" :disabled="state.testPlanRunning || !state.testPlanDraft" @click="openRunTestPlanConfirm">
                      <span v-if="state.testPlanRunning" class="running-spinner run-button-spinner" aria-hidden="true" />
                      <span>{{ state.testPlanRunning ? 'Running...' : 'Run Plan' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="showAiPlannerSection" class="ai-planner-shell">
                <div class="ai-planner-shell-head" :class="{ 'template-builder-focus-head': state.testTemplateBuilderFocus === true }">
                  <div>
                    <h4>Template Builder</h4>
                    <p class="area-detail-subhead">Select one of the standard templates. The plan is built only from the command GA available in the selected area.</p>
                  </div>
                  <div v-if="state.testTemplateBuilderFocus === true" class="card-head-actions action-cluster">
                    <button class="secondary-button" type="button" @click="closeTemplateBuilderFocus">
                      Close
                    </button>
                  </div>
                </div>
                <div class="area-editor-grid">
                  <label class="flow-field">
                    <span>Area to test</span>
                    <select v-model="state.testAreaSelectedId">
                      <option v-for="area in suggestedAreas" :key="area.id" :value="area.id">
                        {{ area.path || area.name }}
                      </option>
                    </select>
                  </label>
                  <label class="flow-field area-editor-span">
                    <span>Selected template</span>
                    <textarea :value="state.testPlanPrompt || 'Select one of the templates below.'" rows="4" readonly />
                  </label>
                </div>

                <div class="preset-row compact-preset-row">
                  <button
                    v-for="preset in TEST_PROMPT_PRESETS"
                    :key="preset.id"
                    class="preset-button"
                    type="button"
                    :class="{ active: state.testPlanPrompt === preset.prompt }"
                    @click="applyTestPromptPreset(preset)"
                  >
                    {{ preset.title }}
                  </button>
                </div>
                <p class="area-detail-subhead">
                  {{ (TEST_PROMPT_PRESETS.find(item => item.prompt === state.testPlanPrompt) || {}).description || 'Choose a template to see what the deterministic builder will do in the selected area.' }}
                </p>

                <div class="profile-runbar">
                  <button class="primary-button" type="button" :disabled="state.testPlanGenerating || !selectedTestArea || !state.testPlanPrompt.trim()" @click="generateAiTestPlan">
                    {{ state.testPlanGenerating ? 'Building...' : 'Build Test Plan' }}
                  </button>
                </div>

                <p v-if="state.testPlanGenerationError" class="planner-error-banner">
                  {{ state.testPlanGenerationError }}
                </p>

                <div v-if="state.testPlanGeneration" class="planner-generation">
                  <p v-if="!state.testPlanGeneration.error" class="area-detail-subhead">
                    Built with {{ state.testPlanGeneration.provider || 'deterministic builder' }}.
                  </p>
                  <p v-if="state.testPlanGeneration.error" class="area-detail-subhead">{{ state.testPlanGeneration.error }}</p>
                </div>
              </div>
            </article>

            <article v-if="state.testPlanRunning && !isViewingTestResultOnly" class="area-detail planner-run-focus">
              <div class="card-head">
                <div>
                  <h3 class="running-headline">
                    <span class="running-spinner" aria-hidden="true" />
                    <span>Test Running</span>
                  </h3>
                  <p class="area-detail-subhead">{{ currentRunningStep?.title || 'Executing current step...' }}</p>
                </div>
                <span class="meta-chip">{{ testPlanReport?.metrics?.totalSteps ? `${Number(testPlanReport.steps?.length || 0)}/${Number(testPlanReport.metrics.totalSteps || 0)}` : 'in progress' }}</span>
              </div>
              <div class="metric-grid area-metrics">
                <article class="metric">
                  <span>Completed</span>
                  <strong>{{ Number(testPlanReport?.steps?.length || 0) }}</strong>
                </article>
                <article class="metric">
                  <span>Pass</span>
                  <strong>{{ Number(testPlanReport?.metrics?.pass || 0) }}</strong>
                </article>
                <article class="metric">
                  <span>Warn</span>
                  <strong>{{ Number(testPlanReport?.metrics?.warn || 0) }}</strong>
                </article>
                <article class="metric">
                  <span>Fail</span>
                  <strong>{{ Number(testPlanReport?.metrics?.fail || 0) }}</strong>
                </article>
              </div>
              <div v-if="currentRunningStep" class="report-check report-pass planner-step-card planner-step-running">
                <div class="anomaly-head">
                  <strong>{{ currentRunningStep.title || currentRunningStep.id }}</strong>
                  <span>{{ currentRunningStep.kind }}</span>
                </div>
                <p class="area-detail-subhead">{{ currentRunningStep.description || 'Current step in execution.' }}</p>
                <div v-if="currentRunningStep.kind === 'wait'" class="planner-step-grid">
                  <span><strong>Wait</strong> {{ Number(currentRunningStep.delayMs || 0) }} ms</span>
                  <span><strong>Reason</strong> {{ currentRunningStep.reason || 'Pause before next action' }}</span>
                </div>
                <div v-else class="planner-step-grid">
                  <span><strong>Command</strong> {{ currentRunningStep.commandGA || 'n/a' }}</span>
                  <span><strong>Status GA</strong> {{ currentRunningStep.statusGA || 'n/a' }}</span>
                  <span><strong>Payload</strong> {{ displayPayloadLabelForDpt(currentRunningStep.commandPayload, currentRunningStep.commandDPT) }}</span>
                  <span><strong>Expected</strong> {{ displayPayloadLabelForDpt(currentRunningStep.expectedPayload, currentRunningStep.statusDPT || currentRunningStep.commandDPT) }}</span>
                </div>
                <div v-if="currentRunningStep.kind !== 'wait' && currentRunningStep.statusGA" class="planner-check-sections">
                  <section class="planner-check-section">
                    <h4>Spontaneous Write From Status GA</h4>
                    <div class="planner-step-grid compact-grid">
                      <span><strong>Status GA</strong> {{ currentRunningStep.statusGA || 'n/a' }}</span>
                      <span><strong>Timeout</strong> {{ Number(currentRunningStep.statusWriteTimeoutMs || 0) }} ms</span>
                    </div>
                  </section>
                  <section class="planner-check-section">
                    <h4>Active Read Request To Status GA</h4>
                    <div class="planner-step-grid compact-grid">
                      <span><strong>Status GA</strong> {{ currentRunningStep.statusGA || 'n/a' }}</span>
                      <span><strong>Timeout</strong> {{ Number(currentRunningStep.statusResponseTimeoutMs || 0) }} ms</span>
                    </div>
                  </section>
                </div>
              </div>
            </article>

            <article ref="testPlanReportRef" class="area-detail" v-if="selectedTestResult && isViewingTestResultOnly">
              <div class="card-head">
                <div>
                  <h3>{{ testResultDisplayName(selectedTestResult) }}</h3>
                  <p class="area-detail-subhead">{{ testResultAreaText(selectedTestResult) || formatDateTime(selectedTestResult.generatedAt) }}</p>
                </div>
                <div class="card-head-actions action-cluster">
                  <span class="meta-chip">{{ testResultModeLabel(selectedTestResult) }}</span>
                  <span v-if="selectedTestResult.live === true" class="meta-chip">
                    <span class="running-spinner run-chip-spinner" aria-hidden="true" />
                    <span>Running</span>
                  </span>
                  <span class="meta-chip">{{ selectedTestResult.overallStatus }}</span>
                  <button class="secondary-button" type="button" @click="exportSelectedTestResultPdf">
                    Export PDF
                  </button>
                </div>
              </div>
              <div class="metric-grid area-metrics">
                <article v-for="metric in testResultMetricCards(selectedTestResult)" :key="metric.label" class="metric">
                  <span>{{ metric.label }}</span>
                  <strong>{{ metric.value }}</strong>
                </article>
              </div>
              <div class="report-checks">
                <article v-for="entry in testResultEntries(selectedTestResult)" :key="entry.id" class="report-check" :class="`report-${entry.status}`">
                  <div class="anomaly-head">
                    <strong>{{ entry.title }}</strong>
                    <span>{{ entry.status }}</span>
                  </div>
                  <p class="area-detail-subhead">{{ entry.message || 'No additional details available.' }}</p>
                  <div v-if="entry.detailGroups?.length" class="planner-check-sections result-check-sections">
                    <section v-for="group in entry.detailGroups" :key="`${entry.id}-${group.title}`" class="planner-check-section">
                      <h4>{{ group.title }}</h4>
                      <div class="planner-step-grid compact-grid">
                        <span v-for="detail in group.items" :key="`${entry.id}-${group.title}-${detail.label}`"><strong>{{ detail.label }}</strong> {{ detail.value }}</span>
                      </div>
                    </section>
                  </div>
                  <div v-else class="planner-step-grid">
                    <span v-for="detail in entry.details" :key="`${entry.id}-${detail.label}`"><strong>{{ detail.label }}</strong> {{ detail.value }}</span>
                  </div>
                </article>
              </div>
              <p v-if="!testResultEntries(selectedTestResult).length" class="empty-state">No detailed entries stored for this report yet.</p>
              <div v-if="testResultSuggestions(selectedTestResult).length">
                <h4>Suggestions</h4>
                <ul class="simple-list">
                  <li v-for="suggestion in testResultSuggestions(selectedTestResult)" :key="suggestion">{{ suggestion }}</li>
                </ul>
              </div>
            </article>

            <article class="area-detail plan-draft-shell" v-if="state.testPlanDraft && !state.testPlanRunning && !isViewingTestResultOnly && state.testTemplateBuilderFocus !== true">
              <div class="card-head">
                <div>
                  <h3>Edit Plan</h3>
                </div>
                <div class="card-head-actions action-cluster">
                  <span class="meta-chip">{{ Number(state.testPlanDraft.steps?.length || 0) }} steps</span>
                  <button class="secondary-button" type="button" @click="addManualStepToPlan">
                    Add Step
                  </button>
                  <button class="secondary-button" type="button" @click="addWaitStepToPlan">
                    Add Wait
                  </button>
                </div>
              </div>
              <div class="area-editor-grid">
                <label class="flow-field">
                  <span>Area</span>
                  <select
                    :value="state.testPlanDraft.areaId || state.testAreaSelectedId || ''"
                    :disabled="!suggestedAreas.length"
                    @change="updateDraftTestArea($event.target.value)"
                  >
                    <option value="" disabled>Select area</option>
                    <option v-for="area in suggestedAreas" :key="area.id" :value="area.id">
                      {{ area.path || area.name }}
                    </option>
                  </select>
                </label>
                <label class="flow-field">
                  <span>Plan name</span>
                  <input v-model="state.testPlanDraft.name" type="text" placeholder="KNX active test name">
                </label>
                <label class="flow-field area-editor-span">
                  <span>Description</span>
                  <textarea v-model="state.testPlanDraft.description" rows="2" placeholder="Short operator-facing description" />
                </label>
              </div>
              <div class="report-checks plan-steps-stack">
                <article
                  v-for="(step, index) in (state.testPlanDraft.steps || [])"
                  :key="step.id"
                  class="report-check report-pass planner-step-card"
                  :class="{
                    'planner-step-running': state.testPlanRunning && state.testPlanRunningStepId === step.id,
                    'planner-step-dragging': state.draggedTestPlanStepId === step.id,
                    'planner-step-drop-target': state.dragOverTestPlanStepId === step.id
                  }"
                  @dragenter.prevent="onPlanStepDragEnter(step.id)"
                  @dragover.prevent
                  @drop="onPlanStepDrop(step.id, $event)"
                >
                  <div class="anomaly-head">
                    <div class="planner-step-title">
                      <button
                        class="drag-handle"
                        type="button"
                        draggable="true"
                        tabindex="-1"
                        aria-label="Drag step"
                        title="Drag step"
                        @dragstart="onPlanStepDragStart(step.id, $event)"
                        @dragend="clearDraggedPlanStepState"
                      >
                        ⋮⋮
                      </button>
                      <button
                        class="collapse-toggle"
                        type="button"
                        :aria-expanded="step.collapsed !== true"
                        :title="step.collapsed === true ? 'Expand step' : 'Collapse step'"
                        @click="togglePlanStepCollapsed(step)"
                      >
                        <span class="collapse-icon" :class="{ collapsed: step.collapsed === true }">▾</span>
                      </button>
                      <strong>{{ step.title || step.id }}</strong>
                    </div>
                    <div class="card-head-actions action-cluster compact-actions">
                      <span>{{ step.kind }}</span>
                      <button class="secondary-button" type="button" @click="duplicatePlanStep(index)">
                        Duplicate
                      </button>
                      <button class="secondary-button" type="button" @click="removePlanStep(index)">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div v-if="step.collapsed === true" class="planner-step-summary">
                    <span v-if="step.kind === 'wait'"><strong>Wait</strong> {{ Number(step.delayMs || 0) }} ms</span>
                    <span v-else><strong>Command</strong> {{ step.commandGA || 'n/a' }}</span>
                    <span v-if="step.kind !== 'wait'"><strong>Status GA</strong> {{ step.statusGA || 'n/a' }}</span>
                    <span v-if="step.kind !== 'wait'"><strong>Payload</strong> {{ displayPayloadLabelForDpt(step.commandPayload, step.commandDPT) }}</span>
                    <span v-if="step.kind !== 'wait' && step.statusGA"><strong>Write timeout</strong> {{ Number(step.statusWriteTimeoutMs || 0) }} ms</span>
                    <span v-if="step.kind !== 'wait' && step.statusGA"><strong>Response timeout</strong> {{ Number(step.statusResponseTimeoutMs || 0) }} ms</span>
                  </div>
                  <div v-else class="planner-step-editor">
                    <label class="flow-field">
                      <span>Title</span>
                      <input v-model="step.title" type="text" placeholder="Step title">
                    </label>
                    <label class="flow-field area-editor-span">
                      <span>Description</span>
                      <textarea v-model="step.description" rows="2" placeholder="What this step checks" />
                    </label>
                    <label v-if="step.kind === 'wait'" class="flow-field">
                      <span>Wait ms</span>
                      <input v-model.number="step.delayMs" type="number" min="0" max="30000" step="100">
                    </label>
                    <section v-if="step.kind !== 'wait'" class="planner-field-group area-editor-span">
                      <h4>Command</h4>
                      <div class="planner-field-group-grid">
                        <label class="flow-field">
                          <span>Command GA</span>
                          <select v-model="step.commandGA" @change="refreshDraftStepFromCatalog(step)">
                            <option value="">Select command GA</option>
                            <option v-for="item in plannerCommandOptions" :key="item.ga" :value="item.ga">
                              {{ `${item.ga} | ${item.label}` }}
                            </option>
                          </select>
                        </label>
                        <label class="flow-field">
                          <span>Command DPT</span>
                          <input v-model="step.commandDPT" type="text" placeholder="1.001" @change="ensureStepPayloadFitsDpt(step)">
                        </label>
                        <label class="flow-field group-span">
                          <span>Command payload</span>
                          <select v-if="dptValueOptions(step.commandDPT).length" v-model="step.commandPayload">
                            <option v-for="option in dptValueOptions(step.commandDPT)" :key="`${step.id}-command-${option.value}`" :value="String(option.value)">
                              {{ option.label }}
                            </option>
                          </select>
                          <input v-else v-model="step.commandPayload" type="text" placeholder="true, false, 50">
                        </label>
                      </div>
                    </section>
                    <section v-if="step.kind !== 'wait'" class="planner-field-group area-editor-span">
                      <h4>Status</h4>
                      <div class="planner-field-group-grid">
                        <label class="flow-field group-span">
                          <span>Status GA</span>
                          <select v-model="step.statusGA" @change="refreshDraftStepFromCatalog(step)">
                            <option value="">No feedback</option>
                            <option v-for="item in plannerStatusOptions" :key="item.ga" :value="item.ga">
                              {{ `${item.ga} | ${item.label}` }}
                            </option>
                          </select>
                        </label>
                        <label class="flow-field">
                          <span>Status DPT</span>
                          <input v-model="step.statusDPT" type="text" placeholder="1.001" @change="ensureStepPayloadFitsDpt(step)">
                        </label>
                        <label class="flow-field">
                          <span>Expected payload</span>
                          <select v-if="dptValueOptions(step.statusDPT || step.commandDPT).length" v-model="step.expectedPayload">
                            <option v-for="option in dptValueOptions(step.statusDPT || step.commandDPT)" :key="`${step.id}-expected-${option.value}`" :value="String(option.value)">
                              {{ option.label }}
                            </option>
                          </select>
                          <input v-else v-model="step.expectedPayload" type="text" placeholder="Expected feedback value">
                        </label>
                      </div>
                    </section>
                    <div v-if="step.kind !== 'wait' && step.statusGA" class="planner-check-sections editor-check-sections area-editor-span">
                      <section class="planner-check-section">
                        <h4>Spontaneous Write From Status GA</h4>
                        <p class="area-detail-subhead">Wait for a spontaneous <code>GroupValue_Write</code> telegram from the status GA.</p>
                        <label class="flow-field">
                          <span>Status write timeout ms</span>
                          <input v-model.number="step.statusWriteTimeoutMs" type="number" min="500" max="60000" step="100">
                        </label>
                      </section>
                      <section class="planner-check-section">
                        <h4>Active Read Request To Status GA</h4>
                        <p class="area-detail-subhead">Send a <code>read</code> telegram to the status GA and wait for a <code>GroupValue_Response</code>.</p>
                        <label class="flow-field">
                          <span>Read response timeout ms</span>
                          <input v-model.number="step.statusResponseTimeoutMs" type="number" min="500" max="60000" step="100">
                        </label>
                      </section>
                    </div>
                    <label class="flow-field area-editor-span">
                      <span>Reason</span>
                      <input v-model="step.reason" type="text" placeholder="Why this step exists">
                    </label>
                  </div>
                </article>
              </div>
            </article>

          </div>
        </div>
      </section>

      <section v-if="state.activeTab === 'results'" class="card card-profiles">
        <div class="card-head">
          <div>
            <h2>Test Results</h2>
            <p class="area-detail-subhead">Live and saved reports generated by KNX active and read-only tests.</p>
          </div>
          <div class="card-head-actions">
            <span class="meta-chip">{{ sidebarTestResults.length }} available</span>
          </div>
        </div>
        <div class="profiles-layout results-page-layout">
          <article class="area-detail planner-sidecard">
            <div class="card-head">
              <div>
                <h3>Select Test Result</h3>
                <p class="area-detail-subhead">Choose a report to inspect metrics, detailed checks, and suggestions.</p>
              </div>
            </div>
            <div class="sidebar-results-list results-page-list">
              <div
                v-for="report in sidebarTestResults"
                :key="report.id"
                class="sidebar-result-row"
              >
                <button
                  type="button"
                  class="area-list-item sidebar-result-item"
                  :class="{ active: selectedTestResult && selectedTestResult.id === report.id, running: report.live === true }"
                  @click="focusTestResult(report.id, { openMenu: false, activateResultsTab: true, resultOnly: true })"
                >
                  <span class="sidebar-result-head">
                    <strong class="sidebar-result-title">
                      <span v-if="report.live === true" class="running-spinner" aria-hidden="true" />
                      <span>{{ testResultDisplayName(report) }}</span>
                    </strong>
                    <span class="sidebar-result-status" :class="`status-${report.overallStatus || 'pass'}`">{{ report.overallStatus || 'n/a' }}</span>
                  </span>
                  <span class="area-list-meta">{{ testResultModeLabel(report) }}<span v-if="report.live === true"> | running</span></span>
                  <span class="area-list-tags">{{ testResultAreaText(report) || formatDateTime(report.generatedAt) }}</span>
                  <span class="area-list-tags">{{ formatDateTime(report.generatedAt) }}</span>
                </button>
                <button
                  class="sidebar-result-delete-button"
                  type="button"
                  :disabled="state.deletingTestResultId === report.id"
                  @click.stop="deleteTestResult(report.id)"
                >
                  {{ state.deletingTestResultId === report.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
              <p v-if="!sidebarTestResults.length" class="empty-state sidebar-empty-state">No saved test results yet.</p>
            </div>
          </article>

          <article ref="testPlanReportRef" class="area-detail" v-if="selectedTestResult">
            <div class="card-head">
              <div>
                <h3>{{ testResultDisplayName(selectedTestResult) }}</h3>
                <p class="area-detail-subhead">{{ testResultAreaText(selectedTestResult) || formatDateTime(selectedTestResult.generatedAt) }}</p>
              </div>
              <div class="card-head-actions action-cluster">
                <span class="meta-chip">{{ testResultModeLabel(selectedTestResult) }}</span>
                <span v-if="selectedTestResult.live === true" class="meta-chip">
                  <span class="running-spinner run-chip-spinner" aria-hidden="true" />
                  <span>Running</span>
                </span>
                <span class="meta-chip">{{ selectedTestResult.overallStatus }}</span>
                <button class="secondary-button" type="button" @click="exportSelectedTestResultPdf">
                  Export PDF
                </button>
                <button class="danger-button" type="button" :disabled="!selectedTestResult || state.deletingTestResultId === selectedTestResult.id" @click="deleteTestResult(selectedTestResult?.id)">
                  {{ state.deletingTestResultId === selectedTestResult?.id ? 'Deleting...' : 'Delete' }}
                </button>
                <button class="secondary-button" type="button" @click="openSourceTestFromSelectedResult">
                  Open Source Test
                </button>
              </div>
            </div>
            <div class="metric-grid area-metrics">
              <article v-for="metric in testResultMetricCards(selectedTestResult)" :key="metric.label" class="metric">
                <span>{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
              </article>
            </div>
            <div class="report-checks">
              <article v-for="entry in testResultEntries(selectedTestResult)" :key="entry.id" class="report-check" :class="`report-${entry.status}`">
                <div class="anomaly-head">
                  <strong>{{ entry.title }}</strong>
                  <span>{{ entry.status }}</span>
                </div>
                <p class="area-detail-subhead">{{ entry.message || 'No additional details available.' }}</p>
                <div v-if="entry.detailGroups?.length" class="planner-check-sections result-check-sections">
                  <section v-for="group in entry.detailGroups" :key="`${entry.id}-${group.title}`" class="planner-check-section">
                    <h4>{{ group.title }}</h4>
                    <div class="planner-step-grid compact-grid">
                      <span v-for="detail in group.items" :key="`${entry.id}-${group.title}-${detail.label}`"><strong>{{ detail.label }}</strong> {{ detail.value }}</span>
                    </div>
                  </section>
                </div>
                <div v-else class="planner-step-grid">
                  <span v-for="detail in entry.details" :key="`${entry.id}-${detail.label}`"><strong>{{ detail.label }}</strong> {{ detail.value }}</span>
                </div>
              </article>
            </div>
            <p v-if="!testResultEntries(selectedTestResult).length" class="empty-state">No detailed entries stored for this report yet.</p>
            <div v-if="testResultSuggestions(selectedTestResult).length">
              <h4>Suggestions</h4>
              <ul class="simple-list">
                <li v-for="suggestion in testResultSuggestions(selectedTestResult)" :key="suggestion">{{ suggestion }}</li>
              </ul>
            </div>
          </article>

          <article v-else class="area-detail">
            <p class="empty-state">No test result selected.</p>
          </article>
        </div>
      </section>

      <section v-if="state.activeTab === 'overview'" class="card">
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

      <section v-if="state.activeTab === 'overview'" class="card">
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

      <section v-if="state.activeTab === 'overview'" class="card card-bus">
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

      <section v-if="state.activeTab === 'overview'" ref="flowCardRef" class="card card-flow" :class="{ 'is-fullscreen': isFlowFullscreen }">
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
          <div class="flow-field flow-field-select">
            <span>Select Nodes to Filter by</span>
            <select v-model="state.flowSelectedGa" multiple size="5">
              <option v-for="node in flowSelectableNodes" :key="node.id" :value="node.id">
                {{ `${node.id}${node.subtitle ? ` | ${node.subtitle}` : ''}` }}
              </option>
            </select>
            <label class="checkbox flow-toggle flow-toggle-inline">
              <input v-model="state.flowShowUniversalNodes" type="checkbox">
              <span>Show Universal Mode nodes</span>
            </label>
          </div>
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

      <section v-if="state.activeTab === 'overview'" class="card card-anomalies">
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

      <section v-if="state.activeTab === 'assistant'" class="card card-chat">
        <div class="card-head">
          <h2>Ask</h2>
          <span class="meta-chip">{{ nodeInfo.llmEnabled ? 'AI enabled' : 'AI disabled' }}</span>
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
          <article v-if="state.asking" class="chat-message chat-pending">
            <span class="chat-pending-spinner" aria-hidden="true"></span>
            <span>Thinking...</span>
          </article>
          <p v-if="!chatMessages.length && !state.asking" class="empty-state">Ask a question about KNX traffic. SVG responses are supported here as well.</p>
        </div>
      </section>

      <section v-if="state.activeTab === 'settings'" class="card card-settings">
        <div class="card-head">
          <div>
            <h2>Settings</h2>
            <p class="area-detail-subhead">Manage node options and full configuration import/export.</p>
          </div>
        </div>
        <div class="settings-tab-strip">
          <button class="settings-tab-button" :class="{ active: state.settingsTab === 'node' }" type="button" @click="activateSettingsTab('node')">
            KNX AI Node
          </button>
          <button class="settings-tab-button" :class="{ active: state.settingsTab === 'config' }" type="button" @click="activateSettingsTab('config')">
            Import / Export
          </button>
        </div>
        <article v-if="state.settingsTab === 'node'" class="area-detail settings-panel">
          <div class="card-head settings-panel-head">
            <h3>KNX AI Node</h3>
            <span class="meta-chip">Runtime preferences</span>
          </div>
          <p class="area-detail-subhead">Select the node used by this UI and control refresh behavior.</p>
          <div class="settings-node-grid">
            <label class="flow-field">
              <span>Node</span>
              <select v-model="state.selectedNodeId" class="node-select" @change="onNodeChange">
                <option v-for="node in state.nodes" :key="node.id" :value="node.id">
                  {{ `${node.name || 'KNX AI'}${node.gatewayName ? ` | ${node.gatewayName}` : ''}` }}
                </option>
              </select>
            </label>
            <label class="checkbox settings-node-checkbox">
              <input v-model="state.autoRefresh" type="checkbox">
              <span>Auto refresh</span>
            </label>
          </div>
        </article>
        <article v-else class="area-detail settings-panel">
          <div class="card-head settings-panel-head">
            <h3>Import / Export</h3>
            <span class="meta-chip">Full configuration</span>
          </div>
          <p class="area-detail-subhead">Export or import the full KNX AI configuration for the selected node.</p>
          <div class="card-head-actions action-cluster settings-config-actions">
            <button class="secondary-button" type="button" :disabled="!state.selectedNodeId" @click="exportFullConfig">
              Export Configuration
            </button>
            <button class="secondary-button" type="button" :disabled="!state.selectedNodeId" @click="triggerConfigImport">
              Import Configuration
            </button>
          </div>
        </article>
        <input ref="configImportRef" type="file" accept="application/json,.json" class="hidden-file-input" @change="importFullConfig">
      </section>

    </main>
    </section>

    <div v-if="state.testPlanRunConfirmOpen" class="modal-backdrop" @click="closeRunTestPlanConfirm">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="run-test-title" @click.stop>
        <h3 id="run-test-title">Start test?</h3>
        <p class="area-detail-subhead">
          {{ state.testPlanRunMode === 'repeat'
            ? 'This will send real telegrams on the KNX bus and repeat the selected test plan until you press Stop Repeat.'
            : 'This will send real telegrams on the KNX bus for the selected test plan.' }}
        </p>
        <div class="modal-actions">
          <button class="secondary-button" type="button" autofocus @click="closeRunTestPlanConfirm">
            Cancel
          </button>
          <button class="primary-button" type="button" :disabled="state.testPlanRunning" @click="runAiTestPlanDefinition(state.testPlanRunMode)">
            Start Test
          </button>
        </div>
      </div>
    </div>

    <div v-if="state.testPlanUnsavedConfirmOpen" class="modal-backdrop" @click="closeUnsavedTestPlanConfirm">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="unsaved-plan-title" @click.stop>
        <h3 id="unsaved-plan-title">Unsaved changes</h3>
        <p class="area-detail-subhead">Save or discard the current plan changes before opening {{ state.testPlanPendingActionLabel || 'another plan' }}.</p>
        <div class="modal-actions">
          <button class="secondary-button" type="button" autofocus @click="closeUnsavedTestPlanConfirm">
            Stay Here
          </button>
          <button class="secondary-button" type="button" @click="cancelTestPlanChanges(); runPendingTestPlanAction()">
            Discard Changes
          </button>
          <button class="primary-button" type="button" :disabled="state.testPlanSaving || !state.testPlanDraft" @click="saveCurrentTestPlanAndContinue">
            {{ state.testPlanSaving ? 'Saving...' : 'Save and Continue' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="state.areaUnsavedConfirmOpen" class="modal-backdrop" @click="closeAreaUnsavedConfirm">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="unsaved-area-title" @click.stop>
        <h3 id="unsaved-area-title">Unsaved changes</h3>
        <p class="area-detail-subhead">Discard the current area changes and close the editor?</p>
        <div class="modal-actions">
          <button class="secondary-button" type="button" autofocus @click="closeAreaUnsavedConfirm">
            Stay Here
          </button>
          <button class="primary-button" type="button" @click="discardAreaChangesAndCloseEditor">
            Discard and Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  --sidebar-expanded-width: 210px;
  --sidebar-collapsed-width: 60px;
  --sidebar-current-width: var(--sidebar-expanded-width);
  width: min(1600px, calc(100% - 24px));
  min-height: calc(100vh - 24px);
  margin: 12px auto;
  display: grid;
  grid-template-columns: var(--sidebar-current-width) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
  transition: grid-template-columns 0.26s ease;
}

.page-shell.sidebar-collapsed {
  --sidebar-current-width: var(--sidebar-collapsed-width);
}

.m-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 210;
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 62px;
  padding: 0 12px 0 14px;
  background: var(--hb-primary-dark);
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.m-header-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.m-logo-mark {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--soft-radius);
  font-size: 14px;
  font-weight: 800;
  color: #fff;
}

.hb-logo-text-mobile {
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.hamburger-icon {
  position: relative;
  width: 30px;
  height: 22px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.hamburger-icon span {
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: #fff;
  transition: 0.24s ease;
}

.hamburger-icon span:nth-child(1) { top: 0; }
.hamburger-icon span:nth-child(2),
.hamburger-icon span:nth-child(3) { top: 9px; }
.hamburger-icon span:nth-child(4) { top: 18px; }

.hamburger-icon-cross span:nth-child(1),
.hamburger-icon-cross span:nth-child(4) {
  left: 50%;
  width: 0;
}

.hamburger-icon-cross span:nth-child(2) { transform: rotate(45deg); }
.hamburger-icon-cross span:nth-child(3) { transform: rotate(-45deg); }

.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 180;
  border: 0;
  background: rgba(9, 12, 19, 0.48);
}

:deep(*) {
  --soft-radius: 4px;
  --hb-primary: #ff9800;
  --hb-primary-dark: #ef6c00;
}

.app-sidebar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 16px 16px;
  border-radius: var(--soft-radius);
  background: var(--hb-primary-dark);
  box-shadow: 0 26px 60px rgba(8, 10, 16, 0.34);
  color: #f6f8fb;
  overflow: hidden;
}

.sidebar-brand-wrap {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 28px;
  align-items: start;
  gap: 10px;
}

.sidebar-brand-mark {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: var(--soft-radius);
  font-weight: 800;
  font-size: 15px;
  color: #fff;
}

.sidebar-collapse-toggle {
  width: 28px;
  min-width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.08);
  color: #f4f8ff;
  cursor: pointer;
}

.sidebar-collapse-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 18px;
  line-height: 1;
  font-weight: 700;
}

.sidebar-collapse-toggle:hover {
  background: rgba(255, 255, 255, 0.16);
}

.workspace-shell {
  min-width: 0;
  padding: 10px;
  border-radius: var(--soft-radius);
  background: #f4f4f4;
  box-shadow: 0 24px 60px rgba(25, 32, 48, 0.14);
  transition: padding 0.2s ease;
}

.topbar {
  padding: 20px 22px 14px;
  border: 1px solid rgba(160, 170, 186, 0.22);
  border-radius: var(--soft-radius);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 251, 0.94) 100%);
  box-shadow: 0 12px 30px rgba(26, 32, 44, 0.08);
}

.workspace-header {
  margin-bottom: 16px;
}

.brand,
.sidebar-brand {
  margin-bottom: 6px;
  min-width: 0;
}

.eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.brand h1,
.sidebar-brand h1 {
  margin: 0;
  font-size: clamp(24px, 3.4vw, 34px);
  line-height: 1;
}

.workspace-brand h2 {
  margin: 0;
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.02;
  color: #111723;
}

.subhead {
  max-width: 860px;
  margin: 8px 0 0;
  color: inherit;
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.78;
}

.toolbar,
.statusbar,
.tab-strip,
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
  justify-content: space-between;
}

.toolbar-cluster,
.action-cluster {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.workspace-toolbar {
  margin-top: 16px;
}

.primary-button,
.preset-button,
.danger-button,
.primary-link,
.secondary-button,
.tab-button {
  border: 1px solid var(--line);
  border-radius: var(--soft-radius);
  background: #607d8b;
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 12px;
  transition: 0.18s ease;
}

.primary-button,
.primary-link,
.tab-button.active {
  border-color: transparent;
  background: var(--hb-primary);
  color: #fff;
}

.secondary-button,
.preset-button,
.tab-button {
  border-color: transparent;
  background: #607d8b;
  color: #fff;
}

.danger-button {
  border-color: transparent;
  background: #d32f2f;
  color: #fff;
}

.preset-button:hover,
.danger-button:hover,
.secondary-button:hover,
.tab-button:hover {
  background: #546e7a;
  border-color: transparent;
}

.danger-button:hover {
  background: #c62828;
  border-color: transparent;
}

.new-button {
  background: linear-gradient(180deg, #62c27a 0%, #43a85f 100%);
  border-color: transparent;
  color: #fff;
}

.new-button:hover {
  background: linear-gradient(180deg, #74cf8b 0%, #4fb46b 100%);
  border-color: transparent;
}

.primary-button:hover,
.primary-link:hover,
.tab-button.active:hover {
  background: #e68900;
  border-color: transparent;
}

.primary-button:disabled,
.preset-button:disabled,
.danger-button:disabled,
.secondary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hidden-file-input {
  display: none;
}

.node-select {
  min-width: min(360px, 100%);
}

.sidebar-select {
  min-width: 0;
  width: 100%;
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: #f6f8fb;
}

.sidebar-select option {
  color: #0f1520;
}

.node-select,
.checkbox,
.summary-pre,
.chat-log,
.anomaly-card pre {
  border: 1px solid var(--line);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.88);
}

.node-select {
  padding: 8px 10px;
  color: var(--text);
  font-size: 12px;
}

.checkbox {
  padding: 8px 10px;
  gap: 8px;
  font-size: 12px;
}

.sidebar-checkbox {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: #eef3f9;
}

.sidebar-panel {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  color: rgba(246, 248, 252, 0.88);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sidebar-nav .tab-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  padding: 15px 10px;
  border-radius: 0;
  border-color: transparent;
  background: transparent;
  color: #edf1f8;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.2;
  transition: 0.2s;
}

.sidebar-nav-icon {
  flex: 0 0 38px;
  width: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-nav-svg {
  width: 17px;
  height: 17px;
  fill: currentColor;
}

.sidebar-nav-copy {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  padding-left: 10px;
}

.sidebar-nav .sidebar-nav-child {
  width: 100%;
  margin-left: 0;
}

.sidebar-nav .tab-button.active {
  background: transparent;
  color: #fff;
}

.sidebar-nav .tab-button:hover {
  background: var(--hb-primary);
}

.sidebar-nav .tab-button:disabled {
  opacity: 0.42;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(237, 241, 248, 0.62);
}

.sidebar-nav .tab-button:disabled:hover {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav .tab-button:disabled .sidebar-nav-icon {
  color: rgba(237, 241, 248, 0.62);
}

.sidebar-nav .tab-button.active .sidebar-nav-icon {
  color: var(--hb-primary);
}

.sidebar-nav .tab-button.active:hover .sidebar-nav-icon {
  color: #fff;
}

.sidebar-nav-title {
  display: block;
  font-size: 17px;
  font-weight: 400;
}

.sidebar-nav-meta {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  opacity: 0.72;
  font-weight: 600;
}

.page-shell.sidebar-collapsed .sidebar-panel,
.page-shell.sidebar-collapsed .sidebar-footer,
.page-shell.sidebar-collapsed .sidebar-brand .eyebrow,
.page-shell.sidebar-collapsed .sidebar-brand h1,
.page-shell.sidebar-collapsed .sidebar-brand .subhead {
  display: none;
}

.page-shell.sidebar-collapsed .sidebar-brand-wrap {
  grid-template-columns: 1fr;
  justify-items: center;
}

.page-shell.sidebar-collapsed .app-sidebar {
  align-items: center;
  padding: 14px 10px;
}

.page-shell.sidebar-collapsed .sidebar-collapse-toggle {
  margin-top: 4px;
}

.page-shell.sidebar-collapsed .sidebar-nav .tab-button {
  justify-content: center;
  padding: 15px 10px;
}

.page-shell.sidebar-collapsed .sidebar-nav .sidebar-nav-child {
  width: 100%;
  margin-left: 0;
}

.page-shell.sidebar-collapsed .sidebar-nav-copy {
  display: none;
}

.sidebar-actions {
  gap: 8px;
}

.sidebar-section-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #f6f8fb;
  text-align: left;
  font: inherit;
}

.sidebar-section-toggle strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
}

.sidebar-section-toggle small {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  opacity: 0.72;
}

.sidebar-test-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow: auto;
  padding-right: 2px;
}

.sidebar-result-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: stretch;
}

.sidebar-result-delete-button {
  width: 74px;
  min-width: 74px;
  padding: 10px 8px;
  border: 1px solid rgba(136, 18, 26, 0.88);
  background: linear-gradient(180deg, rgba(183, 43, 43, 0.98) 0%, rgba(148, 23, 23, 0.98) 100%);
  color: #fff;
  font: inherit;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.sidebar-result-delete-button:hover:not(:disabled) {
  background: linear-gradient(180deg, rgba(199, 48, 48, 1) 0%, rgba(160, 27, 27, 1) 100%);
}

.sidebar-result-delete-button:disabled {
  opacity: 0.72;
  cursor: wait;
}

.sidebar-result-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 78px;
  text-align: left;
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #edf1f8;
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.sidebar-result-item.active {
  border-color: rgba(255, 255, 255, 0.34);
  background: linear-gradient(180deg, rgba(104, 119, 179, 0.64) 0%, rgba(69, 81, 124, 0.72) 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.sidebar-result-item.running {
  box-shadow: inset 0 0 0 1px rgba(240, 179, 34, 0.55);
}

.sidebar-result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.sidebar-result-head strong {
  font-size: 12px;
  font-weight: 800;
}

.sidebar-result-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.sidebar-result-item .area-list-meta,
.sidebar-result-item .area-list-tags {
  color: rgba(237, 241, 248, 0.78);
}

.sidebar-result-status {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-transform: none;
}

.sidebar-result-status.status-pass {
  color: #8fe0a8;
}

.sidebar-result-status.status-warn {
  color: #ffd17a;
}

.sidebar-result-status.status-fail {
  color: #ffb9c3;
}

.sidebar-empty-state {
  margin: 0;
  color: rgba(246, 248, 252, 0.76);
}

.results-page-layout {
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
}

.results-page-list {
  max-height: min(68vh, 760px);
  padding-right: 4px;
}

.results-page-list .sidebar-result-item {
  border-color: rgba(126, 136, 154, 0.3);
  background: linear-gradient(180deg, rgba(253, 254, 255, 1) 0%, rgba(242, 247, 253, 1) 100%);
  color: #243042;
}

.results-page-list .sidebar-result-item.active {
  border-color: rgba(239, 108, 0, 0.36);
  background: linear-gradient(180deg, rgba(255, 247, 233, 1) 0%, rgba(255, 236, 207, 1) 100%);
  box-shadow: inset 0 0 0 1px rgba(239, 108, 0, 0.12);
}

.results-page-list .sidebar-result-item.running {
  box-shadow: inset 0 0 0 1px rgba(255, 152, 0, 0.5);
}

.results-page-list .sidebar-result-item .area-list-meta,
.results-page-list .sidebar-result-item .area-list-tags {
  color: #556071;
}

.results-page-list .sidebar-result-status {
  color: #374151;
}

.results-page-list .sidebar-result-status.status-pass {
  color: #2f8d53;
}

.results-page-list .sidebar-result-status.status-warn {
  color: #ad730b;
}

.results-page-list .sidebar-result-status.status-fail {
  color: #b73845;
}

.sidebar-action-button {
  width: 100%;
  justify-content: center;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
}

.sidebar-doc-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  color: var(--hb-primary-dark);
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
}

.sidebar-doc-link:hover {
  text-decoration: underline;
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
  border-radius: 0;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
}

.status-pill,
.meta-chip,
.pill.neutral {
  color: var(--text);
}

.status-pill.error,
.pill.danger {
  color: #a4333a;
}

.pill.success {
  color: #1b7d36;
}

.status-detail {
  color: inherit;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.7;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}

.workspace-main {
  padding: 0 2px 6px;
}

.card {
  grid-column: span 6;
  min-height: 240px;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16px 34px rgba(18, 28, 45, 0.08);
}

.card-summary,
.card-bus,
.card-chat,
.card-flow,
.card-areas,
.card-profiles {
  grid-column: span 6;
}

.card-flow,
.card-anomalies {
  grid-column: span 6;
}

.card-flow,
.card-areas,
.card-profiles,
.card-settings {
  grid-column: span 12;
}

.card-chat {
  grid-column: 1 / -1;
  max-width: 50vw;
}

.card-profiles {
  border-color: rgba(84, 96, 116, 0.38);
  background: linear-gradient(180deg, rgba(244, 247, 251, 0.98) 0%, rgba(233, 238, 244, 0.98) 100%);
  box-shadow: 0 18px 36px rgba(17, 24, 39, 0.12);
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

.settings-tab-strip {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  padding: 4px;
  border: 1px solid rgba(123, 133, 151, 0.26);
  border-radius: var(--soft-radius);
  background: linear-gradient(180deg, rgba(244, 247, 251, 0.95) 0%, rgba(233, 238, 245, 0.95) 100%);
}

.settings-tab-button {
  border: 1px solid transparent;
  border-radius: var(--soft-radius);
  background: transparent;
  color: #4a5565;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  padding: 8px 12px;
  transition: 0.16s ease;
}

.settings-tab-button:hover {
  background: rgba(102, 118, 148, 0.14);
  color: #243042;
}

.settings-tab-button.active {
  border-color: rgba(239, 108, 0, 0.34);
  background: linear-gradient(180deg, rgba(255, 247, 233, 1) 0%, rgba(255, 236, 207, 1) 100%);
  color: #8e4f00;
}

.settings-panel {
  border-color: rgba(97, 108, 128, 0.34);
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(247, 250, 253, 1) 100%);
  box-shadow: 0 2px 0 rgba(121, 131, 150, 0.16);
}

.settings-panel-head {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(148, 158, 176, 0.32);
  margin-bottom: 12px;
}

.settings-node-grid {
  display: grid;
  grid-template-columns: minmax(240px, 420px) auto;
  gap: 12px;
  align-items: end;
  margin-top: 12px;
}

.settings-node-checkbox {
  width: fit-content;
  min-height: 36px;
}

.settings-config-actions {
  margin-top: 12px;
}

@media (max-width: 900px) {
  .settings-node-grid {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }

  .settings-node-checkbox {
    width: 100%;
  }
}

.plan-run-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 6px;
  border: 1px solid rgba(255, 152, 0, 0.42);
  border-radius: var(--soft-radius);
  background: linear-gradient(180deg, rgba(255, 241, 218, 0.96) 0%, rgba(255, 229, 183, 0.92) 100%);
}

.card-head h2 {
  margin: 0;
  font-size: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.metric span {
  display: block;
  margin-bottom: 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.metric strong {
  font-size: 17px;
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
  gap: 8px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(120, 120, 120, 0.14);
}

.rank-row {
  grid-template-columns: minmax(86px, 120px) minmax(0, 1fr) auto;
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
  border-radius: var(--soft-radius);
  background: rgba(255, 152, 0, 0.12);
}

.event-bar-fill {
  display: block;
  height: 100%;
  border-radius: var(--soft-radius);
  background: linear-gradient(90deg, var(--accent), #4bbf77);
}

.areas-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  margin-bottom: 16px;
}

.areas-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.area-list-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.9);
  color: var(--text);
  text-align: left;
  transition: 0.18s ease;
}

.area-list-item:hover,
.area-list-item.active {
  border-color: rgba(255, 152, 0, 0.34);
  background: var(--accent-soft);
}

.area-list-title {
  font-weight: 800;
}

.area-listbox-shell {
  width: 100%;
}

.area-search-select {
  position: relative;
}

.area-search-select-input {
  width: 100%;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.92);
  color: var(--text);
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.35;
  border-radius: var(--soft-radius);
}

.area-search-select-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 8;
  max-height: 280px;
  overflow: auto;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--soft-radius);
}

.area-search-select-option {
  display: block;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-bottom: 1px solid rgba(120, 120, 120, 0.10);
  background: transparent;
  color: var(--text);
  text-align: left;
  font-size: 12px;
  line-height: 1.35;
}

.area-search-select-option:hover,
.area-search-select-option.active {
  background: var(--accent-soft);
}

.area-list-meta,
.area-list-tags,
.area-detail-subhead {
  color: var(--muted);
  font-size: 12px;
}

.area-detail {
  min-width: 0;
  width: 100%;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: var(--soft-radius);
  background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,245,255,0.92) 100%);
}

.profiles-layout {
  display: grid;
  grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
  gap: 16px;
}

.test-planner-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
}

.result-only-layout {
  grid-template-columns: minmax(0, 1fr);
}

.card-results-focus {
  grid-column: span 12;
}

.profile-list,
.profile-editor-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.planner-sidecard {
  gap: 12px;
}

.card-profiles .area-detail {
  border-color: rgba(97, 108, 128, 0.34);
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(247, 250, 253, 1) 100%);
  box-shadow: 0 2px 0 rgba(121, 131, 150, 0.16);
}

.card-profiles .card-head {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(148, 158, 176, 0.32);
}

.card-profiles .area-detail-subhead {
  color: #4b5565;
}

.card-profiles .meta-chip,
.card-profiles .pill.neutral {
  border: 0;
  background: transparent;
  color: #1c2430;
}

.card-profiles .planner-list .area-list-item {
  border-color: rgba(136, 146, 165, 0.35);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 247, 251, 0.98) 100%);
  box-shadow: 0 1px 0 rgba(153, 163, 181, 0.14);
}

.card-profiles .planner-list .area-list-item:hover,
.card-profiles .planner-list .area-list-item.active {
  border-color: rgba(74, 90, 144, 0.62);
  background: linear-gradient(180deg, rgba(224, 230, 243, 0.96) 0%, rgba(214, 222, 238, 0.96) 100%);
}

.card-profiles .metric {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.card-profiles .metric span {
  color: #475163;
}

.card-profiles .metric strong {
  color: #161d29;
  font-size: 20px;
}

.ai-planner-shell {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid rgba(120, 120, 120, 0.24);
  background: rgba(244, 247, 252, 0.96);
  border-radius: var(--soft-radius);
}

.ai-planner-shell-head {
  margin-bottom: 12px;
}

.ai-planner-shell-head.template-builder-focus-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.ai-planner-shell-head h4 {
  margin: 0;
}

.planner-pairs {
  margin-top: 12px;
}

.planner-generation {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 14px;
  padding: 10px 12px;
  border: 1px solid rgba(126, 136, 154, 0.24);
  background: linear-gradient(180deg, rgba(240, 244, 249, 0.98) 0%, rgba(231, 237, 244, 0.98) 100%);
}

.planner-error-banner {
  margin: 14px 0 0;
  padding: 10px 12px;
  border: 1px solid #b42318;
  background: #fef3f2;
  color: #b42318;
  font-weight: 700;
  white-space: pre-wrap;
  word-break: break-word;
}

.planner-step-card {
  border: 1px solid rgba(132, 143, 160, 0.28);
  border-left: 5px solid rgba(112, 122, 141, 0.66);
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(244, 248, 252, 1) 100%);
  box-shadow: 0 2px 0 rgba(123, 133, 151, 0.14);
  cursor: default;
}

.planner-step-running {
  border-left-color: #3d5ca8;
  background: linear-gradient(180deg, rgba(245, 249, 255, 1) 0%, rgba(233, 240, 251, 1) 100%);
  box-shadow: 0 0 0 2px rgba(61, 92, 168, 0.16);
}

.planner-step-dragging {
  opacity: 0.56;
  cursor: grabbing;
}

.planner-step-drop-target {
  box-shadow: 0 0 0 2px rgba(70, 184, 109, 0.18);
  border-left-color: #46b86d;
}

.planner-step-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.planner-step-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 14px;
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(155, 165, 183, 0.24);
  background: rgba(241, 245, 249, 0.94);
  color: #4c5566;
  font-size: 12px;
}

.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 24px;
  border: 1px solid rgba(120, 120, 120, 0.18);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.84);
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
  cursor: grab;
  user-select: none;
}

.collapse-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border: 1px solid rgba(120, 120, 120, 0.18);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.84);
  color: var(--text);
  cursor: pointer;
}

.collapse-icon {
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  transition: transform 0.16s ease;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.planner-step-editor {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
  margin-top: 10px;
  padding: 12px;
  border: 1px solid rgba(155, 165, 183, 0.24);
  background: rgba(247, 250, 253, 0.96);
}

.planner-field-group {
  padding: 10px 12px 12px;
  border: 1px solid rgba(155, 165, 183, 0.28);
  background: rgba(255, 255, 255, 0.9);
}

.planner-field-group h4 {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1d2433;
}

.planner-field-group-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

.planner-field-group-grid .group-span {
  grid-column: 1 / -1;
}

.planner-check-sections {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.planner-check-section {
  padding: 10px 12px;
  border: 1px solid rgba(155, 165, 183, 0.28);
  background: rgba(255, 255, 255, 0.86);
}

.planner-check-section h4 {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1d2433;
}

.planner-check-section .area-detail-subhead {
  margin: 0 0 8px;
}

.running-headline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.running-spinner {
  width: 14px;
  height: 14px;
  display: inline-block;
  border-radius: 50%;
  border: 2px solid rgba(90, 102, 122, 0.28);
  border-top-color: #5a667a;
  animation: running-spin 0.85s linear infinite;
}

.run-button-spinner {
  margin-right: 6px;
  vertical-align: -2px;
}

.run-chip-spinner {
  width: 12px;
  height: 12px;
  margin-right: 6px;
}

@keyframes running-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.editor-check-sections {
  grid-column: 1 / -1;
}

.compact-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 0;
}

.result-check-sections .planner-check-section {
  background: rgba(250, 252, 255, 0.98);
}

.planner-step-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 14px;
  margin-top: 10px;
  color: #4c5566;
  font-size: 12px;
}

.area-detail h3,
.area-detail h4 {
  margin: 0;
}

.area-detail-subhead {
  margin: 6px 0 0;
}

.area-metrics {
  margin-top: 4px;
}

.area-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0;
}

.area-editor {
  margin: 14px 0 18px;
  padding: 12px;
  border: 1px solid rgba(120, 120, 120, 0.16);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.72);
}

.area-editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.area-editor-span {
  grid-column: 1 / -1;
}

.area-editor-note {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.compact-preset-row {
  margin-top: 10px;
}

.compact-preset-row .preset-button {
  text-align: left;
  font-size: 11px;
  padding: 7px 10px;
}

.area-ga-editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.area-ga-list,
.area-ga-catalog {
  max-height: 320px;
  overflow: auto;
}

.area-ga-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(120, 120, 120, 0.12);
}

.area-ga-main {
  min-width: 0;
  flex: 1;
}

.area-ga-actions {
  display: flex;
  align-items: end;
  gap: 10px;
  flex-wrap: wrap;
}

.area-ga-role-field {
  min-width: 148px;
}

.area-ga-item strong,
.planner-step-grid strong {
  color: var(--text);
}

.area-ga-item span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.profile-runbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 10px 12px;
  border: 1px solid rgba(118, 129, 147, 0.22);
  background: linear-gradient(180deg, rgba(239, 244, 250, 0.98) 0%, rgba(230, 236, 244, 0.98) 100%);
}

.area-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.simple-list {
  margin: 10px 0 0;
  padding-left: 18px;
}

.simple-list li {
  margin-bottom: 6px;
}

.simple-list-mono {
  font-family: "JetBrains Mono", "SFMono-Regular", monospace;
  font-size: 11px;
}

.report-checks {
  display: grid;
  gap: 10px;
  margin: 16px 0;
}

.plan-steps-stack {
  margin-left: 12px;
  padding-left: 12px;
}

.plan-draft-shell {
  margin-left: 12px;
  width: calc(100% - 12px);
}

.report-check {
  padding: 12px;
  border: 1px solid rgba(139, 149, 167, 0.28);
  border-radius: var(--soft-radius);
  border-left: 4px solid var(--line);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 1px 0 rgba(140, 150, 168, 0.14);
}

.report-pass {
  border-left-color: #46b86d;
  background: linear-gradient(180deg, rgba(247, 252, 248, 1) 0%, rgba(238, 247, 240, 1) 100%);
}

.report-warn {
  border-left-color: #d99a34;
  background: linear-gradient(180deg, rgba(255, 250, 242, 1) 0%, rgba(252, 244, 229, 1) 100%);
}

.report-fail {
  border-left-color: #d94b55;
  background: linear-gradient(180deg, rgba(255, 246, 246, 1) 0%, rgba(252, 236, 237, 1) 100%);
}

.bus-track {
  position: relative;
  height: 18px;
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid rgba(120, 120, 120, 0.2);
  border-radius: var(--soft-radius);
  background: linear-gradient(180deg, #fff8ea 0%, #fff2dc 100%);
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
  grid-template-columns: 120px minmax(180px, 1fr) minmax(220px, 1.2fr) auto;
  gap: 12px;
  align-items: start;
}

.flow-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}

.flow-field input,
.flow-field select,
.flow-field textarea {
  border: 1px solid var(--line);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
  padding: 7px 10px;
  min-height: 36px;
  box-sizing: border-box;
  line-height: 1.25;
  font-size: 12px;
}

.flow-field select {
  padding-right: 28px;
}

.flow-field textarea {
  resize: vertical;
  min-height: 62px;
  font: inherit;
}

.flow-field select[multiple],
.flow-field-select select {
  min-height: 108px;
  padding-right: 10px;
}

.compact-actions {
  justify-content: flex-end;
}

.compact-toggle {
  min-height: 40px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(34, 29, 48, 0.34);
  backdrop-filter: blur(3px);
}

.modal-card {
  width: min(420px, 100%);
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow);
}

.modal-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.flow-legend {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: nowrap;
  gap: 10px 14px;
  align-items: center;
  padding: 10px 0 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.flow-legend span {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  flex: 0 0 auto;
}

.flow-toggle {
  align-self: end;
  min-height: 44px;
  white-space: nowrap;
}

.flow-toggle-inline {
  align-self: flex-start;
  min-height: auto;
  margin-top: 6px;
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
  color: #ff9800;
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
  border-radius: var(--soft-radius);
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
  border-radius: var(--soft-radius);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,245,255,0.96) 100%);
}

.card-flow.is-fullscreen {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 18px;
  border-radius: var(--soft-radius);
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
  fill: #7a7368;
  font-size: 10px;
}

.node-payload {
  fill: #746d62;
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
  border-radius: var(--soft-radius);
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
  border-radius: var(--soft-radius);
  background: rgba(255, 255, 255, 0.88);
  color: var(--text);
  padding: 11px 14px;
}

.chat-message {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: var(--soft-radius);
}

.chat-message pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.chat-user {
  background: rgba(255, 152, 0, 0.12);
}

.chat-assistant {
  background: rgba(91, 191, 115, 0.12);
}

.chat-error {
  background: var(--err-bg);
}

.chat-pending {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(120, 120, 120, 0.08);
  color: var(--muted);
}

.chat-pending-spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(90, 102, 122, 0.28);
  border-top-color: #5a667a;
  animation: chat-pending-spin 0.75s linear infinite;
}

@keyframes chat-pending-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

:deep(.chat-svg-wrap) {
  margin-top: 10px;
  overflow: auto;
  border: 1px solid rgba(255, 152, 0, 0.25);
  border-radius: var(--soft-radius);
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
  border: 1px solid rgba(120, 120, 120, 0.16);
}

@media (max-width: 1100px) {
  .page-shell {
    width: min(100% - 12px, 1600px);
    min-height: 100vh;
    margin-top: 6px;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .m-header {
    display: flex;
  }

  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    width: 210px;
    height: 100vh;
    margin: 0;
    border-radius: 0;
    transform: translateX(-104%);
    transition: transform 0.24s ease;
    overflow-y: auto;
  }

  .page-shell.sidebar-mobile-open .app-sidebar {
    transform: translateX(0);
  }

  .workspace-shell {
    padding-top: 70px;
  }

  .app-sidebar,
  .workspace-shell {
    border-radius: var(--soft-radius);
  }

  .sidebar-nav {
    display: flex;
    grid-template-columns: none;
  }

  .card,
  .card-summary,
  .card-bus,
  .card-chat,
  .card-flow,
  .card-anomalies,
  .card-areas,
  .card-profiles {
    grid-column: span 12;
  }

  .card-chat {
    max-width: 100%;
  }
}

@media (max-width: 720px) {
  .page-shell {
    width: min(100% - 8px, 1440px);
    gap: 8px;
  }

  .workspace-shell {
    padding: 12px;
  }

  .topbar,
  .card {
    padding: 14px;
    border-radius: var(--soft-radius);
  }

  .sidebar-nav {
    grid-template-columns: none;
  }

  .rank-row,
  .event-row,
  .metric-grid,
  .flow-toolbar,
  .areas-layout,
  .area-columns,
  .profiles-layout,
  .area-ga-editor,
  .area-editor-grid,
  .planner-step-editor,
  .planner-step-grid {
    grid-template-columns: 1fr;
  }

  .statusbar {
    align-items: flex-start;
  }

  .plan-steps-stack {
    margin-left: 6px;
    padding-left: 8px;
  }

  .plan-draft-shell {
    margin-left: 6px;
    width: calc(100% - 6px);
  }
}
</style>
