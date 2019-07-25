/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const util = require('util');
const dgram = require('dgram');
const KnxLog = require('./KnxLog.js');

function IpTunnelingConnection(instance, options) {

  var log = KnxLog.get();

  instance.BindSocket = function(cb) {
    var udpSocket = dgram.createSocket("udp4");
    udpSocket.bind(function() {
      KnxLog.get().debug('IpTunnelingConnection.BindSocket %s:%d',
        instance.localAddress, udpSocket.address().port);
      cb && cb(udpSocket);
    });
    return udpSocket;
  }

  instance.Connect = function() {
    var sm = this;
    this.localAddress = this.getLocalAddress();
    // create the socket
    this.socket = this.BindSocket(function(socket) {
      socket.on("error", function(errmsg) {
        KnxLog.get().debug('Socket error: %j', errmsg);
      });
      socket.on("message", function(msg, rinfo, callback) {
        KnxLog.get().debug('Inbound message: %s', msg.toString('hex'));
        sm.onUdpSocketMessage(msg, rinfo, callback);
      });
      // start connection sequence
      sm.transition('connecting');
    });
    return this;
  }

  return instance;
}


module.exports = IpTunnelingConnection;
