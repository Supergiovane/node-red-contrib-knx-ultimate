// Launches a private Node-RED loaded with the MERGED flow (Hue tab + Matter tab) and
// leaves it OPEN so you can drive it by hand from the editor. Unlike the *-live tests,
// it does NOT auto-trigger anything: it just serves the flow and waits for Ctrl+C.
//
//   npm run avviaquesto-itest:serve
//
// - The Hue tab needs the `hue` block of config.local.json (bridge + credentials).
// - The Matter tab works against your REAL commissioned fabric ONLY if `matter.userDir`
//   is set (its storage is symlinked in and the config-node id is reused). In that case
//   your production Node-RED MUST BE STOPPED (one controller per fabric + KNX tunnel).
//   Without matter.userDir the Matter tab still loads, but on an empty fabric.

import { createRequire } from 'module'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const { loadConfig } = require('./lib/loadConfig')
const { buildFlow, buildMatterFlow } = require('./lib/buildFlow')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../')
const cfg = loadConfig()
const NR = cfg.nodered || {}
const PORT = NR.port || 1881
const M = cfg.matter || {}

// --- Resolve the real Matter fabric (optional) ---------------------------
let matterConfigId = 'itest_matter_cfg'
let matterStorageSource = null
if (M.userDir || (M.storagePath && M.storagePath.trim() !== '')) {
  const realStorageRoot = (M.storagePath && M.storagePath.trim() !== '')
    ? path.resolve(M.storagePath, '..')
    : path.join(M.userDir, 'knxultimatestorage')
  const matterDir = path.join(realStorageRoot, 'matter')
  if (fs.existsSync(matterDir)) {
    let instanceId = M.instanceId && M.instanceId.trim() !== '' ? M.instanceId : ''
    if (!instanceId) {
      const candidates = fs.readdirSync(matterDir).filter((e) => e.startsWith('knxultimate-matter-'))
      if (candidates.length === 1) instanceId = candidates[0]
    }
    if (instanceId) {
      matterConfigId = instanceId.replace(/^knxultimate-matter-/, '')
      matterStorageSource = realStorageRoot
      console.log(`[serve] Matter fabric: instance ${instanceId} -> config node id ${matterConfigId}`)
      console.log('\x1b[33m[serve] REMINDER: your production Node-RED must be STOPPED (one controller per fabric).\x1b[0m')
    } else {
      console.log('[serve] Could not auto-detect the Matter instance; the Matter tab will use an empty fabric.')
    }
  } else {
    console.log(`[serve] ${matterDir} not found; the Matter tab will use an empty fabric.`)
  }
} else {
  console.log('[serve] matter.userDir not set; the Matter tab will use an empty fabric (Hue tab still works).')
}

// --- Build the merged flow (dedup the shared KNX config) -----------------
const hue = buildFlow(cfg, { debugConsole: false })
const matter = buildMatterFlow(cfg, { debugConsole: false, matterConfigId })
const merged = []
const seen = new Set()
for (const n of [...hue.nodes, ...matter.nodes]) {
  if (seen.has(n.id)) continue
  seen.add(n.id)
  merged.push(n)
}
// Move Hue credentials out of the flow into the (plaintext) credentials file.
const hueCfgNode = merged.find((n) => n.id === hue.hueConfigId)
const flowNodes = merged.map((n) => {
  if (n.id !== hue.hueConfigId) return n
  const copy = { ...n }; delete copy.credentials; return copy
})

// --- Private userDir loading THIS repo's nodes ---------------------------
const userDir = path.join(__dirname, '.nodered-serve')
fs.mkdirSync(path.join(userDir, 'node_modules'), { recursive: true })
const link = path.join(userDir, 'node_modules', 'node-red-contrib-knx-ultimate')
try { fs.rmSync(link, { recursive: true, force: true }) } catch (error) { /* empty */ }
fs.symlinkSync(repoRoot, link, 'dir')

const storageLink = path.join(userDir, 'knxultimatestorage')
try { fs.rmSync(storageLink, { recursive: true, force: true }) } catch (error) { /* empty */ }
if (matterStorageSource) fs.symlinkSync(matterStorageSource, storageLink, 'dir')

fs.writeFileSync(path.join(userDir, 'settings.js'), `module.exports = ${JSON.stringify({
  uiPort: PORT,
  flowFile: 'flows.json',
  credentialSecret: false,
  logging: { console: { level: 'info', metrics: false, audit: false } },
  editorTheme: { tours: false }
}, null, 2)}\n`)
fs.writeFileSync(path.join(userDir, 'flows.json'), JSON.stringify(flowNodes, null, 2))
fs.writeFileSync(path.join(userDir, 'flows_cred.json'), JSON.stringify(
  hueCfgNode && hueCfgNode.id ? { [hue.hueConfigId]: hue.hueCredentials } : {}
))

// --- Spawn Node-RED and keep it open -------------------------------------
console.log(`\nStarting Node-RED on http://localhost:${PORT} ...`)
const nr = spawn('node-red', ['--userDir', userDir], { cwd: repoRoot, env: process.env, stdio: 'inherit' })

let bannerShown = false
setTimeout(() => {
  if (!bannerShown) {
    bannerShown = true
    console.log(`\n\x1b[32m➜ Editor: http://localhost:${PORT}\x1b[0m  ·  two tabs: "Light live test" (Hue) and "Matter Light live test".`)
    console.log('  Open it, press the inject buttons, watch the lamp. Press Ctrl+C here to stop.\n')
  }
}, 6000)

function shutdown () {
  console.log('\nStopping Node-RED...')
  try { nr.kill('SIGINT') } catch (error) { /* empty */ }
  setTimeout(() => { try { nr.kill('SIGKILL') } catch (error) { /* empty */ } process.exit(0) }, 1500)
}
process.on('SIGINT', shutdown)
nr.on('exit', (code) => { console.log(`Node-RED exited (code ${code}).`); process.exit(code || 0) })
