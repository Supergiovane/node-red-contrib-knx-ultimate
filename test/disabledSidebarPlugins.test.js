const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')

describe('disabled KNX Debug and KNX Monitor sidebar plugins', () => {
  const packageJson = require('../package.json')
  const commonFunctionsSource = fs.readFileSync(path.join(projectRoot, 'nodes', 'commonFunctions.js'), 'utf8')
  const loggerClass = require('../nodes/utils/sysLogger')

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
    expect(loggerClass).not.to.have.property('getDebugSnapshot')
    expect(loggerClass).not.to.have.property('clearDebugBuffer')
    expect(loggerClass).not.to.have.property('DEBUG_BUFFER_LIMIT')
    expect(() => new loggerClass({ loglevel: 'disable', setPrefix: 'sidebar-removal-test' })).not.to.throw()
  })
})
