'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXHeader = void 0;
const KNXConstants = require("./KNXConstants");
const sysLogger = require("./../KnxLog.js").get(); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window            


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
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("KNXHeader: createFromBuffer: incomplete buffer. Buffer length: " + buffer.length + " expected HEADER_SIZE_10 equals to " + KNXConstants.KNX_CONSTANTS.HEADER_SIZE_10);
            throw new Error('Incomplete buffer');
        }
        const header_length = buffer.readUInt8(offset);
        if (header_length !== KNXConstants.KNX_CONSTANTS.HEADER_SIZE_10) {
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("KNXHeader: createFromBuffer: invalid header_length. header_length: " + header_length + " expected HEADER_SIZE_10 equals to " + KNXConstants.KNX_CONSTANTS.HEADER_SIZE_10);
            throw new Error(`Invalid buffer length ${header_length}`);
        }
        offset += 1;
        const version = buffer.readUInt8(offset);
        if (version !== KNXConstants.KNX_CONSTANTS.KNXNETIP_VERSION_10) {
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("KNXHeader: createFromBuffer: Unknown header version. Version: " + version + " expected KNXNETIP_VERSION_10 to " + KNXConstants.KNX_CONSTANTS.KNXNETIP_VERSION_10);
            throw new Error(`Unknown version ${version}`);
        }
        offset += 1;
        const type = buffer.readUInt16BE(offset);
        offset += 2;
        const length = buffer.readUInt16BE(offset);
        if (length !== buffer.length) {
            try {
                if (sysLogger !== undefined && sysLogger !== null) sysLogger.error(`Received KNX packet: KNXHeader: createFromBuffer: Message length mismatch ${length}/${buffer.length} Data processed: ${buffer.toString("hex") || "??"}`);
            } catch (error) { }
            // throw new Error(`Message length mismatch ${length}/${buffer.length} Data processed: ${buffer.toString("hex") || "??"}`);
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