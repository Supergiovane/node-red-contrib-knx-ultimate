/*
 * This file contains code to check if a resource is avaible on a device given its maskversion
 */

const KnxDeviceResourceInformation = require('./KnxDeviceResourceInformation')

module.exports = (maskVersion, resourceName) => {
  return !!KnxDeviceResourceInformation.getResourceInfoByMaskVersionAndName(maskVersion, resourceName)
}
