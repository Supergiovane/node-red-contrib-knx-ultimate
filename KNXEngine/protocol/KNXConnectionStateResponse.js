'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXConnectionStateResponse = void 0;
const KNXConstants = require("./KNXConstants");
const KNXPacket = require("./KNXPacket");
class KNXConnectionStateResponse extends KNXPacket.KNXPacket {
    constructor(channelID, status) {
        super(KNXConstants.KNX_CONSTANTS.CONNECTIONSTATE_RESPONSE, 2);
        this.channelID = channelID;
        this.status = status;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const channelID = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset);
        return new KNXConnectionStateResponse(channelID, status);
    }
    static statusToString(status) {
        switch (status) {
            case KNXConstants.KNX_CONSTANTS.E_SEQUENCE_NUMBER:
                return 'Invalid Sequence Number';
            case KNXConstants.KNX_CONSTANTS.E_CONNECTION_ID:
                return 'Invalid Connection ID';
            case KNXConstants.KNX_CONSTANTS.E_CONNECTION_TYPE:
                return 'Invalid Connection Type';
            case KNXConstants.KNX_CONSTANTS.E_CONNECTION_OPTION:
                return 'Invalid Connection Option';
            case KNXConstants.KNX_CONSTANTS.E_NO_MORE_CONNECTIONS:
                return 'No More Connections';
            case KNXConstants.KNX_CONSTANTS.E_DATA_CONNECTION:
                return 'Invalid Data Connection';
            case KNXConstants.KNX_CONSTANTS.E_KNX_CONNECTION:
                return 'Invalid KNX Connection';
            case KNXConstants.KNX_CONSTANTS.E_TUNNELING_LAYER:
                return 'Invalid Tunneling Layer';
            default:
                return `Unknown error ${status}`;
        }
    }
    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.channelID, 0);
        buffer.writeUInt8(this.status, 1);
        return Buffer.concat([this.header.toBuffer(), buffer]);
    }
}
exports.KNXConnectionStateResponse = KNXConnectionStateResponse;
//# sourceMappingURL=KNXConnectionStateResponse.js.map