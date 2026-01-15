import { EventEmitter } from 'events'
import { Agent as HTTPSAgent, request as httpsRequest } from 'node:https'
import { URL } from 'node:url'
import { TextDecoder } from 'node:util'
import { setTimeout as pleaseWait } from 'timers/promises'
import * as http from './http.js'

const createAbortError = () => {
  const err = new Error('The operation was aborted')
  err.name = 'AbortError'
  return err
}

const openEventStream = (url, { headers = {}, agent, signal, connectTimeoutMs = 30000 } = {}) => {
  return new Promise((resolve, reject) => {
    let response = null
    let requestInstance = null
    let settled = false
    let connectTimer = null

    const safeResolve = (value) => {
      if (settled) return
      settled = true
      if (connectTimer) clearTimeout(connectTimer)
      resolve(value)
    }

    const safeReject = (error) => {
      if (settled) return
      settled = true
      if (connectTimer) clearTimeout(connectTimer)
      reject(error)
    }

    const cleanup = () => {
      if (signal) signal.removeEventListener('abort', onAbort)
      if (connectTimer) clearTimeout(connectTimer)
      connectTimer = null
    }

    const onAbort = () => {
      const abortErr = createAbortError()
      if (response && typeof response.destroy === 'function') {
        response.destroy(abortErr)
      } else if (requestInstance && typeof requestInstance.destroy === 'function') {
        requestInstance.destroy(abortErr)
      }
    }

    const target = new URL(url)
    const options = {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: `${target.pathname}${target.search}`,
      method: 'GET',
      headers,
      agent
    }

    requestInstance = httpsRequest(options, (res) => {
      response = res
      try {
        res.socket?.setKeepAlive?.(true, 5000)
        res.socket?.setNoDelay?.(true)
      } catch (error) { /* empty */ }
      res.once('close', cleanup)
      res.once('error', cleanup)
      safeResolve(res)
    })

    requestInstance.on('error', (error) => {
      cleanup()
      safeReject(error)
    })

    requestInstance.end()

    connectTimer = setTimeout(() => {
      const err = new Error(`SSE connect timeout after ${connectTimeoutMs}ms`)
      if (response && typeof response.destroy === 'function') response.destroy(err)
      else if (requestInstance && typeof requestInstance.destroy === 'function') requestInstance.destroy(err)
      cleanup()
      safeReject(err)
    }, connectTimeoutMs)

    if (signal) {
      if (signal.aborted) {
        onAbort()
        cleanup()
        safeReject(createAbortError())
        return
      }
      signal.addEventListener('abort', onAbort)
    }
  })
}

class classHUE extends EventEmitter {
  constructor (_hueBridgeIP, _username, _clientkey, _bridgeid, _sysLogger, { startQueue = true } = {}) {
    super()
    this.HUEBridgeConnectionStatus = 'disconnected'
    this.exitAllQueues = false
    this.hueBridgeIP = _hueBridgeIP
    this.username = _username
    this.clientkey = _clientkey
    this.bridgeid = _bridgeid
    this.commandQueue = []
    this.sysLogger = _sysLogger
    this.timerCheckConnected = null
    this.restartSSECounter = 0
    this.queueMaxLength = 2000
    this._logThrottle = new Map() // throttleKey -> { last: number, suppressed: number }
    if (startQueue) this.handleQueue()
    this.eventStreamAbort = null
    this._agent = null
  }

  _disconnect = ({ clearQueue = true, resetCounter = true, abortController } = {}) => {
    if (abortController && this.eventStreamAbort && this.eventStreamAbort !== abortController) return
    try {
      if (this.timerCheckConnected !== null) {
        clearInterval(this.timerCheckConnected)
        this.timerCheckConnected = null
      }
    } catch (error) { /* empty */ }

    try {
      if (this.eventStreamAbort) this.eventStreamAbort.abort()
    } catch (error) { /* empty */ }

    try {
      if (this._agent && typeof this._agent.destroy === 'function') this._agent.destroy()
    } catch (error) { /* empty */ }
    this._agent = null

    if (clearQueue) this.commandQueue = []
    if (resetCounter) this.restartSSECounter = 0
    this.HUEBridgeConnectionStatus = 'disconnected'
  }

  _log = (level, message) => {
    try {
      const logger = this.sysLogger
      if (logger && typeof logger[level] === 'function') return logger[level](message)
      if (logger && typeof logger.log === 'function') return logger.log(message)
    } catch (error) { /* empty */ }
    if (level === 'error') console.error(message)
    else if (level === 'warn') console.warn(message)
    else console.log(message)
  }

  _logThrottled = (level, throttleKey, message, intervalMs = 30000) => {
    const now = Date.now()
    const entry = this._logThrottle.get(throttleKey) || { last: 0, suppressed: 0 }
    if (this._logThrottle.size > 1000) this._logThrottle.clear()
    if (entry.last === 0 || (now - entry.last) >= intervalMs) {
      const suffix = entry.suppressed > 0 ? ` (suppressed ${entry.suppressed} similar)` : ''
      entry.last = now
      entry.suppressed = 0
      this._logThrottle.set(throttleKey, entry)
      this._log(level, `${message}${suffix}`)
      return
    }
    entry.suppressed += 1
    this._logThrottle.set(throttleKey, entry)
  }

  _parseHueResponseErrors = (message) => {
    if (typeof message !== 'string') return null
    const match = message.match(/^The response for (.+?) returned errors (.+)$/)
    if (!match) return null
    try {
      const url = match[1]
      const errors = JSON.parse(match[2])
      if (!Array.isArray(errors)) return null
      return { url, errors }
    } catch (error) {
      return null
    }
  }

  _summarizeHueErrors = (errors, maxLen = 300) => {
    if (!Array.isArray(errors) || errors.length === 0) return ''
    const descriptions = errors.map((err) => {
      if (!err) return ''
      if (typeof err.description === 'string' && err.description.trim() !== '') return err.description.trim()
      if (typeof err.message === 'string' && err.message.trim() !== '') return err.message.trim()
      try { return JSON.stringify(err) } catch (error) { return String(err) }
    }).filter(Boolean)
    const joined = descriptions.join('; ')
    if (joined.length <= maxLen) return joined
    return `${joined.slice(0, maxLen)}…`
  }

  _isCommunicationIssue = (errors) => {
    if (!Array.isArray(errors)) return false
    return errors.some((err) => {
      const desc = (err?.description || err?.message || '').toString().toLowerCase()
      return desc.includes('communication issue')
    })
  }

  _enqueueCommand = (command) => {
    if (!command) return false
    if (!Array.isArray(this.commandQueue)) this.commandQueue = []

    this.commandQueue.unshift(command)

    if (this.commandQueue.length > this.queueMaxLength) {
      this.commandQueue.splice(this.queueMaxLength)
      this._logThrottled('warn', 'hue:queue:overflow', `HUE command queue overflow: capped at ${this.queueMaxLength}`, 60000)
    }

    return true
  }

  Connect = async () => {
    try {
      if (this.timerCheckConnected !== null) clearInterval(this.timerCheckConnected)
    } catch (error) { /* empty */ }
    this.timerCheckConnected = null
    try {
      if (this.eventStreamAbort) this.eventStreamAbort.abort()
    } catch (error) { /* empty */ }

    try {
      if (this._agent && typeof this._agent.destroy === 'function') this._agent.destroy()
    } catch (error) { /* empty */ }
    this._agent = new HTTPSAgent({
      rejectUnauthorized: false,
      keepAlive: true,
      keepAliveMsecs: 5000
    })

    this.hueApiV2 = http.use({
      key: this.username,
      prefix: `https://${this.hueBridgeIP}/clip/v2`,
      logger: this.sysLogger,
      timeoutMs: 30000,
      agent: this._agent
    })

    const headers = {
      'hue-application-key': this.username,
      Accept: 'text/event-stream',
      'Cache-control': 'no-cache'
    }

    const abortController = new AbortController()
    this.eventStreamAbort = abortController
    const { signal } = abortController
    const isCurrentConnection = () => this.eventStreamAbort === abortController

    const url = `https://${this.hueBridgeIP}/eventstream/clip/v2`

    try {
      const res = await openEventStream(url, {
        headers,
        agent: this._agent,
        signal,
        connectTimeoutMs: 30000
      })

      if (res.statusCode !== 200) {
        res.resume?.()
        const statusError = new Error(`Status ${res.statusCode}`)
        if (isCurrentConnection()) this.emit('error', statusError)
        if (isCurrentConnection()) {
          this._disconnect({ clearQueue: true, resetCounter: true, abortController })
          this.emit('disconnected')
        }
        return
      }

      if (isCurrentConnection()) this.emit('connected')
      if (isCurrentConnection()) this.HUEBridgeConnectionStatus = 'connected'
      this.sysLogger?.info('classHUE: connected to SSE')

      this.timerCheckConnected = setInterval(() => {
        void (async () => {
          if (!isCurrentConnection() || signal.aborted) return
          try {
            this.restartSSECounter += 1
            if (this.restartSSECounter >= 4) {
              this.sysLogger?.debug('Restarted SSE Client, per sicurezza, altrimenti potrebbe addormentarsi')
              this.restartSSECounter = 0
              abortController.abort()
              void this.Connect()
              return
            }
            const jReturn = await this.hueApiV2.get('/resource/bridge')
            if (!Array.isArray(jReturn) || jReturn.length < 1) throw new Error('Bridge not found')
            if (isCurrentConnection()) this.HUEBridgeConnectionStatus = 'connected'
          } catch (error) {
            this._logThrottled('error', 'hue:ping:error', `Ping ERROR: ${error.message}`, 30000)
            if (!isCurrentConnection()) return
            this._disconnect({ clearQueue: true, resetCounter: true, abortController })
            this.emit('disconnected')
          }
        })()
      }, 90000)

      let buffer = ''
      const textDecoder = new TextDecoder()
      for await (const chunk of res) {
        if (signal.aborted || !isCurrentConnection()) break
        buffer += textDecoder.decode(chunk, { stream: true })
        if (buffer.length > 1024 * 1024) {
          this._logThrottled('warn', 'hue:sse:buffer:overflow', 'EventStream buffer overflow, resetting parser buffer', 30000)
          buffer = ''
          continue
        }
        let parts = buffer.split(/\r?\n\r?\n/)
        if (parts.length > 1) {
          buffer = parts.pop()
        } else {
          buffer = parts[0]
          parts = []
        }

        for (const block of parts) {
          const parsed = this._parseEvent(block)
          if (parsed?.data && Array.isArray(parsed.data)) {
            parsed.data.forEach(ev => {
              const items = Array.isArray(ev?.data) ? ev.data : []
              for (let index = 0; index < items.length; index++) {
                const element = items[index]
                if (isCurrentConnection()) this.emit('event', element)
              }
            })
          }
        }
      }

      // If the stream ends without an explicit abort, treat it as a disconnect so it can reconnect.
      if (!signal.aborted && isCurrentConnection()) {
        this._logThrottled('warn', 'hue:sse:ended', 'EventStream ended unexpectedly', 30000)
        this._disconnect({ clearQueue: true, resetCounter: true, abortController })
        this.emit('disconnected')
      }
    } catch (err) {
      if (!isCurrentConnection()) return
      if (err.name !== 'AbortError' && !signal.aborted && this.sysLogger) {
        this.sysLogger.error(`EventStream error: ${err.message}`)
        this._disconnect({ clearQueue: true, resetCounter: true, abortController })
        this.emit('disconnected')
      };
    }
  }

  _parseEvent = (block) => {
    const lines = block.split(/\r?\n/)
    let data = ''
    let event = 'message'

    for (const line of lines) {
      if (line.startsWith('data:')) {
        data += line.slice(5).trim()
      } else if (line.startsWith('event:')) {
        event = line.slice(6).trim()
      }
    }

    try {
      return {
        type: event,
        data: data ? JSON.parse(data) : null
      }
    } catch (e) {
      return {
        type: event,
        data: data || null
      }
    }
  }

  processQueueItem = async () => {
    let jRet = null
    try {
      if (this.HUEBridgeConnectionStatus !== 'connected') return
      if (!this.hueApiV2 || typeof this.hueApiV2.put !== 'function') return
      jRet = this.commandQueue.pop()
      if (!jRet) return
      switch (jRet._operation) {
        case 'setLight':
          await this.hueApiV2.put(`/resource/light/${jRet._lightID}`, jRet._state)
          break
        case 'setGroupedLight':
          await this.hueApiV2.put(`/resource/grouped_light/${jRet._lightID}`, jRet._state)
          break
        case 'setPlug':
          {
            const resourceType = jRet._resourceType || 'plug'
            await this.hueApiV2.put(`/resource/${resourceType}/${jRet._lightID}`, jRet._state)
          }
          break
        case 'setScene':
          await this.hueApiV2.put(`/resource/scene/${jRet._lightID}`, jRet._state)
          break
        case 'stopScene':
          const allResources = await this.hueApiV2.get('/resource')
          const jScene = allResources.find((res) => res.id === jRet._lightID)
          const linkedLight = allResources.find((res) => res.id === jScene.group.rid).children || []
          linkedLight.forEach((light) => {
            this.writeHueQueueAdd(light.rid, jRet._state, 'setLight')
          })
          break
        default:
          break
      }
    } catch (error) {
      const parsed = this._parseHueResponseErrors(error?.message)
      if (parsed) {
        const summary = this._summarizeHueErrors(parsed.errors)
        const urlMatch = parsed.url.match(/\/resource\/([^/]+)\/([^/?#]+)/)
        const resourceKey = urlMatch ? `${urlMatch[1]}:${urlMatch[2]}` : parsed.url
        const firstError = parsed.errors?.[0]
        const firstDescription = (firstError?.description || firstError?.message || '').toString()
        const key = `hue:resp:${resourceKey}:${firstDescription}`
        const level = this._isCommunicationIssue(parsed.errors) ? 'warn' : 'error'
        this._logThrottled(level, key, `processQueueItem (${resourceKey}): ${summary || 'Hue API returned errors'}`, 30000)
      } else {
        const message = (error?.message || String(error || 'Unknown error')).toString()
        this._logThrottled('error', `hue:queue:error:${message}`, `processQueueItem: ${message}`, 30000)
      }
    }
  }

  handleQueue = async () => {
    do {
      if (this.HUEBridgeConnectionStatus === 'connected' && this.commandQueue && this.commandQueue.length > 0) {
        try {
          await this.processQueueItem()
        } catch (error) { }
      }
      await pleaseWait(150)
    } while (!this.exitAllQueues)
  }

  writeHueQueueAdd = async (_lightID, _state, _operation, _resourceType) => {
    const command = { _lightID, _state, _operation, _resourceType }
    return this._enqueueCommand(command)
  }

  deleteHueQueue = async (_lightID) => {
    this.commandQueue = this.commandQueue.filter((el) => el._lightID !== _lightID)
  }

  close = async () =>
    new Promise((resolve, reject) => {
      if (this.timerCheckConnected !== null) clearInterval(this.timerCheckConnected)
      try {
        this.exitAllQueues = true
        this.restartSSECounter = 0
        try {
          if (this.eventStreamAbort) this.eventStreamAbort.abort()
        } catch (error) { }
        this._logThrottle.clear()
        this.commandQueue = []
        this.HUEBridgeConnectionStatus = 'disconnected'
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
}

export { classHUE }
