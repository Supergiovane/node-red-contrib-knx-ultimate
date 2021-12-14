// Helper for ipaddresses
const knxLog = require('../KnxLog');
const os = require('os');

//#region  "GET LOCAL INTERFACE PROPERTIES"
const getIPv4Interfaces = function () {
    // get the local address of the IPv4 interface we're going to use
    let candidateInterfaces = {}
    let interfaces = os.networkInterfaces()
    for (let iface in interfaces) {
        for (let key in interfaces[iface]) {
            let intf = interfaces[iface][key]
            if (intf.family === 'IPv4' && !intf.internal) {
                knxLog.get().trace('candidate interface: %s (%j)', iface, intf);
                candidateInterfaces[iface] = intf
            }
        }
    }

    return candidateInterfaces
}

exports.getLocalAddress = function (_interface = "") {
    let candidateInterfaces = getIPv4Interfaces()
    // if user has declared a desired interface then use it
    if (_interface !== "") {
        if (!candidateInterfaces.hasOwnProperty(_interface)) {
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
//#endregion