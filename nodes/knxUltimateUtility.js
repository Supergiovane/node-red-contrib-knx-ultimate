'use strict'

const { setupKnxUtilityRuntime } = require('./utils/knxUtilityProfileAdapter')
const registerSendNowEndpoint = require('./utils/knxDateTimeSendNow')

module.exports = function (RED) {
  // Register against the real RED instance; private profile constructors use a
  // facade that deliberately cannot register public Node-RED node types.
  registerSendNowEndpoint(RED, 'utility')

  function knxUltimateUtility (config) {
    try {
      setupKnxUtilityRuntime(RED, this, config)
    } catch (error) {
      if (!this.id) RED.nodes.createNode(this, config)
      const message = error && error.message ? error.message : String(error)
      RED.log.error(`knxUltimateUtility: ${message}`)
      this.status({ fill: 'red', shape: 'dot', text: message })
      this.error(message)
    }
  }

  RED.nodes.registerType('knxUltimateUtility', knxUltimateUtility)
}
