const Errors = require('./Errors')
const KnxMessageTemplates = require('./KnxMessageTemplates')
const KnxNetProtocol = require('./KnxNetProtocol')
const KnxNetProtocolExtra = require('./KnxNetProtocolExtra')
const KnxAddress = require('./KnxAddress')
const KnxNetRebuildMessageBytes = require('./KnxNetRebuildMessageBytes')
const Handlers = require('./Handlers')
const ErrorHandler = require('./ErrorHandler')
const KnxConstants = require('../KnxConstants')
const KnxReadDevMem = require('./__KnxReadOperations/KnxReadDevMem')
const KnxWriteDevMem = require('./__KnxWriteOperations/KnxWriteDevMem')
const KnxReadPropertyValue = require('./__KnxReadOperations/KnxReadPropertyValue')
const KnxWritePropertyValue = require('./__KnxWriteOperations/KnxWritePropertyValue')
const KnxGetDeviceAddress = require('./__KnxReadOperations/KnxReadDeviceAddress')
const KnxSetDeviceAddress = require('./__KnxWriteOperations/KnxSetDeviceAddress')
const KnxGetProgmodeStatus = require('./__KnxReadOperations/KnxReadProgmodeStatus')
const KnxSetProgmodeStatus = require('./__KnxWriteOperations/KnxSetProgmodeStatus')
const KnxReadSerialNumber = require('./__KnxReadOperations/KnxReadSerialNumber')
const KnxReadOrderNumber = require('./__KnxReadOperations/KnxReadOrderNumber')
const KnxReadApplicationID = require('./__KnxReadOperations/KnxReadApplicationID')
const KnxReadGroupAddrTblLoadstate = require('./__KnxReadOperations/KnxReadGroupAddrTblLoadstate')
const KnxReadGroupAssociationTblLoadstate = require('./__KnxReadOperations/KnxReadGroupAssociationTblLoadstate')
const KnxReadManufacturerID = require('./__KnxReadOperations/KnxReadManufacturerID')
const KnxReadDeviceADC = require('./__KnxReadOperations/KnxReadDeviceADC')
const KnxReadMaskversion = require('./__KnxReadOperations/KnxReadMaskversion')
const KnxReadDeviceResource = require('./__KnxReadOperations/KnxReadDeviceResource')
const KnxWriteDeviceResource = require('./__KnxWriteOperations/KnxWriteDeviceResource')
const KnxRestartDevice = require('./KnxOperations/RestartDevice')
const KnxLoadStateMachine = require('./KnxOperations/LoadStateMachine')
const KnxRunStateMachine = require('./KnxOperations/RunStateMachine')
const CustomMessageHandlers = require('./CustomMsgHandlers')
const CustomMessageHandlerTemplates = require('./CustomMessageHandlerTemplates')

// The RawMod class - providing useful definitions and functions
module.exports = class RawMod {
  constructor () {
    // Get values regarding the KNX protocol
    this.KNX_KNXNET_CONSTANTS = KnxConstants

    // Get standard RawMod error definition
    this.ERRORS = Errors

    // Get some message templates
    this.KNX_MESSAGE_TEMPLATES = KnxMessageTemplates

    // The RawMod error handler (+ provide function to create new handler)
    this.errorHandler = new ErrorHandler()
    this.newErrorHandler = ErrorHandler

    // RawMod custom message handler class
    this.CustomMessageHandler = CustomMessageHandlers
    this.CustomMessageHandlerTemplates = CustomMessageHandlerTemplates

    // Get functions to work with the KnxNet protocol
    this.KnxNetProtocol = KnxNetProtocol
    this.KnxNetProtocolExtra = new KnxNetProtocolExtra()
    this.KnxNetRebuildMessageBytes = KnxNetRebuildMessageBytes.rebuildMessageBytes
    this.RawModHandlers = Handlers

    // Functions to work with KNX addresses
    this.KnxAddress = KnxAddress

    // More advanced KNX functions
    this.KnxReadDevMem = KnxReadDevMem
    this.KnxWriteDevMem = KnxWriteDevMem
    this.KnxReadPropertyValue = KnxReadPropertyValue
    this.KnxWritePropertyValue = KnxWritePropertyValue

    // These are top-level function that should be used normally
    this.KnxGetProgmodeStatus = KnxGetProgmodeStatus
    this.KnxSetProgmodeStatus = KnxSetProgmodeStatus
    this.KnxSetDeviceAddress = KnxSetDeviceAddress
    this.KnxGetDeviceAddress = KnxGetDeviceAddress
    this.KnxReadSerialNumber = KnxReadSerialNumber
    this.KnxReadOrderNumber = KnxReadOrderNumber
    this.KnxReadApplicationID = KnxReadApplicationID
    this.KnxReadGroupAddrTblLoadState = KnxReadGroupAddrTblLoadstate
    this.KnxReadGroupAssociationTblLoadState = KnxReadGroupAssociationTblLoadstate
    this.KnxReadManufacturerID = KnxReadManufacturerID
    this.KnxReadDeviceADC = KnxReadDeviceADC
    this.KnxReadMaskversion = KnxReadMaskversion
    this.KnxReadDeviceResource = KnxReadDeviceResource
    this.KnxWriteDeviceResource = KnxWriteDeviceResource
    this.KnxRestartDevice = KnxRestartDevice
    this.KnxLoadStateMachine = KnxLoadStateMachine
    this.KnxRunStateMachine = KnxRunStateMachine
  }
}
