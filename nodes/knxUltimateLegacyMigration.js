'use strict'

// Runtime-only placeholders for node types removed in KNX Ultimate 8. Keeping
// the types registered lets Node-RED start the rest of each flow after a direct
// upgrade. There is deliberately no matching editor HTML: the editor imports
// these entries as `unknown`, retaining the saved object in `_orig` for the
// version 8 recovery plugin to convert.
module.exports = function (RED) {
  const utilityTypes = [
    'knxUltimateAlerter',
    'knxUltimateAutoResponder',
    'knxUltimateDateTime',
    'knxUltimateWatchDog',
    'knxUltimateGlobalContext',
    'knxUltimateLogger',
    'knxUltimateStaircase',
    'knxUltimateGarage',
    'knxUltimateSceneController',
    'knxUltimateLoadControl',
    'knxUltimateHATranslator'
  ]
  const hueTypes = [
    'hue-config',
    'knxUltimateHueController',
    'knxUltimateHueLight',
    'knxUltimateHuePlug',
    'knxUltimateHueButton',
    'knxUltimateHueTapDial',
    'knxUltimateHueMotion',
    'knxUltimateHueAreaMotion',
    'knxUltimateHueCameraMotion',
    'knxUltimateHueContactSensor',
    'knxUltimateHueLightSensor',
    'knxUltimateHueTemperatureSensor',
    'knxUltimateHueHumiditySensor',
    'knxUltimateHueScene',
    'knxUltimateHueBattery',
    'knxUltimateHueZigbeeConnectivity',
    'knxUltimateHuedevice_software_update'
  ]
  const matterTypes = [
    'matter-config',
    'matterbridge-config',
    'knxUltimateMatterControllerDevice',
    'knxUltimateMatterBridge',
    'knxUltimateMatterLight'
  ]
  const aiTypes = [
    'knxUltimateAI',
    'knxUltimateAIHomeAssistant'
  ]
  const credentials = {
    'hue-config': {
      username: { type: 'password' },
      clientkey: { type: 'password' }
    },
    knxUltimateAI: {
      llmApiKey: { type: 'password' }
    },
    knxUltimateMatterControllerDevice: {
      doorLockPin: { type: 'password' }
    }
  }

  function register (type) {
    function LegacyMigrationPlaceholder (config) {
      RED.nodes.createNode(this, config)
      if (typeof this.status === 'function') this.status({ fill: 'yellow', shape: 'ring', text: 'migration required' })
    }
    if (credentials[type]) RED.nodes.registerType(type, LegacyMigrationPlaceholder, { credentials: credentials[type] })
    else RED.nodes.registerType(type, LegacyMigrationPlaceholder)
  }

  utilityTypes.concat(hueTypes, matterTypes, aiTypes).forEach(register)
}
