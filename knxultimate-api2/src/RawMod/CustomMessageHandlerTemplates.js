/**************************************************
 * This file contains some custom message handler *
 **************************************************/

const KnxConstants = require('../KnxConstants')

/*
 * 'CustomMessageHandlerTemplates' contains custom message handler templates for different types of messages
 * Every template consists of a register template (used to register the handler)
 */

const CustomMessageHandlerTemplates = {
  ncdNackHandlerTemplate: (sender, receiver) => {
    return {
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          tpci: KnxConstants.KNX_TPCI_TYPES.TPCI_NCD | KnxConstants.KNX_TPCI_SUBTYPES.TPCI_NCD_NACK
        }
      }
    }
  },
  ncdAckHandlerTemplate: (sender, receiver) => {
    return {
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          tpci: KnxConstants.KNX_TPCI_TYPES.TPCI_NCD | KnxConstants.KNX_TPCI_SUBTYPES.TPCI_NCD_ACK
        }
      }
    }
  },
  memoryResponseTemplate: (sender, receiver) => {
    return {
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          apci: 'Memory_Response'
        }
      }
    }
  },
  adcResponseTemplate: (sender, receiver) => {
    return {
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          apci: 'ADC_Response'
        }
      }
    }
  },
  devDescrResponseTemplate: (sender, receiver) => {
    return {
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          apci: 'DeviceDescriptor_Response'
        }
      }
    }
  },
  propertyValueResponseTemplate: (sender, receiver) => {
    return {
      cemi: {
        src_addr: sender,
        dest_addr: receiver,
        apdu: {
          apci: 'PropertyValue_Response',
          tpci: KnxConstants.KNX_TPCI_TYPES.TPCI_NDP
        }
      }
    }
  }
}

module.exports = CustomMessageHandlerTemplates
