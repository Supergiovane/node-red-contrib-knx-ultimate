'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNXAddress = exports.KNXAddressLevel = exports.KNXAddressType = void 0;
const KNXUtils = require("./KNXUtils");
const Parser = require('binary-parser').Parser

let threeLevelPhysical = (new Parser()).bit4('l1').bit4('l2').uint8('l3')
let threeLevelGroup = (new Parser()).bit5('l1').bit3('l2').uint8('l3')
let twoLevel = (new Parser()).bit5('l1').bit11('l2')

const ADDRESS_LENGTH = 2;
var KNXAddressType;
(function (KNXAddressType) {
    KNXAddressType[KNXAddressType["TYPE_INDIVIDUAL"] = 0] = "TYPE_INDIVIDUAL";
    KNXAddressType[KNXAddressType["TYPE_GROUP"] = 1] = "TYPE_GROUP";
})(KNXAddressType = exports.KNXAddressType || (exports.KNXAddressType = {}));
var KNXAddressLevel;
(function (KNXAddressLevel) {
    KNXAddressLevel[KNXAddressLevel["LEVEL_TWO"] = 2] = "LEVEL_TWO";
    KNXAddressLevel[KNXAddressLevel["LEVEL_THREE"] = 3] = "LEVEL_THREE";
})(KNXAddressLevel = exports.KNXAddressLevel || (exports.KNXAddressLevel = {}));
class KNXAddress {
    constructor(address, type = KNXAddressType.TYPE_INDIVIDUAL, level = KNXAddressLevel.LEVEL_THREE) {
        this.type = type;
        this.level = level;
        this.set(address);
        this.length = ADDRESS_LENGTH;
    }
    static get TYPE_INDIVIDUAL() {
        return KNXAddressType.TYPE_INDIVIDUAL;
    }
    static get TYPE_GROUP() {
        return KNXAddressType.TYPE_GROUP;
    }
    static createFromString(address, type = KNXAddressType.TYPE_INDIVIDUAL) {
        return new KNXAddress((0, KNXUtils.validateKNXAddress)(address, type === KNXAddressType.TYPE_GROUP), type);
    }
    static createFromBuffer(buffer, offset = 0, type = KNXAddressType.TYPE_INDIVIDUAL) {
        if (offset + ADDRESS_LENGTH >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const address = buffer.readUInt16BE(offset);
        return new KNXAddress(address, type);
    }
    set(address) {
        if (isNaN(address)) {
            throw new Error('Invalid address format');
        }
        else if (address > 0xFFFF) {
            throw new Error('Invalid address number');
        }
        else {
            this._address = address;
        }
    }
    get() {
        return this._address;
    }
    toString() {

        let address = "";
        let buf = Buffer.alloc(2);
        buf.writeUInt16BE(this._address);

        if (this.type === KNXAddressType.TYPE_GROUP && this.level === KNXAddressLevel.LEVEL_TWO) {
            // 2 level group
            let addr = twoLevel.parse(buf);
            address = [addr.l1, addr.l2].join('/')
        } else {
            // 3 level physical or group address
            let sep = (this.type === KNXAddressType.TYPE_GROUP ? '/' : '.');
            let addr = (this.type === KNXAddressType.TYPE_GROUP ? threeLevelGroup : threeLevelPhysical).parse(buf);
            address = [addr.l1, addr.l2, addr.l3].join(sep);
        }

        return address;

        // const digits = [];
        // if (this.level === KNXAddressLevel.LEVEL_TWO) {
        //     digits.push((this._address >> 8) & 0xFF);
        //     digits.push(this._address & 0xFF);
        // }
        // else {
        //     if (this._address > 0x7FF) {
        //         if (this.type === KNXAddressType.TYPE_GROUP) {
        //             digits.push((this._address >> 11) & 0x1F);
        //         }
        //         else {
        //             digits.push((this._address >> 12) & 0x0F);
        //         }
        //     }
        //     if (this.type === KNXAddressType.TYPE_GROUP) {
        //         digits.push((this._address >> 8) & 0x07);
        //     }
        //     else {
        //         digits.push((this._address >> 8) & 0x0F);
        //     }
        // }
        // digits.push(this._address & 0xFF);
        // if (this.type === KNXAddressType.TYPE_GROUP) {
        //     return digits.join('/');
        // }
        // else {
        //     return digits.join('.');
        // }
    }
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        buffer.writeUInt16BE(this._address, 0);
        return buffer;
    }
}
exports.KNXAddress = KNXAddress;
//# sourceMappingURL=KNXAddress.js.map