'use strict';
const KNXConstants_1 = require("./KNXConstants");
const TunnelCRI_1 = require("./TunnelCRI");
module.exports = class CRIFactory {
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
        switch (connectionType) {
            case KNXConstants_1.KNX_CONSTANTS.TUNNEL_CONNECTION:
                return TunnelCRI_1.TunnelCRI.createFromBuffer(buffer, offset);
        }
    }
};
//# sourceMappingURL=CRIFactory.js.map