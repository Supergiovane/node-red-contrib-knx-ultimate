/********************************************************************
 * This file contains a parser for the TPCI field of an KNX message *
 *                             RawMod.js                            *
 ********************************************************************/

const KnxConstants = require('../KnxConstants')

module.exports = class KnxParseTpci {
  /*
   * Function: KnxParseTpci.parseTpci()
   *
   *      This function can parse the TPCI byte of an KNX message
   *      It is done here because the library wasn't capable of doing this by default
   *      It is called from KnxProtocol.js around line 385 to parse TPCI bytes of messages
   *
   *  Arguments:
   *
   *      tpci        The TPCI byte of an KNX message
   *
   *  Return:
   *
   *      It will return a string describing the TPCI byte
   *          e.g.: "NCD_ACK Seqnum: 1"
   *          e.g.: "NCP_NACK Seqnum: 4"
   *          e.g.: "UCD_CON Seqnum: 0"
   *          e.g.: "UCD_CON Seqnum: 0"
   *          e.g.: "UCD_DCON Seqnu: 0"
   *          e.g.: "UDP_APCI Seqnum: 0"
   *          e.g.: "NDP_APCI Seqnum: 5"
   */
  static parseTpci (tpci) {
    // Initialize retval
    let retval = ''

    // Check if tpci is a Buffer, Array, ...
    const handleVarType = () => {
      /*
       * Important: JS will handle Buffer.from([null]) and Buffer.from([0]) equally!
       */
      if (typeof tpci === 'object') {
        // Use the first element of the buffer as tpci
        tpci = tpci[0]

        // Check if the new tpci is defined
        if (tpci === null) {
          return null
        }

        return tpci
      } else if (typeof tpci === 'number') {
        return tpci
      } else {
        return null
      }
    }

    // Check the tpci type
    const checkTpciType = () => {
      /*
       * Determine the tpci type
       * The TPCI field looks like this:
       *
       *  Bit                          Meaning
       *   0       APCI when NDP/UDP - SubType identifier when NCD/UCD
       *   1      (UCD_CON: 00, UCD_DCON: 01, NCD_ACK: 10, NCD_NACK: 11)
       *   2                        Packet number
       *   3                            -| |-
       *   4                            -| |-
       *   5                            -| |-
       *   6                    TPCI type identifier
       *   7             (UDP: 00, NDP: 01, UCD: 10, NCD: 11)
       *
       * Bitmasks (defined at the top of this file) are used to extract and check needed bits of the TPCI byte
       */
      switch (tpci & KnxConstants.KNX_BITMASKS.TPCI_TYPE_BITMASK) {
        case (KnxConstants.KNX_TPCI_TYPES.TPCI_UDP):
          retval = 'UDP_APCI'
          break

        case (KnxConstants.KNX_TPCI_TYPES.TPCI_NDP):
          retval = 'NDP_APCI'
          break

        case (KnxConstants.KNX_TPCI_TYPES.TPCI_UCD):
          retval = 'UCD_'
          break

        case (KnxConstants.KNX_TPCI_TYPES.TPCI_NCD):
          retval = 'NCD_'
          break
      }

      return retval
    }

    // Check the Tpci_Ucd type
    const checkTpciUcdType = () => {
      // Determine the UCD sub-type
      switch (tpci & KnxConstants.KNX_BITMASKS.TPCI_UCD_TYPE_BITMASK) {
        case (KnxConstants.KNX_TPCI_SUBTYPES.TPCI_UCD_CON):
          retval = retval + 'CON'
          break

        case (KnxConstants.KNX_TPCI_SUBTYPES.TPCI_UCD_DCON):
          retval = retval + 'DCON'
          break

        default:
          retval += 'UNKNOWN'
      }

      return retval
    }

    // Check the Tpci_Ncd type
    const checkTpciNcdType = () => {
      // Determine the NCD sub-type
      switch (tpci & KnxConstants.KNX_BITMASKS.TPCI_NCD_TYPE_BITMASK) {
        case (KnxConstants.KNX_TPCI_SUBTYPES.TPCI_NCD_ACK):
          retval = retval + 'ACK'
          break

        case (KnxConstants.KNX_TPCI_SUBTYPES.TPCI_NCD_NACK):
          retval += 'NACK'
          break

        default:
          retval += 'UNKNOWN'
      }

      return retval
    }

    // Append the sequence number to the string
    const appendSeqnum = () => {
      return retval + ' Seqnum: ' + ((tpci & KnxConstants.KNX_BITMASKS.TPCI_SEQNUM_BITMASK) >> 2).toString()
    }

    // Check that tpci is set
    if (tpci !== null) {
      tpci = handleVarType()

      if (tpci == null) return null

      retval = checkTpciType()

      if (retval === 'UCD_') {
        retval = checkTpciUcdType()
      } else if (retval === 'NCD_') {
        retval = checkTpciNcdType()
      }

      // Check if it is a numbered message and add the sequence number if thats the case
      if (!(retval.includes('UCD') || retval.includes('UDP'))) {
        retval = appendSeqnum()
      }

      return retval
    } else {
      return null
    }
  }
}
