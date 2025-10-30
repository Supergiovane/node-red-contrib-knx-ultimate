#!/usr/bin/env node
/**
 * Housekeeping script for docs/wiki:
 *  - removes Finder-style duplicate files (e.g., "Page 2.md")
 *  - normalises links so they point to the GitHub Pages site
 *  - keeps a few placeholder pages in place (Page Title, missing translations, …)
 */

const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const WIKI_DIR = path.join(ROOT, 'docs', 'wiki')
const PAGES_BASE = 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki'

if (!fs.existsSync(WIKI_DIR)) {
  console.error('docs/wiki directory not found. Nothing to do.')
  process.exit(1)
}

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

const REPLACEMENTS = [
  {
    pattern: /https?:\/\/github\.com\/supergiovane\/node-red-contrib-knx-ultimate\/wiki/gi,
    replacement: PAGES_BASE
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/-sample-virtual-device/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/sample-setconfig/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/-sample-setconfig/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/sampleloadcontrol/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/SampleLoadControl'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/2\.-Node-Configuration/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/Device'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/KNX-Node-Configuration/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/Device'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/de-2\.-Node-Configuration/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/de-Device'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/it-2\.-Node-Configuration/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/it-Device'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/zh-CN-2\.-Node-Configuration/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/zh-CN-Device'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/-sampleshome/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/-SamplesHome'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/7\.-WatchDog-Configuration/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/8\.-WatchDog-Messages-from-the-node/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration'
  },
  {
    pattern: /\/node-red-contrib-knx-ultimate\/wiki\/gateway-infiguration/gi,
    replacement: '/node-red-contrib-knx-ultimate/wiki/Gateway-configuration'
  }
]

function removeFinderDuplicates (dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      removeFinderDuplicates(full)
      continue
    }
    if (/\s\d+\.[^.]+$/.test(entry.name)) {
      fs.unlinkSync(full)
    }
  }
}

function rewriteLinksInFile (file) {
  const content = fs.readFileSync(file, 'utf8')
  let updated = content
  for (const { pattern, replacement } of REPLACEMENTS) {
    updated = updated.replace(pattern, replacement)
  }
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8')
  }
}

function walkMarkdown (dir, visitor) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkMarkdown(full, visitor)
      continue
    }
    if (entry.name.endsWith('.md') || entry.name.endsWith('.html') || entry.name.endsWith('.json')) {
      visitor(full)
    }
  }
}

function ensureStubs () {
  for (const stub of STUBS) {
    const target = path.join(WIKI_DIR, stub.file)
    if (!fs.existsSync(target)) {
      fs.writeFileSync(target, stub.content.trim() + '\n', 'utf8')
    }
  }
}

removeFinderDuplicates(WIKI_DIR)
walkMarkdown(WIKI_DIR, rewriteLinksInFile)
ensureStubs()

console.log('Wiki housekeeping completed in docs/wiki.')
