/*********************************************************************
 * This file contains a function to write a resource to a KNX device *
 *********************************************************************/

const KnxConstants = require('../../KnxConstants')
const KnxDeviceResourceInformation = require('../KnxDeviceResourceInformation')
const __KnxWriteResourceViaMemory = require('./__KnxWriteResourceViaMemory')
const __KnxWriteResourceViaProperty = require('./__KnxWriteResourceViaProperty')
const RawModErrors = require('../Errors')

module.exports = {
  /*
   * Function: KnxWriteDeviceResource.writeDeviceResource()
   *
   *      This function writes the value of a resource to a KNX device
   *      Like the programming mode flag, manufacturer ID, application ID, ...
   *
   * Arguments:
   *
   *      target              The target device address
   *                          E.g.: 1.2.3, 10.12.25, ...
   *                          Type: String
   *
   *      deviceMaskversion   The maskversion of the device
   *                          This is used to look up needed information about the resource via KnxConstants.KNX_DEV_RESOURCE_INFORMATION
   *                          To get the maskversion of a KNX device, use:
   *                            KnxReadMaskversion.readMaskversion() from KnxReadDeviceResource.js
   *                          E.g.: [0x07, 0x01], [0x00, 0x10], ...
   *                          Type: Array (containing bytes)
   *
   *      source              The source device address to be used when sending messages on the bus
   *                          E.g.: 1.2.3, 10.12.25, ...
   *                          Will default to the address of the used KNX IP interface when undefined (recommended)
   *                          Type: String
   *
   *      resourceNameStr     The name of the resource to be read from the device
   *                          All available resource names can be found in KnxDeviceResourceInformation.js
   *                          (in the maskVersionStr field that every element of the resources element contains)
   *                          E.g.: 'DeviceManufacturerId', 'ApplicationId', 'ApplicationRunStatus', ...
   *                          Type: String
   *
   *      preferredWriteType  The preferred way of writing the resource value
   *                          One of KnxConstants.RESOURCE_ACCESS_TYPES.* or null/undefined for auto-chose
   *                          Choosing the KnxConstants.RESOURCE_ACCESS_TYPES.*_STRICT variant will lead the function to return an error
   *                          if the preferred way of access is not available
   *
   *                          NOTE that almost all resource can be accessed via direct memory access or property access
   *                          But normally, only one of the two ways is described in the KnxDeviceResourceInformation.js file, which is a file
   *                          compiled out of official information ...
   *                          (A way to, for example, find the correct memory address for direct memory access is reading the resource via property access,
   *                          saving the value and then reading the whole memory of the device while searching for the value that was read via property access
   *                          But this method is very time-consuming and other devices, even with the same maskversion, may use other memory addresses etc.)
   *
   *                          E.g.: KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY, KnxConstants.RESOURCE_ACCESS_TYPES.PROPERTY,
   *                                KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY_STRICT, KnxConstants.RESOURCE_ACCESS_TYPES.PROPERTY_STRICT,
   *                                undefined
   *                          Type: Number
   *
   *      value               The value to be written to the device
   *                          E.g.: Buffer.from([0x01]), Uint8Array.from([0x01, 0x02, 0x03])
   *                          Type: Buffer (containing 8-Bit values)
   *
   *      recvTimeout         Specifies how long to wait for an acknowledge message from the KNX device (in milliseconds)
   *                          Recommended to be around 2000 and should be raised to higher values when errors with the following
   *                          errorIDs are occurring:
   *                            65546 ('The target failed to respond!')
   *                          Type: Integer
   *
   *      conContext          The KNX connection context - needed to operate with and on the connection to the KNX-IP interface
   *                          Type: require('advanced_knx').Connection()
   *
   *      errContext          The RawMod error context - needed to indicate errors
   *                          Type: require('advanced_knx').RawMod.errorHandler
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
   *      RawModErrors.INVALID_MV_RN - The maskversion or resource name is invalid
   *      RawModErrors.NO_WRITE_WAY_FOUND - No way of writing the resource value found
   *      RawModErrors.NO_WRITE_WAY_MATCHED - No available way of writing the resource fits the criteria (preferredReadType)
   *
   *      There may be other errors not labeled by RawMod (throw by the socket API when sending messages)
   */
  writeDeviceResource: async (target, source, deviceMaskversion, resourceNameStr, preferredWriteType, value, recvTimeout, conContext, errContext) => {
    return new Promise(async resolve => {
      /** Local variables **/
      let deviceResourceInformation
      let writeViaMemAccessAvailable = false
      let writeViaPropertyAvailable = false
      let writeMethodFunction
      let rawModErr
      let err

      // The value to be passed to resolve
      let retVal = 0

      /** Intern functions needed for the process **/
      // Get information about the resource associated with resourceNameStr
      const getResourceInformation = () => {
        deviceResourceInformation = KnxDeviceResourceInformation.getResourceInfoByMaskVersionAndName(deviceMaskversion, resourceNameStr)

        // Check if anything was found
        if (!deviceResourceInformation) {
          err = new Error(RawModErrors.INVALID_MV_RN.errorMsg)
          rawModErr = errContext.createNewError(err, RawModErrors.INVALID_MV_RN.errorID)
          retVal = errContext.addNewError(rawModErr)

          return 1
        }
      }

      // Check which methods are available for this resource
      const checkAvailableWriteMethods = () => {
        if (deviceResourceInformation.hasOwnProperty('startAddress')) {
          /*
           * 'StandardMemory', 'Constant' are writeable
           */
          if (['StandardMemory', 'Constant'].lastIndexOf(deviceResourceInformation['addressSpace']) !== -1) {
            // Direct memory access possible
            writeViaMemAccessAvailable = true
          }
        }

        /*
         * 'SystemProperty' is writable
         */
        if (deviceResourceInformation.hasOwnProperty('propertyID')) {
          // Property access possible
          writeViaPropertyAvailable = true
        }

        // Check if any method is available
        if (!(writeViaMemAccessAvailable || writeViaPropertyAvailable)) {
          err = new Error(RawModErrors.NO_WRITE_WAY_FOUND)
          rawModErr = errContext.createNewError(err, RawModErrors.NO_WRITE_WAY_FOUND.errorID)
          retVal = errContext.addNewError(rawModErr)

          return 1
        }
      }

      // Choose a method bases on availability and preferredReadType
      const chooseWriteMethodFunction = () => {
        if (writeViaPropertyAvailable && writeViaMemAccessAvailable) {
          // Both are available - choose based on the preferred method
          if (preferredWriteType === KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY) {
            writeMethodFunction = __KnxWriteResourceViaMemory
          } else {
            writeMethodFunction = __KnxWriteResourceViaProperty
          }
        } else if (!writeViaMemAccessAvailable &&
          preferredWriteType === KnxConstants.RESOURCE_ACCESS_TYPES.MEMORY_STRICT) {
          // Using direct memory access forced but not possible - error
          writeMethodFunction = undefined
        } else if (!writeViaPropertyAvailable &&
          preferredWriteType === KnxConstants.RESOURCE_ACCESS_TYPES.PROPERTY_STRICT) {
          // Using property access forced but not possible - error
          writeMethodFunction = undefined
        } else if (writeViaMemAccessAvailable) {
          // Only memory access available
          writeMethodFunction = __KnxWriteResourceViaMemory
        } else if (writeViaPropertyAvailable) {
          // Only property access available
          writeMethodFunction = __KnxWriteResourceViaProperty
        }

        // Check if any function was chosen
        if (!writeMethodFunction) {
          err = new Error(RawModErrors.NO_WRITE_WAY_MATCHED.errorMsg)
          rawModErr = errContext.createNewError(err, RawModErrors.NO_WRITE_WAY_MATCHED.errorID)
          retVal = errContext.addNewError(rawModErr)

          return 1
        }
      }

      // Call the function that reads the resource
      const readResource = async () => {
        retVal = await writeMethodFunction(target, source, deviceResourceInformation, value, recvTimeout, conContext, errContext)
      }

      /** Intern-Function-Calling-Checking section **/
      if (getResourceInformation()) { resolve(retVal); return }
      if (checkAvailableWriteMethods()) { resolve(retVal); return }
      if (chooseWriteMethodFunction()) { resolve(retVal); return }
      await readResource()

      // Resolve the promise - retVal will be passed trough from the chosen read function
      resolve(retVal)
    })
  }
}
