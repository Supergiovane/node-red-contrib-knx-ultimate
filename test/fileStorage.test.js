const { expect } = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const {
  createFileStorage,
  storageOf,
  resolveSettings,
  directStorage,
  MAX_PENDING_APPEND_BYTES
} = require('../nodes/utils/fileStorage')

describe('File Cache Control storage', () => {
  let directory
  let storages
  let timers
  let originalSetInterval
  let originalClearInterval
  let gatewayId = 0

  // Data is handed over by gateway ID: every test uses its own gateway.
  function create (options = {}) {
    const storage = createFileStorage({ ownerId: 'gateway-' + gatewayId, ...options })
    storages.push(storage)
    return storage
  }

  async function readSnapshot (storage, filePath) {
    const snapshot = await storage.openSnapshot(filePath)
    try {
      const buffer = Buffer.alloc(snapshot.size)
      // Read in small pieces, so reads cross the disk/memory boundary.
      for (let position = 0; position < snapshot.size; position += 3) {
        await snapshot.read(buffer, position, Math.min(3, snapshot.size - position), position)
      }
      return buffer.toString('utf8')
    } finally {
      await snapshot.close()
    }
  }

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'knx-file-storage-'))
    gatewayId++
    storages = []
    timers = []
    originalSetInterval = global.setInterval
    originalClearInterval = global.clearInterval
    global.setInterval = (callback, delay) => {
      const timer = { callback, delay, cleared: false, unref () {} }
      timers.push(timer)
      return timer
    }
    global.clearInterval = timer => { if (timer) timer.cleared = true }
  })

  afterEach(() => {
    storages.forEach(storage => storage.close())
    global.setInterval = originalSetInterval
    global.clearInterval = originalClearInterval
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('resolves the disk-wearing modes and clamps the custom interval between 5 seconds and 30 days', () => {
    expect(resolveSettings({})).to.deep.equal({ mode: 'freshness', intervalMs: 5000 })
    expect(resolveSettings({ mode: 'unknown' })).to.deep.equal({ mode: 'freshness', intervalMs: 5000 })
    expect(resolveSettings({ mode: 'balanced' })).to.deep.equal({ mode: 'balanced', intervalMs: 0 })
    expect(resolveSettings({ mode: 'disabled' })).to.deep.equal({ mode: 'disabled', intervalMs: 0 })
    expect(resolveSettings({ mode: 'custom', interval: 1, intervalUnit: 's' }).intervalMs).to.equal(5000)
    expect(resolveSettings({ mode: 'custom', interval: 15, intervalUnit: 'm' }).intervalMs).to.equal(15 * 60 * 1000)
    expect(resolveSettings({ mode: 'custom', interval: 48, intervalUnit: 'h' }).intervalMs).to.equal(48 * 60 * 60 * 1000)
    expect(resolveSettings({ mode: 'custom', interval: 30, intervalUnit: 'd' }).intervalMs).to.equal(30 * 24 * 60 * 60 * 1000)
    expect(resolveSettings({ mode: 'custom', interval: 31, intervalUnit: 'd' }).intervalMs).to.equal(30 * 24 * 60 * 60 * 1000)
    expect(resolveSettings({ mode: 'custom', interval: 'abc' }).intervalMs).to.equal(10 * 60 * 1000)
    // Missing values, as in gateways saved by older versions: 10 minutes, like the editor default.
    expect(resolveSettings({ mode: 'custom' }).intervalMs).to.equal(10 * 60 * 1000)
    expect(resolveSettings({ mode: 'custom', interval: null, intervalUnit: null }).intervalMs).to.equal(10 * 60 * 1000)
    expect(resolveSettings({ mode: 'custom', interval: '', intervalUnit: 'h' }).intervalMs).to.equal(10 * 60 * 1000)
    expect(resolveSettings({ mode: 'custom', interval: 10 }).intervalMs).to.equal(10 * 60 * 1000)
    expect(resolveSettings({ mode: null }).mode).to.equal('freshness')
  })

  it('commits freshness changes every 5 seconds, serializing lazy data only when committing', () => {
    const storage = create({ mode: 'freshness' })
    expect(timers.map(timer => timer.delay)).to.deep.equal([5000])
    const filePath = path.join(directory, 'nested', 'values.json')
    let serialized = 0
    const values = [1]
    storage.writeFile(filePath, () => { serialized++; return JSON.stringify(values) })
    values.push(2)
    expect(fs.existsSync(filePath)).to.equal(false)
    expect(storage.exists(filePath)).to.equal(true)
    expect(JSON.parse(storage.readFile(filePath, 'utf8'))).to.deep.equal([1, 2])
    timers[0].callback()
    expect(JSON.parse(fs.readFileSync(filePath, 'utf8'))).to.deep.equal([1, 2])
    // Nothing changed: the next tick writes nothing.
    fs.rmSync(filePath)
    timers[0].callback()
    expect(fs.existsSync(filePath)).to.equal(false)
    expect(serialized).to.equal(2)
  })

  it('commits balanced changes only on gateway connection events and on close', () => {
    const storage = create({ mode: 'balanced' })
    expect(timers).to.have.length(0)
    const first = path.join(directory, 'first.json')
    const second = path.join(directory, 'second.json')
    storage.writeFile(first, 'one')
    expect(fs.existsSync(first)).to.equal(false)
    storage.handleGatewayEvent()
    expect(fs.readFileSync(first, 'utf8')).to.equal('one')
    storage.writeFile(second, 'two')
    expect(fs.existsSync(second)).to.equal(false)
    storage.close()
    expect(fs.readFileSync(second, 'utf8')).to.equal('two')
    // After the close, late writes are committed at once.
    storage.writeFile(second, 'late')
    expect(fs.readFileSync(second, 'utf8')).to.equal('late')
  })

  it('checks intervals longer than a timer can wait every hour, committing once the interval has elapsed', () => {
    const originalNow = Date.now
    let now = originalNow()
    Date.now = () => now
    try {
      const storage = create({ mode: 'custom', interval: 30, intervalUnit: 'd' })
      expect(timers.map(timer => timer.delay)).to.deep.equal([60 * 60 * 1000])
      const filePath = path.join(directory, 'monthly.txt')
      storage.writeFile(filePath, 'value')
      now += 29 * 24 * 60 * 60 * 1000
      timers[0].callback()
      expect(fs.existsSync(filePath)).to.equal(false)
      now += 24 * 60 * 60 * 1000
      timers[0].callback()
      expect(fs.readFileSync(filePath, 'utf8')).to.equal('value')
    } finally {
      Date.now = originalNow
    }
  })

  it('commits custom changes at the selected interval', () => {
    const storage = create({ mode: 'custom', interval: 2, intervalUnit: 'h' })
    expect(timers.map(timer => timer.delay)).to.deep.equal([2 * 60 * 60 * 1000])
    const filePath = path.join(directory, 'custom.txt')
    storage.writeFile(filePath, 'value')
    storage.handleGatewayEvent()
    expect(fs.existsSync(filePath)).to.equal(false)
    timers[0].callback()
    expect(fs.readFileSync(filePath, 'utf8')).to.equal('value')
    storage.close()
    expect(timers[0].cleared).to.equal(true)
  })

  it('never writes when disabled, keeps the data readable and hands it over to the redeployed gateway', () => {
    const filePath = path.join(directory, 'disabled', 'values.json')
    const appended = path.join(directory, 'disabled', 'history.jsonl')
    const storage = create({ mode: 'disabled' })
    storage.writeFile(filePath, () => '[1]')
    storage.appendFile(appended, 'a\n', { newlineDelimited: true })
    storage.deleteFile(path.join(directory, 'missing'))
    storage.flush()
    storage.handleGatewayEvent()
    expect(fs.existsSync(path.join(directory, 'disabled'))).to.equal(false)
    expect(storage.readFile(filePath, 'utf8')).to.equal('[1]')
    expect(storage.listDirectory(path.join(directory, 'disabled')).sort()).to.deep.equal(['history.jsonl', 'values.json'])
    storage.close()
    // Writes after the close are silently dropped, too.
    storage.writeFile(filePath, 'late')
    expect(fs.existsSync(filePath)).to.equal(false)

    const redeployed = create({ mode: 'disabled' })
    expect(redeployed.readFile(filePath, 'utf8')).to.equal('[1]')
    expect(redeployed.readFile(appended, 'utf8')).to.equal('a\n')
    redeployed.close()

    // Switching to a writing mode commits what was kept in memory.
    const writing = create({ mode: 'balanced' })
    writing.handleGatewayEvent()
    expect(fs.readFileSync(filePath, 'utf8')).to.equal('[1]')
    expect(fs.readFileSync(appended, 'utf8')).to.equal('a\n')
  })

  it('does not hand data over to a different gateway', () => {
    const filePath = path.join(directory, 'values.json')
    const storage = create({ mode: 'disabled' })
    storage.writeFile(filePath, 'mine')
    storage.close()
    const other = create({ ownerId: 'other-gateway', mode: 'disabled' })
    expect(other.exists(filePath)).to.equal(false)
  })

  it('reads pending deletions and appends through files, listings and snapshots', async () => {
    const storage = create({ mode: 'balanced' })
    const filePath = path.join(directory, 'history.jsonl')
    const deleted = path.join(directory, 'expired.jsonl')
    fs.writeFileSync(filePath, 'first\npartial')
    fs.writeFileSync(deleted, 'old\n')
    storage.appendFile(filePath, 'second\n', { newlineDelimited: true })
    storage.appendFile(filePath, 'third\n', { newlineDelimited: true })
    storage.deleteFile(deleted)
    expect(storage.readFile(filePath, 'utf8')).to.equal('first\npartial\nsecond\nthird\n')
    expect(await readSnapshot(storage, filePath)).to.equal('first\npartial\nsecond\nthird\n')
    expect(storage.exists(deleted)).to.equal(false)
    expect(() => storage.readFile(deleted)).to.throw().with.property('code', 'ENOENT')
    expect(storage.listDirectory(directory)).to.deep.equal(['history.jsonl'])
    storage.handleGatewayEvent()
    expect(fs.readFileSync(filePath, 'utf8')).to.equal('first\npartial\nsecond\nthird\n')
    expect(fs.existsSync(deleted)).to.equal(false)
  })

  it('reports commit errors to the gateway log only, and retries them later', () => {
    const messages = []
    const storage = create({ mode: 'balanced', log: (level, message) => messages.push({ level, message }) })
    const blocker = path.join(directory, 'blocked')
    fs.writeFileSync(blocker, 'not a directory')
    const filePath = path.join(blocker, 'values.json')
    storage.writeFile(filePath, 'value')
    expect(() => storage.handleGatewayEvent()).not.to.throw()
    expect(() => storage.handleGatewayEvent()).not.to.throw()
    expect(messages).to.have.length(1)
    expect(messages[0].level).to.equal('error')
    expect(storage.readFile(filePath, 'utf8')).to.equal('value')
    fs.rmSync(blocker)
    storage.handleGatewayEvent()
    expect(fs.readFileSync(filePath, 'utf8')).to.equal('value')
  })

  it('bounds the memory of pending appends, dropping the oldest data when writing is disabled', () => {
    const storage = create({ mode: 'disabled' })
    const older = path.join(directory, '1.jsonl')
    const newer = path.join(directory, '2.jsonl')
    const line = 'x'.repeat(1024 * 1024 - 1) + '\n'
    for (let index = 0; index < 5; index++) storage.appendFile(older, line, { newlineDelimited: true })
    for (let index = 0; index < 5; index++) storage.appendFile(newer, line, { newlineDelimited: true })
    expect(storage.pendingAppendBytes).to.be.at.most(MAX_PENDING_APPEND_BYTES)
    expect(storage.readFile(older).length).to.equal(3 * line.length)
    expect(storage.readFile(newer).length).to.equal(5 * line.length)
  })

  it('commits pending appends early when their memory budget is exceeded', () => {
    const storage = create({ mode: 'balanced' })
    const filePath = path.join(directory, 'big.jsonl')
    const line = 'x'.repeat(1024 * 1024 - 1) + '\n'
    for (let index = 0; index < 9; index++) storage.appendFile(filePath, line, { newlineDelimited: true })
    expect(fs.statSync(filePath).size).to.equal(9 * line.length)
    expect(storage.pendingAppendBytes).to.equal(0)
  })

  it('commits immediately and reports errors to the caller without a gateway storage', () => {
    expect(storageOf(undefined)).to.equal(directStorage)
    expect(storageOf({ fileStorage: {} })).to.equal(directStorage)
    const gatewayStorage = create({ mode: 'balanced' })
    expect(storageOf({ fileStorage: gatewayStorage })).to.equal(gatewayStorage)
    const filePath = path.join(directory, 'direct', 'file.txt')
    directStorage.writeFile(filePath, 'now')
    expect(fs.readFileSync(filePath, 'utf8')).to.equal('now')
    directStorage.deleteFile(filePath)
    expect(fs.existsSync(filePath)).to.equal(false)
    fs.writeFileSync(path.join(directory, 'blocked'), '')
    expect(() => directStorage.writeFile(path.join(directory, 'blocked', 'file.txt'), 'x')).to.throw()
  })
})
