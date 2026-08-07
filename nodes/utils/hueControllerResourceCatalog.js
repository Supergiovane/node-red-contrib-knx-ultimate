'use strict'

// Resource queries are intentionally ordered with Plug before Light. Hue plugs
// often expose an on/off service whose API v2 type is `light`; preferring the
// plug profile prevents the same resource from appearing twice or being
// classified as a lamp in the unified Controller picker.
const HUE_CONTROLLER_RESOURCE_TYPES = Object.freeze([
  'plug',
  'light',
  'button',
  'relative_rotary',
  'motion',
  'area_motion',
  'camera_motion',
  'contact',
  'light_level',
  'temperature',
  'humidity',
  'scene',
  'device_power',
  'zigbee_connectivity',
  'device_software_update'
])

const normalizeHueDeviceValue = (controllerType, item) => {
  const id = String(item?.id || item?.rid || '').trim()
  if (id === '') return ''
  const resourceType = String(item?.type || item?.deviceObject?.type || '').trim().toLowerCase()
  if (controllerType === 'light') {
    return `${id}#${resourceType === 'grouped_light' ? 'grouped_light' : 'light'}`
  }
  if (controllerType === 'plug') {
    return `${id}#${resourceType || 'plug'}`
  }
  return id
}

const buildHueControllerResourceCatalog = (resourcesByType = {}) => {
  const catalogById = new Map()

  HUE_CONTROLLER_RESOURCE_TYPES.forEach((controllerType) => {
    const resources = Array.isArray(resourcesByType[controllerType])
      ? resourcesByType[controllerType]
      : []
    resources.forEach((item) => {
      const id = String(item?.id || item?.rid || '').trim()
      if (id === '' || id === 'error' || catalogById.has(id)) return
      const hueDevice = normalizeHueDeviceValue(controllerType, item)
      if (hueDevice === '') return
      catalogById.set(id, {
        ...item,
        id,
        hueDevice,
        controllerType
      })
    })
  })

  return Array.from(catalogById.values()).sort((left, right) => {
    return String(left.name || left.id).localeCompare(String(right.name || right.id), undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

module.exports = {
  HUE_CONTROLLER_RESOURCE_TYPES,
  buildHueControllerResourceCatalog,
  normalizeHueDeviceValue
}
