const { expect } = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')
const { check } = require('../scripts/check-legacy-flows')

describe('version 8 legacy installation scan', () => {
  let dir, options
  const write = (file, data) => { const target = path.join(dir, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(data)); return target }
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'knx-install-guard-'))
    options = { env: { INIT_CWD: dir }, cwd: path.join(dir, 'node_modules/node-red-contrib-knx-ultimate'), packageDir: path.join(dir, 'node_modules/node-red-contrib-knx-ultimate'), home: dir, version: '8.2.3' }
  })
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }))
  // Independent compatibility contract: deleting a type from the guard must fail a test.
  const legacyTypes = [
    'knxUltimateAlerter', 'knxUltimateAutoResponder', 'knxUltimateDateTime',
    'knxUltimateWatchDog', 'knxUltimateGlobalContext', 'knxUltimateLogger',
    'knxUltimateStaircase', 'knxUltimateGarage', 'knxUltimateSceneController',
    'knxUltimateLoadControl', 'knxUltimateHATranslator',
    'hue-config', 'matter-config', 'matterbridge-config',
    'knxUltimateHueController', 'knxUltimateHueLight', 'knxUltimateHuePlug',
    'knxUltimateHueButton', 'knxUltimateHueTapDial', 'knxUltimateHueMotion',
    'knxUltimateHueAreaMotion', 'knxUltimateHueCameraMotion', 'knxUltimateHueContactSensor',
    'knxUltimateHueLightSensor', 'knxUltimateHueTemperatureSensor', 'knxUltimateHueHumiditySensor',
    'knxUltimateHueScene', 'knxUltimateHueBattery', 'knxUltimateHueZigbeeConnectivity',
    'knxUltimateHuedevice_software_update', 'knxUltimateMatterControllerDevice',
    'knxUltimateMatterBridge', 'knxUltimateMatterLight',
    'knxUltimateAI', 'knxUltimateAIHomeAssistant'
  ]
  for (const type of legacyTypes) {
    it(`detects ${type}, even in a disabled flow/subflow`, () => {
      write('flows.json', [{ id: 'sub', type: 'subflow', disabled: true }, { id: 'old', type, z: 'sub', d: true }])
      expect(check(options).legacy).to.deep.equal([{ file: path.join(dir, 'flows.json'), type, count: 1 }])
    })
  }
  it('allows migrated nodes, KNX nodes and strings mentioning legacy types', () => {
    write('flows.json', ['knxUltimate', 'hueUltimateController', 'matterUltimateController', 'matterUltimateBridge', 'hue-ultimate-config', 'matter-ultimate-config', 'matter-ultimate-bridge-config', 'function'].map((type, id) => ({ id: String(id), type, info: 'knxUltimateHueLight' })))
    expect(check(options).legacy).to.deep.equal([])
    expect(check(options).errors).to.deep.equal([])
  })
  it('detects a custom JSON flow name without reading nested backups or credentials', () => {
    write('my-house.json', [{ id: 'old', type: 'knxUltimateHueController' }])
    write('backup/flows.json', [{ id: 'old2', type: 'knxUltimateMatterBridge' }])
    write('flows_cred.json', [{ id: 'secret', type: 'hue-config' }])
    expect(check(options).legacy).to.have.length(1)
  })
  it('reads a literal settings flowFile without executing settings.js', () => {
    const file = write('other/house.flow', [{ id: 'old', type: 'matter-config' }])
    fs.writeFileSync(path.join(dir, 'settings.js'), `throw new Error('must not execute'); module.exports = { /* flowFile: 'wrong' */ flowFile: '${file}' };`)
    expect(check(options).legacy).to.have.length(1)
  })
  it('checks only the active project and its configured nested flow file', () => {
    write('.config.projects.json', { activeProject: 'home' })
    write('projects/home/package.json', { 'node-red': { settings: { flowFile: 'src/house.json' } } })
    write('projects/home/src/house.json', [{ id: 'old', type: 'matterbridge-config' }])
    write('projects/archive/flows.json', [{ id: 'old', type: 'hue-config' }])
    expect(check(options).legacy).to.have.length(1)
  })
  it('finds the install owner when npm runs from another directory', () => {
    write('flows_host.json', [{ id: 'old', type: 'hue-config' }])
    options.env.INIT_CWD = path.join(dir, 'elsewhere')
    expect(check(options).legacy).to.have.length(1)
  })
  it('falls back to the default user directory', () => {
    write('.node-red/flows.json', [{ id: 'old', type: 'hue-config' }])
    expect(check(options).legacy).to.have.length(1)
  })
  it('honours an explicit flow path exclusively and supports the API envelope', () => {
    write('flows.json', [{ id: 'old', type: 'hue-config' }])
    const file = write('selected.flow', { rev: '1', flows: [{ id: 'new', type: 'hueUltimateController' }] })
    options.env.KNXULTIMATE_FLOW_FILE = file
    expect(check(options).files).to.deep.equal([file])
    expect(check(options).legacy).to.have.length(0)
  })
  it('honours an explicit userDir', () => {
    write('custom/flows.json', [{ id: 'old', type: 'matter-config' }])
    options.env.KNXULTIMATE_NODE_RED_USER_DIR = path.join(dir, 'custom')
    expect(check(options).legacy).to.have.length(1)
  })
  it('fails on malformed standard flows and missing explicit files', () => {
    fs.writeFileSync(path.join(dir, 'flows.json'), '{invalid')
    expect(check(options).errors).to.have.length(1)
    options.env.KNXULTIMATE_FLOW_FILE = path.join(dir, 'missing.json')
    expect(check(options).errors).to.have.length(1)
  })
  it('warns when discovery cannot inspect any saved flow', () => {
    expect(check(options).warnings.join(' ')).to.include('No saved flow')
  })
  it('does not apply to other major versions', () => {
    write('flows.json', [{ id: 'old', type: 'hue-config' }])
    expect(check({ ...options, version: '7.1.2' }).legacy).to.have.length(0)
  })
  it('warns without blocking or modifying flows and never prints credentials', () => {
    const file = write('flows.json', [{ id: 'old', type: 'hue-config', credentials: { token: 'SECRET-DO-NOT-PRINT' } }])
    const before = fs.readFileSync(file, 'utf8')
    const child = spawnSync(process.execPath, [path.join(__dirname, '../scripts/check-legacy-flows.js')], { cwd: dir, env: { ...process.env, KNXULTIMATE_FLOW_FILE: file }, encoding: 'utf8' })
    expect(child.status).to.equal(0)
    expect(child.stderr).to.include('migration required').and.include('hue-config')
    expect(child.stderr).not.to.include('SECRET-DO-NOT-PRINT')
    expect(fs.readFileSync(file, 'utf8')).to.equal(before)
  })
  it('still detects legacy nodes when another flow entry is malformed', () => {
    write('flows.json', [null, { id: 'old', type: 'hue-config' }])
    expect(check(options).legacy).to.have.length(1)
    expect(check(options).errors).not.to.have.length(0)
  })
  it('rejects a standard flow file with the wrong JSON structure', () => {
    write('flows.json', { unexpected: true })
    expect(check(options).errors).to.have.length(1)
  })
  it('does not let an unrelated JSON file hide the default Node-RED flow', () => {
    write('unrelated.json', { greeting: 'hello' })
    write('.node-red/flows.json', [{ id: 'old', type: 'matter-config' }])
    expect(check(options).legacy).to.have.length(1)
  })
  it('reports counts across several files without double-counting discovery paths', () => {
    write('flows.json', [{ id: '1', type: 'hue-config' }, { id: '2', type: 'hue-config' }])
    write('house.json', [{ id: '3', type: 'matter-config' }])
    options.env.npm_config_local_prefix = dir
    const result = check(options)
    expect(result.files).to.have.length(2)
    expect(result.legacy.map(item => item.count).sort()).to.deep.equal([1, 2])
  })
  it('accepts an empty flow and does not fall back to an unrelated installation', () => {
    write('flows.json', [])
    write('.node-red/flows.json', [{ id: 'old', type: 'hue-config' }])
    expect(check(options).legacy).to.have.length(0)
    expect(check(options).files).to.deep.equal([path.join(dir, 'flows.json')])
  })
  it('reads UTF-8 BOM flow files', () => {
    const file = write('flows.json', [{ id: 'old', type: 'hue-config' }])
    fs.writeFileSync(file, '\uFEFF' + fs.readFileSync(file, 'utf8'))
    expect(check(options).legacy).to.have.length(1)
  })
  it('reports an unreadable flow, without exposing file contents', () => {
    const file = write('flows.json', [])
    const original = fs.readFileSync
    try {
      fs.readFileSync = function (target, ...args) {
        if (target === file) { const error = new Error('private detail'); error.code = 'EACCES'; throw error }
        return original.call(this, target, ...args)
      }
      const result = check(options)
      expect(result.errors).to.have.length(1)
      expect(result.errors[0]).to.include('EACCES').and.not.include('private detail')
    } finally { fs.readFileSync = original }
  })
  it('fails clearly for a missing explicit user directory', () => {
    options.env.KNXULTIMATE_NODE_RED_USER_DIR = path.join(dir, 'missing')
    expect(check(options).errors).to.have.length(1)
  })
  it('resolves relative explicit paths against INIT_CWD', () => {
    write('custom/house.flow', [{ id: 'old', type: 'matter-config' }])
    options.env.KNXULTIMATE_FLOW_FILE = 'custom/house.flow'
    expect(check(options).legacy).to.have.length(1)
  })
  it('explicit flow path takes priority over userDir', () => {
    const file = write('clean.flow', [])
    write('other/flows.json', [{ id: 'old', type: 'hue-config' }])
    options.env.KNXULTIMATE_FLOW_FILE = file
    options.env.KNXULTIMATE_NODE_RED_USER_DIR = path.join(dir, 'other')
    expect(check(options).legacy).to.have.length(0)
  })
  it('warns about dynamic settings and never runs them', () => {
    fs.writeFileSync(path.join(dir, 'settings.js'), "throw new Error('never run'); module.exports = { flowFile: process.env.FLOWS };")
    expect(check(options).warnings.join(' ')).to.include('Dynamic flowFile')
  })
  it('supports relative settings paths and ignores commented settings', () => {
    write('nested/house.flow', [{ id: 'old', type: 'matter-config' }])
    fs.writeFileSync(path.join(dir, 'settings.js'), "// flowFile: 'missing.json',\nmodule.exports = { flowFile: 'nested/house.flow' };")
    expect(check(options).errors).to.have.length(0)
    expect(check(options).legacy).to.have.length(1)
  })
  it('does not inspect archives, node_modules or device storage', () => {
    write('flows.json', [])
    for (const file of ['flows_backup.json', 'flows_cred.json', 'backup/flows.json', 'node_modules/example/flows.json', 'knxultimatestorage/flows.json', 'examples/flows.json']) write(file, [{ id: 'old', type: 'hue-config' }])
    expect(check(options).legacy).to.have.length(0)
  })
  it('fails on malformed project metadata or a missing configured project flow', () => {
    fs.writeFileSync(path.join(dir, '.config.projects.json'), '{broken')
    expect(check(options).errors).to.have.length(1)
    write('.config.projects.json', { activeProject: 'home' })
    write('projects/home/package.json', { 'node-red': { settings: { flowFile: 'missing.json' } } })
    expect(check(options).errors).to.have.length(1)
  })
  it('checks nested npm installations', () => {
    options.packageDir = path.join(dir, 'node_modules/parent/node_modules/node-red-contrib-knx-ultimate')
    options.cwd = options.packageDir
    options.env = {}
    write('flows.json', [{ id: 'old', type: 'hue-config' }])
    expect(check(options).legacy).to.have.length(1)
  })
  it('applies to prerelease and future minor versions in major 8 only', () => {
    write('flows.json', [{ id: 'old', type: 'hue-config' }])
    for (const version of ['8.0.0-beta.1', '8.99.99']) expect(check({ ...options, version }).legacy).to.have.length(1)
    for (const version of ['7.9.9', '9.0.0', '18.0.0']) expect(check({ ...options, version }).legacy).to.have.length(0)
  })
  it('returns zero for migrated flows through the executable entry point', () => {
    const file = write('flows.json', [{ id: 'new', type: 'matterUltimateController' }])
    const child = spawnSync(process.execPath, [path.join(__dirname, '../scripts/check-legacy-flows.js')], { cwd: dir, env: { ...process.env, KNXULTIMATE_FLOW_FILE: file }, encoding: 'utf8' })
    expect(child.status).to.equal(0)
    expect(child.stderr).not.to.include('installation blocked')
  })

  it('allows real npm installs while warning when dependency lifecycle scripts are approved', function () {
    this.timeout(60000)
    const manifest = require('../package.json')
    expect(manifest.scripts.preinstall).to.equal('node scripts/check-legacy-flows.js')
    expect(manifest.files).to.include('scripts/check-legacy-flows.js')
    // Only omit unrelated dependencies: exercise the actual shipped preinstall
    // script and manifest hook, without network access or the user's Node-RED.
    const source = path.join(dir, 'source')
    write('source/package.json', { name: manifest.name, version: manifest.version, files: ['scripts/check-legacy-flows.js'], scripts: { preinstall: manifest.scripts.preinstall } })
    fs.mkdirSync(path.join(source, 'scripts'))
    fs.copyFileSync(path.join(__dirname, '../scripts/check-legacy-flows.js'), path.join(source, 'scripts/check-legacy-flows.js'))
    const npm = (args, cwd, env = {}) => {
      // npm's own JS entry point avoids shell quoting and works on Windows too.
      const executable = process.env.npm_execpath
      const command = executable ? process.execPath : 'npm'
      const prefix = executable ? [executable] : []
      const child = spawnSync(command, [...prefix, ...args, '--offline', '--no-audit', '--no-fund', '--cache', path.join(dir, 'cache')], { cwd, env: { ...process.env, ...env }, encoding: 'utf8', timeout: 20000 })
      if (child.error) throw child.error
      return child
    }
    const packed = npm(['pack', '--ignore-scripts', '--json'], source)
    expect(packed.status, packed.stderr).to.equal(0)
    const archive = path.join(source, JSON.parse(packed.stdout)[0].filename)
    for (const [index, type] of ['knxUltimateHueController', 'knxUltimateMatterBridge', 'hueUltimateController'].entries()) {
      // A fresh host is required for every case: reinstalling the same version
      // is "up to date" and npm correctly does not rerun its preinstall hook.
      const target = path.join(dir, `installation-${index}`)
      write(`installation-${index}/package.json`, {
        name: `migration-guard-test-${index}`,
        version: '1.0.0',
        private: true,
        // npm 11 blocks unapproved dependency install scripts by default. The
        // scanner remains best-effort; this case checks its behaviour only when
        // the host project explicitly allows the lifecycle hook to run.
        allowScripts: { [manifest.name]: true }
      })
      const flowPath = path.join(target, 'flows.json')
      fs.writeFileSync(flowPath, JSON.stringify([{ id: 'device', type }]))
      const before = fs.readFileSync(flowPath, 'utf8')
      const result = npm(['install', archive, '--foreground-scripts', '--ignore-scripts=false'], target, { KNXULTIMATE_FLOW_FILE: flowPath })
      expect(result.status, result.stderr).to.equal(0)
      // npm forwards foreground lifecycle output to stdout or stderr depending
      // on its version/platform, so assert against the combined user-visible log.
      const output = `${result.stdout}\n${result.stderr}`
      if (type === 'hueUltimateController') expect(output).not.to.include('migration required')
      else expect(output).to.include('migration required').and.include(type)
      expect(fs.readFileSync(flowPath, 'utf8')).to.equal(before)
    }
  })

})
