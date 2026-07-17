const { expect } = require('chai')
const assert = require('assert')
const fs = require('fs/promises')
const os = require('os')
const path = require('path')
const { exportMatterStorage, importMatterStorage } = require('../nodes/utils/matterStorageBackup')

describe('matterEnvironmentLock – withEnvironmentLock', () => {
  let withEnvironmentLock

  before(async () => {
    ({ withEnvironmentLock } = await import('../nodes/utils/matterEnvironmentLock.mjs'))
  })

  it('runs queued calls strictly one at a time, in FIFO order', async () => {
    const order = []
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    let active = 0
    let maxActive = 0

    const task = (label, ms) => withEnvironmentLock(async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await delay(ms)
      order.push(label)
      active--
    })

    // Start three overlapping tasks "concurrently": the lock must still run them in order,
    // one at a time, exactly like two Matter engines racing to set Environment.default.vars.
    await Promise.all([task('a', 30), task('b', 10), task('c', 5)])

    expect(order).to.deep.equal(['a', 'b', 'c'])
    expect(maxActive).to.equal(1)
  })

  it('keeps serializing later calls even after an earlier task throws', async () => {
    const results = []
    await withEnvironmentLock(async () => { throw new Error('boom') }).catch((error) => { results.push(`caught:${error.message}`) })
    await withEnvironmentLock(async () => { results.push('after-throw') })

    expect(results).to.deep.equal(['caught:boom', 'after-throw'])
  })
})

describe('Matter storage backup', () => {
  let root
  beforeEach(async () => { root = await fs.mkdtemp(path.join(os.tmpdir(), 'knxu-matter-backup-')) })
  afterEach(async () => { await fs.rm(root, { recursive: true, force: true }) })

  it('exports and restores one instance without touching another', async () => {
    await fs.mkdir(path.join(root, 'source', 'nested'), { recursive: true })
    await fs.writeFile(path.join(root, 'source', 'fabric.key'), Buffer.from([0, 1, 2, 255]))
    await fs.writeFile(path.join(root, 'source', 'nested', 'state'), 'paired')
    await fs.mkdir(path.join(root, 'other'), { recursive: true })
    await fs.writeFile(path.join(root, 'other', 'keep'), 'untouched')
    const backup = await exportMatterStorage({ storagePath: root, instanceId: 'source', kind: 'controller', protocolVersion: '1.5.1', packageVersion: '0.17.4' })
    await fs.mkdir(path.join(root, 'target'), { recursive: true })
    await fs.writeFile(path.join(root, 'target', 'obsolete'), 'remove')
    await importMatterStorage({ storagePath: root, instanceId: 'target', kind: 'controller', backup })
    expect(await fs.readFile(path.join(root, 'target', 'fabric.key'))).to.deep.equal(Buffer.from([0, 1, 2, 255]))
    expect(await fs.readFile(path.join(root, 'target', 'nested', 'state'), 'utf8')).to.equal('paired')
    await assert.rejects(fs.access(path.join(root, 'target', 'obsolete')))
    expect(await fs.readFile(path.join(root, 'other', 'keep'), 'utf8')).to.equal('untouched')
  })

  it('rejects the wrong config kind and unsafe paths', async () => {
    await assert.rejects(importMatterStorage({ storagePath: root, instanceId: 'x', kind: 'controller', backup: { format: 'knx-ultimate-matter-storage', version: 1, kind: 'bridge', files: [] } }), /not a controller/)
    await assert.rejects(importMatterStorage({ storagePath: root, instanceId: 'x', kind: 'controller', backup: { format: 'knx-ultimate-matter-storage', version: 1, kind: 'controller', files: [{ path: '../escape', content: '' }] } }), /Invalid Matter backup/)
  })
})
