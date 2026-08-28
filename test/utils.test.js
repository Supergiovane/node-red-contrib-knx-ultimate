const { expect } = require('chai')
const net = require('net')
const { ToBoolean, fetchFromObject } = require('../nodes/utils/utils')
const { resolveHostAddress } = require('../nodes/knxUltimate-config').__test
const {
  cookieHeaderFromResponse,
  defaultDistTag,
  extractCsrfToken,
  flowPageHasVersion,
  parseArgs
} = require('../scripts/publish-and-refresh')

describe('utils – ToBoolean', () => {
  describe('boolean input', () => {
    it('returns true as-is', () => {
      expect(ToBoolean(true, null)).to.equal(true)
    })

    it('returns false as-is', () => {
      expect(ToBoolean(false, null)).to.equal(false)
    })
  })

  describe('string input with default translation table', () => {
    const cases = [
      ['on', true],
      ['off', false],
      ['active', true],
      ['inactive', false],
      ['open', true],
      ['closed', false],
      ['close', false],
      ['1', true],
      ['0', false],
      ['true', true],
      ['false', false],
      ['home', true],
      ['not_home', false],
      ['normal', false],
      ['violated', true]
    ]

    cases.forEach(([input, expected]) => {
      it(`"${input}" → ${expected}`, () => {
        expect(ToBoolean(input, null)).to.equal(expected)
      })
    })

    it('is case-insensitive', () => {
      expect(ToBoolean('ON', null)).to.equal(true)
      expect(ToBoolean('OFF', null)).to.equal(false)
      expect(ToBoolean('Active', null)).to.equal(true)
    })
  })

  describe('string input with custom translation table', () => {
    const customConfig = { commandText: 'yes:true\nno:false\nmaybe:false' }

    it('maps "yes" to true using custom table', () => {
      expect(ToBoolean('yes', customConfig)).to.equal(true)
    })

    it('maps "no" to false using custom table', () => {
      expect(ToBoolean('no', customConfig)).to.equal(false)
    })
  })

  describe('numeric input', () => {
    it('returns true for non-zero number', () => {
      expect(ToBoolean(1, null)).to.equal(true)
      expect(ToBoolean(42, null)).to.equal(true)
    })

    it('returns false for zero', () => {
      expect(ToBoolean(0, null)).to.equal(false)
    })
  })
})

describe('utils – fetchFromObject', () => {
  it('returns a top-level primitive property', () => {
    expect(fetchFromObject({ payload: 'hello' }, 'payload')).to.equal('hello')
  })

  it('returns a nested primitive using dot notation', () => {
    const msg = { knx: { destination: '1/1/1' } }
    expect(fetchFromObject(msg, 'knx.destination')).to.equal('1/1/1')
  })

  it('returns undefined when the leaf value is an object', () => {
    const msg = { knx: { nested: { deep: 1 } } }
    expect(fetchFromObject(msg, 'knx')).to.equal(undefined)
  })

  it('returns undefined for a missing key', () => {
    expect(fetchFromObject({}, 'missing')).to.equal(undefined)
  })

  it('handles three levels of nesting', () => {
    const msg = { a: { b: { c: 99 } } }
    expect(fetchFromObject(msg, 'a.b.c')).to.equal(99)
  })
})

describe('KNX Ultimate config DNS lookup', () => {
  it('resolves localhost through the native implementation', async () => {
    const address = await resolveHostAddress('localhost')

    expect(net.isIP(address)).to.be.oneOf([4, 6])
  })

  it('uses the OS resolver in verbatim order and returns its first address', async () => {
    const calls = []
    const address = await resolveHostAddress('gateway.example', async (hostname, options) => {
      calls.push({ hostname, options })
      return { address: '192.0.2.10', family: 4 }
    })

    expect(address).to.equal('192.0.2.10')
    expect(calls).to.deep.equal([
      {
        hostname: 'gateway.example',
        options: { order: 'verbatim' }
      }
    ])
  })

  it('propagates lookup failures to the config-node connection guard', async () => {
    const lookupError = new Error('host not found')

    try {
      await resolveHostAddress('missing.example', async () => { throw lookupError })
      throw new Error('Expected DNS lookup to fail')
    } catch (error) {
      expect(error).to.equal(lookupError)
    }
  })
})

describe('release publishing helpers', () => {
  it('selects beta for prereleases and latest for stable versions', () => {
    expect(defaultDistTag('6.3.1-beta.1')).to.equal('beta')
    expect(defaultDistTag('6.4.0')).to.equal('latest')
  })

  it('parses safe release and recovery options', () => {
    expect(parseArgs(['--tag', 'beta', '--skip-tests'])).to.include({
      skipTests: true,
      tag: 'beta'
    })
    expect(parseArgs(['--refresh-only']).refreshOnly).to.equal(true)
    expect(() => parseArgs(['--dry-run', '--refresh-only'])).to.throw('cannot be used together')
    expect(() => parseArgs(['--unknown'])).to.throw('Unknown option')
  })

  it('extracts the Flow Library CSRF token without persisting credentials', () => {
    const html = '<form><input id="add-node-csrf" name="_csrf" type="hidden" value="temporary-token"></form>'
    expect(extractCsrfToken(html)).to.equal('temporary-token')
    expect(extractCsrfToken('<form></form>')).to.equal(null)
  })

  it('converts Set-Cookie response values into one request Cookie header', () => {
    const response = {
      headers: {
        getSetCookie: () => [
          '_csrf=session-value; Path=/',
          '__cf_bm=cloudflare-value; HttpOnly; Secure'
        ]
      }
    }
    expect(cookieHeaderFromResponse(response)).to.equal('_csrf=session-value; __cf_bm=cloudflare-value')
  })

  it('recognizes the published version in the Flow Library page', () => {
    const html = '<h1>node-red-contrib-knx-ultimate 6.4.0</h1><div>Version: 6.4.0</div>'
    expect(flowPageHasVersion(html, 'node-red-contrib-knx-ultimate', '6.4.0')).to.equal(true)
    expect(flowPageHasVersion(html, 'node-red-contrib-knx-ultimate', '6.3.0')).to.equal(false)
  })
})
