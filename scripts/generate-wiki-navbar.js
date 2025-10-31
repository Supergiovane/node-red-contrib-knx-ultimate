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
    home: 'Home',
    repo: 'GitHub Repository'
  },
  it: {
    nav: 'Navigazione',
    home: 'Home',
    repo: 'Repository GitHub'
  },
  de: {
    nav: 'Navigation',
    home: 'Startseite',
    repo: 'GitHub-Repository'
  },
  fr: {
    nav: 'Navigation',
    home: 'Accueil',
    repo: 'Dépôt GitHub'
  },
  es: {
    nav: 'Navegación',
    home: 'Inicio',
    repo: 'Repositorio GitHub'
  },
  'zh-CN': {
    nav: '导航',
    home: '首页',
    repo: 'GitHub 仓库'
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
  const overviewSection = menu.sections.find(s => s.key === 'overview')
  for (const lang of LANGS) {
    const entries = []
    const labels = LABELS[lang.code] || LABELS.en
    const combined = [buildInternalLink(lang, 'Home')]
    combined.push({
      label: labels.repo,
      url: 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate',
      external: true
    })
    if (overviewSection) {
      const overviewItems = buildSectionItems(lang, overviewSection.items)
      combined.push(...overviewItems)
    }
    const overviewTitle = (overviewSection && (overviewSection.labels[lang.menuKey] || overviewSection.labels.en)) || labels.nav
    entries.push({ title: overviewTitle, items: combined })
    for (const section of menu.sections) {
      if (section.key === 'overview') continue
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
