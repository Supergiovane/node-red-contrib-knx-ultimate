'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.CRI = exports.ConnectionTypes = void 0
const KNXConstants_1 = require('./KNXConstants')
let ConnectionTypes;
(function (ConnectionTypes) {
  ConnectionTypes[ConnectionTypes.TUNNEL_CONNECTION = KNXConstants_1.KNX_CONSTANTS.TUNNEL_CONNECTION] = 'TUNNEL_CONNECTION'
  ConnectionTypes[ConnectionTypes.DEVICE_MGMT_CONNECTION = KNXConstants_1.KNX_CONSTANTS.DEVICE_MGMT_CONNECTION] = 'DEVICE_MGMT_CONNECTION'
  ConnectionTypes[ConnectionTypes.REMLOG_CONNECTION = KNXConstants_1.KNX_CONSTANTS.REMLOG_CONNECTION] = 'REMLOG_CONNECTION'
  ConnectionTypes[ConnectionTypes.REMCONF_CONNECTION = KNXConstants_1.KNX_CONSTANTS.REMCONF_CONNECTION] = 'REMCONF_CONNECTION'
  ConnectionTypes[ConnectionTypes.OBJSVR_CONNECTION = KNXConstants_1.KNX_CONSTANTS.OBJSVR_CONNECTION] = 'OBJSVR_CONNECTION'
})(ConnectionTypes = exports.ConnectionTypes || (exports.ConnectionTypes = {}))
class CRI {
  constructor (_connectionType) {
    this._connectionType = _connectionType
  }

  get length () {
    return 2
  }

  set connectionType (connectionType) {
    this._connectionType = connectionType
  }

  get connectionType () {
    return this._connectionType
  }

  toBuffer () {
    return Buffer.alloc(0)
  }
}
exports.CRI = CRI
// # sourceMappingURL=CRI.js.map
