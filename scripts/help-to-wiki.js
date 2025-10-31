#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const WIKI_DIR = path.join(ROOT, 'docs', 'wiki')
const LOCALES_DIR = path.join(ROOT, 'nodes', 'locales')
const PAGES_BASE = 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki'

const LANGS = [
  { key: 'en', dir: 'en', prefix: '', label: 'EN' },
  { key: 'it', dir: 'it', prefix: 'it-', label: 'IT' },
  { key: 'de', dir: 'de', prefix: 'de-', label: 'DE' },
  { key: 'fr', dir: 'fr', prefix: 'fr-', label: 'FR' },
  { key: 'es', dir: 'es', prefix: 'es-', label: 'ES' },
  { key: 'zh', dir: 'zh-CN', prefix: 'zh-CN-', label: '简体中文' }
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

function extractMarkdown (htmlPath) {
  if (!fs.existsSync(htmlPath)) return null
  const content = fs.readFileSync(htmlPath, 'utf8')
  const match = content.match(/<script[^>]*data-help-name="[^"]+"[^>]*>([\s\S]*?)<\/script>/i)
  if (!match) return null
  return match[1]
}

function normalizeMarkdown (raw) {
  if (!raw) return ''
  let text = raw.replace(/\r\n/g, '\n')
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<p[^>]*>/gi, '')
  text = text.replace(/&nbsp;/gi, ' ')
  text = text.replace(/\n{3,}/g, '\n\n')
  return text.trim()
}

function slugify (title) {
  return encodeURIComponent(title)
}

function resolveTargetTitle (wikiTitle, langPrefix, currentPrefix) {
  if (!langPrefix) return wikiTitle
  if (langPrefix === currentPrefix) return `${langPrefix}${wikiTitle}`
  const candidate = `${langPrefix}${wikiTitle}`
  const candidatePath = path.join(WIKI_DIR, `${candidate}.md`)
  return fs.existsSync(candidatePath) ? candidate : wikiTitle
}

function buildLanguageBar () {
  return ''
}

function buildPageContent (languageBar, body) {
  const parts = []
  if (languageBar && languageBar.trim().length) parts.push(languageBar.trim(), '')
  parts.push(body.trim(), '')
  return parts.join('\n')
}

let written = 0
for (const [helpName, wikiTitle] of HELP_TO_WIKI.entries()) {
  for (const lang of LANGS) {
    const helpPath = path.join(LOCALES_DIR, lang.dir, `${helpName}.html`)
    const markdownRaw = extractMarkdown(helpPath)
    const markdown = normalizeMarkdown(markdownRaw)
    if (!markdown) continue

    const wikiPath = path.join(WIKI_DIR, `${lang.prefix}${wikiTitle}.md`)
    const languageBar = buildLanguageBar(wikiTitle, lang.prefix)
    const body = markdown.trim()
    const content = buildPageContent(languageBar, body)
    fs.writeFileSync(wikiPath, content, 'utf8')
    written++
  }
}

console.log(`Updated ${written} wiki pages from node help files.`)
