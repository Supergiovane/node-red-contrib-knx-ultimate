/************************************************
 * This file contains several handler functions *
 ************************************************/

const KnxConstants = require('../KnxConstants')
const CustomMsgHandlers = require('./CustomMsgHandlers')
const _KnxNetProtocolExtra = require('./KnxNetProtocolExtra')

const KnxNetProtocolExtra = new _KnxNetProtocolExtra()

module.exports = class RawModHandlers {
  /*
   * Function: RawModHandlers.rawMsgHandler()
   *
   *      This function will be called from connections.js around line 50 on every arriving message
   *          => It won't be called on broken messages - this.brokenMsgHandler() will be called on these
   *      It will calculate the actual KNX message out of rawMsg and rawMsgJson
   *      This will be passed to conContext.handlers.rawMsgCb (if defined) along with rawMsgJson
   *
   * Arguments:
   *
   *      rawMsg      The raw Knx-Net message (Buffer)
   *      rawMsgJson  The raw Knx-Net message (Json-parsed)
   *      conContext  The connection context
   */
  static rawMsgHandler (rawMsg, rawMsgJson, conContext) {
    /*
     * Check the type of the message - only TUNNELING_REQUESTs are relevant
     */
    if (rawMsgJson.service_type === KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST) {
      /*
       * Check if this message sets of any custom handlers (see checkCallCustomMsgHandler() below)
       */
      CustomMsgHandlers.checkCallCustomMsgHandler(rawMsgJson, conContext)

      if (conContext.handlers) {
        if (conContext.handlers.rawMsgCb) {
          /*
           * Construct the raw bus message and pass it on along with rawMsgJson
           */
          conContext.handlers.rawMsgCb(KnxNetProtocolExtra.rebuildMessageBytes(rawMsg), rawMsgJson)
        }
      }
    }
  }

  /*
   * Function: RawModHandlers.brokenMsgHandler()
   *
   *      This functions will be called from Connections.js around line 60 if a broken message arrived
   *      This happens from time to time - especially when doing things like unicast communication with devices on the bus etc.
   *      But it is important to catch these broken messages:
   *          Every message from the KNX-IP interface has to be acknowledged - the connection will be killed otherwise
   *          So this callback calls KnxNetProtocolExtra.sendAck
   *
   *
   *  Arguments:
   *
   *      rawMsg      The broken message as JSON object
   *      conContext  The connection context
   */
  static brokenMsgHandler (rawMsg, conContext) {
    /*
     * Extract the sequence number from the broken message and send a acknowledge message
     */
    KnxNetProtocolExtra.sendAck(KnxNetProtocolExtra.msgGetSeqnum(rawMsg), conContext)
  }

  /*
   * Function: RawModHandlers.connFailHandler()
   *
   *      This functions will be called from ../FSM.js around line 125 when the connection to the KNX-IP interface fails
   *      It will call a user-set callback (this.handlers.connFailCb), if defined
   *
   * Arguments:
   *
   *      conContext  The connection context
   */
  static connFailHandler (conContext) {
    // Check if conContext is defined
    if (conContext) {
      if (conContext.handlers) {
        if (conContext.handlers.connFailCb) {
          conContext.handlers.connFailCb()
        }
      }
    }
  }

  /*
   * Function: RawModHandlers.outOfConnectionsHandler()
   *
   *      This function will be called from ../FSM.js around line 170 when the KNX-IP interface reported that it ran out of connections
   *      It will check if the user defined a handler for this case (conContext.handlers.outOfConnectionsCb) and calls it, if defined
   *
   * Arguments:
   *      conContext  The connection context
   */
  static outOfConnectionsHandler (conContext) {
    if (conContext.handlers) {
      if (conContext.handlers.outOfConnectionsCb) {
        conContext.handlers.outOfConnectionsCb()
      }
    }
  }

  /*
   * Function: RawModHandlers.sendFailHandler()
   *
   *      This function will be called from ../FSM.js around line 400 when trying to send a message to the KNX-IP interface fails
   *      It will call this.handlers.sendFailCb, if defined
   *
   * Arguments:
   *      err         The error returned by the send function
   *      conContext  The connection context
   */
  static sendFailHandler (err, conContext) {
    if (conContext.handlers) {
      if (conContext.handlers.sendFailCb) {
        conContext.handlers.sendFailCb(err)
      }
    }
  }

  /*
   * Function: RawModHandlers.waitAckTimeoutHandler()
   *
   *      This function will be called from FSM.js around line 440 when a timeout was reached when waiting for an acknowledge
   *      message from the KNX-IP interface
   *      The standard timeout is 2000ms but it can be changed by setting receiveAckTimeout when setting up the connection
   *
   * Arguments:
   *
   *      conContext  The connection context
   */
  static waitAckTimeoutHandler (conContext) {
    if (conContext.handlers) {
      if (conContext.handlers.waitAckTimeoutCb) {
        conContext.handlers.waitAckTimeoutCb()
      }
    }
  }
}
