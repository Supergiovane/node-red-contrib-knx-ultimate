/** THE FUNCTION CONTAINED IN THIS FILE SHOULDN'T BE ACCESSED DIRECTLY - USE KnxWriteDeviceResource.js INSTEAD **/

const KnxWritePropertyValue = require('./KnxWritePropertyValue')

module.exports = async (target, source, deviceResourceInformation, value, recvTimeout, conContext, errContext) => {
  // Get the correct address and length
  const objectIndex = deviceResourceInformation.interfaceObjectRef || 0
  const startIndex = 1 // by default
  const propertyID = deviceResourceInformation.propertyID
  const elementCount = deviceResourceInformation.length // elementCount = Bytes = Length

  // Send the request and return the result
  return KnxWritePropertyValue.writePropertyValue(target, source, objectIndex, startIndex,
    propertyID, elementCount, value, recvTimeout, conContext, errContext)
}
