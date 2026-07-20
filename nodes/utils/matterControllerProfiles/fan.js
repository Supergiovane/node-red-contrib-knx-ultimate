'use strict'

const { setupMappedEndpointProfile } = require('./mappedEndpoint')

const FAN_CONTROL_CLUSTER_ID = 0x0202

const setupFanProfile = (RED, node, config) => setupMappedEndpointProfile(RED, node, config, {
  profileName: 'fan',
  inputClusterId: FAN_CONTROL_CLUSTER_ID,
  eventClusterId: FAN_CONTROL_CLUSTER_ID,
  formatAttributeStatus: (event) => {
    if (['percentCurrent', 'percentSetting'].includes(event.attributeName) && event.value !== null && event.value !== undefined) {
      return `Matter fan: ${Math.round(Number(event.value))}%`
    }
    if (event.attributeName === 'fanMode') return `Matter fan mode: ${event.value}`
    return ''
  }
})

module.exports = { FAN_CONTROL_CLUSTER_ID, setupFanProfile }
