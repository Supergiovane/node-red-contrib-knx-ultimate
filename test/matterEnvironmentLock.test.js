const { expect } = require('chai')

describe('matterEnvironmentLock – withEnvironmentLock', () => {
  let withEnvironmentLock

  before(async () => {
    ({ withEnvironmentLock } = await import('../nodes/utils/matterEnvironmentLock.mjs'))
  })

  it('runs queued calls strictly one at a time, in FIFO order', async () => {
    const order = []
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    let active = 0
    let maxActive = 0

    const task = (label, ms) => withEnvironmentLock(async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await delay(ms)
      order.push(label)
      active--
    })

    // Start three overlapping tasks "concurrently": the lock must still run them in order,
    // one at a time, exactly like two Matter engines racing to set Environment.default.vars.
    await Promise.all([task('a', 30), task('b', 10), task('c', 5)])

    expect(order).to.deep.equal(['a', 'b', 'c'])
    expect(maxActive).to.equal(1)
  })

  it('keeps serializing later calls even after an earlier task throws', async () => {
    const results = []
    await withEnvironmentLock(async () => { throw new Error('boom') }).catch((error) => { results.push(`caught:${error.message}`) })
    await withEnvironmentLock(async () => { results.push('after-throw') })

    expect(results).to.deep.equal(['caught:boom', 'after-throw'])
  })
})
