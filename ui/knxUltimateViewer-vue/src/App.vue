<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'

const nodeKey = 'knxUltimateViewer:selectedNodeId'
const autoKey = 'knxUltimateViewer:autoRefresh'
const searchKey = 'knxUltimateViewer:search'

const queryNodeId = (() => {
  try {
    return new URLSearchParams(window.location.search).get('nodeId') || ''
  } catch (error) {
    return ''
  }
})()

const state = reactive({
  nodes: [],
  selectedNodeId: queryNodeId || loadString(nodeKey, ''),
  autoRefresh: loadBoolean(autoKey, true),
  search: loadString(searchKey, ''),
  status: 'Ready',
  loadingNodes: false,
  loadingState: false,
  data: null,
  lastError: '',
  pollHandle: null
})

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

function normalizeText (value) {
  return String(value || '').trim()
}

function preferredNodeId (nodes) {
  const queryPreferred = queryNodeId && nodes.find(node => node.id === queryNodeId) ? queryNodeId : ''
  const stored = loadString(nodeKey, '')
  const storedPreferred = stored && nodes.find(node => node.id === stored) ? stored : ''
  return queryPreferred || storedPreferred || (nodes[0] ? nodes[0].id : '')
}

async function fetchNodes ({ preserveSelection = true } = {}) {
  state.loadingNodes = true
  try {
    const data = await requestJson(apiUrl('nodes'))
    const nextNodes = Array.isArray(data && data.nodes) ? data.nodes : []
    state.nodes = nextNodes
    if (!preserveSelection || !state.selectedNodeId || !nextNodes.find(node => node.id === state.selectedNodeId)) {
      state.selectedNodeId = preferredNodeId(nextNodes)
    }
  } finally {
    state.loadingNodes = false
  }
}

async function fetchState () {
  if (!state.selectedNodeId) {
    state.data = null
    state.lastError = 'No KNX Viewer node available.'
    setStatus('No viewer nodes')
    return
  }
  state.loadingState = true
  state.lastError = ''
  setStatus('Refreshing KNX Viewer...')
  try {
    const data = await requestJson(apiUrl(`state?nodeId=${encodeURIComponent(state.selectedNodeId)}`))
    state.data = data
    setStatus('Live state loaded')
  } catch (error) {
    state.lastError = error.message || String(error)
    setStatus('Unable to load state')
  } finally {
    state.loadingState = false
  }
}

function clearPolling () {
  if (state.pollHandle) {
    clearInterval(state.pollHandle)
    state.pollHandle = null
  }
}

function schedulePolling () {
  clearPolling()
  if (!state.autoRefresh) return
  state.pollHandle = setInterval(() => {
    fetchState().catch(() => {})
  }, 3000)
}

async function refreshNow () {
  await fetchNodes({ preserveSelection: true })
  await fetchState()
}

function formatAge (value) {
  const ts = Number(value || 0)
  if (!Number.isFinite(ts) || ts <= 0) return 'n/a'
  const diff = Math.max(0, Date.now() - ts)
  if (diff < 15000) return 'just now'
  if (diff < 60000) return `${Math.round(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`
  return `${Math.round(diff / 3600000)}h ago`
}

function formatClock (value) {
  if (!value) return 'n/a'
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return 'n/a'
  return date.toLocaleString()
}

const viewerNode = computed(() => state.data && state.data.node ? state.data.node : {})
const summary = computed(() => state.data && state.data.summary ? state.data.summary : {})
const items = computed(() => Array.isArray(state.data && state.data.items) ? state.data.items : [])
const filteredItems = computed(() => {
  const search = normalizeText(state.search).toLowerCase()
  if (!search) return items.value
  return items.value.filter((item) => {
    const haystack = `${item.address || ''} ${item.devicename || ''} ${item.dpt || ''}`.toLowerCase()
    return haystack.includes(search)
  })
})
const lightItems = computed(() => filteredItems.value.filter(item => item.kind === 'light'))
const dimmerItems = computed(() => filteredItems.value.filter(item => item.kind === 'dimmer'))
const otherItems = computed(() => filteredItems.value.filter(item => item.kind === 'other').slice(0, 12))

watch(() => state.selectedNodeId, async (value, oldValue) => {
  saveString(nodeKey, value || '')
  if (!value || value === oldValue) return
  await fetchState()
})

watch(() => state.autoRefresh, (value) => {
  saveBoolean(autoKey, value)
  schedulePolling()
})

watch(() => state.search, (value) => {
  saveString(searchKey, value || '')
})

onMounted(async () => {
  await fetchNodes({ preserveSelection: false })
  await fetchState()
  schedulePolling()
})

onBeforeUnmount(() => {
  clearPolling()
})
</script>

<template>
  <div class="page-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">KNX Viewer Web</p>
        <h1>{{ viewerNode.name || 'KNX Viewer' }}</h1>
        <p class="subhead">
          Live lights and dimmer values collected by the KNX Viewer node. The visual language stays aligned with KNX AI, but focused on field states.
        </p>
      </div>

      <div class="toolbar">
        <select v-model="state.selectedNodeId" class="node-select">
          <option value="" disabled>Select KNX Viewer</option>
          <option v-for="node in state.nodes" :key="node.id" :value="node.id">
            {{ `${node.name || 'KNXViewer'}${node.gatewayName ? ` | ${node.gatewayName}` : ''}` }}
          </option>
        </select>
        <label class="checkbox">
          <input v-model="state.autoRefresh" type="checkbox">
          <span>Auto refresh</span>
        </label>
        <button class="secondary-button" type="button" :disabled="state.loadingState || state.loadingNodes" @click="refreshNow">
          Refresh
        </button>
      </div>

      <div class="statusbar">
        <span class="status-pill" :class="state.lastError ? 'status-error' : 'status-ok'">
          {{ state.lastError || state.status }}
        </span>
        <div class="pill-row">
          <span class="pill neutral">Gateway {{ viewerNode.gatewayName || 'n/a' }}</span>
          <span class="pill success">Lights on {{ summary.lightOnCount || 0 }}</span>
          <span class="pill neutral">Lights off {{ summary.lightOffCount || 0 }}</span>
          <span class="pill warn">Avg dimmer {{ summary.averageDimmerLevel || 0 }}%</span>
        </div>
      </div>
    </header>

    <section class="metric-grid">
      <article class="metric-card">
        <span class="metric-label">Detected lights</span>
        <strong>{{ summary.lightCount || 0 }}</strong>
        <p>Boolean-style KNX values currently visible to this Viewer node.</p>
      </article>
      <article class="metric-card">
        <span class="metric-label">Detected dimmers</span>
        <strong>{{ summary.dimmerCount || 0 }}</strong>
        <p>5.001-like level values rendered as dimmer cards.</p>
      </article>
      <article class="metric-card">
        <span class="metric-label">Known group addresses</span>
        <strong>{{ summary.totalItems || 0 }}</strong>
        <p>Total KNX group addresses seen by the Viewer in this runtime session.</p>
      </article>
      <article class="metric-card">
        <span class="metric-label">Last KNX update</span>
        <strong>{{ formatClock(summary.lastUpdate) }}</strong>
        <p>Most recent telegram reflected in this web page.</p>
      </article>
    </section>

    <section class="card">
      <div class="card-head">
        <h2>Lights</h2>
        <span class="meta-chip">{{ lightItems.length }} visible</span>
      </div>
      <div class="section-tools">
        <input v-model="state.search" class="search-input" type="text" placeholder="Search GA, label or DPT">
        <p class="section-note">Rendering is based on the live values currently exposed by KNX Viewer.</p>
      </div>
      <div v-if="lightItems.length" class="lights-grid">
        <article v-for="item in lightItems" :key="item.address" class="tile-card light-card" :class="{ 'is-on': item.isOn, 'is-off': !item.isOn }">
          <div class="tile-head">
            <div class="light-badge">
              <span class="light-badge-core" />
            </div>
            <span class="meta-chip">{{ item.address }}</span>
          </div>
          <h3>{{ item.devicename || item.address }}</h3>
          <p class="tile-meta">{{ item.dpt || 'no dpt' }}</p>
          <div class="tile-stats">
            <span class="pill" :class="item.isOn ? 'success' : 'neutral'">{{ item.isOn ? 'ON' : 'OFF' }}</span>
            <span class="pill neutral">Updated {{ formatAge(item.lastUpdateMs) }}</span>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">No boolean light-style values detected yet.</p>
    </section>

    <section class="card">
      <div class="card-head">
        <h2>Dimmers</h2>
        <span class="meta-chip">{{ dimmerItems.length }} visible</span>
      </div>
      <div v-if="dimmerItems.length" class="dimmer-grid">
        <article v-for="item in dimmerItems" :key="item.address" class="tile-card dimmer-card" :class="{ 'is-active': Number(item.level || 0) > 0 }">
          <div class="tile-head">
            <span class="meta-chip">{{ item.address }}</span>
            <span class="pill warn">{{ item.level || 0 }}%</span>
          </div>
          <h3>{{ item.devicename || item.address }}</h3>
          <p class="tile-meta">{{ item.dpt || 'no dpt' }}</p>
          <div class="dimmer-track">
            <span class="dimmer-fill" :style="{ width: `${item.level || 0}%` }" />
          </div>
          <div class="tile-stats">
            <span class="pill neutral">Updated {{ formatAge(item.lastUpdateMs) }}</span>
            <span class="pill" :class="Number(item.level || 0) > 0 ? 'success' : 'neutral'">
              {{ Number(item.level || 0) > 0 ? 'ACTIVE' : 'IDLE' }}
            </span>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">No dimmer values detected yet.</p>
    </section>

    <section class="card">
      <div class="card-head">
        <h2>Recent KNX Values</h2>
        <span class="meta-chip">{{ otherItems.length }} preview</span>
      </div>
      <div v-if="otherItems.length" class="other-list">
        <article v-for="item in otherItems" :key="item.address" class="other-row">
          <div>
            <strong>{{ item.devicename || item.address }}</strong>
            <p>{{ item.address }}{{ item.dpt ? ` | ${item.dpt}` : '' }}</p>
          </div>
          <div class="other-side">
            <span class="pill neutral">{{ item.payloadText || '-' }}</span>
            <span class="pill neutral">{{ formatAge(item.lastUpdateMs) }}</span>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">No additional KNX values available for preview.</p>
    </section>
  </div>
</template>

<style>
.page-shell {
  width: min(100% - 32px, 1440px);
  margin: 16px auto 28px;
}

.topbar,
.card,
.metric-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: var(--shadow);
}

.topbar,
.card {
  border-radius: 28px;
  padding: 22px;
}

.topbar {
  margin-bottom: 16px;
}

.eyebrow {
  margin: 0;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  margin-top: 8px;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
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
.pill-row,
.tile-stats,
.section-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.toolbar {
  margin-top: 18px;
}

.statusbar {
  justify-content: space-between;
  margin-top: 14px;
}

.node-select,
.checkbox,
.search-input,
.secondary-button,
.tile-card,
.other-row {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
}

.node-select,
.search-input {
  padding: 10px 12px;
  color: var(--text);
}

.node-select {
  min-width: min(420px, 100%);
}

.checkbox {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  color: var(--muted);
  font-weight: 700;
}

.secondary-button {
  padding: 10px 14px;
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.secondary-button:hover {
  background: var(--accent-soft);
  border-color: rgba(122, 104, 216, 0.4);
}

.secondary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  font-weight: 700;
}

.status-ok,
.pill.success {
  background: var(--ok-bg);
  color: #23753c;
}

.status-error {
  background: var(--err-bg);
  color: #ae2f3b;
}

.pill.neutral,
.meta-chip {
  background: var(--accent-soft);
  color: var(--muted);
}

.pill.warn {
  background: var(--warn-bg);
  color: #9c6110;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.metric-card {
  border-radius: 22px;
  padding: 18px;
}

.metric-label {
  display: block;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.metric-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  line-height: 1;
}

.metric-card p {
  margin-top: 10px;
  color: var(--muted);
  line-height: 1.45;
  font-size: 13px;
}

.card {
  margin-bottom: 16px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.section-tools {
  justify-content: space-between;
  margin-bottom: 16px;
}

.search-input {
  min-width: min(360px, 100%);
}

.section-note,
.tile-meta,
.empty-state,
.other-row p {
  color: var(--muted);
  line-height: 1.5;
}

.lights-grid,
.dimmer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
}

.tile-card {
  padding: 16px;
}

.tile-card h3 {
  margin-top: 12px;
  font-size: 18px;
  line-height: 1.2;
}

.tile-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.tile-meta {
  margin-top: 8px;
  font-size: 13px;
}

.tile-stats {
  margin-top: 14px;
}

.light-card.is-on {
  background:
    radial-gradient(circle at top center, rgba(255, 229, 96, 0.48), transparent 42%),
    linear-gradient(180deg, rgba(255, 248, 189, 0.99) 0%, rgba(255, 234, 132, 0.97) 100%);
  border-color: rgba(217, 154, 52, 0.7);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 18px 42px rgba(240, 195, 60, 0.18);
}

.light-card.is-off {
  background: linear-gradient(180deg, rgba(248, 245, 255, 0.98) 0%, rgba(240, 236, 251, 0.94) 100%);
}

.light-badge {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(98, 87, 142, 0.16);
}

.light-card.is-on .light-badge {
  background: linear-gradient(180deg, rgba(255, 251, 220, 0.95) 0%, rgba(255, 241, 170, 0.98) 100%);
  border-color: rgba(217, 154, 52, 0.5);
}

.light-badge-core {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #9da0b6;
  box-shadow: 0 0 0 6px rgba(157, 160, 182, 0.18);
}

.light-card.is-on .light-badge-core {
  width: 24px;
  height: 24px;
  background: #ffcf2e;
  box-shadow:
    0 0 0 10px rgba(255, 207, 46, 0.28),
    0 0 18px rgba(255, 207, 46, 0.55),
    0 0 38px rgba(255, 207, 46, 0.4);
}

.dimmer-card.is-active {
  background: linear-gradient(180deg, rgba(255, 251, 227, 0.98) 0%, rgba(255, 245, 200, 0.94) 100%);
  border-color: rgba(217, 154, 52, 0.35);
}

.dimmer-track {
  height: 14px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(122, 104, 216, 0.12);
}

.dimmer-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f0c33c 0%, #ffde73 45%, #7a68d8 100%);
}

.other-list {
  display: grid;
  gap: 10px;
}

.other-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
}

.other-side {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

@media (max-width: 1080px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .page-shell {
    width: min(100% - 16px, 1440px);
    margin-top: 8px;
  }

  .topbar,
  .card {
    padding: 16px;
    border-radius: 22px;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }

  .statusbar,
  .section-tools,
  .other-row {
    align-items: flex-start;
  }

  .other-row {
    flex-direction: column;
  }

  .other-side {
    justify-content: flex-start;
  }
}
</style>
