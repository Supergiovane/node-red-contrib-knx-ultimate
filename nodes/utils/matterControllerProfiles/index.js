'use strict'

const { setupDoorLockProfile } = require('./doorLock')
const { setupMappedEndpointProfile } = require('./mappedEndpoint')

// Controller-side Matter device profiles live behind this registry.  Keep profile
// selection capability-driven: the editor records the profile only after inspecting
// the endpoint's actual device types, clusters, attributes and supported commands.
const PROFILE_SETUPS = Object.freeze({
  doorLock: setupDoorLockProfile,
  mapped: setupMappedEndpointProfile
})

const setupMatterControllerProfile = (profile, RED, node, config) => {
  const setup = PROFILE_SETUPS[profile]
  // Returning false is significant: the caller must continue through the unchanged
  // Matter-light implementation when no specialized profile claims the endpoint.
  if (typeof setup !== 'function') return false
  // A profile that returns successfully owns input, close, KNX and Matter handlers.
  setup(RED, node, config)
  return true
}

module.exports = { PROFILE_SETUPS, setupMatterControllerProfile }
