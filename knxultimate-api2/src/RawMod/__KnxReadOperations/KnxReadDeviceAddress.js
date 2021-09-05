/*****************************************************************************
 * This file contains a function to read the device address of an KNX device *
 *****************************************************************************/

const RawModErrors = require('../Errors')
const KnxMessageTemplates = require('../KnxMessageTemplates')
const KnxNetProtocol = require('../KnxNetProtocol')
const RawModCustomMsgHandlers = require('../CustomMsgHandlers')
const KnxConstants = require('../../KnxConstants')
const KnxAddress = require('../KnxAddress')

module.exports = {
  /*
   * Function: KnxGetDeviceAddress.readDeviceAddress()
   *
   *      !!! There has to be EXACTLY ONE DEVICE, the target device, on the bus that is in programming mode !!!
   *
   *      This function reads the device address of an KNX device by broadcasting a PhysicalAddress_Read request onto the bus
   *      The target, which is in programming mode => listening for broadcast messages, will respond a PhysicalAddress_Response
   *      The PhysicalAddress can be extracted from this PhysicalAddress_Response
   *
   * Arguments:
   *      recvTimeout     Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                      Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                      errorIDs are occurring:
   *                        65546 ('The target failed to respond!')
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
   *          data: [AddressByteOne, AddressByteTwo],
   *          error: 0
   *        }
   *
   *      (where AddressByteOne and AddressByteTwo are representing the PhysicalAddress of the device) on success and
   *
   *        {
   *          data: null,
   *          error: ERRNUM
   *        }
   *
   *      on error ...
   *      The error can be retrieved by using errContext.getErrorByNumber(ERRNUM)
   *      Type: Promise
   *
   * Errors:
   *      RawModErrors.UNDEF_ARGS - At least one argument is undefined
   *      RawModErrors.INVALID_ARGTYPES - At least one argument has an invalid type
   *      RawModErrors.TIMEOUT_REACHED - No device responded in time
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readDeviceAddress: async (recvTimeout, conContext, errContext) => {
    /*
     * The process works like following:
     *      ** Assume that the target device is in programming mode **
     *      Send a DeviceAddressReadRequest
     *      Receive a DeviceAddressResponse
     */

    return new Promise(async resolve => {
      // Create empty vars
      let err
      let rawModErr
      let physicalAddressReadMsg
      let timeoutRef

      // This function validates the arguments
      const checkArguments = () => {
        // This function checks if all the arguments are defined
        const checkArgumentsDefined = () => {
          // Check if the errContext is defined
          if (errContext == null) {
            return 1
          }

          // Check if all the other parameters are defined
          if ((recvTimeout == null) || (conContext == null)) {
            err = new Error(RawModErrors.UNDEF_ARGS.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.UNDEF_ARGS.errorID)

            errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check if all arguments have the correct type
        const checkArgumentTypes = () => {
          if (recvTimeout.constructor !== Number) {
            err = new Error(RawModErrors.INVALID_ARGTYPES.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_ARGTYPES.errorID)

            errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Call the checking functions
        if (checkArgumentsDefined()) { return 1 }
        if (checkArgumentTypes()) { return 1 }
      }

      // This function forges all the needed messages
      const forgeMessages = () => {
        // Forge the physicalAddressREadMsg
        physicalAddressReadMsg = KnxMessageTemplates.physicalAddressReadRequest()
      }

      // A handler for the PhysicalAddress_Response (Contains the 'everything-went-right' exit point)
      const physicalAddressResponseHandler = rawMsgJson => {
        // Check if timeoutRef is null (=> if the handler was already called once)
        if (timeoutRef == null) {
          return
        }

        // Clear the timeout, set timeoutRef to null, remove handlers
        clearTimeout(timeoutRef)
        timeoutRef = null
        removeHandlers()

        // Extract the source address and resolve
        resolve({ error: 0, data: rawMsgJson.cemi.src_addr })
      }

      // This function registers 'memoryResponseHandler'
      const registerHandler = () => {
        /*
         * Register a handler that catches the memory response message from the device
         * This message should arrive in any case - even if the request failed
         *  In that case, it simply won't contain any data
         */
        RawModCustomMsgHandlers.registerCustomMsgHandler({
          cemi: {
            dest_addr: KnxAddress.strToBin(KnxConstants.KNX_BROADCAST_ADDR),
            apdu: {
              apci: 'PhysicalAddress_Response'
            }
          }
        }, physicalAddressResponseHandler, conContext)
      }

      // This function is later used to remove handlers registered below
      const removeHandlers = () => {
        RawModCustomMsgHandlers.removeCustomMsgHandler({
          cemi: {
            dest_addr: KnxAddress.strToBin(KnxConstants.KNX_BROADCAST_ADDR),
            apdu: {
              apci: 'PhysicalAddress_Response'
            }
          }
        }, conContext)
      }

      // This function sends 'physicalAddressReadMsg' to the target
      const sendPhysicalAddressRequest = () => {
        return new Promise(resolve => {
          // Send the physical address read request
          KnxNetProtocol.sendTunnRequest(physicalAddressReadMsg, conContext, sendErr => {
            // Check for errors
            if (sendErr) {
              // Create the RawModError object
              rawModErr = errContext.createNewError(sendErr, null)

              // Push it onto the errorStack
              const errnum = errContext.addNewError(rawModErr)

              // Return errnum
              resolve(errnum)
            }
          })
        })
      }

      // This function creates a timeout for the arrival of the response of the KNX device ('cb' is ... -||-)
      const createRecvTimeout = (resolve) => {
        /*
         * Set a timeout that will remove the handlers if recvTimeout was reached
         * Reaching that timeout means that the device failed to respond (in time)
         */
        timeoutRef = setTimeout(() => {
          // Remove handlers
          removeHandlers()

          // Create a Error() object
          err = new Error(RawModErrors.TIMEOUT_REACHED.errorMsg)

          // Create a RawModError object
          rawModErr = errContext.createNewError(err, RawModErrors.TIMEOUT_REACHED.errorID)

          // Push it onto the errorStack
          const errnum = errContext.addNewError(rawModErr)

          // Return 1
          resolve({ error: errnum, data: null })
        }, recvTimeout)
      }

      let e

      // Call all functions defined above
      e = checkArguments()
      if (e) { resolve({ error: e, data: null }); return }
      forgeMessages()
      registerHandler()
      createRecvTimeout(resolve)
      e = await sendPhysicalAddressRequest()
      if (e) { resolve({ error: e, data: null }) }
    })
  }
}
