/********************************************************************
 * This file contains a function to read a resource of a KNX device *
 ********************************************************************/

// const RawModErrors = require('../Errors
const KnxConstants = require('../../KnxConstants')
const KnxDeviceResourceInformation = require('../KnxDeviceResourceInformation')
const __KnxReadDeviceResourceViaMemory = require('./__KnxReadResourceViaMemory')
const __KnxReadDeviceResourceViaProperty = require('./__KnxReadResourceViaProperty')
const RawModErrors = require('../Errors')

module.exports = {
  /*
   * Function: KnxReadDeviceResource.readDeviceResource()
   *
   *      This function reads a resource of a KNX device
   *      Like the programming mode flag, manufacturer ID, application ID, ...
   *      However, functions to read "special"-resources (like the ADC value) are stored in separate files
   *
   * Arguments:
   *
   *      target            The target device address
   *                        E.g.: 1.2.3, 10.12.25, ...
   *                        Type: String
   *
   *      deviceMaskversion The maskversion of the device
   *                        This is used to look up needed information about the resource via KnxConstants.KNX_DEV_RESOURCE_INFORMATION
   *                        To get the maskversion of a KNX device, use:
   *                          KnxReadMaskversion.readMaskversion() from KnxReadDeviceResource.js
   *                        E.g.: [0x07, 0x01], [0x00, 0x10], ...
   *                        Type: Array (containing bytes)
   *
   *      source            The source device address to be used when sending messages on the bus
   *                        E.g.: 1.2.3, 10.12.25, ...
   *                        Will default to the address of the used KNX IP interface when undefined (recommended)
   *                        Type: String
   *
   *      resourceNameStr   The name of the resource to be read from the device
   *                        All available resource names can be found in KnxDeviceResourceInformation.js
   *                        (in the maskVersionStr field that every element of the resources element contains)
   *                        E.g.: 'DeviceManufacturerId', 'ApplicationId', 'ApplicationRunStatus', ...
   *                        Type: String
   *
   *      preferredReadType The preferred way of reading the resource
   *                        One of KnxConstants.RESOURCE_ACCESS_TYPES.* or null/undefined for auto-chose
   *                        Choosing the KnxConstants.RESOURCE_ACCESS_TYPES.*_STRICT variant will lead the function to return an error
   *                        if the preferred way of access is not available
   *
   *                        NOTE that almost all resource can be accessed via direct memory access or property access
   *                        But normally, only one of the two ways is described in the KnxDeviceResourceInformation.js file, which is a file
   *                        compiled out of official information ...
   *                        (A way to, for example, find the correct memory address for direct memory access is reading the resource via property access,
   *                        saving the value and then reading the whole memory of the device while searching for the value that was read via property access
   *                        But this method is very time-consuming and other devices, even with the same maskversion, may use other memory addresses etc.)
   *
   *                        E.g.: KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY, KnxConstants.RESOURCE_ACCESS_TYPES.PROPERTY,
   *                              KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY_STRICT, KnxConstants.RESOURCE_ACCESS_TYPES.PROPERTY_STRICT,
   *                              undefined
   *                        Type: Number
   *
   *      recvTimeout       Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                        Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                        errorIDs are occurring:
   *                          65546 ('The target failed to respond!')
   *                        Type: Integer
   *
   *      conContext        The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *                        Type: require('advanced_knx').Connection()
   *
   *      errContext        The RawMod error context - needed to indicate errors
   *                        Type: require('advanced_knx').RawMod.errorHandler
   *
   * Return:
   *
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
   *          data: Buffer.from([0x00, 0x60, 0x01])
   *        }
   *
   *      The first two bytes being the memory address, followed by n data bytes
   *      The example shows a response a response containing data (0x01) read from 0x0060 (ProgrammingMode, in most cases)
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
   *      RawModErrors.INVALID_READLEN - The length argument has an invalid value
   *      RawModErrors.TIMEOUT_REACHED - The target failed to response in recvTimeout ms
   *      RawModErrors.INVALID_TARGET - target isn't a valid KNX address
   *      RawModErrors.INVALID_SOURCE - source is defined and it isn't a valid KNX address
   *
   *      RawModErrors.INVALID_MV_RN - The maskversion or resource name is invalid
   *      RawModErrors.NO_READ_WAY_FOUND - No way of writing the resource value found
   *      RawModErrors.NO_READ_WAY_MATCHED - No available way of writing the resource fits the criteria (preferredReadType)
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  readDeviceResource: async (target, source, deviceMaskversion, resourceNameStr, preferredReadType, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      /** Local variables **/
      let deviceResourceInformation
      let readViaMemAccessAvailable = false
      let readViaPropertyAvailable = false
      let readMethodFunction = null
      let rawModErr
      let err

      // The value to be passed to resolve
      let retVal = {
        error: undefined,
        data: undefined
      }

      /** Intern functions needed for the process **/
      // Get information about the resource associated with resourceNameStr
      const getResourceInformation = () => {
        deviceResourceInformation = KnxDeviceResourceInformation.getResourceInfoByMaskVersionAndName(deviceMaskversion, resourceNameStr)

        // Check if anything was found
        if (!deviceResourceInformation) {
          err = new Error(RawModErrors.INVALID_MV_RN.errorMsg)
          rawModErr = errContext.createNewError(err, RawModErrors.INVALID_MV_RN.errorID)
          retVal.error = errContext.addNewError(rawModErr)

          return 1
        }
      }

      // Check which methods are available for this resource
      const checkAvailableReadMethods = () => {
        if (deviceResourceInformation.hasOwnProperty('startAddress')) {
          /*
           * 'StandardMemory', 'Constant' are readable
           */
          if (['StandardMemory', 'Constant'].lastIndexOf(deviceResourceInformation['addressSpace']) !== -1) {
            // Direct memory access possible
            readViaMemAccessAvailable = true
          }
        }

        /*
         * 'SystemProperty' is readable
         */
        if (deviceResourceInformation.hasOwnProperty('propertyID')) {
          // Property access possible
          readViaPropertyAvailable = true
        }

        // Check if any method is available
        if (!(readViaMemAccessAvailable || readViaPropertyAvailable)) {
          err = new Error(RawModErrors.NO_READ_WAY_FOUND.errorMsg)
          rawModErr = errContext.createNewError(err, RawModErrors.NO_READ_WAY_FOUND.errorID)
          retVal.error = errContext.addNewError(rawModErr)

          return 1
        }
      }

      // Choose a method bases on availability and preferredReadType
      const chooseReadMethodFunction = () => {
        if (readViaPropertyAvailable && readViaMemAccessAvailable) {
          // Both are available - choose based on the preferred method
          if (preferredReadType === KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY) {
            readMethodFunction = __KnxReadDeviceResourceViaMemory
          } else {
            readMethodFunction = __KnxReadDeviceResourceViaProperty
          }
        } else if (!readViaMemAccessAvailable &&
            preferredReadType === KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY_STRICT) {
          // Using direct memory access forced but not possible - error
          readMethodFunction = undefined
        } else if (!readViaPropertyAvailable &&
            preferredReadType === KnxConstants.RESOURCE_ACCESS_TYPES.PROPERTY_STRICT) {
          // Using property access forced but not possible - error
          readMethodFunction = undefined
        } else if (readViaMemAccessAvailable) {
          // Only memory access available
          readMethodFunction = __KnxReadDeviceResourceViaMemory
        } else if (readViaPropertyAvailable) {
          // Only property access available
          readMethodFunction = __KnxReadDeviceResourceViaProperty
        }

        // Check if any function was chosen
        if (!readMethodFunction) {
          err = new Error(RawModErrors.NO_READ_WAY_MATCHED.errorMsg)
          rawModErr = errContext.createNewError(err, RawModErrors.NO_READ_WAY_MATCHED.errorID)
          retVal.error = errContext.addNewError(rawModErr)

          return 1
        }
      }

      // Call the function that reads the resource
      const readResource = async () => {
        retVal = await readMethodFunction(target, source, deviceResourceInformation, recvTimeout, conContext, errContext)
      }

      /** Intern-Function-Calling-Checking section **/
      if (getResourceInformation()) { resolve(retVal); return }
      if (checkAvailableReadMethods()) { resolve(retVal); return }
      if (chooseReadMethodFunction()) { resolve(retVal); return }
      await readResource()

      /*
       * add the used access type to retval
       * needed so that the caller knows how to handle the returned data
       */
      if (readMethodFunction === __KnxReadDeviceResourceViaMemory) {
        retVal.usedAccessMethod = KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY
      } else {
        retVal.usedAccessMethod = KnxConstants.RESOURCE_ACCESS_TYPES.PROPERTY
      }

      // Resolve the promise - retVal will be passed trough from the chosen read function
      resolve(retVal)
    })
  }
}
