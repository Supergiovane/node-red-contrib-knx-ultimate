/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const util = require('util');
const dgram = require('dgram');
const KnxLog = require('./KnxLog.js');
/**
  Initializes a new KNX routing connection with provided values. Make
 sure the local system allows UDP messages to the multicast group.
**/
function IpRoutingConnection(instance, options) {

  var log = KnxLog.get();

  instance.BindSocket = function(cb) {
    var conn = this;
    var udpSocket = dgram.createSocket({type: "udp4", reuseAddr: true});
    udpSocket.on('listening', function() {
      log.debug(util.format(
        'IpRoutingConnection %s:%d, adding membership for %s',
        instance.localAddress, udpSocket.address().port, conn.remoteEndpoint.addr
      ));
      try {
        conn.socket.addMembership(conn.remoteEndpoint.addr, instance.localAddress);
      } catch (err) {
        log.warn('IPRouting connection: cannot add membership (%s)', err);
      }
    });
    // ROUTING multicast connections need to bind to the default port, 3671
    udpSocket.bind(3671, function() {
      cb && cb(udpSocket);
    });
    return udpSocket;
  }

  // <summary>
  ///     Start the connection
  /// </summary>
  instance.Connect = function() {
    var sm = this;
    this.localAddress = this.getLocalAddress();
    this.socket = this.BindSocket(function(socket) {
      socket.on("error", function(errmsg) {
        log.debug(util.format('Socket error: %j', errmsg));
      });
      socket.on("message", function(msg, rinfo, callback) {
        log.debug('Inbound multicast message from ' + rinfo.address + ': '+ msg.toString('hex'));
        sm.onUdpSocketMessage(msg, rinfo, callback);
      });
      // start connection sequence
      sm.transition('connecting');
    });
    return this;
  }

  return instance;
}

module.exports = IpRoutingConnection;
