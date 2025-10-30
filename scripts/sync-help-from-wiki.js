#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const REPO = process.cwd()
const WIKI_DIR = path.join(REPO, 'docs', 'wiki')
const LOCALES_DIR = path.join(REPO, 'nodes', 'locales')

const LANGS = [
  { key: 'en', dir: 'en', prefix: '' },
  { key: 'it', dir: 'it', prefix: 'it-' },
  { key: 'de', dir: 'de', prefix: 'de-' },
  { key: 'fr', dir: 'fr', prefix: 'fr-' },
  { key: 'es', dir: 'es', prefix: 'es-' },
  { key: 'zh', dir: 'zh-CN', prefix: 'zh-CN-' }
]

const HELP_TO_WIKI = new Map([
  ['hue-config', 'HUE Bridge configuration'],
  ['knxUltimate-config', 'Gateway-configuration'],
  ['knxUltimate', 'Device'],
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
  ['knxUltimateHueHumiditySensor', 'HUE Humidity sensor'],
  ['knxUltimateHueCameraMotion', 'HUE Camera motion'],
  ['knxUltimateHuePlug', 'HUE Plug']
])

function readFileSafe (filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (_) {
    return null
  }
}

function extractBody (markdown) {
  if (!markdown) return null
  const lines = markdown.split(/\r?\n/)
  let i = 0
  // language bar
  if (lines[i] && lines[i].startsWith('🌐')) i++
  // skip blank lines
  while (i < lines.length && lines[i].trim() === '') i++
  // navigation block
  if (lines[i] && lines[i].includes('<!-- NAV START -->')) {
    while (i < lines.length && !lines[i].includes('<!-- NAV END -->')) i++
    if (i < lines.length) i++ // skip NAV END line
  }
  while (i < lines.length && lines[i].trim() === '') i++
  if (lines[i] && lines[i].trim() === '---') {
    i++
  }
  while (i < lines.length && lines[i].trim() === '') i++
  const body = lines.slice(i).join('\n').trim()
  return body.length ? body : null
}

function ensureDir (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

let updated = 0
for (const [helpName, wikiTitle] of HELP_TO_WIKI.entries()) {
  for (const { dir, prefix } of LANGS) {
    const wikiFile = path.join(WIKI_DIR, `${prefix}${wikiTitle}.md`)
    const markdown = readFileSafe(wikiFile)
    const body = extractBody(markdown)
    if (!body) continue
    const destDir = path.join(LOCALES_DIR, dir)
    ensureDir(destDir)
    const destPath = path.join(destDir, `${helpName}.html`)
    const wrapped = `<script type="text/markdown" data-help-name="${helpName}">\n${body}\n</script>\n`
    fs.writeFileSync(destPath, wrapped, 'utf8')
    updated++
  }
}
console.log(`Updated ${updated} locale help files.`)
