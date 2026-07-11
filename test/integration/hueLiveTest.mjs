// Real, Node-RED-INDEPENDENT live test of the multimodal Light node's Hue engine.
//
// It imports the SAME production code the node uses — HueLightEngine + the real
// classHUE bridge manager — connects straight to the Hue bridge from config.local.json,
// and drives the physical lamp through engine.applyState() (the exact canonical calls
// the node makes). Hue push events flow back through engine.handleIncoming() so you see
// the real feedback. No Node-RED, no KNX bus needed.
//
//   npm run avviaquesto-itest:light            # scripted sequence on the real lamp + live feedback
//
// (Hue only: Matter's controller keeps commissioning on disk and can't run a second
//  controller while Node-RED holds it, so an independent Matter driver isn't practical.)

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { loadConfig } = require('./lib/loadConfig')
const { createLightEngine } = require('../../nodes/utils/lightEngines')
const { classHUE } = await import('../../nodes/utils/hueEngine.mjs')

const cfg = loadConfig()
const H = cfg.hue || {}
const T = cfg.test || {}

for (const k of ['host', 'username', 'clientkey', 'deviceId']) {
  if (!H[k]) { console.error(`config.local.json: hue.${k} is empty — fill it first.`); process.exit(1) }
}

const stepDelay = T.stepDelayMs || 4000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ts = () => new Date().toLocaleTimeString()
const quietLogger = { error: (m) => console.error('[hue]', m), warn: () => {}, info: () => {}, debug: () => {} }

// --- Real bridge manager + our real engine -------------------------------
const manager = new classHUE(H.host, H.username, H.clientkey, H.bridgeid || '', quietLogger)

const listMode = process.argv.includes('--list')
let engine // created after we resolve the real /resource/light id (config may hold a device id)
manager.on('connected', () => console.log(`[hue] bridge connected (${H.host})`))

async function command (patch, human) {
  console.log(`\x1b[33m[${ts()}] COMMAND  ${human}  ->  applyState(${JSON.stringify(patch)})\x1b[0m`)
  const native = engine.applyState(patch)
  native.forEach((op) => console.log(`\x1b[90m           native: writeHueQueueAdd(${op.deviceId}, ${JSON.stringify(op.state)}, '${op.operation}')\x1b[0m`))
  await sleep(stepDelay)
}

async function runSequence () {
  console.log('\n=== Scripted sequence on the REAL lamp — WATCH IT ===\n')
  await command({ on: true }, 'Switch ON')
  await command({ brightnessPct: T.dimLowPct || 30 }, `Dim to ${T.dimLowPct || 30}%`)
  await command({ brightnessPct: 100 }, 'Dim to 100%')
  await command({ colorTempK: T.warmKelvin || 2700 }, `Warm white ${T.warmKelvin || 2700}K`)
  await command({ colorTempK: T.coldKelvin || 6000 }, `Cold white ${T.coldKelvin || 6000}K`)
  await command({ rgb: { r: 255, g: 0, b: 0 } }, 'Colour RED')
  await command({ rgb: { r: 0, g: 0, b: 255 } }, 'Colour BLUE')
  await command({ on: false }, 'Switch OFF')
  console.log('\nWaiting a few seconds for trailing feedback...')
  await sleep(6000)
}

async function waitConnected (timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (manager.HUEBridgeConnectionStatus === 'connected') return true
    await sleep(500)
  }
  return false
}

console.log(`Hue bridge: ${H.host} | light: ${H.deviceName || H.deviceId} (${H.deviceId})`)
console.log('Connecting to the bridge...')

let exiting = false
async function shutdown (code) {
  if (exiting) return
  exiting = true
  try { await manager.close() } catch (error) { /* empty */ }
  process.exit(code)
}
process.on('SIGINT', () => shutdown(0))

// Connect() never resolves: it holds the SSE event stream open in a for-await loop.
// So we fire it and gate on the connection status instead (same as the node does).
manager.Connect().catch((error) => console.error('[hue] Connect() error:', error && error.message ? error.message : error))

if (!(await waitConnected())) {
  console.error('\n\x1b[31m✗ Could not connect to the Hue bridge within 20s.\x1b[0m Check hue.host/username/clientkey and the network.')
  await shutdown(1)
}

// Resolve the actual /resource/light id — config.local.json may hold a *device* id,
// which the bridge rejects with 404 on /resource/light/{id}.
let lights = []
try { lights = await manager.hueApiV2.get('/resource/light') } catch (error) { console.error('[hue] cannot list lights:', error.message) }
lights = Array.isArray(lights) ? lights : []

if (listMode) {
  console.log('\nAvailable Hue lights (put the "id" into hue.deviceId):')
  lights.forEach((l) => console.log(`  ${l.id}  "${l.metadata?.name || ''}"  (device ${l.owner?.rid || '?'})`))
  await shutdown(0)
}

const target = lights.find((l) => l.id === H.deviceId) || lights.find((l) => l.owner?.rid === H.deviceId)
if (!target) {
  console.error(`\n\x1b[31m✗ hue.deviceId ${H.deviceId} is not a light on this bridge.\x1b[0m`)
  console.error('  Run:  npm run avviaquesto-itest:light -- --list   to see valid light ids, then update config.local.json.')
  await shutdown(1)
}
if (target.id !== H.deviceId) console.log(`[hue] resolved device ${H.deviceId} -> light resource ${target.id}`)

engine = createLightEngine('hue', {
  deviceId: target.id,
  grouped: H.grouped === true,
  manager,
  onStateChange: (patch) => console.log(`\x1b[34m[${ts()}] FEEDBACK (from bridge)  ${JSON.stringify(patch)}\x1b[0m`)
})
// Hue push events -> engine -> canonical feedback (same path as the node).
manager.on('event', (resource) => { try { engine.handleIncoming(resource) } catch (error) { /* empty */ } })

console.log('\x1b[32m✔ Bridge ready.\x1b[0m Note: on/off, brightness and colour-temperature feedback print above; RGB feedback (xy->rgb) is not decoded yet.')
try { await runSequence() } catch (error) { console.error('Sequence error:', error.message) }
console.log('\nDone. Disconnecting...')
await shutdown(0)
