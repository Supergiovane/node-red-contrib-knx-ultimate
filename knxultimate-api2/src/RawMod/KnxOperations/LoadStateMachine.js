/*
 * This file contains functions to interact with a devices Run State Machine
 * Information on this can be found in README-operation_rawmod.md
 */

const KnxReadDeviceResource = require('../__KnxReadOperations/KnxReadDeviceResource')
const KnxConstants = require('../../KnxConstants')
const KnxWriteDeviceResource = require('../__KnxWriteOperations/KnxWriteDeviceResource')
const _ = require('lodash')

/*
 * Read the state of the LSM of the given device
 * when retval.error is not set:
 *  retval.data will contain the raw-data returned from the device
 *  retval.runstate will contain the state of the LSM
 * if it is:
 *  retval.data will be unset
 *  retval.runstate will be undefined
 */
const getLSMState = async (target, source, maskVersion, recvTimeout, conContext, errContext, preferredReadType = KnxConstants.RESOURCE_ACCESS_TYPES.ALL) => {
  // Read it
  const retval = await KnxReadDeviceResource.readDeviceResource(target, source, maskVersion, 'ApplicationLoadStatus',
    preferredReadType, recvTimeout, conContext, errContext)

  // Check if data was returned - if so, copy the loadstate into a separate field
  if (retval.data && retval.data.length > 0) {
    retval.loadstate = _.last(retval.data)
  }

  return retval
}

/*
 * Send a command to the LSM of the given device
 * command => One of KnxConstants.KNX_LSM_CMDS
 */
const sendLSMCMD = (target, source, maskVersion, recvTimeout, command, conContext, errContext, preferredWriteType = KnxConstants.RESOURCE_ACCESS_TYPES.ALL) => {
  const wval = Buffer.from([command])

  // Write it and pass the result trough
  return KnxWriteDeviceResource.writeDeviceResource(target, source, maskVersion, 'ApplicationLoadStatus',
    preferredWriteType, wval, recvTimeout, conContext, errContext)
}

module.exports = {
  getLSMState: getLSMState,
  sendLSMCMD: sendLSMCMD
}
