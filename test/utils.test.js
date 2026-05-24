const { expect } = require('chai')
const { ToBoolean, fetchFromObject } = require('../nodes/utils/utils')

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
