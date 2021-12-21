'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXHeader = void 0;
const KNXConstants = require("./KNXConstants");
class KNXHeader {
    constructor(type, length) {
        this._headerLength = KNXConstants.KNX_CONSTANTS.HEADER_SIZE_10;
        this._version = KNXConstants.KNX_CONSTANTS.KNXNETIP_VERSION_10;
        this.service_type = type;
        this.length = KNXConstants.KNX_CONSTANTS.HEADER_SIZE_10 + length;
    }
    get headerLength() {
        return this._headerLength;
    }
    get version() {
        return this._version;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (buffer.length < KNXConstants.KNX_CONSTANTS.HEADER_SIZE_10) {
            throw new Error('Incomplete buffer');
        }
        const header_length = buffer.readUInt8(offset);
        if (header_length !== KNXConstants.KNX_CONSTANTS.HEADER_SIZE_10) {
            throw new Error(`Invalid buffer length ${header_length}`);
        }
        offset += 1;
        const version = buffer.readUInt8(offset);
        if (version !== KNXConstants.KNX_CONSTANTS.KNXNETIP_VERSION_10) {
            throw new Error(`Unknown version ${version}`);
        }
        offset += 1;
        const type = buffer.readUInt16BE(offset);
        offset += 2;
        const length = buffer.readUInt16BE(offset);
        if (length !== buffer.length) {
            throw new Error(`Message length mismatch ${length}/${buffer.length} Data processed: ${buffer.toString("hex") || "??"}`);
        }
        return new KNXHeader(type, length - header_length);
    }
    toBuffer() {
        const buffer = Buffer.alloc(this._headerLength);
        let offset = 0;
        buffer.writeUInt8(this._headerLength, offset);
        offset += 1;
        buffer.writeUInt8(this._version, offset);
        offset += 1;
        buffer.writeUInt16BE(this.service_type, offset);
        offset += 2;
        buffer.writeUInt16BE(this.length, offset);
        return buffer;
    }
}
exports.KNXHeader = KNXHeader;
//# sourceMappingURL=KNXHeader.js.map