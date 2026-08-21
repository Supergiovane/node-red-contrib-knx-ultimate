const { expect } = require('chai')
const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const registerWatchDogRuntime = require('../nodes/knxUltimateWatchDog')
const dispatchWatchDogNodeError = require('../nodes/utils/watchDogErrorDispatcher')

function createWatchDog (config = {}) {
  let WatchDogConstructor
  const sent = []
  const clients = []
  const server = {
    host: '127.0.0.1',
    nodeClients: clients,
    addClient: client => clients.push(client),
    removeClient: client => {
      const index = clients.indexOf(client)
      if (index !== -1) clients.splice(index, 1)
    },
    reportDeviceError: error => dispatchWatchDogNodeError(server, error)
  }
  const RED = {
    nodes: {
      createNode: node => {
        const emitter = new EventEmitter()
        node.id = 'watchdog-1'
        node.on = emitter.on.bind(emitter)
        node.once = emitter.once.bind(emitter)
        node.emit = emitter.emit.bind(emitter)
        node.send = msg => sent.push(msg)
        node.status = () => {}
      },
      getNode: () => server,
      registerType: (type, constructor) => {
        expect(type).to.equal('knxUltimateWatchDog')
        WatchDogConstructor = constructor
      }
    }
  }

  registerWatchDogRuntime(RED)
  const node = new WatchDogConstructor({
    server: 'gateway-1',
    topic: '12/0/0',
    autoStart: false,
    ...config
  })

  return { node, sent, server }
}

describe('KNX Ultimate Watchdog node-error listener', () => {
  const deviceError = {
    nodeid: 'device-1',
    topic: '1/1/1',
    devicename: 'Kitchen light',
    GA: '1/1/1',
    text: 'KNX device error'
  }

  it('keeps listening enabled for existing flows without the new property', () => {
    const { node, sent } = createWatchDog()

    expect(node.listenToKnxUltimateNodeErrors).to.equal(true)
    node.signalNodeErrorCalledByConfigNode(deviceError)

    expect(sent).to.have.length(1)
    expect(sent[0]).to.deep.include({
      type: 'NodeError',
      checkPerformed: 'Self KNX-Ultimate node reporting a red color status',
      nodeid: 'device-1',
      payload: true,
      description: 'KNX device error',
      completeError: deviceError
    })
  })

  it('suppresses KNX-Ultimate node errors when listening is disabled', () => {
    const { node, sent } = createWatchDog({ listenToKnxUltimateNodeErrors: false })

    node.signalNodeErrorCalledByConfigNode(deviceError)

    expect(node.listenToKnxUltimateNodeErrors).to.equal(false)
    expect(sent).to.deep.equal([])
    expect(node.alreadyNotifiedArray).to.deep.equal([])
  })

  it('also accepts the string false used by imported flows', () => {
    const { node, sent } = createWatchDog({ listenToKnxUltimateNodeErrors: 'false' })

    node.signalNodeErrorCalledByConfigNode(deviceError)

    expect(node.listenToKnxUltimateNodeErrors).to.equal(false)
    expect(sent).to.deep.equal([])
  })

  it('filters disabled Watchdogs and isolates a failing listener in the gateway dispatcher', () => {
    const delivered = []
    const logged = []
    const configNode = {
      nodeClients: [
        {
          id: 'disabled',
          isWatchDog: true,
          listenToKnxUltimateNodeErrors: 'false',
          signalNodeErrorCalledByConfigNode: () => delivered.push('disabled')
        },
        {
          id: 'broken',
          isWatchDog: true,
          listenToKnxUltimateNodeErrors: true,
          signalNodeErrorCalledByConfigNode: () => { throw new Error('listener failed') }
        },
        {
          id: 'healthy',
          isWatchDog: true,
          listenToKnxUltimateNodeErrors: true,
          signalNodeErrorCalledByConfigNode: error => delivered.push(error)
        }
      ],
      sysLogger: { error: message => logged.push(message) }
    }

    dispatchWatchDogNodeError(configNode, deviceError)

    expect(delivered).to.deep.equal([deviceError])
    expect(logged).to.have.length(1)
    expect(logged[0]).to.include('broken')
  })

  it('registers an error-only listener without requiring a monitoring group address', () => {
    const { sent, server } = createWatchDog({
      topic: '',
      checkLevel: 'Eth+KNX',
      listenToKnxUltimateNodeErrors: true
    })

    server.reportDeviceError(deviceError)

    expect(sent).to.have.length(1)
    expect(sent[0].type).to.equal('NodeError')
  })

  it('does not start an Eth+KNX timer when an error-only listener has no group address', () => {
    const originalSetInterval = global.setInterval
    let intervalStarted = false

    try {
      global.setInterval = () => {
        intervalStarted = true
        return 123456
      }
      const { sent, server } = createWatchDog({
        topic: '',
        autoStart: true,
        checkLevel: 'Eth+KNX',
        listenToKnxUltimateNodeErrors: true
      })

      server.reportDeviceError(deviceError)

      expect(intervalStarted).to.equal(false)
      expect(sent).to.have.length(1)
      expect(sent[0].type).to.equal('NodeError')
    } finally {
      global.setInterval = originalSetInterval
    }
  })

  it('keeps the Watchdog bus check active when device-error listening is disabled', () => {
    const originalSetInterval = global.setInterval
    let tick
    let node

    try {
      global.setInterval = callback => {
        tick = callback
        return 123456
      }
      const instance = createWatchDog({
        autoStart: true,
        checkLevel: 'Eth+KNX',
        maxRetry: 0,
        listenToKnxUltimateNodeErrors: false
      })
      node = instance.node

      tick()

      expect(instance.sent).to.have.length(1)
      expect(instance.sent[0]).to.deep.include({
        type: 'BUSError',
        checkPerformed: 'Eth+KNX',
        payload: true
      })
    } finally {
      if (node) node.emit('close', () => {})
      global.setInterval = originalSetInterval
    }
  })

  it('preserves duplicate suppression for identical device errors', () => {
    const { node, sent } = createWatchDog()

    node.signalNodeErrorCalledByConfigNode(deviceError)
    node.signalNodeErrorCalledByConfigNode(deviceError)

    expect(sent).to.have.length(1)
  })

  it('declares the editor option as a default-on checkbox', () => {
    const editorPath = path.join(__dirname, '..', 'nodes', 'knxUltimateWatchDog.html')
    const editor = fs.readFileSync(editorPath, 'utf8')
    const registrationScript = [...editor.matchAll(/<script type="text\/javascript"[^>]*>([\s\S]*?)<\/script>/g)]
      .map(match => match[1])
      .find(script => script.includes("registerType('knxUltimateWatchDog'"))
    let definition

    vm.runInNewContext(registrationScript, {
      RED: {
        nodes: {
          registerType: (type, registeredDefinition) => {
            expect(type).to.equal('knxUltimateWatchDog')
            definition = registeredDefinition
          }
        }
      }
    })

    expect(definition.defaults.listenToKnxUltimateNodeErrors.value).to.equal(true)
    expect(editor).to.include('type="checkbox" id="node-input-listenToKnxUltimateNodeErrors"')
  })

  it('documents the option in every supported locale and wiki page', () => {
    const projectRoot = path.join(__dirname, '..')
    const locales = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']

    locales.forEach(locale => {
      const messages = require(path.join(projectRoot, 'nodes', 'locales', locale, 'knxUltimateWatchDog.json'))
      const label = messages.knxUltimateWatchDog.properties['node-input-listenToKnxUltimateNodeErrors']
      const help = fs.readFileSync(path.join(projectRoot, 'nodes', 'locales', locale, 'knxUltimateWatchDog.html'), 'utf8')
      const wikiName = locale === 'en' ? 'WatchDog-Configuration.md' : `${locale}-WatchDog-Configuration.md`
      const wiki = fs.readFileSync(path.join(projectRoot, 'docs', 'wiki', wikiName), 'utf8')

      expect(label, `${locale}: editor label`).to.be.a('string').and.not.equal('')
      expect(help, `${locale}: node help`).to.include(label)
      expect(help, `${locale}: default behavior`).to.include('NodeError')
      expect(wiki, `${locale}: wiki`).to.include(label)
      expect(wiki, `${locale}: default behavior`).to.include('NodeError')
    })
  })
})
