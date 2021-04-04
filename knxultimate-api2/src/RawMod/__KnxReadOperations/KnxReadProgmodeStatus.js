/******************************************************************************
 * This file contains a function to read the progmode status of an KNX device *
 ******************************************************************************/

const KnxConstants = require('../../KnxConstants')
const KnxReadDeviceResource = require('./KnxReadDeviceResource')

module.exports = {
  /*
   * Function: KnxGetProgmodeStatus.readProgmodeStatus()
   *
   *      This function reads the programming mode status of KNX devices
   *      It uses the KnxReadDevMem.readDevMem() function and does not introduce any own errors
   *
   * Arguments:
   *
   *      target          The target device address. E.g.: 1.2.3 or 10.12.25, ...
   *                      Type: String
   *
   *      recvTimeout     Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                      Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                      errorIDs are occurring:
   *                        65546 ('The target failed to respond!')
   *                      Type: Integer
   *
   *      recvTimeout     Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                      Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                      errorIDs are occurring:
   *                        65542 ('The target failed to respond!')
   *                      Type: Integer
   *
   *      conContext      The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *
   *      errContext      The RawMod error context - needed to indicate errors
   *
   * Return:
   *      Returns a promise which resolves with
   *
   *        {
   *          data: Buffer.from([progmodeStatus]),
   *          error: 0
   *        }
   *
   *      (where progmodeStatus is the programming mode status of the device) on success and
   *
   *        {
   *          data: null,
   *          error: ERRNUM
   *        }
   *
   *      ... on error
   *      The error can be retrieved by using errContext.getErrorByNumber(ERRNUM)
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.INVALID_READLEN - The length argument has an invalid value
   *      RawModErrors.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *      RawModErrors.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *      RawModErrors.INVALID_MV_RN - The maskversion or resource name is invalid
   *      RawModErrors.NO_READ_WAY_FOUND - No way to read the resource found
   *      RawModErrors.NO_READ_WAY_MATCHED - No way to read the resource matches the criteria
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readProgmodeStatus: async (target, recvTimeout, maskVersion, conContext, errContext) => {
    return new Promise(async resolve => {
      // read the resource
      const val = await KnxReadDeviceResource.readDeviceResource(target, null, maskVersion,
        'ProgrammingMode', KnxConstants.RESOURCE_ACCESS_TYPES.ALL, recvTimeout, conContext, errContext)

      if (!val.error) {
        // Cut of the first n bytes - n depends on the access way used
        if (val.usedAccessMethod === KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY) {
          // Used memory address - cut off first three bytes
          val.progmodeStatus = val.data.slice(3)
        } else {
          // Used property access - cut off first four bytes
          val.progmodeStatus = val.data.slice(4)
        }
      }

      // Return the result
      resolve(val)
    })
  }
}
