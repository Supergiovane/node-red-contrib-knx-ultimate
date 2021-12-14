'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXPacket = void 0;
const KNXHeader_1 = require("./KNXHeader");
class KNXPacket {
    constructor(type, length) {
        this.type = type;
        this.length = length;
        this._header = new KNXHeader_1.KNXHeader(type, length);
        this.type = type;
        this.length = length;
    }
    get header() {
        return this._header;
    }
    toBuffer() {
        return Buffer.alloc(0);
    }
}
exports.KNXPacket = KNXPacket;
//# sourceMappingURL=KNXPacket.js.map