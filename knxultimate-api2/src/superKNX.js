/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2021 Supergiovane
*/

const util = require('util')
const dgram = require('dgram')
const KnxLog = require('./KnxLog.js')
const RawModHandlers = require('./RawMod/Handlers')


const DPTLib = require('./dptlib')
const KnxConstants = require('./KnxConstants')
const KnxNetProtocol = require('./KnxProtocol')
this.channel_id = NaN;

// Connect
function Connect(_IPDest, _localIP) {
    let udpSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true })

    udpSocket.on('listening', function () {
        KnxLog.get().trace("Socket Listening on ", _localIP, udpSocket.address().port)
        console.log(udpSocket.localAddress, udpSocket.address().port)
        try {
            udpSocket.addMembership(_IPDest, _localIP)
        } catch (err) {
            console.log(err)
        }
    })

    udpSocket.on('message', function (msg, rinfo, callback) {
        handleUDPMessage(msg, rinfo, callback)
    })

    // ROUTING multicast connections need to bind to the default port, 3671
    udpSocket.bind(3671, function () {

        try {
            udpSocket.setMulticastTTL(16); // 13/04/2021 Supergiovane: Set TTL        
        } catch (error) {
        }
    })
}
Connect("224.0.23.12", "192.168.1.222");


function handleUDPMessage(msg, rinfo, callback) {
    console.log("FIGA MESSAGGIO", msg, rinfo)
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
            let descr = KnxConstants.keyText(KnxConstants.SERVICE_TYPE, dg.service_type)
            if (dg.service_type === KnxConstants.SERVICE_TYPE.TUNNELING_REQUEST ||
                dg.service_type === KnxConstants.SERVICE_TYPE.ROUTING_INDICATION) {
                descr += '_' + KnxConstants.keyText(KnxConstants.MESSAGECODES, dg.cemi.msgcode)
            }
            console.log("DG", dg)
            console.log("DESCE", descr)

            // if (!isNaN(this.channel_id) &&
            //     ((dg.hasOwnProperty('connstate') && dg.connstate.channel_id !== this.channel_id) ||
            //         (dg.hasOwnProperty('tunnstate') && dg.tunnstate.channel_id !== this.channel_id))) {
            //     KnxLog.get().trace('(%s): *** Ignoring %s datagram for other channel (own: %d)', this.compositeState(), descr, this.channel_id)
            // } else {
            //     // ... to drive the state machine (eg "inbound_TUNNELING_REQUEST_L_Data.ind")
            //     let signal = util.format('inbound_%s', descr)

            //     /* ***** Added by the fork ******/
            //     RawModHandlers.rawMsgHandler(msg, dg, this)
            //     /*******************************/

            //     // 23/03/2021 Supergiovane: Added the CEMI telegram for ETS Diagnostic
            //     // #####################################################################
            //     if (dg.hasOwnProperty("cemi") && typeof dg.cemi !== "undefined") {
            //         if (dg.hasOwnProperty("header_length") && typeof dg.header_length === "number") {
            //             try {
            //                 var iStart = dg.header_length;
            //                 if (dg.hasOwnProperty("tunnstate") && dg.tunnstate.hasOwnProperty("header_length") && typeof dg.tunnstate.header_length === "number") iStart += dg.tunnstate.header_length; // Add the tunnel lenght
            //                 dg.cemi.cemiETS = msg.toString("hex").substring(iStart * 2);
            //             } catch (error) { dg.cemi.cemiETS = ""; }
            //         } else {
            //             dg.cemi.cemiETS = "";
            //         }
            //     }
            //     // #####################################################################

            //     this.handle(signal, dg)
            // }
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
module.exports = this
