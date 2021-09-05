/****************************************************************
 * This file contains function to construct KnxNet messages for *
 *                            RawMod.js                         *
 *      It also contains a function to send these messages.     *
 * (Most functions are already defined in ../Connection.js, the *
 *  functions in this file give the caller more control)        *
 ****************************************************************/

const KnxConstants = require('../KnxConstants')

module.exports = class KnxNetProtocol {
  /*
   * Function: KnxNetProtocol.AddHPAI
   *
   *      This function adds HPAI information to a datagram
   *
   * Arguments:
   *
   *      datagram        The datagram to operate on (in Json format)
   *      localAddress    The local address of the host running this
   *      localPort       The local port of the connection
   */
  static addHPAI (datagram, localAddress, localPort) {
    datagram.hpai = {
      protocol_type: KnxConstants.PROTOCOL_TYPE.IPV4_UDP,
      tunnel_endpoint: localAddress + ':' + localPort
    }
  }

  /*
   * Function: KnxNetProtocol.AddTunn
   *
   *      This function adds Tunn information to a datagram
   *      (It is the same as KnxNetProtocol.addHPAI)
   *
   * Arguments:
   *
   *      datagram        The datagram to operate on (in Json format)
   */
  static addTunn (datagram, localAddress, localPort) {
    KnxNetProtocol.addHPAI(datagram, localAddress, localPort)
  }

  /*
   * Function: KnxNetProtocol.AddCemi
   *
   *      This function adds Cemi information to a datagram
   *      This is the most essential step when crafting KNX messages
   *      The Cemi part contains all the thing that go to the KNX-bus
   *
   * Arguments:
   *
   *      datagram        The datagram to operate on (in Json format)
   *      cemi            The Cemi structure (See below for its structure)
   */
  static addCemi (datagram, cemi) {
    // Fill all the values into the datagram
    datagram.cemi = {
      msgcode: cemi.msgCode,

      ctrl: {
        frameType: cemi.ctrl.frameType,
        reserved: 0,
        repeat: cemi.ctrl.repeat,
        broadcast: cemi.ctrl.broadcast,
        priority: cemi.ctrl.priority,
        acknowledge: cemi.ctrl.acknowledge,
        confirm: cemi.ctrl.confirm,
        destAddrType: cemi.ctrl.destAddrType,
        hopCount: cemi.ctrl.hopCount,
        extendedFrame: cemi.ctrl.extendedFrame
      },

      src_addr: cemi.src_addr,
      dest_addr: cemi.dest_addr,

      apdu: cemi.apdu
    }
  }

  /*
   * Function: KnxNetProtocol.AddTunnState
   *
   *      This function adds TunnState information to a datagram
   *
   * Arguments:
   *
   *      datagram        The datagram to operate on (in Json format)
   *      channelId      The connection channel ID
   *      tunnelEndpoint Tunnel endpoint address and port
   *      seqnum          Sequence number - autofill when null (normally null)
   */
  static addTunnState (datagram, channelId, remoteEndpoint, seqnum) {
    datagram.tunnstate = {
      channel_id: channelId,
      tunnel_endpoint: remoteEndpoint.addr + ':' + remoteEndpoint.port,
      seqnum: seqnum || null
    }
  }

  /*
   * Function: KnxNetProtocol.prepareDatagram
   *
   *      This function prepares a datagram by calling functions defined above
   *
   * Arguments:
   *
   *      serviceType     The service type - KnxConstants.SERVICE_TYPE.* (normally .TUNNELING_REQUEST, sometimes .TUNNELING_ACK)
   *      cemi            The cemi structure - See above (FSM.prototype.__AddCEMI())
   *                      When serviceType is not eq. KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST, cemi is ignored
   *      seqnum          Sequence number - autofill when null (normally null)
   *      conContext      The KNX connection context
   *
   * Return:
   *
   *      datagram        The fully prepared datagram ready to be sent
   */
  static prepareDatagram (serviceType, cemi, seqnum, conContext) {
    // Prepare the header of the datagram
    const datagram = {
      'header_length': 6,
      'protocol_version': 16,
      'service_type': serviceType,
      'total_length': null
    }

    // Add HPAI information, independent from serviceType
    KnxNetProtocol.addHPAI(datagram, conContext.localAddress, conContext.localPort)

    // Add all the other needed data depending on serviceType
    switch (serviceType) {
      case KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST:
        KnxNetProtocol.addTunn(datagram, conContext.localAddress, conContext.localPort)
        KnxNetProtocol.addTunnState(datagram, conContext.channel_id, conContext.remoteEndpoint, seqnum)
        KnxNetProtocol.addCemi(datagram, cemi)
        break
      case KnxConstants.SERVICE_TYPE.TUNNELING_ACK:
        KnxNetProtocol.addTunnState(datagram, conContext.channel_id, conContext.remoteEndpoint, seqnum)
        break
    }

    // Return the datagram
    return datagram
  }

  /*
   * Function: KnxNetProtocol.sendTunnRequest
   *
   *      This function may be used to send tunneling requests to the KNX-IP interface
   *      Tunneling requests have to serviceType set to KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST (see above)
   *
   * Arguments:
   *
   *      inArg       The cemi structure as Json object - see above (addCemi())
   *      conContext  The KNX connection context
   *      callback    This function will be called when the request was sent
   */
  static sendTunnRequest (cemi, conContext, callback) {
    // Check if cemi is present
    if (!cemi) {
      callback(Error('Can not send a message with cemi eq. null!'))
      return
    }

    const finalCemi = {
      // Default msgCode: KnxConstants.MESSAGECODES["L_Data.req"] == 0x11
      msgCode: (cemi.msgCode != null) ? cemi.msgCode : 0x11,

      ctrl: (cemi.ctrl != null) ? {
        frameType: (cemi.ctrl.frameType != null) ? cemi.ctrl.frameType : 1, // default: standard frame
        repeat: (cemi.ctrl.repeat != null) ? cemi.ctrl.repeat : 1, // default: do NOT repeat
        broadcast: (cemi.ctrl.broadcast != null) ? cemi.ctrl.broadcast : 1, // default: broadcast
        priority: (cemi.ctrl.priority != null) ? cemi.ctrl.priority : 3, // default: low
        destAddrType: (cemi.ctrl.destAddrType != null) ? cemi.ctrl.destAddrType : 1, // default: groupaddr
        hopCount: (cemi.ctrl.hopCount != null) ? cemi.ctrl.hopCount : 6, // default: 6
        extendedFrame: (cemi.ctrl.extendedFrame != null) ? cemi.ctrl.extendedFrame : 0, // default: standard frame
        acknowledge: (cemi.ctrl.acknowledge != null) ? cemi.ctrl.acknowledge : 1, // default: send acknowledge
        confirm: (cemi.ctrl.confirm != null) ? cemi.ctrl.confirm : 0 // idk
      } : {
        frameType: 1, // default: standard frame
        repeat: 1, // default: do NOT repeat
        broadcast: 1, // default: broadcast
        priority: 3, // default: low
        destAddrType: 1, // default: groupaddr
        hopCount: 6, // default: 6
        extendedFrame: 0, // default: standard frame
        acknowledge: 1, // default: send acknowledge
        confirm: 0 // default: 0
      },

      src_addr: (cemi.src_addr) ? cemi.src_addr : conContext.options.physAddr,
      dest_addr: (cemi.dest_addr) ? cemi.dest_addr : '0.0.0',

      apdu: (cemi.apdu != null) ? cemi.apdu : null
    }

    // Prepare the datagram and send it, sequence number will be auto-filled
    conContext.handle('outbound_TUNNELING_REQUEST',
      KnxNetProtocol.prepareDatagram(KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST, finalCemi, null, conContext), callback)
  }
}
