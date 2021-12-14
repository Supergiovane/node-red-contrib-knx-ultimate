"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunnelCRI = exports.TunnelTypes = void 0;
const KNXConstants_1 = require("./KNXConstants");
const CRI_1 = require("./CRI");
const TUNNEL_CRI_LENGTH = 4;
var TunnelTypes;
(function (TunnelTypes) {
    TunnelTypes[TunnelTypes["TUNNEL_LINKLAYER"] = KNXConstants_1.KNX_CONSTANTS.TUNNEL_LINKLAYER] = "TUNNEL_LINKLAYER";
    TunnelTypes[TunnelTypes["TUNNEL_RAW"] = KNXConstants_1.KNX_CONSTANTS.TUNNEL_RAW] = "TUNNEL_RAW";
    TunnelTypes[TunnelTypes["TUNNEL_BUSMONITOR"] = KNXConstants_1.KNX_CONSTANTS.TUNNEL_BUSMONITOR] = "TUNNEL_BUSMONITOR";
})(TunnelTypes = exports.TunnelTypes || (exports.TunnelTypes = {}));
class TunnelCRI extends CRI_1.CRI {
    constructor(knxLayer) {
        super(KNXConstants_1.KNX_CONSTANTS.TUNNEL_CONNECTION);
        this.knxLayer = knxLayer;
    }
    get length() {
        return TUNNEL_CRI_LENGTH;
    }
    static createFromBuffer(buffer, offset = 0) {
        const knxLayer = buffer.readUInt8(offset++);
        buffer.readUInt8(offset);
        return new TunnelCRI(knxLayer);
    }
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNXConstants_1.KNX_CONSTANTS.TUNNEL_CONNECTION, offset++);
        buffer.writeUInt8(this.knxLayer, offset++);
        buffer.writeUInt8(0x00, offset);
        return buffer;
    }
}
exports.TunnelCRI = TunnelCRI;
//# sourceMappingURL=TunnelCRI.js.map