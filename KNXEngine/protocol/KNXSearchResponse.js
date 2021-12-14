'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXSearchResponse = void 0;
const KNXConstants_1 = require("./KNXConstants");
const KNXPacket_1 = require("./KNXPacket");
const DeviceInfo_1 = require("./DeviceInfo");
const ServiceFamilies_1 = require("./ServiceFamilies");
const HPAI_1 = require("./HPAI");
class KNXSearchResponse extends KNXPacket_1.KNXPacket {
    constructor(hpai, deviceInfo, serviceFamilies) {
        super(KNXConstants_1.KNX_CONSTANTS.SEARCH_RESPONSE, hpai.length + deviceInfo.length + serviceFamilies.length);
        this.hpai = hpai;
        this.deviceInfo = deviceInfo;
        this.serviceFamilies = serviceFamilies;
    }
    static createFromBuffer(buffer, offset = 0) {
        const hpai = HPAI_1.HPAI.createFromBuffer(buffer, offset);
        offset += hpai.length;
        const deviceInfo = DeviceInfo_1.DeviceInfo.createFromBuffer(buffer, offset);
        offset += deviceInfo.length;
        const serviceFamilies = ServiceFamilies_1.ServiceFamilies.createFromBuffer(buffer, offset);
        return new KNXSearchResponse(hpai, deviceInfo, serviceFamilies);
    }
    toBuffer() {
        return Buffer.concat([
            this.header.toBuffer(),
            this.hpai.toBuffer(),
            this.deviceInfo.toBuffer(),
            this.serviceFamilies.toBuffer()
        ]);
    }
}
exports.KNXSearchResponse = KNXSearchResponse;
//# sourceMappingURL=KNXSearchResponse.js.map