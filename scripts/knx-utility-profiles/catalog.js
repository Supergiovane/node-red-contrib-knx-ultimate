'use strict'

// utilityType is persisted in flows. Historical names are private editor and
// translation namespaces, never registry lookups or legacy node imports.
const profiles = Object.freeze({
  alerter: 'knxUltimateAlerter',
  autoresponder: 'knxUltimateAutoResponder',
  datetime: 'knxUltimateDateTime',
  watchdog: 'knxUltimateWatchDog',
  globalcontext: 'knxUltimateGlobalContext',
  logger: 'knxUltimateLogger',
  staircase: 'knxUltimateStaircase',
  garage: 'knxUltimateGarage',
  scenecontroller: 'knxUltimateSceneController',
  loadcontrol: 'knxUltimateLoadControl',
  hatranslator: 'knxUltimateHATranslator'
})

const locales = Object.freeze(['en', 'it', 'de', 'fr', 'es', 'zh-CN'])

module.exports = { profiles, locales }
