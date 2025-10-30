#!/usr/bin/env node
/*
 Injects/updates a compact navigation header below the language bar on every wiki page.
 The header is localized based on filename prefix: it- / de- / zh-CN- / (default EN).
 It is wrapped between markers so it can be updated idempotently:
   <!-- NAV START -->
   ... one-line header ...
   <!-- NAV END -->
 Insertion point: right after the language bar and before the first '---' separator when present.
*/

const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const WIKI_DIR = path.join(ROOT, 'docs', 'wiki')
const ABS = 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/'
const MENU_CFG = path.join(__dirname, 'wiki-menu.json')

function listMarkdown (dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...listMarkdown(p))
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p)
  }
  return out
}

function detectLang (fileBase) {
  if (fileBase.startsWith('it-')) return 'it'
  if (fileBase.startsWith('de-')) return 'de'
  if (fileBase.startsWith('zh-CN-')) return 'zh'
  return 'en'
}

function slugify (title) { return title.replace(/ /g, '+') }

function pageUrl (lang, title) {
  const slug = slugify(title)
  const pref = lang === 'en' ? '' : (lang === 'zh' ? 'zh-CN-' : lang + '-')
  return ABS + pref + slug
}

const LABELS = {
  en: {
    nav: 'Navigation',
    home: 'Home',
    overview: 'Overview',
    changelog: 'Changelog',
    faq: 'FAQ',
    security: 'Security',
    docsLang: 'Docs: Language bar',
    knxMain: 'KNX Device',
    gateway: 'Gateway',
    device: 'Device',
    protections: 'Protections',
    knxOther: 'Other KNX Nodes',
    scene: 'Scene Controller',
    watchdog: 'WatchDog',
    logger: 'Logger',
    global: 'Global Context',
    alerter: 'Alerter',
    load: 'Load Control',
    viewer: 'Viewer',
    autoresp: 'Auto Responder',
    ha: 'HA Translator',
    hue: 'HUE',
    bridge: 'Bridge',
    light: 'Light',
    battery: 'Battery',
    button: 'Button',
    contact: 'Contact',
    devsw: 'Device SW update',
    lightsensor: 'Light sensor',
    motion: 'Motion',
    sceneH: 'Scene',
    tapdial: 'Tap Dial',
    temperature: 'Temperature',
    zigbee: 'Zigbee connectivity',
    samples: 'Samples'
  },
  it: {
    nav: 'Navigazione',
    home: 'Home',
    overview: 'Panoramica',
    changelog: 'Changelog',
    faq: 'FAQ',
    security: 'Sicurezza',
    docsLang: 'Docs: Barra lingue',
    knxMain: 'Nodo KNX Dispositivo',
    gateway: 'Gateway',
    device: 'Dispositivo',
    protections: 'Protezioni',
    knxOther: 'Altri Nodi KNX',
    scene: 'Scene Controller',
    watchdog: 'WatchDog',
    logger: 'Logger',
    global: 'Global Context',
    alerter: 'Alerter',
    load: 'Controllo Carico',
    viewer: 'Viewer',
    autoresp: 'Auto Responder',
    ha: 'Traduttore HA',
    hue: 'HUE',
    bridge: 'Bridge',
    light: 'Luce',
    battery: 'Batteria',
    button: 'Pulsante',
    contact: 'Contatto',
    devsw: 'Aggiornamento SW',
    lightsensor: 'Sensore Luce',
    motion: 'Movimento',
    sceneH: 'Scena',
    tapdial: 'Tap Dial',
    temperature: 'Temperatura',
    zigbee: 'Connettività Zigbee',
    samples: 'Esempi'
  },
  de: {
    nav: 'Navigation',
    home: 'Startseite',
    overview: 'Übersicht',
    changelog: 'Changelog',
    faq: 'FAQ',
    security: 'Sicherheit',
    docsLang: 'Doku: Sprachleiste',
    knxMain: 'KNX Geräteknoten',
    gateway: 'Gateway',
    device: 'Gerät',
    protections: 'Knotenschutz',
    knxOther: 'Weitere KNX‑Knoten',
    scene: 'Szenencontroller',
    watchdog: 'WatchDog',
    logger: 'Logger',
    global: 'Global Context',
    alerter: 'Alerter',
    load: 'Laststeuerung',
    viewer: 'Viewer',
    autoresp: 'Auto‑Responder',
    ha: 'HA‑Übersetzer',
    hue: 'HUE',
    bridge: 'Bridge',
    light: 'Licht',
    battery: 'Batterie',
    button: 'Taster',
    contact: 'Kontaktsensor',
    devsw: 'Geräte‑SW‑Update',
    lightsensor: 'Lichtsensor',
    motion: 'Bewegung',
    sceneH: 'Szene',
    tapdial: 'Tap Dial',
    temperature: 'Temperatur',
    zigbee: 'Zigbee‑Konnektivität',
    samples: 'Beispiele'
  },
  zh: {
    nav: '导航',
    home: '首页',
    overview: '概览',
    changelog: '更新日志',
    faq: '常见问题',
    security: '安全',
    docsLang: '文档：语言栏',
    knxMain: 'KNX 设备',
    gateway: '网关',
    device: '设备',
    protections: '节点保护',
    knxOther: '其他 KNX 节点',
    scene: '场景控制器',
    watchdog: '看门狗',
    logger: '日志节点',
    global: '全局上下文',
    alerter: '告警器',
    load: '负载控制',
    viewer: '查看器',
    autoresp: '自动响应',
    ha: 'HA 翻译器',
    hue: 'HUE',
    bridge: 'Bridge',
    light: '灯',
    battery: '电池',
    button: '按钮',
    contact: '接触',
    devsw: '设备软件更新',
    lightsensor: '光照传感器',
    motion: '运动',
    sceneH: '场景',
    tapdial: 'Tap Dial',
    temperature: '温度',
    zigbee: 'Zigbee 连接',
    samples: '示例'
  }
}

function buildHeader (lang) {
  const L = LABELS[lang]
  const mk = (t) => pageUrl(lang, t)
  const cfg = JSON.parse(fs.readFileSync(MENU_CFG, 'utf8'))

  const lines = []
  lines.push(`${L.nav}: [${L.home}](${mk('Home')})`)

  for (const section of cfg.sections) {
    const sLabel = section.labels[lang] || section.labels.en
    const parts = []
    for (const it of section.items) {
      const label = (it.labels && (it.labels[lang] || it.labels.en)) || 'Link'
      const href = it.type === 'url' ? it.url : mk(it.page)
      parts.push(`[${label}](${href})`)
    }
    lines.push(`${sLabel}: ${parts.join(' • ')}`)
  }

  return lines
    .map((line, idx) => (idx === lines.length - 1 ? line : `${line}  `))
    .join('\n')
}

function updateFile (file) {
  const base = path.basename(file)
  if (base === '_Sidebar.md' || base === '_Footer.md') return false
  const lang = detectLang(base)
  const header = buildHeader(lang)
  const NAV_START = '<!-- NAV START -->'
  const NAV_END = '<!-- NAV END -->'

  const content = fs.readFileSync(file, 'utf8')
  const lines = content.split(/\r?\n/)
  if (!lines.length) return false
  const hasLangBar = lines[0].startsWith('🌐 Language:')

  // If header exists, replace block
  const startIdx = lines.findIndex(l => l.trim() === NAV_START)
  const endIdx = lines.findIndex(l => l.trim() === NAV_END)
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const prev = lines.slice(startIdx + 1, endIdx).join('\n')
    if (prev.trim() === header.trim()) return false // no change
    lines.splice(startIdx, endIdx - startIdx + 1, NAV_START, header, NAV_END)
    fs.writeFileSync(file, lines.join('\n'), 'utf8')
    return true
  }

  // Insert below language bar and before first '---' separator when present
  let insertAt = hasLangBar ? 1 : 0
  const sepSearchStart = hasLangBar ? 1 : 0
  const sepIdx = lines.slice(sepSearchStart, sepSearchStart + 6).findIndex(l => l.trim() === '---')
  if (sepIdx !== -1) insertAt = sepSearchStart + sepIdx // place right before the '---'

  lines.splice(insertAt, 0, NAV_START, header, NAV_END)
  const afterNav = insertAt + 3
  if (afterNav < lines.length && lines[afterNav].trim() !== '') {
    lines.splice(afterNav, 0, '')
  }
  fs.writeFileSync(file, lines.join('\n'), 'utf8')
  return true
}

const files = listMarkdown(WIKI_DIR)
let changed = 0; let skipped = 0
for (const f of files) {
  try {
    if (updateFile(f)) changed++; else skipped++
  } catch (e) {
    console.error('Error processing', f, e.message)
  }
}
console.log(`Header injected/updated in ${changed} pages. Unchanged/skipped: ${skipped}.`)
