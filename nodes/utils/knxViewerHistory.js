const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const readline = require('readline')
const { once } = require('events')
const { finished } = require('stream/promises')

const HISTORY_TTL_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000
const MAINTENANCE_MS = 60 * 1000
const CHUNK_BYTES = 64 * 1024
const MAX_LINE_BYTES = 1024 * 1024
const FILE_PATTERN = /^(\d+)\.jsonl$/

// Canonical JSON makes structured values independent of object key order and
// treats a Buffer identically before and after its JSON round trip.
function normalizeValue (value, seen = new Set()) {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value)
  if (typeof value === 'bigint') return String(value)
  if (typeof value !== 'object') return typeof value === 'function' ? String(value) : value
  if (Buffer.isBuffer(value)) return { data: Array.from(value), type: 'Buffer' }
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.toISOString() : null
  if (seen.has(value)) return '[Circular]'
  seen.add(value)
  const result = Array.isArray(value)
    ? value.map(item => normalizeValue(item, seen))
    : Object.fromEntries(Object.keys(value).sort().map(key => [key, normalizeValue(value[key], seen)]))
  seen.delete(value)
  return result
}

function textValue (value) {
  if (value === undefined || value === null) return ''
  return typeof value === 'object' ? JSON.stringify(normalizeValue(value)) : String(value)
}

function fingerprint (entry) {
  return JSON.stringify([entry.dpt, entry.payload === null ? entry.rawPayload : entry.payload])
}

function compareEntries (a, b) {
  return a.timestampMs - b.timestampMs || a.id.localeCompare(b.id)
}

function sequenceOf (entry) {
  const value = parseInt(String(entry.id).split('-')[1], 36)
  return Number.isSafeInteger(value) && value > 0 ? value : 0
}

function parseEntry (line) {
  try {
    const entry = JSON.parse(line)
    if (entry && typeof entry.id === 'string' && typeof entry.address === 'string' && Number.isSafeInteger(entry.timestampMs)) return entry
  } catch (_) { /* A malformed line must not hide the remaining history. */ }
  return null
}

async function * forwardLines (filename) {
  const stream = fs.createReadStream(filename, { encoding: 'utf8' })
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity })
  // readline does not forward input-stream errors to its async iterator.
  let streamError
  stream.on('error', error => { streamError = error; lines.close() })
  try {
    for await (const line of lines) {
      if (Buffer.byteLength(line) > MAX_LINE_BYTES) throw new Error('KNX Viewer history contains an oversized entry')
      if (line) yield line
    }
    if (streamError) throw streamError
  } finally {
    lines.close()
    stream.destroy()
  }
}

async function * reverseLines (handle, size) {
  let position = size
  let pending = Buffer.alloc(0)
  while (position > 0) {
    const length = Math.min(position, CHUNK_BYTES)
    position -= length
    const chunk = Buffer.allocUnsafe(length)
    const { bytesRead } = await handle.read(chunk, 0, length, position)
    const data = Buffer.concat([chunk.subarray(0, bytesRead), pending])
    let end = data.length
    for (let index = data.length - 1; index >= 0; index--) {
      if (data[index] !== 10) continue
      if (index + 1 < end) yield data.subarray(index + 1, end).toString('utf8')
      end = index
    }
    pending = data.subarray(0, end)
    if (pending.length > MAX_LINE_BYTES) throw new Error('KNX Viewer history contains an oversized entry')
  }
  if (pending.length) yield pending.toString('utf8')
}

async function repairIncompleteTail (filename) {
  const handle = await fs.promises.open(filename, 'r+')
  try {
    let position = (await handle.stat()).size
    if (!position) return
    while (position > 0) {
      const length = Math.min(position, CHUNK_BYTES)
      position -= length
      const chunk = Buffer.allocUnsafe(length)
      const { bytesRead } = await handle.read(chunk, 0, length, position)
      const newline = chunk.subarray(0, bytesRead).lastIndexOf(10)
      if (newline !== -1) {
        await handle.truncate(position + newline + 1)
        return
      }
    }
    await handle.truncate(0)
  } finally {
    await handle.close()
  }
}

/** Persistent, paginated state changes for one Viewer and one KNX gateway. */
function createViewerHistory ({ userDir, nodeId, gatewayId, onError, now = Date.now }) {
  // Hashing both identifiers prevents path traversal and filesystem name limits.
  const identity = crypto.createHash('sha256').update(JSON.stringify([String(nodeId), String(gatewayId || '')])).digest('hex')
  const directory = path.join(userDir, 'knxultimatestorage', 'viewer', identity)
  const latest = new Map()
  const hours = new Map()
  const activeReads = new Set()
  let queue = Promise.resolve()
  let initialized = false
  let closing = false
  let closePromise
  let lastPrune = -Infinity
  let sequence = 0
  let storageError = null

  const reportError = error => {
    initialized = false
    const message = error?.message || String(error)
    if (storageError === message) return
    storageError = message
    try { if (typeof onError === 'function') onError(error) } catch (_) { /* Logging must never interrupt the recorder. */ }
  }

  const serial = (operation, fallback) => {
    const result = queue.then(async () => {
      try { return await operation() } catch (error) {
        reportError(error)
        return typeof fallback === 'function' ? fallback() : fallback
      }
    })
    queue = result.then(() => undefined)
    return result
  }

  const clock = () => {
    const value = Number(now())
    return Number.isFinite(value) ? Math.trunc(value) : Date.now()
  }

  async function files () {
    return (await fs.promises.readdir(directory))
      .filter(name => FILE_PATTERN.test(name))
      .map(name => ({ name, hour: Number(name.slice(0, -6)), filename: path.join(directory, name) }))
      .filter(file => Number.isSafeInteger(file.hour))
      .sort((a, b) => a.hour - b.hour)
  }

  function rememberHour (entry) {
    const hour = Math.floor(entry.timestampMs / HOUR_MS)
    const previous = hours.get(hour)
    hours.set(hour, {
      ordered: !previous || (previous.ordered && compareEntries(previous.last, entry) <= 0),
      last: { timestampMs: entry.timestampMs, id: entry.id }
    })
  }

  async function compact (file, cutoff) {
    const temporary = `${file.filename}.${crypto.randomUUID()}.tmp`
    const output = fs.createWriteStream(temporary, { flags: 'wx', mode: 0o600 })
    // Observe errors immediately, including ones raised while reading input.
    const completion = finished(output)
    completion.catch(() => {})
    let removed = false
    let count = 0
    try {
      for await (const line of forwardLines(file.filename)) {
        const entry = parseEntry(line)
        if (!entry || entry.timestampMs < cutoff) { removed = true; continue }
        count++
        if (!output.write(`${line}\n`)) await once(output, 'drain')
      }
      output.end()
      await completion
      if (!removed) await fs.promises.unlink(temporary)
      else if (!count) {
        await fs.promises.unlink(file.filename)
        await fs.promises.unlink(temporary)
        hours.delete(file.hour)
      } else await fs.promises.rename(temporary, file.filename)
    } catch (error) {
      output.destroy()
      await completion.catch(() => {})
      await fs.promises.unlink(temporary).catch(() => {})
      throw error
    }
  }

  async function prune (force = false) {
    const timestamp = clock()
    if (!force && timestamp - lastPrune < MAINTENANCE_MS) return
    const cutoff = timestamp - HISTORY_TTL_MS
    for (const file of await files()) {
      if ((file.hour + 1) * HOUR_MS <= cutoff) {
        await fs.promises.unlink(file.filename)
        hours.delete(file.hour)
      } else if (file.hour * HOUR_MS < cutoff) await compact(file, cutoff)
    }
    for (const [address, state] of latest) {
      if (state.timestampMs < cutoff) latest.delete(address)
    }
    lastPrune = timestamp
  }

  async function initialize () {
    if (initialized) return
    await fs.promises.mkdir(directory, { recursive: true, mode: 0o700 })
    for (const name of await fs.promises.readdir(directory)) {
      if (/^\d+\.jsonl\.[0-9a-f-]+\.tmp$/.test(name)) await fs.promises.unlink(path.join(directory, name))
    }
    for (const file of await files()) await repairIncompleteTail(file.filename)
    await prune(true)
    latest.clear()
    hours.clear()
    const cutoff = clock() - HISTORY_TTL_MS
    for (const file of await files()) {
      for await (const line of forwardLines(file.filename)) {
        const entry = parseEntry(line)
        if (!entry || entry.timestampMs < cutoff) continue
        sequence = Math.max(sequence, sequenceOf(entry))
        rememberHour(entry)
        if (entry.event === 'GroupValue_Read') continue
        const state = latest.get(entry.address)
        if (!state || sequenceOf(entry) > state.sequence) {
          latest.set(entry.address, {
            fingerprint: fingerprint(entry),
            payloadText: entry.payloadText,
            timestampMs: entry.timestampMs,
            sequence: sequenceOf(entry)
          })
        }
      }
    }
    initialized = true
    storageError = null
  }

  function response (entries = [], hasMore = false, search = '', timestamp = clock()) {
    const last = entries[entries.length - 1]
    return {
      entries,
      hasMore,
      nextCursor: hasMore && last
        ? Buffer.from(JSON.stringify({ v: 1, identity, search, timestampMs: last.timestampMs, id: last.id })).toString('base64url')
        : '',
      from: new Date(timestamp - HISTORY_TTL_MS).toISOString(),
      to: new Date(timestamp).toISOString(),
      storageError
    }
  }

  function readCursor (before, search) {
    if (typeof before !== 'string' || before.length > 4096) return null
    try {
      const cursor = JSON.parse(Buffer.from(before, 'base64url').toString('utf8'))
      return cursor.v === 1 && cursor.identity === identity && cursor.search === search &&
        Number.isSafeInteger(cursor.timestampMs) && typeof cursor.id === 'string'
        ? cursor
        : null
    } catch (_) { return null }
  }

  const ready = serial(initialize)
  const timer = setInterval(() => {
    if (!closing) void serial(async () => { await initialize(); await prune() })
  }, MAINTENANCE_MS)
  if (typeof timer.unref === 'function') timer.unref()

  return {
    ready,
    record (input) {
      if (closing || !input || !input.address) return Promise.resolve(null)
      // Copy now: a caller can reuse or mutate a KNX message before the queued IO.
      let data
      try { data = normalizeValue(input) } catch (error) { reportError(error); return Promise.resolve(null) }
      return serial(async () => {
        await initialize()
        await prune()
        const timestamp = clock()
        const timestampMs = Number.isSafeInteger(data.timestampMs) ? Math.min(data.timestampMs, timestamp) : timestamp
        if (timestampMs < timestamp - HISTORY_TTL_MS) return null
        const address = String(data.address)
        let previous = latest.get(address)
        if (previous && previous.timestampMs < timestamp - HISTORY_TTL_MS) { latest.delete(address); previous = null }
        const isRead = data.event === 'GroupValue_Read'
        const payload = isRead || data.payload === undefined ? null : data.payload
        const entry = {
          id: `${timestampMs.toString(36)}-${(++sequence).toString(36).padStart(12, '0')}-${crypto.randomUUID()}`,
          timestamp: new Date(timestampMs).toISOString(),
          timestampMs,
          address,
          source: textValue(data.source),
          dpt: textValue(data.dpt),
          devicename: textValue(data.devicename),
          payload,
          payloadText: isRead ? '' : data.payloadText === undefined || data.payloadText === null ? textValue(payload) : String(data.payloadText),
          previousPayloadText: !isRead && previous ? previous.payloadText : null,
          rawPayload: isRead || data.rawPayload === undefined ? null : data.rawPayload,
          payloadmeasureunit: isRead ? '' : textValue(data.payloadmeasureunit),
          event: textValue(data.event)
        }
        const signature = fingerprint(entry)
        if (!isRead && previous && previous.fingerprint === signature) return null
        const line = `${JSON.stringify(entry)}\n`
        if (Buffer.byteLength(line) > MAX_LINE_BYTES) throw new Error('KNX Viewer history entry exceeds 1 MiB')
        const filename = path.join(directory, `${Math.floor(timestampMs / HOUR_MS)}.jsonl`)
        try {
          await fs.promises.appendFile(filename, line, { encoding: 'utf8', mode: 0o600 })
        } catch (error) {
          // A failed write can leave half a line; repair it before a later retry.
          initialized = false
          throw error
        }
        if (!isRead) latest.set(address, { fingerprint: signature, payloadText: entry.payloadText, timestampMs, sequence })
        rememberHour(entry)
        storageError = null
        return entry
      }, null)
    },
    query (options = {}) {
      if (closing) return Promise.resolve(response())
      const numericLimit = Number(options.limit)
      const limit = Number.isFinite(numericLimit) && numericLimit > 0 ? Math.min(1000, Math.max(1, Math.floor(numericLimit))) : 200
      const search = String(options.search || '').trim().toLowerCase().slice(0, 512)
      const cursor = readCursor(options.before, search)
      if (options.before && !cursor) {
        const error = new Error('The KNX Viewer history cursor is invalid for this viewer or filter')
        error.code = 'INVALID_CURSOR'
        return Promise.reject(error)
      }
      const snapshots = []
      // Only opening the snapshot waits in the write queue. Scanning an entire
      // day's filtered history must not hold up incoming telegrams. Open handles
      // remain valid when retention replaces or unlinks an hourly file.
      const prepared = serial(async () => {
        await initialize()
        await prune()
        const timestamp = clock()
        const cutoff = timestamp - HISTORY_TTL_MS
        for (const file of (await files()).reverse()) {
          if ((file.hour + 1) * HOUR_MS <= cutoff || (cursor && file.hour * HOUR_MS > cursor.timestampMs)) continue
          const handle = await fs.promises.open(file.filename, 'r')
          const snapshot = { handle, size: 0, ordered: hours.get(file.hour)?.ordered === true }
          snapshots.push(snapshot)
          snapshot.size = (await handle.stat()).size
        }
        return { timestamp, cutoff }
      }, null)
      const operation = prepared.then(async snapshot => {
        if (!snapshot) return response()
        const { timestamp, cutoff } = snapshot
        const entries = []
        for (const file of snapshots) {
          // Normal live traffic is appended chronologically, so a first page
          // reads only its tail. An hour containing delayed telegrams falls back
          // to bounded sorting without loading that hour into RAM.
          for await (const line of reverseLines(file.handle, file.size)) {
            const entry = parseEntry(line)
            if (!entry || entry.timestampMs < cutoff || entry.timestampMs > timestamp || (cursor && compareEntries(entry, cursor) >= 0)) continue
            if (search && ![entry.address, entry.source, entry.dpt, entry.devicename, entry.payloadText,
              entry.previousPayloadText, entry.payloadmeasureunit, entry.event, textValue(entry.rawPayload)]
              .join(' ').toLowerCase().includes(search)) continue
            let low = 0
            let high = entries.length
            while (low < high) {
              const middle = (low + high) >>> 1
              if (compareEntries(entries[middle], entry) > 0) low = middle + 1
              else high = middle
            }
            entries.splice(low, 0, entry)
            if (entries.length > limit + 1) entries.pop()
            if (file.ordered && entries.length > limit) break
          }
          if (entries.length > limit) break
        }
        return response(entries.slice(0, limit), entries.length > limit, search, timestamp)
      }).catch(error => {
        reportError(error)
        return response()
      }).finally(async () => {
        await Promise.all(snapshots.map(async file => {
          try { await file.handle.close() } catch (error) { reportError(error) }
        }))
        activeReads.delete(operation)
      })
      activeReads.add(operation)
      return operation
    },
    close () {
      if (closePromise) return closePromise
      closing = true
      clearInterval(timer)
      closePromise = queue.then(async () => {
        await Promise.all(activeReads)
        latest.clear()
        hours.clear()
      })
      return closePromise
    }
  }
}

module.exports = createViewerHistory
module.exports.createViewerHistory = createViewerHistory
module.exports.HISTORY_TTL_MS = HISTORY_TTL_MS
