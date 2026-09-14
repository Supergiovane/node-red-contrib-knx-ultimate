const { expect } = require('chai')
const { EventEmitter } = require('events')
const fs = require('fs')
const os = require('os')
const path = require('path')

const registerViewer = require('../nodes/knxUltimateViewer')

function fixture () {
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'knx-viewer-runtime-'))
  const routes = new Map()
  const registrations = []
  const middleware = []
  const nodes = []
  const server = {
    id: 'gateway', name: 'Test gateway', nodeClients: [],
    knxConnection: { commandQueue: [] },
    addClient: node => server.nodeClients.push(node),
    removeClient: node => { server.nodeClients = server.nodeClients.filter(client => client !== node) }
  }
  const RED = {
    settings: { userDir },
    auth: { needsPermission: permission => permission },
    httpAdmin: {
      use: (...args) => middleware.push(args),
      get: (url, permission, handler) => {
        expect(routes.has(url)).to.equal(false)
        routes.set(url, { permission, handler })
      }
    },
    nodes: {
      registerType: (type, Constructor) => registrations.push({ type, Constructor }),
      getNode: id => id === server.id ? server : undefined,
      createNode: (node, config) => {
        node.id = config.id
        node.sent = []
        node.statuses = []
        node.warnings = []
        const emitter = new EventEmitter()
        node.on = emitter.on.bind(emitter)
        node.emit = emitter.emit.bind(emitter)
        node.listenerCount = emitter.listenerCount.bind(emitter)
        node.send = msg => node.sent.push(msg)
        node.status = status => node.statuses.push(status)
        node.warn = error => node.warnings.push(String(error))
        nodes.push(node)
      }
    }
  }
  registerViewer(RED)
  const create = (config = {}) => new registrations[0].Constructor({ id: 'viewer', name: 'Viewer', server: server.id, ...config })
  const close = node => new Promise(resolve => {
    if (node.closed || !node.listenerCount('close')) { node.closed = true; resolve(); return }
    node.emit('close', () => { node.closed = true; resolve() })
  })
  const request = async (url, query = {}) => {
    const response = {
      code: 200, headers: {},
      status (code) { this.code = code; return this },
      set (name, value) { this.headers[name] = value; return this },
      json (data) { this.data = data; return this }
    }
    await routes.get(url).handler({ query }, response)
    return response
  }
  const cleanup = async () => {
    await Promise.all(nodes.map(close))
    fs.rmSync(userDir, { recursive: true, force: true })
  }
  return { RED, server, routes, registrations, middleware, create, close, request, cleanup, userDir }
}

const telegram = (payload, extra = {}) => ({
  payload,
  devicename: 'Hall light',
  payloadmeasureunit: 'unknown',
  knx: { destination: '1/2/3', source: '1.1.10', dpt: '1.001', event: 'GroupValue_Write', rawValue: Buffer.from([payload ? 1 : 0]), ...extra }
})

describe('KNX Viewer persisted monitor runtime', () => {
  const fixtures = []
  const createFixture = () => { const instance = fixture(); fixtures.push(instance); return instance }
  afterEach(async () => { await Promise.all(fixtures.splice(0).map(instance => instance.cleanup())) })

  it('registers read-protected routes once per RED runtime and isolates Viewer instances', async () => {
    const first = createFixture()
    const second = createFixture()
    registerViewer(first.RED)
    first.create()
    expect(first.middleware).to.have.length(1)
    for (const route of ['/knxUltimateViewer/history', '/knxUltimateViewer/state', '/knxUltimateViewer/nodes']) {
      expect(first.routes.get(route).permission).to.equal('knxUltimate-config.read')
    }
    expect((await first.request('/knxUltimateViewer/nodes')).data.nodes.map(node => node.id)).to.deep.equal(['viewer'])
    expect((await second.request('/knxUltimateViewer/nodes')).data.nodes).to.deep.equal([])
  })

  it('logs only first values and state changes while preserving all three flow outputs', async () => {
    const instance = createFixture()
    const node = instance.create()
    expect(instance.server.nodeClients).to.deep.equal([node])
    expect(node).to.include({ notifyreadrequest: true, notifyresponse: true, notifywrite: true, listenallga: true })
    node.handleSend(telegram(false))
    node.handleSend(telegram(false, { event: 'GroupValue_Response', source: '1.1.11' }))
    node.handleSend(telegram(true, { source: '1.1.12' }))
    const response = await instance.request('/knxUltimateViewer/history', { nodeId: node.id })
    expect(response.code).to.equal(200)
    expect(response.headers['Cache-Control']).to.equal('no-store')
    expect(response.data.retentionHours).to.equal(24)
    expect(response.data.node).to.include({ id: node.id, gatewayId: 'gateway' })
    expect(response.data.entries.map(entry => entry.payload)).to.deep.equal([true, false])
    expect(response.data.entries[0]).to.include({ address: '1/2/3', source: '1.1.12', dpt: '1.001', previousPayloadText: 'false', payloadText: 'true' })
    expect(response.data.entries[1].previousPayloadText).to.equal(null)
    expect(node.sent).to.have.length(3)
    expect(node.sent.every(outputs => outputs.length === 3)).to.equal(true)
    expect(node.sent[2][0].payload).to.include('<table>')
    expect(node.sent[2][1].payload[0]).to.include({ address: '1/2/3', payload: true })
    expect(node.sent[2][2].payload).to.include('Queue of outgoing telegrams')
  })

  it('ignores invalid addresses and snapshots values before queued disk writes', async () => {
    const instance = createFixture()
    const node = instance.create()
    node.handleSend(undefined)
    node.handleSend(telegram(false, { destination: 'invalid address' }))
    const message = telegram({ red: 10, green: 20, blue: 30 }, { dpt: '232.600', rawValue: undefined })
    node.handleSend(message)
    message.payload.red = 99
    const response = await instance.request('/knxUltimateViewer/history')
    expect(response.data.entries).to.have.length(1)
    expect(response.data.entries[0].payload).to.deep.equal({ red: 10, green: 20, blue: 30 })
  })

  it('records Read, Write and Response types without letting reads replace current GA values', async () => {
    const instance = createFixture()
    const node = instance.create()
    node.handleSend(telegram(false))
    const beforeRead = JSON.stringify(node.exposedGAs)
    node.handleSend(telegram(undefined, { event: 'GroupValue_Read', rawValue: null }))
    node.handleSend(telegram(undefined, { event: 'GroupValue_Read', rawValue: null }))
    expect(JSON.stringify(node.exposedGAs)).to.equal(beforeRead)
    expect(node.sent).to.have.length(1)
    node.handleSend(telegram(true, { event: 'GroupValue_Response' }))
    const response = await instance.request('/knxUltimateViewer/history')
    expect(response.data.entries.map(entry => entry.event)).to.deep.equal([
      'GroupValue_Response', 'GroupValue_Read', 'GroupValue_Read', 'GroupValue_Write'
    ])
    expect(response.data.entries[0]).to.include({ payload: true, previousPayloadText: 'false' })
    expect(response.data.entries[1]).to.include({ payload: null, payloadText: '', previousPayloadText: null, rawPayload: null })
    expect(node.sent).to.have.length(2)
    expect(node.exposedGAs[0].payload).to.equal(true)
    const reads = await instance.request('/knxUltimateViewer/history', { search: 'read' })
    expect(reads.data.entries).to.have.length(2)
    expect(reads.data.entries.every(entry => entry.event === 'GroupValue_Read')).to.equal(true)
  })

  it('flushes on close, reloads history under the same identity and ignores late callbacks', async () => {
    const instance = createFixture()
    const first = instance.create()
    first.handleSend(telegram(false))
    first.handleSend(telegram(true))
    await instance.close(first)
    expect(instance.server.nodeClients).to.deep.equal([])
    expect((await instance.request('/knxUltimateViewer/nodes')).data.nodes).to.deep.equal([])
    first.handleSend(telegram(false))
    const replacement = instance.create()
    replacement.handleSend(telegram(true))
    const result = await replacement.viewerHistory.query({})
    expect(result.entries.map(entry => entry.payload)).to.deep.equal([true, false])
    expect(instance.server.nodeClients).to.deep.equal([replacement])
  })

  it('validates Viewer identity and paging requests without falling back to another node', async () => {
    const instance = createFixture()
    const node = instance.create()
    node.handleSend(telegram(false))
    for (const endpoint of ['/knxUltimateViewer/history', '/knxUltimateViewer/state']) {
      expect((await instance.request(endpoint, { nodeId: 'unknown' })).code).to.equal(404)
    }
    for (const limit of [0, -1, 1001, 'invalid', 1.5]) {
      expect((await instance.request('/knxUltimateViewer/history', { limit })).code).to.equal(400)
    }
    expect((await instance.request('/knxUltimateViewer/history', { before: 'not-a-cursor' })).code).to.equal(400)
    const response = await instance.request('/knxUltimateViewer/history', { search: 'not present' })
    expect(response.data.entries).to.deep.equal([])
    const missing = instance.create({ id: 'missing-gateway', server: '' })
    expect(missing.viewerHistory).to.equal(undefined)
    expect((await instance.request('/knxUltimateViewer/nodes')).data.nodes).to.have.length(1)
  })
})
