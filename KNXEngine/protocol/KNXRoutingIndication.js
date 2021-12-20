'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXRoutingIndication = void 0;
const KNXPacket = require("./KNXPacket");
const KNXConstants = require("./KNXConstants");
const CEMIFactory = require("./cEMI/CEMIFactory");
class KNXRoutingIndication extends KNXPacket.KNXPacket {
    constructor(cEMIMessage) {
        super(KNXConstants.KNX_CONSTANTS.ROUTING_INDICATION, cEMIMessage.length);
        this.cEMIMessage = cEMIMessage;
    }
    static parseCEMIMessage(buffer, offset) {
        if (offset > buffer.length) {
            throw new Error('Buffer too short');
        }
        const msgCode = buffer.readUInt8(offset++);
        return CEMIFactory.CEMIFactory.createFromBuffer(msgCode, buffer, offset);
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const cEMIMessage = this.parseCEMIMessage(buffer, offset);
        return new KNXRoutingIndication(cEMIMessage);
    }
    toBuffer() {
        return Buffer.concat([this.header.toBuffer(),  this.cEMIMessage.toBuffer()]);
    }
}
exports.KNXRoutingIndication = KNXRoutingIndication;
//# sourceMappingURL=KNXRoutingIndication.js.map