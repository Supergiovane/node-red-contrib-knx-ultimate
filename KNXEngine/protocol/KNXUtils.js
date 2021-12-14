"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateKNXAddress = exports.splitIP = void 0;
const splitIP = (ip, name = 'ip') => {
    if (ip == null) {
        throw new Error(`${name} undefined`);
    }
    const m = ip.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
    if (m === null) {
        throw new Error(`Invalid ${name} format - ${ip}`);
    }
    return m;
};
exports.splitIP = splitIP;
const validateKNXAddress = (address, isGroup = false) => {
    if (typeof (address) === 'string') {
        const digits = address.split(/[./]/);
        if (digits.length < 2 || digits.length > 3) {
            throw new Error(`Invalid address format: ${address}`);
        }
        let count = 0;
        let newAddress = 0;
        for (let i = digits.length - 1; i >= 0; i--, count++) {
            const digit = Number(digits[i]);
            if (isNaN(digit) || (count > 1 && digit > 15) || (count === 0 && digit > 255)) {
                throw new Error(`Invalid digit at pos ${i} inside address: ${address}`);
            }
            if (count === 0) {
                newAddress = digit;
            }
            else if (count === 1) {
                newAddress = newAddress + (digit << 8);
            }
            else {
                if (isGroup) {
                    newAddress = newAddress + (digit << 11);
                }
                else {
                    newAddress = newAddress + (digit << 12);
                }
            }
        }
        return newAddress;
    }
    else {
        const _address = Number(address);
        if (isNaN(_address) || _address < 0 || _address > 0xFFFF) {
            throw new Error(`Invalid address ${address}`);
        }
        return _address;
    }
};
exports.validateKNXAddress = validateKNXAddress;
//# sourceMappingURL=KNXUtils.js.map