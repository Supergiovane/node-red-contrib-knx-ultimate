'use strict'

const { setupMappedEndpointProfile } = require('./mappedEndpoint')

const WINDOW_COVERING_CLUSTER_ID = 0x0102

const setupWindowCoveringProfile = (RED, node, config) => setupMappedEndpointProfile(RED, node, config, {
  profileName: 'windowCovering',
  inputClusterId: WINDOW_COVERING_CLUSTER_ID,
  eventClusterId: WINDOW_COVERING_CLUSTER_ID,
  formatAttributeStatus: (event) => {
    if (event.attributeName === 'currentPositionLiftPercent100ths' && event.value !== null && event.value !== undefined) {
      return `Matter cover: ${Math.round(Number(event.value) / 100)}%`
    }
    if (event.attributeName === 'operationalStatus') return 'Matter cover: operational status updated'
    return ''
  }
})

module.exports = { WINDOW_COVERING_CLUSTER_ID, setupWindowCoveringProfile }
