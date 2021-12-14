"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEMIMessage = void 0;
class CEMIMessage {
    constructor(msgCode, length, additionalInfo = null, control, srcAddress, dstAddress, npdu) {
        this.msgCode = msgCode;
        this.length = length;
        this.additionalInfo = additionalInfo;
        this.control = control;
        this.srcAddress = srcAddress;
        this.dstAddress = dstAddress;
        this.npdu = npdu;
    }
    toBuffer() {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt8(this.msgCode, 0);
        const len = this.additionalInfo == null ? 0 : this.additionalInfo.length;
        buffer.writeUInt8(len, 1);
        if (this.additionalInfo) {
            return Buffer.concat([buffer, this.additionalInfo.value]);
        }
        return buffer;
    }
    static GetLength(additionalInfo, control, srcAddress, dstAddress, npdu) {
        const length = additionalInfo == null ? 1 : additionalInfo.length;
        const npduLength = npdu == null ? 0 : npdu.length;
        return 1 + length + control.length + srcAddress.length + dstAddress.length + npduLength;
    }
}
exports.CEMIMessage = CEMIMessage;
//# sourceMappingURL=CEMIMessage.js.map