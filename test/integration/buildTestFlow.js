'use strict'
// Writes a SINGLE importable Node-RED flow with TWO tabs (Hue Light + Matter Light)
// from config.local.json. Output: test/integration/flow.local.json (git-ignored;
// contains Hue credentials).
//
//   npm run avviaquesto-itest:buildflow
//
// Import it in Node-RED (Menu -> Import); each light gets its own flow tab.

const fs = require('fs')
const path = require('path')
const { loadConfig } = require('./lib/loadConfig')
const { buildFlow, buildMatterFlow } = require('./lib/buildFlow')

const cfg = loadConfig()

const hue = buildFlow(cfg, { debugConsole: false })          // tab: itest_tab
const matter = buildMatterFlow(cfg, { debugConsole: false }) // tab: itest_mtab

// Merge both flows into one. They share the same KNX gateway config node
// (id itest_knx_cfg): keep the first, drop the duplicate so the flow stays valid.
const merged = []
const seen = new Set()
for (const n of [...hue.nodes, ...matter.nodes]) {
  if (seen.has(n.id)) continue
  seen.add(n.id)
  merged.push(n)
}

const outPath = path.join(__dirname, 'flow.local.json')
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2))

// Remove the old separate Matter file if a previous run created it.
const legacy = path.join(__dirname, 'flow-matter.local.json')
try { if (fs.existsSync(legacy)) fs.rmSync(legacy) } catch (error) { /* empty */ }

console.log(`\nGenerated ${merged.length} nodes -> ${path.relative(process.cwd(), outPath)}`)
console.log('  · tab "KNX-Ultimate • Light live test"        -> Hue Light node')
console.log('  · tab "KNX-Ultimate • Matter Light live test" -> Matter Light node')
console.log('\nIt contains Hue credentials, so it is git-ignored (*.local.*).')
console.log('Import into Node-RED: Menu (≡) -> Import -> select the file -> Deploy.')
console.log('On the Matter tab: after import, point the Matter Light node to YOUR existing Matter controller and re-pick the light.')
console.log('Then push the inject buttons and watch the lamp + the feedback debugs.\n')
