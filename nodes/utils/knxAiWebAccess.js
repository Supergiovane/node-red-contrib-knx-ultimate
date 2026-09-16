const dns = require('dns')
const https = require('https')
const net = require('net')

const DEFAULT_TIMEOUT_MS = 10000
const DEFAULT_MAX_REDIRECTS = 3
const DEFAULT_MAX_ACTIONS = 2
const DEFAULT_MAX_RESULTS = 3
const DEFAULT_SEARCH_MAX_BYTES = 512 * 1024
const DEFAULT_OPEN_MAX_BYTES = 1024 * 1024
const DEFAULT_TEXT_MAX_CHARS = 16000
const HARD_MAX_BYTES = 2 * 1024 * 1024
const HARD_MAX_ACTIONS = 5
const HARD_MAX_REDIRECTS = 5
const HARD_MAX_RESULTS = 5
const MAX_QUERY_CHARS = 500
const MAX_URL_CHARS = 4096
const DEFAULT_SEARCH_ENDPOINTS = [
  'https://html.duckduckgo.com/html/',
  'https://lite.duckduckgo.com/lite/'
]
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; KNX-Ultimate-AI/1.0; +https://github.com/Supergiovane/node-red-contrib-knx-ultimate)'

class KnxAiWebAccessError extends Error {
  constructor (code, message) {
    super(message)
    this.name = 'KnxAiWebAccessError'
    this.code = code
  }
}

const boundedInteger = (value, fallback, minimum, maximum) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.min(maximum, Math.max(minimum, Math.floor(numeric)))
}

const compactWhitespace = (value, maxChars = DEFAULT_TEXT_MAX_CHARS) => {
  const limit = boundedInteger(maxChars, DEFAULT_TEXT_MAX_CHARS, 1, 100000)
  const normalized = String(value || '')
    .replace(/[\s\S]/g, character => {
      const code = character.charCodeAt(0)
      if (code === 0) return ''
      if ((code >= 1 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || (code >= 127 && code <= 159)) return ' '
      if ((code >= 0x200b && code <= 0x200f) || (code >= 0x202a && code <= 0x202e) || (code >= 0x2066 && code <= 0x2069) || code === 0xfeff) return ''
      return character
    })
    .replace(/\r\n?/g, '\n')
    .replace(/[\t\f\v ]+/g, ' ')
    .replace(/ +([,.;:!?])/g, '$1')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (normalized.length <= limit) return normalized
  return `${normalized.slice(0, Math.max(1, limit - 1)).trimEnd()}…`
}

const decodeHtmlEntities = (value) => {
  const named = {
    amp: '&',
    apos: "'",
    gt: '>',
    hellip: '…',
    ldquo: '“',
    lsquo: '‘',
    lt: '<',
    nbsp: ' ',
    ndash: '–',
    quot: '"',
    rdquo: '”',
    rsquo: '’',
    trade: '™'
  }
  return String(value || '').replace(/&(#(?:x[0-9a-f]{1,6}|[0-9]{1,7})|[a-z][a-z0-9]{1,15});/gi, (match, entity) => {
    if (entity[0] !== '#') return Object.prototype.hasOwnProperty.call(named, entity.toLowerCase()) ? named[entity.toLowerCase()] : ' '
    const hexadecimal = entity[1].toLowerCase() === 'x'
    const numeric = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10)
    if (!Number.isInteger(numeric) || numeric <= 0 || numeric > 0x10ffff || (numeric >= 0xd800 && numeric <= 0xdfff)) return ' '
    try { return String.fromCodePoint(numeric) } catch (error) { return ' ' }
  })
}

const stripHtmlTags = (value, maxChars = DEFAULT_TEXT_MAX_CHARS) => {
  let html = String(value || '')
  html = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<!--[\s\S]*$/g, ' ')
    .replace(/<(script|style|noscript|template|svg|canvas|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<(script|style|noscript|template|svg|canvas|iframe|object|embed)\b[^>]*>[\s\S]*$/gi, ' ')
    .replace(/<(br|hr)\b[^>]*>/gi, '\n')
    .replace(/<\/(address|article|aside|blockquote|div|dl|fieldset|figcaption|figure|footer|form|h[1-6]|header|li|main|nav|ol|p|pre|section|table|tr|ul)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
  return compactWhitespace(decodeHtmlEntities(html), maxChars)
}

const extractHtmlDocument = (html, maxChars = DEFAULT_TEXT_MAX_CHARS) => {
  const source = String(html || '')
  const titleMatch = source.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)
  const bodyMatch = source.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)
  return {
    title: compactWhitespace(stripHtmlTags(titleMatch ? titleMatch[1] : '', 300), 300),
    text: stripHtmlTags(bodyMatch ? bodyMatch[1] : source, maxChars)
  }
}

const getHtmlAttribute = (tag, attributeName) => {
  const escaped = String(attributeName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const expression = new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
  const match = String(tag || '').match(expression)
  return match ? decodeHtmlEntities(match[1] ?? match[2] ?? match[3] ?? '') : ''
}

const resolveDuckDuckGoResultUrl = (href) => {
  const raw = decodeHtmlEntities(href).trim()
  if (!raw || raw.length > MAX_URL_CHARS) return ''
  let parsed
  try { parsed = new URL(raw, 'https://duckduckgo.com/') } catch (error) { return '' }
  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if ((hostname === 'duckduckgo.com' || hostname.endsWith('.duckduckgo.com')) && parsed.pathname.startsWith('/l/')) {
    const target = parsed.searchParams.get('uddg')
    if (!target) return ''
    try { parsed = new URL(target) } catch (error) { return '' }
  }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port) return ''
  parsed.hash = ''
  try { return assertSafeHttpsUrl(parsed.toString()).toString() } catch (error) { return '' }
}

const parseDuckDuckGoResults = (html, { maxResults = DEFAULT_MAX_RESULTS, retrievedAt = new Date().toISOString() } = {}) => {
  const source = String(html || '')
  const limit = boundedInteger(maxResults, DEFAULT_MAX_RESULTS, 1, HARD_MAX_RESULTS)
  const anchors = []
  const anchorPattern = /<a\b[^>]*\bclass\s*=\s*(?:"[^"]*(?:result__a|result-link)[^"]*"|'[^']*(?:result__a|result-link)[^']*'|[^\s>]*(?:result__a|result-link)[^\s>]*)[^>]*>[\s\S]*?<\/a\s*>/gi
  let match
  while ((match = anchorPattern.exec(source)) && anchors.length < limit * 4) {
    anchors.push({ index: match.index, end: anchorPattern.lastIndex, tag: match[0] })
  }

  const results = []
  const seen = new Set()
  for (let index = 0; index < anchors.length && results.length < limit; index++) {
    const anchor = anchors[index]
    const url = resolveDuckDuckGoResultUrl(getHtmlAttribute(anchor.tag, 'href'))
    if (!url || seen.has(url)) continue
    const title = stripHtmlTags(anchor.tag.replace(/^<a\b[^>]*>/i, '').replace(/<\/a\s*>$/i, ''), 300)
    if (!title) continue
    const nextIndex = anchors[index + 1] ? anchors[index + 1].index : Math.min(source.length, anchor.end + 6000)
    const vicinity = source.slice(anchor.end, nextIndex)
    const snippetMatch = vicinity.match(/<(?:a|div|span|td)\b[^>]*\bclass\s*=\s*(?:"[^"]*(?:result__snippet|result-snippet)[^"]*"|'[^']*(?:result__snippet|result-snippet)[^']*'|[^\s>]*(?:result__snippet|result-snippet)[^\s>]*)[^>]*>([\s\S]*?)<\/(?:a|div|span|td)\s*>/i)
    const text = stripHtmlTags(snippetMatch ? snippetMatch[1] : title, 1200) || title
    seen.add(url)
    results.push({ title, url, text, retrievedAt })
  }
  return results
}

const ipv4ToInteger = (value) => {
  if (net.isIP(value) !== 4) return null
  return value.split('.').reduce((total, part) => ((total << 8) + Number(part)) >>> 0, 0) >>> 0
}

const ipv4InRange = (value, base, prefix) => {
  const candidate = ipv4ToInteger(value)
  const network = ipv4ToInteger(base)
  if (candidate === null || network === null) return false
  if (prefix === 0) return true
  const mask = (0xffffffff << (32 - prefix)) >>> 0
  return (candidate & mask) === (network & mask)
}

const ipv6ToBigInt = (value) => {
  let source = String(value || '').toLowerCase().replace(/^\[|\]$/g, '')
  if (source.includes('%') || net.isIP(source) !== 6) return null
  if (source.includes('.')) {
    const separator = source.lastIndexOf(':')
    const ipv4 = source.slice(separator + 1)
    const numeric = ipv4ToInteger(ipv4)
    if (numeric === null) return null
    source = `${source.slice(0, separator)}:${(numeric >>> 16).toString(16)}:${(numeric & 0xffff).toString(16)}`
  }
  const halves = source.split('::')
  if (halves.length > 2) return null
  const left = halves[0] ? halves[0].split(':') : []
  const right = halves.length === 2 && halves[1] ? halves[1].split(':') : []
  if (halves.length === 1 && left.length !== 8) return null
  const missing = 8 - left.length - right.length
  if (missing < 0 || (halves.length === 2 && missing < 1)) return null
  const parts = [...left, ...Array(missing).fill('0'), ...right]
  if (parts.length !== 8 || parts.some(part => !/^[0-9a-f]{1,4}$/.test(part))) return null
  return parts.reduce((total, part) => (total << 16n) + BigInt(Number.parseInt(part, 16)), 0n)
}

const ipv6InRange = (value, base, prefix) => {
  const candidate = ipv6ToBigInt(value)
  const network = ipv6ToBigInt(base)
  if (candidate === null || network === null) return false
  if (prefix === 0) return true
  const shift = BigInt(128 - prefix)
  return (candidate >> shift) === (network >> shift)
}

const BLOCKED_IPV4_RANGES = [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
  ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
  ['192.88.99.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24],
  ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4]
]

const BLOCKED_IPV6_RANGES = [
  ['2001::', 23], ['2001:2::', 48], ['2001:db8::', 32], ['2002::', 16], ['3ffe::', 16], ['3fff::', 20]
]

const isPublicIpAddress = (value) => {
  const address = String(value || '').trim().replace(/^\[|\]$/g, '')
  const family = net.isIP(address)
  if (family === 4) return !BLOCKED_IPV4_RANGES.some(([base, prefix]) => ipv4InRange(address, base, prefix))
  if (family !== 6) return false
  // Current globally routable unicast space is 2000::/3. Explicitly reject its special-use subnets.
  if (!ipv6InRange(address, '2000::', 3)) return false
  return !BLOCKED_IPV6_RANGES.some(([base, prefix]) => ipv6InRange(address, base, prefix))
}

const normalizeHostname = (value) => String(value || '').trim().toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '')

const assertSafeHttpsUrl = (value) => {
  const raw = String(value || '').trim()
  if (!raw || raw.length > MAX_URL_CHARS) throw new KnxAiWebAccessError('INVALID_URL', 'A valid HTTPS URL is required')
  let parsed
  try { parsed = new URL(raw) } catch (error) { throw new KnxAiWebAccessError('INVALID_URL', 'A valid HTTPS URL is required') }
  if (parsed.protocol !== 'https:') throw new KnxAiWebAccessError('UNSAFE_PROTOCOL', 'Only HTTPS web addresses are allowed')
  if (parsed.username || parsed.password) throw new KnxAiWebAccessError('URL_CREDENTIALS', 'Web addresses containing credentials are not allowed')
  if (parsed.port && parsed.port !== '443') throw new KnxAiWebAccessError('UNSAFE_PORT', 'Only the standard HTTPS port is allowed')
  const hostname = normalizeHostname(parsed.hostname)
  if (!hostname || hostname.length > 253 || hostname.includes('%')) throw new KnxAiWebAccessError('INVALID_HOST', 'The web address has an invalid host')
  if (net.isIP(hostname)) {
    if (!isPublicIpAddress(hostname)) throw new KnxAiWebAccessError('NON_PUBLIC_TARGET', 'Private, local, and reserved web addresses are not allowed')
  } else {
    const localSuffixes = ['localhost', 'local', 'lan', 'internal', 'home', 'home.arpa', 'test', 'invalid', 'example']
    if (!hostname.includes('.') || localSuffixes.some(suffix => hostname === suffix || hostname.endsWith(`.${suffix}`))) {
      throw new KnxAiWebAccessError('NON_PUBLIC_TARGET', 'Private, local, and reserved web addresses are not allowed')
    }
  }
  parsed.hash = ''
  return parsed
}

const normalizeDnsRecords = (value) => {
  const source = Array.isArray(value) ? value : [value]
  const records = []
  const seen = new Set()
  for (const item of source) {
    const address = typeof item === 'string' ? item : item && item.address
    const normalized = String(address || '').trim().replace(/^\[|\]$/g, '')
    const family = net.isIP(normalized)
    if (!family) throw new KnxAiWebAccessError('DNS_INVALID', 'The web address returned an invalid DNS response')
    const key = `${family}:${normalized}`
    if (!seen.has(key)) records.push({ address: normalized, family })
    seen.add(key)
  }
  if (!records.length || records.length > 32) throw new KnxAiWebAccessError('DNS_INVALID', 'The web address returned an invalid DNS response')
  return records
}

const defaultDnsLookup = async (hostname) => dns.promises.lookup(hostname, { all: true, verbatim: true })

const runWithTimeout = async (factory, timeoutMs, message) => {
  const controller = new AbortController()
  let timer
  try {
    return await new Promise((resolve, reject) => {
      let settled = false
      timer = setTimeout(() => {
        if (settled) return
        settled = true
        controller.abort()
        reject(new KnxAiWebAccessError('TIMEOUT', message))
      }, timeoutMs)
      Promise.resolve()
        .then(() => factory(controller.signal))
        .then(value => {
          if (settled) return
          settled = true
          resolve(value)
        }, error => {
          if (settled) return
          settled = true
          reject(error)
        })
    })
  } finally {
    clearTimeout(timer)
  }
}

const resolvePublicTarget = async (parsedUrl, { dnsLookup, timeoutMs }) => {
  const hostname = normalizeHostname(parsedUrl.hostname)
  if (net.isIP(hostname)) return [{ address: hostname, family: net.isIP(hostname) }]
  let rawRecords
  try {
    rawRecords = await runWithTimeout(
      () => dnsLookup(hostname, { all: true, verbatim: true }),
      timeoutMs,
      'DNS lookup timed out'
    )
  } catch (error) {
    if (error instanceof KnxAiWebAccessError) throw error
    throw new KnxAiWebAccessError('DNS_FAILED', 'The web address could not be resolved')
  }
  const records = normalizeDnsRecords(rawRecords)
  if (records.some(record => !isPublicIpAddress(record.address))) {
    throw new KnxAiWebAccessError('NON_PUBLIC_TARGET', 'The web address resolves to a private, local, or reserved network')
  }
  return records.sort((left, right) => left.family - right.family)
}

const getHeader = (headers, name) => {
  if (!headers) return ''
  if (typeof headers.get === 'function') return String(headers.get(name) || '')
  const normalized = String(name || '').toLowerCase()
  const entry = Object.entries(headers).find(([key]) => String(key).toLowerCase() === normalized)
  if (!entry) return ''
  return Array.isArray(entry[1]) ? String(entry[1][0] || '') : String(entry[1] || '')
}

const defaultPinnedHttpsTransport = ({ url, resolvedAddress, headers, timeoutMs, maxBytes, signal }) => new Promise((resolve, reject) => {
  let settled = false
  const finish = (error, response) => {
    if (settled) return
    settled = true
    if (signal) signal.removeEventListener('abort', abort)
    if (error) reject(error)
    else resolve(response)
  }
  const abort = () => {
    request.destroy(new KnxAiWebAccessError('TIMEOUT', 'Web request timed out'))
  }
  const lookup = (_hostname, options, callback) => {
    if (typeof options === 'function') callback = options
    const wantsAll = options && typeof options === 'object' && options.all
    if (wantsAll) callback(null, [resolvedAddress])
    else callback(null, resolvedAddress.address, resolvedAddress.family)
  }
  const request = https.request(url, {
    method: 'GET',
    agent: false,
    headers,
    lookup,
    rejectUnauthorized: true
  }, response => {
    const statusCode = Number(response.statusCode) || 0
    if (statusCode >= 300 && statusCode < 400) {
      response.destroy()
      return finish(null, { statusCode, headers: response.headers, body: Buffer.alloc(0) })
    }
    if (statusCode < 200 || statusCode >= 300) {
      response.destroy()
      return finish(null, { statusCode, headers: response.headers, body: Buffer.alloc(0) })
    }
    const declaredLength = Number(getHeader(response.headers, 'content-length'))
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      response.destroy()
      return finish(new KnxAiWebAccessError('RESPONSE_TOO_LARGE', 'The web response exceeds the size limit'))
    }
    const chunks = []
    let total = 0
    response.on('data', chunk => {
      if (settled) return
      const buffer = Buffer.from(chunk)
      total += buffer.length
      if (total > maxBytes) {
        response.destroy()
        finish(new KnxAiWebAccessError('RESPONSE_TOO_LARGE', 'The web response exceeds the size limit'))
        return
      }
      chunks.push(buffer)
    })
    response.on('end', () => finish(null, { statusCode, headers: response.headers, body: Buffer.concat(chunks) }))
    response.on('error', error => finish(error))
  })
  request.setTimeout(timeoutMs, abort)
  request.on('error', error => finish(error))
  if (signal) {
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  }
  request.end()
})

const isTextualMimeType = (value) => {
  const mimeType = String(value || '').split(';')[0].trim().toLowerCase()
  if (mimeType.startsWith('text/')) return true
  if (!mimeType.startsWith('application/')) return false
  return mimeType === 'application/json' || mimeType.endsWith('+json') ||
    mimeType === 'application/xml' || mimeType.endsWith('+xml')
}

const responseBodyToBuffer = (body) => {
  if (Buffer.isBuffer(body)) return body
  if (body instanceof Uint8Array) return Buffer.from(body)
  if (typeof body === 'string') return Buffer.from(body, 'utf8')
  if (body === undefined || body === null) return Buffer.alloc(0)
  throw new KnxAiWebAccessError('INVALID_RESPONSE', 'The web server returned an invalid response')
}

const requestTextWithRedirects = async (initialUrl, options) => {
  let current = assertSafeHttpsUrl(initialUrl)
  const deadline = Date.now() + options.timeoutMs
  const remainingTimeout = () => {
    const remaining = deadline - Date.now()
    if (remaining <= 0) throw new KnxAiWebAccessError('TIMEOUT', 'Web request timed out')
    return remaining
  }
  for (let redirects = 0; redirects <= options.maxRedirects; redirects++) {
    const resolvedAddresses = await resolvePublicTarget(current, {
      ...options,
      timeoutMs: remainingTimeout()
    })
    let response
    try {
      const timeoutMs = remainingTimeout()
      response = await runWithTimeout(
        signal => options.transport({
          url: current.toString(),
          resolvedAddress: resolvedAddresses[0],
          resolvedAddresses,
          headers: options.headers,
          timeoutMs,
          maxBytes: options.maxBytes,
          signal
        }),
        timeoutMs,
        'Web request timed out'
      )
    } catch (error) {
      if (error instanceof KnxAiWebAccessError) throw error
      throw new KnxAiWebAccessError('REQUEST_FAILED', 'The web request failed')
    }

    const statusCode = Number(response && (response.statusCode ?? response.status)) || 0
    if (statusCode >= 300 && statusCode < 400) {
      const location = getHeader(response.headers, 'location')
      if (!location) throw new KnxAiWebAccessError('INVALID_REDIRECT', 'The web server returned an invalid redirect')
      if (redirects >= options.maxRedirects) throw new KnxAiWebAccessError('TOO_MANY_REDIRECTS', 'The web request exceeded the redirect limit')
      let redirected
      try { redirected = new URL(location, current) } catch (error) { throw new KnxAiWebAccessError('INVALID_REDIRECT', 'The web server returned an invalid redirect') }
      current = assertSafeHttpsUrl(redirected.toString())
      continue
    }
    if (statusCode < 200 || statusCode >= 300) throw new KnxAiWebAccessError('HTTP_ERROR', `The web server returned HTTP ${statusCode || 'error'}`)
    const contentEncoding = getHeader(response.headers, 'content-encoding').trim().toLowerCase()
    if (contentEncoding && contentEncoding !== 'identity') throw new KnxAiWebAccessError('UNSUPPORTED_ENCODING', 'The web server returned an unsupported content encoding')
    const contentType = getHeader(response.headers, 'content-type')
    if (!isTextualMimeType(contentType)) throw new KnxAiWebAccessError('UNSUPPORTED_MIME', 'Only textual web content can be opened')
    const body = responseBodyToBuffer(response.body)
    const declaredLength = Number(getHeader(response.headers, 'content-length'))
    if (body.length > options.maxBytes || (Number.isFinite(declaredLength) && declaredLength > options.maxBytes)) {
      throw new KnxAiWebAccessError('RESPONSE_TOO_LARGE', 'The web response exceeds the size limit')
    }
    return {
      body: body.toString('utf8'),
      contentType: contentType.split(';')[0].trim().toLowerCase(),
      statusCode,
      url: current.toString()
    }
  }
  throw new KnxAiWebAccessError('TOO_MANY_REDIRECTS', 'The web request exceeded the redirect limit')
}

/**
 * Normalize the explicit, provider-independent web action contract used by the AI runtime.
 * No query classification or intent/keyword routing happens here.
 */
const normalizeKnxAiWebActions = (value, { maxActions = DEFAULT_MAX_ACTIONS } = {}) => {
  let source = value
  if (typeof source === 'string') {
    try { source = JSON.parse(source) } catch (error) { return [] }
  }
  if (source && !Array.isArray(source) && Array.isArray(source.webActions)) source = source.webActions
  if (!Array.isArray(source)) source = source && typeof source === 'object' ? [source] : []
  const limit = boundedInteger(maxActions, DEFAULT_MAX_ACTIONS, 0, HARD_MAX_ACTIONS)
  const normalized = []
  for (const candidate of source) {
    if (normalized.length >= limit) break
    if (!candidate || typeof candidate !== 'object') continue
    const rawOperation = String(candidate.operation || candidate.type || candidate.action || '').trim().toLowerCase().replace(/[ -]+/g, '_')
    const operation = rawOperation === 'open_url' ? 'open' : rawOperation
    if (operation === 'search') {
      const query = compactWhitespace(candidate.query, MAX_QUERY_CHARS)
      if (query) normalized.push({ operation, query, maxResults: boundedInteger(candidate.maxResults, DEFAULT_MAX_RESULTS, 1, HARD_MAX_RESULTS) })
    } else if (operation === 'open') {
      const url = String(candidate.url || '').trim().slice(0, MAX_URL_CHARS + 1)
      if (url) normalized.push({ operation, url })
    }
  }
  return normalized
}

const normalizeSearchEndpoints = (value) => {
  const source = Array.isArray(value) && value.length ? value : DEFAULT_SEARCH_ENDPOINTS
  return source.slice(0, 3).map(endpoint => assertSafeHttpsUrl(endpoint).toString())
}

/**
 * Build an isolated web client. dnsLookup, transport and now are injectable for deterministic tests.
 * A custom transport must connect to resolvedAddress while retaining url's host for TLS verification.
 */
const createKnxAiWebAccess = (options = {}) => {
  const timeoutMs = boundedInteger(options.timeoutMs, DEFAULT_TIMEOUT_MS, 10, 60000)
  const maxRedirects = boundedInteger(options.maxRedirects, DEFAULT_MAX_REDIRECTS, 0, HARD_MAX_REDIRECTS)
  const dnsLookup = typeof options.dnsLookup === 'function' ? options.dnsLookup : defaultDnsLookup
  const transport = typeof options.transport === 'function' ? options.transport : defaultPinnedHttpsTransport
  const now = typeof options.now === 'function' ? options.now : () => new Date()
  const maxTextChars = boundedInteger(options.maxTextChars, DEFAULT_TEXT_MAX_CHARS, 100, 100000)
  const searchMaxBytes = boundedInteger(options.searchMaxBytes ?? options.maxBytes, DEFAULT_SEARCH_MAX_BYTES, 1, HARD_MAX_BYTES)
  const openMaxBytes = boundedInteger(options.openMaxBytes ?? options.maxBytes, DEFAULT_OPEN_MAX_BYTES, 1, HARD_MAX_BYTES)
  const searchEndpoints = normalizeSearchEndpoints(options.searchEndpoints)
  const baseHeaders = {
    accept: 'text/html,application/xhtml+xml,text/plain,application/json;q=0.8,application/xml;q=0.7',
    'accept-encoding': 'identity',
    'user-agent': compactWhitespace(options.userAgent || DEFAULT_USER_AGENT, 300)
  }

  const open = async (url) => {
    const response = await requestTextWithRedirects(url, {
      dnsLookup,
      headers: baseHeaders,
      maxBytes: openMaxBytes,
      maxRedirects,
      timeoutMs,
      transport
    })
    const retrievedAt = now().toISOString()
    const html = response.contentType === 'text/html' || response.contentType === 'application/xhtml+xml'
    const extracted = html
      ? extractHtmlDocument(response.body, maxTextChars)
      : { title: '', text: compactWhitespace(response.body, maxTextChars) }
    const finalUrl = assertSafeHttpsUrl(response.url)
    return {
      operation: 'open',
      ok: true,
      url: finalUrl.toString(),
      title: extracted.title || normalizeHostname(finalUrl.hostname),
      text: extracted.text,
      retrievedAt
    }
  }

  const search = async (query, maxResults = DEFAULT_MAX_RESULTS) => {
    const normalizedQuery = compactWhitespace(query, MAX_QUERY_CHARS)
    if (!normalizedQuery) throw new KnxAiWebAccessError('INVALID_QUERY', 'A search query is required')
    let lastError = null
    for (const endpoint of searchEndpoints) {
      const searchUrl = new URL(endpoint)
      searchUrl.searchParams.set('q', normalizedQuery)
      try {
        const response = await requestTextWithRedirects(searchUrl.toString(), {
          dnsLookup,
          headers: baseHeaders,
          maxBytes: searchMaxBytes,
          maxRedirects,
          timeoutMs,
          transport
        })
        const retrievedAt = now().toISOString()
        const results = parseDuckDuckGoResults(response.body, { maxResults, retrievedAt })
        if (results.length) {
          return { operation: 'search', ok: true, query: normalizedQuery, results, retrievedAt }
        }
        lastError = new KnxAiWebAccessError('NO_RESULTS', 'The web search returned no usable results')
      } catch (error) {
        lastError = error
      }
    }
    throw lastError || new KnxAiWebAccessError('SEARCH_FAILED', 'The web search failed')
  }

  const executeAction = async (action) => {
    const retrievedAt = now().toISOString()
    try {
      if (action.operation === 'search') return await search(action.query, action.maxResults)
      if (action.operation === 'open') return await open(action.url)
      throw new KnxAiWebAccessError('UNSUPPORTED_OPERATION', 'Unsupported web operation')
    } catch (error) {
      const message = error instanceof KnxAiWebAccessError ? error.message : 'The web operation failed'
      return {
        operation: action.operation,
        ok: false,
        ...(action.query ? { query: action.query } : {}),
        ...(action.url ? { url: action.url } : {}),
        retrievedAt,
        error: message
      }
    }
  }

  return { executeAction, open, search }
}

/**
 * Execute normalized actions sequentially and return one bounded result envelope per valid action.
 */
const executeKnxAiWebActions = async (actions, options = {}) => {
  const normalized = normalizeKnxAiWebActions(actions, { maxActions: options.maxActions })
  const access = createKnxAiWebAccess(options)
  const results = []
  for (const action of normalized) results.push(await access.executeAction(action))
  return results
}

module.exports = {
  createKnxAiWebAccess,
  executeKnxAiWebActions,
  normalizeKnxAiWebActions,
  __test: {
    KnxAiWebAccessError,
    assertSafeHttpsUrl,
    compactWhitespace,
    decodeHtmlEntities,
    extractHtmlDocument,
    getHeader,
    ipv4InRange,
    ipv6InRange,
    isPublicIpAddress,
    isTextualMimeType,
    normalizeDnsRecords,
    parseDuckDuckGoResults,
    requestTextWithRedirects,
    resolveDuckDuckGoResultUrl,
    stripHtmlTags
  }
}
