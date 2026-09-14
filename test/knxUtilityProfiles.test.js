'use strict'

const { expect } = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const vm = require('vm')
const { execFileSync } = require('child_process')
const bundle = require('../resources/knxUtilityProfiles')
const { profiles, locales } = require('../scripts/knx-utility-profiles/catalog')
const editorFieldContracts = require('../scripts/knx-utility-profiles/editor-field-contracts.json')

const projectRoot = path.resolve(__dirname, '..')
const createRED = (lang = 'en') => ({
  settings: { lang },
  nodes: { node: (id) => id ? { id } : undefined, eachConfig: () => {} },
  validators: { number: () => (value) => !Number.isNaN(Number(value)) },
  editor: {
    createEditor: ({ value }) => ({ getValue: () => value, resize: () => {}, destroy: () => {} })
  },
  sidebar: { show: () => {} },
  _: (key) => key
})

// Exercise the real bundled lifecycle with controllable ETS responses. This
// keeps cancellation tests deterministic and avoids relying on a legacy node.
const createEditorHarness = () => {
  const elements = new Map()
  const requests = []
  const timers = new Map()
  const openedURLs = []
  let nextTimer = 1
  const collection = (items) => ({
    length: items.length,
    each (callback) { items.forEach((item, index) => callback.call(item, index, item)); return this }
  })
  const makeElement = (selector, properties = {}) => ({
    selector, properties, length: 1, value: '', checked: false, children: [],
    handlers: new Map(), dataValues: new Map(), attributes: new Map(),
    val (value) {
      if (value === undefined) return this.value
      this.value = value
      return this
    },
    on (events, callback) {
      events.split(' ').forEach((event) => this.handlers.set(event, callback))
      return this
    },
    off (namespace) {
      Array.from(this.handlers.keys()).forEach((event) => {
        if (event.includes(namespace)) this.handlers.delete(event)
      })
      return this
    },
    trigger (event) {
      this.handlers.forEach((callback, name) => {
        if (name.split('.')[0] === event) callback.call(this, { preventDefault: () => {} })
      })
      return this
    },
    autocomplete (operation, key, value) {
      if (operation && typeof operation === 'object') this.autocompleteOptions = operation
      if (operation === 'option') this.autocompleteOptions[key] = value
      return this
    },
    editableList (operation, data) {
      if (operation && typeof operation === 'object') this.listOptions = operation
      if (operation === 'items') return collection(this.listItems || [])
      if (operation === 'addItem') {
        if (!this.listItems) this.listItems = []
        const row = makeElement('<div>')
        this.listOptions.addItem(row, this.listItems.length, data || {})
        this.listItems.push(row)
      }
      return this
    },
    typedInput (operation, value) {
      if (operation === 'value') return value === undefined ? this.value : this.val(value)
      return this
    },
    data (key, value) {
      if (value === undefined) return this.dataValues.get(key)
      this.dataValues.set(key, value)
      return this
    },
    attr (key, value) {
      if (value === undefined) return this.attributes.get(key)
      this.attributes.set(key, value)
      return this
    },
    is (selector) { return selector === ':checkbox' ? this.properties.type === 'checkbox' : this.checked },
    toggle (visible) { this.visible = visible; return this },
    show () { return this.toggle(true) },
    hide () { return this.toggle(false) },
    text (value) { this.textValue = value; return this },
    append (child) { this.children.push(child); return this },
    appendTo (parent) { parent.children.push(this); return this },
    empty () { this.children = []; this.value = ''; return this },
    accordion () { return this },
    css () { return this },
    closest () { return this },
    focus (callback) { return this.on('focus', callback) },
    change (callback) { return callback ? this.on('change', callback) : this.trigger('change') },
    find (selector) {
      const queue = [...this.children]
      while (queue.length) {
        const item = queue.shift()
        if (!item || typeof item !== 'object') continue
        if ((item.properties.class || '').split(' ').includes(selector.slice(1))) return item
        queue.push(...item.children)
      }
      return makeElement(selector)
    }
  })
  const $ = (selector, properties) => {
    if (typeof selector !== 'string') return selector
    if (selector.startsWith('<')) return makeElement(selector, properties)
    if (!elements.has(selector)) elements.set(selector, makeElement(selector))
    return elements.get(selector)
  }
  $.getJSON = (url, callback) => {
    requests.push({ url, resolve: callback })
    return { fail: () => {} }
  }
  $.map = (values, callback) => values.map(callback).filter((value) => value !== null && value !== undefined)
  const context = {
    $, console, URLSearchParams,
    window: { open: (url) => { openedURLs.push(url); return null } },
    htmlUtilsfullCSVSearch: () => true,
    KNX_enableSecureFormatting: () => {},
    setTimeout: (callback) => {
      const id = nextTimer++
      timers.set(id, callback)
      return id
    },
    clearTimeout: (id) => timers.delete(id)
  }
  vm.runInNewContext(fs.readFileSync(path.join(projectRoot, 'resources/knxUtilityProfiles.js'), 'utf8'), context)
  const profileBundle = context.KNXUltimateUtilityProfiles
  return {
    $, requests, openedURLs,
    profiles: profileBundle,
    mount: (type, overrides = {}, RED = createRED()) => {
      const definition = profileBundle.getDefinition(type, RED)
      const node = { utilityType: type, id: 'utility-node', _: definition._ }
      for (const [key, descriptor] of Object.entries(definition.defaults)) {
        node[key] = descriptor.value === undefined ? undefined : JSON.parse(JSON.stringify(descriptor.value))
      }
      Object.assign(node, { server: 'gateway' }, overrides)
      for (const [key, value] of Object.entries(node)) {
        if (typeof value === 'boolean') {
          $('#node-input-' + key).properties.type = 'checkbox'
          $('#node-input-' + key).checked = value
        } else if (value !== undefined) $('#node-input-' + key).val(value)
      }
      definition.oneditprepare.call(node)
      return { definition, node }
    },
    runTimers: () => {
      const pending = Array.from(timers.values())
      timers.clear()
      pending.forEach((callback) => callback())
    }
  }
}

describe('KNX Utility private editor profiles', () => {
  it('regenerates byte-for-byte using only private sources and no public nodes', () => {
    const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'knx-utility-profiles-'))
    try {
      fs.mkdirSync(path.join(temporaryRoot, 'scripts'))
      fs.mkdirSync(path.join(temporaryRoot, 'resources'))
      fs.cpSync(path.join(projectRoot, 'scripts/knx-utility-profiles'), path.join(temporaryRoot, 'scripts/knx-utility-profiles'), { recursive: true })
      const generatorPath = path.join(temporaryRoot, 'scripts/generate-knx-utility-profiles.js')
      fs.copyFileSync(path.join(projectRoot, 'scripts/generate-knx-utility-profiles.js'), generatorPath)
      execFileSync(process.execPath, [generatorPath])
      const regenerated = fs.readFileSync(path.join(temporaryRoot, 'resources/knxUtilityProfiles.js'), 'utf8')
      expect(regenerated).to.equal(fs.readFileSync(path.join(projectRoot, 'resources/knxUtilityProfiles.js'), 'utf8'))
      execFileSync(process.execPath, [generatorPath, '--check'])
    } finally {
      fs.rmSync(temporaryRoot, { recursive: true, force: true })
    }
  })

  it('captures independent definitions without registering compatibility nodes', () => {
    const RED = createRED()
    RED.nodes.registerType = () => { throw new Error('Real registry must not be called') }
    expect(bundle.PROFILE_TYPES).to.deep.equal(profiles)
    const pins = { alerter: [1, 3], autoresponder: [0, 0], datetime: [0, 0], watchdog: [1, 1], globalcontext: [0, 0], logger: [1, 2], staircase: [1, 1], garage: [1, 1], scenecontroller: [1, 1], loadcontrol: [1, 1], hatranslator: [1, 1] }
    Object.keys(profiles).forEach((type) => {
      const definition = bundle.getDefinition(type, RED)
      expect([definition.inputs, definition.outputs]).to.deep.equal(pins[type])
      if (type === 'hatranslator') expect(definition.defaults).not.to.have.property('server')
      else expect(definition.defaults.server.type).to.equal('knxUltimate-config')
      expect(definition).to.equal(bundle.getDefinition(type, RED))
      expect(definition).not.to.equal(bundle.getDefinition(type, createRED()))
      const template = bundle.getTemplate(type)
      expect(template).to.include('node-input-')
      expect(template).not.to.match(/id="node-input-(?:server|name)"/)
      expect(template).not.to.include('<script')
    })
    expect(bundle.getDefinition('autoresponder', RED).defaults.commandText.value).to.equal('[]')
    expect(bundle.getDefinition('alerter', RED).defaults.rules.value).to.deep.equal([])
    expect(bundle.getDefinition('alerter', RED).defaults).not.to.have.property('property')
  })

  it('preserves every original editor control in the private form fragments', () => {
    // This independent contract was captured from the original legacy forms,
    // before removing only the shared gateway/name and obsolete DateTime topic.
    // Inspect actual form controls, not incidental labels or translation keys.
    for (const type of Object.keys(profiles)) {
      const controls = [...bundle.getTemplate(type).matchAll(/<(?:input|select|textarea|ol|div)\b([^>]*)>/gi)]
        .map((match) => /(?:^|\s)id="([^"]+)"/.exec(match[1])?.[1])
        .filter(Boolean)
      expect(editorFieldContracts[type], `${type} original field contract`).to.be.an('array').and.not.be.empty
      for (const field of editorFieldContracts[type]) {
        expect(controls.filter((id) => id === 'node-input-' + field), `${type}: ${field}`).to.have.length(1)
      }
      expect(controls, `${type} shared gateway`).not.to.include('node-input-server')
      expect(controls, `${type} shared name`).not.to.include('node-input-name')
    }
  })

  it('embeds every dictionary and resolves fully qualified private namespaces in all locales', () => {
    for (const locale of locales) {
      for (const [type, namespace] of Object.entries(profiles)) {
        const dictionary = require(path.join(projectRoot, 'scripts/knx-utility-profiles/locales', locale, `${type}.json`))
        const RED = createRED(locale)
        const key = `${namespace}.paletteLabel`
        expect(bundle.translate(type, key, RED)).to.equal(dictionary[namespace].paletteLabel)
        // A fully qualified key selects its private namespace independently of
        // the currently mounted profile and of loaded Node-RED legacy catalogs.
        expect(bundle.translate('alerter', `node-red-contrib-knx-ultimate/${namespace}:${key}`, RED)).to.equal(dictionary[namespace].paletteLabel)
      }
    }
    expect(bundle.translate('autoresponder', 'knxUltimateAutoResponder.respondTo', createRED('it'))).to.equal('Rispondi a')
  })

  it('rejects malformed AutoResponder directives and accepts empty or valid address lists', () => {
    const validate = bundle.getDefinition('autoresponder', createRED()).defaults.commandText.validate
    for (const value of ['', '[', '{}', 'null', '[null]', '[{"ga":123,"default":false}]', '[{"ga":"1/2/3"}]']) {
      expect(validate(value), value).to.equal(false)
    }
    expect(validate('[]')).to.equal(true)
    expect(validate('[{"ga":"1/2/3..8","default":false},{"ga":"1/2/9","dpt":"5.001","default":25}]')).to.equal(true)
  })

  it('prefers the active Node-RED locale and retains fallbacks for unsupported locales and external keys', () => {
    const RED = createRED('en')
    RED._ = (key) => key.endsWith('knxUltimateUtility.locale') ? 'it-IT' : `external:${key}`
    expect(bundle.currentLocale(RED)).to.equal('it')
    expect(bundle.translate('datetime', 'knxUltimateDateTime.gaDate', RED)).to.equal('GA Data (DPT 11.001)')
    expect(bundle.translate('datetime', 'editor.externalLabel', RED)).to.equal('external:editor.externalLabel')
    expect(bundle.normalizeLocale('zh-Hans')).to.equal('zh-CN')
    expect(bundle.normalizeLocale('xx-XX')).to.equal('en')
    expect(bundle.normalizeUtilityType('unknown')).to.equal('alerter')
  })

  it('keeps the DateTime send button on the Utility endpoint with localized queued feedback', () => {
    const harness = createEditorHarness()
    const RED = createRED('it')
    let sent
    let notice
    harness.$.ajax = (request) => { sent = request }
    RED.notify = (message, type) => { notice = { message, type } }
    harness.profiles.getDefinition('datetime', RED).button.onclick.call({ id: 'utility-datetime' })
    expect(sent.url).to.equal('knxUltimateUtility/sendNow')
    expect(sent.data.id).to.equal('utility-datetime')
    sent.success({ queued: true })
    expect(notice).to.deep.equal({
      message: harness.profiles.translate('datetime', 'knxUltimateDateTime.notifyQueued', RED),
      type: 'success'
    })
  })

  it('suggests coherent ETS addresses through the private DateTime helpers', async () => {
    const harness = createEditorHarness()
    const definition = harness.profiles.getDefinition('datetime', createRED())
    const node = { utilityType: 'datetime', server: 'gateway', gaDateTime: '', gaDate: '', gaTime: '' }
    harness.$('#node-input-server').val('gateway')
    definition.oneditprepare.call(node)
    harness.runTimers()
    expect(harness.requests).to.have.length(1)
    harness.requests[0].resolve([
      { ga: '1/7/10', dpt: '19.001', devicename: 'Home date / time' },
      { ga: '1/7/9', dpt: '19.001', devicename: 'Home date / time' },
      { ga: '1/7/2', dpt: '11.001', devicename: 'Home date' },
      { ga: '1/7/3', dpt: '10.001', devicename: 'Home time' },
      { ga: '1/0/0', dpt: '1.001', devicename: 'DateTime switch' }
    ])
    await new Promise((resolve) => setImmediate(resolve))
    expect(node.gaDateTime).to.equal('1/7/9')
    expect(node.gaDate).to.equal('1/7/2')
    expect(node.gaTime).to.equal('1/7/3')
    expect(harness.$('#node-input-gaDateTime').val()).to.equal('1/7/9')
    definition.oneditcancel.call(node)
  })

  it('ignores pending DateTime responses after unmounting and detaches shared gateway handlers', async () => {
    const harness = createEditorHarness()
    const definition = harness.profiles.getDefinition('datetime', createRED())
    const node = { utilityType: 'datetime', server: 'gateway', gaDateTime: '', gaDate: '', gaTime: '' }
    harness.$('#node-input-server').val('gateway')
    definition.oneditprepare.call(node)
    harness.runTimers()
    expect(harness.requests).to.have.length(1)
    definition.oneditcancel.call(node)
    harness.$('#node-input-gaDateTime').val('next-profile-value')
    harness.requests[0].resolve([{ ga: '1/7/1', dpt: '19.001', devicename: 'Date time' }])
    await new Promise((resolve) => setImmediate(resolve))
    expect(node.gaDateTime).to.equal('')
    expect(harness.$('#node-input-gaDateTime').val()).to.equal('next-profile-value')
    expect(harness.$('#node-input-server').handlers.size).to.equal(0)
  })

  it('ignores outdated DateTime suggestions when the user chooses another gateway', async () => {
    const harness = createEditorHarness()
    const definition = harness.profiles.getDefinition('datetime', createRED())
    const node = { utilityType: 'datetime', server: 'gateway', gaDateTime: '', gaDate: '', gaTime: '' }
    harness.$('#node-input-server').val('gateway')
    definition.oneditprepare.call(node)
    harness.runTimers()
    harness.$('#node-input-server').val('other-gateway')
    harness.requests[0].resolve([{ ga: '1/7/1', dpt: '19.001', devicename: 'Date time' }])
    await new Promise((resolve) => setImmediate(resolve))
    expect(node.gaDateTime).to.equal('')
    expect(harness.$('#node-input-server').val()).to.equal('other-gateway')
    definition.oneditcancel.call(node)
  })

  it('preserves manual DateTime edits made while ETS suggestions are still loading', async () => {
    const harness = createEditorHarness()
    const definition = harness.profiles.getDefinition('datetime', createRED())
    const node = { utilityType: 'datetime', server: 'gateway', gaDateTime: '', gaDate: '', gaTime: '' }
    harness.$('#node-input-server').val('gateway')
    definition.oneditprepare.call(node)
    harness.runTimers()
    harness.$('#node-input-gaDateTime').val('4/5/6')
    harness.$('#node-input-nameDateTime').val('My clock')
    harness.requests[0].resolve([{ ga: '1/7/1', dpt: '19.001', devicename: 'ETS clock' }])
    await new Promise((resolve) => setImmediate(resolve))
    expect(harness.$('#node-input-gaDateTime').val()).to.equal('4/5/6')
    expect(harness.$('#node-input-nameDateTime').val()).to.equal('My clock')
    expect(node.gaDateTime).to.equal('')
    definition.oneditcancel.call(node)
  })

  it('mounts and cleans up every private function without calling a legacy editor', () => {
    for (const type of Object.keys(profiles)) {
      const harness = createEditorHarness()
      const { definition, node } = harness.mount(type)
      definition.oneditcancel.call(node)
      expect(harness.$('#node-input-server').handlers.size, type).to.equal(0)
    }
  })

  it('filters binary KNX inputs and fills related fields when autocomplete is selected', async () => {
    const fields = { watchdog: 'topic', staircase: 'gaTrigger', garage: 'gaCommand' }
    for (const [type, field] of Object.entries(fields)) {
      const harness = createEditorHarness()
      const { definition, node } = harness.mount(type)
      const input = harness.$('#node-input-' + field)
      let suggestions
      input.autocompleteOptions.source({ term: '' }, (items) => { suggestions = items })
      expect(harness.requests).to.have.length(1)
      harness.requests[0].resolve([
        { ga: '1/2/3', dpt: '1.001', devicename: 'Hall switch' },
        { ga: '1/2/4', dpt: '9.001', devicename: 'Hall temperature' }
      ])
      await new Promise((resolve) => setImmediate(resolve))
      expect(suggestions.map((item) => item.value), type).to.deep.equal(['1/2/3'])
      input.autocompleteOptions.select.call(input, { preventDefault: () => {} }, { item: suggestions[0] })
      if (type === 'watchdog') expect(harness.$('#node-input-name').val()).to.equal('Hall switch')
      if (type === 'staircase') expect(harness.$('#node-input-nameTrigger').val()).to.equal('Hall switch')
      if (type === 'garage') expect(harness.$('#node-input-nameCommand').val()).to.equal('Hall switch')
      definition.oneditcancel.call(node)
    }
  })

  it('discards autocomplete responses after cleanup or gateway changes for every new KNX lookup profile', async () => {
    const fields = { watchdog: 'topic', staircase: 'gaTrigger', garage: 'gaCommand', scenecontroller: 'topic', loadcontrol: 'GA1' }
    for (const [type, field] of Object.entries(fields)) {
      for (const cancel of [true, false]) {
        const harness = createEditorHarness()
        const { definition, node } = harness.mount(type)
        let responses = 0
        harness.$('#node-input-' + field).autocompleteOptions.source({ term: '' }, () => { responses++ })
        const request = harness.requests.find((entry) => entry.url.startsWith('knxUltimatecsv?'))
        expect(request, `${type} ETS request`).not.to.equal(undefined)
        if (cancel) definition.oneditcancel.call(node)
        else harness.$('#node-input-server').val('another-gateway').trigger('change')
        request.resolve([{ ga: '1/2/3', dpt: '1.001', devicename: 'Old gateway switch' }])
        await new Promise((resolve) => setImmediate(resolve))
        expect(responses, `${type}, ${cancel ? 'cleanup' : 'gateway change'}`).to.equal(0)
        if (!cancel) definition.oneditcancel.call(node)
      }
    }
  })

  it('preserves saved and edited DPT selections while asynchronous catalogs load', async () => {
    for (const type of ['scenecontroller', 'loadcontrol']) {
      const harness = createEditorHarness()
      const { definition, node } = harness.mount(type, { dpt: '1.001', dptSave: '1.001', DPT1: '1.001' })
      expect(harness.$('#node-input-dpt').val(), `${type} immediate saved DPT`).to.equal('1.001')
      expect(harness.requests.filter((entry) => entry.url.startsWith('knxUltimateDpts?'))).to.have.length(1)
      harness.$('#node-input-dpt').val('9.001')
      harness.requests[0].resolve([{ value: '1.001', text: 'Boolean' }, { value: '9.001', text: 'Temperature' }])
      await new Promise((resolve) => setImmediate(resolve))
      expect(harness.$('#node-input-dpt').val(), `${type} edited DPT`).to.equal('9.001')
      definition.oneditcancel.call(node)
    }
  })

  it('edits scene rows locally and never deletes persisted scenes while the dialog is open', () => {
    const harness = createEditorHarness()
    const { definition, node } = harness.mount('scenecontroller')
    const list = harness.$('#node-input-rule-container')
    list.editableList('addItem', {})
    const row = list.listItems[0]
    row.find('.rowRuleTopic').val('2/3/4')
    row.find('.rowRuleDPT').val('1.001')
    row.find('.rowRuleSend').val('true')
    row.find('.rowRuleDeviceName').val('Entrance')
    definition.oneditsave.call(node)
    expect(node.rules).to.deep.equal([{ topic: '2/3/4', devicename: 'Entrance', dpt: '1.001', send: 'true' }])
    list.listOptions.removeItem({})
    expect(harness.requests).to.have.length(1)
    expect(harness.requests[0].url).to.match(/^knxUltimateDpts\?/)
    definition.oneditcancel.call(node)
  })

  it('uses the Utility Logger download route with the configured admin root and access token', () => {
    const harness = createEditorHarness()
    const RED = createRED()
    RED.settings.httpAdminRoot = '/editor/'
    RED.settings.get = () => ({ access_token: 'test-token' })
    const { definition, node } = harness.mount('logger', { id: 'logger-utility', filePath: '/tmp/logger.xml' }, RED)
    harness.$('#knx-logger-downloadButton').trigger('click')
    expect(harness.openedURLs).to.have.length(1)
    const url = new URL(harness.openedURLs[0], 'http://localhost')
    expect(url.pathname).to.equal('/editor/knxUltimateUtility/logger/download')
    expect(url.searchParams.get('nodeId')).to.equal('logger-utility')
    expect(url.searchParams.get('access_token')).to.equal('test-token')
    definition.oneditcancel.call(node)
  })

  it('retains GlobalContext variable rules and validates active numeric controls', () => {
    const RED = createRED()
    const global = bundle.getDefinition('globalcontext', RED).defaults
    expect(global.name.value).to.equal('KNXGlobalContext')
    expect(global.name.validate('Building')).to.equal(true)
    expect(global.name.validate('Building context')).to.equal(false)
    expect(global.name.validate('')).to.equal(false)
    const watchdog = bundle.getDefinition('watchdog', RED).defaults
    expect(watchdog.maxRetry.validate.call({}, 1.5)).to.equal(false)
    expect(watchdog.maxRetry.validate.call({}, 0)).to.equal(true)
    expect(watchdog.retryInterval.validate.call({}, 0)).to.equal(false)
    expect(watchdog.maxRetry.validate.call({}, 6)).to.equal(true)
    const staircase = bundle.getDefinition('staircase', RED).defaults
    expect(staircase.timerSeconds.validate.call({}, 0)).to.equal(false)
    expect(staircase.preWarnSeconds.validate.call({ preWarnEnable: false }, '')).to.equal(true)
    expect(staircase.preWarnSeconds.validate.call({ preWarnEnable: true }, '')).to.equal(false)
    const garage = bundle.getDefinition('garage', RED).defaults
    expect(garage.autoCloseSeconds.validate.call({ autoCloseEnable: false }, '')).to.equal(true)
    expect(garage.autoCloseSeconds.validate.call({ autoCloseEnable: true }, -1)).to.equal(false)
    const logger = bundle.getDefinition('logger', RED).defaults
    expect(logger.intervalTelegramCount.validate.call({ autoStartTimerTelegramCounter: false }, '')).to.equal(true)
    expect(logger.intervalTelegramCount.validate.call({ autoStartTimerTelegramCounter: true }, 0)).to.equal(false)
    const load = bundle.getDefinition('loadcontrol', RED).defaults
    expect(load.wattLimit.validate.call({ controlMode: 'msg' }, '')).to.equal(true)
    expect(load.wattLimit.validate.call({ controlMode: 'auto' }, 'invalid')).to.equal(false)
  })

  it('keeps HA state mappings independent from AutoResponder JSON defaults', () => {
    const harness = createEditorHarness()
    const created = []
    const RED = createRED()
    RED.editor.createEditor = (options) => {
      created.push(options)
      return { getValue: () => options.value, resize: () => {}, destroy: () => {} }
    }
    const { definition, node } = harness.mount('hatranslator', { commandText: '[]', server: undefined }, RED)
    expect(definition.defaults).not.to.have.property('commandText')
    expect(node.payloadPropName).to.equal('payload')
    expect(created[0].value).to.equal('on:true\noff:false\nactive:true\ninactive:false\nopen:true\nclosed:false\nclose:false\n1:true\n0:false\ntrue:true\nfalse:false\nhome:true\nnot_home:false')
    expect(harness.requests).to.have.length(0)
    definition.oneditsave.call(node)
    expect(node.commandText).to.equal('[]')
    expect(node.haTranslationTable).to.equal(created[0].value)
    definition.oneditcancel.call(node)
    const empty = harness.mount('hatranslator', { haTranslationTable: '' }, RED)
    expect(created[1].value).to.equal('')
    empty.definition.oneditcancel.call(empty.node)
  })

  it('collects HA drafts repeatedly and resizes Ace until cleanup destroys it once', () => {
    const harness = createEditorHarness()
    const RED = createRED()
    let value = 'occupied:true\nvacant:false'
    let destroyed = 0
    let resized = 0
    RED.editor.createEditor = () => ({
      getValue: () => { if (destroyed) throw new Error('Reading a destroyed editor'); return value },
      resize: () => { resized++ },
      destroy: () => { destroyed++ }
    })
    const { definition, node } = harness.mount('hatranslator', { haTranslationTable: value }, RED)
    definition.oneditresize.call(node, { width: 720, height: 800 })
    definition.oneditsave.call(node)
    value = 'occupied:true\nvacant:false\naway:false'
    definition.oneditsave.call(node)
    expect(node.haTranslationTable).to.equal(value)
    expect(destroyed).to.equal(0)
    expect(resized).to.equal(1)
    definition.oneditcancel.call(node)
    definition.oneditcancel.call(node)
    definition.oneditresize.call(node, { width: 720, height: 800 })
    expect(destroyed).to.equal(1)
    expect(resized).to.equal(1)
    expect(node).not.to.have.property('editor')
  })

  it('restores HA translation drafts after unmounting and leaves them untouched on Cancel', () => {
    const harness = createEditorHarness()
    const RED = createRED()
    const editors = []
    RED.editor.createEditor = ({ value }) => {
      const editor = { value, destroyed: 0, getValue: () => editor.value, resize: () => {}, destroy: () => { editor.destroyed++ } }
      editors.push(editor)
      return editor
    }
    const { definition, node } = harness.mount('hatranslator', { haTranslationTable: 'custom:true' }, RED)
    editors[0].value = 'custom:true\nother:false'
    definition.oneditsave.call(node)
    definition.oneditcancel.call(node)
    definition.oneditprepare.call(node)
    expect(editors[1].value).to.equal('custom:true\nother:false')
    editors[1].value = 'discarded:true'
    definition.oneditcancel.call(node)
    expect(node.haTranslationTable).to.equal('custom:true\nother:false')
    expect(editors.map((editor) => editor.destroyed)).to.deep.equal([1, 1])
  })
})
