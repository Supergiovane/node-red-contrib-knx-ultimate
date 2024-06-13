// Helper for ipaddresses
const knxLog = require('../KnxLog')
const os = require('os')

// #region  "GET LOCAL INTERFACE PROPERTIES"
function getIPv4Interfaces () {
  // get the local address of the IPv4 interface we're going to use
  const candidateInterfaces = {}
  const interfaces = os.networkInterfaces()
  for (const iface in interfaces) {
    for (const key in interfaces[iface]) {
      const intf = interfaces[iface][key]
      // 11/05/2022 Fixed a breaking change introduced by node 18 (https://nodejs.org/api/os.html#osnetworkinterfaces)
      // In Node < 18, intf.family is a string "IPv4" or "IPv6", from node 18, is an integer, for example 4.
      try {
        knxLog.get().debug('ipAddressHelper.js: parsing interface: %s (%j)', iface, intf)
        if (intf.family !== undefined && intf.family.toString().includes('4') && !intf.internal) {
          knxLog.get().trace('ipAddressHelper.js: Found suitable interface: %s (%j)', iface, intf)
          candidateInterfaces[iface] = intf
        } else {
          knxLog.get().trace('ipAddressHelper.js: Found NOT suitable interface: %s (%j)', iface, intf)
        }
      } catch (error) {
        knxLog.get().error('ipAddressHelper.js: getIPv4Interfaces: error parsing the interface %s (%j)', iface, intf)
      }
    }
  }

  return candidateInterfaces
}

exports.getLocalAddress = function (_interface = '') {
  knxLog.get().trace('ipAddressHelper.js: getLocalAddress: getting interfaces')
  const candidateInterfaces = getIPv4Interfaces()
  // if user has declared a desired interface then use it
  if (_interface !== '') {
    if (!candidateInterfaces.hasOwnProperty(_interface)) {
      knxLog.get().error('ipAddressHelper.js: exports.getLocalAddress: Interface ' + _interface + ' not found or has no useful IPv4 address!')
      throw Error('Interface ' + _interface + ' not found or has no useful IPv4 address!')
    } else {
      return candidateInterfaces[_interface].address
    }
  }

  // just return the first available IPv4 non-loopback interface
  if (Object.keys(candidateInterfaces).length > 0) {
    return candidateInterfaces[Object.keys(candidateInterfaces)[0]].address
  }
  // no local IpV4 interfaces?
  throw Error('No valid IPv4 interfaces detected')
}
// #endregion
