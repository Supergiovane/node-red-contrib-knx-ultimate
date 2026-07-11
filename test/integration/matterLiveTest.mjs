// Real, Node-RED-INDEPENDENT live test of the Matter Light engine.
//
// It imports the SAME production code the node uses — MatterLightEngine + the real
// classMatter controller (nodes/utils/matterEngine.mjs) — opens the ALREADY COMMISSIONED
// fabric of your Node-RED installation and drives the physical lamp via
// engine.applyState() (the exact canonical calls the node makes). Attribute reports
// flow back through the same shim used by the node.
//
// REQUIREMENT: your Node-RED must be STOPPED while this runs. A Matter fabric admits
// one active controller: this driver opens the same storage/identity your matter-config
// node uses (<userDir>/knxultimatestorage/matter + instance knxultimate-matter-<id>).
//
//   npm run avviaquesto-itest:matterlight            # scripted sequence on the real lamp
//   npm run avviaquesto-itest:matterlight -- --list  # list commissioned nodes + light endpoints
//
// config.local.json (matter block): userDir (your real Node-RED userDir, e.g.
// /Users/you/.node-red) OR storagePath; instanceId (auto-detected when empty);
// fabricLabel; nodeId (the commissioned node, see --list); endpointId.

import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const { loadConfig } = require('./lib/loadConfig')
const { createLightEngine } = require('../../nodes/utils/lightEngines')
const { matterEventToHuePatch } = require('../../nodes/utils/lightEngines/matterHueShim')
const { classMatter } = await import('../../nodes/utils/matterEngine.mjs')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cfg = loadConfig()
const M = cfg.matter || {}
const T = cfg.test || {}
const listMode = process.argv.includes('--list')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ts = () => new Date().toLocaleTimeString()
const stepDelay = T.stepDelayMs || 4000
const quietLogger = { error: (m) => console.error('[matter]', m), warn: () => {}, info: () => {}, debug: () => {} }

// ---- Resolve storage path + instance id ------------------------------------
let storagePath = M.storagePath && M.storagePath.trim() !== '' ? M.storagePath : ''
if (!storagePath) {
  if (!M.userDir || M.userDir.trim() === '') {
    console.error('config.local.json: set matter.userDir (your real Node-RED userDir, e.g. /Users/you/.node-red) or matter.storagePath.')
    process.exit(1)
  }
  storagePath = path.join(M.userDir, 'knxultimatestorage', 'matter')
}
storagePath = path.resolve(storagePath)
if (!fs.existsSync(storagePath)) {
  console.error(`Matter storage not found: ${storagePath}\nCheck matter.userDir/storagePath in config.local.json.`)
  process.exit(1)
}

let instanceId = M.instanceId && M.instanceId.trim() !== '' ? M.instanceId : ''
if (!instanceId) {
  // matter-config uses instance id "knxultimate-matter-<config node id>"; matter.js
  // stores each instance in a folder named after it. Auto-detect from the storage dir.
  const candidates = fs.readdirSync(storagePath).filter((e) => e.startsWith('knxultimate-matter-'))
  if (candidates.length === 1) {
    instanceId = candidates[0]
    console.log(`[matter] auto-detected instanceId: ${instanceId}`)
  } else if (candidates.length === 0) {
    console.error(`No 'knxultimate-matter-*' instance found in ${storagePath}. Has the controller ever run in this Node-RED?`)
    process.exit(1)
  } else {
    console.error(`Multiple controller instances found in ${storagePath}:\n  ${candidates.join('\n  ')}\nSet matter.instanceId in config.local.json to the right one.`)
    process.exit(1)
  }
}

console.log(`Matter storage: ${storagePath}\nInstance: ${instanceId}`)
console.log('\x1b[33mREMINDER: Node-RED must be STOPPED (one active controller per fabric).\x1b[0m\n')

// ---- Connect the real controller -------------------------------------------
const manager = new classMatter(storagePath, instanceId, M.fabricLabel || 'KNX-Ultimate', quietLogger)

let exiting = false
async function shutdown (code) {
  if (exiting) return
  exiting = true
  try { await manager.close() } catch (error) { /* empty */ }
  process.exit(code)
}
process.on('SIGINT', () => shutdown(0))

try {
  await manager.Connect()
} catch (error) {
  console.error('\x1b[31m✗ Controller start failed:\x1b[0m', error.message)
  console.error('  Most common cause: Node-RED is still running and holds the Matter storage.')
  await shutdown(1)
}
console.log('\x1b[32m✔ Controller started.\x1b[0m Waiting a few seconds for the commissioned nodes to connect...')
await sleep(5000)

const devices = manager.getCommissionedNodesDetails()
if (listMode) {
  console.log('\nCommissioned Matter nodes (put "nodeId" into matter.nodeId):')
  for (const d of devices) {
    console.log(`  ${d.nodeId}  "${d.name}"  (${d.vendorName || ''} ${d.productName || ''}) [${d.connectionState}]`)
    try {
      const s = manager.getNodeStructure(String(d.nodeId))
      const eps = (s.endpoints || []).filter((ep) => Array.isArray(ep.clusters) && ep.clusters.some((c) => [6, 8, 768].indexOf(Number(c.id)) !== -1))
      eps.forEach((ep) => {
        let label = null
        ;(ep.clusters || []).forEach((c) => (c.attributes || []).forEach((a) => { if (!label && a.name === 'nodeLabel' && a.value) label = String(a.value) }))
        console.log(`      endpoint ${ep.endpointId}  ${label || ep.name || ''}`)
      })
    } catch (error) { console.log(`      (structure not available: ${error.message})`) }
  }
  await shutdown(0)
}

if (!M.nodeId || String(M.nodeId).trim() === '' || String(M.nodeId).includes('matter-commissioned')) {
  console.error('config.local.json: matter.nodeId is not set. Run with --list to see the commissioned nodes, then fill matter.nodeId (and endpointId).')
  await shutdown(1)
}

// ---- Drive the lamp through the real engine ---------------------------------
const engine = createLightEngine('matter', {
  deviceId: String(M.nodeId),
  nodeId: String(M.nodeId),
  endpointId: Number(M.endpointId || 1),
  manager
})

const feedbackSeen = new Set()
manager.on('event', (event) => {
  try {
    if (String(event.nodeId) !== String(M.nodeId)) return
    if (Number(event.endpointId) !== Number(M.endpointId || 1)) return
    const patch = matterEventToHuePatch(event)
    if (!patch) return
    Object.keys(patch).forEach((k) => feedbackSeen.add(k))
    console.log(`\x1b[34m[${ts()}] FEEDBACK  ${event.attributeName} -> ${JSON.stringify(patch)}\x1b[0m`)
  } catch (error) { /* empty */ }
})

async function command (patch, human) {
  console.log(`\x1b[33m[${ts()}] COMMAND  ${human}  ->  applyState(${JSON.stringify(patch)})\x1b[0m`)
  engine.applyState(patch)
  await sleep(stepDelay)
}

console.log(`\nDriving node ${M.nodeId} endpoint ${M.endpointId || 1} (${M.deviceName || 'Matter light'})`)
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

console.log('\n=== Summary (feedback attributes received) ===')
;['on', 'brightnessPct', 'colorTempK'].forEach((k) => {
  const ok = feedbackSeen.has(k) || (k === 'colorTempK' && feedbackSeen.has('mirek'))
  console.log(`  ${ok ? '\x1b[32m✔' : '\x1b[31m✗'} ${k}\x1b[0m ${ok ? 'received' : 'NOT received'}`)
})
console.log('\nDone. Disconnecting...')
await shutdown(0)
