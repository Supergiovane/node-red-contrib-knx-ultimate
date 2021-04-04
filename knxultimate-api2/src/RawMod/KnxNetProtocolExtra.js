/*****************************************************************
 * This file contains functions to work with KnxNet messages for *
 *                           RawMod.js                           *
 ****************************************************************/

const KnxConstants = require('../KnxConstants')
const KnxNetProtocol = require('./KnxNetProtocol')
const knxNetRebuildMessageBytes = require('./KnxNetRebuildMessageBytes')
const knxParseTpci = require('./KnxParseTpci')

module.exports = class KnxNetProtocolExtra extends KnxNetProtocol {
  constructor () {
    super()

    // Get the rebuildMessageBytes function
    this.rebuildMessageBytes = knxNetRebuildMessageBytes.rebuildMessageBytes
    this.parseTpci = knxParseTpci.parseTpci
  }

  /*
   * Function: KnxNetProtocolExtra.sendAck
   *
   *      This function is used to send acknowledge messages to the KNX-IP interface
   *      Normally, the library would take care of this IF it is able to parse the incoming message
   *      If not, which may be caused by a broken message, it wont send a acknowledge which would cause the KNX-IP
   *      interface to kill the connection
   *
   * Arguments:
   *
   *      seqnum      Sequence number of the message to acknowledge - Wrong seqnum could cause the connection to die
   *      conContext  The KNX connection context
   *
   */
  sendAck (seqnum, conContext) {
    conContext.send(KnxNetProtocol.prepareDatagram(KnxConstants.SERVICE_TYPE.TUNNELING_ACK, null, seqnum, conContext))
  }

  /*
   * Function: KnxNetProtocolExtra.msgGetSeqnum
   *
   *      This function extracts the sequence number from a message
   *      May only be needed to work with FSM.prototype.sendAck
   *
   * Arguments:
   *
   *      message     The message to work on - as a raw Buffer NOT in Json
   */
  msgGetSeqnum (message) {
    return message[message[0] + 2]
  }

  /*
   * Function: KnxNetProtocolExtra.messageMatchesTemplate()
   *
   *      This function checks if a KNX message matches a given template (both JSON objects)
   *      It checks if every element contained in the template is the same as it is in the message
   *
   *      NOTE that:
   *
   *          a: Buffer([1]) is treated as equal to a: 1
   *
   *  Arguments:
   *
   *      template    The template to check the message with - JSON object
   *      rawMsgJson  The message to check - JSON object
   *
   *  Return:
   *
   *      Zero when template matches rawMsgJson and -1 if not
   */
  messageMatchesTemplate (template, rawMsgJson) {
    // Check if both are defined
    if (!(template && rawMsgJson)) {
      return -1
    }

    for (let e in template) {
      // Check if the current element exists in template
      if (template.hasOwnProperty(e)) {
        // Check if the current element exists in rawMsgJson
        if (rawMsgJson.hasOwnProperty(e)) {
          // Check if the current element is null
          if (rawMsgJson[e] === null) {
            // The values can be directly compared to each other
            if (rawMsgJson[e] === template[e]) {
              continue
            }

            return -1
          } else {
            // Check the type of the current element
            switch (rawMsgJson[e].constructor) {
              case Buffer:
              case Array:
                // When the buffer/array has a length of one and if this single element matches the template, treat it as equal
                if (rawMsgJson[e][0] === template[e]) {
                  continue
                } else if (rawMsgJson[e].length === 1 && rawMsgJson[e][0] === template[e]) {
                  continue
                }

                return -1

              case Object:
                // Assume that it is a JSON object - go recursive
                if (this.messageMatchesTemplate(template[e], rawMsgJson[e]) !== -1) {
                  continue
                }

                return -1

              default:
                // The values can be directly compared to each other
                if (rawMsgJson[e] === template[e]) {
                  continue
                }

                return -1
            }
          }
        } else {
          // Element specified in the template but not in the message - not matching
          return -1
        }
      }
    }

    // Return zero if the template matches
    return 0
  }
}
