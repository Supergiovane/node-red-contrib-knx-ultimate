const { expect } = require('chai')

describe('hueEngine queue robustness', () => {
  let classHUE

  const makeSilentLogger = () => ({
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {}
  })

  before(async () => {
    const mod = await import('../nodes/utils/hueEngine.mjs')
    classHUE = mod.classHUE
  })

  it('preserves command sequence (no coalescing)', async () => {
    const hue = new classHUE('ip', 'user', 'key', 'bridge', makeSilentLogger(), { startQueue: false })

    await hue.writeHueQueueAdd('lamp-1', { on: { on: true } }, 'setLight')
    await hue.writeHueQueueAdd('lamp-1', { on: { on: false } }, 'setLight')
    await hue.writeHueQueueAdd('lamp-1', { on: { on: true } }, 'setLight')

    expect(hue.commandQueue).to.have.lengthOf(3)
    // unshift inserts at head, so newest at index 0
    expect(hue.commandQueue[0]._state).to.deep.equal({ on: { on: true } })
    expect(hue.commandQueue[1]._state).to.deep.equal({ on: { on: false } })
    expect(hue.commandQueue[2]._state).to.deep.equal({ on: { on: true } })
    await hue.close()
  })

  it('caps the queue length to avoid unbounded growth', async () => {
    const hue = new classHUE('ip', 'user', 'key', 'bridge', makeSilentLogger(), { startQueue: false })
    hue.queueMaxLength = 3

    for (let i = 0; i < 10; i += 1) {
      await hue.writeHueQueueAdd(`lamp-${i}`, { on: { on: true } }, 'setLight')
    }

    expect(hue.commandQueue).to.have.lengthOf(3)
    expect(hue.commandQueue[0]._lightID).to.equal('lamp-9')
    expect(hue.commandQueue[2]._lightID).to.equal('lamp-7')
    await hue.close()
  })

  it('drops the failing queue item when Hue returns device communication issues', async () => {
    const hue = new classHUE('ip', 'user', 'key', 'bridge', makeSilentLogger(), { startQueue: false })
    hue.HUEBridgeConnectionStatus = 'connected'

    const calls = []
    hue.hueApiV2 = {
      put: async (url) => {
        calls.push(url)
        if (url.includes('/resource/light/lamp-1')) {
          throw new Error(
            'The response for https://127.0.0.1/clip/v2/resource/light/lamp-1 returned errors ' +
              JSON.stringify([{ description: 'device (light) has communication issues, command (.on.on) may not have effect' }])
          )
        }
      },
      get: async () => []
    }

    await hue.writeHueQueueAdd('lamp-1', { on: { on: true } }, 'setLight')
    await hue.writeHueQueueAdd('lamp-2', { on: { on: true } }, 'setLight')
    expect(hue.commandQueue).to.have.lengthOf(2)

    await hue.processQueueItem() // lamp-1 fails, must be dropped
    expect(hue.commandQueue).to.have.lengthOf(1)

    await hue.processQueueItem() // lamp-2 succeeds
    expect(hue.commandQueue).to.have.lengthOf(0)
    expect(calls.some((item) => item.includes('/resource/light/lamp-1'))).to.equal(true)
    expect(calls.some((item) => item.includes('/resource/light/lamp-2'))).to.equal(true)
    await hue.close()
  })

  it('does not consume queued commands while disconnected', async () => {
    const hue = new classHUE('ip', 'user', 'key', 'bridge', makeSilentLogger(), { startQueue: false })
    hue.HUEBridgeConnectionStatus = 'disconnected'
    let putCalls = 0
    hue.hueApiV2 = { put: async () => { putCalls += 1 }, get: async () => [] }

    await hue.writeHueQueueAdd('lamp-1', { on: { on: true } }, 'setLight')
    await hue.processQueueItem()

    expect(putCalls).to.equal(0)
    expect(hue.commandQueue).to.have.lengthOf(1)
    await hue.close()
  })
})
