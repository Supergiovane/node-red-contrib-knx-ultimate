'use strict'

const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const projectRoot = path.resolve(__dirname, '..')
const editorHTML = fs.readFileSync(path.join(projectRoot, 'nodes/knxUltimateUtility.html'), 'utf8')
const bundleSource = fs.readFileSync(path.join(projectRoot, 'resources/knxUtilityProfiles.js'), 'utf8')
const wrapperTemplate = [...editorHTML.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => /data-template-name="knxUltimateUtility"/.test(match[1]))[2]

const clone = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value))

const createDOM = () => {
  const controls = new Map()
  const profileControls = new Set()
  const collection = (elements) => ({
    length: elements.length,
    each (callback) { elements.forEach((element, index) => callback.call(element, index, element)); return this },
    on (events, callback) { elements.forEach((element) => element.on(events, callback)); return this }
  })
  const emptyCollection = collection([])
  const makeControl = (id, type = 'text', length = 1) => ({
    id, type, length, value: '', checked: false,
    handlers: new Map(), attributes: new Map(), dataValues: new Map(),
    val (value) {
      if (value === undefined) return this.value
      this.value = value
      return this
    },
    prop (name, value) {
      if (value === undefined) return this[name]
      this[name] = value
      return this
    },
    is (selector) { return selector === ':checkbox' ? this.type === 'checkbox' : this.checked },
    attr (name, value) {
      if (value === undefined) return this.attributes.get(name)
      this.attributes.set(name, value)
      return this
    },
    removeAttr (name) { this.attributes.delete(name); return this },
    text (value) { this.textValue = value; return this },
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
        if (name.split('.')[0] === event) callback.call(this)
      })
      return this
    },
    toggle (visible) { this.visible = visible; return this },
    css () { return this },
    find (selector) {
      if (selector === 'input, select, textarea') return collection(Array.from(profileControls, (key) => controls.get(key)))
      return emptyCollection
    },
    empty () {
      profileControls.forEach((key) => controls.delete(key))
      profileControls.clear()
      return this
    },
    html (html) {
      mount(html, true)
      return this
    },
    typedInput (operation, value) {
      if (operation === 'value') return value === undefined ? this.value : this.val(value)
      return this
    },
    editableList (operation) {
      if (operation === 'items') return emptyCollection
      return this
    },
    autocomplete () { return this },
    data (name, value) {
      if (value === undefined) return this.dataValues.get(name)
      this.dataValues.set(name, value)
      return this
    }
  })

  function mount (html, profile = false) {
    for (const match of html.matchAll(/<(?:input|select|ol|div|button)\b([^>]*)>/gi)) {
      const id = /\bid="([^"]+)"/.exec(match[1])?.[1]
      if (!id) continue
      const key = '#' + id
      const type = /\btype="([^"]+)"/.exec(match[1])?.[1] || 'text'
      controls.set(key, makeControl(id, type))
      if (profile) profileControls.add(key)
    }
  }

  mount(wrapperTemplate)
  const $ = (selector) => {
    if (typeof selector !== 'string') return selector
    return controls.get(selector) || makeControl(selector, 'text', 0)
  }
  return { $, controls }
}

const loadEditor = (locale = 'en') => {
  const dictionary = require(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateUtility.json'))
  const { $, controls } = createDOM()
  const registrations = []
  const requests = []
  const timers = new Map()
  const codeEditors = []
  let nextTimer = 1
  $.ajax = (request) => requests.push(request)
  $.getJSON = (_url, callback) => { callback([]); return { fail: () => {} } }
  const RED = {
    settings: { lang: locale },
    nodes: {
      registerType: (type, definition) => registrations.push({ type, definition }),
      node: (id) => ({ id, type: 'knxUltimate-config' }),
      getType: () => { throw new Error('Legacy editor definitions are unavailable') },
      eachConfig: () => {}
    },
    validators: {
      number: () => (value) => String(value).trim() !== '' && Number.isFinite(Number(value))
    },
    sidebar: { show: () => {} },
    editor: {
      createEditor: options => {
        const editor = {
          value: options.value,
          destroyed: 0,
          resized: 0,
          getValue () { return this.value },
          setValue (value) { this.value = value },
          destroy () { this.destroyed++ },
          resize () { this.resized++ }
        }
        codeEditors.push(editor)
        return editor
      }
    },
    notify: () => {},
    _: (key) => {
      const localKey = key.slice(key.lastIndexOf(':') + 1)
      return localKey.split('.').reduce((value, part) => value?.[part], dictionary) || key
    }
  }
  const sandbox = {
    RED, $, console,
    htmlUtilsfullCSVSearch: () => true,
    KNX_enableSecureFormatting: () => {},
    setTimeout: (callback) => {
      const id = nextTimer++
      timers.set(id, callback)
      return id
    },
    clearTimeout: (id) => timers.delete(id)
  }
  sandbox.window = sandbox
  const context = vm.createContext(sandbox)
  vm.runInContext(bundleSource, context)
  for (const match of editorHTML.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/type="text\/javascript"/.test(match[1]) && !/\bsrc\s*=/.test(match[1])) {
      vm.runInContext(match[2], context)
    }
  }
  const definition = registrations.find((registration) => registration.type === 'knxUltimateUtility')?.definition
  const createNode = (overrides = {}) => {
    const values = Object.fromEntries(Object.entries(definition.defaults).map(([key, field]) => [key, clone(field.value)]))
    return { ...values, id: 'utility-node', type: 'knxUltimateUtility', z: 'flow', ...overrides }
  }
  const open = (node) => {
    for (const [key, value] of Object.entries(node)) {
      if (controls.has('#node-input-' + key)) $('#node-input-' + key).val(clone(value))
    }
    definition.oneditprepare.call(node)
  }
  return { $, definition, registrations, requests, createNode, open, timers, RED, codeEditors }
}

describe('KNX Utility registered editor', () => {
  it('registers one public type and complete defaults using only its private profile bundle', () => {
    const { definition, registrations, createNode } = loadEditor()
    expect(registrations.map((registration) => registration.type)).to.deep.equal(['knxUltimateUtility'])
    expect(definition.category).to.equal('KNX Ultimate')
    expect(definition.paletteLabel).to.equal('KNX Utility')
    expect(definition.defaults.server.type).to.equal('knxUltimate-config')
    expect(definition.catalogDefaults.server.type).to.equal('knxUltimate-config')
    expect(definition.defaults).to.include.keys('utilityType', 'rules', 'commandText', 'gaDateTime', 'gaDate', 'gaTime', 'inputs', 'outputs')
    expect(definition.defaults).to.include.keys('maxRetry', 'contextStorage', 'filePath', 'gaTrigger', 'gaCommand', 'topicSave', 'controlMode')
    const node = createNode()
    expect(node.utilityType).to.equal('alerter')
    expect([node.inputs, node.outputs]).to.deep.equal([1, 3])
    expect(node.commandText).to.equal('[]')
    expect(node.rules).to.deep.equal([])
    expect(node.topic).to.equal('')
  })

  it('validates only fields belonging to the active function and rejects unsupported functions', () => {
    const { definition, createNode } = loadEditor()
    const validate = definition.defaults.periodicSendInterval.validate
    for (const utilityType of ['alerter', 'autoresponder']) {
      expect(validate.call(createNode({ utilityType }), 'not a number')).to.equal(true)
    }
    const dateTime = createNode({ utilityType: 'datetime' })
    expect(validate.call(dateTime, 'not a number')).to.equal(false)
    expect(validate.call(dateTime, '60')).to.equal(true)
    // While the dialog is open, validation follows its currently selected
    // function even though the saved node remains unchanged until Done.
    dateTime._utilityEditor = { type: () => 'alerter' }
    expect(validate.call(dateTime, 'not a number')).to.equal(true)
    expect(definition.defaults.periodicSendInterval.required).not.to.equal(true)
    for (const utilityType of Object.keys(require('../scripts/knx-utility-profiles/catalog').profiles)) {
      expect(definition.defaults.utilityType.validate(utilityType)).to.equal(true)
    }
    for (const utilityType of ['', undefined, 'unknown']) {
      expect(definition.defaults.utilityType.validate(utilityType)).to.equal(false)
    }
  })

  it('shows the selected function through localized labels, icons and output descriptions', () => {
    const { definition, createNode } = loadEditor('en')
    const alerter = createNode()
    expect(definition.icon.call(alerter)).to.equal('node-alerter-icon.svg')
    expect(definition.label.call(alerter)).to.equal('KNX Utility · Alerter')
    expect([0, 1, 2].map((index) => definition.outputLabels.call(alerter, index))).to.deep.equal([
      'One message per alerted device', 'All alerted devices', 'Most recently alerted device'
    ])
    for (const utilityType of ['autoresponder', 'datetime']) {
      const node = createNode({ utilityType })
      expect(definition.icon.call(node)).to.equal('node-knx-icon.svg')
      expect(definition.outputLabels.call(node, 0)).to.equal('')
    }
    expect(definition.label.call(createNode({ name: 'Building clock', utilityType: 'datetime' }))).to.equal('Building clock')
    const italian = loadEditor('it')
    expect(italian.definition.label.call(italian.createNode({ utilityType: 'datetime' }))).to.equal('KNX Utility · Data / Ora')
  })

  it('validates the AutoResponder JSON schema only while that function is active', () => {
    const { definition, createNode } = loadEditor()
    const validate = definition.defaults.commandText.validate
    const node = createNode({ utilityType: 'autoresponder' })
    for (const value of ['[', '{}', 'null', '[null]', '[{"ga":"1/2/3"}]']) {
      expect(validate.call(node, value), value).to.equal(false)
    }
    expect(validate.call(node, '[]')).to.equal(true)
    expect(validate.call(node, '[{"ga":"1/2/3","default":false}]')).to.equal(true)
    expect(validate.call(createNode({ utilityType: 'datetime' }), 'malformed JSON')).to.equal(true)
  })

  it('requires a valid gateway only for bus profiles, including while changing function', () => {
    const { $, definition, createNode, open, RED } = loadEditor()
    const validGateway = { id: 'gateway', type: 'knxUltimate-config', valid: true }
    RED.nodes.node = id => id === validGateway.id ? validGateway : undefined
    const validate = definition.defaults.server.validate
    expect(definition.defaults.server).not.to.have.property('required')
    const node = createNode({ utilityType: 'hatranslator', inputs: 1, outputs: 1, server: '' })
    expect(validate.call(node, '')).to.equal(true)
    expect(validate.call(node, '_ADD_')).to.equal(true)
    open(node)
    expect($('#knx-utility-gateway-row').visible).to.equal(false)
    $('#node-input-utilityType').val('alerter').trigger('change')
    expect($('#knx-utility-gateway-row').visible).to.equal(true)
    for (const value of ['', undefined, '_ADD_', 'missing']) expect(validate.call(node, value)).to.equal(false)
    expect(validate.call(node, 'gateway')).to.equal(true)
    validGateway.valid = false
    expect(validate.call(node, 'gateway')).to.equal(false)
    validGateway.valid = true
    validGateway.type = 'unrelated-config'
    expect(validate.call(node, 'gateway')).to.equal(false)
    $('#node-input-utilityType').val('hatranslator').trigger('change')
    expect(validate.call(node, '')).to.equal(true)
    definition.oneditcancel.call(node)
    expect(node.utilityType).to.equal('hatranslator')
  })

  it('keeps Translator text and AutoResponder JSON drafts separate and releases each text editor', () => {
    const { $, definition, createNode, open, codeEditors, timers } = loadEditor()
    const node = createNode({ utilityType: 'hatranslator', inputs: 1, outputs: 1, server: '', haTranslationTable: 'awake:true\nasleep:false' })
    const before = clone(node)
    open(node)
    expect(codeEditors[0].getValue()).to.equal('awake:true\nasleep:false')
    codeEditors[0].setValue('awake:false\nasleep:true')
    definition.oneditresize.call(node, { height: 600, width: 550 })
    expect(codeEditors[0].resized).to.equal(1)
    $('#node-input-utilityType').val('autoresponder').trigger('change')
    expect(codeEditors[0].destroyed).to.equal(1)
    expect($('#node-input-commandText').typedInput('value')).to.equal('[]')
    $('#node-input-commandText').typedInput('value', '[{"ga":"1/2/3","default":false}]')
    $('#node-input-utilityType').val('hatranslator').trigger('change')
    expect(codeEditors[1].getValue()).to.equal('awake:false\nasleep:true')
    expect(node.haTranslationTable).to.equal('awake:true\nasleep:false')
    expect(node.commandText).to.equal('[]')
    definition.oneditcancel.call(node)
    expect(node).to.deep.equal(before)
    expect(codeEditors.map(editor => editor.destroyed)).to.deep.equal([1, 1])
    expect(timers.size).to.equal(0)
    open(node)
    codeEditors[2].setValue('present:true\naway:false')
    $('#node-input-payloadPropName').val('data.new_state.state')
    definition.oneditsave.call(node)
    expect(node.haTranslationTable).to.equal('present:true\naway:false')
    expect(node.payloadPropName).to.equal('data.new_state.state')
    expect(node.commandText).to.equal('[]')
    expect([node.inputs, node.outputs]).to.deep.equal([1, 1])
    expect(codeEditors[2].destroyed).to.equal(1)
    expect(node).not.to.have.property('_utilityEditor')
  })

  it('provides default Translator rules independently of the AutoResponder default', () => {
    const { definition, createNode, open, codeEditors } = loadEditor()
    const node = createNode({ utilityType: 'hatranslator', inputs: 1, outputs: 1, server: '' })
    expect(node.commandText).to.equal('[]')
    open(node)
    expect(codeEditors[0].getValue()).to.include('on:true\noff:false')
    expect(codeEditors[0].getValue()).to.include('home:true\nnot_home:false')
    definition.oneditcancel.call(node)
  })

  it('preserves the functional GlobalContext name and validates it only for that profile', () => {
    const { $, definition, createNode, open } = loadEditor()
    const validate = definition.defaults.name.validate
    const node = createNode({ utilityType: 'globalcontext', name: 'HouseKNX', contextStorage: 'persistent', server: 'gateway' })
    open(node)
    expect($('#node-input-name').val()).to.equal('HouseKNX')
    expect($('#knx-utility-name-description').visible).to.equal(true)
    for (const name of ['', 'House KNX', 'House_KNX', 'House42']) expect(validate.call(node, name)).to.equal(false)
    expect(validate.call(node, 'HouseKNX')).to.equal(true)
    $('#node-input-name').val('OtherKNX')
    definition.oneditcancel.call(node)
    expect(node.name).to.equal('HouseKNX')
    expect(node.contextStorage).to.equal('persistent')
    for (const utilityType of ['alerter', 'logger', 'garage']) {
      expect(validate.call(createNode({ utilityType }), '')).to.equal(true)
      expect(validate.call(createNode({ utilityType }), 'A descriptive name 42')).to.equal(true)
    }
    const blank = createNode({ utilityType: 'globalcontext', server: 'gateway' })
    open(blank)
    expect($('#node-input-name').val()).to.equal('KNXGlobalContext')
    definition.oneditsave.call(blank)
    expect(blank.name).to.equal('KNXGlobalContext')
    expect([blank.inputs, blank.outputs]).to.deep.equal([0, 0])
  })

  it('applies required address fields only to the profiles that use them', () => {
    const { definition, createNode } = loadEditor()
    for (const [key, utilityType] of [['gaTrigger', 'staircase'], ['gaOutput', 'staircase'], ['gaCommand', 'garage']]) {
      const field = definition.defaults[key]
      expect(field.required).to.equal(undefined)
      expect(field.validate.call(createNode({ utilityType }), '')).to.equal(false)
      expect(field.validate.call(createNode({ utilityType }), '1/2/3')).to.equal(true)
      for (const other of ['alerter', 'datetime', 'logger', 'globalcontext']) {
        expect(field.validate.call(createNode({ utilityType: other }), '')).to.equal(true)
      }
    }
  })

  it('validates conditional settings against current editor values instead of saved values', () => {
    const { definition, createNode } = loadEditor()
    for (const [utilityType, key, flag, enabled, disabled] of [
      ['logger', 'intervalTelegramCount', 'autoStartTimerTelegramCounter', true, false],
      ['garage', 'autoCloseSeconds', 'autoCloseEnable', true, false],
      ['loadcontrol', 'wattLimit', 'controlMode', 'auto', 'msg']
    ]) {
      const node = createNode({ utilityType, [flag]: disabled })
      const values = { [flag]: enabled }
      node._utilityEditor = { type: () => utilityType, values: () => values }
      expect(definition.defaults[key].validate.call(node, 'invalid')).to.equal(false)
      values[flag] = disabled
      expect(definition.defaults[key].validate.call(node, 'invalid')).to.equal(true)
      expect(node[flag]).to.equal(disabled)
    }
  })

  it('localizes Logger outputs and all function and port descriptions in six languages', () => {
    const { profiles, locales } = require('../scripts/knx-utility-profiles/catalog')
    for (const locale of locales) {
      const dictionary = require('../nodes/locales/' + locale + '/knxUltimateUtility.json').knxUltimateUtility
      const { definition, createNode } = loadEditor(locale)
      for (const utilityType of Object.keys(profiles)) {
        expect(dictionary.types[utilityType]).to.be.a('string').and.not.equal('')
        expect(dictionary.pins[utilityType]).to.be.a('string').and.not.equal('')
        expect(definition.label.call(createNode({ utilityType }))).to.equal('KNX Utility · ' + dictionary.types[utilityType])
      }
      const logger = createNode({ utilityType: 'logger' })
      expect([0, 1].map(index => definition.outputLabels.call(logger, index))).to.deep.equal(Object.values(dictionary.logger_outputs))
      const help = fs.readFileSync(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateUtility.html'), 'utf8')
      for (const utilityType of Object.keys(profiles)) expect(help).to.include('id="knx-utility-help-' + utilityType + '"')
    }
  })

  it('requires numeric DateTime schedules only when their corresponding send option is enabled', () => {
    const { $, definition, createNode, open } = loadEditor()
    const interval = definition.defaults.periodicSendInterval.validate
    const delay = definition.defaults.sendOnDeployDelay.validate
    const node = createNode({ utilityType: 'datetime', periodicSend: false, sendOnDeploy: false, server: 'gateway' })
    expect(interval.call(node, 'invalid')).to.equal(true)
    expect(delay.call(node, 'invalid')).to.equal(true)
    open(node)
    $('#node-input-periodicSend').prop('checked', true)
    expect(interval.call(node, 'invalid')).to.equal(false)
    expect(interval.call(node, '90')).to.equal(true)
    $('#node-input-sendOnDeploy').prop('checked', true)
    expect(delay.call(node, 'invalid')).to.equal(false)
    expect(delay.call(node, '30')).to.equal(true)
    $('#node-input-periodicSend').prop('checked', false)
    expect(interval.call(node, 'invalid')).to.equal(true)
    definition.oneditcancel.call(node)
  })

  it('offers the canvas send button only for deployed DateTime nodes and dispatches through Utility', () => {
    const { definition, createNode, requests } = loadEditor()
    for (const utilityType of ['alerter', 'autoresponder']) {
      const node = createNode({ utilityType })
      expect(definition.button.visible.call(node)).to.equal(false)
      expect(definition.button.enabled.call(node)).to.equal(false)
      definition.button.onclick.call(node)
    }
    expect(requests).to.have.length(0)
    const node = createNode({ utilityType: 'datetime', changed: false })
    expect(definition.button.visible.call(node)).to.equal(true)
    expect(definition.button.enabled.call(node)).to.equal(true)
    expect(definition.button.enabled.call({ ...node, changed: true })).to.equal(false)
    definition.button.onclick.call(node)
    expect(requests).to.have.length(1)
    expect(requests[0].url).to.equal('knxUltimateUtility/sendNow')
    expect(requests[0].data.id).to.equal(node.id)
  })

  it('revalidates the shared editor when dynamically mounted profile fields change', () => {
    const { $, definition, createNode, open } = loadEditor()
    const node = createNode({ utilityType: 'autoresponder', server: 'gateway' })
    open(node)
    let validationEvents = 0
    $('#node-input-name').on('change.nodeRedValidation', () => { validationEvents++ })
    $('#node-input-commandText').val('[').trigger('change')
    expect(validationEvents).to.equal(1)
    $('#node-input-utilityType').val('datetime').trigger('change')
    validationEvents = 0
    $('#node-input-periodicSendInterval').val('invalid').trigger('change')
    expect(validationEvents).to.equal(1)
    definition.oneditcancel.call(node)
  })

  it('preserves draft settings across function changes and applies only the chosen function on save', () => {
    const { $, definition, createNode, open } = loadEditor()
    const original = '[{"ga":"1/2/3","dpt":"1.001","default":true}]'
    const edited = '[{"ga":"1/2/4","dpt":"1.001","default":false}]'
    const node = createNode({ utilityType: 'autoresponder', inputs: 0, outputs: 0, server: 'gateway', commandText: original })
    open(node)
    expect($('#node-input-commandText').typedInput('value')).to.equal(original)
    $('#node-input-commandText').typedInput('value', edited)
    $('#node-input-utilityType').val('datetime').trigger('change')
    expect(node.utilityType).to.equal('autoresponder')
    expect(node.commandText).to.equal(original)
    expect($('#node-input-gaDateTime').length).to.equal(1)
    $('#node-input-gaDateTime').val('2/3/4')
    $('#node-input-utilityType').val('autoresponder').trigger('change')
    expect($('#node-input-commandText').typedInput('value')).to.equal(edited)
    expect($('#node-input-gaDateTime').length).to.equal(0)
    definition.oneditsave.call(node)
    expect(node.commandText).to.equal(edited)
    expect(node.utilityType).to.equal('autoresponder')
    expect(node.gaDateTime).to.equal('')
    expect([node.inputs, node.outputs]).to.deep.equal([0, 0])
    expect(node).not.to.have.property('_utilityEditor')
  })

  it('discards edits and profile switches on Cancel and releases DateTime editor work', () => {
    const { $, definition, createNode, open, timers } = loadEditor()
    const node = createNode({ utilityType: 'autoresponder', inputs: 0, outputs: 0, server: 'gateway' })
    const before = clone(node)
    open(node)
    $('#node-input-commandText').typedInput('value', '[{"ga":"2/3/4"}]')
    $('#node-input-utilityType').val('datetime').trigger('change')
    $('#node-input-gaDateTime').val('1/2/3')
    expect(timers.size).to.be.greaterThan(0)
    definition.oneditcancel.call(node)
    expect(node).to.deep.equal(before)
    expect(timers.size).to.equal(0)
    expect($('#node-input-server').handlers.size).to.equal(0)
    expect($('#node-input-utilityType').handlers.size).to.equal(0)
  })

  it('saves DateTime checkbox and address edits with zero ports while retaining unrelated saved fields', () => {
    const { $, definition, createNode, open } = loadEditor()
    const node = createNode({ utilityType: 'autoresponder', server: 'gateway', commandText: '[{"ga":"2/3/4"}]' })
    open(node)
    $('#node-input-utilityType').val('datetime').trigger('change')
    $('#node-input-gaDateTime').val('1/7/1')
    $('#node-input-nameDateTime').val('Building clock')
    $('#node-input-sendOnDeploy').prop('checked', false)
    $('#node-input-periodicSend').prop('checked', true)
    $('#node-input-periodicSendInterval').val('90')
    definition.oneditsave.call(node)
    expect(node.utilityType).to.equal('datetime')
    expect([node.inputs, node.outputs]).to.deep.equal([0, 0])
    expect(node.gaDateTime).to.equal('1/7/1')
    expect(node.nameDateTime).to.equal('Building clock')
    expect(node.sendOnDeploy).to.equal(false)
    expect(node.periodicSend).to.equal(true)
    expect(node.periodicSendInterval).to.equal('90')
    expect(node.commandText).to.equal('[{"ga":"2/3/4"}]')
  })

  it('changes saved ports to match Alerter when switching from a utility without flow ports', () => {
    const { $, definition, createNode, open } = loadEditor()
    const node = createNode({ utilityType: 'autoresponder', inputs: 0, outputs: 0, server: 'gateway' })
    open(node)
    $('#node-input-utilityType').val('alerter').trigger('change')
    expect($('#node-input-inputs').val()).to.equal(1)
    expect($('#node-input-outputs').val()).to.equal(3)
    definition.oneditsave.call(node)
    expect(node.utilityType).to.equal('alerter')
    expect([node.inputs, node.outputs]).to.deep.equal([1, 3])
    expect(node.rules).to.deep.equal([])
  })
})
