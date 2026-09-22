const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const upgrade = require('../resources/upgradeToV8')

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

function migrationApis () {
  return {
    utilityApi: {
      LEGACY_NODE_PROFILES: { knxUltimateLogger: { utilityType: 'logger', inputs: 1, outputs: 2 } },
      createLocalMigrationPatches: nodes => nodes.map(() => ({ utilityType: 'logger', inputs: 1, outputs: 2 }))
    },
    hueApi: {
      LEGACY_NODE_PROFILES: { knxUltimateHueLight: { hueControllerType: 'light', inputs: 0, outputs: 0 } },
      createLocalMigrationPatches: nodes => nodes.map(() => ({ hueControllerType: 'light', inputs: 0, outputs: 0 }))
    }
  }
}

function editorFixture (nodes = [], configs = [], options = {}) {
  const all = [...nodes, ...configs]
  const completeFlow = options.completeFlow || all
  const definitions = new Map(Object.entries(options.definitions || {}))
  const invalidNodeIds = new Set(options.invalidNodeIds || [])
  const events = []
  const redraws = []
  const originalFlows = []
  let dirty = Boolean(options.dirty)
  let revision = options.revision || 'rev-1'
  const RED = {
    _: key => key,
    nodes: {
      eachNode: callback => nodes.forEach(callback),
      eachConfig: callback => configs.forEach(callback),
      node: id => all.find(node => node.id === id),
      getType: type => definitions.get(type),
      dirty: value => {
        if (value !== undefined) dirty = value
        return dirty
      },
      version: value => {
        if (value !== undefined) revision = value
        return revision
      },
      originalFlow: flow => originalFlows.push(flow),
      workspace: id => ({ id, locked: false }),
      subflow: id => id === 'subflow-1' ? { id, locked: false } : undefined,
      createCompleteNodeSet: () => completeFlow.map(node => {
        const copy = { ...node }
        delete copy._def
        delete copy._
        return copy
      }),
      eachGroup: () => {},
      eachJunction: () => {},
      eachSubflow: () => {},
      eachWorkspace: () => {}
    },
    workspaces: { isLocked: () => false },
    editor: {
      validateNode: node => {
        if (options.validationErrorId === node.id) throw new Error('injected validation failure')
        if (typeof options.validateNode === 'function') return options.validateNode(node)
        node.valid = !invalidNodeIds.has(node.id)
      }
    },
    events: { emit: (name, value) => events.push({ name, value }) },
    history: { markAllDirty: () => {} },
    view: { redraw: value => redraws.push(value) }
  }
  return { RED, all, definitions, events, redraws, originalFlows }
}

function upgradePlan (entries, counts) {
  return {
    entries,
    ai: [],
    counts,
    needsHue: entries.some(entry => entry.family === 'hue'),
    needsMatter: entries.some(entry => entry.family === 'matter')
  }
}

async function capturedFailure (operation) {
  try {
    await operation()
  } catch (error) {
    return error
  }
  throw new Error('Expected the operation to fail')
}

describe('KNX Ultimate 8 automatic upgrade', function () {
  it('keeps v7 on latest while pinning the guided upgrade to the beta build', function () {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))

    expect(pkg.version).to.equal('7.1.5')
    expect(pkg.publishConfig).to.deep.equal({ access: 'public', tag: 'latest' })
    expect(upgrade.TARGET_VERSION).to.equal('8.0.1-beta.0')
  })

  it('builds one plan for Utility, HUE and Matter while reporting both legacy AI types separately', function () {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1', wires: [['debug']] }
    const hue = { id: 'hue', type: 'knxUltimateHueLight', z: 'subflow-1', serverHue: 'hue-config' }
    const matterController = { id: 'matter-controller', type: 'knxUltimateMatterControllerDevice', z: 'tab-1', serverMatter: 'matter-config' }
    const matterBridge = { id: 'matter-bridge', type: 'knxUltimateMatterBridge', z: 'tab-1', serverMatterBridge: 'matter-bridge-config' }
    const ai = { id: 'ai', type: 'knxUltimateAI', z: 'tab-1' }
    const aiHomeAssistant = { id: 'ai-ha', type: 'knxUltimateAIHomeAssistant', z: 'tab-1' }
    const ordinary = { id: 'ordinary', type: 'knxUltimate', z: 'tab-1' }
    const hueConfig = { id: 'hue-config', type: 'hue-config' }
    const matterConfig = { id: 'matter-config', type: 'matter-config' }
    const matterBridgeConfig = { id: 'matter-bridge-config', type: 'matterbridge-config' }
    const fixture = editorFixture(
      [utility, hue, matterController, matterBridge, ai, aiHomeAssistant, ordinary],
      [hueConfig, matterConfig, matterBridgeConfig]
    )
    const apis = migrationApis()

    const plan = upgrade.createMigrationPlan(fixture.RED, apis)

    expect(plan.counts).to.deep.equal({ utility: 1, hue: 2, matter: 4, total: 7 })
    expect(plan.needsHue).to.equal(true)
    expect(plan.needsMatter).to.equal(true)
    expect(plan.ai).to.deep.equal([ai, aiHomeAssistant])
    expect(plan.entries.map(entry => [entry.node.id, entry.sourceType, entry.targetType, entry.family])).to.deep.equal([
      ['utility', 'knxUltimateLogger', 'knxUltimateUtility', 'utility'],
      ['hue', 'knxUltimateHueLight', 'hueUltimateController', 'hue'],
      ['matter-controller', 'knxUltimateMatterControllerDevice', 'matterUltimateController', 'matter'],
      ['matter-bridge', 'knxUltimateMatterBridge', 'matterUltimateBridge', 'matter'],
      ['hue-config', 'hue-config', 'hue-ultimate-config', 'hue'],
      ['matter-config', 'matter-config', 'matter-ultimate-config', 'matter'],
      ['matter-bridge-config', 'matterbridge-config', 'matter-ultimate-bridge-config', 'matter']
    ])
    expect(plan.entries[0].values).to.deep.equal({ utilityType: 'logger', inputs: 1, outputs: 2 })
    expect(plan.entries[1].values).to.deep.equal({ hueControllerType: 'light', inputs: 0, outputs: 0 })
    expect(plan.entries.slice(2).every(entry => Object.keys(entry.values).length === 0)).to.equal(true)
    expect(plan.entries.some(entry => entry.node === ordinary)).to.equal(false)
    expect(() => upgrade.applyMigrationPlan(fixture.RED, plan)).to.throw('AI nodes require manual migration')
    expect(utility.type).to.equal('knxUltimateLogger')
  })

  it('plans the unregistered beta Matter Light and missing standalone packages safely', function () {
    const betaMatter = {
      id: 'beta-matter',
      type: 'unknown',
      name: 'knxUltimateMatterLight',
      z: 'tab-1',
      wires: [['debug']],
      _orig: { type: 'knxUltimateMatterLight', name: 'Kitchen', server: 'matter-config', outputs: 1 }
    }
    const missingHue = {
      id: 'standalone-hue',
      type: 'unknown',
      name: 'hueUltimateController',
      z: 'tab-1',
      _orig: { type: 'hueUltimateController', name: 'Lamp' }
    }
    const fixture = editorFixture([betaMatter, missingHue])
    const plan = upgrade.createMigrationPlan(fixture.RED, migrationApis())

    expect(plan.needsHue).to.equal(true)
    expect(plan.needsMatter).to.equal(true)
    expect(plan.missingStandalone.hue).to.deep.equal([missingHue])
    expect(plan.entries).to.have.length(1)
    expect(plan.entries[0]).to.include({ node: betaMatter, sourceType: 'knxUltimateMatterLight', targetType: 'matterUltimateController' })
    expect(plan.entries[0].values).to.include({ name: 'Kitchen', server: 'matter-config', outputs: 1 })
    expect(plan.entries[0].removeOriginal).to.equal(true)
    expect(() => upgrade.validatePreflight(fixture.RED, plan)).not.to.throw()
  })

  it('recovers every known legacy family from unknown-node original data', function () {
    const unknownUtility = {
      id: 'unknown-utility',
      type: 'unknown',
      name: 'knxUltimateLogger',
      z: 'tab-1',
      x: 300,
      y: 200,
      wires: [['debug']],
      _orig: { id: 'unknown-utility', type: 'knxUltimateLogger', name: 'Bus logger', server: 'knx-config', x: 10, y: 20, wires: [] }
    }
    const unknownHue = {
      id: 'unknown-hue',
      type: 'unknown',
      name: 'knxUltimateHueLight',
      z: 'tab-1',
      wires: [[]],
      _orig: { id: 'unknown-hue', type: 'knxUltimateHueLight', name: 'Kitchen', serverHue: 'hue-config', outputs: 1 }
    }
    const unknownHueConfig = {
      id: 'hue-config',
      type: 'unknown',
      name: 'hue-config',
      _orig: { id: 'hue-config', type: 'hue-config', name: 'Bridge', host: '192.0.2.5' }
    }
    const fixture = editorFixture([unknownUtility, unknownHue], [unknownHueConfig], {
      definitions: { knxUltimateUtility: {}, hueUltimateController: {}, 'hue-ultimate-config': {} }
    })
    const plan = upgrade.createMigrationPlan(fixture.RED, migrationApis())

    expect(plan.counts).to.deep.equal({ utility: 1, hue: 2, matter: 0, total: 3 })
    expect(() => upgrade.validatePreflight(fixture.RED, plan)).not.to.throw()
    const result = upgrade.applyMigrationPlan(fixture.RED, plan)
    expect(unknownUtility).to.include({ type: 'knxUltimateUtility', name: 'Bus logger', server: 'knx-config', utilityType: 'logger', x: 300, y: 200 })
    expect(unknownUtility.wires).to.deep.equal([['debug']])
    expect(unknownUtility).not.to.have.property('_orig')
    expect(unknownHue).to.include({ type: 'hueUltimateController', name: 'Kitchen', serverHue: 'hue-config', hueControllerType: 'light' })
    expect(unknownHueConfig).to.include({ type: 'hue-ultimate-config', name: 'Bridge', host: '192.0.2.5' })
    result.rollback()
    expect(unknownUtility.type).to.equal('unknown')
    expect(unknownUtility._orig.type).to.equal('knxUltimateLogger')
  })

  it('converts nodes in place and restores every touched property and dirty state on rollback', function () {
    const oldDefinition = { category: 'deprecated' }
    const utility = {
      id: 'utility',
      type: 'knxUltimateLogger',
      z: 'tab-1',
      _def: oldDefinition,
      _: () => 'old',
      wires: [['debug']],
      custom: { retained: true },
      changed: false,
      w: 180,
      _colorChanged: true
    }
    const hue = { id: 'hue', type: 'knxUltimateHueLight', z: 'tab-1', _def: oldDefinition, changed: true, inputs: 0, outputs: 0 }
    const matter = { id: 'matter', type: 'knxUltimateMatterControllerDevice', z: 'tab-1', _def: oldDefinition }
    const definitions = {
      knxUltimateUtility: { name: 'utility-v8' },
      hueUltimateController: { name: 'hue-v8' },
      matterUltimateController: { name: 'matter-v8' }
    }
    const fixture = editorFixture([utility, hue, matter], [], { definitions })
    const plan = upgradePlan([
      { node: utility, sourceType: utility.type, targetType: 'knxUltimateUtility', family: 'utility', values: { utilityType: 'logger', inputs: 1, outputs: 2 } },
      { node: hue, sourceType: hue.type, targetType: 'hueUltimateController', family: 'hue', values: { hueControllerType: 'light', inputs: 0, outputs: 0 } },
      { node: matter, sourceType: matter.type, targetType: 'matterUltimateController', family: 'matter', values: {} }
    ], { utility: 1, hue: 1, matter: 1, total: 3 })

    const result = upgrade.applyMigrationPlan(fixture.RED, plan)

    expect(result).to.deep.equal({ utility: 1, hue: 1, matter: 1, total: 3 })
    expect(result.rollback).to.be.a('function')
    expect(result.commit).to.be.a('function')
    expect(utility).to.include({ type: 'knxUltimateUtility', utilityType: 'logger', inputs: 1, outputs: 2, changed: true, dirty: true, resize: true })
    expect(utility._def).to.equal(definitions.knxUltimateUtility)
    expect(utility.w).to.equal(undefined)
    expect(hue).to.include({ type: 'hueUltimateController', hueControllerType: 'light' })
    expect(matter.type).to.equal('matterUltimateController')
    expect(fixture.RED.nodes.dirty()).to.equal(true)

    result.rollback()

    expect(utility).to.include({ type: 'knxUltimateLogger', _def: oldDefinition, changed: false, w: 180, _colorChanged: true })
    expect(utility).not.to.have.property('utilityType')
    expect(utility).not.to.have.property('valid')
    expect(utility.custom).to.deep.equal({ retained: true })
    expect(hue).to.include({ type: 'knxUltimateHueLight', _def: oldDefinition, changed: true, inputs: 0, outputs: 0 })
    expect(hue).not.to.have.property('hueControllerType')
    expect(matter).to.include({ type: 'knxUltimateMatterControllerDevice', _def: oldDefinition })
    expect(fixture.RED.nodes.dirty()).to.equal(false)
    result.rollback()
    expect(utility.type).to.equal('knxUltimateLogger')
  })

  it('restores the whole conversion batch and validation flags when final validation fails', function () {
    const first = { id: 'first', type: 'knxUltimateLogger', z: 'tab-1', changed: false }
    const second = { id: 'second', type: 'knxUltimateHueLight', z: 'tab-1', changed: true }
    const fixture = editorFixture([first, second], [], {
      definitions: { knxUltimateUtility: {}, hueUltimateController: {} },
      validationErrorId: 'second'
    })
    const plan = upgradePlan([
      { node: first, sourceType: first.type, targetType: 'knxUltimateUtility', family: 'utility', values: { utilityType: 'logger' } },
      { node: second, sourceType: second.type, targetType: 'hueUltimateController', family: 'hue', values: { hueControllerType: 'light' } }
    ], { utility: 1, hue: 1, matter: 0, total: 2 })

    const result = upgrade.applyMigrationPlan(fixture.RED, plan)
    expect(() => upgrade.validateDeployable(fixture.RED, plan)).to.throw('injected validation failure')
    expect(first.valid).to.equal(true)
    result.rollback()
    expect(first).to.deep.equal({ id: 'first', type: 'knxUltimateLogger', z: 'tab-1', changed: false })
    expect(second).to.deep.equal({ id: 'second', type: 'knxUltimateHueLight', z: 'tab-1', changed: true })
    expect(fixture.RED.nodes.dirty()).to.equal(false)
  })

  it('persists incomplete migrated nodes without validating unrelated invalid nodes', function () {
    const hue = { id: 'hue', type: 'knxUltimateHueController', z: 'tab-1', serverHue: '' }
    const matter = { id: 'matter', type: 'knxUltimateMatterControllerDevice', z: 'tab-1' }
    const unrelated = { id: 'unrelated', type: 'debug', z: 'tab-1', valid: false }
    const validations = []
    const fixture = editorFixture([hue, matter, unrelated], [], {
      definitions: { hueUltimateController: {}, matterUltimateController: {} },
      validateNode: node => {
        validations.push(node.id)
        node.valid = false
      }
    })
    const plan = upgradePlan([
      { node: hue, sourceType: hue.type, targetType: 'hueUltimateController', family: 'hue', values: { hueControllerType: 'light' } },
      { node: matter, sourceType: matter.type, targetType: 'matterUltimateController', family: 'matter', values: {} }
    ], { utility: 0, hue: 1, matter: 1, total: 2 })

    expect(() => upgrade.validatePreflight(fixture.RED, plan)).not.to.throw()
    expect(validations).to.deep.equal([])
    const result = upgrade.applyMigrationPlan(fixture.RED, plan)
    expect(() => upgrade.validateDeployable(fixture.RED, plan)).not.to.throw()
    expect(validations).to.deep.equal(['hue', 'matter'])
    expect(hue.valid).to.equal(false)
    expect(matter.valid).to.equal(false)
    expect(unrelated.valid).to.equal(false)
    result.rollback()
  })

  it('converts the complete Alarm flow fixture without rejecting its incomplete HUE and Matter placeholders', function () {
    const flow = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'alarm-v8-migration-flow.json'), 'utf8'))
    const unrelatedInvalidIds = new Set(['5166a4b68732fc02', 'a7d47185c121a7f8'])
    flow.forEach(node => {
      if (unrelatedInvalidIds.has(node.id)) {
        node.alarmId = ''
        node.valid = false
      }
    })
    const before = new Map(flow.map(node => [node.id, JSON.parse(JSON.stringify(node))]))
    const nodes = flow.filter(node => node.z)
    const configs = flow.filter(node => !node.z && !['tab', 'global-config'].includes(node.type))
    const fixture = editorFixture(nodes, configs, {
      completeFlow: flow,
      definitions: { hueUltimateController: {}, matterUltimateController: {} },
      validateNode: node => {
        node.valid = !unrelatedInvalidIds.has(node.id) && !(
          (node.type === 'hueUltimateController' && !node.serverHue) ||
          (node.type === 'matterUltimateController' && !node.serverMatter)
        )
      }
    })

    const plan = upgrade.createMigrationPlan(fixture.RED, migrationApis())
    expect(plan.counts).to.deep.equal({ utility: 0, hue: 1, matter: 1, total: 2 })
    expect(() => upgrade.validatePreflight(fixture.RED, plan)).not.to.throw()

    const result = upgrade.applyMigrationPlan(fixture.RED, plan)
    expect(() => upgrade.validateDeployable(fixture.RED, plan)).not.to.throw()

    const hue = fixture.RED.nodes.node('994675b606ae8daa')
    const matter = fixture.RED.nodes.node('6fedd02af5b148b0')
    expect(hue).to.include({ type: 'hueUltimateController', serverHue: '', valid: false })
    expect(matter).to.include({ type: 'matterUltimateController', valid: false })
    expect(matter).not.to.have.property('serverMatter')
    expect(fixture.RED.nodes.node('5166a4b68732fc02')).to.include({ type: 'AlarmUltimateState', alarmId: '' })
    expect(fixture.RED.nodes.node('a7d47185c121a7f8')).to.include({ type: 'AlarmUltimateSiren', alarmId: '' })
    expect(hue.z).to.equal(before.get(hue.id).z)
    expect(hue.wires).to.deep.equal(before.get(hue.id).wires)
    expect(matter.z).to.equal(before.get(matter.id).z)
    expect(matter.wires).to.deep.equal(before.get(matter.id).wires)
    result.rollback()
  })

  it('stages an update for an old standalone package and requires a restart before conversion', async function () {
    const fixture = editorFixture([], [], { definitions: {} })
    const requests = []
    const result = await upgrade.ensureModule(fixture.RED, upgrade.HUE_PACKAGE, {
      request: settings => {
        const body = settings.data ? JSON.parse(settings.data) : undefined
        requests.push({ url: settings.url, type: settings.type, body })
        if (settings.type === 'GET') {
          return {
            name: upgrade.HUE_PACKAGE.name,
            version: '0.9.0',
            nodes: [{ enabled: true, runtime: true }]
          }
        }
        if (settings.type === 'POST' && settings.url === 'nodes') {
          return { name: body.module, version: '0.9.0', pending_version: body.version }
        }
        throw new Error('Unexpected request')
      }
    })

    expect(result).to.include({ installed: false, updated: true, restartRequired: true })
    expect(requests.map(call => `${call.type} ${call.url}`)).to.deep.equal([
      `GET nodes/${upgrade.HUE_PACKAGE.name}`,
      'POST nodes'
    ])
    expect(requests[1].body).to.deep.equal({ module: upgrade.HUE_PACKAGE.name, version: upgrade.HUE_PACKAGE.version })
  })

  it('marks an interrupted package operation as uncertain so the editor stays blocked', async function () {
    const fixture = editorFixture()
    const error = await capturedFailure(() => upgrade.ensureModule(fixture.RED, upgrade.MATTER_PACKAGE, {
      moduleLoadTimeout: 0,
      request: settings => {
        if (settings.type === 'GET') {
          const notFound = new Error('not found')
          notFound.status = 404
          notFound.code = 'not_found'
          throw notFound
        }
        const interrupted = new Error('gateway timeout')
        interrupted.status = 504
        throw interrupted
      }
    }))

    expect(error).to.include({ code: 'module_install_uncertain', moduleInstallUncertain: true })
  })

  it('does not accept a compatible current version when another major is pending', async function () {
    const requests = []
    const error = await capturedFailure(() => upgrade.installKnxV8({
      request: settings => {
        requests.push(`${settings.type} ${settings.url}`)
        return {
          name: upgrade.PACKAGE_NAME,
          version: upgrade.TARGET_VERSION,
          pending_version: '9.0.0'
        }
      }
    }))

    expect(error).to.include({ code: 'module_install_uncertain', moduleInstallUncertain: true })
    expect(requests).to.deep.equal([`GET nodes/${upgrade.PACKAGE_NAME}`])
  })

  it('installs dependencies, converts, deploys, verifies and installs v8 in strict request order', async function () {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1' }
    const hueConfig = { id: 'hue-config', type: 'hue-config' }
    const matter = { id: 'matter', type: 'knxUltimateMatterControllerDevice', z: 'tab-1' }
    const fixture = editorFixture([utility, matter], [hueConfig], {
      definitions: { knxUltimateUtility: { name: 'utility-v8' } },
      invalidNodeIds: ['matter']
    })
    const plan = upgradePlan([
      { node: utility, sourceType: utility.type, targetType: 'knxUltimateUtility', family: 'utility', values: { utilityType: 'logger', inputs: 1, outputs: 2 } },
      { node: hueConfig, sourceType: hueConfig.type, targetType: 'hue-ultimate-config', family: 'hue', values: {} },
      { node: matter, sourceType: matter.type, targetType: 'matterUltimateController', family: 'matter', values: {} }
    ], { utility: 1, hue: 1, matter: 1, total: 3 })
    const requests = []
    const progress = []
    let savedFlows
    const disposeCalls = []
    const environment = {
      HueUltimateMigration: { dispose: () => disposeCalls.push('hue') },
      MatterUltimateMigration: { dispose: () => disposeCalls.push('matter') }
    }
    const request = async settings => {
      const body = settings.data ? JSON.parse(settings.data) : undefined
      requests.push({ url: settings.url, type: settings.type, body, headers: settings.headers })
      if (settings.type === 'GET' && settings.url === `nodes/${upgrade.HUE_PACKAGE.name}`) {
        const error = new Error('not found')
        error.status = 404
        error.code = 'not_found'
        throw error
      }
      if (settings.type === 'GET' && settings.url === `nodes/${upgrade.MATTER_PACKAGE.name}`) {
        const error = new Error('not found')
        error.status = 404
        error.code = 'not_found'
        throw error
      }
      if (settings.type === 'GET' && settings.url === `nodes/${upgrade.PACKAGE_NAME}`) {
        return { name: upgrade.PACKAGE_NAME, version: '7.1.4', nodes: [] }
      }
      if (settings.url === 'nodes' && settings.type === 'POST') {
        if (body.module === upgrade.HUE_PACKAGE.name) {
          upgrade.HUE_PACKAGE.types.forEach(type => fixture.definitions.set(type, { package: 'hue' }))
          return { module: body.module }
        }
        if (body.module === upgrade.MATTER_PACKAGE.name) {
          upgrade.MATTER_PACKAGE.types.forEach(type => fixture.definitions.set(type, { package: 'matter' }))
          return { module: body.module }
        }
        if (body.module === upgrade.PACKAGE_NAME) return { module: body.module, version: body.version }
      }
      if (settings.url === 'flows' && settings.type === 'POST') {
        savedFlows = body.flows
        return { rev: 'rev-2' }
      }
      if (settings.url === 'flows' && settings.type === 'GET') return { rev: 'rev-2', flows: savedFlows }
      throw new Error('Unexpected request: ' + settings.type + ' ' + settings.url)
    }

    const result = await upgrade.runUpgrade(fixture.RED, plan, {
      environment,
      request,
      onProgress: stage => progress.push(stage)
    })

    expect(result).to.deep.equal({ utility: 1, hue: 1, matter: 1, total: 3 })
    expect(progress).to.deep.equal(['install_hue', 'install_matter', 'convert', 'deploy', 'verify', 'install_v8', 'complete'])
    expect(requests.map(call => `${call.type} ${call.url}`)).to.deep.equal([
      `GET nodes/${upgrade.HUE_PACKAGE.name}`,
      'POST nodes',
      `GET nodes/${upgrade.MATTER_PACKAGE.name}`,
      'POST nodes',
      'POST flows',
      'GET flows',
      `GET nodes/${upgrade.PACKAGE_NAME}`,
      'POST nodes'
    ])
    expect(requests[1].body).to.deep.equal({ module: upgrade.HUE_PACKAGE.name, version: upgrade.HUE_PACKAGE.version })
    expect(requests[3].body).to.deep.equal({ module: upgrade.MATTER_PACKAGE.name, version: upgrade.MATTER_PACKAGE.version })
    expect(requests[4].headers).to.deep.equal({
      'Node-RED-API-Version': 'v2',
      'Node-RED-Deployment-Type': 'full'
    })
    expect(requests[5].headers).to.deep.equal({ 'Node-RED-API-Version': 'v2' })
    expect(requests[7].body).to.deep.equal({ module: upgrade.PACKAGE_NAME, version: upgrade.TARGET_VERSION })
    expect(savedFlows.map(node => node.type)).to.deep.equal(['knxUltimateUtility', 'matterUltimateController', 'hue-ultimate-config'])
    expect(fixture.RED.nodes.version()).to.equal('rev-2')
    expect(fixture.RED.nodes.dirty()).to.equal(false)
    expect(disposeCalls).to.deep.equal(['hue', 'matter', 'hue', 'matter', 'hue', 'matter'])
  })

  it('shows a working OK button when an automatic upgrade error is persistent', async function () {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1' }
    const unrelated = { id: 'unrelated', type: 'debug', z: 'tab-1' }
    let unrelatedValidations = 0
    const fixture = editorFixture([utility, unrelated], [], {
      definitions: { knxUltimateUtility: { name: 'utility-v8' } },
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
      environment: { document: {} },
      $: jqueryStub(),
      ...migrationApis(),
      backupApi: { download: () => {} },
      request: () => { throw new Error('simulated migration failure') }
    })
    confirmation.options.buttons[1].click()
    await new Promise(resolve => setImmediate(resolve))

    const failure = notifications.find(notice => notice.options.type === 'error')
    expect(failure).not.to.equal(undefined)
    expect(failure.message).to.include('simulated migration failure')
    expect(failure.options.fixed).to.equal(true)
    expect(failure.options.buttons).to.have.length(1)
    expect(failure.options.buttons[0]).to.include({ text: 'OK', class: 'primary' })

    failure.options.buttons[0].click()
    expect(failure.closed).to.equal(true)
  })

  it('marks failures after a confirmed Deploy so the editor remains blocked', async function () {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1' }
    const fixture = editorFixture([utility], [], { definitions: { knxUltimateUtility: {} } })
    const plan = upgradePlan([
      { node: utility, sourceType: utility.type, targetType: 'knxUltimateUtility', family: 'utility', values: { utilityType: 'logger' } }
    ], { utility: 1, hue: 0, matter: 0, total: 1 })
    let savedFlows
    const error = await capturedFailure(() => upgrade.runUpgrade(fixture.RED, plan, {
      request: settings => {
        const body = settings.data ? JSON.parse(settings.data) : undefined
        if (settings.type === 'POST' && settings.url === 'flows') {
          savedFlows = body.flows
          return { rev: 'rev-2' }
        }
        if (settings.type === 'GET' && settings.url === 'flows') return { rev: 'rev-2', flows: savedFlows }
        if (settings.type === 'GET' && settings.url === `nodes/${upgrade.PACKAGE_NAME}`) {
          return { version: '7.1.4', nodes: [{ enabled: true, runtime: true }] }
        }
        const denied = new Error('palette update denied')
        denied.status = 403
        throw denied
      }
    }))

    expect(error.flowsPersisted).to.equal(true)
    expect(error.message).to.equal('palette update denied')
    expect(utility).to.include({ type: 'knxUltimateUtility', utilityType: 'logger' })
    expect(fixture.RED.nodes.dirty()).to.equal(false)
  })

  it('restores converted nodes and never requests v8 when deploy fails', async function () {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1', changed: false }
    const fixture = editorFixture([utility], [], { definitions: { knxUltimateUtility: {} }, dirty: true })
    const plan = upgradePlan([
      { node: utility, sourceType: utility.type, targetType: 'knxUltimateUtility', family: 'utility', values: { utilityType: 'logger' } }
    ], { utility: 1, hue: 0, matter: 0, total: 1 })
    const requests = []
    const error = await capturedFailure(() => upgrade.runUpgrade(fixture.RED, plan, {
      request: settings => {
        requests.push(`${settings.type} ${settings.url}`)
        throw new Error('deploy rejected')
      }
    }))

    expect(error.message).to.equal('deploy rejected')
    expect(requests).to.deep.equal(['POST flows'])
    expect(utility).to.deep.equal({ id: 'utility', type: 'knxUltimateLogger', z: 'tab-1', changed: false })
    expect(fixture.RED.nodes.dirty()).to.equal(true)
  })

  it('polls saved flows after a transient deploy response instead of rolling back too early', async function () {
    const converted = { id: 'utility', type: 'knxUltimateUtility', z: 'tab-1', utilityType: 'logger' }
    const fixture = editorFixture([converted], [], { dirty: true })
    const plan = upgradePlan([
      { node: converted, sourceType: 'knxUltimateLogger', targetType: 'knxUltimateUtility', family: 'utility', values: {} }
    ], { utility: 1, hue: 0, matter: 0, total: 1 })
    const requests = []
    let reads = 0
    const response = await upgrade.deployFlows(fixture.RED, {
      plan,
      environment: { setTimeout: callback => callback() },
      request: settings => {
        requests.push(`${settings.type} ${settings.url}`)
        if (settings.type === 'POST') {
          const error = new Error('proxy timeout')
          error.status = 503
          throw error
        }
        reads += 1
        return reads === 1
          ? { rev: 'rev-old', flows: [{ id: 'utility', type: 'knxUltimateLogger', z: 'tab-1' }] }
          : { rev: 'rev-2', flows: [{ ...converted }] }
      }
    })

    expect(response).to.deep.equal({ rev: 'rev-2' })
    expect(requests).to.deep.equal(['POST flows', 'GET flows', 'GET flows'])
    expect(fixture.RED.nodes.version()).to.equal('rev-2')
    expect(fixture.RED.nodes.dirty()).to.equal(false)
  })

  it('keeps the converted editor state when a credential-bearing deploy cannot be verified', async function () {
    const utility = {
      id: 'utility',
      type: 'knxUltimateLogger',
      z: 'tab-1',
      changed: false,
      credentials: { password: '__PWRD__' }
    }
    const fixture = editorFixture([utility], [], { definitions: { knxUltimateUtility: {} } })
    const plan = upgradePlan([
      { node: utility, sourceType: utility.type, targetType: 'knxUltimateUtility', family: 'utility', values: { utilityType: 'logger' } }
    ], { utility: 1, hue: 0, matter: 0, total: 1 })
    const requests = []
    const error = await capturedFailure(() => upgrade.runUpgrade(fixture.RED, plan, {
      request: settings => {
        requests.push(`${settings.type} ${settings.url}`)
        const failure = new Error('connection closed')
        failure.status = 503
        throw failure
      }
    }))

    expect(error).to.include({ code: 'flow_persistence_uncertain', persistenceUncertain: true })
    expect(requests).to.deep.equal(['POST flows'])
    expect(utility).to.include({ type: 'knxUltimateUtility', utilityType: 'logger', changed: true })
    expect(fixture.RED.nodes.dirty()).to.equal(true)
  })

  it('rolls back only the conversion and leaves the editor dirty on a revision conflict', async function () {
    const utility = { id: 'utility', type: 'knxUltimateLogger', z: 'tab-1', changed: false }
    const fixture = editorFixture([utility], [], { definitions: { knxUltimateUtility: {} } })
    const plan = upgradePlan([
      { node: utility, sourceType: utility.type, targetType: 'knxUltimateUtility', family: 'utility', values: { utilityType: 'logger' } }
    ], { utility: 1, hue: 0, matter: 0, total: 1 })
    const requests = []
    const error = await capturedFailure(() => upgrade.runUpgrade(fixture.RED, plan, {
      request: settings => {
        requests.push(`${settings.type} ${settings.url}`)
        if (settings.type === 'POST') {
          const conflict = new Error('revision mismatch')
          conflict.status = 409
          throw conflict
        }
        return { rev: 'other-revision', flows: [{ id: 'other', type: 'debug', z: 'tab-1' }] }
      }
    }))

    expect(error).to.include({ code: 'flow_revision_conflict', flowConflict: true })
    expect(requests).to.deep.equal(['POST flows', 'GET flows'])
    expect(utility).to.deep.equal({ id: 'utility', type: 'knxUltimateLogger', z: 'tab-1', changed: false })
    expect(fixture.RED.nodes.dirty()).to.equal(true)
  })

  it('verifies the saved flow through the v2 API and rejects every remaining legacy family', async function () {
    const requests = []
    const converted = [
      { id: 'utility', type: 'knxUltimateUtility' },
      { id: 'hue', type: 'hueUltimateController' },
      { id: 'matter', type: 'matterUltimateController' }
    ]
    const result = await upgrade.verifySavedFlows({
      request: settings => {
        requests.push(settings)
        return { rev: 'saved', flows: converted }
      }
    })
    expect(result).to.equal(converted)
    expect(requests[0]).to.include({ url: 'flows', type: 'GET', cache: false })
    expect(requests[0].headers).to.deep.equal({ 'Node-RED-API-Version': 'v2' })

    const legacy = [
      { id: 'utility-old', type: 'knxUltimateAlerter' },
      { id: 'hue-old', type: 'hue-config' },
      { id: 'matter-old', type: 'matter-config' },
      { id: 'ai-old', type: 'knxUltimateAI' }
    ]
    const legacyError = await capturedFailure(() => upgrade.verifySavedFlows({ request: () => ({ flows: legacy }) }))
    expect(legacyError.message).to.include('knxUltimateAlerter, hue-config, matter-config, knxUltimateAI')
    const malformedError = await capturedFailure(() => upgrade.verifySavedFlows({ request: () => ({ rev: 'missing-flows' }) }))
    expect(malformedError.message).to.equal('Unable to verify the deployed flow')
  })

  it('places exactly one compact upgrade button first in all 41 node and config-node templates', function () {
    const nodesDirectory = path.join(__dirname, '..', 'nodes')
    const templateFiles = fs.readdirSync(nodesDirectory)
      .filter(name => name.endsWith('.html'))
      .filter(name => /data-template-name=/.test(fs.readFileSync(path.join(nodesDirectory, name), 'utf8')))
      .sort()

    expect(templateFiles).to.have.length(41)
    templateFiles.forEach(name => {
      const html = fs.readFileSync(path.join(nodesDirectory, name), 'utf8')
      const occurrences = html.match(/knx-ultimate-v8-upgrade-button/g) || []
      expect(occurrences, name).to.have.length(1)
      const template = html.match(/<script\s+type="text\/html"\s+data-template-name="[^"]+">([\s\S]*)/)
      expect(template, name).not.to.equal(null)
      expect(template[1], name).to.match(/^\s*<div class="form-row knx-ultimate-v8-upgrade-row">\s*<button type="button" class="red-ui-button knx-ultimate-v8-upgrade-button"/)
      expect(template[1], name).to.include('node-red-contrib-knx-ultimate/knxUltimateUtility:knxUltimateUtility.v8_upgrade.button_title')
      expect(template[1], name).to.include('node-red-contrib-knx-ultimate/knxUltimateUtility:knxUltimateUtility.v8_upgrade.button')
    })
  })

  it('loads, installs and disposes the upgrade integration through the editor plugin', function () {
    const pluginPath = path.join(__dirname, '..', 'nodes', 'plugins', 'knxUltimate-migration-notice-plugin.html')
    const html = fs.readFileSync(pluginPath, 'utf8')
    expect(html).to.include('resources/node-red-contrib-knx-ultimate/upgradeToV8.js')
    expect(html).to.include('.knx-ultimate-v8-upgrade-row')
    expect(html).to.include('.knx-ultimate-v8-upgrade-button')
    const inline = Array.from(html.matchAll(/<script\s+type="text\/javascript"([^>]*)>([\s\S]*?)<\/script>/g))
      .find(match => !/\bsrc=/.test(match[1]) && match[2].includes('registerPlugin'))
    expect(inline).not.to.equal(undefined)

    const calls = []
    let plugin
    const dollar = function () {}
    const RED = {
      plugins: {
        registerPlugin (name, definition) {
          calls.push(['register', name])
          plugin = definition
        }
      }
    }
    const windowObject = {
      KNXUltimateLegacyMigrationNotice: {
        install (red, options) {
          calls.push(['notice-install', red, options])
          return { dispose: () => calls.push(['notice-dispose']) }
        }
      },
      KNXUltimateUpgradeToV8: {
        install (red, options) {
          calls.push(['upgrade-install', red, options])
          return { dispose: () => calls.push(['upgrade-dispose']) }
        }
      }
    }
    vm.runInNewContext(inline[2], { RED, window: windowObject, $: dollar })
    expect(calls[0]).to.deep.equal(['register', 'knxUltimate-migration-notice-plugin'])
    plugin.onadd()
    expect(calls[1][0]).to.equal('notice-install')
    expect(calls[1][1]).to.equal(RED)
    expect(calls[1][2]).to.deep.equal({ environment: windowObject, $: dollar })
    expect(calls[2][0]).to.equal('upgrade-install')
    expect(calls[2][1]).to.equal(RED)
    expect(calls[2][2]).to.deep.equal({ environment: windowObject, $: dollar })
    plugin.onremove()
    expect(calls.slice(-2)).to.deep.equal([['notice-dispose'], ['upgrade-dispose']])
  })

  it('provides the complete upgrade message catalog in all six supported locales', function () {
    const locales = ['de', 'en', 'es', 'fr', 'it', 'zh-CN']
    const catalogs = locales.map(locale => {
      const file = path.join(__dirname, '..', 'nodes', 'locales', locale, 'knxUltimateUtility.json')
      return { locale, upgrade: JSON.parse(fs.readFileSync(file, 'utf8')).knxUltimateUtility.v8_upgrade }
    })
    const expectedKeys = Object.keys(catalogs.find(catalog => catalog.locale === 'en').upgrade).sort()

    expect(catalogs).to.have.length(6)
    catalogs.forEach(({ locale, upgrade: messages }) => {
      expect(messages, locale).to.be.an('object')
      expect(Object.keys(messages).sort(), locale).to.deep.equal(expectedKeys)
      expectedKeys.forEach(key => expect(messages[key], `${locale}.${key}`).to.be.a('string').and.not.equal(''))
      expect(messages.ai_blocked, locale).to.include('{{count}}')
      expect(messages.summary, locale).to.include('{{utility}}').and.include('{{hue}}').and.include('{{matter}}')
      expect(messages.complete, locale).to.include('{{total}}')
    })
  })

  it('documents the global upgrade control in every localized help and corresponding wiki page', function () {
    const locales = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']
    const packageJson = require('../package.json')
    const helpNames = [...new Set(Object.values(packageJson['node-red'].nodes).map(file => path.basename(file, '.js')))]
    const wikiTitles = [
      'Alerter-Configuration', 'Cerebrum Ultimate', 'Control Matter from KNX', 'DateTime-Configuration',
      'Device', 'Garage-Configuration', 'Gateway-configuration', 'GlobalVariable', 'HATranslator', 'HUE Battery',
      'HUE Bridge configuration', 'HUE Button', 'HUE Camera motion', 'HUE Contact sensor', 'HUE Controller',
      'HUE Device software update', 'HUE Humidity sensor', 'HUE Light', 'HUE Light sensor', 'HUE Motion',
      'HUE Motion area', 'HUE Plug', 'HUE Scene', 'HUE Tapdial', 'HUE Temperature sensor',
      'HUE Zigbee connectivity', 'IoT-Bridge-Configuration', 'KNX Multi Routing', 'KNX Router Filter', 'KNX-Utility',
      'KNXAutoResponder', 'LoadControl-Configuration', 'Logger-Configuration', 'Matter-Bridge',
      'Matter-Bridge-Configuration', 'Matter-Controller-Configuration', 'SceneController-Configuration',
      'Staircase-Configuration', 'WatchDog-Configuration', 'knxUltimateViewer'
    ]
    const heading = /Upgrade to KNX Ultimate 8|Aggiornamento a KNX Ultimate 8|Upgrade auf KNX Ultimate 8|Mise à jour vers KNX Ultimate 8|Actualizar a KNX Ultimate 8|升级到 KNX Ultimate 8/

    expect(helpNames).to.have.length(41)
    locales.forEach(locale => {
      helpNames.forEach(helpName => {
        const help = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'locales', locale, `${helpName}.html`), 'utf8')
        expect(help, `${locale}/${helpName}`).to.match(heading)
      })
      const prefix = locale === 'en' ? '' : `${locale}-`
      wikiTitles.forEach(title => {
        const page = fs.readFileSync(path.join(__dirname, '..', 'docs', 'wiki', `${prefix}${title}.md`), 'utf8')
        expect(page, `${locale}/${title}`).to.include('Upgrade-to-v8')
      })
    })
  })
})
