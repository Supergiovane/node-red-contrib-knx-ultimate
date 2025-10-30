#!/usr/bin/env node
// NOTE: Whenever a node is added or removed from the project, remember to
// update the wiki home pages and the presentation in
// tutorial/knxUltimate-AllNodes-Presentazione.md so the menu stays in sync.
/*
 Interactive helper to add a page link to the header menu config (wiki-menu.json).
 - Prompts for base English page title (exact wiki page title, e.g., "Quick-Start")
 - Prompts for target section (existing or new)
 - Optionally creates a new section with labels per language
 - Optionally customizes item labels per language (otherwise uses EN for all)
 - Writes scripts/wiki-menu.json; then run: npm run wiki:inject-header
*/

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const translate = require('translate-google')

// Paths
const REPO = process.cwd()
const WIKI_DIR = path.join(REPO, 'docs', 'wiki')
const NODES_DIR = path.join(REPO, 'nodes')

const CFG_PATH = path.join(__dirname, 'wiki-menu.json')

function loadCfg () {
  return JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'))
}
function saveCfg (cfg) {
  fs.writeFileSync(CFG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8')
}

function ask (rl, q) {
  return new Promise(res => rl.question(q, a => res(a.trim())))
}

async function run () {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const cfg = loadCfg()

  console.log('Add page to wiki menu')
  const page = await ask(rl, 'Page title (EN, exact wiki title, e.g., "Quick-Start"): ')
  if (!page) { rl.close(); return }

  console.log('\nChoose section:')
  cfg.sections.forEach((s, i) => console.log(`  ${i + 1}) ${s.labels.en} [key=${s.key}]`))
  console.log('  n) New section')
  const sel = await ask(rl, 'Your choice: ')

  let section
  if (sel.toLowerCase() === 'n') {
    const key = await ask(rl, 'New section key (e.g., gettingStarted): ')
    const en = await ask(rl, 'New section label EN: ')
    const labels = { en }
    for (const lang of NON_EN_LANGS) {
      const response = await ask(rl, `New section label ${lang.key.toUpperCase()} (leave empty to auto-translate): `)
      labels[lang.key] = response || await autoTranslate(en, lang.translate)
    }
    section = { key, labels, items: [] }
    cfg.sections.push(section)
  } else {
    const idx = parseInt(sel, 10) - 1
    if (isNaN(idx) || idx < 0 || idx >= cfg.sections.length) {
      console.error('Invalid selection.')
      rl.close()
      return
    }
    section = cfg.sections[idx]
  }

  const custom = (await ask(rl, 'Custom labels per language? (y/N): ')).toLowerCase() === 'y'
  const labels = {}
  for (const lang of LANGS) {
    labels[lang.key] = page
  }
  if (custom) {
    const enLabel = await ask(rl, 'Label EN: ')
    labels.en = enLabel || page
    for (const lang of NON_EN_LANGS) {
      const value = await ask(rl, `Label ${lang.key.toUpperCase()} (leave empty to auto-translate): `)
      labels[lang.key] = value || await autoTranslate(labels.en, lang.translate)
    }
  }

  // Avoid duplicates
  if (section.items.some(i => i.type === 'page' && i.page === page)) {
    console.log('Item already exists in that section.')
    rl.close()
    return
  }

  section.items.push({ type: 'page', labels, page })
  saveCfg(cfg)
  rl.close()
  console.log('Saved. Now run: npm run wiki:inject-header')
  try {
    // Also generate localized node help files, if this wiki page maps to a node help
    generateLocalizedHelpForPage(page)
  } catch (e) {
    console.warn('Help generation skipped:', e.message)
  }
}

run()

// ---- Helpers to generate localized help files from wiki pages ----

// Map node help-name -> wiki page title
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
  ['knxUltimateHueContactSensor', 'HUE Contact sensor'],
  ['knxUltimateGarageDoorBarrierOpener', null] // no wiki page
])

// Build inverse map: wiki title -> help-name
const WIKI_TO_HELP = (() => {
  const m = new Map()
  for (const [help, wiki] of HELP_TO_WIKI.entries()) {
    if (wiki) m.set(wiki, help)
  }
  return m
})()

const LANGS = [
  { key: 'en', dir: 'en', prefix: '', translate: 'en' },
  { key: 'it', dir: 'it', prefix: 'it-', translate: 'it' },
  { key: 'de', dir: 'de', prefix: 'de-', translate: 'de' },
  { key: 'fr', dir: 'fr', prefix: 'fr-', translate: 'fr' },
  { key: 'es', dir: 'es', prefix: 'es-', translate: 'es' },
  { key: 'zh', dir: 'zh-CN', prefix: 'zh-CN-', translate: 'zh-CN' }
]
const NON_EN_LANGS = LANGS.filter(lang => lang.key !== 'en')

async function autoTranslate (baseText, langCode) {
  if (!baseText) return ''
  try {
    return await translate(baseText, { to: langCode })
  } catch (error) {
    return baseText
  }
}

function extractWikiContent (md) {
  if (!md) return null
  const lines = md.split(/\r?\n/)
  let i = 0
  if (lines[i] && lines[i].startsWith('🌐 Language:')) i++
  while (i < lines.length && lines[i].trim() !== '---') i++
  if (i < lines.length && lines[i].trim() === '---') i++
  return lines.slice(i).join('\n').trim()
}

function readFileSafe (p) { try { return fs.readFileSync(p, 'utf8') } catch { return null } }

function writeLocaleHelp (destDir, helpName, content) {
  if (!content) return
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  const out = `<script type="text/markdown" data-help-name="${helpName}">\n${content}\n</script>\n`
  fs.writeFileSync(path.join(destDir, `${helpName}.html`), out, 'utf8')
}

function generateLocalizedHelpForPage (wikiTitle) {
  const helpName = WIKI_TO_HELP.get(wikiTitle)
  if (!helpName) {
    console.log(`No node help mapping for wiki page: ${wikiTitle}`)
    return
  }
  for (const lang of LANGS) {
    const wikiFile = path.join(WIKI_DIR, `${lang.prefix}${wikiTitle}.md`)
    const md = readFileSafe(wikiFile)
    const content = extractWikiContent(md || '')
    if (!content) continue
    const destDir = path.join(NODES_DIR, 'locales', lang.dir)
    writeLocaleHelp(destDir, helpName, content)
  }
  console.log(`Localized help updated for node '${helpName}' from wiki page '${wikiTitle}'.`)
}
