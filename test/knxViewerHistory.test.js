const { expect } = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { createViewerHistory, HISTORY_TTL_MS } = require('../nodes/utils/knxViewerHistory')

const HOUR_MS = 60 * 60 * 1000

function historyFiles (directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? historyFiles(filename) : entry.name.endsWith('.jsonl') ? [filename] : []
  })
}

describe('KNX Viewer persistent state-change history', () => {
  let userDir
  let timestamp
  let stores
  let errors

  function create (options = {}) {
    const store = createViewerHistory({ userDir, nodeId: 'viewer', gatewayId: 'gateway', now: () => timestamp, onError: error => errors.push(error), ...options })
    stores.push(store)
    return store
  }

  function value (payload, options = {}) {
    return {
      address: '1/2/3', source: '1.1.20', dpt: '1.001', devicename: 'Kitchen light',
      payload, payloadText: String(payload), rawPayload: payload ? '01' : '00',
      payloadmeasureunit: '', event: 'GroupValue_Write', timestampMs: timestamp, ...options
    }
  }

  beforeEach(() => {
    userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'knx-viewer-history-'))
    timestamp = Date.parse('2026-09-14T12:30:00Z')
    stores = []
    errors = []
  })

  afterEach(async () => {
    await Promise.all(stores.map(store => store.close()))
    fs.rmSync(userDir, { recursive: true, force: true })
  })

  it('records the first observation and real changes, preserving useful telegram fields', async () => {
    const store = create()
    const first = await store.record(value(false))
    expect(first).to.include({ address: '1/2/3', source: '1.1.20', dpt: '1.001', payloadText: 'false', previousPayloadText: null })
    expect(first.timestamp).to.equal('2026-09-14T12:30:00.000Z')
    expect(first.timestampMs).to.equal(timestamp)
    expect(await store.record(value(false, { source: '1.1.21', event: 'GroupValue_Response' }))).to.equal(null)
    const changed = await store.record(value(true))
    expect(changed.previousPayloadText).to.equal('false')
    expect(changed.id).not.to.equal(first.id)
    expect((await store.query()).entries.map(entry => entry.payload)).to.deep.equal([true, false])
    expect(errors).to.have.length(0)
  })

  it('persists every read without creating or replacing a GA state, including after restart', async () => {
    const store = create()
    const read = () => store.record(value('must not become a state', { event: 'GroupValue_Read', payloadmeasureunit: '°C' }))
    const firstRead = await read()
    expect(firstRead).to.include({ event: 'GroupValue_Read', payload: null, payloadText: '', previousPayloadText: null, rawPayload: null, payloadmeasureunit: '' })
    const firstValue = await store.record(value(false))
    expect(firstValue.previousPayloadText).to.equal(null)
    await read()
    await read()
    expect(await store.record(value(false))).to.equal(null)
    await store.close()
    const restored = create()
    expect((await restored.query({ search: 'read' })).entries).to.have.length(3)
    expect(await restored.record(value(false, { event: 'GroupValue_Response' }))).to.equal(null)
    const changed = await restored.record(value(true, { event: 'GroupValue_Response' }))
    expect(changed).to.include({ event: 'GroupValue_Response', previousPayloadText: 'false' })
    expect((await restored.query()).entries).to.have.length(5)
  })

  it('compares structured payloads canonically, including Buffers and DPT interpretation', async () => {
    const store = create()
    await store.record(value({ b: 2, a: { y: 1, x: 0 } }))
    expect(await store.record(value({ a: { x: 0, y: 1 }, b: 2 }))).to.equal(null)
    expect(await store.record(value({ a: { x: 1, y: 1 }, b: 2 }))).not.to.equal(null)
    await store.record(value(Buffer.from([1, 2])))
    expect(await store.record(value({ type: 'Buffer', data: [1, 2] }))).to.equal(null)
    expect(await store.record(value(Buffer.from([1, 2]), { dpt: '5.001' }))).not.to.equal(null)
    expect((await store.query()).entries).to.have.length(4)
  })

  it('snapshots queued payloads before the caller can reuse the original object', async () => {
    const store = create()
    const message = value({ brightness: 25, raw: Buffer.from([25]) })
    const pending = store.record(message)
    message.payload.brightness = 50
    message.payload.raw[0] = 50
    message.address = '9/9/9'
    expect((await pending).payload).to.deep.equal({ brightness: 25, raw: { data: [25], type: 'Buffer' } })
    expect((await store.query()).entries[0].address).to.equal('1/2/3')
  })

  it('restores stable IDs and duplicate detection across restart', async () => {
    const original = create()
    const first = await original.record(value(false))
    const second = await original.record(value(true))
    await original.close()
    const restored = create()
    await restored.ready
    expect((await restored.query()).entries.map(entry => entry.id)).to.deep.equal([second.id, first.id])
    expect(await restored.record(value(true))).to.equal(null)
    const third = await restored.record(value(false))
    expect(third.previousPayloadText).to.equal('true')
    expect((await restored.query()).entries.map(entry => entry.id)).to.deep.equal([third.id, second.id, first.id])
  })

  it('isolates each node and gateway and safely encodes arbitrary identifiers', async () => {
    const primary = create({ nodeId: '../../outside', gatewayId: '../gateway' })
    const gateway = create({ nodeId: '../../outside', gatewayId: 'different' })
    const node = create({ nodeId: 'different', gatewayId: '../gateway' })
    await primary.record(value(true))
    expect((await gateway.query()).entries).to.have.length(0)
    expect((await node.query()).entries).to.have.length(0)
    expect(historyFiles(userDir)).to.have.length(1)
    expect(historyFiles(userDir)[0]).to.include(path.join(userDir, 'knxultimatestorage', 'viewer'))
  })

  it('recovers a truncated last line before appending after a crash', async () => {
    const first = create()
    const saved = await first.record(value(false))
    await first.close()
    const filename = historyFiles(userDir)[0]
    fs.appendFileSync(filename, '{"id":"incomplete","payload":')
    const abandonedCompaction = `${filename}.12345678-abcd.tmp`
    fs.writeFileSync(abandonedCompaction, 'expired data from an interrupted compaction')
    const restored = create()
    const changed = await restored.record(value(true))
    expect((await restored.query()).entries.map(entry => entry.id)).to.deep.equal([changed.id, saved.id])
    expect(fs.readFileSync(filename, 'utf8').trim().split('\n').map(line => JSON.parse(line))).to.have.length(2)
    expect(fs.existsSync(abandonedCompaction)).to.equal(false)
  })

  it('keeps all changes in the window and prunes only expired entries within an hourly file', async () => {
    const store = create()
    const cutoff = timestamp - HISTORY_TTL_MS
    await store.record(value(false, { timestampMs: cutoff }))
    await store.record(value(true, { timestampMs: cutoff + 5 * 60 * 1000 }))
    await store.record(value(false))
    expect(await store.record(value(true, { timestampMs: cutoff - 1 }))).to.equal(null)
    timestamp += 60 * 1000
    const result = await store.query()
    expect(result.entries.map(entry => entry.timestampMs)).to.deep.equal([timestamp - 60 * 1000, cutoff + 5 * 60 * 1000])
    const persisted = historyFiles(userDir).flatMap(filename => fs.readFileSync(filename, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse))
    expect(persisted.map(entry => entry.timestampMs)).not.to.include(cutoff)
    expect(result.from).to.equal(new Date(timestamp - HISTORY_TTL_MS).toISOString())
  })

  it('prunes while idle, expires duplicate state, and cancels maintenance at close', async () => {
    const originalSet = global.setInterval
    const originalClear = global.clearInterval
    let callback
    const token = { unref () {} }
    let cleared = false
    global.setInterval = fn => { callback = fn; return token }
    global.clearInterval = id => { if (id === token) cleared = true }
    try {
      const store = create()
      await store.record(value(false))
      timestamp += HISTORY_TTL_MS + HOUR_MS
      callback()
      await store.close()
      expect(historyFiles(userDir)).to.have.length(0)
      expect(cleared).to.equal(true)
      const restored = create()
      expect((await restored.record(value(false))).previousPayloadText).to.equal(null)
      await restored.close()
    } finally {
      global.setInterval = originalSet
      global.clearInterval = originalClear
    }
  })

  it('returns exact-cutoff history even before the next scheduled physical prune', async () => {
    const store = create()
    await store.record(value(false, { timestampMs: timestamp - HISTORY_TTL_MS }))
    timestamp++
    expect((await store.query()).entries).to.have.length(0)
  })

  it('orders delayed entries and same-millisecond changes and paginates without duplicates', async () => {
    const store = create()
    const expected = []
    for (const offset of [-HOUR_MS, -50, -100, 0, 0, -2 * HOUR_MS]) {
      expected.push(await store.record(value(expected.length, { timestampMs: timestamp + offset })))
    }
    expected.sort((a, b) => b.timestampMs - a.timestampMs || b.id.localeCompare(a.id))
    const first = await store.query({ limit: 2 })
    expect(first.hasMore).to.equal(true)
    timestamp++
    await store.record(value('new since first page'))
    const second = await store.query({ limit: 2, before: first.nextCursor })
    const third = await store.query({ limit: 2, before: second.nextCursor })
    expect([...first.entries, ...second.entries, ...third.entries].map(entry => entry.id)).to.deep.equal(expected.map(entry => entry.id))
    expect(third.hasMore).to.equal(false)
    expect(third.nextCursor).to.equal('')
  })

  it('filters across the full window using address, description, value, source, DPT and raw data', async () => {
    const store = create()
    await store.record(value(false, { timestampMs: timestamp - 10 * HOUR_MS, devicename: 'Basement', payloadText: 'Armed', rawPayload: 'cafe' }))
    for (let i = 0; i < 5; i++) await store.record(value(i, { address: '2/0/1', source: '2.2.2', dpt: '9.001', devicename: 'Current', rawPayload: 'other' }))
    for (const search of ['1/2/3', 'BASEMENT', 'armed', '1.1.20', '1.001', 'cafe']) {
      const result = await store.query({ search, limit: 1 })
      expect(result.entries, search).to.have.length(1)
      expect(result.entries[0].devicename).to.equal('Basement')
      expect(result.hasMore).to.equal(false)
    }
    expect((await store.query({ search: 'absent' })).entries).to.have.length(0)
  })

  it('rejects invalid or mismatched cursors and never restarts an expired page', async () => {
    const store = create()
    await store.record(value(false))
    await store.record(value(true))
    const first = await store.query({ limit: 1 })
    for (const options of [{ before: 'invalid' }, { before: first.nextCursor, search: 'different' }]) {
      try {
        await store.query(options)
        throw new Error('Expected invalid cursor')
      } catch (error) { expect(error.code).to.equal('INVALID_CURSOR') }
    }
    const other = create({ gatewayId: 'other' })
    try {
      await other.query({ before: first.nextCursor })
      throw new Error('Expected invalid cursor')
    } catch (error) { expect(error.code).to.equal('INVALID_CURSOR') }
    timestamp += HISTORY_TTL_MS + 1
    await store.record(value('new day'))
    expect((await store.query({ before: first.nextCursor })).entries).to.have.length(0)
  })

  it('bounds page size without imposing a cap on retained history', async () => {
    const store = create()
    await Promise.all(Array.from({ length: 1005 }, (_, i) => store.record(value(i))))
    const first = await store.query({ limit: 1000000 })
    expect(first.entries).to.have.length(1000)
    expect(first.hasMore).to.equal(true)
    expect((await store.query({ limit: 1000000, before: first.nextCursor })).entries).to.have.length(5)
    expect((await store.query({ limit: -1 })).entries).to.have.length(200)
  })

  it('reads only the current file tail for an ordered live page, including after restart', async () => {
    const original = create()
    await Promise.all(Array.from({ length: 400 }, (_, i) => original.record(value(i, { devicename: 'Room '.repeat(150) }))))
    await original.close()
    const store = create()
    await store.ready
    const totalBytes = historyFiles(userDir).reduce((total, filename) => total + fs.statSync(filename).size, 0)
    const originalOpen = fs.promises.open
    let bytesRead = 0
    fs.promises.open = async (...args) => {
      const handle = await originalOpen.apply(fs.promises, args)
      if (args[1] === 'r') {
        const read = handle.read.bind(handle)
        handle.read = async (...readArgs) => {
          const result = await read(...readArgs)
          bytesRead += result.bytesRead
          return result
        }
      }
      return handle
    }
    try {
      const page = await store.query({ limit: 5 })
      expect(page.entries.map(entry => entry.payload)).to.deep.equal([399, 398, 397, 396, 395])
      expect(page.hasMore).to.equal(true)
      expect(bytesRead).to.be.lessThan(totalBytes / 2)
      expect(bytesRead).to.be.at.most(64 * 1024)
    } finally { fs.promises.open = originalOpen }
  })

  it('reports file errors without an unhandled rejection and retries after storage is repaired', async () => {
    fs.writeFileSync(path.join(userDir, 'knxultimatestorage'), 'blocked')
    const store = create({ onError: error => { errors.push(error); throw new Error('broken logger') } })
    await store.ready
    expect(await store.record(value(false))).to.equal(null)
    expect((await store.query()).storageError).to.be.a('string')
    expect(errors).to.have.length.greaterThan(0)
    fs.unlinkSync(path.join(userDir, 'knxultimatestorage'))
    expect(await store.record(value(false))).not.to.equal(null)
    expect((await store.query()).storageError).to.equal(null)
  })

  it('repairs a partial failed append and does not mark the lost value as recorded', async () => {
    const store = create()
    await store.record(value(false))
    const original = fs.promises.appendFile
    fs.promises.appendFile = async (filename, content, options) => {
      await original.call(fs.promises, filename, content.slice(0, 30), options)
      throw new Error('disk full')
    }
    try { expect(await store.record(value(true))).to.equal(null) } finally { fs.promises.appendFile = original }
    expect(await store.record(value(true))).not.to.equal(null)
    expect((await store.query()).entries.map(entry => entry.payload)).to.deep.equal([true, false])
  })

  it('waits for accepted writes and rejects records submitted after close', async () => {
    const store = create()
    const accepted = Array.from({ length: 20 }, (_, i) => store.record(value(i)))
    const closed = store.close()
    expect(store.close()).to.equal(closed)
    expect(await store.record(value('too late'))).to.equal(null)
    await closed
    expect((await Promise.all(accepted)).filter(Boolean)).to.have.length(20)
    const restored = create()
    expect((await restored.query()).entries).to.have.length(20)
  })

  it('keeps a stable read snapshot while writes and expiry continue independently', async () => {
    const store = create()
    const first = await store.record(value(false))
    const originalOpen = fs.promises.open
    let enterRead
    let releaseRead
    const entered = new Promise(resolve => { enterRead = resolve })
    const gate = new Promise(resolve => { releaseRead = resolve })
    let blocked = false
    let timeout
    fs.promises.open = async (...args) => {
      const handle = await originalOpen.apply(fs.promises, args)
      if (args[1] === 'r' && !blocked) {
        blocked = true
        const read = handle.read.bind(handle)
        handle.read = async (...readArgs) => { enterRead(); await gate; return read(...readArgs) }
      }
      return handle
    }
    let page
    try {
      page = store.query()
      await entered
      timestamp += HISTORY_TTL_MS + HOUR_MS
      const current = await Promise.race([
        store.record(value(true)),
        new Promise((resolve, reject) => { timeout = setTimeout(() => reject(new Error('Query blocked a new write')), 250) })
      ])
      clearTimeout(timeout)
      expect(current.payload).to.equal(true)
      expect(historyFiles(userDir)).to.have.length(1)
      releaseRead()
      expect((await page).entries.map(entry => entry.id)).to.deep.equal([first.id])
      expect((await store.query()).entries.map(entry => entry.id)).to.deep.equal([current.id])
    } finally {
      clearTimeout(timeout)
      releaseRead()
      fs.promises.open = originalOpen
      if (page) await page
    }
  })
})
