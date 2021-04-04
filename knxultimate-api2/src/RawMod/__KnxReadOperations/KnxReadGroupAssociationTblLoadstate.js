/********************************************************************************************
 * This file contains a function to read the group association table loadstate of an KNX device *
 ********************************************************************************************/

const KnxReadDevMem = require('./KnxReadDevMem')
const KnxConstants = require('../../KnxConstants')

module.exports = {
  /*
   * Function: KnxGetProgmodeStatus.readGroupAssociationTblLoadState()
   *
   *      This function reads a devices group association table loadstate
   *      It uses the KnxReadDevMem().readDevMem() function
   *
   * Arguments:
   *
   *      target            The KNX device address of the target device
   *                        E.g.: '1.1.0', '1.1.250', ...
   *                        Type: String
   *
   *      recvTimeout       How long to wait for an acknowledge message from the target in milliseconds
   *                        Due to network-lags etc., a value gt. 500 is recommended
   *                        E.g.: 500, 1000, 250, 2000
   *                        Type: Number
   *
   *      conContext        The KNX connection context
   *
   *      errContext        The RawMod error context
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
   *      The following data represents the value of the requested property.
   *
   *        {
   *          error: 0,
   *          data: Buffer.from([0x01])
   *        }
   *
   *      On error, error will be set to one and data will be null
   *
   *        {
   *          error: 1,
   *          data: null
   *        }
   *
   *      If the second is the case, an error will be added to errContext.errorStack
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *      RawModErrors.INVALID_ARGVAL - A argument has an invalid value (applicationIndex)
   *      RawModErrors.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readGroupAssociationTblLoadState: async (target, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      /*
       * Pass the request to KnxReadDevMem().readDevMem()
       */
      let val = await KnxReadDevMem.readDevMem(target, conContext.options.physAddr,
        KnxConstants.KNX_MEMORY_ADDRS.MEMORY_GROUP_ASSOCIATION_TBL_LOADSTATE_ADDR, 1, recvTimeout,
        conContext, errContext)

      if (!val.error) {
        // Cut of the first four bytes
        val.data = val.data.slice(2)
      }

      // Return the result
      resolve(val)
    })
  }
}
