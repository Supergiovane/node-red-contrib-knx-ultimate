
const KNXHeader = require("./KNXHeader");
class KNXPacket {
    constructor(type, length) {
        this._header = new KNXHeader.KNXHeader(type, length);
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