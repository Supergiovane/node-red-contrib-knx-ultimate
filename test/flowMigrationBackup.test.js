const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const { download } = require('../resources/flowMigrationBackup')

function fixture (nodes = []) {
  const calls = []
  const timers = []
  const links = []
  const blobs = []
  const revoked = []
  const body = {
    appendChild: anchor => {
      links.push(anchor)
      anchor.parentNode = body
      calls.push('append')
    },
    removeChild: anchor => {
      links.splice(links.indexOf(anchor), 1)
      anchor.parentNode = null
      calls.push('remove')
    }
  }
  const anchor = {
    download: '',
    click: () => { calls.push('click') }
  }
  const environment = {
    Blob,
    URL: {
      createObjectURL: blob => {
        blobs.push(blob)
        calls.push('url')
        return 'blob:test-backup'
      },
      revokeObjectURL: url => { revoked.push(url) }
    },
    document: {
      body,
      createElement: tag => {
        expect(tag).to.equal('a')
        calls.push('anchor')
        return anchor
      }
    },
    setTimeout: (callback, delay) => {
      timers.push({ callback, delay })
      calls.push('timer')
    }
  }
  const RED = {
    nodes: {
      createCompleteNodeSet: options => {
        calls.push('export')
        expect(options).to.deep.equal({ credentials: false, includeModuleConfig: true })
        return nodes
      }
    }
  }
  return { RED, environment, anchor, body, blobs, revoked, calls, timers, links, nodes }
}

describe('Flow migration backup', function () {
  it('downloads a synchronous complete-flow snapshot with config, subflow, group, links and module metadata', async function () {
    const nodes = [
      { id: 'tab-1', type: 'tab', label: 'Main flow', env: [{ name: 'FLOOR', value: 'one', type: 'str' }] },
      { id: 'tab-2', type: 'tab', label: 'Other flow' },
      { id: 'group', type: 'group', z: 'tab-1', nodes: ['legacy'] },
      { id: 'legacy', type: 'knxUltimateAlerter', z: 'tab-1', g: 'group', server: 'knx-config', wires: [['subflow-instance']] },
      { id: 'knx-config', type: 'knxUltimate-config', name: 'Gateway', host: '192.0.2.1' },
      { id: 'subflow', type: 'subflow', in: [{ wires: [{ id: 'inside' }] }], out: [] },
      { id: 'inside', type: 'debug', z: 'subflow', wires: [] },
      { id: 'subflow-instance', type: 'subflow:subflow', z: 'tab-1', wires: [] },
      { id: 'link', type: 'link out', z: 'tab-2', links: ['legacy'], wires: [] },
      { id: 'global-config', type: 'global-config', modules: { 'node-red-contrib-knx-ultimate': '7.0.4' } }
    ]
    const backup = fixture(nodes)
    const when = new Date(2026, 8, 14, 15, 30, 7, 25)
    const result = download(backup.RED, { environment: backup.environment, kind: 'knx', now: when })
    expect(result).to.deep.equal({ filename: 'flows-backup-before-knx-conversion-2026-09-14_153007-025.json', nodeCount: nodes.length })
    expect(result).not.to.have.property('then')
    expect(backup.anchor).to.include({ href: 'blob:test-backup', download: result.filename, hidden: true })
    expect(backup.calls).to.deep.equal(['export', 'anchor', 'url', 'append', 'click', 'remove', 'timer'])
    expect(backup.blobs[0].type).to.equal('application/json;charset=utf-8')
    expect(await backup.blobs[0].text()).to.equal(JSON.stringify(nodes, null, 4))
    expect(backup.links).to.have.length(0)
    expect(backup.revoked).to.have.length(0)
    expect(backup.timers[0].delay).to.equal(30000)
    backup.timers[0].callback()
    expect(backup.revoked).to.deep.equal(['blob:test-backup'])
  })

  it('serializes before browser callbacks or subsequent conversion can mutate exported objects', async function () {
    const backup = fixture([{ id: 'old', type: 'knxUltimateHueLight', wires: [['next']], config: { mode: 'legacy' } }])
    const expected = JSON.stringify(backup.nodes, null, 4)
    backup.environment.document.createElement = () => {
      backup.nodes[0].config.mode = 'changed-during-download'
      return backup.anchor
    }
    download(backup.RED, { environment: backup.environment, kind: 'hue', now: new Date(2026, 0, 1, 0, 0, 0, 1) })
    backup.nodes[0].type = 'knxUltimateHueController'
    backup.nodes[0].wires[0].push('new-target')
    expect(await backup.blobs[0].text()).to.equal(expected)
    expect(backup.anchor.download).to.equal('flows-backup-before-hue-conversion-2026-01-01_000000-001.json')
  })

  it('does not mutate the node graph during export and supports an explicit document', async function () {
    const node = Object.freeze({ id: 'frozen-tab', type: 'tab' })
    const nodes = Object.freeze([node])
    const backup = fixture(nodes)
    const documentObject = backup.environment.document
    delete backup.environment.document
    download(backup.RED, { environment: backup.environment, documentObject, kind: 'knx' })
    expect(JSON.parse(await backup.blobs[0].text())).to.deep.equal(nodes)
  })

  it('exposes the same API in a plain browser script', function () {
    const backup = fixture()
    const context = { ...backup.environment }
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../resources/flowMigrationBackup.js'), 'utf8'), context)
    expect(context.KNXUltimateFlowMigrationBackup.download).to.be.a('function')
    context.KNXUltimateFlowMigrationBackup.download(backup.RED, { kind: 'hue' })
    expect(backup.calls).to.include('click')
  })

  it('throws before a click when browser or editor export capabilities are unavailable', function () {
    const removeCapabilities = [
      backup => { delete backup.RED.nodes.createCompleteNodeSet },
      backup => { delete backup.environment.Blob },
      backup => { delete backup.environment.URL.createObjectURL },
      backup => { delete backup.environment.URL.revokeObjectURL },
      backup => { delete backup.environment.setTimeout },
      backup => { delete backup.environment.document },
      backup => { delete backup.environment.document.body },
      backup => { delete backup.environment.document.createElement },
      backup => { delete backup.environment.document.body.appendChild },
      backup => { delete backup.anchor.click },
      backup => { delete backup.anchor.download }
    ]
    removeCapabilities.forEach(removeCapability => {
      const backup = fixture()
      removeCapability(backup)
      expect(() => download(backup.RED, { environment: backup.environment })).to.throw()
      expect(backup.calls).not.to.include('click')
      expect(backup.blobs).to.have.length(0)
      expect(backup.links).to.have.length(0)
    })
  })

  it('rejects malformed or unserializable exports without creating any browser resource', function () {
    const circular = { id: 'circular', type: 'debug' }
    circular.self = circular
    const invalidExports = [undefined, {}, '[]', [null], [false], [[]], [circular], [{ value: 1n }]]
    invalidExports.forEach(nodes => {
      const backup = fixture()
      backup.RED.nodes.createCompleteNodeSet = () => nodes
      expect(() => download(backup.RED, { environment: backup.environment })).to.throw()
      expect(backup.blobs).to.have.length(0)
      expect(backup.links).to.have.length(0)
    })
  })

  it('propagates export, Blob and object URL failures without clicking', function () {
    const fail = () => { throw new Error('injected failure') }
    const injections = [
      backup => { backup.RED.nodes.createCompleteNodeSet = fail },
      backup => { backup.environment.Blob = function () { fail() } },
      backup => { backup.environment.URL.createObjectURL = fail }
    ]
    injections.forEach(inject => {
      const backup = fixture()
      inject(backup)
      expect(() => download(backup.RED, { environment: backup.environment })).to.throw('injected failure')
      expect(backup.calls).not.to.include('click')
      expect(backup.links).to.have.length(0)
    })
  })

  it('removes the temporary link and releases its URL when the browser click throws', function () {
    const backup = fixture()
    backup.anchor.click = () => { throw new Error('download blocked') }
    expect(() => download(backup.RED, { environment: backup.environment })).to.throw('download blocked')
    expect(backup.links).to.have.length(0)
    backup.timers[0].callback()
    expect(backup.revoked).to.deep.equal(['blob:test-backup'])
  })

  it('releases the URL even when DOM cleanup fails, preserving the initial download failure', function () {
    const backup = fixture()
    backup.anchor.click = () => { throw new Error('initial failure') }
    backup.body.removeChild = () => { throw new Error('cleanup failure') }
    expect(() => download(backup.RED, { environment: backup.environment })).to.throw('initial failure')
    backup.timers[0].callback()
    expect(backup.revoked).to.deep.equal(['blob:test-backup'])
  })

  it('releases the URL immediately if delayed cleanup cannot be scheduled', function () {
    const backup = fixture()
    backup.environment.setTimeout = () => { throw new Error('timer failure') }
    expect(() => download(backup.RED, { environment: backup.environment })).to.throw('timer failure')
    expect(backup.links).to.have.length(0)
    expect(backup.revoked).to.deep.equal(['blob:test-backup'])
  })

  it('rejects invalid migration kinds and timestamps before starting a download', function () {
    const backup = fixture()
    expect(() => download(backup.RED, { environment: backup.environment, kind: '../unsafe' })).to.throw('kind')
    expect(() => download(backup.RED, { environment: backup.environment, now: NaN })).to.throw('timestamp')
    expect(backup.calls).not.to.include('click')
    expect(backup.blobs).to.have.length(0)
  })
})
