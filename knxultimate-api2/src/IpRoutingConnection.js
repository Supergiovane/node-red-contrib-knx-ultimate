/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2021 Supergiovane
*/

const util = require('util')
const dgram = require('dgram')
const KnxLog = require('./KnxLog.js')
/**
  Initializes a new KNX routing connection with provided values. Make
 sure the local system allows UDP messages to the multicast group.
**/
function IpRoutingConnection (instance) {
  let log = KnxLog.get()

  instance.BindSocket = function (cb) {
    let conn = this
    let udpSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true })

    udpSocket.on('listening', function () {
      log.debug(util.format(
        'IpRoutingConnection %s:%d, adding membership for %s',
        instance.localAddress, udpSocket.address().port, conn.remoteEndpoint.addr
      ))

      try {
        conn.socket.addMembership(conn.remoteEndpoint.addr, instance.localAddress)
      } catch (err) {
        log.warn('IPRouting connection: cannot add membership (%s)', err)
      }
    })

    // ROUTING multicast connections need to bind to the default port, 3671
    udpSocket.bind(3671, function () {
      cb && cb(udpSocket);
      try {
        udpSocket.setMulticastTTL(16); // 13/04/2021 Set TTL        
      } catch (error) {        
      }
      // console.log ("BANANA TTL",udpSocket)
    })

    return udpSocket
  }

  // <summary>
  ///     Start the connection
  /// </summary>
  instance.Connect = function () {
    let sm = this

    this.localAddress = this.getLocalAddress()

    if (!this.localAddress) {
      return Error('Unable to get local address!')
    } else if (this.localAddress.constructor === Error) {
      return this.localAddress
    }

    this.socket = this.BindSocket(function (socket) {
      socket.on('error', function (errmsg) {
        log.debug(util.format('Socket error: %j', errmsg))
      })

      socket.on('message', function (msg, rinfo, callback) {
        log.debug('Inbound multicast message = require(' + rinfo.address + ': ' + msg.toString('hex'))
        sm.onUdpSocketMessage(msg, rinfo, callback)
      })

      // start connection sequence
      sm.transition('connecting')
    })

    return this
  }

  return instance
}

module.exports = IpRoutingConnection
