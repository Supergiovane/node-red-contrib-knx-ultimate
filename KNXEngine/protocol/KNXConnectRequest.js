'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXConnectRequest = void 0;
const KNXConstants = require("./KNXConstants");
const KNXPacket = require("./KNXPacket");
const HPAI = require("./HPAI");
const CRIFactory = __importDefault(require("./CRIFactory"));
class KNXConnectRequest extends KNXPacket.KNXPacket {
    constructor(cri, hpaiControl = HPAI.HPAI.NULLHPAI, hpaiData = HPAI.HPAI.NULLHPAI) {
        super(KNXConstants.KNX_CONSTANTS.CONNECT_REQUEST, hpaiControl.length + hpaiData.length + cri.length);
        this.cri = cri;
        this.hpaiControl = hpaiControl;
        this.hpaiData = hpaiData;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const hpaiControl = HPAI.HPAI.createFromBuffer(buffer, offset);
        offset += hpaiControl.length;
        const hpaiData = HPAI.HPAI.createFromBuffer(buffer, offset);
        offset += hpaiData.length;
        const cri = CRIFactory.default.createFromBuffer(buffer, offset);
        return new KNXConnectRequest(cri, hpaiControl, hpaiData);
    }
    toBuffer() {
        return Buffer.concat([
            this.header.toBuffer(),
            this.hpaiControl.toBuffer(),
            this.hpaiData.toBuffer(),
            this.cri.toBuffer()
        ]);
    }
}
exports.KNXConnectRequest = KNXConnectRequest;
//# sourceMappingURL=KNXConnectRequest.js.map