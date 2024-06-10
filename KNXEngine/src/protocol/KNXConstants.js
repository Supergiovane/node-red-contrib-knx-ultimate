'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ConnectionStatus = exports.KNX_CONSTANTS = void 0
exports.KNX_CONSTANTS = {
  KNXNETIP_VERSION_10: 0x10,
  HEADER_SIZE_10: 0x6,
  SEARCH_REQUEST: 0x0201,
  SEARCH_RESPONSE: 0x0202,
  DESCRIPTION_REQUEST: 0x203,
  DESCRIPTION_RESPONSE: 0x0204,
  CONNECT_REQUEST: 0x0205,
  CONNECT_RESPONSE: 0x0206,
  CONNECTIONSTATE_REQUEST: 0x0207,
  CONNECTIONSTATE_RESPONSE: 0x0208,
  DISCONNECT_REQUEST: 0x0209,
  DISCONNECT_RESPONSE: 0x020A,
  DEVICE_CONFIGURATION_REQUEST: 0x0310,
  DEVICE_CONFIGURATION_ACK: 0x0311,
  TUNNELING_REQUEST: 0x0420,
  TUNNELING_ACK: 0x0421,
  ROUTING_BUSY: 0x0532,
  ROUTING_INDICATION: 0x0530,
  ROUTING_LOST_MESSAGE: 0x0531,
  DEVICE_MGMT_CONNECTION: 0x03,
  TUNNEL_CONNECTION: 0x04,
  REMLOG_CONNECTION: 0x06,
  REMCONF_CONNECTION: 0x07,
  OBJSVR_CONNECTION: 0x08,
  E_NO_ERROR: 0x00,
  E_HOST_PROTOCOL_TYPE: 0x01,
  E_VERSION_NOT_SUPPORTED: 0x02,
  E_SEQUENCE_NUMBER: 0x04,
  E_CONNECTION_ID: 0x21,
  E_CONNECTION_TYPE: 0x22,
  E_CONNECTION_OPTION: 0x23,
  E_NO_MORE_CONNECTIONS: 0x24,
  E_NO_MORE_UNIQUE_CONNECTIONS: 0x25,
  E_DATA_CONNECTION: 0x26,
  E_KNX_CONNECTION: 0x27,
  E_TUNNELING_LAYER: 0x29,
  DEVICE_INFO: 0x01,
  SUPP_SVC_FAMILIES: 0x02,
  IP_CONFIG: 0x03,
  IP_CUR_CONFIG: 0x04,
  KNX_ADDRESSES: 0x05,
  MFR_DATA: 0xFE,
  TP1: 0x02,
  PL110: 0x04,
  RF: 0x10,
  IP: 0x20,
  IPV4_UDP: 0x01,
  IPV4_TCP: 0x02,
  SEARCH_TIMEOUT: 10,
  CONNECT_REQUEST_TIMEOUT: 10,
  CONNECTIONSTATE_REQUEST_TIMEOUT: 10,
  DEVICE_CONFIGURATION_REQUEST_TIMEOUT: 10,
  TUNNELING_REQUEST_TIMEOUT: 1,
  CONNECTION_ALIVE_TIME: 30, // Max is 120secs by standard KNX specs.
  TUNNEL_LINKLAYER: 0x02,
  TUNNEL_RAW: 0x04,
  TUNNEL_BUSMONITOR: 0x80,
  KNX_PORT: 3671,
  KNX_IP: '224.0.23.12',
  IPV4_ADDRESS_LENGTH: 4,
  // Search for KNX IP Secure Unicasts Setups
  SECURE_SEARCH_REQUEST: 0x20b,
  SECURE_SEARCH_RESPONSE: 0x20c,
  // KNX IP Secure
  SECURE_WRAPPER: 0x0950,
  SECURE_SESSION_REQUEST: 0x0951,
  SECURE_SESSION_RESPONSE: 0x0952,
  SECURE_SESSION_AUTH: 0x0953,
  SECURE_SESSION_STATUS: 0x0954,
  SECURE_GROUP_SYNC: 0x0955
}

let ConnectionStatus;
(function (ConnectionStatus) {
  ConnectionStatus[ConnectionStatus.E_CONNECTION_ID = exports.KNX_CONSTANTS.E_CONNECTION_ID] = 'E_CONNECTION_ID'
  ConnectionStatus[ConnectionStatus.E_NO_ERROR = exports.KNX_CONSTANTS.E_NO_ERROR] = 'E_NO_ERROR'
  ConnectionStatus[ConnectionStatus.E_DATA_CONNECTION = exports.KNX_CONSTANTS.E_DATA_CONNECTION] = 'E_DATA_CONNECTION'
  ConnectionStatus[ConnectionStatus.E_KNX_CONNECTION = exports.KNX_CONSTANTS.E_KNX_CONNECTION] = 'E_KNX_CONNECTION'
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}))
// # sourceMappingURL=KNXConstants.js.map
