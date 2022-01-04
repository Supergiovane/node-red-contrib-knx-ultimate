"use strict";


const EventEmitter = require("events");
const dgram = require("dgram");
const net = require('net')
const KNXConstants = require("./protocol/KNXConstants");
const CEMIConstants = require("./protocol/cEMI/CEMIConstants");
const CEMIFactory = require("./protocol/cEMI/CEMIFactory");
const KNXProtocol = require("./protocol/KNXProtocol");
const KNXConnectResponse = require("./protocol/KNXConnectResponse");
const HPAI = require("./protocol/HPAI");
const TunnelCRI = require("./protocol/TunnelCRI");
const KNXConnectionStateResponse = require("./protocol/KNXConnectionStateResponse");
const errors = require("./errors");
const ipAddressHelper = require("./util/ipAddressHelper");
const KNXAddress = require("./protocol/KNXAddress").KNXAddress;
const KNXDataBuffer = require("./protocol/KNXDataBuffer").KNXDataBuffer;
const DPTLib = require('./dptlib');
const KNXsecureKeyring = require("./KNXsecureKeyring.js");
//const lodash = require("lodash");

var STATE;
(function (STATE) {
    STATE[STATE["STARTED"] = 0] = "STARTED";
    STATE[STATE["CONNECTING"] = 3] = "CONNECTING";
    STATE[STATE["CONNECTED"] = 4] = "CONNECTED";
    STATE[STATE["DISCONNECTING"] = 5] = "DISCONNECTING";
    STATE[STATE["DISCONNECTED"] = 6] = "DISCONNECTED";
})(STATE || (STATE = {}));
var TUNNELSTATE;
(function (TUNNELSTATE) {
    TUNNELSTATE[TUNNELSTATE["READY"] = 0] = "READY";
})(TUNNELSTATE || (TUNNELSTATE = {}));
const SocketEvents = {
    error: 'error',
    message: 'message',
    listening: "listening",
    data: "data",
    close: "close"
};
var KNXClientEvents;
(function (KNXClientEvents) {
    KNXClientEvents["error"] = "error";
    KNXClientEvents["disconnected"] = "disconnected";
    KNXClientEvents["discover"] = "discover";
    KNXClientEvents["indication"] = "indication";
    KNXClientEvents["connected"] = "connected";
    KNXClientEvents["ready"] = "ready";
    KNXClientEvents["response"] = "response";
    KNXClientEvents["connecting"] = "connecting";
})(KNXClientEvents || (KNXClientEvents = {}));

// const KNXClientEvents = {
//     error: "error",
//     disconnected: "disconnected",
//     discover: "discover",
//     indication: "indication",
//     connected: "connected",
//     ready: "ready",
//     response: "response",
//     connecting: "connecting"
// };

// options:
const optionsDefaults = {
    physAddr: '15.15.200',
    connectionKeepAliveTimeout: KNXConstants.KNX_CONSTANTS.CONNECTION_ALIVE_TIME,
    ipAddr: "224.0.23.12",
    ipPort: 3671,
    hostProtocol: "TunnelUDP", // TunnelUDP, TunnelTCP, Multicast
    isSecureKNXEnabled: false,
    suppress_ack_ldatareq: false,
    loglevel: "info",
    localEchoInTunneling: true,
    localIPAddress: "",
    interface: "",
    jKNXSecureKeyring: {}
};

class KNXClient extends EventEmitter {

    constructor(options) {

        if (options === undefined) {
            options = optionsDefaults;
        }

        super();
        this._clientTunnelSeqNumber = -1;
        this._options = options;//Object.assign(optionsDefaults, options);
        this._options.connectionKeepAliveTimeout = KNXConstants.KNX_CONSTANTS.CONNECTION_ALIVE_TIME,
            this._localPort = null;
        this._peerHost = this._options.ipAddr;
        this._peerPort = this._options.ipPort;
        this._connectionTimeoutTimer = null;
        this._heartbeatFailures = 0;
        this.max_HeartbeatFailures = 3;
        this._heartbeatTimer = null;
        this._discovery_timer = null;
        this._awaitingResponseType = null;
        this._processInboundMessage = this._processInboundMessage.bind(this);
        this._clientSocket = null;
        this.sysLogger = null;
        this.jKNXSecureKeyring = this._options.jKNXSecureKeyring; // 28/12/2021 Contains the Keyring JSON object
        try {
            this.sysLogger = require("./KnxLog.js").get({ loglevel: this._options.loglevel }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window            
        } catch (error) {
            console.log("BANANA ERRORE this.sysLogger = require", error.message);
            throw (error);
        }

        if (typeof this._options.physAddr === "string") this._options.physAddr = KNXAddress.createFromString(this._options.physAddr);
        try {
            this._options.localIPAddress = ipAddressHelper.getLocalAddress(this._options.interface); // Get the local address of the selected interface    
        } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("ipAddressHelper.getLocalAddress:" + error.message);
            throw (error);
        }

        let conn = this;
        // 07/12/2021 Based on protocol instantiate the right socket
        if (this._options.hostProtocol === "TunnelUDP") {
            this._clientSocket = dgram.createSocket({ type: 'udp4', reuseAddr: false });
            this._clientSocket.on(SocketEvents.message, this._processInboundMessage);
            this._clientSocket.on(SocketEvents.error, error => this.emit(KNXClientEvents.error, error));
            this._clientSocket.on(SocketEvents.close, info => this.emit(KNXClientEvents.close, info));
            this._clientSocket.bind({ address: this._options.localIPAddress, port: this._options._peerPort }, () => {
                try {
                    conn._clientSocket.setTTL(128);
                } catch (error) {
                    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("UDP:  Error setting SetTTL " + error.message || "");
                }
            });

        } else if (this._options.hostProtocol === "TunnelTCP") {
            // TCP
            this._clientSocket = new net.Socket();
            //this._clientSocket.on(SocketEvents.data, this._processInboundMessage);
            this._clientSocket.on(SocketEvents.data, function (msg, rinfo, callback) {
                console.log(msg, rinfo, callback);
            });
            this._clientSocket.on(SocketEvents.error, error => this.emit(KNXClientEvents.error, error));
            this._clientSocket.on(SocketEvents.close, info => this.emit(KNXClientEvents.close, info));

        } else if (this._options.hostProtocol === "Multicast") {
            let conn = this;
            this._clientSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
            this._clientSocket.on(SocketEvents.listening, function () {
                try {
                    conn._clientSocket.addMembership(conn._peerHost, conn._options.localIPAddress);
                } catch (err) {
                    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Multicast: cannot add membership (%s)", err);
                    try {
                        this.emit(KNXClientEvents.error, err);
                    } catch (error) { }
                    return;
                }
            });
            this._clientSocket.on(SocketEvents.message, this._processInboundMessage);
            this._clientSocket.on(SocketEvents.error, error => this.emit(KNXClientEvents.error, error));
            this._clientSocket.on(SocketEvents.close, info => this.emit(KNXClientEvents.close, info));
            this._clientSocket.bind(this._peerPort, () => {
                try {
                    conn._clientSocket.setMulticastTTL(128);
                    conn._clientSocket.setMulticastInterface(this._options.localIPAddress);
                } catch (error) {
                    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Multicast: Error setting SetTTL " + error.message || "");
                }
                this._localPort = this._clientSocket.address().port;// 07/12/2021 Get the local port used bu the socket
            });
        }

        this._clientTunnelSeqNumber = -1;
        this._channelID = null;
        this._connectionState = STATE.DISCONNECTED;
        this._tunnelReqTimer = null;
        this._numFailedTelegramACK = 0; // 25/12/2021 Keep count of the failed tunnelig ACK telegrams

    }
    get channelID() {
        return this._channelID;
    }
    // 16/12/2021 Transform the plain value "data" into a KNXDataBuffer. The datapoints without "null" are SixBits
    // dataPointsSixBits = {
    //     DPT1,
    //     DPT2,
    //     DPT3,
    //     DPT4: null,
    //     DPT5,
    //     DPT6: null,
    //     DPT7: null,
    //     DPT8: null,
    //     DPT9,
    //     DPT10,
    //     DPT11,
    //     DPT12: null,
    //     DPT13: null,
    //     DPT14,
    //     DPT15: null,
    //     DPT16: null,
    //     DPT17: null,
    //     DPT18,
    //     DPT19: null,
    //     DPT20: null
    // };
    getKNXDataBuffer(_data, _dptid) {
        let adpu = {};
        DPTLib.populateAPDU(_data, adpu, _dptid);
        let iDatapointType = parseInt(_dptid.substr(0, _dptid.indexOf(".")));
        let isSixBits = adpu.bitlength <= 6;
        //let isSixBits = [1,2,3,5,9,10,11,14,18].includes(iDatapointType);
        //console.log("isSixBits", isSixBits, "Includes (should be = isSixBits)", [1, 2, 3, 5, 9, 10, 11, 14, 18].includes(iDatapointType), "ADPU BitLenght", adpu.bitlength);
        try {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.trace("isSixBits:" + isSixBits + " Includes (should be = isSixBits):" + [1, 2, 3, 5, 9, 10, 11, 14, 18].includes(iDatapointType) + " ADPU BitLenght:" + adpu.bitlength);
        } catch (error) { }

        let IDataPoint = {
            id: "",
            value: "any",
            //type: { type: adpu.bitlength.toString() || null },
            type: { type: isSixBits },
            bind: null,
            read: () => null,
            write: null
        }
        return new KNXDataBuffer(adpu.data, IDataPoint);
    }
    bindSocketPortAsync(port = KNXConstants.KNX_CONSTANTS.KNX_PORT, host = '0.0.0.0') {
        return new Promise((resolve, reject) => {
            try {
                this._clientSocket.bind(port, host, () => {
                    this._clientSocket.setMulticastInterface(host);
                    this._clientSocket.setMulticastTTL(128);
                    this._options.localIPAddress = host;
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    send(knxPacket) {

        // Logging
        if (this.sysLogger !== undefined && this.sysLogger !== null) {
            try {
                if (knxPacket.constructor.name !== undefined && knxPacket.constructor.name.toLowerCase() === "knxconnectrequest") this.sysLogger.debug("Sending KNX packet: " + knxPacket.constructor.name + " Host:" + this._peerHost + ":" + this._peerPort);
                if (knxPacket.constructor.name !== undefined && (knxPacket.constructor.name.toLowerCase() === "knxtunnelingrequest" || knxPacket.constructor.name.toLowerCase() === "knxroutingindication")) {
                    let sTPCI = ""
                    if (knxPacket.cEMIMessage.npdu.isGroupRead) sTPCI = "Read";
                    if (knxPacket.cEMIMessage.npdu.isGroupResponse) sTPCI = "Response";
                    if (knxPacket.cEMIMessage.npdu.isGroupWrite) sTPCI = "Write";
                    // Composing debug string
                    let sDebugString = "???";
                    try {
                        sDebugString = "Data: " + JSON.stringify(knxPacket.cEMIMessage.npdu);
                        sDebugString += " srcAddress: " + knxPacket.cEMIMessage.srcAddress.toString();
                        sDebugString += " dstAddress: " + knxPacket.cEMIMessage.dstAddress.toString();
                    } catch (error) { }
                    this.sysLogger.debug("Sending KNX packet: " + knxPacket.constructor.name + " " + sDebugString + " Host:" + this._peerHost + ":" + this._peerPort + " channelID:" + knxPacket.channelID + " seqCounter:" + knxPacket.seqCounter + " Dest:" + knxPacket.cEMIMessage.dstAddress.toString(), " Data:" + knxPacket.cEMIMessage.npdu.dataValue.toString("hex") + " TPCI:" + sTPCI);
                }
            } catch (error) {
            }
        }

        // Real send to KNX wires
        if (this._options.hostProtocol === "Multicast" || this._options.hostProtocol === "TunnelUDP") {
            // UDP
            try {
                this._clientSocket.send(knxPacket.toBuffer(), this._peerPort, this._peerHost, err => {
                    if (err) {
                        if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Sending KNX packet: Send UDP sending error: " + err.message || "Undef error");
                        try {
                            this.emit(KNXClientEvents.error, err);
                        } catch (error) {
                        }
                    }

                });
            } catch (error) {
                if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Sending KNX packet: Send UDP Catch error: " + error.message + " " + typeof (knxPacket) + " seqCounter:" + knxPacket.seqCounter);
                try {
                    this.emit(KNXClientEvents.error, error);
                } catch (error) {
                }

            }
        } else {
            // TCP
            try {
                this._clientSocket.write(knxPacket.toBuffer(), err => {
                    if (err) {
                        if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Sending KNX packet: Send TCP sending error: " + err.message || "Undef error");
                        this.emit(KNXClientEvents.error, err);
                    }
                });
            } catch (error) {
                if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Sending KNX packet: Send TCP Catch error: " + error.message || "Undef error");
                try {
                    this.emit(KNXClientEvents.error, error);
                } catch (error) { }
            }
        }
    }

    /**
    *
    * @param {KNXAddress} srcAddress
    * @param {KNXAddress} dstAddress
    * @param {KNXDataBuffer} data
    * @param {function} cb
    */
    // sendWriteRequest(dstAddress, data) {
    write(dstAddress, data, dptid) {

        if (this._connectionState !== STATE.CONNECTED) throw new Error("The socket is not connected. Unable to access the KNX BUS");

        // Get the Data Buffer from the plain value
        data = this.getKNXDataBuffer(data, dptid);

        if (typeof dstAddress === "string") dstAddress = KNXAddress.createFromString(dstAddress, KNXAddress.TYPE_GROUP);
        let srcAddress = this._options.physAddr;

        if (this._options.hostProtocol === "Multicast") {
            // Multicast
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataIndicationMessage("write", srcAddress, dstAddress, data);
            cEMIMessage.control.ack = 0;
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXRoutingIndication(cEMIMessage);
            this.send(knxPacketRequest);
            // 06/12/2021 Multivast automaticalli echoes telegrams
        } else {
            // Tunneling
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataRequestMessage("write", srcAddress, dstAddress, data);
            cEMIMessage.control.ack = this._options.suppress_ack_ldatareq ? 0 : 1;
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            this._incSeqNumber(); // 26/12/2021
            const seqNum = this._getSeqNumber();
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXTunnelingRequest(this._channelID, seqNum, cEMIMessage);
            if (!this._options.suppress_ack_ldatareq) this._setTimerWaitingForACK(knxPacketRequest);
            //if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("this._tunnelReqTimer "+ this._tunnelReqTimer.size);
            this.send(knxPacketRequest);
            // 06/12/2021 Echo the sent telegram. Last parameter is the echo true/false
            try {
                if (this._options.localEchoInTunneling) this.emit(KNXClientEvents.indication, knxPacketRequest, true, null);
            } catch (error) {
            }

        }

    }
    // sendResponseRequest
    respond(dstAddress, data, dptid) {

        if (this._connectionState !== STATE.CONNECTED) throw new Error("The socket is not connected. Unable to access the KNX BUS");

        // Get the Data Buffer from the plain value
        data = this.getKNXDataBuffer(data, dptid);

        if (typeof dstAddress === "string") dstAddress = KNXAddress.createFromString(dstAddress, KNXAddress.TYPE_GROUP);
        let srcAddress = this._options.physAddr;

        if (this._options.hostProtocol === "Multicast") {
            // Multicast
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataIndicationMessage("response", srcAddress, dstAddress, data);
            cEMIMessage.control.ack = 0;
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXRoutingIndication(cEMIMessage);
            this.send(knxPacketRequest);
            // 06/12/2021 Multivast automaticalli echoes telegrams

        } else {
            // Tunneling
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataRequestMessage("response", srcAddress, dstAddress, data);
            cEMIMessage.control.ack = this._options.suppress_ack_ldatareq ? 0 : 1;
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            this._incSeqNumber(); // 26/12/2021
            const seqNum = this._getSeqNumber();
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXTunnelingRequest(this._channelID, seqNum, cEMIMessage);
            if (!this._options.suppress_ack_ldatareq) this._setTimerWaitingForACK(knxPacketRequest);
            this.send(knxPacketRequest);
            // 06/12/2021 Echo the sent telegram. Last parameter is the echo true/false
            try {
                if (this._options.localEchoInTunneling) this.emit(KNXClientEvents.indication, knxPacketRequest, true, null);
            } catch (error) {
            }

        }

    }
    // sendReadRequest
    read(dstAddress) {

        if (this._connectionState !== STATE.CONNECTED) throw new Error("The socket is not connected. Unable to access the KNX BUS");

        if (typeof dstAddress === "string") dstAddress = KNXAddress.createFromString(dstAddress, KNXAddress.TYPE_GROUP);
        let srcAddress = this._options.physAddr;

        if (this._options.hostProtocol === "Multicast") {
            // Multicast
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataIndicationMessage("read", srcAddress, dstAddress, null);
            cEMIMessage.control.ack = 0;
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXRoutingIndication(cEMIMessage);
            this.send(knxPacketRequest);
            // 06/12/2021 Multivast automaticalli echoes telegrams

        } else {
            // Tunneling
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataRequestMessage("read", srcAddress, dstAddress, null);
            cEMIMessage.control.ack = 0;// No ack like telegram sent from ETS
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            this._incSeqNumber(); // 26/12/2021
            const seqNum = this._getSeqNumber();
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXTunnelingRequest(this._channelID, seqNum, cEMIMessage);
            if (!this._options.suppress_ack_ldatareq) this._setTimerWaitingForACK(knxPacketRequest);
            this.send(knxPacketRequest);
            // 06/12/2021 Echo the sent telegram. Last parameter is the echo true/false
            try {
                if (this._options.localEchoInTunneling) this.emit(KNXClientEvents.indication, knxPacketRequest, true, null);
            } catch (error) {
            }

        }

    }
    writeRaw(dstAddress, _rawDataBuffer, bitlength) {
        // bitlength is unused and only for backward compatibility

        if (this._connectionState !== STATE.CONNECTED) throw new Error("The socket is not connected. Unable to access the KNX BUS");

        if (!Buffer.isBuffer(_rawDataBuffer)) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXClient: writeRaw: Value must be a buffer! ');
            return
        }

        // Transform the  "data" into a KNDDataBuffer
        let data = new KNXDataBuffer(_rawDataBuffer)

        if (typeof dstAddress === "string") dstAddress = KNXAddress.createFromString(dstAddress, KNXAddress.TYPE_GROUP);
        let srcAddress = this._options.physAddr;
        if (this._options.hostProtocol === "Multicast") {
            // Multicast
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataIndicationMessage("write", srcAddress, dstAddress, data);
            cEMIMessage.control.ack = 0;
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXRoutingIndication(cEMIMessage);
            this.send(knxPacketRequest);
            // 06/12/2021 Multivast automaticalli echoes telegrams

        } else {
            // Tunneling
            const cEMIMessage = CEMIFactory.CEMIFactory.newLDataRequestMessage("write", srcAddress, dstAddress, data);
            cEMIMessage.control.ack = this._options.suppress_ack_ldatareq ? 0 : 1;
            cEMIMessage.control.broadcast = 1;
            cEMIMessage.control.priority = 3;
            cEMIMessage.control.addressType = 1;
            cEMIMessage.control.hopCount = 6;
            this._incSeqNumber(); // 26/12/2021
            const seqNum = this._getSeqNumber();
            const knxPacketRequest = KNXProtocol.KNXProtocol.newKNXTunnelingRequest(this._channelID, seqNum, cEMIMessage);
            if (!this._options.suppress_ack_ldatareq) this._setTimerWaitingForACK(knxPacketRequest);
            this.send(knxPacketRequest);
            // 06/12/2021 Echo the sent telegram. Last parameter is the echo true/false
            try {
                if (this._options.localEchoInTunneling) this.emit(KNXClientEvents.indication, knxPacketRequest, true, null);
            } catch (error) {
            }

        }

    }
    startHeartBeat() {
        this.stopHeartBeat();
        this._heartbeatFailures = 0;
        this._heartbeatRunning = true;
        this._runHeartbeat();
    }
    stopHeartBeat() {
        if (this._heartbeatTimer !== null) {
            this._heartbeatRunning = false;
            clearTimeout(this._heartbeatTimer);
        }
    }
    isDiscoveryRunning() {
        return this._discovery_timer != null;
    }
    startDiscovery() {
        if (this.isDiscoveryRunning()) {
            throw new Error('Discovery already running');
        }
        this._discovery_timer = setTimeout(() => {
            this._discovery_timer = null;
        }, 1000 * KNXConstants.KNX_CONSTANTS.SEARCH_TIMEOUT);
        this._sendSearchRequestMessage();
    }
    stopDiscovery() {
        if (!this.isDiscoveryRunning()) {
            return;
        }
        if (this._discovery_timer !== null) clearTimeout(this._discovery_timer);
        this._discovery_timer = null;
    }
    getDescription(host, port) {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this._connectionTimeoutTimer = setTimeout(() => {
            this._connectionTimeoutTimer = null;
        }, 1000 * KNXConstants.KNX_CONSTANTS.DEVICE_CONFIGURATION_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants.KNX_CONSTANTS.DESCRIPTION_RESPONSE;
        this._sendDescriptionRequestMessage(host, port);
    }
    Connect(knxLayer = TunnelCRI.TunnelTypes.TUNNEL_LINKLAYER) {

        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        if (this._connectionState === STATE.DISCONNECTING) {
            throw new Error('Socket is disconnecting. Please wait until disconnected.');
        }
        if (this._connectionState === STATE.CONNECTING) {
            throw new Error('Socket is connecting. Please wait until connected.');
        }
        if (this._connectionState === STATE.CONNECTED) {
            throw new Error('Socket is already connected. Disconnect first.');
        }

        this._connectionState = STATE.CONNECTING;
        this._numFailedTelegramACK = 0; // 25/12/2021 Reset the failed ACK counter
        this._clearToSend = true; // 26/12/2021 allow to send

        if (this._connectionTimeoutTimer !== null) clearTimeout(this._connectionTimeoutTimer);

        // Emit connecting
        this.emit(KNXClientEvents.connecting, this._options);


        if (this._options.hostProtocol === "TunnelUDP") {

            // Unicast, need to explicitly create the connection
            const timeoutError = new Error(`Connection timeout to ${this._peerHost}:${this._peerPort}`);
            this._connectionTimeoutTimer = setTimeout(() => {
                this._connectionTimeoutTimer = null;
                try {
                    this.emit(KNXClientEvents.error, timeoutError);
                } catch (error) {
                }

            }, 1000 * KNXConstants.KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
            this._awaitingResponseType = KNXConstants.KNX_CONSTANTS.CONNECT_RESPONSE;
            this._clientTunnelSeqNumber = -1;
            this._sendConnectRequestMessage(new TunnelCRI.TunnelCRI(knxLayer));

        } else if (this._options.hostProtocol === "TunnelTCP") {

            // TCP
            const timeoutError = new Error(`Connection timeout to ${this._peerHost}:${this._peerPort}`);
            let conn = this;
            this._clientSocket.connect({ port: this._peerPort, host: this._peerHost, localAddress: this._options.localAddress }, function () {
                // conn._timer = setTimeout(() => {
                //     conn._timer = null;
                //     conn.emit(KNXClientEvents.error, timeoutError);
                // }, 1000 * KNXConstants.KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
                conn._awaitingResponseType = KNXConstants.KNX_CONSTANTS.CONNECT_RESPONSE;
                conn._clientTunnelSeqNumber = 0;
                if (conn._options.isSecureKNXEnabled) conn._sendSecureSessionRequestMessage(new TunnelCRI.TunnelCRI(knxLayer), conn.jKNXSecureKeyring);
            });

        } else {

            // Multicast
            this._connectionState = STATE.CONNECTED;
            this._clientTunnelSeqNumber = -1;
            try {
                this.emit(KNXClientEvents.connected, this._options);
            } catch (error) {
            }

        }
    }
    getConnectionStatus() {

        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        const timeoutError = new Error(`HeartBeat failure with ${this._peerHost}:${this._peerPort}`);
        const deadError = new Error(`Connection dead with ${this._peerHost}:${this._peerPort}`);
        this._heartbeatTimer = setTimeout(() => {
            this._heartbeatTimer = null;
            try {
                if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("KNXClient: getConnectionStatus Timeout " + this._heartbeatFailures + " out of " + this.max_HeartbeatFailures);
                //this.emit(KNXClientEvents.error, timeoutError);
            } catch (error) {
            }

            this._heartbeatFailures++;
            if (this._heartbeatFailures >= this.max_HeartbeatFailures) {
                this._heartbeatFailures = 0;
                try {
                    this.emit(KNXClientEvents.error, deadError);
                } catch (error) {
                }
                this._setDisconnected();
            }
        }, 1000 * KNXConstants.KNX_CONSTANTS.CONNECTIONSTATE_REQUEST_TIMEOUT);
        this._awaitingResponseType = KNXConstants.KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE;
        this._sendConnectionStateRequestMessage(this._channelID);
    }
    Disconnect() {
        if (this._clientSocket == null) {
            throw new Error('No client socket defined');
        }
        this.stopHeartBeat();
        this._connectionState = STATE.DISCONNECTING;
        this._awaitingResponseType = KNXConstants.KNX_CONSTANTS.DISCONNECT_RESPONSE;
        this._sendDisconnectRequestMessage(this._channelID);
        //this._timerTimeoutSendDisconnectRequestMessage = setTimeout(() => {
        this._setDisconnected();
        //}, 1000 * KNXConstants.KNX_CONSTANTS.CONNECT_REQUEST_TIMEOUT);
    }
    isConnected() {
        return this._connectionState === STATE.CONNECTED;
    }
    _setDisconnected() {
        if (this._timerTimeoutSendDisconnectRequestMessagetimer !== null) clearTimeout(this._timerTimeoutSendDisconnectRequestMessagetimer);
        this._timerTimeoutSendDisconnectRequestMessage = null;
        if (this._connectionTimeoutTimer !== null) clearTimeout(this._connectionTimeoutTimer);
        if (this._tunnelReqTimer !== null) clearTimeout(this._tunnelReqTimer);
        this.stopHeartBeat();
        this._connectionState = STATE.DISCONNECTED;
        try {
            this.emit(KNXClientEvents.disconnected, `${this._options.ipAddr}:${this._options.ipPort}`);
        } catch (error) {
        }

        this._clientTunnelSeqNumber = -1;
        this._clearToSend = true; // 26/12/2021 allow to send
        this._channelID = null;

        // 08/12/2021
        try {
            this._clientSocket.close();
        } catch (error) { }

    }
    _runHeartbeat() {
        if (this._heartbeatRunning) {
            this.getConnectionStatus();
            setTimeout(() => {
                this._runHeartbeat();
            }, 1000 * this._options.connectionKeepAliveTimeout);
        }
    }
    _getSeqNumber() {
        return this._clientTunnelSeqNumber;
    }
    // 26/12/2021 Handle the busy state, for example while waiting for ACK
    _getClearToSend() {
        return (this._clearToSend !== undefined ? this._clearToSend : true);
    }

    _incSeqNumber(seq) {
        this._clientTunnelSeqNumber++;
        if (this._clientTunnelSeqNumber > 255) {
            this._clientTunnelSeqNumber = 0;
        }
        return this._clientTunnelSeqNumber;
    }
    // _keyFromCEMIMessage(cEMIMessage) {
    //     return cEMIMessage.dstAddress.toString();
    // }
    _setTimerWaitingForACK(knxTunnelingRequest) {
        const timeoutErr = new errors.RequestTimeoutError(`RequestTimeoutError seqCounter:${knxTunnelingRequest.seqCounter}, DestAddr:${knxTunnelingRequest.cEMIMessage.dstAddress.toString() || "Non definito"},  AckRequested:${knxTunnelingRequest.cEMIMessage.control.ack}, timed out waiting telegram acknowledge by ${this._options.ipAddr || "No Peer host detected"}`);
        if (this._tunnelReqTimer !== null) clearTimeout(this._tunnelReqTimer);
        this._clearToSend = false; // 26/12/2021 stop sending until ACK received
        this._tunnelReqTimer = setTimeout(() => {
            try {
                this._numFailedTelegramACK += 1;
                if (this._numFailedTelegramACK > 2) {
                    this._numFailedTelegramACK = 0;
                    this._clearToSend = true;
                    this.emit(KNXClientEvents.error, timeoutErr);
                } else {
                    // 26/12/2021 // If no ACK received, resend the datagram once with the same sequence number
                    this._setTimerWaitingForACK(knxTunnelingRequest);
                    this.send(knxTunnelingRequest);
                    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("KNXClient: _setTimerWaitingForACK: " + (timeoutErr.message || "Undef error") + " no ACK received. Retransmit datagram with seqNumber " + this._getSeqNumber());
                }
            } catch (error) { }
        }, KNXConstants.KNX_CONSTANTS.TUNNELING_REQUEST_TIMEOUT * 1000);

    }
    _processInboundMessage(msg, rinfo) {

        try {
            // Composing debug string
            try {
                if (this.sysLogger !== undefined && this.sysLogger !== null) {
                    var sProcessInboundLog = "???";
                    try {
                        sProcessInboundLog = "Data received: " + msg.toString("hex");
                        sProcessInboundLog += " srcAddress: " + JSON.stringify(rinfo);
                    } catch (error) { }
                    this.sysLogger.trace("Received KNX packet: _processInboundMessage, " + sProcessInboundLog + " ChannelID:" + this._channelID || "??" + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                }
            } catch (error) { }

            // BUGFIXING https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/162
            //msg = Buffer.from("0610053000102900b06011fe11150080","hex");

            const { knxHeader, knxMessage } = KNXProtocol.KNXProtocol.parseMessage(msg);

            // 26/12/2021 ROUTING LOST MESSAGE OR BUSY
            if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.ROUTING_LOST_MESSAGE) {
                try {
                    this.emit(KNXClientEvents.error, new Error('ROUTING_LOST_MESSAGE'));
                    this._setDisconnected();
                    return;
                } catch (error) { }
            } else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.ROUTING_BUSY) {
                try {
                    this.emit(KNXClientEvents.error, new Error('ROUTING_BUSY'));
                    this._setDisconnected();
                    return;
                } catch (error) { }
            }

            if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.SEARCH_RESPONSE) {

                if (this._discovery_timer == null) {
                    return;
                }
                try {
                    this.emit(KNXClientEvents.discover, `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
                } catch (error) {
                }

            }
            else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.CONNECT_RESPONSE) {
                if (this._connectionState === STATE.CONNECTING) {
                    if (this._connectionTimeoutTimer !== null) clearTimeout(this._connectionTimeoutTimer);
                    this._connectionTimeoutTimer = null;
                    const knxConnectResponse = knxMessage;
                    if (knxConnectResponse.status !== KNXConstants.ConnectionStatus.E_NO_ERROR) {
                        try {
                            this.emit(KNXClientEvents.error, KNXConnectResponse.KNXConnectResponse.statusToString(knxConnectResponse.status));
                        } catch (error) { }
                        this._setDisconnected();
                        return;
                    }
                    this._connectionState = STATE.CONNECTED;
                    this._channelID = knxConnectResponse.channelID;
                    try {
                        if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: CONNECT_RESPONSE, ChannelID:" + this._channelID + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                    } catch (error) { }
                    try {
                        this.emit(KNXClientEvents.connected, this._options);
                    } catch (error) {
                    }
                    this.startHeartBeat();
                }
            }
            else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.DISCONNECT_RESPONSE) {

                try {
                    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: DISCONNECT_RESPONSE, ChannelID:" + this._channelID + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                } catch (error) { }

                if (this._connectionState !== STATE.DISCONNECTING) {
                    try {
                        this.emit(KNXClientEvents.error, new Error('Unexpected Disconnect Response.'));
                    } catch (error) {
                    }
                }
                this._setDisconnected();
            }
            else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.DISCONNECT_REQUEST) {

                const knxDisconnectRequest = knxMessage;
                if (knxDisconnectRequest.channelID !== this._channelID) {
                    return;
                }

                try {
                    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: DISCONNECT_REQUEST, ChannelID:" + this._channelID + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                } catch (error) { }

                this._connectionState = STATE.DISCONNECTING;
                this._sendDisconnectResponseMessage(knxDisconnectRequest.channelID);
                this._setDisconnected();
            }
            else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.TUNNELING_REQUEST) {

                const knxTunnelingRequest = knxMessage;
                if (knxTunnelingRequest.channelID !== this._channelID) {
                    return;
                }

                if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants.CEMIConstants.L_DATA_IND) {

                    // Composing debug string
                    try {
                        if (this.sysLogger !== undefined && this.sysLogger !== null) {
                            let sDebugString = "???";
                            try {
                                sDebugString = "Data: " + JSON.stringify(knxTunnelingRequest.cEMIMessage.npdu);
                                sDebugString += " srcAddress: " + knxTunnelingRequest.cEMIMessage.srcAddress.toString();
                                sDebugString += " dstAddress: " + knxTunnelingRequest.cEMIMessage.dstAddress.toString();
                            } catch (error) { }
                            this.sysLogger.debug("Received KNX packet: TUNNELING: L_DATA_IND, " + sDebugString + " ChannelID:" + this._channelID + " seqCounter:" + knxTunnelingRequest.seqCounter + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                        }
                    } catch (error) { }

                    try {
                        this.emit(KNXClientEvents.indication, knxTunnelingRequest, false, msg.toString("hex"));
                    } catch (error) { }

                } else if (knxTunnelingRequest.cEMIMessage.msgCode === CEMIConstants.CEMIConstants.L_DATA_CON) {

                    try {
                        if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: TUNNELING: L_DATA_CON, ChannelID:" + this._channelID + " seqCounter:" + knxTunnelingRequest.seqCounter + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                    } catch (error) { }

                }

                // 26/12/2021 send the ACK if the server requestet that
                // Then REMOVED, because some interfaces sets the "ack request" always to 0 even if it needs ack.
                //if (knxMessage.cEMIMessage.control.ack){
                const knxTunnelAck = KNXProtocol.KNXProtocol.newKNXTunnelingACK(knxTunnelingRequest.channelID, knxTunnelingRequest.seqCounter, KNXConstants.KNX_CONSTANTS.E_NO_ERROR);
                this.send(knxTunnelAck);
                //}               

            } else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.TUNNELING_ACK) {
                //const knxTunnelingAck =  lodash.cloneDeep(knxMessage);
                const knxTunnelingAck = knxMessage;
                if (knxTunnelingAck.channelID !== this._channelID) {
                    return;
                }

                try {
                    if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: TUNNELING: TUNNELING_ACK, ChannelID:" + this._channelID + " seqCounter:" + knxTunnelingAck.seqCounter + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                } catch (error) { }

                // Check the received ACK sequence number
                if (!this._options.suppress_ack_ldatareq) {
                    if (knxTunnelingAck.seqCounter === this._getSeqNumber()) {
                        if (this._tunnelReqTimer !== null) clearTimeout(this._tunnelReqTimer);
                        this._numFailedTelegramACK = 0; // 25/12/2021 clear the current ACK failed telegram number
                        this._clearToSend = true; // I'm ready to send a new datagram now
                        try {
                            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: TUNNELING: DELETED_TUNNELING_ACK FROM PENDING ACK's, ChannelID:" + this._channelID + " seqCounter:" + knxTunnelingAck.seqCounter + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                        } catch (error) { }
                    } else {
                        // Inform that i received an ACK with an unexpected sequence number
                        try {
                            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Received KNX packet: TUNNELING: Unexpected Tunnel Ack with seqCounter = " + knxTunnelingAck.seqCounter);
                        } catch (error) { }
                        //this.emit(KNXClientEvents.error, `Unexpected Tunnel Ack ${knxTunnelingAck.seqCounter}`);
                    }
                }

            } else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.ROUTING_INDICATION) {

                // 07/12/2021 Multicast routing indication
                const knxRoutingInd = knxMessage;
                if (knxRoutingInd.cEMIMessage.msgCode === CEMIConstants.CEMIConstants.L_DATA_IND) {

                    // Composing debug string
                    try {
                        if (this.sysLogger !== undefined && this.sysLogger !== null) {
                            let sDebugString = "???";
                            try {
                                sDebugString = "Data: " + JSON.stringify(knxRoutingInd.cEMIMessage.npdu);
                                sDebugString += " srcAddress: " + knxRoutingInd.cEMIMessage.srcAddress.toString();
                                sDebugString += " dstAddress: " + knxRoutingInd.cEMIMessage.dstAddress.toString();
                            } catch (error) { }
                            this.sysLogger.debug("Received KNX packet: ROUTING: L_DATA_IND, " + sDebugString + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                        }
                    } catch (error) { }

                    try {
                        this.emit(KNXClientEvents.indication, knxRoutingInd, false, msg.toString("hex"));
                    } catch (error) {
                    }
                }
                else if (knxRoutingInd.cEMIMessage.msgCode === CEMIConstants.CEMIConstants.L_DATA_CON) {

                    try {
                        if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: ROUTING: L_DATA_CON, Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                    } catch (error) { }

                }

            } else if (knxHeader.service_type === KNXConstants.KNX_CONSTANTS.ROUTING_LOST_MESSAGE) {
                // Multicast, ho perso il mondo dei messaggi

            } else {
                if (knxHeader.service_type === this._awaitingResponseType) {
                    if (this._awaitingResponseType === KNXConstants.KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE) {

                        try {
                            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.debug("Received KNX packet: CONNECTIONSTATE_RESPONSE, ChannelID:" + this._channelID + " Host:" + this._options.ipAddr + ":" + this._options.ipPort);
                        } catch (error) { }

                        const knxConnectionStateResponse = knxMessage;
                        if (knxConnectionStateResponse.status !== KNXConstants.KNX_CONSTANTS.E_NO_ERROR) {
                            try {
                                this.emit(KNXClientEvents.error, KNXConnectionStateResponse.KNXConnectionStateResponse.statusToString(knxConnectionStateResponse.status));
                            } catch (error) {
                            }
                            this._setDisconnected();
                        }
                        else {
                            if (this._heartbeatTimer !== null) clearTimeout(this._heartbeatTimer);
                            this._heartbeatFailures = 0;
                        }
                    }
                    else {
                        if (this._connectionTimeoutTimer !== null) clearTimeout(this._connectionTimeoutTimer);
                    }
                }
                try {
                    this.emit(KNXClientEvents.response, `${rinfo.address}:${rinfo.port}`, knxHeader, knxMessage);
                } catch (error) {
                }

            }
        }
        catch (e) {
            try {
                if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error("Received KNX packet: Error processing inbound message: " + e.message + " " + sProcessInboundLog + " ChannelID:" + this._channelID + " Host:" + this._options.ipAddr + ":" + this._options.ipPort + ". This means that KNX-Ultimate received a malformed Header or CEMI message from your KNX Gateway.");
            } catch (error) { }
            try {
                // 05/01/2022 Avoid disconnecting, because there are many bugged knx gateways out there!
                //this.emit(KNXClientEvents.error, e);
                //this._setDisconnected();
            } catch (error) { }

        }

    }

    _sendDescriptionRequestMessage() {
        this.send(KNXProtocol.KNXProtocol.newKNXDescriptionRequest(new HPAI.HPAI(this._options.localIPAddress)));
    }
    _sendSearchRequestMessage() {
        this.send(KNXProtocol.KNXProtocol.newKNXSearchRequest(new HPAI.HPAI(this._options.localIPAddress, this._localPort)), KNXConstants.KNX_CONSTANTS.KNX_PORT, KNXConstants.KNX_CONSTANTS.KNX_IP);
    }
    _sendConnectRequestMessage(cri) {
        this.send(KNXProtocol.KNXProtocol.newKNXConnectRequest(cri));
    }
    _sendConnectionStateRequestMessage(channelID) {
        this.send(KNXProtocol.KNXProtocol.newKNXConnectionStateRequest(channelID));
    }
    _sendDisconnectRequestMessage(channelID) {
        this.send(KNXProtocol.KNXProtocol.newKNXDisconnectRequest(channelID));
    }
    _sendDisconnectResponseMessage(channelID, status = KNXConstants.ConnectionStatus.E_NO_ERROR) {
        this.send(KNXProtocol.KNXProtocol.newKNXDisconnectResponse(channelID, status));
    }
    _sendSecureSessionRequestMessage(cri, jKNXSecureKeyring) {
        let oHPAI = new HPAI.HPAI("0.0.0.0", 0, this._options.hostProtocol === "TunnelTCP" ? KNXConstants.KNX_CONSTANTS.IPV4_TCP : KNXConstants.KNX_CONSTANTS.IPV4_UDP);
        this.send(KNXProtocol.KNXProtocol.newKNXSecureSessionRequest(cri, oHPAI, jKNXSecureKeyring));
    }
}

// module.exports = function KNXClientEvents() {
//     return KNXClientEvents;
// }
module.exports = {
    KNXClient: KNXClient,
    KNXClientEvents: KNXClientEvents
};
//exports.KNXClient = KNXClient;
//exports.KNXClientEvents = KNXClientEvents;
