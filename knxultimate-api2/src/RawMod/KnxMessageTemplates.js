/*************************************************
 * This file contains some message templates for *
 *                    RawMod.js                  *
 *************************************************/

const KnxConstants = require('../KnxConstants')

/*
 * This is a helper function - DO NOT USE IT
 * It seems to be the only not over-complicated way of ensuring that doing things to the clone won't affect the original
 * object
 */
const copyJsonWithoutRef = obj => {
  // This should eliminate any references
  return JSON.parse(JSON.stringify(obj))
}

/*
 * These templates are NOT usable for custom message handlers
 * This is caused by the ctrl field differing from message to message
 *
 * The  '>> 2' thing is needed for the tpci value because the lower two bits of the tpci byte are part of the apci value
 */

const KnxMessageTemplates = {
  // This is a template for all the following templates
  generalTemplate: {
    msgCode: KnxConstants.MESSAGECODES['L_Data.req'],
    ctrl: {
      frameType: 1,
      repeat: 0,
      broadcast: 1,
      priority: KnxConstants.KNX_MSG_PRIORITY.SYSTEM,
      acknowledge: 0,
      confirm: 0,
      hopCount: 6,
      extendedFrame: 0,
      destAddrType: KnxConstants.KNX_ADDR_TYPES.DEVICE
    },

    dest_addr: 0,
    src_addr: 0,

    apdu: {}
  },

  // This function can be used to craft a UCD connect request - unicast
  ucdConnRequest: (destAddr, srcAddr) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.dest_addr = destAddr
    retVal.src_addr = srcAddr
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_UCD >> 2
    retVal.apdu.tpciUcdType = KnxConstants.KNX_TPCI_SUBTYPES.TPCI_UCD_CON

    return retVal
  },

  // This function can be used to craft a UCD disconnect request - unicast
  ucdDconnMsg: (destAddr, srcAddr) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.dest_addr = destAddr
    retVal.src_addr = srcAddr
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_UCD >> 2
    retVal.apdu.tpciUcdType = KnxConstants.KNX_TPCI_SUBTYPES.TPCI_UCD_DCON

    return retVal
  },

  // This function can be used to craft a ncd acknowledge request - unicast
  ncdAckMsg: (destAddr, srcAddr) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.dest_addr = destAddr
    retVal.src_addr = srcAddr
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NCD >> 2
    retVal.apdu.tpciNcdType = KnxConstants.KNX_TPCI_SUBTYPES.TPCI_NCD_ACK

    return retVal
  },

  // This function can be used to craft a memory write request - unicast
  memoryWriteRequest: (destAddr, srcAddr, targetMemoryAddr, data) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.dest_addr = destAddr
    retVal.src_addr = srcAddr
    retVal.apdu.data = Buffer.concat([Buffer.from(targetMemoryAddr), Buffer.from(data)])
    retVal.apdu.inApciData = data.length
    retVal.apdu.apci = 'Memory_Write'
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NDP >> 2

    return retVal
  },

  // This function can be used to craft a memory read request - unicast
  memoryReadRequest: (destAddr, srcAddr, targetMemoryAddr, readLength) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.dest_addr = destAddr
    retVal.src_addr = srcAddr
    retVal.apdu.inApciData = readLength
    retVal.apdu.data = Buffer.from(targetMemoryAddr)
    retVal.apdu.apci = 'Memory_Read'
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NDP >> 2

    return retVal
  },

  // This function can be used to craft a ADC read request - unicast
  adcReadRequest: (destAddr, srcAddr, channel, count) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.dest_addr = destAddr
    retVal.src_addr = srcAddr
    retVal.apdu.inApciData = channel
    retVal.apdu.data = Buffer.from([count])
    retVal.apdu.apci = 'ADC_Read'
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NDP >> 2

    return retVal
  },

  // This function can be used to craft a device descriptor read request - unicast
  devDescrReadRequest: (destAddr, srcAddr, channel, count) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.dest_addr = destAddr
    retVal.src_addr = srcAddr
    retVal.apdu.apci = 'DeviceDescriptor_Read'
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NDP >> 2
    retVal.apdu.noData = 1

    return retVal
  },

  // This function can be used to craft a physical address read request - broadcast
  physicalAddressReadRequest: () => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.ctrl.broadcast = 1
    retVal.ctrl.destAddrType = KnxConstants.KNX_ADDR_TYPES.GROUP
    retVal.dest_addr = KnxConstants.KNX_BROADCAST_ADDR
    retVal.apdu.apci = 'PhysicalAddress_Read'
    retVal.apdu.noData = 1

    return retVal
  },

  // This function can be used to craft a physical address write request - broadcast
  physicalAddressWriteRequest: (newDevAddr) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.ctrl.broadcast = 1
    retVal.ctrl.destAddrType = KnxConstants.KNX_ADDR_TYPES.GROUP
    retVal.dest_addr = KnxConstants.KNX_BROADCAST_ADDR
    retVal.apdu.data = newDevAddr
    retVal.apdu.apci = 'PhysicalAddress_Write'

    return retVal
  },

  // This function can be used to craft a property value read request - unicast
  propertyValueReadRequest: (destAddr, srcAddr, objectIndex, propertyID, elementCount, startIndex) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.src_addr = srcAddr
    retVal.dest_addr = destAddr
    retVal.apdu.apci = 'PropertyValue_Read'
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NDP >> 2
    retVal.apdu.data = Buffer.from([objectIndex, propertyID, ((elementCount & 0b1111) << 4) | (startIndex >> 8) & 0b1111, startIndex & 0b11111111])

    return retVal
  },

  // This function can be used to craft a property value write request - unicast
  propertyValueWriteRequest: (destAddr, srcAddr, objectIndex, propertyID, elementCount, startIndex, data) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.src_addr = srcAddr
    retVal.dest_addr = destAddr
    retVal.apdu.apci = 'PropertyValue_Write'
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NDP >> 2
    retVal.apdu.data = Buffer.from([objectIndex, propertyID, ((elementCount & 0b1111) << 4) | (startIndex >> 8) & 0b1111, startIndex & 0b11111111].concat(Array.from(data)))

    return retVal
  },

  // This function can be used to craft a device restart request - unicats
  deviceRestartRequest: (destAddr, srcAddr) => {
    const retVal = copyJsonWithoutRef(KnxMessageTemplates.generalTemplate)

    retVal.src_addr = srcAddr
    retVal.dest_addr = destAddr
    retVal.apdu.apci = 'Restart'
    retVal.apdu.tpci = KnxConstants.KNX_TPCI_TYPES.TPCI_NDP >> 2
    retVal.apdu.noData = 1

    return retVal
  }
}

module.exports = KnxMessageTemplates
