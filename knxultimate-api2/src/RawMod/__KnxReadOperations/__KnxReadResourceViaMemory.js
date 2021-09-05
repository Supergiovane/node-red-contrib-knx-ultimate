/** THE FUNCTION CONTAINED IN THIS FILE SHOULDN'T BE ACCESSED DIRECTLY - USE KnxReadDeviceResource.js INSTEAD **/

const KnxReadDevMem = require('./KnxReadDevMem')

module.exports = async (target, source, deviceResourceInformation, recvTimeout, conContext, errContext) => {
  // Get the correct address and length
  const address = deviceResourceInformation.startAddress
  const length = deviceResourceInformation.length

  // Send the request and return the result
  return KnxReadDevMem.readDevMem(target, source, [address >> 8, address & 0b11111111], length, recvTimeout, conContext, errContext)
}
