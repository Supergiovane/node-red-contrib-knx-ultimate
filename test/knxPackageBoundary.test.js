const { expect } = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const vm = require('vm')
const { createRequire } = require('module')
const { EventEmitter } = require('events')
const knx = require('knxultimate')
const pkg = require('../package.json')

const publicTypes = ['knxUltimate', 'knxUltimateUtility', 'knxUltimateViewer', 'knxUltimateIoTBridge', 'knxUltimateMultiRouting', 'knxUltimateRouterFilter', 'knxUltimate-config']

describe('KNX-only package and external integration', () => {
  it('ships only the current KNX nodes and examples that use registered types', () => {
    expect(Object.keys(pkg['node-red'].nodes)).to.have.members(publicTypes)
    const builtins = new Set(['tab', 'group', 'inject', 'debug', 'function', 'comment', 'delay', 'switch', 'change', 'catch', 'status', 'link in', 'link out', 'modbus-flex-getter', 'modbus-flex-write', 'modbus-client'])
    for (const file of fs.readdirSync(path.join(__dirname, '../examples'))) {
      if (!file.endsWith('.json')) continue
      const flow = require('../examples/' + file)
      for (const node of flow) expect(publicTypes.includes(node.type) || builtins.has(node.type), `${file}: ${node.type}`).to.equal(true)
    }
    for (const name of ['@matter/main', '@matter/nodejs', '@project-chip/matter.js', 'simple-get', 'google-translate-tts', 'js-yaml']) {
      expect(pkg.dependencies).not.to.have.property(name)
    }
  })

  it('serves ETS addresses and DPTs to external editors without Hue/Matter endpoints', () => {
    const routes = new Map()
    const events = new EventEmitter()
    const csv = [{ ga: '1/1/1', dpt: '1.001', devicename: 'Light' }]
    const RED = {
      events,
      plugins: { registerPlugin: (_id, plugin) => plugin.onadd() },
      auth: { needsPermission: () => (_req, _res, next) => next() },
      httpAdmin: { get: (url, ...handlers) => routes.set(url, handlers.at(-1)) },
      nodes: { getNode: () => ({ id: 'gateway', csv }) },
      log: { error: () => {} }
    }
    require('../nodes/commonFunctions')(RED)
    events.emit('registry:plugin-added', 'commonFunctions')
    const result = {}
    const response = { json: value => { result.value = value } }
    routes.get('/knxUltimatecsv')({ query: { nodeID: 'gateway' } }, response)
    expect(result.value).to.equal(csv)
    routes.get('/knxUltimateDpts')({ query: {} }, response)
    expect(result.value.some(dpt => dpt.value === '1.001')).to.equal(true)
    expect([...routes.keys()].some(url => /hue|matter/i.test(url))).to.equal(false)
  })

  it('exchanges telegrams with external client types through the real gateway runtime', async () => {
    const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'knx8-gateway-'))
    const clients = new Map()
    const writes = []
    class TestClient extends EventEmitter {
      Connect () { this.emit(knx.KNXClientEvents.connected, {}) }
      async Disconnect () {}
      write (...args) { writes.push(args) }
      getCurrentItemHandledByTheQueue () { return '' }
    }
    const filename = path.join(__dirname, '../nodes/knxUltimate-config.js')
    const localRequire = createRequire(filename)
    const module = { exports: {} }
    const timers = new Set()
    const makeTimer = () => { const timer = {}; timers.add(timer); return timer }
    vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
      module, exports: module.exports, console, Buffer, process,
      require: name => name === 'knxultimate' ? { ...knx, KNXClient: TestClient } : localRequire(name),
      setTimeout: makeTimer, setInterval: makeTimer,
      clearTimeout: timer => timers.delete(timer), clearInterval: timer => timers.delete(timer)
    }, { filename })
    let Gateway
    const RED = {
      settings: { userDir },
      log: { info: () => {}, error: () => {} },
      nodes: {
        registerType: (_type, constructor) => { Gateway = constructor },
        getNode: id => clients.get(id),
        createNode: node => {
          const events = new EventEmitter()
          Object.assign(node, { id: 'gateway', type: 'knxUltimate-config', credentials: {}, on: events.on.bind(events), emit: events.emit.bind(events), error: () => {} })
        }
      }
    }
    module.exports(RED)
    const gateway = new Gateway({ host: '127.0.0.1', port: 3671, physAddr: '1.1.250', hostProtocol: 'TunnelUDP', autoReconnect: 'no', loglevel: 'disable', csv: '' })
    try {
      for (const type of ['hueUltimateController', 'matterUltimateController', 'matterUltimateBridge']) {
        const received = []
        const client = { id: type, type, listenallga: true, notifywrite: true, notifyresponse: true, notifyreadrequest: true, setNodeStatus: () => {}, handleSend: msg => received.push(msg), received }
        clients.set(type, client)
        gateway.addClient(client)
      }
      await gateway.initKNXConnection()
      expect(gateway.linkStatus).to.equal('connected')
      for (const event of ['Write', 'Response', 'Read']) {
        gateway.knxConnection.emit(knx.KNXClientEvents.indication, {
          cEMIMessage: {
            control: { repeat: 1 },
            srcAddress: { toString: () => '1.1.1' }, dstAddress: { toString: () => '1/1/1' },
            npdu: { dataValue: event === 'Read' ? null : Buffer.from([1]), isGroupWrite: event === 'Write', isGroupResponse: event === 'Response', isGroupRead: event === 'Read' }
          }
        }, false)
      }
      for (const client of clients.values()) {
        expect(client.received.map(msg => msg.knx.event), client.type).to.deep.equal(['GroupValue_Write', 'GroupValue_Response', 'GroupValue_Read'])
        expect(Buffer.from(client.received[0].knx.rawValue)).to.deep.equal(Buffer.from([1]))
        await gateway.sendKNXTelegramToKNXEngine({ grpaddr: '1/1/2', payload: true, dpt: '1.001', outputtype: 'write', nodecallerid: client.id })
      }
      expect(writes).to.have.length(3)
      expect(writes[0]).to.deep.equal(['1/1/2', true, '1.001'])
      for (const client of clients.values()) await gateway.removeClient(client)
      expect(gateway.nodeClients).to.have.length(0)
    } finally {
      await new Promise(resolve => gateway.emit('close', resolve))
      fs.rmSync(userDir, { recursive: true, force: true })
    }
  })
})
