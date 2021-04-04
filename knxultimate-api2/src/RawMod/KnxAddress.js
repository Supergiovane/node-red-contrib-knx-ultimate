/***************************************************************************
 * This file contains functions and definitions to work with knx addresses *
 ***************************************************************************/

const KnxConstants = require('../KnxConstants')

module.exports = class KnxAddress {
  /*
   * Function KnxAddress.getAddrType()
   *
   *      This function gets the type of an KNX address string (Group/Device)
   *      It HAS to be a valid address - total trash will be returned otherwise
   *
   * Arguments:
   *
   *      addrStr   A string representing a valid KNX address
   *                E.g.: '31/2047', '31/7/255', '15.15.255', '1.1.0', ...
   *                Type: String
   *
   * Return:
   *
   *      Returns the address Type
   *      E.g.: KnxConstants.KNX_ADDR_TYPES.GROUP (1), KnxConstants.KNX_ADDR_TYPES.DEVICE (0)
   *      Type: Number
   *
   *      Or minus one on error
   *
   * Errors:
   *
   *      On error, minus one will be returned
   *      NOTE that invalid outputs will be returned on invalid inputs
   *      Use KnxAddress.validateAddrStr() to validate addresses
   */
  static getAddrType (addrStr) {
    if (addrStr.lastIndexOf('/') !== -1) {
      return KnxConstants.KNX_ADDR_TYPES.GROUP
    } else if (addrStr.lastIndexOf('.') !== -1) {
      return KnxConstants.KNX_ADDR_TYPES.DEVICE
    } else {
      return -1
    }
  }

  /*
   * Function KnxAddress.grpAddrStrGetL()
   *
   *      This function gets the level of an group address
   *      It HAS to be a valid group address - total trash will be returned otherwise
   *
   * Arguments:
   *
   *      grpAddrStr  A string representing a valid KNX group address
   *                  E.g.: '31/2047', '31/7/255', ...
   *                  Type: String
   *
   * Return:
   *
   *      Returns the addresses level
   *      E.g.: 2, 3
   *      Type: Number
   *
   * Errors:
   *
   *      Every return value differing from one and two is an error, caused by invalid input
   *      Use KnxAddress.validateAddrStr() to validate addresses
   */
  static grpAddrStrGetL (grpAddrStr) {
    // Split the string at every '/' and return the number returned parts === The addresses level
    return grpAddrStr.split('/').length
  }

  /*
   * Function KnxAddress.validateAddrStr()
   *
   *      This function validates KNX addresses
   *
   * Arguments:
   *
   *      addrStr   A string representing a KNX address
   *                E.g.: '31/2047', '31/7/255', '15.15.255', ...
   *                Type: String
   *
   * Return:
   *
   *      Zero, when the address is valid
   *      Or minus one if it is not
   */
  static validateAddrStr (addrStr) {
    let retVal = 0

    // Check if addrStr is defined and at least three chars long (Shortest address: 0/0, 1/1, ...)
    if (!addrStr || addrStr.length < 3) {
      retVal = -1
    } else {
      // Check for separators
      const groupHint = addrStr.lastIndexOf('/')
      const deviceHint = addrStr.lastIndexOf('.')

      // It has to be group OR device
      if (((groupHint !== -1) && (deviceHint !== -1)) ||
        ((groupHint === -1) && (deviceHint === -1))) {
        retVal = -1
      } else {
        // If it is group, check the level - If it is device, check that it has exactly two separators
        if (groupHint !== -1) {
          const lvl = KnxAddress.grpAddrStrGetL(addrStr)

          // Check if it is a valid level
          if (lvl !== 2 && lvl !== 3) {
            retVal = -1
          }
        } else {
          // Check that it has two separators and a minimal length of five (Shortest address: 1.1.1, 2.2.2, ...)
          if (addrStr.split('.').length !== 3) {
            retVal = -1
          } else if (addrStr.length < 5) {
            retVal = -1
          }
        }
      }
    }

    // Return
    return retVal
  }

  /*
   * Function: KnxAddress.strToBin()
   *
   *      This function converts a knx address string into a buffer
   *      It covers all type of group addresses (Level 2 and level 3) and individual addresses
   *
   * Arguments:
   *
   *      addressStr      A string representing a valid KNX address
   *                      E.g.: '31/2047', '31/7/255', '15.15.255', ...
   *                      Type: String
   *
   * Return:
   *
   *      addrBin         addressStr converted into the actual KNX address it represented
   *                      E.g.: 0x8202, ...
   *                      Type: Number
   *
   * Errors:
   *
   *      The function shall return null if:
   *        Unknown separation characters are used
   *        A invalid amount of separation characters are used
   */
  static strToBin (addressStr) {
    let addrBin
    let addrStrParts

    // Check if addressStr is defined and if it has a .lastIndexOf() function
    if (!addressStr) {
      return null
    } else if (!addressStr.lastIndexOf) {
      return null
    }

    // Check the type (GROUP/DEVICE) of addressStr
    if (addressStr.lastIndexOf('/') !== -1) {
      // Group address - Check the level by splitting it
      addrStrParts = addressStr.split('/')

      // One separator: two parts; Two separators: three parts
      switch (addrStrParts.length - 1) {
        case 1:
          // Level 2 group address (one separator)
          // The first five bits consist of the first part, the lower eleven of the second one
          addrBin = (parseInt(addrStrParts[0]) % (2 ** 5)) << 11
          addrBin |= parseInt(addrStrParts[1]) % (2 ** 11)

          break
        case 2:
          // Level 3 group address (two separators)
          // The first five bits consist of the first part, the middle three of the second part and the lower eight of the third one
          addrBin = (parseInt(addrStrParts[0]) % (2 ** 5)) << 11
          addrBin |= (parseInt(addrStrParts[1]) % (2 ** 3)) << 8
          addrBin |= parseInt(addrStrParts[2]) % (2 ** 8)

          break
        default:
          // Unknown level
          return null
      }
    } else if (addressStr.lastIndexOf('.') !== -1) {
      // Device address - split it into the three parts
      addrStrParts = addressStr.split('.')

      // The first four bits are part one, the second four part two and the last eight part three
      addrBin = (parseInt(addrStrParts[0]) % (2 ** 4)) << 12
      addrBin |= (parseInt(addrStrParts[1]) % (2 ** 4)) << 8
      addrBin |= (parseInt(addrStrParts[2]) % (2 ** 8))
    } else {
      // Unknown address type
      return null
    }

    // Return addrBin
    return addrBin
  }

  /*
   * Function: KnxAddress.binToStrGrpL2()
   *
   *      This function converts a knx address buffer into a string (AddressRepresentation: Level 2)
   *
   * Arguments:
   *
   *      addressBin      A valid KNX address
   *                      E.g.: 0x1802, ...
   *                      Type: Number
   *
   * Return:
   *
   *      addrStr         addressBin converted into a string representing it
   *                      E.g.: '31/2047', '7/255', ...
   *                      Type: String
   */
  static binToStrGrpL2 (addressBin) {
    let addrStrP1
    let addrStrP2

    // Check if addressBin is defined and if it is valid (INT n; n >= 0 and n < 2**16) and if it has a .toString() function
    if (!addressBin) {
      return null
    } else if (!((addressBin >= 0) && (addressBin < 2 ** 16))) {
      return null
    } else if (!addressBin.toString) {
      return null
    }

    // Extract the first five bits
    addrStrP1 = (addressBin >> 11).toString()

    // Extract the lower eleven bits
    addrStrP2 = (addressBin & 0b0000011111111111).toString()

    // Return the final value
    return addrStrP1 + '/' + addrStrP2
  }

  /*
   * Function: KnxAddress.binToStrGrpL3()
   *
   *      This function converts a knx address buffer into a string (AddressRepresentation: Level 3)
   *
   * Arguments:
   *
   *      addressBin      A valid KNX address
   *                      E.g.: 0x2202, ...
   *                      Type: Number
   *
   * Return:
   *
   *      addrStr         addressBin converted into a string representing it
   *                      E.g.: '31/7/255', '10/5/120', '1/0/1', ...
   *                      Type: String
   */
  static binToStrGrpL3 (addressBin) {
    let addrStrP1
    let addrStrP2
    let addrStrP3

    // Check if addressBin is defined and if it is valid (INT n; n >= 0 and n < 2**16) and if it has a .toString() function
    if (!addressBin) {
      return null
    } else if (!((addressBin >= 0) && (addressBin < 2 ** 16))) {
      return null
    } else if (!addressBin.toString) {
      return null
    }

    // Extract the first five bits
    addrStrP1 = (addressBin >> 11).toString()

    // Extract the middle three bits
    addrStrP2 = ((addressBin & 0b0000011100000000) >> 8).toString()

    // Extract the lower eight bits
    addrStrP3 = (addressBin & 0b0000000011111111).toString()

    // Return the final value
    return addrStrP1 + '/' + addrStrP2 + '/' + addrStrP3
  }

  /*
   * Function: KnxAddress.binToInd()
   *
   *      This function converts a knx address buffer into a string (AddressRepresentation: Individual)
   *
   * Arguments:
   *
   *      addressBin      A valid KNX address
   *                      E.g.: 0x1113, ...
   *                      Type: Number
   *
   * Return:
   *
   *      addrStr         addressBin converted into a string representing it
   *                      E.g.: '1.1.2', '10.5.120', '15.15.255', ...
   *                      Type: String
   */
  static binToInd (addressBin) {
    let addrStrP1
    let addrStrP2
    let addrStrP3

    // Check if addressBin is defined and if it is valid (INT n; n >= 0 and n < 2**16) and if it has a .toString() function
    if (!addressBin) {
      return null
    } else if (!((addressBin >= 0) && (addressBin < 2 ** 16))) {
      return null
    } else if (!addressBin.toString) {
      return null
    }

    // Extract the first four bits
    addrStrP1 = (addressBin >> 12).toString()

    // Extract the middle four bits
    addrStrP2 = ((addressBin & 0b0000111100000000) >> 8).toString()

    // Extract the lower eight bits
    addrStrP3 = (addressBin & 0b0000000011111111).toString()

    // Return the final value
    return addrStrP1 + '.' + addrStrP2 + '.' + addrStrP3
  }

  /*
   * Function: KnxAddress.UInt16ToUInt8Arr()
   *
   *      This function converts a KNX address stored in UInt16 format to an UInt8Array
   *      consisting of two members, the first one being the first eight bit of the address
   *
   * Arguments:
   *
   *      addressBinUInt16    A KNX address stored as UInt16
   *                          E.g.: Uint16Array.from([0x1102]), ...
   *                          Type: Uint16Array/Single 16-bit value
   *
   * Return:
   *
   *      addrUInt8           The address stored in a Uint8Array, like described above
   *                          Type: Uint8Array
   */
  static Uint16AddrToUint8Arr (addressBinUInt16) {
    return Uint8Array.from([(addressBinUInt16 >> 8), (addressBinUInt16 & 0b11111111)])
  }

  /*
   * Function: KnxAddress.UInt8ToUInt16Arr()
   *
   *      This function converts a KNX address stored in UInt8 format to UInt16Array
   *      consisting of two members, the first one being the first eight bit of the address
   *
   * Arguments:
   *
   *      addressBinUInt8     A KNX address stored as UInt8Array
   *                          E.g.: Uint8Array.from([0x11, 0x02]), ...
   *                          Type: Uint8Array/Single 8-bit value
   *
   * Return:
   *
   *      addrUInt16          The address stored as Uint16Array
   *                          Type: Uint16Array
   */
  static Uint8ArrToUint16Addr (addressBinUint8Arr) {
    return Uint16Array.from([(addressBinUint8Arr[0] << 8) | addressBinUint8Arr[1]])
  }
}
