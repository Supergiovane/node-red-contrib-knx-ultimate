<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { getLabels } from './labels'

const query = new URLSearchParams(window.location.search)
const queryNodeId = query.get('nodeId') || ''
const queryAccessToken = query.get('access_token') || ''
const { language, text: t } = getLabels(query.get('lang') || navigator.language)
const nodeKey = 'knxUltimateViewer:selectedNodeId'
const searchKey = 'knxUltimateViewer:search'
const pageSize = 200

function loadString (key, fallback = '') {
  try { return window.localStorage.getItem(key) || fallback } catch (error) { return fallback }
}

function saveString (key, value) {
  try { window.localStorage.setItem(key, String(value || '')) } catch (error) {}
}

function readAuthToken () {
  if (queryAccessToken.trim()) return queryAccessToken.trim()
  try {
    const candidates = []
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = String(window.localStorage.key(i) || '')
      if (!key.startsWith('auth-tokens')) continue
      try {
        const value = JSON.parse(window.localStorage.getItem(key))
        if (typeof value?.access_token !== 'string' || !value.access_token.trim()) continue
        const expiry = Number(value.expires_at || value.expiry || value.expires || 0)
        candidates.push({ token: value.access_token.trim(), expiry: Number.isFinite(expiry) ? expiry : 0 })
      } catch (error) {}
    }
    candidates.sort((a, b) => b.expiry - a.expiry)
    return candidates[0]?.token || ''
  } catch (error) { return '' }
}

const bearerAccessToken = readAuthToken()
const state = reactive({
  nodes: [],
  selectedNodeId: queryNodeId || loadString(nodeKey),
  search: loadString(searchKey),
  live: true,
  loading: true,
  nodesLoaded: false,
  data: null,
  lastError: '',
  before: '',
  updatedAt: 0
})
let requestVersion = 0
let requestController = null
let pollHandle = null
let searchHandle = null
let mounted = false
let stopped = false

function apiUrl (tail, parameters = {}) {
  const url = new URL(tail, window.location.href)
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  })
  if (queryAccessToken) url.searchParams.set('access_token', queryAccessToken)
  return url.toString()
}

async function requestJson (tail, parameters, signal) {
  const headers = bearerAccessToken ? { Authorization: `Bearer ${bearerAccessToken}` } : {}
  const response = await fetch(apiUrl(tail, parameters), { credentials: 'same-origin', headers, signal, cache: 'no-store' })
  if (response.status === 401 || response.status === 403 || (response.ok && String(response.headers.get('content-type')).includes('text/html'))) {
    throw new Error(t.authError)
  }
  let result
  try { result = await response.json() } catch (error) { throw new Error(t.responseError) }
  if (!response.ok) throw new Error(typeof result?.error === 'string' ? result.error : t.requestError)
  return result
}

function clearPolling () {
  clearTimeout(pollHandle)
  pollHandle = null
}

function cancelRequest () {
  requestVersion += 1
  requestController?.abort()
  requestController = null
  state.loading = false
  clearPolling()
}

function schedulePolling () {
  clearPolling()
  if (!stopped && state.live && state.nodesLoaded && state.selectedNodeId) {
    pollHandle = setTimeout(() => { loadHistory() }, 2000)
  }
}

async function loadHistory () {
  if (stopped || !state.selectedNodeId) return
  cancelRequest()
  const version = requestVersion
  const controller = new AbortController()
  requestController = controller
  state.loading = true
  try {
    const data = await requestJson('history', {
      nodeId: state.selectedNodeId,
      limit: pageSize,
      before: state.before,
      search: state.search.trim()
    }, controller.signal)
    if (stopped || version !== requestVersion) return
    if (!Array.isArray(data?.entries)) throw new Error(t.responseError)
    state.data = { ...data, entries: data.entries.slice(0, pageSize) }
    state.lastError = ''
    state.updatedAt = Date.now()
  } catch (error) {
    if (stopped || version !== requestVersion || error.name === 'AbortError') return
    state.lastError = error.message || t.requestError
  } finally {
    if (!stopped && version === requestVersion) {
      state.loading = false
      requestController = null
      schedulePolling()
    }
  }
}

async function loadNodes () {
  cancelRequest()
  const version = requestVersion
  const controller = new AbortController()
  requestController = controller
  state.loading = true
  try {
    const result = await requestJson('nodes', {}, controller.signal)
    if (stopped || version !== requestVersion) return false
    if (!Array.isArray(result?.nodes)) throw new Error(t.responseError)
    state.nodes = result.nodes
    state.nodesLoaded = true
    if (state.selectedNodeId && !state.nodes.some(node => node.id === state.selectedNodeId)) {
      if (queryNodeId) {
        state.lastError = t.unknownViewer
        return false
      }
      state.selectedNodeId = ''
    }
    if (!state.selectedNodeId) state.selectedNodeId = state.nodes[0]?.id || ''
    state.lastError = state.selectedNodeId ? '' : t.noViewers
    return Boolean(state.selectedNodeId)
  } catch (error) {
    if (!stopped && version === requestVersion && error.name !== 'AbortError') state.lastError = error.message || t.requestError
    return false
  } finally {
    if (!stopped && version === requestVersion) {
      state.loading = false
      requestController = null
    }
  }
}

function resetPage () {
  state.before = ''
  state.data = null
  state.updatedAt = 0
  state.lastError = ''
}

async function retry () {
  if (!state.nodesLoaded || !state.nodes.some(node => node.id === state.selectedNodeId)) {
    mounted = false
    const available = await loadNodes()
    mounted = true
    if (!available) return
  }
  await loadHistory()
}

function toggleLive () {
  clearTimeout(searchHandle)
  cancelRequest()
  state.live = !state.live
  if (state.live) {
    state.before = ''
    loadHistory()
  }
}

function showNewest () {
  cancelRequest()
  state.before = ''
  loadHistory()
}

function showOlder () {
  const cursor = state.data?.nextCursor
  if (!cursor || !state.data?.hasMore) return
  cancelRequest()
  state.live = false
  state.before = cursor
  loadHistory()
}

const viewerNode = computed(() => state.data?.node || state.nodes.find(node => node.id === state.selectedNodeId) || {})
const entries = computed(() => state.data?.entries || [])
const status = computed(() => state.lastError ? t.offline : state.live ? t.live : t.paused)
const storageError = computed(() => state.data?.storageError || '')
const clockFormatter = new Intl.DateTimeFormat(language, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3, hour12: false })

function formatClock (value) {
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? clockFormatter.format(date) : '—'
}

function timestamp (entry) { return entry.timestampMs ?? entry.timestamp }
function timestampIso (entry) {
  const date = new Date(timestamp(entry))
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined
}
function telegramType (entry) {
  const event = String(entry.event || '').trim()
  const types = { groupvalue_read: 'Read', groupvalue_write: 'Write', groupvalue_response: 'Response', update_nowrite: 'Update' }
  return types[event.toLowerCase()] || event.replace(/_/g, ' ') || '—'
}
function isRead (entry) { return telegramType(entry).toLowerCase() === 'read' }
function payloadText (entry) {
  if (isRead(entry)) return '—'
  const text = entry.payloadText ?? (typeof entry.payload === 'object' ? JSON.stringify(entry.payload) : entry.payload)
  return text === undefined || text === null || text === '' ? '—' : String(text)
}

watch(() => state.selectedNodeId, () => {
  saveString(nodeKey, state.selectedNodeId)
  if (!mounted) return
  clearTimeout(searchHandle)
  cancelRequest()
  resetPage()
  if (state.selectedNodeId) loadHistory()
})

watch(() => state.search, () => {
  saveString(searchKey, state.search)
  if (!mounted) return
  clearTimeout(searchHandle)
  cancelRequest()
  resetPage()
  searchHandle = setTimeout(() => { loadHistory() }, 300)
})

onMounted(async () => {
  document.documentElement.lang = language
  document.title = t.title
  const available = await loadNodes()
  // Flush selection watchers before enabling user-driven requests.
  await Promise.resolve()
  mounted = true
  if (available && !stopped) await loadHistory()
})

onBeforeUnmount(() => {
  stopped = true
  mounted = false
  clearTimeout(searchHandle)
  cancelRequest()
})
</script>

<template>
  <main class="viewer">
    <header class="heading">
      <div class="heading-title">
        <h1>{{ t.title }}</h1>
        <span class="viewer-name">{{ viewerNode.name || '' }}</span>
        <span v-if="viewerNode.gatewayName" class="gateway-name">{{ viewerNode.gatewayName }}</span>
      </div>
      <p>{{ t.subtitle }} <span class="separator" aria-hidden="true">·</span> <span>{{ t.history }}</span></p>
    </header>

    <div class="toolbar">
      <label v-if="state.nodes.length > 1" class="viewer-picker">
        <span class="visually-hidden">{{ t.viewer }}</span>
        <select v-model="state.selectedNodeId" :aria-label="t.viewer">
          <option v-if="!state.nodes.some(node => node.id === state.selectedNodeId)" :value="state.selectedNodeId" disabled>{{ state.selectedNodeId }}</option>
          <option v-for="node in state.nodes" :key="node.id" :value="node.id">{{ node.name || node.id }}{{ node.gatewayName ? ` · ${node.gatewayName}` : '' }}</option>
        </select>
      </label>
      <div class="search-field">
        <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m12.5 12.5 4 4" /></svg>
        <input v-model="state.search" type="search" :aria-label="t.search" :placeholder="t.search" autocomplete="off" spellcheck="false">
      </div>
      <span class="live-status" :class="{ paused: !state.live, offline: state.lastError }" role="status"><span aria-hidden="true" />{{ status }}</span>
      <button class="live-button" type="button" :aria-pressed="!state.live" :disabled="!state.nodes.some(node => node.id === state.selectedNodeId)" @click="toggleLive">
        <svg v-if="state.live" aria-hidden="true" viewBox="0 0 16 16"><path d="M5 3v10M11 3v10" /></svg>
        <svg v-else aria-hidden="true" viewBox="0 0 16 16"><path d="m5 3 7 5-7 5Z" /></svg>
        {{ state.live ? t.pause : t.resume }}
      </button>
    </div>

    <div v-if="state.lastError" class="notice error-notice" role="alert">
      <span>{{ state.lastError }}</span>
      <button type="button" :disabled="state.loading" @click="retry">{{ t.retry }}</button>
    </div>
    <div v-if="storageError" class="notice storage-notice" role="alert">{{ t.storageError }} <span>{{ storageError }}</span></div>

    <section class="monitor" :aria-label="t.table" :aria-busy="state.loading">
      <div class="table-scroll" tabindex="0" :aria-label="t.table">
        <table>
          <caption class="visually-hidden">{{ t.table }}</caption>
          <thead>
            <tr><th scope="col" class="time-column">{{ t.time }}</th><th scope="col" class="type-column">{{ t.telegramType }}</th><th scope="col" class="source-column">{{ t.source }}</th><th scope="col" class="address-column">{{ t.address }}</th><th scope="col" class="name-column">{{ t.name }}</th><th scope="col" class="dpt-column">{{ t.dpt }}</th><th scope="col" class="value-column">{{ t.previous }}</th><th scope="col" class="value-column">{{ t.value }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="entry in entries" :key="entry.id">
              <td class="time-cell"><time :datetime="timestampIso(entry)">{{ formatClock(timestamp(entry)) }}</time></td>
              <td class="type-cell" :title="entry.event || undefined">{{ telegramType(entry) }}</td>
              <td class="mono">{{ entry.source || '—' }}</td>
              <td class="mono address-cell">{{ entry.address || '—' }}</td>
              <td class="name-cell">{{ entry.devicename || '—' }}</td>
              <td class="mono">{{ entry.dpt || '—' }}</td>
              <td class="payload-cell previous-cell" :title="!isRead(entry) && entry.previousPayloadText == null ? t.firstValue : undefined">{{ isRead(entry) ? '—' : entry.previousPayloadText ?? '—' }}</td>
              <td class="payload-cell current-cell">{{ payloadText(entry) }}<span v-if="!isRead(entry) && entry.payloadmeasureunit" class="unit"> {{ entry.payloadmeasureunit }}</span></td>
            </tr>
          </tbody>
        </table>
        <div v-if="!entries.length" class="empty-state" role="status">
          <p v-if="state.loading">{{ t.loadingHistory }}</p>
          <template v-else-if="!state.lastError">
            <p>{{ state.search.trim() ? t.emptySearch : t.empty }}</p>
            <span v-if="!state.search.trim()">{{ t.emptyHint }}</span>
          </template>
          <p v-else>{{ t.requestError }}</p>
        </div>
      </div>
      <footer class="table-footer">
        <span class="row-count">{{ entries.length }} {{ t.rows }}<span v-if="state.before" class="history-tag"> · {{ t.historical }}</span></span>
        <nav class="pagination" :aria-label="t.history">
          <button type="button" :disabled="!state.before || state.loading" @click="showNewest">{{ t.newest }}</button>
          <button type="button" :disabled="!state.data?.hasMore || !state.data?.nextCursor || state.loading" @click="showOlder">{{ t.older }}</button>
        </nav>
      </footer>
    </section>

    <footer class="page-footer">
      <span>{{ t.retained }}</span>
      <span v-if="state.updatedAt" class="updated-at">{{ t.updated }} {{ formatClock(state.updatedAt) }}</span>
    </footer>
  </main>
</template>
