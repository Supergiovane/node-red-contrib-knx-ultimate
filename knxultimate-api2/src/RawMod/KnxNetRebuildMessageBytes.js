/*********************************************
 * This file contains a function to rebuild  *
 * raw KNX messages from KNXNet Json objects *
 *                  RawMod.js                *
 *********************************************/

const KnxConstants = require('../KnxConstants')

module.exports = class KnxNetRebuildMessageBytes {
  /*
   *
   * Function: KnxNetRebuildMessageBytes.rebuildMessageBytes()
   *
   *      This function assembles a Buffer, which is equal to the KNX message on the bus,
   *      from an JSON object representing a KNX message
   *      Parts of the original KNX message are already contained in the KNXNet message - but in the wrong order or slightly modified
   *      BUt having the original message can be useful for bus monitoring etc.
   *
   * Arguments:
   *
   *      rawMsg      The KNXNet message from the KNX-IP interface (buffer)
   *                  It look like following
   *
   *                      header_length           [1 Byte]
   *                      protocol_version        [1 Byte]
   *                      service_type            [2 Bytes]
   *                      total_length            [2 Bytes]
   *                      tunnstate               [4 Bytes]
   *                          .header_length      [1 Byte]
   *                          .channel_id         [1 Byte]
   *                          .seqnum             [1 Byte]
   *                          .rsvd               [1 Byte]
   *                      cemi                    [total_length - header_length - tunnstate.header_length Bytes]
   *                          .msgcode            [1 Byte]
   *                          .addinfo_length     [1 Byte]
   *                          .knx_message        [total_length - header_length - tunnstate.header_length - addinfo_length - 1]
   *                              .[0]            (Control byte)
   *                              .[1]            (Higher four bits of NPCI/Higher four bits of Extended control byte)
   *                              .[2-3]          (Source address)
   *                              .[4-5]          (Destination address)
   *                              .[6]            (Lower four bits of NPCI (all eight when extended frame) == NPDU length)
   *                              .[7]            (TPCI + Highest two APCI bits)
   *                              .[8]            (Lowest two APCI bits + APCI-embedded data)
   *                              .[9-n]          (Data)
   */
  static rebuildMessageBytes (rawMsg) {
    /*
     * Calculate where the KNX message starts inside the KNXNet message
     * This is done by using the values of certain field of the KNXNet message (see above)
     */
    const knxMessageOffset = rawMsg[0] + rawMsg[6] + rawMsg[7 + rawMsg[6]] + 2

    let knxMessageLength = 0
    let rawMsgBytes = 0

    /*
     * Check the type of the KNX message
     */
    if (rawMsg[knxMessageOffset] !== KnxConstants.KNX_MSG_TYPES.MSG_POLL) {
      if ((rawMsg[knxMessageOffset] & KnxConstants.KNX_BITMASKS.MSGTYPE_BITMASK) ===
        KnxConstants.KNX_MSG_TYPES.MSG_NORMAL) {
        /*
         * Calculate the total length of the KNX message and create a buffer to store the original message
         */
        knxMessageLength = KnxConstants.KNX_MSG_LENS.NORMAL_MINLEN + rawMsg[knxMessageOffset + 6]
        rawMsgBytes = Buffer.alloc(knxMessageLength)

        /*
         * Copy static bytes into the buffer
         */
        rawMsgBytes[0] = rawMsg[knxMessageOffset + 0]
        rawMsgBytes[1] = rawMsg[knxMessageOffset + 2]
        rawMsgBytes[2] = rawMsg[knxMessageOffset + 3]
        rawMsgBytes[3] = rawMsg[knxMessageOffset + 4]
        rawMsgBytes[4] = rawMsg[knxMessageOffset + 5]
        rawMsgBytes[5] = rawMsg[knxMessageOffset + 1] | rawMsg[knxMessageOffset + 6]
        rawMsgBytes[6] = rawMsg[knxMessageOffset + 7]
        rawMsgBytes[7] = rawMsg[knxMessageOffset + 8]

        /*
         * Copy data-bytes into the buffer
         */
        rawMsg.copy(rawMsgBytes, 8, knxMessageOffset + 9, knxMessageOffset + knxMessageLength + 1)
      } else if ((rawMsg[knxMessageOffset] & KnxConstants.KNX_BITMASKS.MSGTYPE_BITMASK) ===
        KnxConstants.KNX_MSG_TYPES.MSG_EXTENDED) {
        /*
         * Calculate the total length of the KNX message and create a buffer to store the original message
         */
        knxMessageLength = KnxConstants.KNX_MSG_LENS.KNX_EXTENDED_MINLEN + rawMsg[knxMessageOffset + 6]
        rawMsgBytes = Buffer.alloc(knxMessageLength)

        /*
         * Copy static bytes into the buffer
         */
        rawMsgBytes[0] = rawMsg[knxMessageOffset + 0]
        rawMsgBytes[1] = rawMsg[knxMessageOffset + 1]
        rawMsgBytes[2] = rawMsg[knxMessageOffset + 2]
        rawMsgBytes[3] = rawMsg[knxMessageOffset + 3]
        rawMsgBytes[4] = rawMsg[knxMessageOffset + 4]
        rawMsgBytes[5] = rawMsg[knxMessageOffset + 5]
        rawMsgBytes[6] = rawMsg[knxMessageOffset + 6]
        rawMsgBytes[7] = rawMsg[knxMessageOffset + 7]
        rawMsgBytes[8] = rawMsg[knxMessageOffset + 8]

        /*
         * Copy data-bytes into the buffer
         */
        rawMsg.copy(rawMsgBytes, 9, knxMessageOffset + 9, knxMessageOffset + knxMessageLength)
      } else {
        /*
         * The KNX type of this message is unknown
         */
        return null
      }
    } else {
      /*
       * Handling of poll messages is NOT implemented
       * They never appear anyways
       */
      return null
    }

    /*
     * A important part that is missing is the checksum byte
     * It is calculated by XOR-ing all bytes together and NOT-ing the result afterwards
     */
    for (let i = 0; i < knxMessageLength - 1; i++) {
      rawMsgBytes[knxMessageLength - 1] ^= rawMsgBytes[i]
    }

    rawMsgBytes[knxMessageLength - 1] = ~rawMsgBytes[knxMessageLength - 1]

    /*
     * The buffer should now contain the original KNX message - return it
     */
    return rawMsgBytes.slice(0, knxMessageLength)
  }
}
