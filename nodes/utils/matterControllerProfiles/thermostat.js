'use strict'

const { setupMappedEndpointProfile } = require('./mappedEndpoint')

const THERMOSTAT_CLUSTER_ID = 0x0201

const setupThermostatProfile = (RED, node, config) => setupMappedEndpointProfile(RED, node, config, {
  profileName: 'thermostat',
  inputClusterId: THERMOSTAT_CLUSTER_ID,
  eventClusterId: THERMOSTAT_CLUSTER_ID,
  formatAttributeStatus: (event) => {
    if (['localTemperature', 'occupiedHeatingSetpoint', 'occupiedCoolingSetpoint'].includes(event.attributeName) && event.value !== null && event.value !== undefined) {
      return `Matter thermostat: ${(Number(event.value) / 100).toFixed(1)} °C`
    }
    if (event.attributeName === 'systemMode') return `Matter thermostat mode: ${event.value}`
    return ''
  }
})

module.exports = { THERMOSTAT_CLUSTER_ID, setupThermostatProfile }
