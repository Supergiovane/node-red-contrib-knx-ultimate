#!/usr/bin/env node
/*
Migrate inline node help to localized files under nodes/locales/<lang>/<node>.html
- For each nodes/*.html with a <script type="text/markdown" data-help-name="...">
  - Remove the inline help block from the node file
  - Create locale files (en, it, de, fr, es, zh-CN)
  - Content source: corresponding wiki page for each language; if not found, fall back to current inline help
*/
const fs = require('fs')
const path = require('path')

const REPO = process.cwd()
const NODES_DIR = path.join(REPO, 'nodes')
const WIKI_DIR = path.resolve(REPO, '..', 'node-red-contrib-knx-ultimate.wiki')

const LANGS = [
  { key: 'en', dir: 'en', prefix: '' },
  { key: 'it', dir: 'it', prefix: 'it-' },
  { key: 'de', dir: 'de', prefix: 'de-' },
  { key: 'fr', dir: 'fr', prefix: 'fr-' },
  { key: 'es', dir: 'es', prefix: 'es-' },
  { key: 'zh', dir: 'zh-CN', prefix: 'zh-CN-' }
]

// Map help-name (or file base) to wiki title
const HELP_TO_WIKI = new Map([
  ['knxUltimate-config', 'Gateway-configuration'],
  ['knxUltimate', 'KNX Node Configuration'],
  ['knxUltimateLogger', 'Logger-Configuration'],
  ['knxUltimateGlobalContext', 'GlobalVariable'],
  ['knxUltimateWatchDog', 'WatchDog-Configuration'],
  ['knxUltimateAlerter', 'Alerter-Configuration'],
  ['knxUltimateLoadControl', 'LoadControl-Configuration'],
  ['knxUltimateSceneController', 'SceneController-Configuration'],
  ['knxUltimateViewer', 'knxUltimateViewer'],
  ['knxUltimateAutoResponder', 'KNXAutoResponder'],
  ['knxUltimateHATranslator', 'HATranslator'],
  ['knxUltimateHueLight', 'HUE Light'],
  ['knxUltimateHueBattery', 'HUE Battery'],
  ['knxUltimateHueButton', 'HUE Button'],
  ['knxUltimateHueContactSensor', 'HUE Contact sensor'],
  ['knxUltimateHuedevice_software_update', 'HUE Device software update'],
  ['knxUltimateHueLightSensor', 'HUE Light sensor'],
  ['knxUltimateHueMotion', 'HUE Motion'],
  ['knxUltimateHueScene', 'HUE Scene'],
  ['knxUltimateHueTapDial', 'HUE Tapdial'],
  ['knxUltimateHueTemperatureSensor', 'HUE Temperature sensor'],
  ['knxUltimateHueZigbeeConnectivity', 'HUE Zigbee connectivity'],
  // hue-config handled separately already
  // Unknown in wiki -> fallback to inline
  ['knxUltimateGarageDoorBarrierOpener', null]
])

function readFileSafe (p) { try { return fs.readFileSync(p, 'utf8') } catch { return null } }

function extractInlineHelp (html) {
  const start = html.indexOf('<script type="text/markdown" data-help-name=')
  if (start === -1) return { before: html, help: null, after: '' }
  const end = html.indexOf('</script>', start)
  if (end === -1) return { before: html, help: null, after: '' }
  const before = html.slice(0, start)
  const help = html.slice(start, end + '</script>'.length)
  const after = html.slice(end + '</script>'.length)
  return { before, help, after }
}

function stripHelpWrapper (helpBlock) {
  const m = helpBlock.match(/<script[^>]*data-help-name=\"[^\"]+\"[^>]*>([\s\S]*?)<\/script>/)
  return m ? m[1].trim() : null
}

function extractWikiContent (md) {
  if (!md) return null
  // Remove first language bar and optional NAV block, then keep from first --- separator onward
  const lines = md.split(/\r?\n/)
  let i = 0
  // language bar line
  if (lines[i] && lines[i].startsWith('🌐 Language:')) i++
  // optional NAV block until '---'
  while (i < lines.length && lines[i].trim() !== '---') i++
  if (i < lines.length && lines[i].trim() === '---') i++
  return lines.slice(i).join('\n').trim()
}

function writeLocaleHelp (destDir, helpName, content) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  const out = `<script type="text/markdown" data-help-name="${helpName}">\n${content}\n</script>\n`
  fs.writeFileSync(path.join(destDir, `${helpName}.html`), out, 'utf8')
}

function migrateFile (f) {
  const html = readFileSafe(f)
  if (!html) return false
  const { before, help, after } = extractInlineHelp(html)
  if (!help) return false // no inline help
  const helpNameMatch = help.match(/data-help-name=\"([^\"]+)\"/)
  if (!helpNameMatch) return false
  const helpName = helpNameMatch[1]
  const fallbackContent = stripHelpWrapper(help) || ''
  const wikiTitle = HELP_TO_WIKI.get(helpName)

  for (const lang of LANGS) {
    let content = fallbackContent
    if (wikiTitle) {
      const base = `${lang.prefix}${wikiTitle}.md`
      const p = path.join(WIKI_DIR, base)
      const md = readFileSafe(p)
      const extracted = extractWikiContent(md || '')
      if (extracted && extracted.length > 0) content = extracted
    }
    writeLocaleHelp(path.join(NODES_DIR, 'locales', lang.dir), helpName, content)
  }

  // remove inline help from node file
  fs.writeFileSync(f, before + after, 'utf8')
  return true
}

function main () {
  const files = fs.readdirSync(NODES_DIR).filter(n => n.endsWith('.html')).map(n => path.join(NODES_DIR, n))
  let changed = 0
  for (const f of files) {
    if (path.basename(f) === 'hue-config.html') continue // already migrated
    if (migrateFile(f)) changed++
  }
  console.log(`Migrated ${changed} node help blocks to localized files.`)
}

main()
