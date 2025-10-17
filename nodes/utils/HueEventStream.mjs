import { EventEmitter } from 'events'
import { Agent as HTTPSAgent, request as httpsRequest } from 'node:https'
import { URL } from 'node:url'
import { TextDecoder } from 'node:util'
import { setTimeout as delay } from 'timers/promises'

const createAbortError = () => {
  const err = new Error('The operation was aborted')
  err.name = 'AbortError'
  return err
}

const openEventStream = (url, { headers = {}, agent, signal } = {}) => {
  return new Promise((resolve, reject) => {
    let response = null
    let requestInstance = null
    let settled = false

    const safeResolve = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    const safeReject = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }

    const cleanup = () => {
      if (signal) signal.removeEventListener('abort', onAbort)
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
      res.once('close', cleanup)
      res.once('error', cleanup)
      safeResolve(res)
    })

    requestInstance.on('error', (error) => {
      cleanup()
      safeReject(error)
    })

    requestInstance.end()

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

class HueEventStream extends EventEmitter {
  constructor (url, { headers = {}, reconnectInterval = 5000 } = {}) {
    super()
    this.url = url
    this.headers = headers
    this.reconnectInterval = reconnectInterval
    this.abortController = null
    this.agent = new HTTPSAgent({
      rejectUnauthorized: false
    })
    this.connected = false
    this._start()
  }

  async _start () {
    while (true) {
      try {
        this.abortController = new AbortController()
        const res = await openEventStream(this.url, {
          headers: this.headers,
          agent: this.agent,
          signal: this.abortController.signal
        })

        if (res.statusCode !== 200) {
          res.resume?.()
          this.emit('error', new Error(`Unexpected status: ${res.statusCode}`))
          await delay(this.reconnectInterval)
          continue
        }

        this.emit('open')
        this.connected = true

        let buffer = ''
        const decoder = new TextDecoder()
        for await (const chunk of res) {
          buffer += decoder.decode(chunk, { stream: true })

          const lines = buffer.split(/\r?\n\r?\n/)
          buffer = lines.pop() // l'ultima parte potrebbe essere incompleta

          for (const block of lines) {
            const event = this._parseEvent(block)
            if (event) this.emit('message', event)
          }
        }

        this.emit('close')
        this.connected = false
        await delay(this.reconnectInterval)
      } catch (err) {
        if (err.name !== 'AbortError') {
          this.emit('error', err)
          await delay(this.reconnectInterval)
        }
      }
    }
  }

  _parseEvent (block) {
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

  close () {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    this.connected = false
  }
}

export { HueEventStream }
