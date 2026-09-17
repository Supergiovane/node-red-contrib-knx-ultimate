const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const legacyResources = require('./fixtures/knx7-editor-resources.json')

const projectRoot = path.resolve(__dirname, '..')
const legacyPlugin = fs.readFileSync(path.join(__dirname, 'fixtures/knx7-migration-notice.html'), 'utf8')

function editor (language = 'it-IT') {
  const notifications = []
  const timers = new Map()
  const plugins = new Map()
  let nextTimer = 0
  const unavailable = new Proxy({}, {
    get (_target, name) { throw new Error(`The restart notice must not access flows: ${String(name)}`) }
  })
  const context = {
    $ () { throw new Error('The restart notice must not open a migration dialog') },
    setTimeout (callback) { const id = ++nextTimer; timers.set(id, callback); return id },
    clearTimeout (id) { timers.delete(id) },
    RED: {
      i18n: { lang: () => language },
      nodes: unavailable,
      events: unavailable,
      history: unavailable,
      notify (message, options) {
        const notification = { message, options, closeCount: 0, close () { this.closeCount++ } }
        notifications.push(notification)
        return notification
      },
      plugins: {
        registerPlugin (id, plugin) { plugins.set(id, plugin); plugin.onadd() }
      }
    }
  }
  context.window = context
  vm.createContext(context)

  function loadResource (filename) {
    const source = fs.readFileSync(path.join(projectRoot, 'resources', filename), 'utf8')
    vm.runInContext(source, context, { filename })
  }

  function loadCachedPlugin () {
    // Replay the actual version 7 template with scripts served from version 8.
    for (const [, attributes, body] of legacyPlugin.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const src = /src="resources\/node-red-contrib-knx-ultimate\/([^"]+)"/.exec(attributes)
      if (src) loadResource(src[1])
      else vm.runInContext(body, context, { filename: 'cached-knx7-plugin.html' })
    }
  }

  function flush () {
    const pending = Array.from(timers.values())
    timers.clear()
    pending.forEach(callback => callback())
  }

  return { context, plugins, notifications, timers, loadResource, loadCachedPlugin, flush }
}

describe('Version 7 editor compatibility while waiting for the version 8 restart', () => {
  it('keeps every script URL requested by the published version 7 editor loadable', () => {
    for (const script of legacyResources.scripts) {
      const filename = path.join(projectRoot, 'resources', script)
      expect(fs.existsSync(filename), `Missing cached editor dependency: ${script}`).to.equal(true)
      expect(() => new vm.Script(fs.readFileSync(filename, 'utf8'), { filename }), script).not.to.throw()
    }
  })

  it('loads the original cached plugin and replaces migration with a non-modal restart notice', () => {
    const state = editor()
    expect(() => state.loadCachedPlugin()).not.to.throw()
    expect(state.plugins.has('knxUltimate-migration-notice-plugin')).to.equal(true)
    expect(state.notifications).to.have.length(0)
    state.flush()
    expect(state.notifications).to.have.length(1)
    expect(state.notifications[0].message).to.include('Riavvia il servizio Node-RED')
    expect(state.notifications[0].options).to.include({ type: 'warning', fixed: true, modal: false })
    expect(state.notifications[0].options).not.to.have.property('buttons')
  })

  it('does not schedule duplicate notices when the old plugin installs more than once', () => {
    const state = editor()
    state.loadCachedPlugin()
    const api = state.context.KNXUltimateLegacyMigrationNotice
    const first = api.install(state.context.RED, { environment: state.context })
    const second = api.install(state.context.RED, { environment: state.context })
    expect(first).to.equal(second)
    expect(state.timers.size).to.equal(1)
    state.flush()
    api.install(state.context.RED, { environment: state.context })
    state.flush()
    expect(state.notifications).to.have.length(1)
  })

  it('cancels the pending notice when the cached plugin is removed', () => {
    const state = editor()
    state.loadCachedPlugin()
    state.plugins.get('knxUltimate-migration-notice-plugin').onremove()
    expect(state.timers.size).to.equal(0)
    state.flush()
    expect(state.notifications).to.have.length(0)
  })

  it('closes a shown notice once and supports a later installation', () => {
    const state = editor()
    state.loadCachedPlugin()
    state.flush()
    const plugin = state.plugins.get('knxUltimate-migration-notice-plugin')
    plugin.onremove()
    plugin.onremove()
    expect(state.notifications[0].closeCount).to.equal(1)
    plugin.onadd()
    state.flush()
    expect(state.notifications).to.have.length(2)
  })

  it('uses the browser language when editor language is unavailable and falls back to English', () => {
    for (const [language, expected] of [['zh-CN', '请重启 Node-RED 服务'], ['unknown', 'Restart the Node-RED service']]) {
      const state = editor()
      delete state.context.RED.i18n
      state.context.navigator = { language }
      state.loadCachedPlugin()
      state.flush()
      expect(state.notifications[0].message).to.include(expected)
    }
  })

  it('keeps retired helper scripts inert and preserves the separate packages’ globals', () => {
    const state = editor()
    state.context.HueStandaloneKNXUltimateHueControllerMigration = { marker: 'hue' }
    state.context.MatterStandaloneKNXUltimateFlowMigrationBackup = { marker: 'matter' }
    const before = { ...state.context }
    for (const filename of [
      '11f26b4500.js', 'KNXAIChatAdapterMappings.js', 'configNodeEditorSelection.js',
      'hueControllerEditorSelection.js', 'hueControllerProfiles.js', 'matterQrScanner.js',
      'hueControllerMigration.js', 'hueControllerMigrationDialog.js'
    ]) state.loadResource(filename)
    expect(Object.keys(state.context)).to.deep.equal(Object.keys(before))
    for (const name of Object.keys(before)) expect(state.context[name]).to.equal(before[name])
    expect(state.notifications).to.have.length(0)
    expect(state.plugins.size).to.equal(0)
  })
})
