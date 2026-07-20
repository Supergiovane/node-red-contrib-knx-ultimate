'use strict'

const { setupMappedEndpointProfile } = require('./mappedEndpoint')

const SWITCH_CLUSTER_ID = 0x003b

const setupSwitchProfile = (RED, node, config) => setupMappedEndpointProfile(RED, node, config, {
  profileName: 'switch',
  inputClusterId: SWITCH_CLUSTER_ID,
  eventClusterId: SWITCH_CLUSTER_ID,
  formatEventStatus: (event) => `Matter switch: ${event.eventName}`
})

module.exports = { SWITCH_CLUSTER_ID, setupSwitchProfile }
