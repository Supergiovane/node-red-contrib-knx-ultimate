// File Cache Control: every file written by this package goes through this module.
// The Winston log is the only exception, as it is governed by the log level.
//
// Each gateway (knxUltimate-config) owns one storage. Nodes write to it as usual,
// but the data is kept in memory and committed to disk according to the
// gateway's "disk-wearing" mode:
//   freshness - pending changes are committed every 5 seconds
//   balanced  - pending changes are committed when the gateway connects or disconnects
//   custom    - pending changes are committed at a user defined interval (5 s .. 30 days)
//   disabled  - nothing is ever written: the data lives in memory until Node-RED restarts
// Reads always see pending data, and write failures never reach the nodes:
// whatever the mode, a node behaves as if its data had been saved.
const fs = require('fs')
const path = require('path')

const MODES = ['freshness', 'balanced', 'disabled', 'custom']
const FRESHNESS_INTERVAL_MS = 5000
const MIN_INTERVAL_SECONDS = 5
const MAX_INTERVAL_SECONDS = 30 * 24 * 60 * 60
const UNIT_SECONDS = { s: 1, m: 60, h: 60 * 60, d: 24 * 60 * 60 }
// setInterval cannot wait longer than 2^31-1 ms (about 24.8 days): longer
// intervals are checked every hour instead.
const MAX_TIMER_MS = 2 ** 31 - 1
const LONG_INTERVAL_CHECK_MS = 60 * 60 * 1000
// Appended data (e.g. the Viewer history) can grow without limits between two
// commits. Past this size it is committed early or, when writing is disabled,
// its oldest chunks are dropped.
const MAX_PENDING_APPEND_BYTES = 8 * 1024 * 1024
// After a gateway redeploy, a storage in "disabled" mode hands its data over to
// the next instance of the same gateway, so only a Node-RED restart loses it.
const HANDOVER_TTL_MS = 60 * 1000
const NEWLINE = Buffer.from('\n')

const handovers = new Map()

function resolveSettings ({ mode, interval, intervalUnit } = {}) {
  const resolvedMode = MODES.includes(mode) ? mode : 'freshness'
  let seconds = Number(interval) * (UNIT_SECONDS[intervalUnit] || 1)
  if (!Number.isFinite(seconds)) seconds = 10 * 60
  seconds = Math.min(MAX_INTERVAL_SECONDS, Math.max(MIN_INTERVAL_SECONDS, Math.round(seconds)))
  let intervalMs = 0
  if (resolvedMode === 'freshness') intervalMs = FRESHNESS_INTERVAL_MS
  if (resolvedMode === 'custom') intervalMs = seconds * 1000
  return { mode: resolvedMode, intervalMs }
}

function toBuffer (data) {
  const value = typeof data === 'function' ? data() : data
  return Buffer.isBuffer(value) ? value : Buffer.from(String(value === undefined || value === null ? '' : value))
}

function notFound (filePath) {
  const error = new Error(`ENOENT: no such file or directory, open '${filePath}'`)
  error.code = 'ENOENT'
  error.path = filePath
  return error
}

function readDisk (filePath) {
  try { return fs.readFileSync(filePath) } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function endsWithNewline (filePath) {
  let descriptor
  try {
    descriptor = fs.openSync(filePath, 'r')
    const { size } = fs.fstatSync(descriptor)
    if (size === 0) return true
    const last = Buffer.alloc(1)
    fs.readSync(descriptor, last, 0, 1, size - 1)
    return last[0] === 10
  } catch (error) {
    if (error.code === 'ENOENT') return true
    throw error
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor)
  }
}

// The only function of the package that modifies files on disk.
function commitFileOperation ({ type, filePath, data, options = {} }) {
  if (type === 'delete') {
    fs.rmSync(filePath, { force: true })
    return
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: options.dirMode })
  if (type === 'write') {
    // Replace through a sibling file, so a crash never leaves a truncated file.
    const temporary = filePath + '.knxtmp'
    fs.writeFileSync(temporary, toBuffer(data), { mode: options.mode })
    fs.renameSync(temporary, filePath)
    return
  }
  let chunk = toBuffer(data)
  // A previously interrupted append leaves half a line: keep it on its own
  // line, so the data appended now stays readable.
  if (options.newlineDelimited && !endsWithNewline(filePath)) chunk = Buffer.concat([NEWLINE, chunk])
  fs.appendFileSync(filePath, chunk, { mode: options.mode })
}

class FileStorage {
  constructor ({ ownerId, mode, interval, intervalUnit, log } = {}) {
    const settings = resolveSettings({ mode, interval, intervalUnit })
    this.ownerId = ownerId
    this.mode = settings.mode
    this.intervalMs = settings.intervalMs
    this.log = typeof log === 'function' ? log : () => {}
    // Without an owner the storage commits immediately and reports errors to
    // the caller. It is used by nodes without a gateway and after a close.
    this.direct = mode === 'direct'
    this.closed = false
    this.pending = new Map()
    this.pendingAppendBytes = 0
    this.sequence = 0
    this.lastError = ''
    this.lastFailureAt = 0
    this.timer = null
    this.adoptHandover()
    this.lastFlushAt = Date.now()
    if (!this.direct && this.intervalMs > 0) {
      this.timer = this.intervalMs <= MAX_TIMER_MS
        ? setInterval(() => this.flush(), this.intervalMs)
        : setInterval(() => { if (Date.now() - this.lastFlushAt >= this.intervalMs) this.flush() }, LONG_INTERVAL_CHECK_MS)
      if (typeof this.timer?.unref === 'function') this.timer.unref()
    }
  }

  get writable () {
    return this.mode !== 'disabled'
  }

  get immediate () {
    return this.direct || this.closed
  }

  adoptHandover () {
    const now = Date.now()
    for (const [ownerId, handover] of handovers) {
      if (now - handover.closedAt > HANDOVER_TTL_MS) handovers.delete(ownerId)
    }
    const handover = this.ownerId !== undefined ? handovers.get(this.ownerId) : undefined
    if (!handover) return
    handovers.delete(this.ownerId)
    this.pending = handover.pending
    this.pendingAppendBytes = handover.pendingAppendBytes
  }

  // Replaces the whole file. `data` can be a function: it is evaluated only
  // when the file is committed or read, so frequent updates cost nothing.
  writeFile (filePath, data, options = {}) {
    this.enqueue(filePath, { kind: 'write', data, options })
  }

  appendFile (filePath, data, options = {}) {
    if (this.immediate) {
      if (this.writable) commitFileOperation({ type: 'append', filePath, data, options })
      return
    }
    const chunk = toBuffer(data)
    const entry = this.pending.get(filePath)
    if (entry && entry.kind === 'append') {
      entry.chunks.push(chunk)
      entry.bytes += chunk.length
      this.pendingAppendBytes += chunk.length
    } else if (entry) {
      // Appending to replaced or deleted content is a replacement too.
      const base = entry.kind === 'write' ? toBuffer(entry.data) : Buffer.alloc(0)
      this.pending.set(filePath, { kind: 'write', data: Buffer.concat([base, chunk]), options: { ...entry.options, ...options } })
    } else {
      this.pending.set(filePath, { kind: 'append', chunks: [chunk], bytes: chunk.length, options, sequence: ++this.sequence })
      this.pendingAppendBytes += chunk.length
    }
    this.enforceAppendBudget()
  }

  deleteFile (filePath) {
    // A file that exists only in memory has nothing to delete on disk.
    if (!this.immediate && !fs.existsSync(filePath)) {
      this.forget(filePath)
      return
    }
    this.enqueue(filePath, { kind: 'delete', options: {} })
  }

  enqueue (filePath, entry) {
    if (this.immediate) {
      if (this.writable) commitFileOperation({ type: entry.kind, filePath, data: entry.data, options: entry.options })
      return
    }
    this.forget(filePath)
    this.pending.set(filePath, entry)
  }

  forget (filePath) {
    const entry = this.pending.get(filePath)
    if (entry && entry.kind === 'append') this.pendingAppendBytes -= entry.bytes
    this.pending.delete(filePath)
  }

  enforceAppendBudget () {
    if (this.pendingAppendBytes <= MAX_PENDING_APPEND_BYTES) return
    if (this.writable && Date.now() - this.lastFailureAt > FRESHNESS_INTERVAL_MS) this.flush()
    // Still too much data (writing disabled or failing): drop the oldest chunks.
    while (this.pendingAppendBytes > MAX_PENDING_APPEND_BYTES) {
      let oldest
      for (const [filePath, entry] of this.pending) {
        if (entry.kind === 'append' && (!oldest || entry.sequence < oldest.entry.sequence)) oldest = { filePath, entry }
      }
      if (!oldest) return
      const dropped = oldest.entry.chunks.shift()
      oldest.entry.bytes -= dropped.length
      this.pendingAppendBytes -= dropped.length
      if (oldest.entry.chunks.length === 0) this.pending.delete(oldest.filePath)
    }
  }

  // Content of a pending append: what is on disk followed by the pending chunks.
  appendedContent (filePath, entry) {
    const disk = readDisk(filePath) || Buffer.alloc(0)
    const parts = [disk]
    if (entry.options.newlineDelimited && disk.length > 0 && disk[disk.length - 1] !== 10) parts.push(NEWLINE)
    return Buffer.concat(parts.concat(entry.chunks))
  }

  readFile (filePath, encoding) {
    const entry = this.pending.get(filePath)
    let content
    if (!entry) return fs.readFileSync(filePath, encoding)
    if (entry.kind === 'delete') throw notFound(filePath)
    if (entry.kind === 'write') content = toBuffer(entry.data)
    else content = this.appendedContent(filePath, entry)
    return encoding ? content.toString(encoding) : content
  }

  exists (filePath) {
    const entry = this.pending.get(filePath)
    if (entry) return entry.kind !== 'delete'
    return fs.existsSync(filePath)
  }

  // File names in a directory, pending files included.
  listDirectory (directory) {
    const names = new Set()
    try {
      fs.readdirSync(directory).forEach(name => names.add(name))
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    for (const [filePath, entry] of this.pending) {
      if (path.dirname(filePath) !== directory) continue
      if (entry.kind === 'delete') names.delete(path.basename(filePath))
      else names.add(path.basename(filePath))
    }
    return Array.from(names)
  }

  // A read-only snapshot of a file, pending data included, for random-access
  // reads of large files. Data committed or added later is not visible.
  async openSnapshot (filePath) {
    const entry = this.pending.get(filePath)
    if (entry && entry.kind === 'delete') throw notFound(filePath)
    let handle = null
    let diskSize = 0
    let memory = Buffer.alloc(0)
    if (entry && entry.kind === 'write') {
      memory = toBuffer(entry.data)
    } else {
      try {
        handle = await fs.promises.open(filePath, 'r')
        diskSize = (await handle.stat()).size
      } catch (error) {
        if (error.code !== 'ENOENT' || !entry) throw error
      }
      if (entry) {
        const parts = []
        if (handle && diskSize > 0 && entry.options.newlineDelimited) {
          const last = Buffer.alloc(1)
          await handle.read(last, 0, 1, diskSize - 1)
          if (last[0] !== 10) parts.push(NEWLINE)
        }
        memory = Buffer.concat(parts.concat(entry.chunks))
      }
    }
    return {
      size: diskSize + memory.length,
      async read (buffer, offset, length, position) {
        let bytesRead = 0
        if (handle && position < diskSize) {
          const result = await handle.read(buffer, offset, Math.min(length, diskSize - position), position)
          bytesRead = result.bytesRead
        }
        const memoryStart = Math.max(0, position + bytesRead - diskSize)
        if (bytesRead < length && position + bytesRead >= diskSize) {
          bytesRead += memory.copy(buffer, offset + bytesRead, memoryStart, memoryStart + length - bytesRead)
        }
        return { bytesRead }
      },
      async close () {
        if (handle) await handle.close()
      }
    }
  }

  // Commits every pending change. Failed changes stay pending for the next attempt.
  flush () {
    this.lastFlushAt = Date.now()
    if (!this.writable || this.pending.size === 0) return
    for (const [filePath, entry] of Array.from(this.pending)) {
      try {
        if (entry.kind === 'append') {
          commitFileOperation({ type: 'append', filePath, data: Buffer.concat(entry.chunks), options: entry.options })
        } else {
          commitFileOperation({ type: entry.kind, filePath, data: entry.data, options: entry.options })
        }
        this.forget(filePath)
      } catch (error) {
        this.lastFailureAt = Date.now()
        const message = `File Cache Control: unable to save ${filePath}: ${error.message}`
        if (this.lastError !== message) this.log('error', message)
        this.lastError = message
      }
    }
  }

  // Called by the gateway on every connection and disconnection.
  handleGatewayEvent () {
    if (this.mode === 'balanced') this.flush()
  }

  close () {
    if (this.closed) return
    if (this.timer !== null) clearInterval(this.timer)
    this.timer = null
    if (this.writable) {
      this.flush()
    } else if (this.ownerId !== undefined && this.pending.size > 0) {
      // Serialize now: the data of a closed node must not be kept alive.
      for (const entry of this.pending.values()) {
        if (entry.kind === 'write') entry.data = toBuffer(entry.data)
      }
      handovers.set(this.ownerId, { pending: this.pending, pendingAppendBytes: this.pendingAppendBytes, closedAt: Date.now() })
    }
    this.pending = new Map()
    this.pendingAppendBytes = 0
    // Late writes (e.g. nodes closing after their gateway) are committed at once.
    this.closed = true
  }
}

const directStorage = new FileStorage({ mode: 'direct' })

function createFileStorage (options) {
  return new FileStorage(options)
}

// The storage of a gateway node, or the direct one when there is no gateway.
function storageOf (gateway) {
  return gateway && gateway.fileStorage instanceof FileStorage ? gateway.fileStorage : directStorage
}

module.exports = {
  createFileStorage,
  storageOf,
  resolveSettings,
  directStorage,
  FileStorage,
  MODES,
  MIN_INTERVAL_SECONDS,
  MAX_INTERVAL_SECONDS,
  MAX_PENDING_APPEND_BYTES
}
