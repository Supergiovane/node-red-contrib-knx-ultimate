'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXProtocol = void 0;
const KNXConstants = require("./KNXConstants");
const KNXHeader = require("./KNXHeader");
const KNXSearchRequest = require("./KNXSearchRequest");
const KNXSearchResponse = require("./KNXSearchResponse");
const KNXDescriptionRequest = require("./KNXDescriptionRequest");
const KNXDescriptionResponse = require("./KNXDescriptionResponse");
const KNXConnectRequest = require("./KNXConnectRequest");
const KNXConnectResponse = require("./KNXConnectResponse");
const KNXConnectionStateRequest = require("./KNXConnectionStateRequest");
const KNXConnectionStateResponse = require("./KNXConnectionStateResponse");
const KNXDisconnectRequest = require("./KNXDisconnectRequest");
const KNXDisconnectResponse = require("./KNXDisconnectResponse");
const KNXTunnelingRequest = require("./KNXTunnelingRequest");
const KNXTunnelingAck = require("./KNXTunnelingAck");
const KNXRoutingIndication = require("./KNXRoutingIndication"); // 07/12/2021
const KNXSecureSessionRequest = require("./KNXSecureSessionRequest"); // 07/12/2021

const HPAI = require("./HPAI");

class KNXProtocol {
    static parseMessage(buffer) {
        const knxHeader = KNXHeader.KNXHeader.createFromBuffer(buffer);
        const knxData = buffer.slice(knxHeader.headerLength);
        let knxMessage;
        switch (knxHeader.service_type) {
            case KNXConstants.KNX_CONSTANTS.SEARCH_REQUEST:
                knxMessage = KNXSearchRequest.KNXSearchRequest.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.SEARCH_RESPONSE:
                knxMessage = KNXSearchResponse.KNXSearchResponse.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.DESCRIPTION_REQUEST:
                knxMessage = KNXDescriptionRequest.KNXDescriptionRequest.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.DESCRIPTION_RESPONSE:
                knxMessage = KNXDescriptionResponse.KNXDescriptionResponse.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.CONNECT_REQUEST:
                knxMessage = KNXConnectRequest.KNXConnectRequest.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.CONNECT_RESPONSE:
                knxMessage = KNXConnectResponse.KNXConnectResponse.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.CONNECTIONSTATE_REQUEST:
                knxMessage = KNXConnectionStateRequest.KNXConnectionStateRequest.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE:
                knxMessage = KNXConnectionStateResponse.KNXConnectionStateResponse.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.DISCONNECT_REQUEST:
                knxMessage = KNXDisconnectRequest.KNXDisconnectRequest.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.DISCONNECT_RESPONSE:
                knxMessage = KNXDisconnectResponse.KNXDisconnectResponse.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.TUNNELING_REQUEST:
                knxMessage = KNXTunnelingRequest.KNXTunnelingRequest.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.TUNNELING_ACK:
                knxMessage = KNXTunnelingAck.KNXTunnelingAck.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.ROUTING_INDICATION:
                knxMessage = KNXRoutingIndication.KNXRoutingIndication.createFromBuffer(knxData);
                break;
            case KNXConstants.KNX_CONSTANTS.ROUTING_LOST_MESSAGE:
                break;
        }
        return { knxHeader, knxMessage, knxData };
    }
    static newKNXSearchRequest(hpai) {
        return new KNXSearchRequest.KNXSearchRequest(hpai);
    }
    static newKNXDescriptionRequest(hpai) {
        return new KNXDescriptionRequest.KNXDescriptionRequest(hpai);
    }
    static newKNXConnectRequest(cri, hpaiControl = HPAI.HPAI.NULLHPAI, hpaiData = HPAI.HPAI.NULLHPAI) {
        return new KNXConnectRequest.KNXConnectRequest(cri, hpaiControl, hpaiData);
    }
    static newKNXConnectionStateRequest(channelID, hpaiControl = HPAI.HPAI.NULLHPAI) {
        return new KNXConnectionStateRequest.KNXConnectionStateRequest(channelID, hpaiControl);
    }
    static newKNXDisconnectRequest(channelID, hpaiControl = HPAI.HPAI.NULLHPAI) {
        return new KNXDisconnectRequest.KNXDisconnectRequest(channelID, hpaiControl);
    }
    static newKNXDisconnectResponse(channelID, status) {
        return new KNXDisconnectResponse.KNXDisconnectResponse(channelID, status);
    }
    static newKNXTunnelingACK(channelID, seqCounter, status) {
        return new KNXTunnelingAck.KNXTunnelingAck(channelID, seqCounter, status);
    }
    static newKNXTunnelingRequest(channelID, seqCounter, cEMIMessage) {
        return new KNXTunnelingRequest.KNXTunnelingRequest(channelID, seqCounter, cEMIMessage);
    }
    static newKNXRoutingIndication(cEMIMessage) { // 18/12/2021
        return new KNXRoutingIndication.KNXRoutingIndication(cEMIMessage);
    }
    static newKNXSecureSessionRequest(cri, hpaiData = HPAI.HPAI.NULLHPAI) {
        return new KNXSecureSessionRequest.KNXSecureSessionRequest(cri, hpaiData);
    }
}
exports.KNXProtocol = KNXProtocol;
//# sourceMappingURL=KNXProtocol.js.map