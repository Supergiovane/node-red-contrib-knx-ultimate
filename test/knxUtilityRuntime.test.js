const { expect } = require('chai')
const { EventEmitter } = require('events')
const fs = require('fs')
const os = require('os')
const path = require('path')
const vm = require('vm')

const registerUtility = require('../nodes/knxUltimateUtility')
const {
  RUNTIME_MODULES,
  normalizeUtilityType,
  captureRuntimeConstructor
} = require('../nodes/utils/knxUtilityProfileAdapter')

function mockClock () {
  const originals = {}
  const pending = new Map()
  let nextId = 1
  for (const key of ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval']) originals[key] = global[key]
  const schedule = repeat => (callback, delay) => {
    const id = nextId++
    pending.set(id, { callback, delay, repeat })
    return id
  }
  global.setTimeout = schedule(false)
  global.setInterval = schedule(true)
  global.clearTimeout = id => pending.delete(id)
  global.clearInterval = id => pending.delete(id)
  return {
    pending,
    run: id => {
      const task = pending.get(id)
      if (!task) throw new Error(`Unknown timer ${id}`)
      if (!task.repeat) pending.delete(id)
      return task.callback()
    },
    restore: () => Object.assign(global, originals)
  }
}

function createRuntime () {
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'knx-utility-runtime-'))
  const storage = path.join(userDir, 'knxultimatestorage')
  fs.mkdirSync(path.join(storage, 'knxpersistvalues'), { recursive: true })
  const registry = new Map()
  const instances = new Map()
  const nodes = []
  const routes = []
  const telegrams = []
  const loggedErrors = []
  const globalValues = new Map()
  const globalContext = {
    get: (name, storage) => globalValues.get(JSON.stringify([storage || '', name])),
    set: (name, value, storage) => globalValues.set(JSON.stringify([storage || '', name]), value)
  }
  const server = {
    id: 'gateway',
    userDir: storage,
    loglevel: 'disable',
    linkStatus: 'connected',
    knxConnection: {},
    csv: [],
    nodeClients: [],
    addClient: node => server.nodeClients.push(node),
    removeClient: node => { server.nodeClients = server.nodeClients.filter(client => client !== node) },
    sendKNXTelegramToKNXEngine: telegram => telegrams.push(telegram),
    formatStatusTimestamp: () => 'test time'
  }
  const RED = {
    settings: { userDir },
    log: { error: message => loggedErrors.push(message) },
    auth: { needsPermission: permission => permission },
    util: { cloneMessage: message => structuredClone(message) },
    httpAdmin: { post: (url, permission, handler) => routes.push({ url, permission, handler }) },
    nodes: {
      registerType: (type, constructor) => registry.set(type, constructor),
      getNode: id => id === server.id ? server : instances.get(id),
      createNode: (node, config) => {
        node.id = config.id || `utility-${nodes.length + 1}`
        node.type = config.type
        node.sent = []
        node.statuses = []
        node.errors = []
        node.createCount = (node.createCount || 0) + 1
        const emitter = new EventEmitter()
        node.on = emitter.on.bind(emitter)
        node.once = emitter.once.bind(emitter)
        node.emit = emitter.emit.bind(emitter)
        node.listenerCount = emitter.listenerCount.bind(emitter)
        node.send = message => node.sent.push(message)
        node.status = status => node.statuses.push(status)
        node.error = error => node.errors.push(error)
        node.context = () => ({ global: globalContext })
        instances.set(node.id, node)
        nodes.push(node)
      }
    }
  }
  registerUtility(RED)
  const create = (utilityType, config = {}, type = 'knxUltimateUtility') => {
    const Constructor = registry.get(type)
    return new Constructor({ server: server.id, utilityType, type, ...config })
  }
  const close = node => {
    if (node.closed) return
    let doneCalls = 0
    const hasClose = node.listenerCount('close') > 0
    node.emit('close', () => { doneCalls++ })
    if (hasClose) expect(doneCalls).to.equal(1)
    node.sysLogger?.destroy()
    node.closed = true
  }
  return {
    RED,
    registry,
    routes,
    server,
    telegrams,
    loggedErrors,
    globalContext,
    storage,
    create,
    close,
    cleanup: () => {
      nodes.forEach(close)
      fs.rmSync(userDir, { recursive: true, force: true })
    }
  }
}

function callRoute (runtime, url, body) {
  const route = runtime.routes.find(route => route.url === url)
  expect(route, url).not.to.equal(undefined)
  const response = {
    statusCode: 200,
    status (code) { this.statusCode = code; return this },
    json (value) { this.body = value; return this }
  }
  route.handler({ body }, response)
  return response
}

describe('KNX Utility private runtime profiles', () => {
  let clock
  let runtimes
  const runtime = () => {
    const instance = createRuntime()
    runtimes.push(instance)
    return instance
  }

  beforeEach(() => {
    clock = mockClock()
    runtimes = []
  })

  afterEach(() => {
    try {
      runtimes.forEach(instance => instance.cleanup())
    } finally {
      clock.restore()
    }
  })

  it('registers only Utility and caches private constructors separately for each RED', () => {
    const first = runtime()
    const second = runtime()
    expect([...first.registry.keys()]).to.deep.equal(['knxUltimateUtility'])
    expect(Object.keys(RUNTIME_MODULES)).to.have.members([
      'alerter', 'autoresponder', 'datetime', 'watchdog', 'globalcontext', 'logger',
      'staircase', 'garage', 'scenecontroller', 'loadcontrol', 'hatranslator'
    ])
    for (const utilityType of Object.keys(RUNTIME_MODULES)) {
      const constructor = captureRuntimeConstructor(first.RED, utilityType)
      expect(constructor).to.be.a('function')
      expect(captureRuntimeConstructor(first.RED, utilityType)).to.equal(constructor)
      expect(captureRuntimeConstructor(second.RED, utilityType)).not.to.equal(constructor)
    }
    expect([...first.registry.keys()]).to.deep.equal(['knxUltimateUtility'])
    expect(first.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('rejects missing, unknown and prototype property selections without starting a bus service', () => {
    const instance = runtime()
    for (const utilityType of [undefined, '', 'unknown', '__proto__', 'constructor', 'toString']) {
      expect(() => normalizeUtilityType({ utilityType })).to.throw('Unsupported KNX Utility function')
      const node = instance.create(utilityType, {
        rules: [{ topic: '1/1/1' }],
        gaDateTime: '1/2/1',
        sendOnDeploy: true,
        periodicSend: true
      })
      expect(node.createCount).to.equal(1)
      expect(node.errors).to.have.length(1)
      expect(node.statuses[0].fill).to.equal('red')
    }
    expect(instance.telegrams).to.deep.equal([])
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('instantiates only the selected profile despite inactive profile settings', () => {
    const instance = runtime()
    const node = instance.create(' datetime ', {
      gaDateTime: '1/1/1',
      rules: [{ topic: '2/1/1' }],
      commandText: JSON.stringify([{ ga: '3/1/1', dpt: '1.001', default: true }])
    })
    expect(node.type).to.equal('knxUltimateUtility')
    expect(node.utilityType).to.equal('datetime')
    expect(node.createCount).to.equal(1)
    expect(node).not.to.have.property('isalertnode')
    expect(node).not.to.have.property('exposedGAs')
    expect(node).not.to.have.property('rules')
    expect(node.notifywrite).to.equal(false)
    expect(instance.server.nodeClients).to.deep.equal([node])
    expect(instance.telegrams).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('converts HA standard states without a gateway, timers or KNX bus subscriptions', () => {
    const instance = runtime()
    instance.RED.nodes.getNode = () => { throw new Error('HA translation must not look up a gateway') }
    const node = instance.create('hatranslator', { server: '' })
    const cases = [
      ['on', true], ['off', false], ['active', true], ['inactive', false],
      ['open', true], ['closed', false], ['close', false], ['1', true], ['0', false],
      ['true', true], ['false', false], ['home', true], ['not_home', false],
      ['ON', true], ['Not_Home', false], [true, true], [false, false],
      [1, true], [0, false], [-2, true], [0.25, true]
    ]
    cases.forEach(([payload, expected], index) => {
      node.emit('input', { topic: 'ha/sensor', payload })
      expect(node.sent[index]).to.deep.equal({ topic: 'ha/sensor', payload: expected })
    })
    expect(node.errors).to.deep.equal([])
    expect(node.createCount).to.equal(1)
    expect(node.utilityType).to.equal('hatranslator')
    expect(node.statuses[0]).to.include({ fill: 'grey', shape: 'dot' })
    expect(node.statuses.at(-1)).to.include({ fill: 'green', shape: 'dot' })
    expect(node).not.to.have.property('serverKNX')
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(instance.telegrams).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('uses the dedicated HA mapping independently of the AutoResponder commandText', () => {
    const instance = runtime()
    const defaultNode = instance.create('hatranslator', { server: '', commandText: '[]' })
    defaultNode.emit('input', { payload: 'on' })
    expect(defaultNode.sent[0].payload).to.equal(true)
    const node = instance.create('hatranslator', {
      server: '',
      commandText: JSON.stringify([{ ga: '1/1/1', dpt: '1.001', default: true }]),
      haTranslationTable: 'occupied:true\nclear:false\non:false'
    })
    node.emit('input', { payload: 'OcCuPiEd' })
    node.emit('input', { payload: 'clear' })
    node.emit('input', { payload: 'on' })
    node.emit('input', { payload: 'off' })
    expect(node.sent.map(message => message.payload)).to.deep.equal([true, false, false])
    expect(node.statuses.at(-1).fill).to.equal('red')
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(instance.telegrams).to.deep.equal([])
  })

  it('reads a nested HA state and clones the input before replacing the output payload', () => {
    const instance = runtime()
    const node = instance.create('hatranslator', {
      server: '', payloadPropName: 'data.new_state.state', haTranslationTable: 'home:true'
    })
    const input = {
      topic: 'ha/presence',
      payload: { source: 'original' },
      data: { new_state: { state: 'home', attributes: { friendly_name: 'Presence' } } },
      metadata: { source: 'Home Assistant' }
    }
    const before = structuredClone(input)
    node.emit('input', input)
    expect(node.sent).to.have.length(1)
    expect(node.sent[0]).to.deep.equal({ ...before, payload: true })
    expect(input).to.deep.equal(before)
    expect(node.sent[0]).not.to.equal(input)
    expect(node.sent[0].data).not.to.equal(input.data)
    expect(node.sent[0].metadata).not.to.equal(input.metadata)
    node.sent[0].data.new_state.state = 'away'
    expect(input.data.new_state.state).to.equal('home')
  })

  it('rejects missing, nested missing and nonconvertible HA states without modifying inputs', () => {
    const instance = runtime()
    const node = instance.create('hatranslator', { server: '' })
    const inputs = [
      { topic: 'ha/missing' }, { payload: 'unknown' }, { payload: null },
      { payload: { state: 'on' } }, { payload: ['on'] }
    ]
    for (const input of inputs) {
      const before = structuredClone(input)
      expect(() => node.emit('input', input)).not.to.throw()
      expect(input).to.deep.equal(before)
      expect(node.statuses.at(-1).fill).to.equal('red')
    }
    const nested = instance.create('hatranslator', { server: '', payloadPropName: 'data.new_state.state' })
    for (const input of [{}, { data: null }, { data: {} }, { data: { new_state: null } }]) {
      const before = structuredClone(input)
      expect(() => nested.emit('input', input)).not.to.throw()
      expect(input).to.deep.equal(before)
      expect(nested.statuses.at(-1).fill).to.equal('red')
    }
    expect(node.sent).to.deep.equal([])
    expect(nested.sent).to.deep.equal([])
    expect(instance.telegrams).to.deep.equal([])
    expect(instance.loggedErrors).to.deep.equal([])
  })

  it('preserves an explicitly empty HA table while still passing boolean values', () => {
    const instance = runtime()
    const node = instance.create('hatranslator', { server: '', haTranslationTable: '' })
    node.emit('input', { payload: 'on' })
    node.emit('input', { payload: false })
    expect(node.sent).to.deep.equal([{ payload: false }])
  })

  it('preserves Alerter gateway flags, three outputs, reads and close cleanup', () => {
    const instance = runtime()
    const node = instance.create('alerter', {
      id: 'old-alerter-id',
      rules: [{ topic: '1/1/1', devicename: 'Window', longdevicename: 'Kitchen window' }],
      timerinterval: 2
    })
    expect(node.isalertnode).to.equal(true)
    expect(node.listenallga).to.equal(true)
    expect(node.notifyresponse).to.equal(true)
    expect(node.notifywrite).to.equal(true)
    expect(node.notifyreadrequest).to.equal(false)
    expect(instance.telegrams).to.deep.equal([{
      grpaddr: '1/1/1', payload: '', dpt: '', outputtype: 'read', nodecallerid: node.id
    }])
    expect(node.sent[0].map(message => message.payload)).to.deep.equal([false, false, false])

    node.emit('input', { topic: '1/1/1', payload: true })
    expect(node.sent[1][2]).to.include({ topic: '1/1/1', count: 1, payload: true })
    expect(node.sent[2][1]).to.include({ devicename: 'Window', count: 1, payload: true })
    clock.run(node.timerSend)
    expect(node.sent[3][0]).to.include({ topic: '1/1/1', payload: true })
    node.handleSend({ topic: '1/1/1', payload: false })
    clock.run(node.timerSend)
    expect(node.sent[4].map(message => message.payload)).to.deep.equal([false, false, false])

    instance.close(node)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('keeps Alerter manual start and initial-read callbacks available to the gateway', () => {
    const instance = runtime()
    const node = instance.create('alerter', {
      rules: [{ topic: '1/1/1', devicename: 'Window' }],
      whentostart: 'manualstart'
    })
    node.handleSend({ topic: '1/1/1', payload: true })
    expect(node.sent).to.have.length(1)
    node.emit('input', { start: true })
    expect(node.sent[1][1].payload).to.equal(true)
    expect(node.sent[1][2].payload).to.equal(true)
    node.initialReadAllDevicesInRules()
    expect(instance.telegrams).to.have.length(2)
    instance.close(node)
    expect(clock.pending.size).to.equal(0)
  })

  it('responds only to configured AutoResponder GAs and persists raw-decoded values under the same ID', () => {
    const instance = runtime()
    const config = {
      id: 'old-responder-id',
      commandText: JSON.stringify([{ ga: '1/1/1', dpt: '1.001', default: false }])
    }
    const node = instance.create('autoresponder', config)
    const read = destination => ({ knx: { event: 'GroupValue_Read', destination } })
    expect(node.notifyreadrequest).to.equal(true)
    expect(node.notifyresponse).to.equal(true)
    expect(node.notifywrite).to.equal(true)
    node.handleSend(read('1/1/2'))
    expect(instance.telegrams).to.have.length(0)
    node.handleSend(read('1/1/1'))
    expect(instance.telegrams[0]).to.deep.equal({
      grpaddr: '1/1/1', payload: false, dpt: '1.001', outputtype: 'response', nodecallerid: config.id
    })
    node.handleSend({ knx: { event: 'GroupValue_Write', destination: '1/1/1', rawValue: Buffer.from([1]) } })
    node.handleSend(read('1/1/1'))
    expect(instance.telegrams[1].payload).to.equal(true)
    instance.close(node)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
    const saved = JSON.parse(fs.readFileSync(path.join(instance.storage, 'knxpersistvalues', `knxpersist${config.id}.json`)))
    expect(saved[0]).to.include({ address: '1/1/1', payload: true })

    const restored = instance.create('autoresponder', config)
    restored.handleSend(read('1/1/1'))
    expect(instance.telegrams[2].payload).to.equal(true)
    expect(restored.sent).to.deep.equal([])
  })

  it('keeps AutoResponder malformed JSON inactive without leaking its persistence interval', () => {
    const instance = runtime()
    const node = instance.create('autoresponder', { commandText: '{invalid' })
    expect(node.statuses.some(status => status.fill === 'red' && status.text.startsWith('JSON error:'))).to.equal(true)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(instance.telegrams).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('preserves cached values for every AutoResponder directive when reloading the same node ID', () => {
    const instance = runtime()
    const id = 'multi-directive-responder'
    const directives = [
      { ga: '1/1/1', dpt: '1.001', default: false },
      { ga: '1/1/2', dpt: '1.001', default: false }
    ]
    const original = instance.create('autoresponder', { id, commandText: JSON.stringify(directives) })
    directives.forEach(({ ga }) => original.handleSend({
      knx: { event: 'GroupValue_Write', destination: ga, rawValue: Buffer.from([1]) }
    }))
    instance.close(original)

    const restored = instance.create('autoresponder', { id, commandText: JSON.stringify(directives.slice().reverse()) })
    directives.forEach(({ ga }) => restored.handleSend({ knx: { event: 'GroupValue_Read', destination: ga } }))
    expect(instance.telegrams.map(({ grpaddr, payload }) => ({ grpaddr, payload }))).to.deep.equal([
      { grpaddr: '1/1/1', payload: true },
      { grpaddr: '1/1/2', payload: true }
    ])
  })

  it('stops answering removed AutoResponder addresses and persists an empty directive list across restarts', () => {
    const instance = runtime()
    const id = 'edited-responder'
    const directives = [
      { ga: '1/1/1', dpt: '1.001', default: false },
      { ga: '1/1/2', dpt: '1.001', default: false }
    ]
    const config = entries => ({ id, commandText: JSON.stringify(entries) })
    const original = instance.create('autoresponder', config(directives))
    directives.forEach(({ ga }) => original.handleSend({
      knx: { event: 'GroupValue_Write', destination: ga, rawValue: Buffer.from([1]) }
    }))
    instance.close(original)

    const remaining = instance.create('autoresponder', config([directives[1]]))
    directives.forEach(({ ga }) => remaining.handleSend({ knx: { event: 'GroupValue_Read', destination: ga } }))
    expect(instance.telegrams.map(({ grpaddr, payload }) => ({ grpaddr, payload }))).to.deep.equal([
      { grpaddr: '1/1/2', payload: true }
    ])
    instance.close(remaining)

    const empty = instance.create('autoresponder', config([]))
    directives.forEach(({ ga }) => empty.handleSend({ knx: { event: 'GroupValue_Read', destination: ga } }))
    expect(instance.telegrams).to.have.length(1)
    expect(empty.exposedGAs).to.deep.equal([])
    instance.close(empty)
    const saved = JSON.parse(fs.readFileSync(path.join(instance.storage, 'knxpersistvalues', `knxpersist${id}.json`)))
    expect(saved).to.deep.equal([])

    const restarted = instance.create('autoresponder', config([]))
    directives.forEach(({ ga }) => restarted.handleSend({ knx: { event: 'GroupValue_Read', destination: ga } }))
    expect(instance.telegrams).to.have.length(1)
  })

  it('stays inactive with a missing gateway for every bus-dependent profile', () => {
    const instance = runtime()
    for (const utilityType of Object.keys(RUNTIME_MODULES).filter(type => type !== 'hatranslator')) {
      const node = instance.create(utilityType, { server: 'missing-gateway', commandText: '[]' })
      expect(node.statuses.some(status => status.fill === 'red')).to.equal(true)
      expect(node.errors).to.deep.equal([])
    }
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(instance.telegrams).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('sends DateTime, Date and Time with their DPTs and preserves source message IDs', () => {
    const instance = runtime()
    const node = instance.create('datetime', {
      gaDateTime: '1/2/1', gaDate: '1/2/2', gaTime: '1/2/3', outputtopic: 'date-events'
    })
    const date = new Date('2026-09-14T12:34:56.000Z')
    node.emit('input', { payload: date, _msgid: 'incoming-id' })
    expect(instance.telegrams.map(({ grpaddr, dpt }) => ({ grpaddr, dpt }))).to.deep.equal([
      { grpaddr: '1/2/1', dpt: '19.001' },
      { grpaddr: '1/2/2', dpt: '11.001' },
      { grpaddr: '1/2/3', dpt: '10.001' }
    ])
    expect(instance.telegrams.every(telegram => telegram.payload === date && telegram.nodecallerid === node.id)).to.equal(true)
    expect(node.sent[0]).to.include({ topic: 'date-events', reason: 'input', _msgid: 'incoming-id' })
    expect(node.sent[0].knxUltimateDateTime.date).to.equal(date.toISOString())
    node.emit('input', { payload: 'not a date' })
    expect(instance.telegrams).to.have.length(3)
    expect(node.statuses.at(-1).fill).to.equal('red')
  })

  it('preserves DateTime startup, periodic and disconnected queue timers, then clears them on close', () => {
    const instance = runtime()
    const node = instance.create('datetime', {
      gaDateTime: '1/2/1',
      sendOnDeploy: true,
      sendOnDeployDelay: 3,
      periodicSend: true,
      periodicSendInterval: 2,
      periodicSendUnit: 'm'
    })
    expect(clock.pending.get(node._timerDeploy).delay).to.equal(3000)
    expect(clock.pending.get(node._timerPeriodic).delay).to.equal(120000)
    clock.run(node._timerDeploy)
    expect(node.sent[0].reason).to.equal('startup')
    clock.run(node._timerPeriodic)
    expect(node.sent[1].reason).to.equal('periodic')
    instance.server.linkStatus = 'disconnected'
    expect(node.triggerSend({ reason: 'button' })).to.deep.equal({ queued: true })
    expect(instance.telegrams).to.have.length(2)
    clock.run(node._timerWaitConnected)
    expect(instance.telegrams).to.have.length(2)
    instance.server.linkStatus = 'connected'
    clock.run(node._timerWaitConnected)
    expect(instance.telegrams).to.have.length(3)
    expect(node._timerWaitConnected).to.equal(null)
    instance.server.linkStatus = 'disconnected'
    node.triggerSend()
    instance.close(node)
    expect(node._pendingSend).to.equal(null)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('registers each DateTime endpoint once per RED and supports Utility without the legacy registration', () => {
    const first = runtime()
    const utility = first.create('datetime', { gaDateTime: '1/2/1' })
    expect(first.routes.map(route => route.url)).to.deep.equal(['/knxUltimateUtility/sendNow'])
    expect(first.routes[0].permission).to.equal('knxUltimateUtility.write')
    const response = callRoute(first, '/knxUltimateUtility/sendNow', { id: utility.id })
    expect(response.body).to.deep.equal({ status: 'ok', queued: false })
    expect(first.telegrams).to.have.length(1)
    expect(utility.sent[0].reason).to.equal('button')

    registerUtility(first.RED)
    expect(first.routes).to.have.length(1)
    const second = runtime()
    expect(second.routes).to.have.length(1)
    const separate = second.create('datetime', { gaDateTime: '1/2/3' })
    callRoute(second, '/knxUltimateUtility/sendNow', { id: separate.id })
    expect(second.telegrams).to.have.length(1)
    expect(first.telegrams).to.have.length(1)
  })

  it('validates DateTime endpoint targets and reports a queued send without transmitting early', () => {
    const instance = runtime()
    expect(callRoute(instance, '/knxUltimateUtility/sendNow', {}).statusCode).to.equal(400)
    expect(callRoute(instance, '/knxUltimateUtility/sendNow', { id: 'missing' }).statusCode).to.equal(404)
    const alerter = instance.create('alerter', { rules: [] })
    expect(callRoute(instance, '/knxUltimateUtility/sendNow', { id: alerter.id }).statusCode).to.equal(400)
    const datetime = instance.create('datetime', { gaDateTime: '1/2/1' })
    instance.server.linkStatus = 'disconnected'
    const response = callRoute(instance, '/knxUltimateUtility/sendNow', { id: datetime.id })
    expect(response.body).to.deep.equal({ status: 'ok', queued: true })
    expect(instance.telegrams).to.deep.equal([])
  })

  it('keeps Watchdog bus checks, gateway control and node-error dispatch isolated from other profiles', () => {
    const instance = runtime()
    const settings = []
    const connections = []
    instance.server.setGatewayConfig = (...args) => settings.push(args)
    instance.server.connectGateway = connected => connections.push(connected)
    const node = instance.create('watchdog', { topic: '1/1/1', checkLevel: 'Eth+KNX', maxRetry: 1, autoStart: true })
    expect(node.isWatchDog).to.equal(true)
    expect(node).not.to.have.property('isalertnode')
    expect(instance.server.nodeClients).to.deep.equal([node])
    clock.run(node.timerWatchDog)
    expect(instance.telegrams[0]).to.include({ grpaddr: '1/1/1', outputtype: 'read' })
    node.watchDogTimerReset()
    expect(node.beatNumber).to.equal(0)
    clock.run(node.timerWatchDog)
    clock.run(node.timerWatchDog)
    expect(node.sent[0]).to.include({ type: 'BUSError', payload: true })

    const error = { nodeid: 'knx-device', text: 'Device error', GA: '1/1/2' }
    const dispatch = require('../nodes/utils/watchDogErrorDispatcher')
    dispatch(instance.server, error)
    dispatch(instance.server, error)
    expect(node.sent.filter(message => message.type === 'NodeError')).to.have.length(1)
    node.emit('input', { setGatewayConfig: { IP: '192.0.2.10', Port: 3671 }, connectGateway: false })
    expect(settings[0].slice(0, 2)).to.deep.equal(['192.0.2.10', 3671])
    expect(connections).to.deep.equal([false])
    instance.close(node)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('ignores a Watchdog ping response arriving after close without making a real network request', () => {
    const ping = require('ping')
    const probe = ping.sys.probe
    let pendingResponse
    ping.sys.probe = (_host, callback) => { pendingResponse = callback }
    try {
      const instance = runtime()
      const node = instance.create('watchdog', { checkLevel: 'Ethernet', autoStart: true })
      clock.run(node.timerWatchDog)
      expect(pendingResponse).to.be.a('function')
      instance.close(node)
      const previousStatuses = node.statuses.length
      pendingResponse(true)
      expect(node.statuses).to.have.length(previousStatuses)
      expect(clock.pending.size).to.equal(0)
    } finally {
      ping.sys.probe = probe
    }
  })

  it('preserves GlobalContext named keys and context storage while polling writes with ETS DPT lookup', () => {
    const instance = runtime()
    instance.server.csv = [{ ga: '1/2/1', dpt: '1.001', devicename: 'Kitchen' }]
    const node = instance.create('globalcontext', {
      name: 'KNXHome', exposeAsVariable: 'exposeAsVariableREADWRITE', contextStorage: 'memory', writeExecutionInterval: 500
    })
    expect(instance.server.nodeClients).to.deep.equal([node])
    node.handleSend({ payload: true, knx: { event: 'GroupValue_Write', destination: '1/2/1', dpt: '1.001' } })
    expect(instance.globalContext.get('KNXHome_READ', 'memory')[0]).to.include({ address: '1/2/1', payload: true, devicename: 'Kitchen' })
    expect(instance.globalContext.get('KNXHome_READ')).to.equal(undefined)
    instance.globalContext.set('KNXHome_WRITE', [{ address: '1/2/1', payload: false }], 'memory')
    clock.run(node.timerExposedGAs)
    expect(instance.telegrams).to.deep.equal([{
      grpaddr: '1/2/1', payload: false, dpt: '1.001', outputtype: 'write', nodecallerid: node.id
    }])
    expect(instance.globalContext.get('KNXHome_WRITE', 'memory')).to.deep.equal([])
    expect(node.sent).to.deep.equal([])
    instance.close(node)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('emits Logger ETS XML and telegram counts on their original outputs and saves to the configured file', () => {
    const instance = runtime()
    const logFile = path.join(instance.storage, 'logger.xml')
    const node = instance.create('logger', {
      topic: 'monitor',
      saveMode: 'emit_save',
      filePath: logFile,
      autoStartTimerCreateETSXML: true,
      autoStartTimerTelegramCounter: true,
      maxRowsInETSXML: 2
    })
    expect(node.isLogger).to.equal(true)
    expect(instance.server.nodeClients).to.deep.equal([node])
    node.handleSend('2900BCE011010A01010081')
    node.handleSend('2900BCE011010A01010080')
    node.emit('input', { etsoutputnow: true })
    expect(node.sent[0][0].payload).to.include('<CommunicationLog').and.include('2900BCE011010A01010081')
    expect(node.sent[0][1]).to.equal(null)
    expect(fs.readFileSync(logFile, 'utf8')).to.include('2900BCE011010A01010080')
    node.emit('input', { telegramcounteroutputnow: true })
    expect(node.sent[1][0]).to.equal(null)
    expect(node.sent[1][1]).to.include({ topic: 'monitor', payload: 2 })
    expect(node.telegramCount).to.equal(0)
    expect(instance.telegrams).to.deep.equal([])
    instance.close(node)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('subscribes Staircase to gateway telegrams, handles read/block and cancels prewarning pulses on close', () => {
    const instance = runtime()
    const node = instance.create('staircase', {
      gaTrigger: '1/3/1',
      gaOutput: '1/3/2',
      gaStatus: '1/3/3',
      gaBlock: '1/3/4',
      timerSeconds: 10,
      preWarnEnable: true,
      preWarnSeconds: 2,
      preWarnMode: 'flash',
      emitEvents: true
    })
    expect(instance.server.nodeClients).to.deep.equal([node])
    const client = instance.server.nodeClients[0]
    client.handleSend({ payload: true, knx: { destination: '1/3/1', event: 'GroupValue_Write' } })
    expect(node.active).to.equal(true)
    expect(instance.telegrams[0]).to.include({ grpaddr: '1/3/2', payload: true, outputtype: 'write' })
    expect(node.sent[0][0].event).to.equal('trigger')
    client.handleSend({ knx: { destination: '1/3/2', event: 'GroupValue_Read' } })
    expect(instance.telegrams.at(-1)).to.include({ grpaddr: '1/3/2', payload: true, outputtype: 'response' })
    client.handleSend({ payload: true, knx: { destination: '1/3/4', event: 'GroupValue_Write' } })
    expect(node.active).to.equal(false)
    client.handleSend({ payload: false, knx: { destination: '1/3/4', event: 'GroupValue_Write' } })
    client.handleSend({ payload: true, knx: { destination: '1/3/1', event: 'GroupValue_Write' } })
    clock.run(node.preWarnTimer)
    expect(instance.telegrams.at(-1)).to.include({ grpaddr: '1/3/2', payload: false })
    const lateCallbacks = [...clock.pending.values()].map(timer => timer.callback)
    instance.close(node)
    const sentBefore = instance.telegrams.length
    lateCallbacks.forEach(callback => callback())
    expect(instance.telegrams).to.have.length(sentBefore)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('starts and stops the Logger XML timer with the documented etsstarttimer input', () => {
    const instance = runtime()
    const node = instance.create('logger', { autoStartTimerCreateETSXML: false, intervalCreateETSXML: 1 })
    expect(node.timerCreateETSXML).to.equal(null)
    node.emit('input', { etsstarttimer: true })
    const timer = node.timerCreateETSXML
    expect(clock.pending.get(timer)).to.include({ repeat: true, delay: 60000 })
    node.handleSend('2900BCE011010A01010081')
    clock.run(timer)
    expect(node.sent[0][0].payload).to.include('2900BCE011010A01010081')
    node.emit('input', { etsstarttimer: false })
    expect(clock.pending.has(timer)).to.equal(false)
    instance.close(node)
    expect(clock.pending.size).to.equal(0)
  })

  it('subscribes Garage to gateway telegrams and cancels impulse, movement and auto-close callbacks on close', () => {
    const instance = runtime()
    const node = instance.create('garage', {
      gaImpulse: '1/4/1',
      gaMoving: '1/4/2',
      gaHoldOpen: '1/4/3',
      autoCloseEnable: true,
      autoCloseSeconds: 5,
      emitEvents: true
    })
    expect(instance.server.nodeClients).to.deep.equal([node])
    node.emit('input', { payload: 'open' })
    expect(instance.telegrams[0]).to.include({ grpaddr: '1/4/1', payload: true })
    expect(node.sent[0][0].event).to.equal('open')
    const finishTimer = [...clock.pending.entries()].find(([, timer]) => timer.delay === 300)[0]
    clock.run(finishTimer)
    expect(node.doorState).to.equal('open')
    expect(clock.pending.get(node.autoCloseTimer).delay).to.equal(5000)
    node.handleSend({ payload: true, knx: { destination: '1/4/3', event: 'GroupValue_Write' } })
    expect(node.holdOpenActive).to.equal(true)
    expect(node.autoCloseTimer).to.equal(null)
    node.handleSend({ knx: { destination: '1/4/3', event: 'GroupValue_Read' } })
    expect(instance.telegrams.at(-1)).to.include({ grpaddr: '1/4/3', payload: true, outputtype: 'response' })
    const lateCallbacks = [...clock.pending.values()].map(timer => timer.callback)
    instance.close(node)
    const sentBefore = instance.telegrams.length
    lateCallbacks.forEach(callback => callback())
    expect(instance.telegrams).to.have.length(sentBefore)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('keeps LoadControl manual shedding connected without a monitor GA and honors restore/disable', () => {
    const instance = runtime()
    const node = instance.create('loadcontrol', {
      topic: '', controlMode: 'msg', name: 'Loads', GA1: '1/5/1', DPT1: '1.001', Name1: 'Heater', autoRestore1: true
    })
    expect(node.isLoadControlNode).to.equal(true)
    expect(instance.server.nodeClients).to.deep.equal([node])
    node.emit('input', { shedding: 'shed' })
    expect(instance.telegrams[0]).to.include({ grpaddr: '1/5/1', payload: false })
    expect(node.sent[0]).to.include({ operation: 'Increase Shedding', payload: 1, device: 'Heater' })
    node.emit('input', { shedding: 'unshed' })
    expect(instance.telegrams[1]).to.include({ grpaddr: '1/5/1', payload: true })
    expect(node.sent[1]).to.include({ operation: 'Decrease Shedding', payload: 0 })
    node.emit('input', { disable: true })
    node.emit('input', { shedding: 'shed' })
    expect(instance.telegrams).to.have.length(2)
    node.emit('input', { enable: true })
    instance.close(node)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('keeps LoadControl automatic reads, watt thresholds and delayed shedding', () => {
    const instance = runtime()
    const node = instance.create('loadcontrol', {
      topic: '1/5/0',
      controlMode: 'auto',
      wattLimit: 1000,
      sheddingCheckInterval: 2,
      GA1: '1/5/1',
      DPT1: '1.001',
      autoRestore1: true,
      MonitorGA1: '1/5/2'
    })
    node.handleSend({ topic: '1/5/0', payload: 2000 })
    node.handleSend({ topic: '1/5/2', payload: 100 })
    clock.run(node.mainTimer)
    expect(instance.telegrams.map(telegram => telegram.grpaddr)).to.deep.equal(['1/5/0', '1/5/2'])
    expect(clock.pending.get(node.timerIncreaseShedding).delay).to.equal(2000)
    clock.run(node.timerIncreaseShedding)
    expect(instance.telegrams.at(-1)).to.include({ grpaddr: '1/5/1', payload: false, outputtype: 'write' })
    expect(node.sheddingStage).to.equal(1)
    instance.close(node)
    expect(clock.pending.size).to.equal(0)
  })

  it('participates in the gateway initial-read dispatch after connection and reconnection', () => {
    const instance = runtime()
    const node = instance.create('loadcontrol', {
      topic: '1/5/0', controlMode: 'auto', MonitorGA1: '1/5/2'
    })
    // Execute the real gateway dispatcher with its transport/persistence timer
    // isolated, rather than duplicating its strict initialread flag predicate.
    const gatewaySource = fs.readFileSync(path.join(__dirname, '../nodes/knxUltimate-config.js'), 'utf8')
    const start = gatewaySource.indexOf('    function DoInitialReadFromKNXBusOrFile () {')
    const end = gatewaySource.indexOf('\n    // 01/02/2020 Dinamic change', start)
    expect(start).to.be.greaterThan(-1)
    expect(end).to.be.greaterThan(start)
    const sandbox = {
      node: instance.server,
      loadExposedGAs: () => {},
      saveExposedGAs: async () => {},
      setInterval: global.setInterval,
      clearInterval: global.clearInterval
    }
    vm.runInNewContext(gatewaySource.slice(start, end) + '\nDoInitialReadFromKNXBusOrFile()', sandbox)
    expect(instance.telegrams.map(telegram => telegram.grpaddr)).to.deep.equal(['1/5/0', '1/5/2'])
    instance.server.linkStatus = 'disconnected'
    sandbox.DoInitialReadFromKNXBusOrFile()
    expect(instance.telegrams).to.have.length(2)
    instance.server.linkStatus = 'connected'
    sandbox.DoInitialReadFromKNXBusOrFile()
    expect(instance.telegrams.map(telegram => telegram.grpaddr)).to.deep.equal(['1/5/0', '1/5/2', '1/5/0', '1/5/2'])
    global.clearInterval(instance.server.timerSaveExposedGAs)
    instance.close(node)
    expect(clock.pending.size).to.equal(0)
  })

  it('loads legacy SceneController values by the same ID and preserves them on an unchanged deploy', async () => {
    const instance = runtime()
    const id = 'legacy-saved-scene'
    const scenePath = path.join(instance.storage, 'scenecontroller', 'SceneController_' + id)
    fs.mkdirSync(path.dirname(scenePath), { recursive: true })
    fs.writeFileSync(scenePath, JSON.stringify([{ topic: '1/6/1', dpt: '1.001', send: 'true' }]))
    const config = () => ({ id, topic: '1/6/0', rules: [{ topic: '1/6/1', dpt: '1.001', send: 'false', devicename: 'Light' }] })
    const node = instance.create('scenecontroller', config())
    expect(node.isSceneController).to.equal(true)
    expect(instance.server.nodeClients).to.deep.equal([node])
    const recall = node.RecallScene(true)
    expect(instance.telegrams[0]).to.include({ grpaddr: '1/6/1', payload: 'true' })
    clock.run(node.timerWait)
    await recall
    expect(node.sent[0]).to.deep.equal({ savescene: false, recallscene: true, savevalue: false, disabled: false })
    node.rules[0].currentPayload = false
    node.SaveScene(true)
    expect(JSON.parse(fs.readFileSync(scenePath, 'utf8'))[0].send).to.equal('false')
    instance.close(node)

    const unchanged = config()
    unchanged.rules[0].devicename = 'Renamed light'
    const restored = instance.create('scenecontroller', unchanged)
    expect(fs.existsSync(scenePath)).to.equal(true)
    expect(JSON.parse(fs.readFileSync(scenePath, 'utf8'))[0].send).to.equal('false')
    const repeat = restored.RecallScene(true)
    expect(instance.telegrams.at(-1).payload).to.equal('false')
    clock.run(restored.timerWait)
    await repeat
    instance.close(restored)
    expect(clock.pending.size).to.equal(0)
  })

  it('invalidates a saved scene only when deployed rules change and uses the new configured values', async () => {
    const instance = runtime()
    const id = 'edited-saved-scene'
    const config = { id, rules: [{ topic: '1/6/1', dpt: '1.001', send: 'false' }] }
    const node = instance.create('scenecontroller', JSON.parse(JSON.stringify(config)))
    node.rules[0].currentPayload = true
    node.SaveScene(true)
    const scenePath = path.join(instance.storage, 'scenecontroller', 'SceneController_' + id)
    expect(JSON.parse(fs.readFileSync(scenePath, 'utf8'))[0].send).to.equal('true')
    instance.close(node)
    config.rules[0].send = '0'
    const changed = instance.create('scenecontroller', config)
    expect(fs.existsSync(scenePath)).to.equal(false)
    const recall = changed.RecallScene(true)
    expect(instance.telegrams[0]).to.include({ grpaddr: '1/6/1', payload: '0' })
    clock.run(changed.timerWait)
    await recall
  })

  it('cancels all concurrent SceneController waits without sending after close', async () => {
    const instance = runtime()
    const node = instance.create('scenecontroller', {
      rules: [{ topic: 'wait', send: '2s' }, { topic: '1/6/1', dpt: '1.001', send: 'true' }]
    })
    const first = node.RecallScene(true)
    const second = node.RecallScene(true)
    expect(clock.pending.size).to.equal(2)
    instance.close(node)
    await Promise.all([first, second])
    expect(instance.telegrams).to.deep.equal([])
    expect(node.sent).to.deep.equal([])
    expect(instance.server.nodeClients).to.deep.equal([])
    expect(clock.pending.size).to.equal(0)
  })

  it('executes a SceneController wait before the next telegram and then emits completion', async () => {
    const instance = runtime()
    const node = instance.create('scenecontroller', {
      rules: [{ topic: 'wait', send: '2s' }, { topic: '1/6/1', dpt: '1.001', send: 'true' }]
    })
    const recall = node.RecallScene(true)
    expect(instance.telegrams).to.deep.equal([])
    expect(clock.pending.get(node.timerWait).delay).to.equal(2000)
    clock.run(node.timerWait)
    await new Promise(resolve => setImmediate(resolve))
    expect(instance.telegrams[0]).to.include({ grpaddr: '1/6/1', payload: 'true' })
    expect(node.sent).to.deep.equal([])
    clock.run(node.timerWait)
    await recall
    expect(node.sent[0]).to.include({ recallscene: true, disabled: false })
    instance.close(node)
    expect(clock.pending.size).to.equal(0)
  })
})
