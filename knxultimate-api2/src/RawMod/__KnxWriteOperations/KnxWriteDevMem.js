/************************************************************
 * This file contains a function to write KNX device memory *
 ************************************************************/

const RawModErrors = require('../Errors')
const KnxMessageTemplates = require('../KnxMessageTemplates')
const KnxNetProtocol = require('../KnxNetProtocol')
const RawModCustomMsgHandlers = require('../CustomMsgHandlers')
const RawModCustomMsgHandlerTemplates = require('../CustomMessageHandlerTemplates')
const KnxAddress = require('../KnxAddress')
const KnxConstants = require('../../KnxConstants')

module.exports = {
  /*
   * Function: KnxWriteDevMem.writeDevMem()
   *
   *      This function reads a specified number of bytes from a specified memory address of an specified KNX device
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
   *      address         The memory address to read data from
   *                      E.g.: [0x00, 0x60]
   *                      Type: Array (length: two bytes)
   *
   *      data            Data to write to the address
   *                      It must be at least one and at most twelve bytes long
   *                      Type: Buffer (length: one to twelve)
   *
   *      recvTimeout     Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                      Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                      errorIDs are occurring:
   *                        65541 ('The target failed to respond!')
   *                      Type: Integer
   *
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
   *      RawModErrors.INVALID_ARGTYPES - At least one arguments has an invalid type
   *      RawModErrors.INVALID_DATALEN - The data argument has an invalid length
   *      RawModErrors.TARGET_NOTACK- The target device did actively not acknowledge
   *      RawModErrors.TIMEOUT_REACHED - The target device failed to respond in recvTimeout ms
   *      RawModErrors.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  writeDevMem: async (target, source, address, data, recvTimeout, conContext, errContext) => {
    /*
     * The process works like following:
     *      Send a UCD connection request to the target device
     *      Send a memory write request to write n bytes of data to the targets memory@address
     *      (The device should send a NCD acknowledge message, wait for it)
     *      Send a NCD acknowledge message back to the device
     *      Send a UCD disconnect request
     */

    return new Promise(async (resolve) => {
      // Create a empty vars
      let err
      let rawModErr
      let connReq
      let memWriteReq
      let ackMsg
      let dconnMsg
      let timeoutRef
      let ncdAckHandlerTemplate
      let ncdNackHandlerTemplate

      // This function validates the arguments
      const checkArguments = () => {
        let errnum = 0

        // This function check if all arguments are defined
        const checkArgumentsDefined = () => {
          // Check if errContext is defined
          if (errContext == null) {
            return 1
          }

          // Check if all the other parameters are defined
          if ((target == null) || (address == null) || (data == null) || (recvTimeout == null) || (conContext == null)) {
            err = new Error(RawModErrors.UNDEF_ARGS.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.UNDEF_ARGS)

            errnum = errContext.addNewError(rawModErr)

            return 1
          }
        }

        // Check if all arguments have the correct type
        const checkArgumentTypes = () => {
          if ((target.constructor !== String) || ((source != null) ? source.constructor !== String : false) ||
              (address.constructor !== Array) || (data.constructor !== Buffer) || (recvTimeout.constructor !== Number)) {
            err = new Error(RawModErrors.INVALID_ARGTYPES.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_ARGTYPES.errorID)

            errnum = errContext.addNewError(rawModErr)

            return 1
          }
        }

        // This function checks the data argument (data.length <= 12 && >= 1)
        const checkDataVal = () => {
          if ((data.length > 12) || data.length < 1) {
            err = new Error(RawModErrors.INVALID_DATALEN.errorMsg)
            rawModErr = errContext.createNewError(err, RawModErrors.INVALID_DATALEN.errorID)

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
        if (checkDataVal()) { return errnum }
        if (checkTargetAndSource()) { return errnum }
      }

      // This function forges all needed messages
      const forgeMessages = () => {
        connReq = KnxMessageTemplates.ucdConnRequest(target, source)
        memWriteReq = KnxMessageTemplates.memoryWriteRequest(target, source, address, data)
        ackMsg = KnxMessageTemplates.ncdAckMsg(target, source)
        dconnMsg = KnxMessageTemplates.ucdDconnMsg(target, source)
      }

      // This function prepares the custom message handler templates
      const prepareCustomMessageHandlerTemplates = () => {
        ncdAckHandlerTemplate = RawModCustomMsgHandlerTemplates.ncdAckHandlerTemplate(target, source || conContext.options.physAddr)
        ncdNackHandlerTemplate = RawModCustomMsgHandlerTemplates.ncdNackHandlerTemplate(target, source || conContext.options.physAddr)
      }

      // A handler for the acknowledge message (Contains the 'everything-went-right' exit point)
      const ncdAckMsgHandler = () => {
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

            resolve(errnum)
          } else {
            /*
             * Send the UCD disconnect message
             */
            KnxNetProtocol.sendTunnRequest(dconnMsg, conContext, function (sendErr) {
              if (sendErr) {
                rawModErr = errContext.createNewError(sendErr, null)
                const errnum = errContext.addNewError(rawModErr)

                resolve(errnum)

                return
              }

              // Success - Give '0' back
              resolve(0)
            })
          }
        })
      }

      // A handler for the not-acknowledge message
      const ncdNackMsgHandler = () => {
        // Check if timeoutRef is null (=> if the handler was already called once)
        if (timeoutRef == null) {
          return
        }

        // Clear the timeout, set timeoutRef to null, remove handlers
        clearTimeout(timeoutRef)
        timeoutRef = null
        removeHandlers()

        // Send the UCD disconnect message
        KnxNetProtocol.sendTunnRequest(dconnMsg, conContext, function (sendErr) {
          if (sendErr) {
            rawModErr = errContext.createNewError(sendErr, null)
            const errnum = errContext.addNewError(rawModErr)

            resolve({ error: errnum, data: null })

            return
          }

          err = new Error(RawModErrors.TARGET_NOTACK.errorMsg)
          rawModErr = errContext.createNewError(sendErr, RawModErrors.TARGET_NOTACK.errorID)

          const errnum = errContext.addNewError(rawModErr)

          resolve(errnum)
        })
      }

      // Register the handlers defined above
      const registerHandlers = () => {
        RawModCustomMsgHandlers.registerCustomMsgHandler(ncdAckHandlerTemplate, ncdAckMsgHandler, conContext)
        RawModCustomMsgHandlers.registerCustomMsgHandler(ncdNackHandlerTemplate, ncdNackMsgHandler, conContext)
      }

      // This function is later used to remove handlers registered below
      const removeHandlers = () => {
        RawModCustomMsgHandlers.removeCustomMsgHandler(ncdAckHandlerTemplate, conContext)
        RawModCustomMsgHandlers.removeCustomMsgHandler(ncdNackHandlerTemplate, conContext)
      }

      // This function sends the connect and write requests
      const sendConnAndWriteReq = () => {
        return new Promise(resolve => {
          // Send the UCD connection request
          KnxNetProtocol.sendTunnRequest(connReq, conContext, function (sendErr) {
            if (sendErr) {
              // Create the RawModError object
              rawModErr = errContext.createNewError(sendErr, null)

              // Push it onto the errorStack
              const errnum = errContext.addNewError(rawModErr)

              // Return errnum
              resolve(errnum)
            } else {
              // Send the memory write request
              KnxNetProtocol.sendTunnRequest(memWriteReq, conContext, function (sendErr) {
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

      // This function creates a timeout for the arrival of the response of the KNX device
      const createRecvTimeout = () => {
        /*
         * Set a timeout that will remove the handlers if recvTimeout was reached
         * Reaching that timeout means that the device failed to respond
         */
        timeoutRef = setTimeout(function () {
          // Remove handlers
          removeHandlers()

          // Create a Error() object
          err = new Error(RawModErrors.TIMEOUT_REACHED.errorMsg)

          // Create a RawModError object
          rawModErr = errContext.createNewError(err, RawModErrors.TIMEOUT_REACHED.errorID)

          // Push it onto the errorStack
          const errnum = errContext.addNewError(rawModErr)

          // Return errnum
          resolve(errnum)
        }, recvTimeout)
      }

      let e

      // Call the functions defined above
      e = checkArguments()
      if (e) { resolve(e); return }
      forgeMessages()
      prepareCustomMessageHandlerTemplates()
      registerHandlers()
      createRecvTimeout(resolve)
      e = await sendConnAndWriteReq()
      if (e) { resolve(e) }
    })
  }
}
