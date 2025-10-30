#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const REPO = process.cwd()
const PACKAGE_PATH = path.join(REPO, 'package.json')
const PRESENTATION_PATH = path.join(REPO, 'tutorial', 'knxUltimate-AllNodes-Presentazione.md')
const WIKI_DIR = path.join(REPO, 'docs', 'wiki')
const WIKI_FILES = [
  'Home.md',
  'it-Home.md',
  'de-Home.md',
  'fr-Home.md',
  'es-Home.md',
  'zh-CN-Home.md'
]

function parsePackageNodes (pkgPath) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const nodes = pkg['node-red'] && pkg['node-red'].nodes
  if (!nodes || typeof nodes !== 'object') {
    throw new Error('package.json non contiene la sezione "node-red.nodes"')
  }
  return Object.keys(nodes).sort()
}

function parseHeadings (filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const headings = []
  const regex = /^##\s+(.*)$/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    headings.push(match[1].trim())
  }
  return headings
}

function compareLists (reference, current) {
  const refSet = new Set(reference)
  const curSet = new Set(current)
  const missing = reference.filter(name => !curSet.has(name))
  const extra = current.filter(name => !refSet.has(name))
  return { missing, extra }
}

function formatResult (title, result) {
  if (!result.missing.length && !result.extra.length) {
    return `✅ ${title}: elenco coerente`
  }
  const lines = [`❌ ${title}:`]
  if (result.missing.length) {
    lines.push(`  Mancano: ${result.missing.join(', ')}`)
  }
  if (result.extra.length) {
    lines.push(`  Non previsti: ${result.extra.join(', ')}`)
  }
  return lines.join('\n')
}

function main () {
  const packageNodes = parsePackageNodes(PACKAGE_PATH)
  const presentationHeadings = parseHeadings(PRESENTATION_PATH)
    .filter(name => name && !name.startsWith('Apertura') && !name.startsWith('Sequenza'))

  const presentationResult = compareLists(packageNodes, presentationHeadings)
  const reports = [formatResult('Presentazione (tutorial/knxUltimate-AllNodes-Presentazione.md)', presentationResult)]

  for (const file of WIKI_FILES) {
    const wikiPath = path.join(WIKI_DIR, file)
    const headings = parseHeadings(wikiPath)
    const result = compareLists(packageNodes, headings)
    reports.push(formatResult(`Wiki ${file}`, result))
  }

  const hasIssues = reports.some(line => line.startsWith('❌'))
  console.log(reports.join('\n'))
  if (hasIssues) {
    process.exitCode = 1
  }
}

main()
