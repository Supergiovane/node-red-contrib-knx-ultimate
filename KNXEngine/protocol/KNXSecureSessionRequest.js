'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXSecureSessionRequest = void 0;
const KNXConstants = require("./KNXConstants");
const KNXPacket = require("./KNXPacket");
const HPAI = require("./HPAI");
const CRIFactory = __importDefault(require("./CRIFactory"));

class KNXSecureSessionRequest extends KNXPacket.KNXPacket {
    constructor(cri, hpaiData = HPAI.HPAI.NULLHPAI) {
        //super(KNXConstants.KNX_CONSTANTS.SECURE_SESSION_REQUEST, hpaiControl.length + hpaiData.length + cri.length + 32);
        super(KNXConstants.KNX_CONSTANTS.SECURE_SESSION_REQUEST, hpaiData.length + 32);
        this.cri = cri;
        this.hpaiData = hpaiData;
        this.diffieHellmanClientPublicValue = new Buffer.alloc(32);

        // Send the DH curve as well
        let _key = ".!Pea332";
        _key = _key + new Array((32 + 1) - _key.length).join("\0");
        let ALICE_PRIV = Buffer.from(_key).toString("hex");
        let alicePriv = Uint8Array.from(Buffer.from(ALICE_PRIV, 'hex'));
        let Curve25519 = require('./../Curve25519');
        try {
            let secret = Curve25519.generateKeyPair(alicePriv);
            //console.log('BANANA Secret:', Buffer.from(secret).toString('hex'))
            let hexString = "f0c143e363147dc64913d736978042ef748ba448aa6ce2a1dab5ddecca919455";
            secret.public = Uint8Array.from(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            this.diffieHellmanClientPublicValue = Buffer.from(secret.public).toString('hex');

        } catch (error) {
            throw (error);
        }


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
        return new KNXSecureSessionRequest(cri, hpaiControl, hpaiData);
    }
    toBuffer() {
        return Buffer.concat([
            this.header.toBuffer(),
            this.hpaiData.toBuffer(),
            Buffer.from(this.diffieHellmanClientPublicValue, "hex")
        ]);
    }
}
exports.KNXSecureSessionRequest = KNXSecureSessionRequest;
//# sourceMappingURL=KNXSecureSessionRequest.js.map