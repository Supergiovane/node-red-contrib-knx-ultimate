/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const os = require('os');
const dgram = require('dgram');
const util = require('util');
const ipaddr = require('ipaddr.js');
const machina = require('machina');
const KnxConstants = require('./KnxConstants.js');
const IpRoutingConnection = require('./IpRoutingConnection.js');
const IpTunnelingConnection = require('./IpTunnelingConnection.js');
const KnxLog = require('./KnxLog.js');

module.exports = machina.Fsm.extend({

  initialize: function (options) {
    this.options = options || {};
    // initialise the log driver - to set the loglevel
    this.log = KnxLog.get(options);
    // set the local IP endpoint
    this.localAddress = null;
    this.ThreeLevelGroupAddressing = true;
    // reconnection cycle counter
    this.reconnection_cycles = 0;
    // a cache of recently sent requests
    this.sentTunnRequests = {};
    this.useTunneling = options.forceTunneling || false;
    this.remoteEndpoint = {
      addrstring: options.ipAddr || '224.0.23.12',
      addr: ipaddr.parse(options.ipAddr || '224.0.23.12'),
      port: options.ipPort || 3671
    };
    var range = this.remoteEndpoint.addr.range();
    this.localEchoInTunneling = typeof options.localEchoInTunneling !== "undefined" ? options.localEchoInTunneling : false; // 14=73/2020 Supergiovane (local echo of emitEvent if in tunneling mode)
    this.log.debug('initializing %s connection to %s', range, this.remoteEndpoint.addrstring);
    switch (range) {
      case 'multicast':
        if (this.localEchoInTunneling) { this.localEchoInTunneling = false; this.log.debug('localEchoInTunneling: true but DISABLED because i am on multicast'); }; // 14/03/2020 Supergiovane: if multicast, disable the localEchoInTunneling, because there is already an echo
        IpRoutingConnection(this, options);
        break;
      case 'unicast':
      case 'private':
      case 'loopback':
        this.useTunneling = true;
        IpTunnelingConnection(this, options);
        break;
      default:
        throw util.format("IP address % (%s) cannot be used for KNX", options.ipAddr, range);
    }
    this.isTunnelConnected = false; // 02/10/2020 Supergiovane: signal if connected or not (in tunnel mode only)
  },

  namespace: "knxnet",

  initialState: "uninitialized",

  states: {

    uninitialized: {
      "*": function () {
        this.transition("connecting");
      }
    },

    jumptoconnecting: {
      _onEnter: function () {
        this.transition("connecting");
      }
    },

    connecting: {
      _onEnter: function () {
        // tell listeners that we disconnected
        // putting this here will result in a correct state for our listeners
        this.emit('disconnected');
        var sm = this;
        this.log.debug(util.format('useTunneling=%j', this.useTunneling));
        if (this.useTunneling) {
          sm.connection_attempts = 0;
          if (!this.localAddress) throw "Not bound to an IPv4 non-loopback interface";
          this.log.debug(util.format('Connecting via %s...', sm.localAddress));
          // we retry 3 times, then restart the whole cycle using a slower and slower rate (max delay is 5 minutes)
          this.connecttimer = setInterval(function () {
            sm.connection_attempts += 1;
            if (sm.connection_attempts >= 3) {
              clearInterval(sm.connecttimer);
              // quite a few KNXnet/IP devices drop any tunneling packets received via multicast
              if (sm.remoteEndpoint.addr.range() == 'multicast') {
                this.log.warn('connection timed out, falling back to pure routing mode...');
                sm.usingMulticastTunneling = true;
                sm.transition('connected');
              } else {
                // we restart the connection cycle with a growing delay (max 5 minutes)
                sm.reconnection_cycles += 1;
                var delay = Math.min(sm.reconnection_cycles * 3, 300);
                this.log.debug('reattempting connection in ' + delay + ' seconds');
                setTimeout(function () {
                  // restart connecting cycle (cannot jump straight to 'connecting' so we use an intermediate state)
                  sm.transition("jumptoconnecting");
                }, delay * 1000);
              }
            } else {
              this.log.warn('connection timed out, retrying... ' + sm.connection_attempts);
              this.send(sm.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECT_REQUEST));
            }
          }.bind(this), 3000);
          

          delete this.channel_id;
          delete this.conntime;
          delete this.lastSentTime;
          // send connect request directly
          this.send(sm.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECT_REQUEST));

        } else {
          // no connection sequence needed in pure multicast routing
          this.transition("connected");
        }
      },
      _onExit: function () {
        clearInterval(this.connecttimer);
      },
      inbound_CONNECT_RESPONSE: function (datagram) {
        var sm = this;
        this.log.debug(util.format('got connect response'));
        if (datagram.hasOwnProperty('connstate') && datagram.connstate.status === KnxConstants.RESPONSECODE.E_NO_MORE_CONNECTIONS) {
          // close the socket
          sm.close();
          this.log.debug("The KNXnet/IP server rejected the data connection (Maximum connections reached). Waiting 5 seconds before retrying...");
          setTimeout(function () {
            sm.Connect()
          }, 5000)
        } else {
          // store channel ID into the Connection object
          this.channel_id = datagram.connstate.channel_id;
          // send connectionstate request directly
          this.send(sm.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST));
        }
      },
      inbound_CONNECTIONSTATE_RESPONSE: function (datagram) {
        if (this.useTunneling) {
          var str = KnxConstants.keyText('RESPONSECODE', datagram.connstate.status);
          this.log.debug(util.format(
            'Got connection state response, connstate: %s, channel ID: %d',
            str, datagram.connstate.channel_id));
          this.transition('connected');
        }
      },
      "*": function (data) {
        this.log.debug(util.format('*** deferring Until Transition %j', data));
        this.deferUntilTransition('idle');
      }
    },

    connected: {
      _onEnter: function () {
        // Reset connection reattempts cycle counter for next disconnect
        this.reconnection_cycles = 0;
        // Reset outgoing sequence counter..
        this.seqnum = -1;
        /* important note: the sequence counter is SEPARATE for incoming and
          outgoing datagrams. We only keep track of the OUTGOING L_Data.req
          and we simply acknowledge the incoming datagrams with their own seqnum */
        this.lastSentTime = this.conntime = Date.now();
        this.log.debug(util.format('--- Connected in %s mode ---', this.useTunneling ? 'TUNNELING' : 'ROUTING'));
        this.transition('idle');
        this.emit('connected');
        this.startTimerConnectioRequest(true); // 24/05/2020 Supergiovane
        this.isTunnelConnected = true; // 02/10/2020 Supergiovane: signal that the tunnel is up
      }
    },

    disconnecting: {
      // TODO: skip on pure routing
      _onEnter: function () {
        var sm = this;

        sm.startTimerConnectioRequest(false); // 24/05/2020 Supergiovane
        this.isTunnelConnected = false; // 02/10/2020 Supergiovane: signal that the tunnel is down

        if (this.useTunneling) {
          // in case of a tunneled connection a disconnect request will be sent
          var aliveFor = this.conntime ? Date.now() - this.conntime : 0;
          KnxLog.get().debug('(%s):\tconnection alive for %d seconds', this.compositeState(), aliveFor / 1000);
          this.disconnecttimer = setTimeout(function () {
            KnxLog.get().debug('(%s):\tconnection timed out', sm.compositeState());

            // close the socket
            sm.close();
          }.bind(this), 3000);

          this.send(this.prepareDatagram(KnxConstants.SERVICE_TYPE.DISCONNECT_REQUEST), function (err) {
            // TODO: handle send err
            
            KnxLog.get().debug('(%s):\tsent DISCONNECT_REQUEST', sm.compositeState());
          });
        } else {
          // in case of multicast the socket will be closed directly
          sm.close();
        }
      },
      _onExit: function () {
        if (this.disconnecttimer !== null) clearTimeout(this.disconnecttimer)
      },
      inbound_DISCONNECT_RESPONSE: function (datagram) {
        this.isTunnelConnected = false; // 02/10/2020 Supergiovane: signal that the tunnel is down
        if (this.useTunneling) {
          KnxLog.get().debug('(%s):\tgot disconnect response', this.compositeState());
          
          // close the socket
          sm.close();
        }
      },
    },

    idle: {
      _onEnter: function () {

        // if (this.useTunneling) {
        //   // 30/04/2020 Supergiovane, adhere to the KNX standard. Request State must be always sent, every max 120 seconds
        //   if (this.idletimer == null) {
        //     this.idletimer = setTimeout(function () {
        //       // time out on inactivity...
        //       this.transition("requestingConnState");
        //       clearTimeout(this.idletimer);
        //       this.idletimer = null;
        //     }.bind(this), 60000); // 23/05/2020 Supergiovane was 10000
        //   }

        // }
        // debuglog the current FSM state plus a custom message
        KnxLog.get().debug('(%s):\t%s', this.compositeState(), ' zzzz...');
        // process any deferred items from the FSM internal queue
        this.processQueue();
      },
      _onExit: function () {
        // 30/04/2020 Supergiovane, removed cleartimeout, adhering to the KNX standard. Request State must be always sent, every max 120 seconds
        //clearTimeout(this.idletimer);
      },
      // while idle we can either...

      // 1) queue an OUTGOING routing indication...
      outbound_ROUTING_INDICATION: function (datagram) {
        var sm = this;
        var elapsed = Date.now() - this.lastSentTime;
        // if no miminum delay set OR the last sent datagram was long ago...
        if (!this.options.minimumDelay || elapsed >= this.options.minimumDelay) {
          // ... send now
          this.transition('sendDatagram', datagram);
        } else {
          // .. or else, let the FSM handle it later
          setTimeout(function () {
            sm.handle('outbound_ROUTING_INDICATION', datagram);
          }, this.minimumDelay - elapsed);
        }
      },

      // 2) queue an OUTGOING tunelling request...
      outbound_TUNNELING_REQUEST: function (datagram) {
        var sm = this;
        if (this.useTunneling) {
          var elapsed = Date.now() - this.lastSentTime;
          // if no miminum delay set OR the last sent datagram was long ago...
          if (!this.options.minimumDelay || elapsed >= this.options.minimumDelay) {
            // ... send now
            this.transition('sendDatagram', datagram);
          } else {
            // .. or else, let the FSM handle it later
            setTimeout(function () {
              sm.handle('outbound_TUNNELING_REQUEST', datagram);
            }, this.minimumDelay - elapsed);
          }
        } else {
          KnxLog.get().debug("(%s):\tdropping outbound TUNNELING_REQUEST, we're in routing mode", this.compositeState());
        }
      },

      // 3) receive an INBOUND tunneling request INDICATION (L_Data.ind)
      'inbound_TUNNELING_REQUEST_L_Data.ind': function (datagram) {
        if (this.useTunneling) {
          this.transition('recvTunnReqIndication', datagram);
        }
      },

      /* 4) receive an INBOUND tunneling request CONFIRMATION (L_Data.con) to one of our sent tunnreq's
       * We don't need to explicitly wait for a L_Data.con confirmation that the datagram has in fact
       *  reached its intended destination. This usually requires setting the 'Sending' flag
       *  in ETS, usually on the 'primary' device that contains the actuator endpoint
       */
      'inbound_TUNNELING_REQUEST_L_Data.con': function (datagram) {
        if (this.useTunneling) {
          var msg;
          var confirmed = this.sentTunnRequests[datagram.cemi.dest_addr];
          if (confirmed) {
            msg = 'delivery confirmation (L_Data.con) received';
            delete this.sentTunnRequests[datagram.cemi.dest_addr];
            this.emit('confirmed', confirmed);
          } else {
            msg = 'unknown dest addr';
          }
          KnxLog.get().trace('(%s): %s %s', this.compositeState(), datagram.cemi.dest_addr, msg);
          this.acknowledge(datagram);
        }
      },

      // 5) receive an INBOUND ROUTING_INDICATION (L_Data.ind)
      'inbound_ROUTING_INDICATION_L_Data.ind': function (datagram) {
        this.emitEvent(datagram);
      },

      inbound_DISCONNECT_REQUEST: function (datagram) {
        if (this.useTunneling) {
          this.transition('connecting');
        }
      },

    },

    // if idle for too long, request connection state from the KNX IP router
    requestingConnState: {
      _onEnter: function () {
        var sm = this;
        sm.startTimerConnectioRequest(false); // 02/10/2020 Supergiovane
        KnxLog.get().trace('(%s): Requesting Connection State', this.compositeState());
        this.send(sm.prepareDatagram(KnxConstants.SERVICE_TYPE.CONNECTIONSTATE_REQUEST));
        sm.connstatetimer = setTimeout(function () {
          var msg = 'timed out waiting for CONNECTIONSTATE_RESPONSE';
          KnxLog.get().trace('(%s): %s', sm.compositeState(), msg);
          sm.transition('connecting');
          sm.emit('error', msg);
          sm.startTimerConnectioRequest(true); // 02/10/2020 Supergiovane: resets timers and restart counter
          this.isTunnelConnected = false; // 02/10/2020 Supergiovane: signal that the tunnel is down
        }.bind(sm), 1000); // 23/05/2020 Supergiovane, was 1000, but KNX Standard is 10000
      },
      _onExit: function () {
        var sm = this;
        //console.log("BANANA dentro _onExit fi requestingConnState");
        sm.startTimerConnectioRequest(true); // 01/10/2020 Supergiovane: resets timers and restart counter
        //if (sm.connstatetimer !== null) clearTimeout(sm.connstatetimer);
      },
      inbound_CONNECTIONSTATE_RESPONSE: function (datagram) {
        var state = KnxConstants.keyText('RESPONSECODE', datagram.connstate.status);
        // console.log("BANANA dentro inbound_CONNECTIONSTATE_RESPONSE fi requestingConnState");
        switch (datagram.connstate.status) {
          case 0:
            this.transition('idle');
            this.isTunnelConnected = true; // 02/10/2020 Supergiovane: signal that the tunnel is up
            break;
          default:
            this.log.debug(util.format(
              '*** error: %s *** (connstate.code: %d)', state, datagram.connstate.status));
            this.transition('connecting');
            this.emit('error', state);
            this.isTunnelConnected = false; // 02/10/2020 Supergiovane: signal that the tunnel is down
        }
      },
      "*": function (data) {
        // Qui ci entra se non fa nè l'_onexit, nè l'inbound_CONNECTIONSTATE_RESPONSE
        this.log.debug(util.format('*** deferring %s until transition from requestingConnState => idle', data.inputType));
        this.deferUntilTransition('idle');
        // console.log("BANANA dentro * fi requestingConnState");
      },
    },

    /*
    * 1) OUTBOUND DATAGRAM (ROUTING_INDICATION or TUNNELING_REQUEST)
    */
    sendDatagram: {
      _onEnter: function (datagram) {
        var sm = this;
        // send the telegram on the wire
        this.seqnum += 1;
        if (this.useTunneling) datagram.tunnstate.seqnum = this.seqnum & 0xFF;
        this.send(datagram, function (err) {
          if (err) {
            //console.trace('error sending datagram, going idle');
            sm.seqnum -= 1;
            sm.transition('idle');
          } else {
            // successfully sent the datagram
            if (sm.useTunneling) sm.sentTunnRequests[datagram.cemi.dest_addr] = datagram;
            sm.lastSentTime = Date.now();
            sm.log.debug('(%s):\t>>>>>>> successfully sent seqnum: %d', sm.compositeState(), sm.seqnum);
            if (sm.useTunneling) {
              // and then wait for the acknowledgement
              sm.transition('sendTunnReq_waitACK', datagram);
            } else {
              sm.transition('idle');
            }
          }
          // 14/03/2020 Supergiovane: In multicast mode, other node-red nodes receives the echo of the telegram sent (the groupaddress_write event). If in tunneling, force the emit of the echo datagram (so other node-red nodes can receive the echo), because in tunneling, there is no echo.
          // ########################
          //if (sm.useTunneling) sm.sentTunnRequests[datagram.cemi.dest_addr] = datagram;
          if (sm.useTunneling) {
            sm.sentTunnRequests[datagram.cemi.dest_addr] = datagram;
            if (typeof sm.localEchoInTunneling !== "undefined" && sm.localEchoInTunneling) {
              try {
                sm.emitEvent(datagram);
                sm.log.debug('(%s):\t>>>>>>> localEchoInTunneling: echoing by emitting %d', sm.compositeState(), sm.seqnum);
              } catch (error) {
                sm.log.debug('(%s):\t>>>>>>> localEchoInTunneling: error echoing by emitting %d ' + error, sm.compositeState(), sm.seqnum);
              }
            }
          }
          // ########################
        });
      },
      "*": function (data) {
        this.log.debug(util.format('*** deferring %s until transition sendDatagram => idle', data.inputType));
        this.deferUntilTransition('idle');
      }
    },
    /*
    * Wait for tunneling acknowledgement by the IP router; this means the sent UDP packet
    * reached the IP router and NOT that the datagram reached its final destination
    */
    sendTunnReq_waitACK: {
      _onEnter: function (datagram) {
        var sm = this;
        //this.log.debug('setting up tunnreq timeout for %j', datagram);
        this.tunnelingAckTimer = setTimeout(function () {
          this.log.debug('timed out waiting for TUNNELING_ACK');
          // TODO: resend datagram, up to 3 times
          sm.transition('idle');
          sm.emit('tunnelreqfailed', datagram);
        }.bind(this), 2000);
      },
      _onExit: function () {
        clearTimeout(this.tunnelingAckTimer);
      },
      inbound_TUNNELING_ACK: function (datagram) {
        this.log.debug(util.format('===== datagram %d acknowledged by IP router', datagram.tunnstate.seqnum));
        this.transition('idle');
      },
      "*": function (data) {
        this.log.debug(util.format('*** deferring %s until transition sendTunnReq_waitACK => idle', data.inputType));
        this.deferUntilTransition('idle');
      },
    },

    /*
    * 2) INBOUND tunneling request (L_Data.ind) - only in tunnelling mode
    */
    recvTunnReqIndication: {
      _onEnter: function (datagram) {
        var sm = this;
        sm.seqnumRecv = datagram.tunnstate.seqnum;
        sm.acknowledge(datagram);
        sm.transition('idle');
        sm.emitEvent(datagram);
      },
      "*": function (data) {
        this.log.debug(util.format('*** deferring Until Transition %j', data));
        this.deferUntilTransition('idle');
      },
    },
  },

  acknowledge: function (datagram) {
    var sm = this;
    var ack = this.prepareDatagram(
      KnxConstants.SERVICE_TYPE.TUNNELING_ACK,
      datagram);
    /* acknowledge by copying the inbound datagram's sequence counter */
    ack.tunnstate.seqnum = datagram.tunnstate.seqnum;
    try {
      this.send(ack, function (err) {
        // TODO: handle send err
        //console.log("BANANA acknowledge " + err);
      });
    } catch (error) {
    }

  },

  // 26/03/2020 Supergiovane, added the cemi datagram.cemi.cemiETS for ETS export in knx-ultimate node.
  emitEvent: function (datagram) {
    // emit events to our beloved subscribers in a multitude of targets
    // ORDER IS IMPORTANT!
    var evtName = datagram.cemi.apdu.apci;
    // 1.
    // 'event_<dest_addr>', ''GroupValue_Write', src, data
    this.emit(util.format("event_%s", datagram.cemi.dest_addr),
      evtName, datagram.cemi.src_addr, datagram.cemi.apdu.data, datagram.cemi.cemiETS);
    // 2.
    // 'GroupValue_Write_1/2/3', src, data
    this.emit(util.format("%s_%s", evtName, datagram.cemi.dest_addr),
      datagram.cemi.src_addr, datagram.cemi.apdu.data, datagram.cemi.cemiETS);
    // 3.
    // 'GroupValue_Write', src, dest, data
    this.emit(evtName,
      datagram.cemi.src_addr, datagram.cemi.dest_addr, datagram.cemi.apdu.data, datagram.cemi.cemiETS);
    // 4.
    // 'event', 'GroupValue_Write', src, dest, data
    this.emit("event",
      evtName, datagram.cemi.src_addr, datagram.cemi.dest_addr, datagram.cemi.apdu.data, datagram.cemi.cemiETS);

  },
  // get the local address of the IPv4 interface we're going to use
  getIPv4Interfaces: function () {
    var candidateInterfaces = {};
    var interfaces = os.networkInterfaces();
    for (var iface in interfaces) {
      for (var key in interfaces[iface]) {
        var intf = interfaces[iface][key];
        if (intf.family == 'IPv4' && !intf.internal) {
          this.log.trace(util.format(
            "candidate interface: %s (%j)", iface, intf
          ));
          candidateInterfaces[iface] = intf;
        }
      }
    }
    return candidateInterfaces;
  },
  getLocalAddress: function () {
    var candidateInterfaces = this.getIPv4Interfaces();
    // if user has declared a desired interface then use it
    if (this.options && this.options.interface) {
      if (!candidateInterfaces.hasOwnProperty(this.options.interface))
        throw "Interface " + this.options.interface + " not found or has no useful IPv4 address!"
      else
        return candidateInterfaces[this.options.interface].address;
    }
    // just return the first available IPv4 non-loopback interface
    if (Object.keys(candidateInterfaces).length > 0) {
      return candidateInterfaces[Object.keys(candidateInterfaces)[0]].address;
    }
    // no local IpV4 interfaces?
    throw "No valid IPv4 interfaces detected";
  },

  close: function () {
    var sm = this;
    this.startTimerConnectioRequest(false); // 01/10/2020 Supergiovane
    this.isTunnelConnected = false; // 02/10/2020 Supergiovane: signal that the tunnel is down
    
    try {
      // close the socket
      sm.socket.close();
      sm.socket = null; // 24/05/2020 Supergiovane added this line.
    } catch (error) { }

    sm.transition('uninitialized');
    sm.emit('disconnected');
  },



  // 24/05/2020 Supergiovane: query connection status every max 120 secs, as per KNX specs.
  startTimerConnectioRequest: function (_bEnable) {
    var sm = this;
    if (_bEnable) {
      if (sm.useTunneling) {
        //console.log("BANANA START TIMER");
        if (sm.connstatetimer !== null) clearTimeout(sm.connstatetimer);
        if (sm.timerConnectioRequest !== null) clearTimeout(sm.timerConnectioRequest);
        sm.timerConnectioRequest = setInterval(function () {
          //console.log("BANANA sm.transition(requestingConnState);");
          sm.transition("requestingConnState");
        },5000); // era 30000 01/10/2020 
      }

    } else {
      // Stop timer
      //console.log("BANANA STOP TIMER")
      if (sm.timerConnectioRequest !== null) clearTimeout(sm.timerConnectioRequest);
      if (sm.connstatetimer !== null) clearInterval(sm.connstatetimer);
    }
  }

});
