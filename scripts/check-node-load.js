#!/usr/bin/env node
/**
 * Quick sanity check to ensure every node module and editor script
 * compiles without syntax errors. It does not execute any logic –
 * it just asks V8 to parse the source.
 */

const fs = require('fs')
const path = require('path')
const vm = require('vm')

const colour = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
}

const log = {
  step: (message) => console.log(`${colour.cyan}▶${colour.reset} ${message}`),
  ok: (message) => console.log(`${colour.green}✔${colour.reset} ${message}`),
  warn: (message) => console.warn(`${colour.yellow}⚠${colour.reset} ${message}`),
  fail: (message) => console.error(`${colour.red}✖${colour.reset} ${message}`)
}

const projectRoot = path.resolve(__dirname, '..')

const errors = []

const recordError = (filename, error) => {
  const message = error && error.message ? error.message : String(error)
  errors.push(`${filename}\n  ${message}`)
}

const checkJavaScript = (filename, code) => {
  try {
    // Compile only; do not run. This will raise on syntax errors.
    new vm.Script(code, { filename })
  } catch (error) {
    recordError(filename, error)
  }
}

const checkNodeRuntimeFiles = () => {
  log.step('Checking Node-RED runtime modules…')
  const pkg = require(path.join(projectRoot, 'package.json'))
  const nodeEntries = pkg['node-red']?.nodes || {}
  const files = Object.values(nodeEntries)
  if (files.length === 0) {
    log.warn('No runtime nodes declared in package.json')
    return
  }
  Object.values(nodeEntries).forEach((relativePath) => {
    const runtimePath = path.join(projectRoot, relativePath)
    let code
    try {
      code = fs.readFileSync(runtimePath, 'utf8')
    } catch (error) {
      recordError(runtimePath, error)
      return
    }
    checkJavaScript(runtimePath, code)
  })
  log.ok(`Runtime modules processed: ${files.length}`)
}

/**
 * Extract inline editor scripts from the .html files and ensure they parse.
 * Only `<script>` tags without a `src` attribute and not marked as text/html
 * are analysed.
 */
const checkEditorScripts = () => {
  log.step('Checking editor inline scripts…')
  const htmlDir = path.join(projectRoot, 'nodes')
  const scriptTagRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi

  let processed = 0

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    entries.forEach((entry) => {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(entryPath)
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        const source = fs.readFileSync(entryPath, 'utf8')

        let match
        while ((match = scriptTagRegex.exec(source)) !== null) {
          const attributes = match[1] || ''
          const body = match[2] || ''
          const hasSrc = /\bsrc\s*=/.test(attributes)
          if (hasSrc) continue

          const typeMatch = /\btype\s*=\s*["']([^"']+)["']/.exec(attributes)
          const type = typeMatch ? typeMatch[1].toLowerCase() : 'text/javascript'
          if (type !== 'text/javascript' && type !== 'application/javascript') continue

          const code = body.trim()
          if (!code) continue

          const virtualFilename = `${entryPath}#script@${match.index}`
          checkJavaScript(virtualFilename, code)
          processed += 1
        }
      }
    })
  }

  walk(htmlDir)
  log.ok(`Editor scripts analysed: ${processed}`)
}

checkNodeRuntimeFiles()
checkEditorScripts()

if (errors.length > 0) {
  log.fail('Node load check failed:\n')
  errors.forEach((err) => console.error(`${colour.dim}${err}${colour.reset}\n`))
  process.exit(1)
}

log.ok('All node runtime modules and editor scripts compiled successfully.')
