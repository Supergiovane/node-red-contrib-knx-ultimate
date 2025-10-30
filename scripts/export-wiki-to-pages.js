#!/usr/bin/env node
/**
 * Synchronise the GitHub wiki into the docs/wiki folder so it can be published
 * via GitHub Pages. The script rewrites absolute wiki URLs to point to the
 * generated site while keeping the original structure intact.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const WIKI_DIR = path.resolve(ROOT, '..', 'node-red-contrib-knx-ultimate.wiki')
const DOCS_DIR = path.join(ROOT, 'docs')
const TARGET_DIR = path.join(DOCS_DIR, 'wiki')
const PAGES_BASE = '/node-red-contrib-knx-ultimate/wiki/'

if (!fs.existsSync(WIKI_DIR)) {
  console.error('Wiki repository not found:', WIKI_DIR)
  process.exit(1)
}

function ensureDir (dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function cleanDir (dir) {
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir)) {
      const entryPath = path.join(dir, entry)
      const stat = fs.statSync(entryPath)
      if (stat.isDirectory()) {
        cleanDir(entryPath)
        fs.rmdirSync(entryPath)
      } else {
        fs.unlinkSync(entryPath)
      }
    }
  } else {
    ensureDir(dir)
  }
}

function rewriteLinks (content) {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/https:\/\/github\.com\/supergiovane\/node-red-contrib-knx-ultimate\/wiki\//gi, PAGES_BASE)
}

function slugify (name) {
  return name.replace(/\s+/g, '-')
}

function mapDestination (src) {
  const rel = path.relative(WIKI_DIR, src)
  if (rel.startsWith(`samples${path.sep}`)) {
    const base = path.basename(rel, path.extname(rel))
    const slug = slugify(base) + path.extname(rel)
    return path.join(TARGET_DIR, slug)
  }
  return path.join(TARGET_DIR, rel)
}

function copyRecursive (src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    ensureDir(dest)
    for (const entry of fs.readdirSync(src)) {
      if (entry === '.git') continue
      copyRecursive(path.join(src, entry), mapDestination(path.join(src, entry)))
    }
    return
  }

  if (src.endsWith('.md')) {
    const data = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, rewriteLinks(data), 'utf8')
  } else {
    fs.copyFileSync(src, dest)
  }
}

ensureDir(DOCS_DIR)
cleanDir(TARGET_DIR)
copyRecursive(WIKI_DIR, TARGET_DIR)

const STUBS = [
  {
    file: 'Page Title.md',
    content: `# Placeholder Page Title

This page is a placeholder used inside the documentation snippets (for example when showing how the language bar should look).
Replace \`Page Title\` with the real name of your page when following those examples.
If you were looking for the actual documentation, see [Home](./Home) for the index of available pages.
`
  },
  {
    file: 'de-Page Title.md',
    content: `# Platzhalterseiten-Titel

Diese Seite dient nur als Platzhalter für die Beispiele in der Dokumentation (zum Beispiel, wenn die Sprachleiste erklärt wird).
Ersetze \`Page Title\` durch den echten Seitennamen, wenn du den Beispielen folgst.
Für die echten Inhalte findest du eine Übersicht auf der [Startseite](./Home) der Dokumentation.
`
  },
  {
    file: 'it-Page Title.md',
    content: `# Titolo Pagina Segnaposto

Questa pagina è solo un segnaposto utilizzato negli esempi della documentazione (ad esempio quando viene mostrata la barra delle lingue).
Sostituisci \`Page Title\` con il nome reale della tua pagina quando segui quei passaggi.
Per i contenuti effettivi consulta l'[indice principale](./Home) della documentazione.
`
  },
  {
    file: 'zh-CN-Page Title.md',
    content: `# 占位示例页面

本页面仅用于文档示例（例如展示语言栏时）。
按照示例操作时请将 \`Page Title\` 替换为你自己的实际页面名称。
若需查看真实内容，请回到文档的[主页](./Home)。
`
  },
  {
    file: 'de-Garage-Configuration.md',
    content: `# Garage-Konfiguration (Übersetzung folgt)

Diese Seite wurde noch nicht ins Deutsche übertragen.
Bitte verwende vorerst die [englische Dokumentation](./Garage-Configuration).
Beiträge oder Übersetzungen sind willkommen!
`
  },
  {
    file: 'de-Staircase-Configuration.md',
    content: `# Treppenlicht-Konfiguration (Übersetzung folgt)

Für diese Seite liegt derzeit keine deutsche Übersetzung vor.
Die vollständigen Informationen findest du in der [englischen Version](./Staircase-Configuration).
Wenn du helfen möchtest, eine Übersetzung bereitzustellen, freuen wir uns über Beiträge!
`
  },
  {
    file: 'zh-CN-Garage-Configuration.md',
    content: `# Garage 配置（暂未翻译）

当前页面尚未提供中文内容。
请暂时参考[英文版本](./Garage-Configuration)，欢迎提交翻译补充！
`
  },
  {
    file: 'zh-CN-Staircase-Configuration.md',
    content: `# 楼梯灯配置（暂未翻译）

本页面暂时没有中文翻译。
请先阅读[英文页面](./Staircase-Configuration)，非常欢迎你贡献翻译内容！
`
  }
]

for (const stub of STUBS) {
  const target = path.join(TARGET_DIR, stub.file)
  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, stub.content.trim() + '\n', 'utf8')
  }
}

const POST_REPLACEMENTS = [
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-sample-virtual-device', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device'],
  ['/node-red-contrib-knx-ultimate/wiki/-sample-virtual-device', '/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-sample-virtual-device', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/sample-setconfig', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig'],
  ['/node-red-contrib-knx-ultimate/wiki/sample-setconfig', '/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/sample-setconfig', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-sample-setconfig', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig'],
  ['/node-red-contrib-knx-ultimate/wiki/-sample-setconfig', '/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/sampleloadcontrol', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl'],
  ['/node-red-contrib-knx-ultimate/wiki/sampleloadcontrol', '/node-red-contrib-knx-ultimate/wiki/SampleLoadControl'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/sampleloadcontrol', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Device'],
  ['/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration', '/node-red-contrib-knx-ultimate/wiki/Device'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/KNX-Node-Configuration', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Device'],
  ['/node-red-contrib-knx-ultimate/wiki/KNX-Node-Configuration', '/node-red-contrib-knx-ultimate/wiki/Device'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-2.-Node-Configuration', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Device'],
  ['/node-red-contrib-knx-ultimate/wiki/de-2.-Node-Configuration', '/node-red-contrib-knx-ultimate/wiki/de-Device'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-2.-Node-Configuration', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Device'],
  ['/node-red-contrib-knx-ultimate/wiki/it-2.-Node-Configuration', '/node-red-contrib-knx-ultimate/wiki/it-Device'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-2.-Node-Configuration', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Device'],
  ['/node-red-contrib-knx-ultimate/wiki/zh-CN-2.-Node-Configuration', '/node-red-contrib-knx-ultimate/wiki/zh-CN-Device'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-sampleshome', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome'],
  ['/node-red-contrib-knx-ultimate/wiki/-sampleshome', '/node-red-contrib-knx-ultimate/wiki/-SamplesHome'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-sampleshome', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/7.-WatchDog-Configuration', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration'],
  ['/node-red-contrib-knx-ultimate/wiki/7.-WatchDog-Configuration', '/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/8.-WatchDog-Messages-from-the-node', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration'],
  ['https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/gateway-infiguration', 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Gateway-configuration'],
  ['/node-red-contrib-knx-ultimate/wiki/gateway-infiguration', '/node-red-contrib-knx-ultimate/wiki/Gateway-configuration']
]

function rewriteLinksInFile (file) {
  let content = fs.readFileSync(file, 'utf8')
  let updated = content
  for (const [from, to] of POST_REPLACEMENTS) {
    const pattern = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    updated = updated.replace(pattern, to)
  }
  if (updated !== content) fs.writeFileSync(file, updated, 'utf8')
}

function applyPostReplacements (dir) {
  for (const entry of fs.readdirSync(dir)) {
    const file = path.join(dir, entry)
    const stat = fs.statSync(file)
    if (stat.isDirectory()) applyPostReplacements(file)
    else if (entry.endsWith('.md') || entry.endsWith('.html') || entry.endsWith('.json')) rewriteLinksInFile(file)
  }
}

applyPostReplacements(TARGET_DIR)

console.log('Wiki exported to', TARGET_DIR)
