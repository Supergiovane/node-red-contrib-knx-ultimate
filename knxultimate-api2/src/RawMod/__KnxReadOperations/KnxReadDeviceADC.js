/*****************************************************************
 * This file contains a function to read a KNX devices ADC value *
 *****************************************************************/

const KnxMessageTemplates = require('../KnxMessageTemplates')
const KnxNetProtocol = require('../KnxNetProtocol')
const KnxAddress = require('../KnxAddress')
const RawModErrors = require('../Errors')
const RawModCustomMsgHandlers = require('../CustomMsgHandlers')
const RawModCustomMsgHandlerTemplates = require('../CustomMessageHandlerTemplates')
const KnxConstants = require('../../KnxConstants')

module.exports = {
  /*
   * Function: KnxReadDeviceADC.readDeviceADC()
   *
   *      This function reads a KNX devices ADC value of an specific channel
   *      (The sum of a specific number of A to D conversions)
   *
   *
   *
   * Arguments:
   *
   *      target          The target device address. E.g.: 1.2.3 or 10.12.25, ...
   *                      Type: String
   *
   *      source          Source address to use. When set to null, the device address of the KNX-Interface will be used
   *                      Note that this option should be set to null most of the time
   *                      E.g.: 2.3.4, 11.13.26 or null, ...
   *                      Type: String/null
   *
   *      channel         Channel number of the AD-converter
   *                      Type: Number
   *
   *      readCount       Number of consecutive reads of the AD-converters value
   *                      E.g.: 1, 4, 6, 8, ...
   *                      Type: Number
   *
   *      recvTimeout     Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                      Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                      errorIDs are occurring:
   *                        65546 ('The target failed to respond!')
   *                      Type: Integer
   *
   *      conContext      The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *                      Type: require('advanced_knx').Connection()
   *
   *      errContext      The RawMod error context - needed to indicate errors
   *                      Type: require('advanced_knx').RawMod.errorHandler
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
   *
   *        {
   *          error: 0,
   *          data: Buffer.from([0x01, 0x08, 0x00, 0x00])
   *        }
   *
   *      The first byte being the channel. The second byte being the count. The last two bytes being the ADC data
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
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readDeviceADC: async (target, source, channel, readCount, recvTimeout, conContext, errContext) => {
    /*
     * The process works like following:
     *      Send a UCD connection request to the target device
     *      Send a adc read request
     *      (The device should send the requested data, wait for it)
     *      Send a NCD acknowledge message back to the device
     *      Send a UCD disconnect request
     */

    return new Promise(async resolve => {
      // Create empty vars
      let err
      let rawModErr
      let connReq
      let adcReadReq
      let ackMsg
      let dconnMsg
      let timeoutRef
      let adcresponseHandlerTemplate

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
          if ((target == null) || (channel == null) || (readCount == null) || (recvTimeout == null) || (conContext == null)) {
            err = new Error(RawModErrors.UNDEF_ARGS.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.UNDEF_ARGS)

            errnum = errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check if all arguments have the correct type
        const checkArgumentTypes = () => {
          if ((target.constructor !== String) || ((source != null) ? source.constructor !== String : false) ||
            (channel.constructor !== Number) || (readCount.constructor !== Number) || (recvTimeout.constructor !== Number)) {
            err = new Error(RawModErrors.INVALID_ARGTYPES.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_ARGTYPES.errorID)

            errnum = errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check the values of the target and the source arguments
        const checkTargetAndSource = () => {
          let retVal = 0

          // Validate target
          if (KnxAddress.validateAddrStr(target) === -1 ||
            KnxAddress.getAddrType(target) !== KnxConstants.KNX_ADDR_TYPES.DEVICE) {
            err = new Error(RawModErrors.INVALID_TARGET.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_TARGET.errorID)

            errnum = errContext.addNewError(rawModErr)

            retVal = 1
          }

          // Validate source, if defined
          if (source) {
            if (KnxAddress.validateAddrStr(source) === -1 ||
              KnxAddress.getAddrType(source) !== KnxConstants.KNX_ADDR_TYPES.DEVICE) {
              err = new Error(RawModErrors.INVALID_SOURCE.errorMsg)
              rawModErr = errContext.createNewError(err, RawModErrors.INVALID_SOURCE.errorID)

              errnum = errContext.addNewError(rawModErr)

              retVal = 1
            }
          }

          // Return
          return retVal
        }

        // Call the checking functions
        if (checkArgumentsDefined()) { return errnum }
        if (checkArgumentTypes()) { return errnum }
        if (checkTargetAndSource()) { return errnum }
      }

      // This function forges all the needed messages
      const forgeMessages = () => {
        connReq = KnxMessageTemplates.ucdConnRequest(target, source)
        adcReadReq = KnxMessageTemplates.adcReadRequest(target, source, channel, readCount)
        ackMsg = KnxMessageTemplates.ncdAckMsg(target, source)
        dconnMsg = KnxMessageTemplates.ucdDconnMsg(target, source)
      }

      // This function prepares the custom message handler templates
      const prepareCustomMessageHandlerTemplates = () => {
        adcresponseHandlerTemplate = RawModCustomMsgHandlerTemplates.adcResponseTemplate(target, source || conContext.options.physAddr)
      }

      // A handler for the ADCResponse (Contains the 'everything-went-right' exit point)
      const adcResponseHandler = rawMsgJson => {
        // Check if timeoutRef is null (=> if the handler was already called once)
        if (timeoutRef == null) {
          return
        }

        // Clear the timeout, set timeoutRef to null, remove handlers
        clearTimeout(timeoutRef)
        timeoutRef = null
        removeHandlers()

        // Send a NCD acknowledge message to the device
        KnxNetProtocol.sendTunnRequest(ackMsg, conContext, function (sendErr) {
          if (sendErr) {
            rawModErr = errContext.createNewError(sendErr, null)
            const errnum = errContext.addNewError(rawModErr)

            resolve({ error: errnum, data: null })

            return
          }

          // Send a UCD disconnect request
          KnxNetProtocol.sendTunnRequest(dconnMsg, conContext, function (sendErr) {
            if (sendErr) {
              rawModErr = errContext.createNewError(sendErr, null)
              const errnum = errContext.addNewError(rawModErr)

              resolve({ error: errnum, data: null })

              return
            }

            /********************************/
            /*        Return the data       */
            resolve({ error: 0, data: rawMsgJson.cemi.apdu.data })
            /********************************/
          })
        })
      }

      // This function registers 'adcResponseHandler'
      const registerHandler = () => {
        /*
         * Register a handler that catches the adc response message from the device
         * This message should arrive in any case - even if the request failed
         *  In that case, it simply won't contain any data
         */
        RawModCustomMsgHandlers.registerCustomMsgHandler(adcresponseHandlerTemplate, adcResponseHandler, conContext)
      }

      // This function is later used to remove handlers registered below
      const removeHandlers = () => {
        RawModCustomMsgHandlers.removeCustomMsgHandler(adcresponseHandlerTemplate, conContext)
      }

      // This function sends 'connReq' and 'memReadReq' to 'target'
      const sendConnAndReadReq = () => {
        return new Promise(resolve => {
          // Send the UCD connection request
          KnxNetProtocol.sendTunnRequest(connReq, conContext, sendErr => {
            // Check for errors
            if (sendErr) {
              // Create the RawModError object
              rawModErr = errContext.createNewError(sendErr, null)

              // Push it onto the errorStack
              const errnum = errContext.addNewError(rawModErr)

              // Return errnum
              resolve(errnum)
            } else {
              // Send the adc read request
              KnxNetProtocol.sendTunnRequest(adcReadReq, conContext, sendErr => {
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

          // Return errnum
          resolve({ error: errnum, data: null })
        }, recvTimeout)
      }

      let e

      // Call all functions defined above
      e = checkArguments()
      if (e) { resolve({ error: e, data: null }); return }
      forgeMessages()
      prepareCustomMessageHandlerTemplates()
      registerHandler()
      createRecvTimeout(resolve)
      e = await sendConnAndReadReq()
      if (e) { resolve({ error: e, data: null }) }
    })
  }
}
