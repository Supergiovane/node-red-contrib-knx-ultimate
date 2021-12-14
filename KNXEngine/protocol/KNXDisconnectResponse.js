"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXDisconnectResponse = void 0;
const KNXPacket_1 = require("./KNXPacket");
const KNXConstants_1 = require("./KNXConstants");
class KNXDisconnectResponse extends KNXPacket_1.KNXPacket {
    constructor(channelID, status) {
        super(KNXConstants_1.KNX_CONSTANTS.DISCONNECT_RESPONSE, 2);
        this.channelID = channelID;
        this.status = status;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXDisconnectResponse(channelID, status);
    }
    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        return Buffer.concat([this.header.toBuffer(), buffer]);
    }
}
exports.KNXDisconnectResponse = KNXDisconnectResponse;
//# sourceMappingURL=KNXDisconnectResponse.js.map