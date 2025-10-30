#!/usr/bin/env node
/**
 * Cleans the generated wiki pages:
 *  - removes legacy per-page navigation blocks
 *  - ensures every page has Jekyll front matter with layout/lang/permalink
 */
const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const WIKI_DIR = path.join(ROOT, 'docs', 'wiki')

const LANGS = [
  { code: 'zh-CN', prefix: 'zh-CN-' },
  { code: 'it', prefix: 'it-' },
  { code: 'de', prefix: 'de-' },
  { code: 'fr', prefix: 'fr-' },
  { code: 'es', prefix: 'es-' },
  { code: 'en', prefix: '' }
]

function listMarkdown (dir) {
  const entries = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      entries.push(...listMarkdown(full))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      entries.push(full)
    }
  }
  return entries
}

function detectLang (baseName) {
  for (const lang of LANGS) {
    if (lang.prefix && baseName.startsWith(lang.prefix)) {
      return { code: lang.code, prefix: lang.prefix }
    }
  }
  return { code: 'en', prefix: '' }
}

function escapeYaml (value) {
  return value.replace(/"/g, '\\"')
}

function stripNavBlock (content) {
  return content.replace(/<!-- NAV START -->[\s\S]*?<!-- NAV END -->\s*/g, '')
}

function stripFrontMatter (content) {
  if (content.startsWith('---\n')) {
    const end = content.indexOf('\n---', 4)
    if (end !== -1) {
      return content.slice(end + 4)
    }
  }
  return content
}

function ensureTrailingNewline (text) {
  return text.endsWith('\n') ? text : text + '\n'
}

function processFile (file) {
  let raw = fs.readFileSync(file, 'utf8')
  raw = raw.replace(/\r\n/g, '\n')
  raw = stripNavBlock(raw)
  raw = stripFrontMatter(raw)
  raw = raw.replace(/^\s+/, '') // trim leading blank lines

  const baseName = path.basename(file, '.md')
  const { code, prefix } = detectLang(baseName)
  const title = baseName.slice(prefix.length) || baseName
  const permalink = `/wiki/${encodeURI(baseName)}`

  const frontMatter = [
    '---',
    'layout: wiki',
    `title: "${escapeYaml(title)}"`,
    `lang: ${code}`,
    `permalink: ${permalink}`,
    '---',
    ''
  ].join('\n')

  const output = frontMatter + raw.trimStart()
  fs.writeFileSync(file, ensureTrailingNewline(output), 'utf8')
}

function main () {
  if (!fs.existsSync(WIKI_DIR)) {
    console.error('docs/wiki directory not found')
    process.exit(1)
  }
  const files = listMarkdown(WIKI_DIR)
  files.forEach(processFile)
  console.log(`Prepared ${files.length} wiki pages for Jekyll.`)
}

main()
