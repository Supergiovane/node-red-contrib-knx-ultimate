#!/usr/bin/env node
/**
 * Generates navigation metadata for the wiki pages based on scripts/wiki-menu.json.
 * Outputs a data file at docs/_data/wiki-nav.json consumed by the Jekyll layout/include.
 */
const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const WIKI_DIR = path.join(ROOT, 'docs', 'wiki')
const MENU_PATH = path.join(__dirname, 'wiki-menu.json')
const DATA_DIR = path.join(ROOT, 'docs', '_data')
const OUTPUT_PATH = path.join(DATA_DIR, 'wiki-nav.json')

const LANGS = [
  { code: 'en', prefix: '', menuKey: 'en' },
  { code: 'it', prefix: 'it-', menuKey: 'it' },
  { code: 'de', prefix: 'de-', menuKey: 'de' },
  { code: 'fr', prefix: 'fr-', menuKey: 'fr' },
  { code: 'es', prefix: 'es-', menuKey: 'es' },
  { code: 'zh-CN', prefix: 'zh-CN-', menuKey: 'zh' }
]

const LABELS = {
  en: {
    nav: 'Navigation',
    home: 'Home'
  },
  it: {
    nav: 'Navigazione',
    home: 'Home'
  },
  de: {
    nav: 'Navigation',
    home: 'Startseite'
  },
  fr: {
    nav: 'Navigation',
    home: 'Accueil'
  },
  es: {
    nav: 'Navegación',
    home: 'Inicio'
  },
  'zh-CN': {
    nav: '导航',
    home: '首页'
  }
}

function slugify (title) {
  return encodeURI(title).replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%23/g, '#')
}

function pageExists (prefix, pageTitle) {
  const name = `${prefix}${pageTitle}.md`
  return fs.existsSync(path.join(WIKI_DIR, name))
}

function resolvePage (lang, pageTitle) {
  if (!lang.prefix) return pageTitle
  const candidate = `${lang.prefix}${pageTitle}`
  return pageExists(lang.prefix, pageTitle) ? candidate : pageTitle
}

function buildInternalLink (lang, pageTitle) {
  const target = resolvePage(lang, pageTitle)
  return {
    label: pageTitle,
    url: `/wiki/${slugify(target)}`,
    external: false
  }
}

function buildSectionItems (lang, items) {
  return items.map(item => {
    if (item.type === 'url') {
      const label = (item.labels && (item.labels[lang.menuKey] || item.labels.en)) || item.url
      return { label, url: item.url, external: true }
    }
    if (item.type === 'page') {
      const label = (item.labels && (item.labels[lang.menuKey] || item.labels.en)) || item.page
      const link = buildInternalLink(lang, item.page)
      link.label = label
      return link
    }
    return null
  }).filter(Boolean)
}

function buildNavData (menu) {
  const data = {}
  for (const lang of LANGS) {
    const entries = []
    const labels = LABELS[lang.code] || LABELS.en
    entries.push({
      title: labels.nav,
      items: [buildInternalLink(lang, 'Home')]
    })
    for (const section of menu.sections) {
      const sectionLabel = section.labels[lang.menuKey] || section.labels.en
      const links = buildSectionItems(lang, section.items)
      if (!links.length) continue
      entries.push({
        title: sectionLabel,
        items: links
      })
    }
    data[lang.code] = entries
  }
  return data
}

function main () {
  if (!fs.existsSync(MENU_PATH)) {
    console.error('wiki-menu.json not found at', MENU_PATH)
    process.exit(1)
  }
  const menu = JSON.parse(fs.readFileSync(MENU_PATH, 'utf8'))
  const navData = buildNavData(menu)
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(navData, null, 2) + '\n', 'utf8')
  console.log(`Generated navigation data in ${path.relative(ROOT, OUTPUT_PATH)}`)
}

main()
