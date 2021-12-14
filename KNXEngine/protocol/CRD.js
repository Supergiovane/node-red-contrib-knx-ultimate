"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRD = exports.ConnectionType = void 0;
const KNXConstants_1 = require("./KNXConstants");
const KNXAddress_1 = require("./KNXAddress");
const CRD_LENGTH = 4;
var ConnectionType;
(function (ConnectionType) {
    ConnectionType[ConnectionType["TUNNEL_CONNECTION"] = KNXConstants_1.KNX_CONSTANTS.TUNNEL_CONNECTION] = "TUNNEL_CONNECTION";
    ConnectionType[ConnectionType["DEVICE_MGMT_CONNECTION"] = KNXConstants_1.KNX_CONSTANTS.DEVICE_MGMT_CONNECTION] = "DEVICE_MGMT_CONNECTION";
    ConnectionType[ConnectionType["REMLOG_CONNECTION"] = KNXConstants_1.KNX_CONSTANTS.REMLOG_CONNECTION] = "REMLOG_CONNECTION";
    ConnectionType[ConnectionType["REMCONF_CONNECTION"] = KNXConstants_1.KNX_CONSTANTS.REMCONF_CONNECTION] = "REMCONF_CONNECTION";
    ConnectionType[ConnectionType["OBJSVR_CONNECTION"] = KNXConstants_1.KNX_CONSTANTS.OBJSVR_CONNECTION] = "OBJSVR_CONNECTION";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
class CRD {
    constructor(connectionType, knxAddress) {
        this.connectionType = connectionType;
        this.knxAddress = knxAddress;
    }
    set knxAddress(knxAddress) {
        this._knxAddress = knxAddress;
    }
    get knxAddress() {
        return this._knxAddress;
    }
    get length() {
        return CRD_LENGTH;
    }
    set connectionType(connectionType) {
        this._connectionType = connectionType;
    }
    get connectionType() {
        return this._connectionType;
    }
    static createFromBuffer(buffer, offset) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error('Buffer too short');
        }
        offset += 1;
        const connectionType = buffer.readUInt8(offset++);
        const knxAddress = buffer.readUInt16BE(offset);
        return new CRD(connectionType, KNXAddress_1.KNXAddress.createFromString(knxAddress));
    }
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(this.connectionType, offset++);
        buffer.writeUInt16BE(this.knxAddress.get(), offset);
        return buffer;
    }
}
exports.CRD = CRD;
//# sourceMappingURL=CRD.js.map