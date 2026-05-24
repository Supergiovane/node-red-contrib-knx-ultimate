const { expect } = require('chai')
const { Manipulate } = require('../nodes/utils/payloadManipulation')

function makeNode (overrides = {}) {
  return {
    formatmultiplyvalue: 1,
    formatdecimalsvalue: 999,
    formatnegativevalue: 'leave',
    ...overrides
  }
}

describe('payloadManipulation – Manipulate', () => {
  it('returns value unchanged when node is null', () => {
    expect(Manipulate(null, 42)).to.equal(42)
  })

  it('returns value unchanged when value is null', () => {
    expect(Manipulate(makeNode(), null)).to.equal(null)
  })

  it('returns non-number value unchanged even when node is configured', () => {
    const node = makeNode({ formatmultiplyvalue: 2, formatdecimalsvalue: 2 })
    expect(Manipulate(node, 'hello')).to.equal('hello')
    expect(Manipulate(node, true)).to.equal(true)
  })

  it('multiplies a numeric value by the configured factor', () => {
    const node = makeNode({ formatmultiplyvalue: 3, formatdecimalsvalue: 999 })
    expect(Manipulate(node, 5)).to.equal(15)
  })

  it('rounds to the configured number of decimal places', () => {
    const node = makeNode({ formatmultiplyvalue: 1, formatdecimalsvalue: 2 })
    expect(Manipulate(node, 1.23456)).to.equal(1.23)
  })

  it('does not round when formatdecimalsvalue is 999', () => {
    const node = makeNode({ formatmultiplyvalue: 1, formatdecimalsvalue: 999 })
    const result = Manipulate(node, 1.23456)
    expect(result).to.equal(1.23456)
  })

  it('rounds after multiplying', () => {
    const node = makeNode({ formatmultiplyvalue: 1.5, formatdecimalsvalue: 1 })
    expect(Manipulate(node, 3)).to.equal(4.5)
  })

  it('converts negative result to zero when formatnegativevalue is "zero"', () => {
    const node = makeNode({ formatmultiplyvalue: -1, formatdecimalsvalue: 0, formatnegativevalue: 'zero' })
    expect(Manipulate(node, 10)).to.equal(0)
  })

  it('converts negative result to absolute value when formatnegativevalue is "abs"', () => {
    const node = makeNode({ formatmultiplyvalue: -1, formatdecimalsvalue: 0, formatnegativevalue: 'abs' })
    expect(Manipulate(node, 7)).to.equal(7)
  })

  it('leaves negative result unchanged when formatnegativevalue is "leave"', () => {
    const node = makeNode({ formatmultiplyvalue: -1, formatdecimalsvalue: 999, formatnegativevalue: 'leave' })
    expect(Manipulate(node, 5)).to.equal(-5)
  })

  it('returns value unchanged when node is missing format properties', () => {
    expect(Manipulate({}, 42)).to.equal(42)
  })
})
