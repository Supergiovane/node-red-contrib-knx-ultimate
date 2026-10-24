#!/usr/bin/env node
/*
 Validates (and can fix) the language links of the wiki pages.
 The Jekyll wiki navbar switches language by matching pages with the same
 `translation_key` and a different `lang` in their front matter, so every page must:
   - start with a front matter block;
   - declare the `lang` matching its filename prefix (none = en, it-, de-, fr-, es-, zh-CN-);
   - declare a `translation_key`;
   - not carry the obsolete "🌐 Language:" bar of the GitHub wiki.
 Each translation_key should also exist in every language: missing translations
 are reported, but cannot be fixed automatically.
 Usage:
   node scripts/validate-wiki-languagebar.js           # report only
   node scripts/validate-wiki-languagebar.js --fix     # fix lang, translation_key and old bars in-place
*/

const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const WIKI_DIR = path.join(ROOT, 'docs', 'wiki')

const fix = process.argv.includes('--fix')

const LANGUAGES = [
  { code: 'zh-CN', prefix: 'zh-CN-' },
  { code: 'it', prefix: 'it-' },
  { code: 'de', prefix: 'de-' },
  { code: 'fr', prefix: 'fr-' },
  { code: 'es', prefix: 'es-' },
  { code: 'en', prefix: '' }
]

function listMarkdown (dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listMarkdown(p))
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(p)
  }
  return out
}

function detectLang (file) {
  const base = path.basename(file, '.md')
  const lang = LANGUAGES.find(item => item.prefix && base.startsWith(item.prefix)) || LANGUAGES.find(item => !item.prefix)
  return { code: lang.code, title: base.slice(lang.prefix.length) }
}

function shouldSkip (file) {
  const rel = path.relative(WIKI_DIR, file)
  if (rel.startsWith('samples/')) return true // sample pages are English-only
  const base = path.basename(file)
  if (base === '_Sidebar.md' || base === '_Footer.md') return true // wiki scaffolding
  return false
}

function parse (file) {
  const content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { content, frontMatter: null }
  const fields = {}
  for (const line of match[1].split('\n')) {
    const field = line.match(/^([A-Za-z_]+):\s*(.*)$/)
    if (field) fields[field[1]] = field[2].replace(/^"(.*)"$/, '$1')
  }
  return { content, frontMatter: match[1], fields, body: content.slice(match[0].length) }
}

function setField (frontMatter, name, value) {
  const line = `${name}: ${value}`
  const pattern = new RegExp(`^${name}:.*$`, 'm')
  return pattern.test(frontMatter) ? frontMatter.replace(pattern, line) : `${frontMatter}\n${line}`
}

const problems = []
const translations = new Map()
let fixed = 0
const files = listMarkdown(WIKI_DIR).filter(file => !shouldSkip(file))

for (const file of files) {
  const rel = path.relative(WIKI_DIR, file)
  const page = parse(file)
  const expected = detectLang(file)
  if (!page.frontMatter) {
    problems.push(`[NO FRONT MATTER] ${rel} (run: npm run wiki:refresh)`)
    continue
  }
  // Redirects only forward old URLs: they take no part in the language switch.
  if (page.fields.layout === 'redirect') continue

  let frontMatter = page.frontMatter
  let body = page.body
  const issues = []
  if (page.fields.lang !== expected.code) {
    issues.push(`lang is "${page.fields.lang || ''}", expected "${expected.code}"`)
    frontMatter = setField(frontMatter, 'lang', expected.code)
  }
  const key = page.fields.translation_key || expected.title
  if (!page.fields.translation_key) {
    issues.push('missing translation_key')
    frontMatter = setField(frontMatter, 'translation_key', `"${key.replace(/"/g, '\\"')}"`)
  }
  if (/^\s*🌐 Language:/.test(body)) {
    issues.push('obsolete "🌐 Language:" bar')
    body = body.replace(/^\s*🌐 Language:[^\n]*\n?/, '')
  }

  if (!translations.has(key)) translations.set(key, new Map())
  translations.get(key).set(expected.code, rel)

  if (issues.length === 0) continue
  if (fix) {
    fs.writeFileSync(file, `---\n${frontMatter}\n---\n${body}`, 'utf8')
    fixed++
  } else {
    problems.push(`[INVALID] ${rel}: ${issues.join(', ')}`)
  }
}

let missingTranslations = 0
for (const [key, pages] of translations) {
  // English-only pages (e.g. samples) have no translations to link.
  if (pages.size === 1) continue
  const missing = LANGUAGES.map(lang => lang.code).filter(code => !pages.has(code))
  if (missing.length === 0) continue
  missingTranslations++
  problems.push(`[MISSING TRANSLATION] "${key}": ${missing.join(', ')}`)
}

problems.forEach(problem => console.log(problem))
console.log(`Checked ${files.length} files. Problems: ${problems.length}, missing translations: ${missingTranslations}${fix ? `, Fixed: ${fixed}` : ''}.`)
process.exitCode = problems.length > 0 ? 1 : 0
