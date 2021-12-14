'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXConnectionStateRequest = void 0;
const KNXPacket_1 = require("./KNXPacket");
const KNXConstants_1 = require("./KNXConstants");
const HPAI_1 = require("./HPAI");
class KNXConnectionStateRequest extends KNXPacket_1.KNXPacket {
    constructor(channelID, hpaiControl = HPAI_1.HPAI.NULLHPAI) {
        super(KNXConstants_1.KNX_CONSTANTS.CONNECTIONSTATE_REQUEST, hpaiControl.length + 2);
        this.channelID = channelID;
        this.hpaiControl = hpaiControl;
        this.channelID = channelID;
        this.hpaiControl = hpaiControl;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        offset++;
        const hpaiControl = HPAI_1.HPAI.createFromBuffer(buffer, offset);
        return new KNXConnectionStateRequest(channelID, hpaiControl);
    }
    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(0, 1);
        return Buffer.concat([
            this.header.toBuffer(),
            buffer,
            this.hpaiControl.toBuffer()
        ]);
    }
}
exports.KNXConnectionStateRequest = KNXConnectionStateRequest;
//# sourceMappingURL=KNXConnectionStateRequest.js.map