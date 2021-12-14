'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LDataCon = void 0;
const CEMIMessage = require("./CEMIMessage");
const CEMIConstants = require("./CEMIConstants");
const KNXAddress = require("../KNXAddress");
const ControlField = require("./ControlField");
const NPDU = require("./NPDU");
const KNXDataBuffer = require("../KNXDataBuffer");
class LDataCon extends CEMIMessage.CEMIMessage {
    constructor(additionalInfo, control, srcAddress, dstAddress, npdu) {
        super(CEMIConstants.CEMIConstants.L_DATA_CON, CEMIMessage.CEMIMessage.GetLength(additionalInfo, control, srcAddress, dstAddress, npdu), additionalInfo, control, srcAddress, dstAddress, npdu);
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error('Buffer too short');
        }
        const addLength = buffer.readUInt8(offset++);
        let additionalInfo = null;
        if (addLength > 0) {
            additionalInfo = new KNXDataBuffer.KNXDataBuffer(buffer.slice(offset, addLength));
            offset += addLength;
        }
        const controlField = ControlField.ControlField.createFromBuffer(buffer, offset);
        offset += controlField.length;
        const srcAddress = KNXAddress.KNXAddress.createFromBuffer(buffer, offset);
        offset += srcAddress.length;
        const dstAddress = KNXAddress.KNXAddress.createFromBuffer(buffer, offset, controlField.addressType);
        offset += dstAddress.length;
        const npdu = NPDU.NPDU.createFromBuffer(buffer, offset);
        return new LDataCon(additionalInfo, controlField, srcAddress, dstAddress, npdu);
    }
    toBuffer() {
        const buffer = Buffer.alloc(1);
        const msgBuffer = [buffer];
        let offset = 0;
        buffer.writeUInt8(this.msgCode, offset++);
        if (this.additionalInfo == null) {
            buffer.writeUInt8(0, offset);
        }
        else {
            buffer.writeUInt8(this.additionalInfo.length, offset);
            msgBuffer.push(this.additionalInfo.value);
        }
        msgBuffer.push(this.control.toBuffer());
        msgBuffer.push(this.srcAddress.toBuffer());
        msgBuffer.push(this.dstAddress.toBuffer());
        msgBuffer.push(this.npdu.toBuffer());
        return Buffer.concat(msgBuffer);
    }
}
exports.LDataCon = LDataCon;
//# sourceMappingURL=LDataCon.js.map