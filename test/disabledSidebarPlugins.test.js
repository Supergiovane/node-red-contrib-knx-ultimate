const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const { Writable } = require('stream')
const winston = require('winston')

const projectRoot = path.resolve(__dirname, '..')
const stripAnsi = (value) => value.replace(/\u001b\[[0-9;]*m/g, '')

describe('disabled KNX Debug and KNX Monitor sidebar plugins', () => {
  const packageJson = require('../package.json')
  const commonFunctionsSource = fs.readFileSync(path.join(projectRoot, 'nodes', 'commonFunctions.js'), 'utf8')
  const LoggerClass = require('../nodes/utils/sysLogger')

  it('does not register or package the combined sidebar plugin', () => {
    const plugins = packageJson['node-red'].plugins

    expect(plugins).not.to.have.property('knxUltimateMonitorSidebar')
    expect(plugins).to.have.property('commonFunctions', '/nodes/commonFunctions.js')
    expect(plugins).to.have.property('knxUltimateFlowBubbles', '/nodes/plugins/knxUltimate-flow-bubbles-plugin.html')
    expect(fs.existsSync(path.join(projectRoot, 'nodes', 'plugins', 'knxUltimateMonitor-sidebar-plugin.html'))).to.equal(false)
  })

  it('does not expose the removed monitor and debug admin endpoints', () => {
    expect(commonFunctionsSource).not.to.include("'/knxUltimateMonitor'")
    expect(commonFunctionsSource).not.to.include("'/knxUltimateMonitorToggle'")
    expect(commonFunctionsSource).not.to.include("'/knxUltimateDebugLog'")
  })

  it('keeps normal logging without the removed global debug buffer API', () => {
    expect(LoggerClass).not.to.have.property('getDebugSnapshot')
    expect(LoggerClass).not.to.have.property('clearDebugBuffer')
    expect(LoggerClass).not.to.have.property('DEBUG_BUFFER_LIMIT')
    expect(() => new LoggerClass({ loglevel: 'disable', setPrefix: 'sidebar-removal-test' })).not.to.throw()
  })
})

describe('sysLogger Winston adapter', () => {
  const packageJson = require('../package.json')
  const LoggerClass = require('../nodes/utils/sysLogger')

  it('uses Winston directly and no longer depends on node-color-log', () => {
    expect(packageJson.dependencies.winston).to.equal('^3.17.0')
    expect(packageJson.dependencies).not.to.have.property('node-color-log')
  })

  it('normalizes legacy levels without enabling disabled loggers', () => {
    const traceLogger = new LoggerClass({ loglevel: 'trace', setPrefix: 'trace-test' })
    const silentLogger = new LoggerClass({ loglevel: 'silent', setPrefix: 'silent-test' })

    expect(traceLogger.logLevel).to.equal('debug')
    expect(silentLogger.logLevel).to.equal('disable')
    expect(silentLogger.logger.silent).to.equal(true)

    traceLogger.destroy()
    silentLogger.destroy()
  })

  it('formats splat arguments with the same timestamp, level and module layout as the engine', async () => {
    let resolveOutput
    const output = new Promise((resolve) => { resolveOutput = resolve })
    const sink = new Writable({
      write (chunk, encoding, callback) {
        resolveOutput(stripAnsi(chunk.toString()))
        callback()
      }
    })
    const logger = new LoggerClass({ loglevel: 'info', setPrefix: 'logger-test' })
    logger.logger.clear()
    logger.logger.add(new winston.transports.Stream({ stream: sink }))

    logger.info('message %s', 'value')

    expect(await output).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} INFO LOGGER-TEST: message value\n$/)
    logger.destroy()
  })

  it('keeps the legacy success method as an informational log', async () => {
    let resolveOutput
    const output = new Promise((resolve) => { resolveOutput = resolve })
    const sink = new Writable({
      write (chunk, encoding, callback) {
        resolveOutput(stripAnsi(chunk.toString()))
        callback()
      }
    })
    const logger = new LoggerClass({ loglevel: 'info', setPrefix: 'success-test' })
    logger.logger.clear()
    logger.logger.add(new winston.transports.Stream({ stream: sink }))

    logger.success('completed')

    expect(await output).to.include(' INFO SUCCESS-TEST: completed')
    logger.destroy()
  })

  it('retains additional arguments when the message has no format placeholders', async () => {
    let resolveOutput
    const output = new Promise((resolve) => { resolveOutput = resolve })
    const sink = new Writable({
      write (chunk, encoding, callback) {
        resolveOutput(stripAnsi(chunk.toString()))
        callback()
      }
    })
    const logger = new LoggerClass({ loglevel: 'info', setPrefix: 'arguments-test' })
    logger.logger.clear()
    logger.logger.add(new winston.transports.Stream({ stream: sink }))

    logger.info('object count', 2, { active: true })

    expect(await output).to.include(' INFO ARGUMENTS-TEST: object count 2 { active: true }')
    logger.destroy()
  })
})
