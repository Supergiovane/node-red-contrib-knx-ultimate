#!/usr/bin/env node
'use strict'

// No dependencies and no settings.js execution: this runs before npm install.
const fs = require('fs')
const path = require('path')
const os = require('os')
const LEGACY_TYPES = new Set([
  'hue-config', 'matter-config', 'matterbridge-config',
  'knxUltimateHueController', 'knxUltimateHueLight', 'knxUltimateHuePlug',
  'knxUltimateHueButton', 'knxUltimateHueTapDial', 'knxUltimateHueMotion',
  'knxUltimateHueAreaMotion', 'knxUltimateHueCameraMotion', 'knxUltimateHueContactSensor',
  'knxUltimateHueLightSensor', 'knxUltimateHueTemperatureSensor', 'knxUltimateHueHumiditySensor',
  'knxUltimateHueScene', 'knxUltimateHueBattery', 'knxUltimateHueZigbeeConnectivity',
  'knxUltimateHuedevice_software_update', 'knxUltimateMatterControllerDevice',
  'knxUltimateMatterBridge', 'knxUltimateMatterLight'
])

function check (options = {}) {
  const env = options.env || process.env
  const cwd = options.cwd || process.cwd()
  const home = options.home || os.homedir()
  const packageDir = options.packageDir || path.resolve(__dirname, '..')
  const version = options.version || require('../package.json').version
  const result = { files: [], legacy: [], errors: [], warnings: [] }
  if (!/^8\./.test(version)) return result
  const candidates = new Map()
  const visited = new Set()
  const add = (file, required = false) => {
    file = path.resolve(file)
    candidates.set(file, required || /^flows(?:[_.-]|\.json$)/.test(path.basename(file)) || candidates.get(file) || false)
  }
  const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
  const scanDirectory = dir => {
    if (!fs.existsSync(dir)) return
    try {
      const realDir = fs.realpathSync(dir)
      if (visited.has(realDir)) return
      visited.add(realDir)
      // Restrict discovery to this directory. Never traverse backups, libraries,
      // node_modules, examples or persistent device storage.
      for (const file of fs.readdirSync(dir)) {
        if (/\.json$/i.test(file) && !file.startsWith('.') && !/(?:_cred|credentials|backup|\.bak)(?:[._-]|$)/i.test(file) && !['package.json', 'package-lock.json'].includes(file)) add(path.join(dir, file))
      }
      const settings = path.join(dir, 'settings.js')
      if (fs.existsSync(settings)) {
        // Strip comments while retaining string literals; do not run user code.
        const text = fs.readFileSync(settings, 'utf8').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g, token => token.startsWith('/') ? '' : token)
        const match = /\bflowFile\s*:\s*(['"])([^\r\n]*?)\1\s*[,}]/.exec(text)
        if (match && !match[2].includes('\\')) add(path.resolve(dir, match[2]), true)
        else if (/\bflowFile\s*:/.test(text)) result.warnings.push('Dynamic flowFile setting: use KNXULTIMATE_FLOW_FILE to check its resolved path.')
      }
      const projectConfig = path.join(dir, '.config.projects.json')
      if (fs.existsSync(projectConfig)) {
        const config = json(projectConfig)
        const active = config.activeProject || (config.projects && config.projects.activeProject)
        if (typeof active === 'string' && active && path.basename(active) === active) {
          const projectDir = path.join(dir, 'projects', active)
          scanDirectory(projectDir)
          const manifest = json(path.join(projectDir, 'package.json'))
          const flowFile = manifest['node-red']?.settings?.flowFile
          if (typeof flowFile === 'string') add(path.resolve(projectDir, flowFile), true)
        }
      }
    } catch (error) { result.errors.push(`${dir}: unable to inspect flow files (${error.code || 'invalid JSON'}).`) }
  }
  if (env.KNXULTIMATE_FLOW_FILE) {
    add(path.resolve(env.INIT_CWD || cwd, env.KNXULTIMATE_FLOW_FILE), true)
  } else if (env.KNXULTIMATE_NODE_RED_USER_DIR) {
    const dir = path.resolve(env.INIT_CWD || cwd, env.KNXULTIMATE_NODE_RED_USER_DIR)
    if (!fs.existsSync(dir)) result.errors.push(`${dir}: Node-RED user directory does not exist.`)
    else scanDirectory(dir)
  } else {
    const dirs = new Set([env.INIT_CWD, env.npm_config_local_prefix, cwd].filter(Boolean).map(p => path.resolve(p)))
    // npm lifecycle cwd is the installed package, not the Node-RED userDir.
    for (let dir = packageDir; path.dirname(dir) !== dir; dir = path.dirname(dir)) {
      if (path.basename(dir) === 'node_modules') dirs.add(path.dirname(dir))
    }
    for (const dir of dirs) if (dir !== packageDir) scanDirectory(dir)
  }
  const inspected = new Set()
  const inspectCandidates = () => {
    for (const [file, required] of candidates) {
      if (inspected.has(file)) continue
      inspected.add(file)
      try {
        const data = json(file)
        const flow = Array.isArray(data) ? data : (data && Array.isArray(data.flows) ? data.flows : null)
        if (!flow) {
          if (required) result.errors.push(`${file}: expected a Node-RED flow array.`)
          continue
        }
        if (flow.some(node => !node || typeof node.id !== 'string' || typeof node.type !== 'string')) {
          if (required || flow.some(node => node && LEGACY_TYPES.has(node.type))) result.errors.push(`${file}: invalid Node-RED flow entries.`)
          else continue
        }
        result.files.push(file)
        const counts = new Map()
        for (const node of flow) if (node && LEGACY_TYPES.has(node.type)) counts.set(node.type, (counts.get(node.type) || 0) + 1)
        for (const [type, count] of counts) result.legacy.push({ file, type, count })
      } catch (error) {
        // Broken conventional/explicit flow files must not silently pass the guard.
        if (required || /^flows(?:[_.-]|\.json$)/.test(path.basename(file)) || error.code === 'EACCES') result.errors.push(`${file}: unable to read flow (${error.code || 'invalid JSON'}).`)
      }
    }
  }
  inspectCandidates()
  // A random JSON file beside npm's launch directory is not evidence that the
  // actual Node-RED flow has been checked. Fall back after inspecting candidates.
  if (!env.KNXULTIMATE_FLOW_FILE && !env.KNXULTIMATE_NODE_RED_USER_DIR && !result.files.length && !result.errors.length) {
    scanDirectory(path.join(home, '.node-red'))
    inspectCandidates()
  }
  if (!result.files.length) result.warnings.push('No saved flow could be checked. For custom storage/paths, verify migration manually or set KNXULTIMATE_FLOW_FILE.')
  return result
}

function run (options) {
  const result = check(options)
  const blocked = result.legacy.length > 0 || result.errors.length > 0
  if (blocked) {
    console.error('\nKNX Ultimate 8 installation blocked / Installazione bloccata.')
    for (const item of result.legacy) console.error(`  ${item.file}: ${item.type} (${item.count})`)
    for (const error of result.errors) console.error(`  ${error}`)
    console.error('Keep/reinstall KNX Ultimate 7. Install node-red-contrib-hue-ultimate and node-red-contrib-matter-ultimate as needed, restart Node-RED, migrate the old nodes AND configuration nodes, then Deploy before retrying version 8. See MIGRATION.md. Do not delete Matter storage. If a flow could not be read, fix its path/permissions first.')
  }
  for (const warning of result.warnings) console.error(`[KNX Ultimate migration check] ${warning}`)
  return blocked ? 1 : 0
}

module.exports = { check, run, LEGACY_TYPES }
if (require.main === module) process.exitCode = run()
