'use strict'

// This catalog is the build-time identity map for the self-contained HUE
// Controller editor bundle. `controllerType` is the stable value persisted in
// flows. `nodeType` is retained only as the private translation namespace and
// as the registration name captured from the editor factory; it does NOT mean
// that the corresponding legacy Node-RED node has to be installed.
const profiles = Object.freeze({
  light: 'knxUltimateHueLight',
  plug: 'knxUltimateHuePlug',
  button: 'knxUltimateHueButton',
  relative_rotary: 'knxUltimateHueTapDial',
  motion: 'knxUltimateHueMotion',
  area_motion: 'knxUltimateHueAreaMotion',
  camera_motion: 'knxUltimateHueCameraMotion',
  contact: 'knxUltimateHueContactSensor',
  light_level: 'knxUltimateHueLightSensor',
  temperature: 'knxUltimateHueTemperatureSensor',
  humidity: 'knxUltimateHueHumiditySensor',
  scene: 'knxUltimateHueScene',
  device_power: 'knxUltimateHueBattery',
  zigbee_connectivity: 'knxUltimateHueZigbeeConnectivity',
  device_software_update: 'knxUltimateHuedevice_software_update'
})

// Keep this list synchronized with the locales supported by the package. The
// generated browser bundle embeds all of them so profile labels remain usable
// even after every public legacy locale file has been removed.
const locales = Object.freeze(['en', 'it', 'de', 'fr', 'es', 'zh-CN'])

module.exports = { profiles, locales }
