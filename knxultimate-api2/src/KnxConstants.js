/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const KnxDeviceResourceInformation = require('./RawMod/KnxDeviceResourceInformation')

// SOURCES:
// http://www.eb-systeme.de/?page_id=479
// http://knxnetipdissect.sourceforge.net/doc.html
// http://dz.prosyst.com/pdoc/mBS_SH_SDK_7.3.0/modules/knx/api/com/prosyst/mbs/services/knx/ip/Constants.html
const KnxConstants = {}

KnxConstants.SERVICE_TYPE = {
  SEARCH_REQUEST: 0x0201,
  SEARCH_RESPONSE: 0x0202,
  DESCRIPTION_REQUEST: 0x0203,
  DESCRIPTION_RESPONSE: 0x0204,
  CONNECT_REQUEST: 0x0205,
  CONNECT_RESPONSE: 0x0206,
  CONNECTIONSTATE_REQUEST: 0x0207,
  CONNECTIONSTATE_RESPONSE: 0x0208,
  DISCONNECT_REQUEST: 0x0209,
  DISCONNECT_RESPONSE: 0x020a,
  DEVICE_CONFIGURATION_REQUEST: 0x0310,
  DEVICE_CONFIGURATION_ACK: 0x0311,
  TUNNELING_REQUEST: 0x0420,
  TUNNELING_ACK: 0x0421,
  ROUTING_INDICATION: 0x0530,
  ROUTING_LOST_MESSAGE: 0x0531,
  UNKNOWN: -1
}
//
KnxConstants.CONNECTION_TYPE = {
  DEVICE_MGMT_CONNECTION: 0x03,
  TUNNEL_CONNECTION: 0x04,
  REMOTE_LOGGING_CONNECTION: 0x06,
  REMOTE_CONFIGURATION_CONNECTION: 0x07,
  OBJECT_SERVER_CONNECTION: 0x08
}
//
KnxConstants.PROTOCOL_TYPE = {
  IPV4_UDP: 0x01,
  IPV4_TCP: 0x02
}
//
KnxConstants.KNX_LAYER = {
  LINK_LAYER: 0x02, /** Tunneling on link layer, establishes a link layer tunnel to the KNX network. */
  RAW_LAYER: 0x04, /** Tunneling on raw layer, establishes a raw tunnel to the KNX network. */
  BUSMONITOR_LAYER: 0x80 /** Tunneling on busmonitor layer, establishes a busmonitor tunnel to the KNX network. */
}

KnxConstants.FRAMETYPE = {
  EXTENDED: 0x00,
  STANDARD: 0x01
}

// https://github.com/calimero-project/calimero-core/blob/master/src/tuwien/auto/calimero/knxnetip/servicetype/ErrorCodes.java
KnxConstants.RESPONSECODE = {
  NO_ERROR: 0x00, // E_NO_ERROR - The connection was established succesfully
  E_HOST_PROTOCOL_TYPE: 0x01,
  E_VERSION_NOT_SUPPORTED: 0x02,
  E_SEQUENCE_NUMBER: 0x04,
  E_CONNSTATE_LOST: 0x15, // typo in eibd/libserver/eibnetserver.cpp:394, forgot 0x prefix ??? "uchar res = 21;"
  E_CONNECTION_ID: 0x21, // - The KNXnet/IP server device could not find an active data connection with the given ID
  E_CONNECTION_TYPE: 0x22, // - The requested connection type is not supported by the KNXnet/IP server device
  E_CONNECTION_OPTION: 0x23, // - The requested connection options is not supported by the KNXnet/IP server device
  E_NO_MORE_CONNECTIONS: 0x24, //  - The KNXnet/IP server could not accept the new data connection (Maximum reached)
  E_DATA_CONNECTION: 0x26, // - The KNXnet/IP server device detected an erro concerning the Dat connection with the given ID
  E_KNX_CONNECTION: 0x27, // - The KNXnet/IP server device detected an error concerning the KNX Bus with the given ID
  E_TUNNELING_LAYER: 0x29
}

KnxConstants.MESSAGECODES = {
  'L_Raw.req': 0x10,
  'L_Data.req': 0x11,
  'L_Poll_Data.req': 0x13,
  'L_Poll_Data.con': 0x25,
  'L_Data.ind': 0x29,
  'L_Busmon.ind': 0x2B,
  'L_Raw.ind': 0x2D,
  'L_Data.con': 0x2E,
  'L_Raw.con': 0x2F,
  'ETS.Dummy1': 0xC1 // UNKNOWN: see https://bitbucket.org/ekarak/knx.js/issues/23
}

// Codes for the APCI field (For KNX multicast messages)
KnxConstants.APCICODES = {
  GroupValue_Read: 0b0000000000, // Multicast (Value: 0)
  GroupValue_Response: 0b0001000000, // Multicast (Value: 64)
  GroupValue_Write: 0b0010000000, // Multicast (Value: 128)
  PhysicalAddress_Write: 0b0011000000, // Broadcast (Value: 192)
  PhysicalAddress_Read: 0b0100000000, // Broadcast (Value: 256)
  PhysicalAddress_Response: 0b0101000000, // Broadcast (Value: 320)
  ADC_Read: 0b0110000000, // Unicast (Value: 384)
  ADC_Response: 0b0111000000, // Unicast (Value: 448)
  Memory_Read: 0b1000000000, // Unicast (Value: 512)
  Memory_Response: 0b1001000000, // Unicast (Value: 576)
  Memory_Write: 0b1010000000, // Unicast (Value: 640)
  UserMemory_Read: 0b1011000000, // Unicast (Value: 704)
  UserMemory_Respond: 0b1011000001, // Unicast (Value: 705)
  UserMemory_11_Write: 0b1011000010, // Unicast (Value: 706)
  UserMemory_5_Write: 0b1011000011, // Unicast (Value: 707)
  ManufacturerInformation_Read: 0b1011000101, // Unicast (709)
  ManufacturerInformation_Response: 0b1011000110, // Unicast (710)
  ManufacturerSpecificCommand: 0b1011111000, // Unicast (760 - 767) [Manufacturer Specific Area]
  DeviceDescriptor_Read: 0b1100000000, // Unicast (Value: 768)
  DeviceDescriptor_Response: 0b1101000000, // Unicast (Value: 832)
  Restart: 0b1110000000, // Unicast (Value: 896)
  AccessRights_Read: 0b1111010001, // Unicast (Value: 977)
  AccessRights_Response: 0b1111010010, // Unicast (Value: 978)
  AccessRightsKey_Write: 0b1111010011, // Unicast (Value: 979)
  AccessRights_Write: 0b1111010100, // Unicast (Value: 980)
  PropertyValue_Read: 0b1111010101, // Unicast (Value: 981)
  PropertyValue_Response: 0b1111010110, // Unicast (Value: 982)
  PropertyValue_Write: 0b1111010111, // Unicast (Value: 983)
  PropertyDescription_Read: 0b1111011000, // Unicast (Value: 984)
  PropertyDescription_Response: 0b1111011001, // Unicast (Value: 985)
  SystemID_Write: 0b1111100000, // Broadcast (Value: 992)
  SystemID_Read: 0b1111100001, // Broadcast (Value: 993)
  SystemID_Response: 0b1111100010 // Broadcast (Value: 994)
}

// Bitmasks to extract certain values from certain bytes of an KNX message
KnxConstants.KNX_BITMASKS = {
  MSGTYPE_BITMASK: 0b11010000, // To get the message type
  TPCI_TYPE_BITMASK: 0b11000000, // To get the TPCI type
  TPCI_SEQNUM_BITMASK: 0b00111100, // To get the TPCI seqnum
  TPCI_UCD_TYPE_BITMASK: 0b00000011, // To get the TPCI.UCD type
  TPCI_NCD_TYPE_BITMASK: 0b00000011 // To get the TPCI.NCD type
}

// KNX message types (Stored in the control bytes of an KNX message)
KnxConstants.KNX_MSG_TYPES = {
  MSG_NORMAL: 0b10010000, // A normal KNX message
  MSG_EXTENDED: 0b00010000, // A extended KNX message
  MSG_POLL: 0b11110000 // A poll KNX message
}

// Min./Max. length of different KNX message types
KnxConstants.KNX_MSG_LENS = {
  NORMAL_MAXLEN: 0x17, // Maxlen for normal messages
  NORMAL_MINLEN: 0x8, // Minlen for normal messages
  KNX_EXTENDED_MAXLEN: 0x107, // Maxlen for extended messages
  KNX_EXTENDED_MINLEN: 0x9, // Minlen for extended messages
  KNX_POLL_LEN: 0x7 // Len for poll message
}

// Possible values for the two priority bits of a KNX message
KnxConstants.KNX_MSG_PRIORITY = {
  LOW: 0b11, // 3
  HIGH: 0b01, // 1
  ALARM: 0b10, // 2
  SYSTEM: 0b00 // 0
}

// KNX TPCI types
KnxConstants.KNX_TPCI_TYPES = {
  TPCI_UDP: 0b00000000, // Unnumbered Data Packet
  TPCI_NDP: 0b01000000, // Numbered Data Packet
  TPCI_UCD: 0b10000000, // Unnumbered Control Data
  TPCI_NCD: 0b11000000 // Numbered Control Data
}

// KNX TPCI sub-types
KnxConstants.KNX_TPCI_SUBTYPES = {
  TPCI_UCD_CON: 0b00000000, // UCD connect request
  TPCI_UCD_DCON: 0b00000001, // UCD disconnect request
  TPCI_NCD_ACK: 0b00000010, // NCD acknowledge message
  TPCI_NCD_NACK: 0b00000011 // NCD not-acknowledge message
}

// Information about KNX device resources (memory addresses and property IDs + data lengths)
KnxConstants.KNX_DEV_RESOURCE_INFORMATION = KnxDeviceResourceInformation

/*
 * Values for different ways of accessing a device resource - used as parameter for Knx[Read, Write]DeviceResource
 * also used by KnxReadDeviceResource to report which access type was used
 */
KnxConstants.RESOURCE_ACCESS_TYPES = {
  ALL: 0x00, // Use any way of access
  MEMORY: 0x01, // Prefer using direct memory access
  PROPERTY: 0x02, // Prefer using property access
  MEMORY_STRICT: 0x03, // Only use direct memory access
  PROPERTY_STRICT: 0x04 // Only use property access
}

// The two KNX address types
KnxConstants.KNX_ADDR_TYPES = {
  GROUP: 1, // It is a group address
  DEVICE: 0 // It is a device address
}

// KNX LoadStateMachine states
KnxConstants.KNX_LSM_STATES = {
  ApplicationUnloaded: 0x00, // Application not loaded
  ApplicationLoaded: 0x01, // Application loaded
  ApplicationLoading: 0x02, // Application loading
  ApplicationError: 0x03, // Application failed to load
  ApplicationUnloading: 0x04, // Application unloading
  ApplicationLoadCompleting: 0x05 // Checking application validity
}

// KNX LSM commands
KnxConstants.KNX_LSM_CMDS = {
  NOP: 0x00, // NOP
  LoadApplication: 0x01, // Starts the application-load process
  CompleteLoadApplication: 0x02, // Declares the application as loaded (when in 'Loading' state)
  SpecialDataLoad: 0x03, // Transfers some data to the device - debugging/development
  UnloadApplication: 0x04 // Starts the application-unload process
}

// KNX RunStateMachine states
KnxConstants.KNX_RSM_STATES = {
  ApplicationHalted: 0x00, // Application halted - not running
  ApplicationRunning: 0x01, // Application running
  ApplicationReady: 0x02, // Application ready
  ApplicationTerminated: 0x3 // Application terminated - not running
}

// KNX RSM commands
KnxConstants.KNX_RSM_CMDS = {
  NOP: 0x00, // NOP
  RestartApplication: 0x01, // Restart the application
  HaltApplication: 0x02 // Halt the application
}

// The broadcast group address on every KNX bus
KnxConstants.KNX_BROADCAST_ADDR = '0/0/0'

KnxConstants.keyText = function (object, value) {
  return Object.keys(object).filter(key => {
    // * 0x40 is needed because hdr.apci doesn't contain the real but the down-shifted apci value
    return object[key] === value
  })[0]
}

module.exports = KnxConstants
