// Self-contained Node-RED live test. It:
//   1. generates the test flow from config.local.json (overwriting it every run),
//   2. spawns a private Node-RED instance loading THIS repo's nodes (via a symlink),
//   3. waits for the admin API + a grace period so the KNX and Hue engines connect,
//   4. triggers the inject nodes through the admin API (so everything runs on
//      Node-RED's own KNX connection — no second tunnel), and
//   5. captures the feedback the Light node writes back, from Node-RED's own log.
//
//   npm run avviaquesto-itest:nodered-knx              # Hue Light node
//   npm run avviaquesto-itest:nodered-matter           # Matter Light node (--matter)
//
// Requires `node-red` on PATH (globally installed).
// --matter also requires your PRODUCTION Node-RED to be STOPPED: the spawned instance
// opens the SAME commissioned Matter fabric (storage symlinked from matter.userDir).

import { createRequire } from 'module'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const { loadConfig } = require('./lib/loadConfig')
const { buildFlow, buildMatterFlow } = require('./lib/buildFlow')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../')
const cfg = loadConfig()
const T = cfg.test || {}
const NR = cfg.nodered || {}
const PORT = NR.port || 1881
const matterMode = process.argv.includes('--matter')
const connectWaitMs = NR.connectWaitMs || (matterMode ? 20000 : 12000)
const stepDelay = T.stepDelayMs || 4000

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ts = () => new Date().toLocaleTimeString()

// --- 0. Resolve the real /resource/light id (config may hold a device id) ---
// The Hue node PUTs to /resource/light/{hueDevice}; a device id 404s. We query the
// bridge directly (self-signed cert) and rewrite cfg.hue.deviceId to the light id.
function hueGet (host, appkey, urlPath) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host, path: urlPath, method: 'GET', headers: { 'hue-application-key': appkey }, rejectUnauthorized: false }, (res) => {
      let d = ''
      res.on('data', (c) => { d += c })
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch (error) { reject(error) } })
    })
    req.on('error', reject)
    req.end()
  })
}
async function resolveLightId () {
  try {
    const r = await hueGet(cfg.hue.host, cfg.hue.username, '/clip/v2/resource/light')
    const lights = Array.isArray(r?.data) ? r.data : []
    const t = lights.find((l) => l.id === cfg.hue.deviceId) || lights.find((l) => l.owner?.rid === cfg.hue.deviceId)
    return t ? t.id : cfg.hue.deviceId
  } catch (error) {
    console.error('[itest] Hue light id resolve failed, using configured id:', error.message)
    return cfg.hue.deviceId
  }
}
// --- 1. Build flow + manifest -------------------------------------------
let flowNodes, injects, feedbackLabels, hueConfigId, hueCredentials
let matterStorageSource = null
if (matterMode) {
  // Locate the production Matter storage and derive the config-node id: matter-config
  // uses instance "knxultimate-matter-<node id stripped of non-alphanumerics>", and the
  // storage folder is named after the instance. Reusing that id in the generated flow
  // makes the spawned controller open the SAME commissioned fabric.
  const M = cfg.matter || {}
  const realStorageRoot = (M.storagePath && M.storagePath.trim() !== '')
    ? path.resolve(M.storagePath, '..') // storagePath points at .../knxultimatestorage/matter
    : path.join(M.userDir || '', 'knxultimatestorage')
  const matterDir = path.join(realStorageRoot, 'matter')
  if (!M.userDir && !(M.storagePath && M.storagePath.trim() !== '')) {
    console.error('config.local.json: set matter.userDir (your real Node-RED userDir) for --matter.')
    process.exit(1)
  }
  if (!fs.existsSync(matterDir)) {
    console.error(`Matter storage not found: ${matterDir}. Check matter.userDir/storagePath.`)
    process.exit(1)
  }
  let instanceId = M.instanceId && M.instanceId.trim() !== '' ? M.instanceId : ''
  if (!instanceId) {
    const candidates = fs.readdirSync(matterDir).filter((e) => e.startsWith('knxultimate-matter-'))
    if (candidates.length !== 1) {
      console.error(candidates.length === 0
        ? `No 'knxultimate-matter-*' instance found in ${matterDir}.`
        : `Multiple instances in ${matterDir}: set matter.instanceId in config.local.json.\n  ${candidates.join('\n  ')}`)
      process.exit(1)
    }
    instanceId = candidates[0]
  }
  const matterConfigId = instanceId.replace(/^knxultimate-matter-/, '')
  console.log(`[itest] matter instance: ${instanceId} -> config node id ${matterConfigId}`)
  console.log('\x1b[33mREMINDER: your production Node-RED must be STOPPED (one active controller per fabric + KNX tunnel).\x1b[0m')
  const built = buildMatterFlow(cfg, { debugConsole: true, matterConfigId })
  flowNodes = built.nodes
  injects = built.injects
  feedbackLabels = built.feedbackLabels
  matterStorageSource = realStorageRoot
} else {
  const resolvedLightId = await resolveLightId()
  if (resolvedLightId !== cfg.hue.deviceId) console.log(`[itest] resolved Hue device ${cfg.hue.deviceId} -> light resource ${resolvedLightId}`)
  cfg.hue = { ...cfg.hue, deviceId: resolvedLightId }
  const built = buildFlow(cfg, { debugConsole: true })
  injects = built.injects
  feedbackLabels = built.feedbackLabels
  // Move Hue credentials out of the flow file into the (plaintext) credentials file.
  flowNodes = built.nodes.map((n) => {
    if (n.id !== built.hueConfigId) return n
    const copy = { ...n }; delete copy.credentials; return copy
  })
  hueConfigId = built.hueConfigId
  hueCredentials = built.hueCredentials
}

// --- 2. Private userDir loading this repo's nodes ------------------------
const userDir = path.join(__dirname, '.nodered')
fs.mkdirSync(path.join(userDir, 'node_modules'), { recursive: true })
const link = path.join(userDir, 'node_modules', 'node-red-contrib-knx-ultimate')
try { fs.rmSync(link, { recursive: true, force: true }) } catch (error) { /* empty */ }
fs.symlinkSync(repoRoot, link, 'dir')

// In matter mode, the spawned matter-config computes its storage as
// <spawned userDir>/knxultimatestorage/matter: symlink the REAL storage there so the
// controller opens the already-commissioned fabric.
const spawnedStorageLink = path.join(userDir, 'knxultimatestorage')
try { fs.rmSync(spawnedStorageLink, { recursive: true, force: true }) } catch (error) { /* empty */ }
if (matterMode && matterStorageSource) {
  fs.symlinkSync(matterStorageSource, spawnedStorageLink, 'dir')
  console.log(`[itest] symlinked matter storage: ${spawnedStorageLink} -> ${matterStorageSource}`)
}

fs.writeFileSync(path.join(userDir, 'settings.js'), `module.exports = ${JSON.stringify({
  uiPort: PORT,
  flowFile: 'flows.json',
  credentialSecret: false,
  logging: { console: { level: 'info', metrics: false, audit: false } },
  editorTheme: { tours: false }
}, null, 2)}\n`)
fs.writeFileSync(path.join(userDir, 'flows.json'), JSON.stringify(flowNodes, null, 2))
fs.writeFileSync(path.join(userDir, 'flows_cred.json'), JSON.stringify(matterMode ? {} : { [hueConfigId]: hueCredentials }))

console.log(`Prepared private Node-RED userDir: ${path.relative(repoRoot, userDir)} (loads this repo's nodes)`)

// --- 3. Spawn Node-RED, capture its log ---------------------------------
let logBuf = ''
let lineTail = ''
const feedbackHits = new Set()
function ingest (chunk) {
  logBuf += chunk
  lineTail += chunk
  const lines = lineTail.split('\n')
  lineTail = lines.pop()
  for (const line of lines) {
    process.stdout.write(`\x1b[90m[node-red] ${line}\x1b[0m\n`)
    const m = line.match(/\[debug:([^\]]+)\]/)
    if (m && feedbackLabels.includes(m[1].trim())) {
      feedbackHits.add(m[1].trim())
      process.stdout.write(`\x1b[34m[${ts()}] FEEDBACK captured: ${m[1].trim()}\x1b[0m\n`)
    }
  }
}

const nr = spawn('node-red', ['--userDir', userDir], { cwd: repoRoot, env: process.env })
nr.stdout.on('data', (d) => ingest(d.toString()))
nr.stderr.on('data', (d) => ingest(d.toString()))
nr.on('exit', (code) => { if (!shuttingDown) { console.error(`\nNode-RED exited early (code ${code}).`); process.exit(1) } })

let shuttingDown = false
async function shutdown (code) {
  if (shuttingDown) return
  shuttingDown = true
  console.log('\nStopping Node-RED...')
  try { nr.kill('SIGINT') } catch (error) { /* empty */ }
  await sleep(1500)
  try { nr.kill('SIGKILL') } catch (error) { /* empty */ }
  process.exit(code)
}
process.on('SIGINT', () => shutdown(0))

// --- 4. Wait for readiness ----------------------------------------------
async function waitAdmin (timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/flows`)
      if (r.ok) return true
    } catch (error) { /* not up yet */ }
    await sleep(1000)
  }
  return false
}

async function trigger (id) {
  const r = await fetch(`http://127.0.0.1:${PORT}/inject/${id}`, { method: 'POST' })
  if (!r.ok) throw new Error(`inject ${id} -> HTTP ${r.status}`)
}

async function main () {
  console.log(`Starting Node-RED on :${PORT} ...`)
  if (!(await waitAdmin())) {
    console.error('\x1b[31m✗ Node-RED admin API never came up.\x1b[0m')
    return shutdown(1)
  }
  console.log(`\x1b[32m✔ Node-RED up.\x1b[0m Waiting ${connectWaitMs / 1000}s for the KNX + Hue engines to connect...`)
  await sleep(connectWaitMs)

  console.log('\n=== Triggering the sequence via the Node-RED admin API — WATCH THE LAMP ===\n')
  for (const inj of injects) {
    console.log(`\x1b[33m[${ts()}] INJECT  ${inj.name}\x1b[0m`)
    try { await trigger(inj.id) } catch (error) { console.error('  ', error.message) }
    await sleep(stepDelay)
  }

  console.log('\nWaiting a few seconds for trailing feedback...')
  await sleep(6000)

  console.log('\n=== Summary ===')
  if (feedbackLabels.length === 0) {
    console.log('  No feedback GAs configured.')
  } else {
    feedbackLabels.forEach((lbl) => {
      const ok = feedbackHits.has(lbl)
      console.log(`  ${ok ? '\x1b[32m✔' : '\x1b[31m✗'} ${lbl}\x1b[0m ${ok ? 'received' : 'NOT received'}`)
    })
  }
  console.log('')
  await shutdown(0)
}

main().catch(async (error) => { console.error('Fatal:', error.message); await shutdown(1) })
