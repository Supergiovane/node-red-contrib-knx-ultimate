/******************************************************************************
 * This file contains a function to write the device address of an KNX device *
 ******************************************************************************/

const RawModErrors = require('../Errors')
const KnxMessageTemplates = require('../KnxMessageTemplates')
const KnxNetProtocol = require('../KnxNetProtocol')
const KnxAddress = require('../KnxAddress')

module.exports = {
  /*
   * Function: KnxSetDeviceAddress.setDeviceAddress()
   *
   *      !!! There has to be EXACTLY ONE DEVICE, the target device, on the bus that is in programming mode !!!
   *      !!! This function should be used with caution - it could sustainably mess things up => cause work !!!
   *
   *      This function writes the device address to an KNX device by broadcasting a PhysicalAddress_Write request onto the bus
   *      The target, which is in programming mode => listening for broadcast messages, will accept the new address
   *      If successful can be checked by using KnxGetDeviceAddress.readDeviceAddress() to read the address from the device
   *
   * Arguments:
   *      newAddr         The new address of the device. E.g.: 1.2.3 or 10.12.25, ...
   *                      Type: String

   *      conContext      The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *                      Type: require('advanced_knx').Connection()
   *
   *      errContext      The RawMod error context - needed to indicate errors
   *                      Type: require('advanced_knx').RawMod.errorHandler
   *
   * Return:
   *      Returns a promise which resolves with zero on success and with ERRNUM if something went wrong
   *      If the second is the case, an error will be added to errContext.errorStack
   *      The error can be retrieved by using errContext.getErrorByNumber(ERRNUM)
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.INVALID_NEWADDRESS - The address the was requested to be written is invalid
   *
   *      There may be other errors not labeled by RawMod (thrown by the socket API when sending messages)
   */
  setDeviceAddress: async (newAddr, conContext, errContext) => {
    /*
     * The process works like following:
     *      ** Assume that the target device is in programming mode **
     *      Send a DeviceAddressWriteRequest
     */

    return new Promise(async resolve => {
      // Create empty vars
      let err
      let rawModErr
      let physicalAddressWriteMsg
      let newAddrBuf

      // This function validates the arguments
      const checkArguments = () => {
        let errnum = 0

        // This function checks if all the arguments are defined
        const checkArgumentsDefined = () => {
          // Check if the errContext is defined
          if (errContext == null) {
            return 1
          }

          // Check if all the other parameters are defined
          if ((newAddr == null) || (conContext == null)) {
            err = new Error(RawModErrors.UNDEF_ARGS.errorMsg)
            rawModErr = errContext.createNewError.errorID(err, RawModErrors.UNDEF_ARGS)

            errnum = errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check if all arguments have the correct type
        const checkArgumentTypes = () => {
          if (newAddr.constructor !== String) {
            err = new Error(RawModErrors.INVALID_ARGTYPES.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_ARGTYPES.errorID)

            errnum = errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Call the checking functions
        if (checkArgumentsDefined()) { return errnum }
        if (checkArgumentTypes()) { return errnum }
      }

      // This function converts the new address from string to buffer
      const prepareNewAddr = () => {
        newAddrBuf = KnxAddress.strToBin(newAddr)

        // Check the return value
        if (newAddrBuf == null) {
          err = new Error(RawModErrors.INVALID_NEWADDRESS.errorMsg)
          rawModErr = errContext.createNewError(err, RawModErrors.INVALID_NEWADDRESS.errorID)

          const errnum = errContext.addNewError(rawModErr)

          return errnum
        }
      }

      // This function forges all the needed messages
      const forgeMessages = () => {
        // Forge the physicalAddressREadMsg
        physicalAddressWriteMsg = KnxMessageTemplates.physicalAddressWriteRequest(KnxAddress.Uint16AddrToUint8Arr(newAddrBuf))
      }

      // This function sends 'physicalAddressReadMsg' to the target
      const sendPhysicalAddressWriteRequest = () => {
        return new Promise(resolve => {
          // Send the physical address read request
          KnxNetProtocol.sendTunnRequest(physicalAddressWriteMsg, conContext, sendErr => {
            // Check for errors
            if (sendErr) {
              // Create the RawModError object
              rawModErr = errContext.createNewError(sendErr, null)

              // Push it onto the errorStack
              const errnum = errContext.addNewError(rawModErr)

              // Return 1
              resolve(errnum)
            }
          })
        })
      }

      let e

      // Call all functions defined above
      e = checkArguments()
      if (e) { resolve(e); return }
      e = prepareNewAddr()
      if (e) { resolve(e); return }
      forgeMessages()
      e = await sendPhysicalAddressWriteRequest()
      if (e) { resolve(e) }
    })
  }
}
