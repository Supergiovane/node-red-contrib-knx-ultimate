/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2021 Supergiovane
*/

const RawModHandlers = require('./RawMod/Handlers')
const FSM = require('./FSM')

const util = require('util')
const DPTLib = require('./dptlib')
const KnxLog = require('./KnxLog')
const KnxConstants = require('./KnxConstants')
const KnxNetProtocol = require('./KnxProtocol')

const DEFAULT_READ_GROUPVAL_TIMEOUT = 3000

// bind incoming UDP packet handler
const onUdpSocketMessage = function (msg /*, rinfo, callback */) {
  // get the incoming packet's service type ...

  // if (msg.toString("hex").endsWith("8000")) {
  //   console.log("BANANA VERO MSG", msg.toString("hex"));
 // TELEGRAMMA CON FLAG REPEATED 0610042000160413070029009CD01132140405008000000000
  // msg = Buffer.from("0610042000160413070029009CD01132140405008000000000", "hex");
  //   console.log("BANANA FAKE MSG", msg.toString("hex"));
  //   // DISCONNECT_RESPONSE:  0x020a,
  //   var pera =true;
  // }

  try {
    let reader = KnxNetProtocol.createReader(msg)
    let dg

    reader.KNXNetHeader('tmp')

    if (reader.next()['tmp']) {
      dg = reader.next()['tmp']
    }

    /* Catch broken messages       */
    if (dg) {
      /*******************************/
      // if (pera === true) console.log ("BANANA OCCHIO PERA TRUE",msg.toString("hex"),dg)
      const descr = this.datagramDesc(dg)

      KnxLog.get().trace('(%s): Received %s message: %j', this.compositeState(), descr, dg)

      if (!isNaN(this.channel_id) &&
        ((dg.hasOwnProperty('connstate') && dg.connstate.channel_id !== this.channel_id) ||
          (dg.hasOwnProperty('tunnstate') && dg.tunnstate.channel_id !== this.channel_id))) {
        KnxLog.get().trace('(%s): *** Ignoring %s datagram for other channel (own: %d)', this.compositeState(), descr, this.channel_id)
      } else {
        // ... to drive the state machine (eg "inbound_TUNNELING_REQUEST_L_Data.ind")
        let signal = util.format('inbound_%s', descr)

        /* ***** Added by the fork ******/
        RawModHandlers.rawMsgHandler(msg, dg, this)
        /*******************************/

        // 23/03/2021 Supergiovane: Added the CEMI telegram for ETS Diagnostic
        // #####################################################################
        if (dg.hasOwnProperty("cemi") && typeof dg.cemi !== "undefined") {
          if (dg.hasOwnProperty("header_length") && typeof dg.header_length === "number") {
            try {
              var iStart = dg.header_length;
              if (dg.hasOwnProperty("tunnstate") && dg.tunnstate.hasOwnProperty("header_length") && typeof dg.tunnstate.header_length === "number") iStart += dg.tunnstate.header_length; // Add the tunnel lenght
              dg.cemi.cemiETS = msg.toString("hex").substring(iStart * 2);
            } catch (error) { dg.cemi.cemiETS = ""; }
          } else {
            dg.cemi.cemiETS = "";
          }
        }
        // #####################################################################

        this.handle(signal, dg)
      }
    } else {
      /*
       * Catch the broken message and pass it to the handler
       * Big problem:
       *  The parser which decides if a message is broken or not does only recognize KNX multicast messages
       */
      RawModHandlers.brokenMsgHandler(msg, this)
    }
    /*******************************/
  } catch (err) {
    console.trace(err)
    KnxLog.get().debug('(%s): Incomplete/unparseable UDP packet: %s: %s',
      this.compositeState(), err, msg.toString()
    );
  }
}

const AddConnState = function (datagram) {
  datagram.connstate = {
    channel_id: this.channel_id,
    state: 0
  }
}

const AddTunnState = function (datagram) {
  // add the remote IP router's endpoint
  datagram.tunnstate = {
    channel_id: this.channel_id,
    tunnel_endpoint: this.remoteEndpoint.addr + ':' + this.remoteEndpoint.port
  }
}

const AddCRI = function (datagram) {
  // add the CRI
  datagram.cri = {
    connection_type: KnxConstants.CONNECTION_TYPE.TUNNEL_CONNECTION,
    knx_layer: KnxConstants.KNX_LAYER.LINK_LAYER,
    unused: 0
  }
}

const AddCEMI = function (datagram, msgcode) {
  let sendAck = ((msgcode || 0x11) === 0x11) && !this.options.suppress_ack_ldatareq // only for L_Data.req

  datagram.cemi = {
    msgcode: msgcode || 0x11, // default: L_Data.req for tunneling
    ctrl: {
      frameType: 1, // 0=extended 1=standard
      reserved: 0, // always 0
      repeat: 1, // the OPPOSITE: 1=do NOT repeat
      broadcast: 1, // 0-system broadcast 1-broadcast
      priority: 3, // 0-system 1-normal 2-urgent 3-low
      acknowledge: sendAck ? 1 : 0,
      confirm: 0, // FIXME: only for L_Data.con 0-ok 1-error
      destAddrType: 1, // FIXME: 0-physical 1-groupaddr
      hopCount: 6,
      extendedFrame: 0
    },
    src_addr: this.options.physAddr || '15.15.15',
    dest_addr: '0/0/0',
    apdu: {
      apci: 'GroupValue_Write',
      tpci: 0,
      data: 0
    }
  }
}

/*
 * submit an outbound request to the state machine
 *
 * type: service type
 * datagram_template:
 *    if a datagram is passed, use this as
 *    if a function is passed, use this to DECORATE
 *    if NULL, then just make a new empty datagram. Look at AddXXX methods
 */
const Request = function (type, datagramTemplate, callback) {
  const self = this
  // populate skeleton datagram
  const datagram = this.prepareDatagram(type)
  // decorate the datagram, if a function is passed
  if (typeof datagramTemplate === 'function') {
    datagramTemplate(datagram)
  }
  // make sure that we override the datagram service type!
  datagram.service_type = type
  const st = KnxConstants.keyText(KnxConstants.SERVICE_TYPE, type)
  // hand off the outbound request to the state machine
  self.handle('outbound_' + st, datagram, callback)
}

// prepare a datagram for the given service type
const prepareDatagram = function (svcType) {
  let datagram = {
    'header_length': 6,
    'protocol_version': 16, // 0x10 == version 1.0
    'service_type': svcType,
    'total_length': null // filled in automatically
  }

  this.AddHPAI(datagram)

  switch (svcType) {
    case KnxConstants.SERVICE_TYPE.CONNECT_REQUEST:
      this.AddTunn(datagram)
      this.AddCRI(datagram)
      this.AddConnState(datagram)
      break
    case KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST:
    case KnxConstants.SERVICE_TYPE.DISCONNECT_REQUEST:
      this.AddConnState(datagram)
      break
    case KnxConstants.SERVICE_TYPE.ROUTING_INDICATION:
      this.AddCEMI(datagram, KnxConstants.MESSAGECODES['L_Data.ind'])
      break
    case KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST:
      this.AddTunn(datagram)
      this.AddTunnState(datagram)
      this.AddCEMI(datagram)
      break
    case KnxConstants.SERVICE_TYPE.TUNNELING_ACK:
      this.AddTunnState(datagram)
      break
    default:
      this.log.debug('Do not know how to deal with svc type %d', svcType)
  }

  return datagram
}

// send the datagram over the wire
const send = function (datagram, callback) {
  const conn = this
  let buf
  let ret
  let descr

  if (datagram.constructor !== Buffer) {
    this.writer = KnxNetProtocol.createWriter()

    // Forge the datagram
    ret = this.writer.KNXNetHeader(datagram)

    // Check if ret.buffer is null ==> if this.writer.KNXNetHeader() failed
    if (ret.buffer === null) {
      // Check if error was set - if not, pass a standard message to callback
      ret.error !== null ? callback(ret.error) : callback(Error('Unknown error!'))

      // Cancel the sending process
      return null; // 25/03/2021 Supergiovane: was return;
    }

    // Get the buffer
    buf = ret.buffer

    descr = this.datagramDesc(datagram)
    KnxLog.get().trace('(%s): Sending %s ==> %j', this.compositeState(), descr, datagram)
  } else {
    buf = datagram
  }

  this.socket.send(
    buf, 0, buf.length,
    conn.remoteEndpoint.port, conn.remoteEndpoint.addr.toString(),
    function (err) {
      KnxLog.get().trace('(%s): UDP sent %s: %s %s', conn.compositeState(),
        (err ? err.toString() : 'OK'), descr, buf.toString()
      )
      if (typeof callback === 'function') callback(err)
    }
  )
  return buf; // 25/03/2021 Supergiovane
}

const write = function (grpaddr, value, dptid, callback) {
  if (this.useTunneling && !this.isTunnelConnected) {
    KnxLog.get().warn('Tunnel is down. Datagram not sent.');
    return; // 02/10/2020 Supergiovane: if in tunnel mode and is not connected, exit
  }

  if (grpaddr == null || value == null) {
    this.log.warn('You must supply both grpaddr and value!')
    return
  }
  // outbound request onto the state machine
  const serviceType = this.useTunneling
    ? KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST
    : KnxConstants.SERVICE_TYPE.ROUTING_INDICATION
  this.Request(serviceType, function (datagram) {
    DPTLib.populateAPDU(value, datagram.cemi.apdu, dptid)
    datagram.cemi.dest_addr = grpaddr
  }, callback)
}

const respond = function (grpaddr, value, dptid) {
  if (this.useTunneling && !this.isTunnelConnected) {
    KnxLog.get().warn('Tunnel is down. Datagram not sent.');
    return; // 02/10/2020 Supergiovane: if in tunnel mode and is not connected, exit
  }
  if (grpaddr == null || value == null) {
    this.log.warn('You must supply both grpaddr and value!')
    return
  }
  const serviceType = this.useTunneling
    ? KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST
    : KnxConstants.SERVICE_TYPE.ROUTING_INDICATION
  this.Request(serviceType, function (datagram) {
    DPTLib.populateAPDU(value, datagram.cemi.apdu, dptid)
    // this is a READ request
    datagram.cemi.apdu.apci = 'GroupValue_Response'
    datagram.cemi.dest_addr = grpaddr
    return datagram
  })
}

const writeRaw = function (grpaddr, value, bitlength, callback) {
  if (this.useTunneling && !this.isTunnelConnected) {
    KnxLog.get().warn('Tunnel is down. Datagram not sent.');
    return; // 02/10/2020 Supergiovane: if in tunnel mode and is not connected, exit
  }
  if (grpaddr == null || value == null) {
    this.log.warn('You must supply both grpaddr and value!')
    return
  }
  if (!Buffer.isBuffer(value)) {
    this.log.warn('Value must be a buffer!')
    return
  }
  // outbound request onto the state machine
  const serviceType = this.useTunneling
    ? KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST
    : KnxConstants.SERVICE_TYPE.ROUTING_INDICATION
  this.Request(serviceType, function (datagram) {
    datagram.cemi.apdu.data = value
    datagram.cemi.apdu.bitlength = bitlength || (value.byteLength * 8)
    datagram.cemi.dest_addr = grpaddr
  }, callback)
}

// send a READ request to the bus
// you can pass a callback function which gets bound to the RESPONSE datagram event
const read = function (grpaddr, callback) {
  if (this.useTunneling && this.isTunnelConnected === false) {
    // console.log("BANANA exit FSM.prototype.write Tunnel down");
    return; // 02/10/2020 Supergiovane: if in tunnel mode and is not connected, exit
  }

  if (typeof callback === 'function') {
    const conn = this

    // Determine the timeout for receiving the response
    let timeout = this.readGroupValTimeout ? this.readGroupValTimeout : DEFAULT_READ_GROUPVAL_TIMEOUT

    // when the response arrives:
    const responseEvent = 'GroupValue_Response_' + grpaddr

    KnxLog.get().trace('Binding connection to ' + responseEvent)

    const binding = function (src, data) {
      // unbind the event handler
      conn.off(responseEvent, binding)

      // fire the callback
      callback(src, data)
    }

    // prepare for the response
    this.on(responseEvent, binding)

    // clean up after 3 seconds just in case no one answers the read request
    setTimeout(function () {
      conn.off(responseEvent, binding)
    }, timeout)
  }

  const serviceType = this.useTunneling
    ? KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST
    : KnxConstants.SERVICE_TYPE.ROUTING_INDICATION

  this.Request(serviceType, function (datagram) {
    // this is a READ request
    datagram.cemi.apdu.apci = 'GroupValue_Read'
    datagram.cemi.dest_addr = grpaddr
    return datagram
  })
}

const Disconnect = function (/* cb */) {
  this.transition('disconnecting');
  //console.log("BANANA Logger distrutto");
  try {
    KnxLog.destroy(); // 16/08/2020 Force reinstantiation of the logger to refresh the settings.
  } catch (error) { }
  // machina.js removeAllListeners equivalent:
  // this.off();
}

// return a descriptor for this datagram (TUNNELING_REQUEST_L_Data.ind)
const datagramDesc = function (dg) {
  let blurb = KnxConstants.keyText(KnxConstants.SERVICE_TYPE, dg.service_type)
  if (dg.service_type === KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST ||
    dg.service_type === KnxConstants.SERVICE_TYPE.ROUTING_INDICATION) {
    blurb += '_' + KnxConstants.keyText(KnxConstants.MESSAGECODES, dg.cemi.msgcode)
  }
  return blurb
}

// add the control udp local endpoint
const AddHPAI = function (datagram) {
  datagram.hpai = {
    protocol_type: 1, // UDP
    // 05/12/2020 Removed and ripristinated '0.0.0.0:0' due to connection lost with KNXD 
    //tunnel_endpoint: this.localAddress + ':' + this.localPort // 29/12/2020 Supergiovane added on tips https://bitbucket.org/ekarak/knx.js/issues/76/knx-virtual-is-crashed-right-after 
    tunnel_endpoint: "0.0.0.0:0"
  }
}

// add the tunneling udp local endpoint
const AddTunn = function (datagram) {
  datagram.tunn = {
    protocol_type: 1, // UDP
    // 05/12/2020 Removed and ripristinated '0.0.0.0:0' due to connection lost with KNXD 
    //tunnel_endpoint: this.localAddress + ':' + this.localPort // 29/12/2020 Supergiovane added on tips https://bitbucket.org/ekarak/knx.js/issues/76/knx-virtual-is-crashed-right-after 
    tunnel_endpoint: "0.0.0.0:0"
  }
}

const Connection = function (options) {
  const conn = new FSM(options)

  // Add functions from this file
  conn.onUdpSocketMessage = onUdpSocketMessage
  conn.AddConnState = AddConnState
  conn.AddTunnState = AddTunnState
  conn.AddCRI = AddCRI
  conn.AddCEMI = AddCEMI
  conn.Request = Request
  conn.prepareDatagram = prepareDatagram
  conn.send = send
  conn.write = write
  conn.respond = respond
  conn.writeRaw = writeRaw
  conn.read = read
  conn.Disconnect = Disconnect
  conn.datagramDesc = datagramDesc
  conn.AddHPAI = AddHPAI
  conn.AddTunn = AddTunn

  // register with the FSM any event handlers passed into the options object
  if (typeof options.handlers === 'object') {
    Object.keys(options.handlers).forEach(function (key) {
      if (typeof options.handlers[key] === 'function') {
        conn.on(key, options.handlers[key])
      }
    })
  }

  // boot up the KNX connection unless told otherwise
  if (!options.manualConnect) conn.Connect()
  return (conn)
}

module.exports = Connection
