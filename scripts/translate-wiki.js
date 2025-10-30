#!/usr/bin/env node
/*
 Auto-translates EN wiki pages into IT, DE, FR, ES, zh-CN variants and creates missing files.
 - Detects base English pages (no it-/de-/zh-CN- prefix)
 - Skips special files (_Sidebar.md, _Footer.md) and samples/
 - Preserves language bar (writes absolute links for all languages)
 - Skips translation inside code blocks and preserves URLs inside parentheses
 - After generation, run: npm run wiki:inject-header (to add the localized header)
*/

const fs = require('fs')
const path = require('path')
const translate = require('translate-google')

const ROOT = process.cwd()
const WIKI_DIR = path.join(ROOT, 'docs', 'wiki')
const ABS = 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/'

const TARGETS = [
  { code: 'it', prefix: 'it-', lang: 'it' },
  { code: 'de', prefix: 'de-', lang: 'de' },
  { code: 'fr', prefix: 'fr-', lang: 'fr' },
  { code: 'es', prefix: 'es-', lang: 'es' },
  { code: 'zh-CN', prefix: 'zh-CN-', lang: 'zh-CN' }
]

const LANG_BAR_ENTRIES = [
  { label: 'EN', prefix: '' },
  { label: 'IT', prefix: 'it-' },
  { label: 'DE', prefix: 'de-' },
  { label: 'FR', prefix: 'fr-' },
  { label: 'ES', prefix: 'es-' },
  { label: '简体中文', prefix: 'zh-CN-' }
]

function listMarkdown (dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...listMarkdown(p))
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p)
  }
  return out
}

function shouldSkipBase (file) {
  const rel = path.relative(WIKI_DIR, file)
  if (rel.startsWith('samples/')) return true
  const base = path.basename(file)
  if (base.startsWith('it-') || base.startsWith('de-') || base.startsWith('fr-') || base.startsWith('es-') || base.startsWith('zh-CN-')) return true
  if (base === '_Sidebar.md' || base === '_Footer.md') return true
  return false
}

function slugify (title) { return encodeURIComponent(title) }
function langBarLine (baseTitle) {
  const slugEN = slugify(baseTitle)
  const parts = LANG_BAR_ENTRIES.map(({ label, prefix }) => {
    const slug = prefix ? prefix + slugEN : slugEN
    return `[${label}](${ABS}${slug})`
  })
  return `🌐 Language: ${parts.join(' | ')}`
}

function deriveBaseTitle (filepath) {
  return path.basename(filepath, '.md')
}

function splitByCodeBlocks (text) {
  // Split by triple backticks, keep the delimiters
  const parts = text.split(/(```[\s\S]*?```)/g)
  return parts.map(part => ({ text: part, code: part.startsWith('```') }))
}

function protectUrls (s) {
  const urls = []
  const replaced = s.replace(/\((https?:[^)]+)\)/g, (m, url) => {
    const token = `__URL_${urls.length}__`
    urls.push(url)
    return `(${token})`
  })
  return { replaced, urls }
}

function restoreUrls (s, urls) {
  return s.replace(/__URL_(\d+)__/g, (_, i) => urls[Number(i)])
}

async function translateBody (src, toLang) {
  // Translate non-code parts, preserve URLs
  const blocks = splitByCodeBlocks(src)
  const out = []
  for (const b of blocks) {
    if (b.code) { out.push(b.text); continue }
    const { replaced, urls } = protectUrls(b.text)
    if (!replaced.trim()) { out.push(b.text); continue }
    const t = await translate(replaced, { to: toLang })
    out.push(restoreUrls(t, urls))
  }
  return out.join('')
}

async function run () {
  const files = listMarkdown(WIKI_DIR).filter(f => !shouldSkipBase(f))
  let created = 0; let skipped = 0; let errors = 0
  for (const f of files) {
    try {
      const baseTitle = deriveBaseTitle(f)
      // Compute target filenames
      const targets = TARGETS.map(t => ({ ...t, file: path.join(path.dirname(f), `${t.prefix}${baseTitle}.md`) }))
      const missing = targets.filter(t => !fs.existsSync(t.file))
      if (missing.length === 0) { skipped++; continue }

      const raw = fs.readFileSync(f, 'utf8')
      const lines = raw.split(/\r?\n/)
      // remove existing header/nav from source if present
      let start = 0
      // Ensure we skip the first line (we regenerate language bar per target)
      if (lines[0] && lines[0].startsWith('🌐 Language:')) start = 1
      // Remove any NAV block at the top
      const navStart = lines.findIndex(l => l.trim() === '<!-- NAV START -->')
      const navEnd = lines.findIndex(l => l.trim() === '<!-- NAV END -->')
      let bodyLines = lines.slice(start)
      if (navStart !== -1 && navEnd !== -1 && navEnd > navStart) {
        // remove the block and any immediate '---' below if duplicate present later
        bodyLines = lines.slice(navEnd + 1)
      }
      // Ensure we keep single separator '---' at the top of body
      const body = bodyLines.join('\n')
      // If body starts with --- keep it; otherwise add after translation phase
      const startsWithSep = body.trimStart().startsWith('---')

      for (const t of missing) {
        const toLang = t.lang
        const translated = await translateBody(body, toLang)
        const outLines = []
        outLines.push(langBarLine(baseTitle))
        if (!startsWithSep) outLines.push('---')
        outLines.push(translated.replace(/^\n+/, ''))
        fs.writeFileSync(t.file, outLines.join('\n'), 'utf8')
        created++
      }
    } catch (e) {
      console.error('Error translating', f, e.message)
      errors++
    }
  }
  console.log(`Created ${created} pages. Skipped (already present): ${skipped}. Errors: ${errors}.`)
  console.log('Next: npm run wiki:inject-header to add localized headers.')
}

run()
