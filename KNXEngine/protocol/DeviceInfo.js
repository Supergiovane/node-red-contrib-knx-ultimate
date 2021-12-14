"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceInfo = exports.Medium = void 0;
const KNXConstants_1 = require("./KNXConstants");
const KNXUtils_1 = require("./KNXUtils");
const DEVICE_INFO_LENGTH = 0x36;
const SERIALNUMBER_LENGTH = 6;
const MACADDRESS_LENGTH = 6;
const NAME_LENGTH = 30;
var Medium;
(function (Medium) {
    Medium[Medium["TP1"] = KNXConstants_1.KNX_CONSTANTS.TP1] = "TP1";
    Medium[Medium["PL110"] = KNXConstants_1.KNX_CONSTANTS.PL110] = "PL110";
    Medium[Medium["RF"] = KNXConstants_1.KNX_CONSTANTS.RF] = "RF";
    Medium[Medium["IP"] = KNXConstants_1.KNX_CONSTANTS.IP] = "IP";
})(Medium = exports.Medium || (exports.Medium = {}));
class DeviceInfo {
    constructor(medium, status, address, projectID, serialNumber, ip, macAddress, name) {
        this._type = KNXConstants_1.KNX_CONSTANTS.DEVICE_INFO;
        this.medium = medium;
        this.status = status;
        this.ip = ip;
        this.name = name;
        this.serialNumber = serialNumber;
        this.projectID = projectID;
        this.address = address;
    }
    get type() {
        return this._type;
    }
    set ip(ip) {
        this._splitIP = (0, KNXUtils_1.splitIP)(ip);
    }
    get ip() {
        return this._splitIP.input;
    }
    get status() {
        return this._status;
    }
    set status(status) {
        this._status = status & 1;
    }
    set name(name) {
        if (name.length > NAME_LENGTH) {
            throw new Error(`Invalid name format or too long - ${name}(${name.length}`);
        }
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set projectID(id) {
        const _id = Number(id);
        if (isNaN(_id) || _id > 0xFFFF || _id < 0) {
            throw new Error('Invalid project id');
        }
        this._projectID = _id;
    }
    get projectID() {
        return this._projectID;
    }
    set serialNumber(serialNumber) {
        this._serialNumber = DeviceInfo.validArray(serialNumber, SERIALNUMBER_LENGTH);
    }
    get serialNumber() {
        return this._serialNumber;
    }
    set macAddress(macAddress) {
        this._macAddress = DeviceInfo.validArray(macAddress, MACADDRESS_LENGTH);
    }
    get macAddress() {
        return this._macAddress;
    }
    set medium(medium) {
        this._medium = medium;
    }
    get medium() {
        return this._medium;
    }
    get formattedMedium() {
        switch (this._medium) {
            case KNXConstants_1.KNX_CONSTANTS.TP1:
                return 'TP1';
            case KNXConstants_1.KNX_CONSTANTS.PL110:
                return 'PL110';
            case KNXConstants_1.KNX_CONSTANTS.RF:
                return 'RF';
            case KNXConstants_1.KNX_CONSTANTS.IP:
                return 'IP';
        }
    }
    set address(address) {
        this._address = (0, KNXUtils_1.validateKNXAddress)(address);
    }
    get address() {
        return this._address;
    }
    get formattedAddress() {
        let address = '';
        if (this._address > 0xFFF) {
            address = `${(this._address & 0xF000) >> 12}.`;
        }
        address += `${(this._address & 0x0F00) >> 8}.${this._address & 0xFF}`;
        return address;
    }
    get length() {
        return DEVICE_INFO_LENGTH;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset + this.length >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const type = buffer.readUInt8(offset++);
        if (type !== KNXConstants_1.KNX_CONSTANTS.DEVICE_INFO) {
            throw new Error(`Invalid DeviceInfo type ${type}`);
        }
        const medium = buffer.readUInt8(offset++);
        const status = buffer.readUInt8(offset++);
        const address = buffer.readUInt16BE(offset);
        offset += 2;
        const projectID = buffer.readUInt16BE(offset);
        offset += 2;
        const serialNumber = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < SERIALNUMBER_LENGTH; i++) {
            serialNumber[i] = buffer.readUInt8(offset++);
        }
        const ip = [];
        for (let i = 1; i <= 4; i++) {
            ip.push(buffer.readUInt8(offset++));
        }
        const textIP = ip.join('.');
        const macAddress = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < MACADDRESS_LENGTH; i++) {
            macAddress[i] = buffer.readUInt8(offset++);
        }
        let name = '';
        for (let i = 0; i < NAME_LENGTH; i++) {
            const char = buffer.readUInt8(offset++);
            if (char !== 0) {
                name += String.fromCharCode(char);
            }
            else {
                break;
            }
        }
        return new DeviceInfo(medium, status, address, projectID, serialNumber, textIP, macAddress, name);
    }
    setMediumFromString(medium) {
        switch (medium) {
            case 'TP1':
                this._medium = KNXConstants_1.KNX_CONSTANTS.TP1;
                break;
            case 'PL110':
                this._medium = KNXConstants_1.KNX_CONSTANTS.PL110;
                break;
            case 'RF':
                this._medium = KNXConstants_1.KNX_CONSTANTS.RF;
                break;
            case 'IP':
                this._medium = KNXConstants_1.KNX_CONSTANTS.IP;
                break;
            default:
                throw new Error(`Invalid medium ${medium}`);
        }
    }
    toBuffer() {
        const buffer = Buffer.alloc(DEVICE_INFO_LENGTH);
        let offset = 0;
        buffer.writeUInt8(this.length, offset++);
        buffer.writeUInt8(KNXConstants_1.KNX_CONSTANTS.DEVICE_INFO, offset++);
        buffer.writeUInt8(this.medium, offset++);
        buffer.writeUInt8(this.status, offset++);
        buffer.writeUInt16BE(this.address, offset);
        offset += 2;
        buffer.writeUInt16BE(this.projectID, offset);
        offset += 2;
        for (let i = 0; i < this.serialNumber.length; i++) {
            buffer.writeUInt8(this.serialNumber[i], offset++);
        }
        for (let i = 1; i <= KNXConstants_1.KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(Number(this._splitIP[i]), offset++);
        }
        for (let i = 0; i < this.macAddress.length; i++) {
            buffer.writeUInt8(this.macAddress[i], offset++);
        }
        for (let i = 0; i < NAME_LENGTH; i++) {
            buffer.writeUInt8(i >= this.name.length ? 0 : Number(this.name[i]), offset++);
        }
        return buffer;
    }
}
exports.DeviceInfo = DeviceInfo;
DeviceInfo.validArray = function (a, length) {
    if ((!Array.isArray(a)) || a.length !== length) {
        throw new Error('Invalid array format');
    }
    const validA = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < a.length; i++) {
        validA[i] = Number(a[i]);
        if (isNaN(validA[i]) || validA[i] < 0 || validA[i] > 255) {
            throw new Error(`Invalid byte at pos ${i}`);
        }
    }
    return validA;
};
//# sourceMappingURL=DeviceInfo.js.map