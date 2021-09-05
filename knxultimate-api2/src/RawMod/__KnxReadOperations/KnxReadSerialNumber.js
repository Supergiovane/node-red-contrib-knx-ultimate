/****************************************************************************
 * This file contains a function to read the serial number of an KNX device *
 ****************************************************************************/

const KnxConstants = require('../../KnxConstants')
const KnxReadDeviceResource = require('./KnxReadDeviceResource')

module.exports = {
  /*
   * Function: KnxGetProgmodeStatus.readSerialNumber()
   *
   *      This function reads a device serial number
   *      It uses the KnxReadPropertyValue.readPropertyValue() function
   *
   * Arguments:
   *
   *      target        The KNX device address of the target device
   *                    E.g.: '1.1.0', '1.1.250', ...
   *                    Type: String
   *
   *      recvTimeout   How long to wait for an acknowledge message from the target in milliseconds
   *                    Due to network-lags etc., a value gt. 500 is recommended
   *                    E.g.: 500, 1000, 250, 2000
   *                    Type: Number
   *
   *      maskVersion   The maskversion of the device
   *                    Used/Needed to get information on how to access the ProgrammingMode Flag on the device
   *                    Type: Integer
   *
   *      conContext    The KNX connection context
   *
   *      errContext    The RawMod error context
   *
   * Return:
   *      Returns a promise which resolves with the following JSON object:
   *
   *      {
   *        error: x,
   *        data: y
   *      }
   *
   *      If everything goes well, error will be zero and data will be the response-data of the target device
   *      The first four bytes are information about the data being responded (eq. to the first four bytes of the request message)
   *      These four bytes are formed like this:
   *        Buffer.from([objectIndex, propertyID, ((elementCount & 0b1111) << 4) | (startIndex >> 8) & 0b1111, startIndex & 0b11111111])
   *
   *      The following data represents the value of the requested property.
   *
   *        {
   *          error: 0,
   *          data: Buffer.from([0x00, 0x83, 0x3f, 0xc4, 0xe0, 0x32])
   *        }
   *
   *      On error, error will be set to ERRNUM and data will be null
   *
   *        {
   *          error: ERRNUM,
   *          data: null
   *        }
   *
   *      If the second is the case, an error will be added to errContext.errorStack
   *      The error can be retrieved by using errContext.getErrorByNumber(ERRNUM)
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *      RawModErrors.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *      RawModErrors.INVALID_MV_RN - The maskversion or resource name is invalid
   *      RawModErrors.NO_WRITE_WAY_FOUND - No way to write the resource value found
   *      RawModErrors.NO_WRITE_WAY_MATCHED - No way to write the resource value matches the criteria
   *      RawModErrors.NO_READ_WAY_FOUND - No way to read the resource found
   *      RawModErrors.NO_READ_WAY_MATCHED - No way to read the resource matches the criteria
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readSerialNumber: async (target, recvTimeout, maskVersion, conContext, errContext) => {
    return new Promise(async resolve => {
      // read the resource
      const val = await KnxReadDeviceResource.readDeviceResource(target, null, maskVersion,
        'DeviceSerialNumber', KnxConstants.RESOURCE_ACCESS_TYPES.ALL, recvTimeout, conContext, errContext)

      if (!val.error) {
        // Cut of the first n bytes - n depends on the access way used
        if (val.usedAccessMethod === KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY) {
          // Used memory address - cut off first three bytes
          val.serialNumber = val.data.slice(3)
        } else {
          // Used property access - cut off first four bytes
          val.serialNumber = val.data.slice(4)
        }
      }

      // Return the result
      resolve(val)
    })
  }
}
