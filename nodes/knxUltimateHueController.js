'use strict'

const { setupHueControllerRuntime } = require('./utils/hueControllerProfileAdapter')

module.exports = function (RED) {
  // Keep the public wrapper intentionally boring. Device-specific behavior lives
  // in the Controller-owned private profiles; this file owns only selection,
  // startup containment and the single public Node-RED registration.
  function knxUltimateHueController (config) {
    try {
      // The selected profile performs RED.nodes.createNode itself. Calling it
      // here as a constructor-on-this preserves its complete, proven lifecycle.
      setupHueControllerRuntime(RED, this, config)
    } catch (error) {
      // If a profile cannot start, still create a valid Node-RED node and surface
      // the operational failure without allowing it to stop the runtime.
      // Avoid a second createNode call when the profile failed after creating it.
      if (!this.id) RED.nodes.createNode(this, config)
      const message = error && error.message ? error.message : String(error)
      RED.log.error(`knxUltimateHueController: ${message}`)
      this.status({ fill: 'red', shape: 'dot', text: message })
      this.error(message)
    }
  }

  // This is the only registration produced by the Controller architecture.
  RED.nodes.registerType('knxUltimateHueController', knxUltimateHueController)
}
