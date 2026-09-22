const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const upgrade = require('../resources/upgradeToV8')
const utilityMigration = require('../resources/knxUtilityMigration')
const hueMigration = require('../resources/hueControllerMigration')
const registerLegacyMigrationNodes = require('../nodes/knxUltimateLegacyMigration')

const projectRoot = path.resolve(__dirname, '..')

function jqueryStub () {
  function element (markup) {
    return {
      markup,
      children: [],
      textValue: '',
      length: 1,
      text (value) {
        if (value === undefined) return this.textValue
        this.textValue = String(value)
        return this
      },
      append (...children) {
        this.children.push(...children)
        return this
      },
      appendTo (parent) {
        if (parent && typeof parent.append === 'function') parent.append(this)
        return this
      }
    }
  }
  return value => {
    if (typeof value === 'string' && value.trim().startsWith('<')) return element(value)
    return {
      length: 0,
      each () { return this },
      off () { return this },
      on () { return this },
      first () { return this },
      trigger () { return this }
    }
  }
}

function renderedText (element) {
  if (!element || typeof element !== 'object') return String(element || '')
  return [element.textValue, ...(element.children || []).map(renderedText)].filter(Boolean).join(' ')
}

function editorFixture (nodes = [], configs = [], definitions = {}, options = {}) {
  const all = [...nodes, ...configs]
  const completeFlow = options.completeFlow || all
  const targetDefinitions = new Map(Object.entries(definitions))
  const invalidNodeIds = new Set(options.invalidNodeIds || [])
  let dirty = false
  let revision = 'rev-1'
  let originalFlow
  const RED = {
    _: key => key,
    nodes: {
      eachNode: callback => nodes.forEach(callback),
      eachConfig: callback => configs.forEach(callback),
      eachGroup: () => {},
      eachJunction: () => {},
      eachSubflow: () => {},
      eachWorkspace: () => {},
      node: id => all.find(node => node.id === id),
      getType: type => targetDefinitions.get(type),
      workspace: id => ({ id, locked: false }),
      subflow: () => undefined,
      dirty: value => {
        if (value !== undefined) dirty = value
        return dirty
      },
      version: value => {
        if (value !== undefined) revision = value
        return revision
      },
      originalFlow: value => { originalFlow = value },
      createCompleteNodeSet: () => completeFlow.map(node => {
        const copy = { ...node }
        delete copy._def
        delete copy._
        return copy
      })
    },
    workspaces: { isLocked: () => false },
    editor: {
      validateNode: node => {
        if (typeof options.validateNode === 'function') return options.validateNode(node)
        node.valid = !invalidNodeIds.has(node.id)
      }
    },
    events: { emit: () => {} },
    history: { markAllDirty: () => {} },
    view: { redraw: () => {} }
  }
  return { RED, originalFlow: () => originalFlow }
}

function createPlan (RED) {
  return upgrade.createMigrationPlan(RED, {
    utilityApi: utilityMigration,
    hueApi: hueMigration
  })
}

describe('Version 8 direct-upgrade migration recovery', () => {
  it('recovers Utility, HUE and Matter nodes from the unknown node original data', () => {
    const utility = {
      id: 'utility',
      type: 'unknown',
      name: 'knxUltimateLogger',
      z: 'tab-1',
      x: 300,
      y: 120,
      wires: [['debug']],
      _orig: {
        id: 'utility',
        type: 'knxUltimateLogger',
        name: 'Bus logger',
        server: 'knx-config',
        x: 10,
        y: 20,
        wires: []
      }
    }
    const hue = {
      id: 'hue',
      type: 'unknown',
      name: 'knxUltimateHueLight',
      z: 'tab-1',
      wires: [[]],
      _orig: {
        id: 'hue',
        type: 'knxUltimateHueLight',
        name: 'Kitchen lamp',
        serverHue: 'hue-config',
        enableNodePINS: true
      }
    }
    const matter = {
      id: 'matter',
      type: 'unknown',
      name: 'knxUltimateMatterControllerDevice',
      z: 'tab-1',
      wires: [[]],
      _orig: {
        id: 'matter',
        type: 'knxUltimateMatterControllerDevice',
        name: 'Door lock',
        serverMatter: 'matter-config',
        device: 'front-door'
      }
    }
    const fixture = editorFixture([utility, hue, matter], [], {
      knxUltimateUtility: { name: 'utility-v8' },
      hueUltimateController: { name: 'hue-v8' },
      matterUltimateController: { name: 'matter-v8' }
    })

    const plan = createPlan(fixture.RED)

    expect(plan.counts).to.deep.equal({ utility: 1, hue: 1, matter: 1, total: 3 })
    expect(plan.entries.map(entry => [entry.sourceType, entry.targetType, entry.removeOriginal])).to.deep.equal([
      ['knxUltimateLogger', 'knxUltimateUtility', true],
      ['knxUltimateHueLight', 'hueUltimateController', true],
      ['knxUltimateMatterControllerDevice', 'matterUltimateController', true]
    ])
    expect(() => upgrade.validatePreflight(fixture.RED, plan)).not.to.throw()

    upgrade.applyMigrationPlan(fixture.RED, plan)

    expect(utility).to.include({
      type: 'knxUltimateUtility',
      name: 'Bus logger',
      server: 'knx-config',
      utilityType: 'logger',
      inputs: 1,
      outputs: 2,
      x: 300,
      y: 120
    })
    expect(utility.wires).to.deep.equal([['debug']])
    expect(hue).to.include({
      type: 'hueUltimateController',
      name: 'Kitchen lamp',
      serverHue: 'hue-config',
      hueControllerType: 'light',
      inputs: 1,
      outputs: 1
    })
    expect(matter).to.include({
      type: 'matterUltimateController',
      name: 'Door lock',
      serverMatter: 'matter-config',
      device: 'front-door'
    })
    for (const node of [utility, hue, matter]) expect(node).not.to.have.property('_orig')
  })

  it('recovers unknown HUE and Matter configuration data without losing credential placeholders', () => {
    const hueConfig = {
      id: 'hue-config',
      type: 'unknown',
      name: 'hue-config',
      _orig: {
        id: 'hue-config',
        type: 'hue-config',
        name: 'HUE bridge',
        host: '192.0.2.10',
        credentials: {
          username: '__PWRD__',
          clientkey: '__PWRD__'
        }
      }
    }
    const matterConfig = {
      id: 'matter-config',
      type: 'unknown',
      name: 'matter-config',
      _orig: {
        id: 'matter-config',
        type: 'matter-config',
        name: 'Matter fabric',
        storagePath: 'matter-storage',
        credentials: { existingSecret: '__PWRD__' }
      }
    }
    const matterController = {
      id: 'matter-controller',
      type: 'unknown',
      name: 'knxUltimateMatterControllerDevice',
      z: 'tab-1',
      wires: [[]],
      _orig: {
        id: 'matter-controller',
        type: 'knxUltimateMatterControllerDevice',
        name: 'Front door',
        serverMatter: 'matter-config',
        credentials: { doorLockPin: '__PWRD__' }
      }
    }
    const fixture = editorFixture([matterController], [hueConfig, matterConfig], {
      'hue-ultimate-config': { name: 'hue-config-v8' },
      'matter-ultimate-config': { name: 'matter-config-v8' },
      matterUltimateController: { name: 'matter-controller-v8' }
    })

    const plan = createPlan(fixture.RED)
    const result = upgrade.applyMigrationPlan(fixture.RED, plan)

    expect(result).to.deep.equal({ utility: 0, hue: 1, matter: 2, total: 3 })
    expect(hueConfig).to.include({
      type: 'hue-ultimate-config',
      name: 'HUE bridge',
      host: '192.0.2.10'
    })
    expect(hueConfig.credentials).to.deep.equal({
      username: '__PWRD__',
      clientkey: '__PWRD__'
    })
    expect(matterConfig).to.include({
      type: 'matter-ultimate-config',
      name: 'Matter fabric',
      storagePath: 'matter-storage'
    })
    expect(matterConfig.credentials).to.deep.equal({ existingSecret: '__PWRD__' })
    expect(matterController).to.include({
      type: 'matterUltimateController',
      name: 'Front door',
      serverMatter: 'matter-config'
    })
    expect(matterController.credentials).to.deep.equal({ doorLockPin: '__PWRD__' })
    for (const node of [hueConfig, matterConfig, matterController]) expect(node).not.to.have.property('_orig')
  })

  it('deploys and verifies in recovery mode without requesting the KNX package', async () => {
    const nodes = [
      { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1' },
      { id: 'hue', type: 'knxUltimateHueLight', z: 'tab-1', serverHue: 'hue-config' },
      { id: 'matter', type: 'knxUltimateMatterControllerDevice', z: 'tab-1', serverMatter: 'matter-config' }
    ]
    const fixture = editorFixture(nodes, [], {
      knxUltimateUtility: { name: 'utility-v8' },
      hueUltimateController: { name: 'hue-v8' },
      matterUltimateController: { name: 'matter-v8' },
      'hue-ultimate-config': { name: 'hue-config-v8' },
      matterUltimateBridge: { name: 'matter-bridge-v8' },
      'matter-ultimate-config': { name: 'matter-config-v8' },
      'matter-ultimate-bridge-config': { name: 'matter-bridge-config-v8' }
    }, { invalidNodeIds: ['hue', 'matter'] })
    const plan = createPlan(fixture.RED)
    const requests = []
    const progress = []
    let savedFlows
    const request = settings => {
      const body = settings.data ? JSON.parse(settings.data) : undefined
      requests.push({ method: settings.type, url: settings.url, body })
      if (settings.type === 'GET' && settings.url === `nodes/${upgrade.HUE_PACKAGE.name}`) {
        return { name: upgrade.HUE_PACKAGE.name, version: upgrade.HUE_PACKAGE.version, nodes: [{ enabled: true, runtime: true }] }
      }
      if (settings.type === 'GET' && settings.url === `nodes/${upgrade.MATTER_PACKAGE.name}`) {
        return { name: upgrade.MATTER_PACKAGE.name, version: upgrade.MATTER_PACKAGE.version, nodes: [{ enabled: true, runtime: true }] }
      }
      if (settings.type === 'POST' && settings.url === 'flows') {
        savedFlows = body.flows
        return { rev: 'rev-2' }
      }
      if (settings.type === 'GET' && settings.url === 'flows') return { rev: 'rev-2', flows: savedFlows }
      throw new Error(`Unexpected request: ${settings.type} ${settings.url}`)
    }

    const result = await upgrade.runUpgrade(fixture.RED, plan, {
      recoveryMode: true,
      request,
      onProgress: stage => progress.push(stage)
    })

    expect(result).to.deep.equal({ utility: 1, hue: 1, matter: 1, total: 3 })
    expect(progress).to.deep.equal(['install_hue', 'install_matter', 'convert', 'deploy', 'verify', 'complete'])
    expect(requests.map(call => `${call.method} ${call.url}`)).to.deep.equal([
      `GET nodes/${upgrade.HUE_PACKAGE.name}`,
      `GET nodes/${upgrade.MATTER_PACKAGE.name}`,
      'POST flows',
      'GET flows'
    ])
    expect(requests.some(call => call.url === `nodes/${upgrade.PACKAGE_NAME}`)).to.equal(false)
    expect(requests.some(call => call.url === 'nodes' && call.body && call.body.module === upgrade.PACKAGE_NAME)).to.equal(false)
    expect(savedFlows.map(node => node.type)).to.deep.equal([
      'knxUltimateUtility',
      'hueUltimateController',
      'matterUltimateController'
    ])
    expect(fixture.RED.nodes.version()).to.equal('rev-2')
    expect(fixture.RED.nodes.dirty()).to.equal(false)
    expect(fixture.originalFlow()).to.deep.equal(savedFlows)
  })

  it('migrates and verifies the complete Alarm flow fixture with incomplete HUE and Matter placeholders', async () => {
    const sourceFlow = JSON.parse(fs.readFileSync(path.join(projectRoot, 'test', 'fixtures', 'alarm-v8-migration-flow.json'), 'utf8'))
    const unrelatedInvalidIds = new Set(['5166a4b68732fc02', 'a7d47185c121a7f8'])
    sourceFlow.forEach(node => {
      if (unrelatedInvalidIds.has(node.id)) {
        node.alarmId = ''
        node.valid = false
      }
    })
    const originalById = new Map(sourceFlow.map(node => [node.id, JSON.parse(JSON.stringify(node))]))
    const migratedIds = new Set(['994675b606ae8daa', '6fedd02af5b148b0'])
    const flow = sourceFlow.map(node => {
      if (!migratedIds.has(node.id)) return node
      return {
        id: node.id,
        type: 'unknown',
        name: node.type,
        z: node.z,
        g: node.g,
        x: node.x,
        y: node.y,
        wires: node.wires,
        _orig: JSON.parse(JSON.stringify(node))
      }
    })
    const nodes = flow.filter(node => node.z)
    const configs = flow.filter(node => !node.z && !['tab', 'global-config'].includes(node.type))
    const fixture = editorFixture(nodes, configs, {
      hueUltimateController: { name: 'hue-v8' },
      'hue-ultimate-config': { name: 'hue-config-v8' },
      matterUltimateController: { name: 'matter-v8' },
      matterUltimateBridge: { name: 'matter-bridge-v8' },
      'matter-ultimate-config': { name: 'matter-config-v8' },
      'matter-ultimate-bridge-config': { name: 'matter-bridge-config-v8' }
    }, {
      completeFlow: flow,
      validateNode: node => {
        node.valid = !unrelatedInvalidIds.has(node.id) && !(
          (node.type === 'hueUltimateController' && !node.serverHue) ||
          (node.type === 'matterUltimateController' && !node.serverMatter)
        )
      }
    })
    const plan = createPlan(fixture.RED)
    let savedFlows
    const progress = []
    const request = settings => {
      const body = settings.data ? JSON.parse(settings.data) : undefined
      if (settings.type === 'GET' && settings.url === `nodes/${upgrade.HUE_PACKAGE.name}`) {
        return { name: upgrade.HUE_PACKAGE.name, version: upgrade.HUE_PACKAGE.version, nodes: [{ enabled: true, runtime: true }] }
      }
      if (settings.type === 'GET' && settings.url === `nodes/${upgrade.MATTER_PACKAGE.name}`) {
        return { name: upgrade.MATTER_PACKAGE.name, version: upgrade.MATTER_PACKAGE.version, nodes: [{ enabled: true, runtime: true }] }
      }
      if (settings.type === 'POST' && settings.url === 'flows') {
        savedFlows = body.flows
        return { rev: 'rev-2' }
      }
      if (settings.type === 'GET' && settings.url === 'flows') return { rev: 'rev-2', flows: savedFlows }
      throw new Error(`Unexpected request: ${settings.type} ${settings.url}`)
    }

    expect(plan.counts).to.deep.equal({ utility: 0, hue: 1, matter: 1, total: 2 })
    const result = await upgrade.runUpgrade(fixture.RED, plan, {
      recoveryMode: true,
      request,
      onProgress: stage => progress.push(stage)
    })

    expect(result).to.deep.equal({ utility: 0, hue: 1, matter: 1, total: 2 })
    expect(progress).to.deep.equal(['install_hue', 'install_matter', 'convert', 'deploy', 'verify', 'complete'])
    expect(savedFlows).to.have.length(11)
    const savedById = new Map(savedFlows.map(node => [node.id, node]))
    const hue = savedById.get('994675b606ae8daa')
    const matter = savedById.get('6fedd02af5b148b0')
    expect(hue).to.include({ type: 'hueUltimateController', serverHue: '', valid: false })
    expect(matter).to.include({ type: 'matterUltimateController', valid: false })
    expect(matter).not.to.have.property('serverMatter')
    expect(savedById.get('5166a4b68732fc02')).to.include({ type: 'AlarmUltimateState', alarmId: '' })
    expect(savedById.get('a7d47185c121a7f8')).to.include({ type: 'AlarmUltimateSiren', alarmId: '' })

    const persistent = node => Object.fromEntries(Object.entries(node).filter(([key]) => (
      !['_def', '_', '_orig', 'changed', 'dirty', 'resize', 'valid', 'validationErrors'].includes(key)
    )))
    sourceFlow.filter(node => !migratedIds.has(node.id)).forEach(node => {
      expect(persistent(savedById.get(node.id)), node.id).to.deep.equal(persistent(originalById.get(node.id)))
    })
    for (const node of [hue, matter]) {
      const original = persistent(originalById.get(node.id))
      const converted = persistent(node)
      delete original.type
      delete converted.type
      expect(converted, node.id).to.deep.equal(original)
    }
  })

  it('does not validate or block unrelated invalid nodes during recovery', () => {
    const migrated = { id: 'migrated', type: 'knxUltimateMatterControllerDevice', z: 'tab-1' }
    const unrelated = { id: 'unrelated', type: 'debug', z: 'tab-1', valid: false }
    const validations = []
    const fixture = editorFixture([migrated, unrelated], [], {
      matterUltimateController: { name: 'matter-v8' }
    }, {
      validateNode: node => {
        validations.push(node.id)
        node.valid = false
      }
    })
    const plan = createPlan(fixture.RED)
    expect(() => upgrade.validatePreflight(fixture.RED, plan)).not.to.throw()
    expect(validations).to.deep.equal([])
    const result = upgrade.applyMigrationPlan(fixture.RED, plan)

    expect(() => upgrade.validateDeployable(fixture.RED, plan)).not.to.throw()
    expect(validations).to.deep.equal(['migrated'])
    expect(migrated.valid).to.equal(false)
    expect(unrelated.valid).to.equal(false)
    result.rollback()
  })

  it('keeps Deploy blocked after successful recovery and reloads from the completion button', async () => {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1' }
    const fixture = editorFixture([utility], [], {
      knxUltimateUtility: { name: 'utility-v8' }
    })
    const notifications = []
    const actionCalls = []
    const keyboard = { disableCalls: 0, enableCalls: 0 }
    let backupCalls = 0
    let reloadCalls = 0
    let savedFlows
    fixture.RED.notify = (message, options) => {
      const notice = {
        message,
        options,
        closed: false,
        close () { this.closed = true }
      }
      notifications.push(notice)
      return notice
    }
    fixture.RED.actions = {
      invoke (name) { actionCalls.push(name) }
    }
    fixture.RED.keyboard = {
      disable () { keyboard.disableCalls += 1 },
      enable () { keyboard.enableCalls += 1 }
    }
    fixture.RED.settings = { get: (_name, fallback) => fallback }
    fixture.RED.user = { hasPermission: () => true }
    const environment = {
      document: {},
      location: { reload: () => { reloadCalls += 1 } }
    }
    const request = settings => {
      const body = settings.data ? JSON.parse(settings.data) : undefined
      if (settings.type === 'POST' && settings.url === 'flows') {
        savedFlows = body.flows
        return { rev: 'rev-2' }
      }
      if (settings.type === 'GET' && settings.url === 'flows') return { rev: 'rev-2', flows: savedFlows }
      throw new Error(`Unexpected request: ${settings.type} ${settings.url}`)
    }

    const confirmation = upgrade.open(fixture.RED, {
      recoveryMode: true,
      environment,
      $: jqueryStub(),
      utilityApi: utilityMigration,
      hueApi: hueMigration,
      backupApi: { download: () => { backupCalls += 1 } },
      request
    })
    confirmation.options.buttons[1].click()
    await new Promise(resolve => setImmediate(resolve))

    const completed = notifications.find(notice => notice.options.type === 'success')
    expect(completed).not.to.equal(undefined)
    expect(backupCalls).to.equal(1)
    expect(actionCalls).to.include('core:cancel-edit-tray')
    expect(keyboard).to.deep.equal({ disableCalls: 1, enableCalls: 0 })
    const actionsBeforeDeploy = actionCalls.length
    fixture.RED.actions.invoke('core:deploy')
    expect(actionCalls).to.have.length(actionsBeforeDeploy)

    completed.options.buttons[0].click()
    expect(completed.closed).to.equal(true)
    expect(reloadCalls).to.equal(1)
  })

  it('shows a working OK button when automatic migration recovery stops with a persistent error', async () => {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1' }
    const unrelated = { id: 'unrelated', type: 'debug', z: 'tab-1' }
    let unrelatedValidations = 0
    const fixture = editorFixture([utility, unrelated], [], {
      knxUltimateUtility: { name: 'utility-v8' }
    }, {
      validateNode: node => {
        if (node.id === unrelated.id) {
          unrelatedValidations += 1
          node.valid = unrelatedValidations === 1
        } else {
          node.valid = true
        }
      }
    })
    const notifications = []
    fixture.RED.notify = (message, options) => {
      const notice = {
        message,
        options,
        closed: false,
        close () { this.closed = true }
      }
      notifications.push(notice)
      return notice
    }
    fixture.RED.actions = { invoke: () => {} }
    fixture.RED.keyboard = { disable: () => {}, enable: () => {} }
    fixture.RED.settings = { get: (_name, fallback) => fallback }
    fixture.RED.user = { hasPermission: () => true }

    const confirmation = upgrade.open(fixture.RED, {
      recoveryMode: true,
      environment: { document: {} },
      $: jqueryStub(),
      utilityApi: utilityMigration,
      hueApi: hueMigration,
      backupApi: { download: () => {} },
      request: () => { throw new Error('simulated migration failure') }
    })
    confirmation.options.buttons[1].click()
    await new Promise(resolve => setImmediate(resolve))

    const failure = notifications.find(notice => notice.options.type === 'error')
    expect(failure).not.to.equal(undefined)
    expect(failure.message).to.include('Automatic migration stopped safely: simulated migration failure')
    expect(failure.options.fixed).to.equal(true)
    expect(failure.options.buttons).to.have.length(1)
    expect(failure.options.buttons[0]).to.include({ text: 'OK', class: 'primary' })

    failure.options.buttons[0].click()
    expect(failure.closed).to.equal(true)
  })

  it('registers runtime-only placeholders for every removed type and preserves credential schemas', () => {
    const utilityTypes = Object.keys(utilityMigration.LEGACY_NODE_PROFILES)
    const hueTypes = Object.keys(upgrade.HUE_TYPE_MAP)
    const matterTypes = Object.keys(upgrade.MATTER_TYPE_MAP)
    const aiTypes = [...upgrade.AI_TYPES]
    const registrations = new Map()
    const RED = {
      nodes: {
        createNode: () => {},
        registerType: (type, constructor, options) => registrations.set(type, { constructor, options })
      }
    }

    registerLegacyMigrationNodes(RED)

    expect([...registrations.keys()]).to.have.members([...utilityTypes, ...hueTypes, ...matterTypes, ...aiTypes])
    expect(registrations.size).to.equal(utilityTypes.length + hueTypes.length + matterTypes.length + aiTypes.length)
    expect(registrations.get('hue-config').options).to.deep.equal({
      credentials: {
        username: { type: 'password' },
        clientkey: { type: 'password' }
      }
    })
    expect(registrations.get('knxUltimateAI').options).to.deep.equal({
      credentials: { llmApiKey: { type: 'password' } }
    })
    expect(registrations.get('knxUltimateMatterControllerDevice').options).to.deep.equal({
      credentials: { doorLockPin: { type: 'password' } }
    })
    expect(registrations.get('knxUltimateAIHomeAssistant').options).to.equal(undefined)
    expect(registrations.get('matter-config').options).to.equal(undefined)
  })

  it('loads every recovery dependency and opts the version 8 plugin into recovery mode', () => {
    const pluginPath = path.join(projectRoot, 'nodes', 'plugins', 'knxUltimate-v8-migration-recovery-plugin.html')
    const html = fs.readFileSync(pluginPath, 'utf8')
    const dependencies = Array.from(html.matchAll(/<script[^>]+src="resources\/node-red-contrib-knx-ultimate\/([^"]+)"[^>]*><\/script>/g))
      .map(match => match[1])
    expect(dependencies).to.deep.equal([
      'flowMigrationBackup.js',
      'hueControllerMigration.js',
      'knxUtilityMigration.js',
      'upgradeToV8.js'
    ])

    const inline = Array.from(html.matchAll(/<script\s+type="text\/javascript"([^>]*)>([\s\S]*?)<\/script>/g))
      .find(match => !/\bsrc=/.test(match[1]) && match[2].includes('registerPlugin'))
    expect(inline).not.to.equal(undefined)

    const installCalls = []
    const eventCalls = []
    const timerCalls = []
    const eventHandlers = new Map()
    const pendingTimers = new Map()
    const notifications = []
    const unknownNodes = [
      { id: 'utility', type: 'unknown', _orig: { type: 'knxUltimateLogger' } },
      { id: 'hue', type: 'unknown', _orig: { type: 'knxUltimateHueLight' } },
      { id: 'matter', type: 'unknown', _orig: { type: 'knxUltimateMatterControllerDevice' } },
      { id: 'ai', type: 'unknown', _orig: { type: 'knxUltimateAI' } }
    ]
    let nextTimer = 0
    let plugin
    let disposed = false
    const dollar = jqueryStub()
    const RED = {
      nodes: {
        eachNode: callback => unknownNodes.forEach(callback),
        eachConfig: () => {}
      },
      notify: (message, options) => {
        const notice = {
          message,
          options,
          closed: false,
          close () { this.closed = true }
        }
        notifications.push(notice)
        return notice
      },
      events: {
        on: (name, handler) => {
          eventCalls.push(['on', name, handler])
          eventHandlers.set(name, handler)
        },
        off: (name, handler) => {
          eventCalls.push(['off', name, handler])
          if (eventHandlers.get(name) === handler) eventHandlers.delete(name)
        }
      },
      plugins: {
        registerPlugin: (name, definition) => {
          expect(name).to.equal('knxUltimate-v8-migration-recovery-plugin')
          plugin = definition
        }
      }
    }
    const windowObject = {
      KNXUltimateUpgradeToV8: {
        AI_TYPES: upgrade.AI_TYPES,
        HUE_PACKAGE: upgrade.HUE_PACKAGE,
        HUE_TYPE_MAP: upgrade.HUE_TYPE_MAP,
        MATTER_PACKAGE: upgrade.MATTER_PACKAGE,
        MATTER_TYPE_MAP: upgrade.MATTER_TYPE_MAP,
        collectAllNodes: upgrade.collectAllNodes,
        install: (red, options) => {
          installCalls.push({ red, options })
          return { dispose: () => { disposed = true } }
        }
      },
      KNXUltimateUtilityMigration: utilityMigration,
      setTimeout: (handler, delay) => {
        const id = ++nextTimer
        timerCalls.push(['set', id, delay])
        pendingTimers.set(id, handler)
        return id
      },
      clearTimeout: id => {
        timerCalls.push(['clear', id])
        pendingTimers.delete(id)
      }
    }
    const runNextTimer = () => {
      const next = pendingTimers.entries().next().value
      expect(next).not.to.equal(undefined)
      pendingTimers.delete(next[0])
      next[1]()
    }

    vm.runInNewContext(inline[2], { RED, window: windowObject, $: dollar, Set })
    expect(plugin).to.be.an('object')
    plugin.onadd()

    expect(installCalls).to.have.length(1)
    expect(installCalls[0].red).to.equal(RED)
    expect(installCalls[0].options.environment).to.equal(windowObject)
    expect(installCalls[0].options.$).to.equal(dollar)
    expect(installCalls[0].options.recoveryMode).to.equal(true)
    expect(timerCalls[0][0]).to.equal('set')
    expect(timerCalls[0][2]).to.equal(200)

    runNextTimer()
    expect(notifications).to.have.length(1)
    expect(renderedText(notifications[0].message)).to.include('KNX Utility 1, HUE 1, Matter 1, AI 1')

    unknownNodes[3]._orig.type = 'debug'
    eventHandlers.get('nodes:change')()
    runNextTimer()
    expect(notifications).to.have.length(2)
    expect(notifications[0].closed).to.equal(true)
    expect(renderedText(notifications[1].message)).to.include('KNX Utility 1, HUE 1, Matter 1, AI 0')

    eventHandlers.get('workspace:dirty')()
    expect(pendingTimers.size).to.equal(1)

    plugin.onremove()
    expect(disposed).to.equal(true)
    expect(pendingTimers.size).to.equal(0)
    expect(notifications[1].closed).to.equal(true)
    expect(eventHandlers.size).to.equal(0)
    expect(eventCalls.filter(call => call[0] === 'on').map(call => call[1])).to.have.members([
      'nodes:add',
      'nodes:remove',
      'nodes:change',
      'workspace:dirty',
      'deploy',
      'workspace:clear'
    ])
    expect(eventCalls.filter(call => call[0] === 'off').map(call => call[1])).to.have.members([
      'nodes:add',
      'nodes:remove',
      'nodes:change',
      'workspace:dirty',
      'deploy',
      'workspace:clear'
    ])
  })
})
